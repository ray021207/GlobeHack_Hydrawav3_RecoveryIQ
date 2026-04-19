"use client";
import { useEffect, useState } from "react";
import { PATIENTS, getGamification, getRecoveryScore, type PatientId } from "@/lib/mock-data";

const PATIENT_IDS: PatientId[] = ["maria", "james", "sarah"];
const MEDAL = ["🥇", "🥈", "🥉"];
const ANIMAL_EMOJI: Record<string, string> = { fox: "🦊", wolf: "🐺", bear: "🐻", eagle: "🦅", lion: "🦁" };

type Tab = "score" | "weekly" | "streak";

export default function LeaderboardPage() {
  const [userId, setUserId] = useState<PatientId>("maria");
  const [tab, setTab] = useState<Tab>("score");
  const [, forceRender] = useState(0);

  useEffect(() => {
    const id = (localStorage.getItem("riq_userId") || "maria") as PatientId;
    setUserId(id);
    forceRender(1);
  }, []);

  const entries = PATIENT_IDS.map((id) => {
    const gam = getGamification(id);
    return {
      id,
      avatarName: gam.avatar.name || PATIENTS[id].name.split(" ")[0],
      animal: gam.avatar.animal,
      score: getRecoveryScore(id),
      weeklyPts: gam.points,
      streak: gam.streak,
      badges: gam.badges.length,
    };
  });

  const sorted = [...entries].sort((a, b) => {
    if (tab === "weekly") return b.weeklyPts - a.weeklyPts;
    if (tab === "streak") return b.streak - a.streak;
    return b.score - a.score;
  }).map((e, i) => ({ ...e, rank: i + 1 }));

  const getValue = (e: typeof sorted[0]) => {
    if (tab === "weekly") return `${e.weeklyPts} pts`;
    if (tab === "streak") return `${e.streak}d`;
    return `${e.score}/100`;
  };

  return (
    <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>🏆 Recovery Leaderboard</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-muted)" }}>Avatar names only — everyone&apos;s journey is their own</p>
      </div>

      <div className="flex gap-2">
        {([["score", "Recovery Score"], ["weekly", "Points"], ["streak", "Streak"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
            style={tab === key ? { background: "var(--color-hw-navy)", color: "#fff" } : { background: "var(--color-hw-card)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Podium */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[sorted[1], sorted[0], sorted[2]].map((e, i) => {
            const isCenter = i === 1;
            const isMe = e.id === userId;
            return (
              <div key={e.id} className={`rounded-2xl p-4 text-center ${isCenter ? "py-6" : ""}`}
                style={isCenter ? { background: "var(--color-hw-sidebar)", border: "none" } : { background: "var(--color-hw-card)", border: isMe ? "2px solid var(--color-hw-gold)" : "1px solid var(--color-hw-border)" }}>
                <div className="text-2xl mb-1">{MEDAL[isCenter ? 0 : i === 0 ? 1 : 2]}</div>
                <div className="text-xl mb-1">{ANIMAL_EMOJI[e.animal] ?? "🦊"}</div>
                <p className="text-xs font-bold truncate" style={{ color: isCenter ? "#fff" : "var(--color-hw-navy)" }}>{e.avatarName}{isMe ? " (you)" : ""}</p>
                <p className="text-lg font-bold mt-1" style={{ color: isCenter ? "var(--color-hw-gold)" : "var(--color-hw-navy)" }}>{getValue(e)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        {sorted.map((e) => {
          const isMe = e.id === userId;
          return (
            <div key={e.id} className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--color-hw-border)", background: isMe ? "rgba(201,150,42,0.05)" : "transparent" }}>
              <span className="w-8 text-center text-sm font-bold" style={{ color: e.rank <= 3 ? "var(--color-hw-gold)" : "var(--color-hw-muted)" }}>
                {e.rank <= 3 ? MEDAL[e.rank - 1] : `#${e.rank}`}
              </span>
              <span className="text-2xl">{ANIMAL_EMOJI[e.animal] ?? "🦊"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-hw-navy)" }}>{e.avatarName}{isMe ? " (you)" : ""}</p>
                <p className="text-xs" style={{ color: "var(--color-hw-muted)" }}>🔥 {e.streak}d · 🏅 {e.badges}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm" style={{ color: "var(--color-hw-navy)" }}>{getValue(e)}</p>
                {tab === "score" && (
                  <div className="w-16 h-1.5 rounded-full mt-1 ml-auto" style={{ background: "var(--color-hw-cream)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${e.score}%`, background: e.score >= 70 ? "var(--color-hw-green)" : "var(--color-hw-amber)" }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
