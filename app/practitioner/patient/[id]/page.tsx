"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PATIENTS, getCheckins, getScans, getGamification, getRecoveryScore, getVisitRecommendation, type PatientId } from "@/lib/mock-data";
import { RecoveryScore } from "@/components/RecoveryScore";
import { KineticReportDisplay } from "@/components/KineticReportDisplay";
import { sendDeviceCommand, PROTOCOLS, MAC } from "@/lib/hydrawav";
import type { KineticReport } from "@/lib/kinetic-analysis";

type Tab = "overview" | "cv" | "lifestyle" | "device" | "assessment";

const LIFESTYLE_SECTIONS = ["Nutrition", "Sleep", "Stress", "Hydration", "Movement Snacks", "Breathwork"];

export default function PatientDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const patientId = id as PatientId;
  const [tab, setTab] = useState<Tab>("overview");
  const [, forceRender] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState<"idle" | "active" | "paused">("idle");
  const [protocol, setProtocol] = useState("restore");
  const [timer, setTimer] = useState(0);
  const [cmdLoading, setCmdLoading] = useState(false);
  const [cmdMsg, setCmdMsg] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
    else forceRender(1);
  }, [router]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (!PATIENTS[patientId]) return <div className="p-8">Patient not found</div>;

  const p = PATIENTS[patientId];
  const checkins = getCheckins(patientId);
  const scans = getScans(patientId);
  const gam = getGamification(patientId);
  const score = getRecoveryScore(patientId);
  const visitRec = getVisitRecommendation(patientId);
  const chartData = checkins.map((c) => ({ date: new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }), pain: c.pain }));
  const preScans = scans.filter((s) => s.type === "pre_session");
  const postScans = scans.filter((s) => s.type === "post_session");
  const latestPre = preScans[preScans.length - 1];
  const latestPost = postScans[postScans.length - 1];

  async function deviceCmd(action: "start" | "pause" | "stop" | "resume") {
    setCmdLoading(true);
    setCmdMsg("");
    try {
      let payload: object;
      if (action === "start") payload = PROTOCOLS[protocol]?.payload ?? { mac: MAC, playCmd: 1 };
      else if (action === "pause") payload = { mac: MAC, playCmd: 2 };
      else if (action === "stop") payload = { mac: MAC, playCmd: 3 };
      else payload = { mac: MAC, playCmd: 4 };

      await sendDeviceCommand(payload);

      if (action === "start" || action === "resume") {
        setDeviceStatus("active");
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
        setCmdMsg("Session active");
      } else if (action === "pause") {
        setDeviceStatus("paused");
        if (timerRef.current) clearInterval(timerRef.current);
        setCmdMsg("Session paused");
      } else {
        setDeviceStatus("idle");
        setTimer(0);
        if (timerRef.current) clearInterval(timerRef.current);
        setCmdMsg("Session stopped");
      }
    } catch {
      setCmdMsg("Command failed — check device connection");
    }
    setCmdLoading(false);
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "cv", label: "CV Movement" },
    { key: "lifestyle", label: "Lifestyle" },
    { key: "device", label: "Device Control" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-hw-cream)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b" style={{ background: "var(--color-hw-sidebar)", borderColor: "rgba(255,255,255,0.08)" }}>
        <Link href="/practitioner" className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>← All Patients</Link>
        <div>
          <p className="text-white font-bold">{p.name}</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.age}y · {p.primary_region} · {p.condition_duration}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b px-6" style={{ background: "var(--color-hw-card)", borderColor: "var(--color-hw-border)" }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="py-3.5 px-4 text-sm font-semibold border-b-2 transition-colors"
            style={tab === key
              ? { borderColor: "var(--color-hw-gold)", color: "var(--color-hw-navy)" }
              : { borderColor: "transparent", color: "var(--color-hw-muted)" }}>
            {label}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-3xl mx-auto">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl p-5 text-center" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-hw-muted)" }}>Recovery Score</p>
                <RecoveryScore score={score} size={100} strokeWidth={9} />
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--color-hw-muted)" }}>Current Pain</p>
                <p className="text-4xl font-bold" style={{ color: checkins.length && checkins[checkins.length-1].pain >= 7 ? "var(--color-hw-red)" : "var(--color-hw-navy)" }}>
                  {checkins.length ? checkins[checkins.length-1].pain : p.discomfort_level}<span className="text-lg">/10</span>
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-hw-muted)" }}>from {checkins[0]?.pain ?? p.discomfort_level} at baseline</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-sidebar)", border: "none" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Visit Frequency</p>
                <p className="text-lg font-bold text-white">{visitRec}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>🔥 {gam.streak} day streak</p>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--color-hw-muted)" }}>Comfort Level Trend (NPRS)</p>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e4df" />
                    <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                    <Line type="monotone" dataKey="pain" stroke="var(--color-hw-navy)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-hw-navy)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {checkins.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-hw-muted)" }}>Recent Check-ins</p>
                <div className="space-y-2">
                  {checkins.slice(-3).reverse().map((c) => (
                    <div key={c.id} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "var(--color-hw-border)" }}>
                      <span className="text-sm font-bold w-8 text-center px-1 py-0.5 rounded"
                        style={{ background: c.pain >= 7 ? "#fee2e2" : c.pain >= 4 ? "#fef3c7" : "#d1fae5", color: c.pain >= 7 ? "var(--color-hw-red)" : c.pain >= 4 ? "var(--color-hw-amber)" : "var(--color-hw-green)" }}>
                        {c.pain}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs" style={{ color: "var(--color-hw-muted)" }}>{new Date(c.timestamp).toLocaleDateString()}</p>
                        {c.note && <p className="text-sm" style={{ color: "var(--color-hw-navy)" }}>{c.note}</p>}
                      </div>
                      <span className="text-xs" style={{ color: c.function_rating === "yes" ? "var(--color-hw-green)" : "var(--color-hw-muted)" }}>
                        {c.function_rating === "yes" ? "✓ Full function" : c.function_rating === "partial" ? "~ Partial" : "✗ Limited"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CV MOVEMENT */}
        {tab === "cv" && (
          <div className="space-y-5">
            {latestPre && latestPost ? (
              <>
                <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
                  <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--color-hw-muted)" }}>Session Movement Insights</p>
                  <div className="space-y-3">
                    {Object.keys(latestPre.rom).map((joint) => {
                      const pre = latestPre.rom[joint];
                      const post = latestPost.rom[joint];
                      const delta = post - pre;
                      return (
                        <div key={joint} className="flex items-center gap-4 py-2 border-b" style={{ borderColor: "var(--color-hw-border)" }}>
                          <span className="text-lg font-bold w-16 shrink-0" style={{ color: delta > 0 ? "var(--color-hw-green)" : delta < 0 ? "var(--color-hw-red)" : "var(--color-hw-muted)" }}>
                            {delta > 0 ? "+" : ""}{delta}°
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium capitalize" style={{ color: "var(--color-hw-navy)" }}>{joint.replace("_", " ")}</p>
                            <p className="text-xs" style={{ color: "var(--color-hw-muted)" }}>{pre}° → {post}°</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "Symmetry Score", pre: latestPre.symmetry_score, post: latestPost.symmetry_score, unit: "%", invert: true },
                    { label: "Compensation Index", pre: latestPre.compensation_index, post: latestPost.compensation_index, unit: "", invert: true }].map(({ label, pre, post, unit, invert }) => (
                    <div key={label} className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
                      <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: "var(--color-hw-muted)" }}>{label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold" style={{ color: invert ? (post < pre ? "var(--color-hw-green)" : "var(--color-hw-amber)") : "var(--color-hw-navy)" }}>{post}{unit}</span>
                        <span className="text-sm" style={{ color: "var(--color-hw-muted)" }}>from {pre}{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-16 text-center rounded-2xl" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-muted)" }}>
                No movement scans yet for this patient.
              </div>
            )}
          </div>
        )}

        {/* LIFESTYLE */}
        {tab === "lifestyle" && (
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--color-hw-muted)" }}>Patient Lifestyle Engagement</p>
            {LIFESTYLE_SECTIONS.map((s) => (
              <div key={s} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--color-hw-border)" }}>
                <span className="text-sm" style={{ color: "var(--color-hw-navy)" }}>{s}</span>
                <span className="text-xs font-semibold" style={{ color: "var(--color-hw-muted)" }}>Not tracked yet</span>
              </div>
            ))}
          </div>
        )}

        {/* DEVICE CONTROL */}
        {tab === "device" && (
          <div className="space-y-5">
            {/* Status */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "var(--color-hw-sidebar)", border: "none" }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: deviceStatus === "active" ? "var(--color-hw-green)" : deviceStatus === "paused" ? "var(--color-hw-amber)" : "var(--color-hw-muted)", boxShadow: deviceStatus === "active" ? "0 0 8px var(--color-hw-green)" : "none" }} />
                <span className="text-white font-semibold capitalize">{deviceStatus === "idle" ? "Device Ready" : deviceStatus === "active" ? `Session Active — ${formatTime(timer)}` : "Session Paused"}</span>
              </div>
              {cmdMsg && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{cmdMsg}</p>}
            </div>

            {/* Protocol selector */}
            <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-hw-muted)" }}>Protocol</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PROTOCOLS).map(([key, { name }]) => (
                  <button key={key} onClick={() => setProtocol(key)}
                    className="py-2.5 px-3 rounded-xl text-sm font-medium text-left transition-colors"
                    style={protocol === key
                      ? { background: "var(--color-hw-navy)", color: "#fff" }
                      : { background: "var(--color-hw-cream)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Control buttons */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--color-hw-muted)" }}>Controls</p>
              {deviceStatus === "idle" && (
                <button onClick={() => deviceCmd("start")} disabled={cmdLoading}
                  className="w-full py-4 rounded-xl font-bold text-white text-base transition-opacity disabled:opacity-50"
                  style={{ background: "var(--color-hw-green)" }}>
                  {cmdLoading ? "Starting..." : "▶ START SESSION"}
                </button>
              )}
              {deviceStatus === "active" && (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => deviceCmd("pause")} disabled={cmdLoading}
                    className="py-3.5 rounded-xl font-bold text-white transition-opacity disabled:opacity-50"
                    style={{ background: "var(--color-hw-amber)" }}>
                    ⏸ Pause
                  </button>
                  <button onClick={() => deviceCmd("stop")} disabled={cmdLoading}
                    className="py-3.5 rounded-xl font-bold text-white transition-opacity disabled:opacity-50"
                    style={{ background: "var(--color-hw-red)" }}>
                    ⏹ Stop
                  </button>
                </div>
              )}
              {deviceStatus === "paused" && (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => deviceCmd("resume")} disabled={cmdLoading}
                    className="py-3.5 rounded-xl font-bold text-white transition-opacity disabled:opacity-50"
                    style={{ background: "var(--color-hw-green)" }}>
                    ▶ Resume
                  </button>
                  <button onClick={() => deviceCmd("stop")} disabled={cmdLoading}
                    className="py-3.5 rounded-xl font-bold text-white transition-opacity disabled:opacity-50"
                    style={{ background: "var(--color-hw-red)" }}>
                    ⏹ Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
