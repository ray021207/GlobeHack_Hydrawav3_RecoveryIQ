"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check } from "lucide-react";
import {
  analyzePostureFromLandmarks,
  comparePostureMetrics,
  getPostureStatusEmoji,
  getPostureStatusText,
  shouldPerformPostureCheck,
  savePostureCheckDate,
  type PostureMetrics,
  type PostureLog,
} from "@/lib/posture-tracking";

export default function PostureCheckPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [isReady, setIsReady] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PostureMetrics | null>(null);
  const [postureLog, setPostureLog] = useState<PostureLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [captureTimer, setCaptureTimer] = useState<number | null>(null);
  const [timerMode, setTimerMode] = useState<"5" | "10" | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = localStorage.getItem("riq_userId") as string;
    setUserId(id);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (captureTimer === null) return;

    if (captureTimer === 0) {
      // Timer finished, start analysis
      if (timerRef.current) clearInterval(timerRef.current);
      setCaptureTimer(null);
      setTimerMode(null);
      setLoading(true);
      return;
    }

    timerRef.current = setInterval(() => {
      setCaptureTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [captureTimer]);

  const handleStartCaptureTimer = (seconds: "5" | "10") => {
    setCaptureTimer(parseInt(seconds));
    setTimerMode(seconds);
  };

  useEffect(() => {
    if (!isReady || !videoRef.current) return;

    // Simulate posture analysis (in production, this would use MediaPipe)
    const timer = setTimeout(() => {
      // Generate mock metrics for demo
      const metrics: PostureMetrics = {
        headPosition: Math.random() * 100,
        shoulderAlignment: Math.random() * 100,
        spinalAlignment: Math.random() * 100,
        pelvisAlignment: Math.random() * 100,
        overallScore: 0,
        timestamp: new Date().toISOString(),
      };
      metrics.overallScore = (metrics.headPosition + metrics.shoulderAlignment + metrics.spinalAlignment + metrics.pelvisAlignment) / 4;

      setCurrentMetrics(metrics);

      // Compare with baseline or previous
      const baselineKey = `posture_baseline_${userId}`;
      const baseline = localStorage.getItem(baselineKey);

      if (baseline) {
        const baselineData = JSON.parse(baseline);
        const log = comparePostureMetrics(metrics, baselineData);
        setPostureLog(log);
      } else {
        // First check - set as baseline
        localStorage.setItem(baselineKey, JSON.stringify(metrics));
        setPostureLog({
          date: new Date().toISOString().split("T")[0],
          metrics,
          recommendations: [
            "✅ Baseline posture recorded!",
            "Perfect form to compare future checks against.",
            "Check again in 2 days to track improvements.",
          ],
        });
      }

      savePostureCheckDate();
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isReady, userId]);

  const handleStartCamera = async () => {
    setLoading(true);
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsReady(true);
      }
    } catch (err) {
      setCameraError("Unable to access camera. Please check permissions.");
      setLoading(false);
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsReady(false);
    setCurrentMetrics(null);
    setPostureLog(null);
  };

  const handleSaveAndContinue = () => {
    // Save log to localStorage
    if (currentMetrics && postureLog) {
      const logsKey = `posture_logs_${userId}`;
      const existing = localStorage.getItem(logsKey);
      const logs = existing ? JSON.parse(existing) : [];
      logs.push(postureLog);
      localStorage.setItem(logsKey, JSON.stringify(logs));
    }
    router.push("/patient/recovery-plan");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>
          📹 Posture Check-In
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
          Record your posture with your device camera. We'll analyze your alignment and compare to your baseline.
        </p>
      </div>

      {/* Instructions */}
      {!isReady && !currentMetrics && (
        <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-hw-text)" }}>
            📋 Setup Instructions:
          </p>
          <ol className="space-y-2 text-sm pl-5 list-decimal" style={{ color: "var(--color-hw-text)" }}>
            <li>Stand 6-8 feet from your device</li>
            <li>Ensure your full body is visible in frame</li>
            <li>Wear fitted clothing (loose clothing affects detection)</li>
            <li>Stand naturally - don't force posture</li>
            <li>Good lighting is important</li>
          </ol>
        </div>
      )}

      {/* Camera View */}
      {isReady ? (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--color-hw-border)" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full bg-black"
            style={{ aspectRatio: "4/3" }}
          />
        </div>
      ) : (
        <div
          className="rounded-2xl flex items-center justify-center"
          style={{ aspectRatio: "4/3", background: "var(--color-hw-cream)", border: "2px dashed var(--color-hw-border)" }}
        >
          <div className="text-center">
            <Camera size={48} style={{ color: "var(--color-hw-clay)", margin: "0 auto 8px" }} />
            <p style={{ color: "var(--color-hw-text-muted)" }}>Camera not started</p>
          </div>
        </div>
      )}

      {/* Status */}
      {loading && (
        <div className="rounded-2xl p-4 text-center" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>
            Analyzing posture...
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
            Processing landmarks and calculating alignment metrics
          </p>
        </div>
      )}

      {/* Results */}
      {currentMetrics && postureLog && (
        <div className="space-y-4">
          {/* Posture Score */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{getPostureStatusEmoji(currentMetrics.overallScore)}</span>
              <div>
                <p className="text-3xl font-bold" style={{ color: "var(--color-hw-clay)" }}>
                  {Math.round(currentMetrics.overallScore)}/100
                </p>
                <p className="text-sm" style={{ color: "var(--color-hw-text-muted)" }}>
                  {getPostureStatusText(currentMetrics.overallScore)}
                </p>
              </div>
            </div>

            {/* Detail Scores */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--color-hw-text)" }}>Head Position</span>
                <span style={{ color: "var(--color-hw-clay)", fontWeight: "bold" }}>
                  {Math.round(currentMetrics.headPosition)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-hw-text)" }}>Shoulder Alignment</span>
                <span style={{ color: "var(--color-hw-clay)", fontWeight: "bold" }}>
                  {Math.round(currentMetrics.shoulderAlignment)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-hw-text)" }}>Spinal Alignment</span>
                <span style={{ color: "var(--color-hw-clay)", fontWeight: "bold" }}>
                  {Math.round(currentMetrics.spinalAlignment)}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-hw-text)" }}>Pelvis Alignment</span>
                <span style={{ color: "var(--color-hw-clay)", fontWeight: "bold" }}>
                  {Math.round(currentMetrics.pelvisAlignment)}/100
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {postureLog.recommendations.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-hw-text)" }}>
                💡 Recommendations:
              </p>
              <ul className="space-y-2">
                {postureLog.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-hw-text)" }}>
                    <span style={{ color: "var(--color-hw-clay)" }}>•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress */}
          {postureLog.comparisonToPrevious && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: postureLog.comparisonToPrevious.changePercent > 0 ? "#10b98120" : "#ef444420",
                border: postureLog.comparisonToPrevious.changePercent > 0 ? "1px solid #10b98140" : "1px solid #ef444440",
              }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-hw-text)" }}>
                📈 Comparison to Previous:
              </p>
              <p
                className="text-lg font-bold mb-2"
                style={{ color: postureLog.comparisonToPrevious.changePercent > 0 ? "#059669" : "#dc2626" }}
              >
                {postureLog.comparisonToPrevious.changePercent > 0 ? "+" : ""}{postureLog.comparisonToPrevious.changePercent}%{" "}
                {postureLog.comparisonToPrevious.changePercent > 0 ? "Improvement" : "Change"}
              </p>
              {postureLog.comparisonToPrevious.areas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {postureLog.comparisonToPrevious.areas.map((area) => (
                    <span key={area} className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }}>
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isReady && !currentMetrics && (
          <button
            onClick={handleStartCamera}
            disabled={loading}
            className="flex-1 py-3 rounded-lg font-semibold text-white transition-opacity"
            style={{ background: "var(--color-hw-clay)", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Initializing..." : "Start Camera"}
          </button>
        )}

        {isReady && !currentMetrics && (
          <>
            {/* Timer Display */}
            {captureTimer !== null && (
              <div
                className="rounded-2xl p-8 text-center mb-4"
                style={{
                  background: "linear-gradient(135deg, var(--color-hw-clay) 0%, #d97706 100%)",
                  border: "3px solid var(--color-hw-clay)",
                }}
              >
                <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Recording in</p>
                <p className="text-white text-7xl font-bold font-display">{captureTimer}</p>
                <p className="text-white text-sm mt-3 opacity-90">Stay still and in frame</p>
              </div>
            )}

            {/* Timer Options */}
            {captureTimer === null && (
              <>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-hw-text)" }}>
                  📸 Choose capture duration:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleStartCaptureTimer("5")}
                    className="py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
                    style={{ background: "var(--color-hw-clay)" }}
                  >
                    5 Second
                  </button>
                  <button
                    onClick={() => handleStartCaptureTimer("10")}
                    className="py-3 rounded-lg font-semibold text-white transition-transform hover:scale-105"
                    style={{ background: "var(--color-hw-navy)" }}
                  >
                    10 Second
                  </button>
                </div>
              </>
            )}

            <button
              onClick={handleStopCamera}
              className="flex-1 py-3 rounded-lg font-semibold"
              style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}
            >
              Cancel
            </button>
          </>
        )}

        {currentMetrics && (
          <>
            <button
              onClick={handleStopCamera}
              className="flex-1 py-3 rounded-lg font-semibold"
              style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}
            >
              Retake
            </button>
            <button
              onClick={handleSaveAndContinue}
              className="flex-1 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: "var(--color-hw-clay)" }}
            >
              <Check size={16} />
              Save & Continue
            </button>
          </>
        )}
      </div>

      {cameraError && (
        <div className="rounded-2xl p-4" style={{ background: "#fee2e2", border: "1px solid #ef444440" }}>
          <p style={{ color: "#dc2626" }}>{cameraError}</p>
        </div>
      )}
    </div>
  );
}
