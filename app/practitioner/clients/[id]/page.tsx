"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Play, ArrowLeft, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { PATIENTS, getCheckins, getScans, getRecoveryScore, getVisitRecommendation, getTrend, type PatientId } from "@/lib/mock-data";
import { RecoveryScore } from "@/components/RecoveryScore";

type Tab = "overview" | "assessment" | "progress" | "rom";

export default function ClientDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [assessment, setAssessment] = useState<Record<string, unknown> | null>(null);
  const [recs, setRecs] = useState<unknown[] | null>(null);

  useEffect(() => {
    if (localStorage.getItem("riq_role") !== "practitioner") { router.push("/login"); return; }
    setMounted(true);
    try {
      const a = localStorage.getItem(`assessment_${id}`);
      const r = localStorage.getItem(`assessment_recs_${id}`);
      if (a) setAssessment(JSON.parse(a));
      if (r) setRecs(JSON.parse(r));
    } catch { /* no assessment yet */ }
  }, [id, router]);

  if (!mounted) return null;

  const patient = PATIENTS[id as PatientId];
  if (!patient) return (
    <div className="text-center py-20">
      <p style={{ color: "var(--color-hw-text-muted)" }}>Client not found.</p>
      <Link href="/practitioner/clients" className="text-sm underline mt-2 block" style={{ color: "var(--color-hw-clay)" }}>Back to Clients</Link>
    </div>
  );

  const checkins = getCheckins(id);
  const scans = getScans(id);
  const score = getRecoveryScore(id);
  const trend = getTrend(id);
  const visitRec = getVisitRecommendation(id);
  const lastCheckin = checkins[checkins.length - 1];
  const currentPain = lastCheckin?.pain ?? patient.discomfort_level;

  const painChartData = checkins.map((c, i) => ({
    session: `S${i + 1}`, pain: c.pain,
    date: new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const romKeys = scans.length ? Object.keys(scans[0].rom) : [];
  const romChartData = scans.map((s, i) => ({
    label: `Scan ${i + 1}`, ...s.rom,
    date: new Date(s.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const JOINT_COLORS: Record<string, string> = {
    shoulder_l: "#d17d5d", shoulder_r: "#ec7c13", hip_l: "#135bec", hip_r: "#ac4bff",
    knee_l: "#00bb7f", knee_r: "#ff2357",
  };

  const TrendIcon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Minus;
  const trendColor = trend === "improving" ? "var(--color-hw-green)" : trend === "declining" ? "var(--color-hw-red)" : "var(--color-hw-text-muted)";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/practitioner/clients">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <ArrowLeft size={16} style={{ color: "var(--color-hw-text-muted)" }} />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>{patient.name}</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>
            {patient.age} yrs · {patient.primary_region} · {patient.condition_duration}
          </p>
        </div>
        <Link href={`/practitioner/session?client=${id}`}>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-hw-black)" }}>
            <Play size={13} fill="white" />
            Start Session
          </button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Recovery Score", value: <RecoveryScore score={score} size={64} strokeWidth={6} /> },
          { label: "Current Pain", value: <span className="text-2xl font-bold" style={{ color: currentPain >= 7 ? "var(--color-hw-red)" : currentPain >= 4 ? "var(--color-hw-amber)" : "var(--color-hw-green)" }}>{currentPain}<span className="text-sm">/10</span></span> },
          { label: "Trend", value: <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: trendColor }}><TrendIcon size={16} />{trend}</span> },
          { label: "Next Visit", value: <span className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>{visitRec}</span> },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>{label}</p>
            {value}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
        {(["overview", "assessment", "progress", "rom"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors"
            style={tab === t ? { background: "#fff", color: "var(--color-hw-text)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" } : { color: "var(--color-hw-text-muted)" }}>
            {t === "rom" ? "ROM Comparison" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>Client Profile</p>
            {[
              ["Primary Region", patient.primary_region],
              ["Activity Level", patient.activity_ranking.join(", ")],
              ["Sleep Posture", patient.sleep_posture],
              ["Prior Injuries", patient.prior_injuries.join(", ") || "None reported"],
              ["Dysfunction Profile", patient.dysfunction_profile.replace(/_/g, " ")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs py-1.5 border-b last:border-0" style={{ borderColor: "var(--color-hw-border)" }}>
                <span style={{ color: "var(--color-hw-text-muted)" }}>{k}</span>
                <span className="font-semibold capitalize" style={{ color: "var(--color-hw-text)" }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Pain Trend</p>
            {painChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={painChartData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <ReferenceLine y={7} stroke="var(--color-hw-red)" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="pain" stroke="var(--color-hw-clay)" strokeWidth={2} dot={{ fill: "var(--color-hw-clay)" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-xs text-center py-8" style={{ color: "var(--color-hw-text-faint)" }}>No check-in data yet</p>}
          </div>
        </div>
      )}

      {/* Assessment tab */}
      {tab === "assessment" && (
        <div className="space-y-4">
          {!assessment ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-hw-text)" }}>No Pre-Visit Assessment Yet</p>
              <p className="text-xs mb-4" style={{ color: "var(--color-hw-text-muted)" }}>
                Client has not submitted their self-assessment. Share their portal invite to get started.
              </p>
              <button className="px-4 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "var(--color-hw-clay)" }}>
                Send Portal Invite
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>Areas of Focus</p>
                {((assessment.areas as { regionId: string; discomfort: number; duration: string; behavior: string; notes: string; isPrimary: boolean }[]) ?? []).map((a) => (
                  <div key={a.regionId} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: "var(--color-hw-border)" }}>
                    <span className="font-semibold" style={{ color: "var(--color-hw-text)" }}>{a.regionId}</span>
                    <span style={{ color: "var(--color-hw-text-muted)" }}>Pain {a.discomfort}/9 · {a.duration}</span>
                  </div>
                ))}
              </div>
              {recs && (
                <div className="rounded-2xl p-5 space-y-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} style={{ color: "var(--color-hw-clay)" }} />
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>AI Protocol Recommendations</p>
                  </div>
                  {(recs as { protocol: { name: string; durationMin: number }; rationale: string; priority: string }[]).map((r, i) => (
                    <div key={i} className="rounded-xl p-4" style={{ background: i === 0 ? "var(--color-hw-clay)12" : "var(--color-hw-cream)", border: `1px solid ${i === 0 ? "var(--color-hw-clay)40" : "var(--color-hw-border)"}` }}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{r.protocol.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: i === 0 ? "var(--color-hw-clay)" : "var(--color-hw-border)", color: i === 0 ? "#fff" : "var(--color-hw-text-muted)" }}>
                          {i === 0 ? "Primary" : "Alternative"} · {r.protocol.durationMin} min
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>{r.rationale}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Progress tab */}
      {tab === "progress" && (
        <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Pain Score Over Sessions</p>
          {painChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={painChartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={7} stroke="var(--color-hw-red)" strokeDasharray="3 3" label={{ value: "Severe", position: "insideTopRight", fontSize: 10 }} />
                <Line type="monotone" dataKey="pain" stroke="var(--color-hw-clay)" strokeWidth={2.5} dot={{ fill: "var(--color-hw-clay)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-12" style={{ color: "var(--color-hw-text-faint)" }}>No session data yet</p>}
        </div>
      )}

      {/* ROM Comparison tab */}
      {tab === "rom" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-hw-text-muted)" }}>
              Range of Motion — Baseline vs. Current
            </p>
            {romChartData.length >= 2 ? (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={romChartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 180]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    {romKeys.map((k) => (
                      <Line key={k} type="monotone" dataKey={k} stroke={JOINT_COLORS[k] ?? "#888"} strokeWidth={2} dot={{ r: 4 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-3">
                  {romKeys.map((k) => (
                    <div key={k} className="flex items-center gap-1.5 text-xs">
                      <span className="w-3 h-3 rounded-full" style={{ background: JOINT_COLORS[k] ?? "#888" }} />
                      <span className="capitalize" style={{ color: "var(--color-hw-text-muted)" }}>{k.replace("_", " ")}</span>
                      {scans.length >= 2 && (
                        <span className="font-bold" style={{ color: (scans[scans.length - 1].rom[k] ?? 0) > (scans[0].rom[k] ?? 0) ? "var(--color-hw-green)" : "var(--color-hw-red)" }}>
                          {(scans[scans.length - 1].rom[k] ?? 0) > (scans[0].rom[k] ?? 0) ? "↑" : "↓"}
                          {Math.abs((scans[scans.length - 1].rom[k] ?? 0) - (scans[0].rom[k] ?? 0))}°
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-hw-text)" }}>No ROM scans yet</p>
                <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
                  ROM data appears here once the client completes their pre-visit assessment with camera capture.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
