"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Sparkles, Camera, CheckCircle2, Download, Share2 } from "lucide-react";
import { BodyMap, getRegionLabel } from "@/components/BodyMap";
import { KineticReportDisplay } from "@/components/KineticReportDisplay";
import { getGamification, saveGamification, type PatientId } from "@/lib/mock-data";
import { extractRom, avgLandmarkConfidence, type RomScores, type Landmark } from "@/lib/cv-engine";
import { generateKineticReport, formatReportDate, type AssessmentData, type KineticReport } from "@/lib/kinetic-analysis";

type Step = 1 | 2 | 3 | 4;

type AreaEntry = { regionId: string; discomfort: number; behavior: string; duration: string; notes: string; isPrimary: boolean };

type AssessmentState = {
  areas: AreaEntry[];
  dailyActivities: string[];
  sleepPosture: string;
  activitiesWorse: string[];
  activitiesBetter: string[];
  remarks: string;
  romNote: string;
  capturedRom: Record<string, RomScores>;
};

const ROM_EXERCISES = [
  { id: "squat",             label: "Squat",              cue: "Feet shoulder-width, squat as low as comfortable", joints: ["hip_l", "hip_r", "knee_l", "knee_r"] },
  { id: "forward_bend",      label: "Forward Bend",       cue: "Stand straight and bend forward as far as comfortable", joints: ["hip_l", "hip_r"] },
  { id: "shoulder_flexion",  label: "Shoulder Flexion",   cue: "Raise both arms forward and overhead as high as possible", joints: ["shoulder_l", "shoulder_r"] },
  { id: "overhead_reach",    label: "Overhead Reach",     cue: "Reach both arms directly overhead, palms facing inward", joints: ["shoulder_l", "shoulder_r"] },
  { id: "lunge",             label: "Lunge",              cue: "Step forward into a lunge position, hold still", joints: ["hip_l", "hip_r", "knee_l", "knee_r"] },
];

const BEHAVIORS = ["Always Present", "Comes and Goes", "Only with Certain Activities", "Varies Day to Day"];
const DURATIONS = ["Less than 6 Weeks", "6 Weeks to 3 Months", "3 to 6 Months", "6 Months to 1 Year", "More than 1 Year"];
const DAILY_ACTIVITIES = ["Office / Desk Work", "Standing Work", "Manual Work", "Sports / Training", "Yoga / Mobility", "Running / Cycling", "Prolonged Driving"];
const SLEEP_POSTURES = ["On Back", "On Stomach", "Left Side", "Right Side", "Change Positions"];
const FACTORS = ["Sitting", "Standing", "Walking", "Getting up from sitting", "Standing >30 min", "Sitting >30 min", "Stairs", "Bending backward", "Bending forward", "Heat", "Cold", "Stretching", "Standing and moving"];

const STEP_LABELS: Record<Step, string> = { 1: "Area of Focus", 2: "Range of Motion", 3: "Daily Activities", 4: "Final Remarks" };

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={active
        ? { background: "var(--color-hw-clay)", color: "#fff" }
        : { background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
      {label}
    </button>
  );
}

function StepBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-1 mb-5">
      {([1, 2, 3, 4] as Step[]).map((s) => (
        <div key={s} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={s < step ? { background: "var(--color-hw-clay)", color: "#fff" }
                : s === step ? { background: "var(--color-hw-black)", color: "#fff" }
                  : { background: "#fff", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
              {s < step ? <Check size={11} /> : s}
            </div>
            <span className="text-[9px] font-semibold leading-none" style={{ color: s === step ? "var(--color-hw-text)" : "var(--color-hw-text-muted)" }}>
              {STEP_LABELS[s]}
            </span>
          </div>
          {s < 4 && <div className="w-8 h-0.5 mb-4" style={{ background: s < step ? "var(--color-hw-clay)" : "var(--color-hw-border)" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Inline ROM camera component ────────────────────────────────────────────
type CamState = "idle" | "loading" | "active";

function Step2Rom({
  userId,
  capturedRom,
  romNote,
  onCapture,
  onRomNoteChange,
}: {
  userId: string;
  capturedRom: Record<string, RomScores>;
  romNote: string;
  onCapture: (exerciseId: string, rom: RomScores) => void;
  onRomNoteChange: (note: string) => void;
}) {
  const [camState, setCamState] = useState<CamState>("idle");
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [liveRom, setLiveRom] = useState<RomScores | null>(null);
  const [status, setStatus] = useState("Stand 6–8 feet from camera, full body visible");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plRef = useRef<unknown>(null);
  const animRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamState("idle");
    setConfidence(0);
    setLiveRom(null);
  }, []);

  useEffect(() => () => { cancelAnimationFrame(animRef.current); streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  async function startCamera(exerciseId: string) {
    setActiveExercise(exerciseId);
    setCamState("loading");
    setStatus("Requesting camera...");
    try {
      let stream: MediaStream;
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } } }); }
      catch { stream = await navigator.mediaDevices.getUserMedia({ video: true }); }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => videoRef.current?.play().catch(() => {});
        try { await videoRef.current.play(); } catch { /* noop */ }
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
      setCamState("active");
      setStatus("Step back until your full body is visible");
    } catch { setStatus("Camera access denied — please allow permissions and retry"); setCamState("idle"); }
  }

  useEffect(() => {
    if (camState !== "active" || !plRef.current) return;
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
        if (conf >= 0.65) { setLiveRom(extractRom(lms)); setStatus("Hold still and tap Capture"); }
        else setStatus("Step back — full body must be visible");
      } else { setConfidence(0); setLiveRom(null); }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [camState]);

  function capture() {
    if (!liveRom || confidence < 0.65 || !activeExercise) return;
    onCapture(activeExercise, liveRom);
    stopCamera();
  }

  const capturedCount = Object.keys(capturedRom).length;

  return (
    <div className="space-y-4">
      {/* Camera viewport — shown when active */}
      {camState !== "idle" && (
        <div className="rounded-2xl overflow-hidden space-y-3">
          <div className="relative" style={{ background: "#000", aspectRatio: "4/3", borderRadius: "16px", overflow: "hidden" }}>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute bottom-3 left-3 right-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="flex justify-between mb-1 text-xs">
                <span style={{ color: "var(--color-hw-text-muted)" }}>Detection confidence</span>
                <span className="font-bold" style={{ color: confidence >= 0.65 ? "var(--color-hw-green)" : "var(--color-hw-amber)" }}>{Math.round(confidence * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "var(--color-hw-cream)" }}>
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${confidence * 100}%`, background: confidence >= 0.65 ? "var(--color-hw-green)" : "#f59e0b" }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-center font-semibold" style={{ color: "var(--color-hw-text-muted)" }}>{status}</p>
          <div className="flex gap-3">
            <button onClick={stopCamera} className="px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
              Cancel
            </button>
            <button onClick={capture} disabled={!liveRom || confidence < 0.65}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
              style={{ background: "var(--color-hw-green)" }}>
              Capture Angles → +20 💎
            </button>
          </div>
        </div>
      )}

      {/* Hidden refs needed even when viewport not shown */}
      {camState === "idle" && <div className="hidden"><video ref={videoRef} /><canvas ref={canvasRef} /></div>}

      {/* Exercise list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--color-hw-border)" }}>
          <p className="font-semibold text-sm" style={{ color: "var(--color-hw-text)" }}>Range of Motion Baseline</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>
            Capture your starting angles for each movement. {capturedCount > 0 ? `${capturedCount} of ${ROM_EXERCISES.length} captured.` : "All optional but recommended."}
          </p>
        </div>
        {ROM_EXERCISES.map((ex) => {
          const captured = !!capturedRom[ex.id];
          const isActive = activeExercise === ex.id && camState !== "idle";
          return (
            <div key={ex.id} className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0"
              style={{ borderColor: "var(--color-hw-border)", background: isActive ? "var(--color-hw-clay)08" : undefined }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: captured ? "#00bb7f18" : "var(--color-hw-cream)" }}>
                {captured
                  ? <CheckCircle2 size={18} style={{ color: "var(--color-hw-green)" }} />
                  : <Camera size={15} style={{ color: "var(--color-hw-text-muted)" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>{ex.label}</p>
                <p className="text-xs truncate" style={{ color: "var(--color-hw-text-muted)" }}>{ex.cue}</p>
                {captured && (
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--color-hw-green)" }}>
                    {ex.joints.map((j) => `${j.replace("_", " ")}: ${capturedRom[ex.id]?.[j as keyof RomScores] ?? "—"}°`).join(" · ")}
                  </p>
                )}
              </div>
              {!captured && camState === "idle" && (
                <button onClick={() => startCamera(ex.id)}
                  className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--color-hw-clay)", color: "#fff" }}>
                  Start
                </button>
              )}
              {captured && (
                <button onClick={() => startCamera(ex.id)}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
                  Redo
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Movement notes */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Any movement notes?</p>
        <textarea rows={3} value={romNote} onChange={(e) => onRomNoteChange(e.target.value)}
          placeholder={`e.g. "Can't fully extend left knee" or "shoulder clicks on overhead reach"`}
          className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
          style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }} />
      </div>

      {capturedCount > 0 && (
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#00bb7f10", border: "1px solid #00bb7f30" }}>
          <CheckCircle2 size={18} style={{ color: "var(--color-hw-green)" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>
            {capturedCount} movement{capturedCount > 1 ? "s" : ""} captured — your practitioner now has your baseline angles.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PatientAssessment() {
  const router = useRouter();
  const [userId, setUserId] = useState<PatientId>("maria");
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<AssessmentState>({
    areas: [], dailyActivities: [], sleepPosture: "", activitiesWorse: [], activitiesBetter: [], remarks: "", romNote: "", capturedRom: {},
  });
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [report, setReport] = useState<KineticReport | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("riq_userId") as PatientId;
    if (id) setUserId(id);
    if (localStorage.getItem(`assessment_${id}`)) router.push("/patient");
  }, [router]);

  function toggleRegion(id: string) {
    setState((prev) => {
      const exists = prev.areas.find((a) => a.regionId === id);
      if (exists) { setActiveRegion(prev.areas.filter((a) => a.regionId !== id)[0]?.regionId ?? null); return { ...prev, areas: prev.areas.filter((a) => a.regionId !== id) }; }
      const entry: AreaEntry = { regionId: id, discomfort: 5, behavior: "", duration: "", notes: "", isPrimary: prev.areas.length === 0 };
      setActiveRegion(id);
      return { ...prev, areas: [...prev.areas, entry] };
    });
  }

  function updateArea(id: string, patch: Partial<AreaEntry>) {
    setState((prev) => ({ ...prev, areas: prev.areas.map((a) => a.regionId === id ? { ...a, ...patch } : a) }));
  }

  function handleRomCapture(exerciseId: string, rom: RomScores) {
    setState((p) => ({ ...p, capturedRom: { ...p.capturedRom, [exerciseId]: rom } }));
    // save baseline snapshot immediately so practitioner sees it
    const existing = JSON.parse(localStorage.getItem(`rom_baseline_${userId}`) ?? "{}");
    localStorage.setItem(`rom_baseline_${userId}`, JSON.stringify({ ...existing, [exerciseId]: rom }));
  }

  function submit() {
    const data: AssessmentData = { ...state, submittedAt: new Date().toISOString() };
    localStorage.setItem(`assessment_${userId}`, JSON.stringify(data));
    const capturedCount = Object.keys(state.capturedRom).length;
    const romBonus = capturedCount * 20;
    const gam = getGamification(userId);
    saveGamification(userId, { ...gam, gems: gam.gems + 150 + romBonus, points: gam.points + 150 + romBonus });
    
    // Generate and save kinetic report
    const kineticReport = generateKineticReport(data);
    localStorage.setItem(`kinetic_report_${userId}`, JSON.stringify(kineticReport));
    
    setReport(kineticReport);
    setSubmitted(true);
  }

  const activeArea = state.areas.find((a) => a.regionId === activeRegion);

  if (submitted && report) {
    return (
      <div className="py-8 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="text-5xl">✅</div>
          <p className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Assessment Submitted!</p>
          <p className="text-sm" style={{ color: "var(--color-hw-text-muted)" }}>
            Earned <strong style={{ color: "#a855f7" }}>+{150 + Object.keys(state.capturedRom).length * 20} 💎</strong>
            {Object.keys(state.capturedRom).length > 0 && <span className="text-xs"> (includes {Object.keys(state.capturedRom).length} ROM captures)</span>}
          </p>
        </div>

        {/* Kinetic Analysis Report with full visualization */}
        <KineticReportDisplay report={report} patientName="Your" showActions={true} />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={() => router.push("/patient")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
            Back to Dashboard
          </button>
          <button onClick={() => router.push("/patient/leaderboard")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-hw-clay)" }}>
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }
        </p>
        <div className="rounded-2xl p-5 text-left space-y-2" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Your pet thanks you</p>
          <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>Keep checking in daily to earn more gems and keep your pet happy while you wait for your visit!</p>
        </div>
        <button onClick={() => router.push("/patient")} className="w-full py-3.5 rounded-xl font-bold text-white" style={{ background: "var(--color-hw-clay)" }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-hw-clay)" }}>Pre-Visit Assessment</p>
        <h1 className="text-xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>{STEP_LABELS[step]}</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Help your practitioner understand your condition before your visit.</p>
      </div>

      <StepBar step={step} />

      {/* Step 1: Body map */}
      {step === 1 && (
        <div className="space-y-4">
          <BodyMap selected={state.areas.map((a) => a.regionId)} onToggle={toggleRegion} size={260} />
          {state.areas.length === 0 && (
            <p className="text-xs text-center" style={{ color: "var(--color-hw-text-faint)" }}>Tap the body map to select where you feel discomfort</p>
          )}
          {state.areas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {state.areas.map((a) => (
                <button key={a.regionId} onClick={() => setActiveRegion(a.regionId)}
                  className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={a.regionId === activeRegion ? { background: "var(--color-hw-clay)", color: "#fff" } : { background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
                  {a.isPrimary ? "★ " : ""}{getRegionLabel(a.regionId)}
                </button>
              ))}
            </div>
          )}

          {activeArea && (
            <div className="rounded-2xl p-4 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{getRegionLabel(activeArea.regionId)}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
                  Discomfort: <span style={{ color: "var(--color-hw-clay)" }}>{activeArea.discomfort}/9</span>
                </p>
                <input type="range" min={1} max={9} value={activeArea.discomfort}
                  onChange={(e) => updateArea(activeArea.regionId, { discomfort: Number(e.target.value) })}
                  className="w-full" style={{ accentColor: "var(--color-hw-clay)" }} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Behavior</p>
                <div className="flex flex-wrap gap-2">
                  {BEHAVIORS.map((b) => <Chip key={b} label={b} active={activeArea.behavior === b} onClick={() => updateArea(activeArea.regionId, { behavior: b })} />)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Duration</p>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => <Chip key={d} label={d} active={activeArea.duration === d} onClick={() => updateArea(activeArea.regionId, { duration: d })} />)}
                </div>
              </div>
              <textarea rows={2} value={activeArea.notes}
                onChange={(e) => updateArea(activeArea.regionId, { notes: e.target.value })}
                placeholder="Any additional notes..."
                className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }} />
            </div>
          )}
        </div>
      )}

      {/* Step 2: Inline ROM camera capture */}
      {step === 2 && (
        <Step2Rom
          userId={userId}
          capturedRom={state.capturedRom}
          romNote={state.romNote}
          onCapture={handleRomCapture}
          onRomNoteChange={(note) => setState((p) => ({ ...p, romNote: note }))}
        />
      )}

      {/* Step 3: Daily Activities */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>Daily Activities</p>
            <div className="flex flex-wrap gap-2">
              {DAILY_ACTIVITIES.map((a) => (
                <Chip key={a} label={a}
                  active={state.dailyActivities.includes(a)}
                  onClick={() => setState((p) => ({ ...p, dailyActivities: p.dailyActivities.includes(a) ? p.dailyActivities.filter((x) => x !== a) : [...p.dailyActivities, a] }))} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>Sleep Posture</p>
            <div className="flex flex-wrap gap-2">
              {SLEEP_POSTURES.map((s) => <Chip key={s} label={s} active={state.sleepPosture === s} onClick={() => setState((p) => ({ ...p, sleepPosture: s }))} />)}
            </div>
          </div>
          <div className="rounded-2xl p-4 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>What makes your discomfort WORSE?</p>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => <Chip key={f} label={f} active={state.activitiesWorse.includes(f)} onClick={() => setState((p) => ({ ...p, activitiesWorse: p.activitiesWorse.includes(f) ? p.activitiesWorse.filter((x) => x !== f) : [...p.activitiesWorse, f] }))} />)}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>What makes it BETTER?</p>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => <Chip key={f} label={f} active={state.activitiesBetter.includes(f)} onClick={() => setState((p) => ({ ...p, activitiesBetter: p.activitiesBetter.includes(f) ? p.activitiesBetter.filter((x) => x !== f) : [...p.activitiesBetter, f] }))} />)}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Remarks */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>Any other remarks?</p>
            <textarea rows={5} value={state.remarks}
              onChange={(e) => setState((p) => ({ ...p, remarks: e.target.value }))}
              placeholder="Anything else you'd like your practitioner to know before your visit..."
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }} />
          </div>
          <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-clay)15", border: "1px solid var(--color-hw-clay)40" }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} style={{ color: "var(--color-hw-clay)" }} />
              <p className="text-xs font-bold" style={{ color: "var(--color-hw-text)" }}>Reward</p>
            </div>
            <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
              Submitting earns your pet <strong style={{ color: "#a855f7" }}>+150 💎</strong> and unlocks your practitioner&apos;s review!
            </p>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : router.push("/patient")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
          <ChevronLeft size={14} />
          Back
        </button>
        {step < 4 ? (
          <button onClick={() => setStep((s) => (s + 1) as Step)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-hw-clay)" }}>
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={submit}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-hw-clay)" }}>
            Submit Assessment → +150 💎
          </button>
        )}
      </div>
    </div>
  );
}
