"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PATIENTS, saveCheckin, type PatientId, type Checkin } from "@/lib/mock-data";
import { addPoints, updateStreak, checkAndAwardBadges, BADGES } from "@/lib/gamification";

export default function CheckinPage() {
  return (
    <Suspense fallback={null}>
      <CheckinInner />
    </Suspense>
  );
}

function CheckinInner() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<PatientId>("maria");
  const [pain, setPain] = useState<number | null>(null);
  const [fnRating, setFnRating] = useState<"yes" | "partial" | "no" | null>(null);
  const [lifestyle, setLifestyle] = useState({ meds: false, exercises: false, sleep: false, ate_well: false });
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  useEffect(() => {
    const pid = (searchParams.get("pid") || localStorage.getItem("riq_userId") || "maria") as PatientId;
    setUserId(pid);
  }, [searchParams]);

  function submit() {
    if (pain === null || !fnRating) return;
    const lifestyleScore = Object.values(lifestyle).filter(Boolean).length / 4;
    const checkin: Checkin = {
      id: `c_${Date.now()}`,
      timestamp: new Date().toISOString(),
      pain, function_rating: fnRating,
      lifestyle, note, lifestyle_score: lifestyleScore,
    };
    saveCheckin(userId, checkin);
    updateStreak(userId);
    addPoints(userId, 50);
    const badges = checkAndAwardBadges(userId);
    setNewBadges(badges);
    setSubmitted(true);
    console.log(`SMS would send to ${PATIENTS[userId]?.phone}: Check-in link: /patient/checkin?pid=${userId}`);
  }

  if (submitted) {
    const patient = PATIENTS[userId];
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--color-hw-cream)" }}>
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>
            Thanks{patient ? `, ${patient.name.split(" ")[0]}` : ""}!
          </h2>
          <p style={{ color: "var(--color-hw-muted)" }}>Your practitioner will see this before your next visit.</p>
          <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-sidebar)", border: "none" }}>
            <p className="text-white font-bold">+50 pts earned 🔥</p>
          </div>
          {newBadges.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-sm font-bold mb-2" style={{ color: "var(--color-hw-navy)" }}>Badge{newBadges.length > 1 ? "s" : ""} unlocked!</p>
              {newBadges.map((b) => {
                const badge = BADGES[b];
                return badge ? <p key={b} className="text-sm">{badge.icon} {badge.label}</p> : null;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-5 space-y-5 max-w-lg mx-auto">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>Daily Check-in</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-muted)" }}>Takes 60 seconds · +50 pts</p>
      </div>

      {/* Pain level */}
      <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        <p className="font-semibold mb-4" style={{ color: "var(--color-hw-navy)" }}>How is your discomfort level today?</p>
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, i) => {
            const color = i <= 3 ? "#22c55e" : i <= 6 ? "#f59e0b" : "#ef4444";
            return (
              <button key={i} onClick={() => setPain(i)}
                className="aspect-square rounded-xl font-bold text-sm transition-transform"
                style={{
                  background: pain === i ? color : `${color}20`,
                  color: pain === i ? "#fff" : color,
                  transform: pain === i ? "scale(1.15)" : "scale(1)",
                }}>
                {i}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--color-hw-muted)" }}>
          <span>No discomfort</span><span>Severe</span>
        </div>
      </div>

      {/* Function */}
      <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        <p className="font-semibold mb-3" style={{ color: "var(--color-hw-navy)" }}>Can you do your main daily activity?</p>
        <div className="grid grid-cols-3 gap-2">
          {(["yes", "partial", "no"] as const).map((v) => (
            <button key={v} onClick={() => setFnRating(v)}
              className="py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors"
              style={fnRating === v
                ? { background: "var(--color-hw-navy)", color: "#fff" }
                : { background: "var(--color-hw-cream)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }}>
              {v === "yes" ? "✓ Yes" : v === "partial" ? "~ Partial" : "✗ No"}
            </button>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        <p className="font-semibold mb-3" style={{ color: "var(--color-hw-navy)" }}>Today I…</p>
        <div className="space-y-2">
          {([["meds", "Took my medications"], ["exercises", "Did my prescribed exercises"], ["sleep", "Slept 7+ hours"], ["ate_well", "Ate well"]] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer py-1">
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors`}
                style={{ background: lifestyle[key] ? "var(--color-hw-navy)" : "transparent", borderColor: lifestyle[key] ? "var(--color-hw-navy)" : "var(--color-hw-border)" }}
                onClick={() => setLifestyle((l) => ({ ...l, [key]: !l[key] }))}>
                {lifestyle[key] && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </div>
              <span className="text-sm" style={{ color: "var(--color-hw-navy)" }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        <p className="font-semibold mb-2" style={{ color: "var(--color-hw-navy)" }}>Any notes? (optional)</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)}
          rows={2} placeholder="How are you feeling today..."
          className="w-full text-sm outline-none resize-none rounded-xl p-3"
          style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }} />
      </div>

      <button onClick={submit} disabled={pain === null || !fnRating}
        className="w-full py-4 rounded-xl font-bold text-white transition-opacity disabled:opacity-40"
        style={{ background: "var(--color-hw-navy)" }}>
        Submit Check-in · +50 pts
      </button>
    </div>
  );
}
