"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { PATIENTS, saveScan, type PatientId, type CvScan } from "@/lib/mock-data";
import { addPoints, checkAndAwardBadges, BADGES } from "@/lib/gamification";
import { extractRom, computeSymmetry, computeCompensation, avgLandmarkConfidence, formatRomDelta, type RomScores, type Landmark } from "@/lib/cv-engine";

type Phase = "consent" | "movement-select" | "scanning" | "complete";

const TIMER_OPTIONS = [3, 5, 10] as const;
type TimerOption = (typeof TIMER_OPTIONS)[number];

// Recovery tracking exercises
const RECOVERY_EXERCISES = [
  { id: "squat",             label: "Squat",              cue: "Feet shoulder-width, squat as low as comfortable", joints: ["hip_l", "hip_r", "knee_l", "knee_r"] },
  { id: "forward_bend",      label: "Forward Bend",       cue: "Stand straight and bend forward as far as comfortable", joints: ["hip_l", "hip_r"] },
  { id: "shoulder_flexion",  label: "Shoulder Flexion",   cue: "Raise both arms forward and overhead as high as possible", joints: ["shoulder_l", "shoulder_r"] },
  { id: "overhead_reach",    label: "Overhead Reach",     cue: "Reach both arms directly overhead, palms facing inward", joints: ["shoulder_l", "shoulder_r"] },
  { id: "lunge",             label: "Lunge",              cue: "Step forward into a lunge position, hold still", joints: ["hip_l", "hip_r", "knee_l", "knee_r"] },
];

export default function ScanPage() {
  const [userId, setUserId] = useState<PatientId>("maria");
  const [phase, setPhase] = useState<Phase>("consent");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState("Position yourself 6 feet from camera");
  const [romScores, setRomScores] = useState<RomScores | null>(null);
  const [deltas, setDeltas] = useState<Partial<Record<keyof RomScores, number>> | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [landmarks, setLandmarks] = useState<Landmark[] | null>(null);
  const [timerDuration, setTimerDuration] = useState<TimerOption>(5);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captureTimer, setCaptureTimer] = useState<number | null>(null);
  const [timerMode, setTimerMode] = useState<"5" | "10" | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plRef = useRef<unknown>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const id = (localStorage.getItem("riq_userId") || "maria") as PatientId;
    setUserId(id);
  }, []);

  const initCamera = useCallback(async () => {
    setStatus("Requesting camera...");
    try {
      let stream: MediaStream;
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } } }); }
      catch { stream = await navigator.mediaDevices.getUserMedia({ video: true }); }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(() => {});
        try { await videoRef.current.play(); } catch { /* handled by onloadedmetadata */ }
      }
      setStatus("Loading movement model...");
      if (!plRef.current) {
        const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
        for (const delegate of ["GPU", "CPU"] as const) {
          try {
            plRef.current = await PoseLandmarker.createFromOptions(vision, {
              baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task", delegate },
              runningMode: "VIDEO", numPoses: 1,
            });
            break;
          } catch { /* try next */ }
        }
      }
      setStatus("Step back until your full body is visible");
    } catch { setStatus("Camera access denied — please allow permissions and retry"); }
  }, []);

  async function initMediaPipe() {
    setStatus("Loading pose detection model...");
    try {
      const { PoseLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      let modelLoaded = false;
      for (const delegate of ["GPU", "CPU"] as const) {
        try {
          plRef.current = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate,
            },
            runningMode: "VIDEO",
            numPoses: 1,
          });
          modelLoaded = true;
          console.log(`PoseLandmarker loaded with ${delegate}`);
          break;
        } catch (e) {
          console.log(`Failed to load with ${delegate}, trying next...`);
        }
      }
      if (modelLoaded) {
        setStatus("Position yourself 6–8 feet from camera, full body visible");
      } else {
        setStatus("Failed to load pose model. Please refresh the page.");
      }
    } catch (error) {
      console.error("MediaPipe initialization error:", error);
      setStatus("Camera/model loading error. Please refresh and try again.");
    }
  }

  useEffect(() => {
    if (phase !== "scanning" || !plRef.current) return;
    const pl = plRef.current as { detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: Landmark[][] } };
    const draw = () => {
      const video = videoRef.current; const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) { animRef.current = requestAnimationFrame(draw); return; }
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      const result = pl.detectForVideo(video, performance.now());
      if (result.landmarks?.[0]) {
        const lms = result.landmarks[0];
        const conf = avgLandmarkConfidence(lms);
        setConfidence(conf);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const CONNECTIONS = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[24,26],[25,27],[26,28]];
        ctx.strokeStyle = conf >= 0.65 ? "#2dd4bf" : "#f59e0b"; ctx.lineWidth = 2;
        for (const [a, b] of CONNECTIONS) {
          const la = lms[a], lb = lms[b]; if (!la || !lb) continue;
          ctx.beginPath(); ctx.moveTo(la.x * canvas.width, la.y * canvas.height);
          ctx.lineTo(lb.x * canvas.width, lb.y * canvas.height); ctx.stroke();
        }
        for (const lm of lms.slice(11, 29)) {
          ctx.fillStyle = (lm.visibility ?? 1) >= 0.65 ? "#22c55e" : "#ef4444";
          ctx.beginPath(); ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI); ctx.fill();
        }
        if (conf >= 0.65) { setRomScores(extractRom(lms)); setStatus("✓ Body detected — Ready to capture"); }
        else setStatus("Step back — full body must be visible");
      } else {
        setConfidence(0);
        setStatus("No body detected — stand 6–8 feet from camera");
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  // Capture timer countdown effect
  useEffect(() => {
    if (captureTimer === null || captureTimer <= 0) return;

    const timer = setInterval(() => {
      setCaptureTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, [captureTimer]);

  // Auto-capture when timer reaches zero
  useEffect(() => {
    if (captureTimer === 0) {
      setCaptureTimer(null);
      setTimerMode(null);
      captureResults();
    }
  }, [captureTimer]);

  function startScan() {
    setPhase("movement-select");
  }

  function selectMovementAndStartCamera(exerciseId: string) {
    setSelectedExercise(exerciseId);
    setPhase("scanning");
    setStatus("Loading camera and pose detection...");
    initCamera();
  }

  function startCaptureTimer(seconds: 5 | 10) {
    if (!romScores || confidence < 0.65) {
      setStatus("Position not clear — ensure full body is visible");
      return;
    }
    setCaptureTimer(seconds);
    setTimerMode(seconds === 5 ? "5" : "10");
  }

  function captureResults() {
    if (!romScores || confidence < 0.65) {
      setStatus("Position not clear — ensure full body is visible");
      return;
    }
    const sym = computeSymmetry(romScores);
    const comp = computeCompensation(romScores, sym);
    const p = PATIENTS[userId];

    const scan: CvScan = {
      id: `s_${Date.now()}`,
      type: "home",
      timestamp: new Date().toISOString(),
      rom: romScores,
      symmetry_score: sym,
      compensation_index: comp,
      baseline_tier: 1,
      confidence,
    };
    saveScan(userId, scan);
    addPoints(userId, 100);
    const badges = checkAndAwardBadges(userId);
    setNewBadges(badges);

    // Compute deltas vs prior scan
    const { getScans } = require("@/lib/mock-data");
    const priorScans = getScans(userId);
    const prior = priorScans.length >= 2 ? priorScans[priorScans.length - 2] : null;
    if (prior) {
      const d: Partial<Record<keyof RomScores, number>> = {};
      for (const j of Object.keys(romScores) as (keyof RomScores)[]) {
        d[j] = romScores[j] - (prior.rom[j] ?? romScores[j]);
      }
      setDeltas(d);
    }
    cancelAnimationFrame(animRef.current);
    setPhase("complete");
  }

  return (
    <div className="px-5 py-5 max-w-lg mx-auto">
      {phase === "consent" && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>Movement Scan</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-muted)" }}>Track your recovery progress · +100 pts</p>
          </div>
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
            <p className="font-semibold" style={{ color: "var(--color-hw-navy)" }}>Camera Access</p>
            <p className="text-sm" style={{ color: "var(--color-hw-muted)" }}>This scan uses your camera to capture movement insights on-device. No video is uploaded — only joint angles are saved.</p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--color-hw-navy)" }}>
              {["Stand 6–8 feet from camera", "Full body must be visible", "All processing on this device", "Takes about 60 seconds"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs text-white" style={{ background: "var(--color-hw-green)" }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <button onClick={startScan} className="w-full py-3.5 rounded-xl font-bold text-white" style={{ background: "var(--color-hw-sidebar)" }}>
              Start Movement Scan
            </button>
          </div>
        </div>
      )}

      {phase === "movement-select" && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>Choose Movement</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-muted)" }}>Select which recovery movement to track</p>
          </div>
          <div className="space-y-3">
            {RECOVERY_EXERCISES.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => selectMovementAndStartCamera(exercise.id)}
                className="w-full rounded-2xl p-4 text-left transition-all hover:shadow-md"
                style={{
                  background: "var(--color-hw-card)",
                  border: "1px solid var(--color-hw-border)",
                }}
              >
                <p className="font-semibold mb-1" style={{ color: "var(--color-hw-navy)" }}>
                  {exercise.label}
                </p>
                <p className="text-sm" style={{ color: "var(--color-hw-muted)" }}>
                  {exercise.cue}
                </p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setPhase("consent")}
            className="w-full py-2.5 rounded-xl font-semibold"
            style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }}
          >
            Back
          </button>
        </div>
      )}

      {phase === "scanning" && (
        <div className="space-y-4">
          {/* Movement Instructions */}
          {selectedExercise && (
            <div
              className="rounded-2xl p-4 text-center border-l-4"
              style={{
                background: "linear-gradient(135deg, var(--color-hw-clay)10 0%, #d9770620 100%)",
                borderColor: "var(--color-hw-clay)",
              }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Movement to Track
              </p>
              <p className="text-lg font-bold mb-2" style={{ color: "var(--color-hw-clay)" }}>
                {RECOVERY_EXERCISES.find((e) => e.id === selectedExercise)?.label}
              </p>
              <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                {RECOVERY_EXERCISES.find((e) => e.id === selectedExercise)?.cue}
              </p>
            </div>
          )}

          <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>Movement Scan</h1>

          <div className="relative rounded-2xl overflow-hidden" style={{ background: "#000", aspectRatio: "4/3" }}>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* Capture Timer Overlay */}
            {captureTimer !== null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--color-hw-clay) 0%, #d97706 100%)" }}>
                <p className="text-sm font-semibold mb-4" style={{ color: "#fff" }}>Capturing in</p>
                <div style={{ fontSize: "7rem", fontWeight: "bold", lineHeight: "1", color: "#fff", marginBottom: "20px" }}>
                  {captureTimer}
                </div>
                <p className="text-sm" style={{ color: "#fff" }}>Hold pose still and stay in frame</p>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3">
              <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.95)" }}>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span style={{ color: "var(--color-hw-muted)" }}>Body detection</span>
                  <span style={{ color: confidence >= 0.65 ? "var(--color-hw-green)" : "var(--color-hw-amber)" }} className="font-bold">{Math.round(confidence * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--color-hw-cream)" }}>
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${confidence * 100}%`, background: confidence >= 0.65 ? "var(--color-hw-green)" : "var(--color-hw-amber)" }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-center" style={{ color: "var(--color-hw-muted)" }}>
            {confidence < 0.65 && status === "Step back so your full body is visible" ? "📸 Step back — full body must be visible" : status}
          </p>

          {/* Timer selector + capture button */}
          {romScores && confidence >= 0.65 && captureTimer === null && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => startCaptureTimer(5)} disabled={!romScores || confidence < 0.65}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                  style={{ background: "var(--color-hw-green)" }}>
                  5 Sec
                </button>
                <button onClick={() => startCaptureTimer(10)} disabled={!romScores || confidence < 0.65}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                  style={{ background: "var(--color-hw-green)" }}>
                  10 Sec
                </button>
              </div>
              <p className="text-xs text-center" style={{ color: "var(--color-hw-muted)" }}>Click timer to auto-capture · +100 pts</p>
            </div>
          )}
        </div>
      )}

      {phase === "complete" && romScores && (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>Movement Insights</h1>
            {selectedExercise && (
              <p className="text-sm mt-1" style={{ color: "var(--color-hw-clay)" }}>
                {RECOVERY_EXERCISES.find((e) => e.id === selectedExercise)?.label}
              </p>
            )}
            <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-gold)" }}>+100 pts earned!</p>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-sidebar)", border: "none" }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Symmetry</p>
                <p className="text-2xl font-bold text-white">{`${Math.round((1 - computeSymmetry(romScores) / 100) * 100)}%`}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>bilateral balance</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Compensation</p>
                <p className="text-2xl font-bold text-white">{computeCompensation(romScores, computeSymmetry(romScores))}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>index (lower = better)</p>
              </div>
            </div>
          </div>

          {deltas && Object.entries(deltas).some(([, d]) => d !== 0) && (
            <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-hw-muted)" }}>vs Your Last Scan</p>
              <div className="space-y-2">
                {(Object.entries(deltas) as [keyof RomScores, number][]).map(([joint, d]) => (
                  <p key={joint} className="text-sm" style={{ color: d > 0 ? "var(--color-hw-green)" : d < 0 ? "var(--color-hw-amber)" : "var(--color-hw-muted)" }}>
                    {d > 0 ? "↑" : d < 0 ? "↓" : "→"} {formatRomDelta(joint, d)}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-hw-muted)" }}>Joint ROM Captured</p>
            {Object.entries(romScores).map(([j, v]) => (
              <div key={j} className="flex justify-between py-1.5 border-b text-sm" style={{ borderColor: "var(--color-hw-border)" }}>
                <span className="capitalize" style={{ color: "var(--color-hw-muted)" }}>{j.replace("_", " ")}</span>
                <span className="font-semibold" style={{ color: "var(--color-hw-navy)" }}>{v}°</span>
              </div>
            ))}
          </div>

          {newBadges.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
              <p className="font-bold text-sm mb-2" style={{ color: "var(--color-hw-navy)" }}>Badge{newBadges.length > 1 ? "s" : ""} unlocked! 🎉</p>
              {newBadges.map((b) => { const badge = BADGES[b]; return badge ? <p key={b} className="text-sm">{badge.icon} {badge.label}</p> : null; })}
            </div>
          )}

          <button onClick={() => { setPhase("movement-select"); setRomScores(null); setDeltas(null); setConfidence(0); }} className="w-full py-3 rounded-xl font-semibold" style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }}>
            Scan Another Movement
          </button>
        </div>
      )}
    </div>
  );
}
