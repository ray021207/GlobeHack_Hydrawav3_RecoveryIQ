"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Gem, Flame, ChevronRight, CheckCircle2, Camera } from "lucide-react";
import { getGamification, getCheckins, getScans, getRecoveryScore, type PatientId } from "@/lib/mock-data";
import { BADGES } from "@/lib/gamification";

const PETS: Record<string, { emoji: string; name: string; color: string }> = {
  fox:    { emoji: "🦊", name: "Fox",    color: "#f97316" },
  wolf:   { emoji: "🐺", name: "Wolf",   color: "#6366f1" },
  bear:   { emoji: "🐻", name: "Bear",   color: "#a16207" },
  eagle:  { emoji: "🦅", name: "Eagle",  color: "#0ea5e9" },
  rabbit: { emoji: "🐰", name: "Rabbit", color: "#ec4899" },
};

function PetMood(score: number) {
  if (score >= 76) return { label: "Thriving", ring: "var(--color-hw-clay)", particle: "✨" };
  if (score >= 51) return { label: "Happy", ring: "var(--color-hw-green)", particle: "⚡" };
  if (score >= 26) return { label: "Recovering", ring: "#3b82f6", particle: "🌱" };
  return { label: "Resting", ring: "var(--color-hw-text-muted)", particle: "💤" };
}

export default function PatientHome() {
  const [userId, setUserId] = useState<PatientId | null>(null);
  const [mounted, setMounted] = useState(false);
  const [assessmentDone, setAssessmentDone] = useState(false);
  const [firstVisitDone, setFirstVisitDone] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("riq_userId") as PatientId;
    setUserId(id);
    setAssessmentDone(!!localStorage.getItem(`assessment_${id}`));
    setFirstVisitDone(!!localStorage.getItem(`first_visit_done_${id}`));
    setMounted(true);
  }, []);

  if (!mounted || !userId) return null;

  const gam = getGamification(userId);
  const checkins = getCheckins(userId);
  const scans = getScans(userId);
  const score = getRecoveryScore(userId);
  const mood = PetMood(score);
  const pet = PETS[gam.avatar.animal] ?? PETS.fox;
  const isNewUser = !gam.avatar.name || gam.avatar.name === gam.avatar.animal;
  const earnedBadges = gam.badges.map((b) => BADGES[b]).filter(Boolean);

  if (isNewUser) {
    return <PetOnboarding userId={userId} onDone={() => setMounted(false)} />;
  }

  return (
    <div className="space-y-4">
      {/* Pet hero card */}
      <div className="rounded-2xl p-6" style={{ background: "var(--color-hw-black)" }}>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
              style={{
                background: `linear-gradient(135deg, ${pet.color}80, ${pet.color}40)`,
                boxShadow: `0 0 0 3px ${mood.ring}, 0 0 16px ${mood.ring}40`,
              }}>
              {pet.emoji}
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-sm">
              {mood.particle}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg truncate">{gam.avatar.name}</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: mood.ring }}>{mood.label}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#a855f7" }}>
                <Gem size={12} /> {gam.gems.toLocaleString()} gems
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#f97316" }}>
                <Flame size={12} /> {gam.streak}d streak
              </span>
            </div>
          </div>
          <Link href="/patient/avatar">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
              Customize →
            </button>
          </Link>
        </div>

        {/* Gem progress bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            <span>Pet level progress</span>
            <span>{gam.points % 500} / 500 pts to next level</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${(gam.points % 500) / 500 * 100}%`, background: "var(--color-hw-clay)" }} />
          </div>
        </div>
      </div>

      {/* Pre-visit assessment reminder (if not done) */}
      {!assessmentDone && (
        <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-clay)15", border: "1px solid var(--color-hw-clay)50" }}>
          <p className="font-bold text-sm mb-1" style={{ color: "var(--color-hw-text)" }}>Complete Your Pre-Visit Assessment</p>
          <p className="text-xs mb-3" style={{ color: "var(--color-hw-text-muted)" }}>
            Help your practitioner prepare for your first visit. Takes ~5 minutes. Earns your pet 150 gems!
          </p>
          <Link href="/patient/assessment">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "var(--color-hw-clay)" }}>
              Start Assessment → +150 💎
            </button>
          </Link>
        </div>
      )}

      {assessmentDone && !firstVisitDone && (
        <div className="rounded-2xl p-5" style={{ background: "#00bb7f15", border: "1px solid #00bb7f40" }}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} style={{ color: "var(--color-hw-green)" }} />
            <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Assessment Submitted!</p>
          </div>
          <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
            Your practitioner is reviewing your results. Recovery exercises unlock after your first visit.
          </p>
        </div>
      )}

      {/* Today's exercises (post-visit) */}
      {firstVisitDone && (
        <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Today's Recovery Exercises</p>
          {[
            { name: "Forward Bend", gems: 30, done: checkins.length > 0 },
            { name: "Shoulder Flexion", gems: 30, done: checkins.length > 1 },
            { name: "Squat Check", gems: 40, done: false },
          ].map(({ name, gems, done }) => (
            <div key={name} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "var(--color-hw-border)" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: done ? "#00bb7f20" : "var(--color-hw-cream)" }}>
                  {done ? <CheckCircle2 size={16} style={{ color: "var(--color-hw-green)" }} /> : <Camera size={15} style={{ color: "var(--color-hw-text-muted)" }} />}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: done ? "var(--color-hw-text-muted)" : "var(--color-hw-text)", textDecoration: done ? "line-through" : "none" }}>{name}</p>
                  <p className="text-xs" style={{ color: "#a855f7" }}>+{gems} 💎</p>
                </div>
              </div>
              {!done && (
                <Link href="/patient/scan">
                  <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: "var(--color-hw-clay)", color: "#fff" }}>
                    Start
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/patient/scan">
          <div className="rounded-2xl p-4 text-center cursor-pointer" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <div className="text-2xl mb-1">📹</div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>Movement Scan</p>
            <p className="text-xs mt-0.5" style={{ color: "#a855f7" }}>+100 💎</p>
          </div>
        </Link>
        <Link href="/patient/checkin">
          <div className="rounded-2xl p-4 text-center cursor-pointer" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <div className="text-2xl mb-1">✅</div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>Daily Check-in</p>
            <p className="text-xs mt-0.5" style={{ color: "#a855f7" }}>+50 💎</p>
          </div>
        </Link>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>Badges Earned</p>
            <span className="text-xs" style={{ color: "var(--color-hw-text-faint)" }}>{earnedBadges.length} / {Object.keys(BADGES).length}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {earnedBadges.map((b) => (
              <div key={b.label} className="text-center">
                <div className="text-2xl">{b.icon}</div>
                <p className="text-[10px] mt-0.5 font-semibold" style={{ color: "var(--color-hw-text-muted)" }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pet onboarding ────────────────────────────────────────────────────────────
function PetOnboarding({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [step, setStep] = useState<"pick" | "name">("pick");

  function confirm() {
    if (!selectedPet || !petName.trim()) return;
    const gam = getGamification(userId as PatientId);
    const updated = { ...gam, gems: gam.gems + 50, points: gam.points + 50, avatar: { animal: selectedPet, accessory: null, name: petName.trim() } };
    localStorage.setItem(`gamification_${userId}`, JSON.stringify(updated));
    onDone();
    window.location.reload();
  }

  return (
    <div className="space-y-6 py-4">
      {step === "pick" && (
        <>
          <div className="text-center">
            <p className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Choose Your Recovery Pet</p>
            <p className="text-sm mt-2" style={{ color: "var(--color-hw-text-muted)" }}>
              Your pet grows as you recover. Complete exercises to earn gems and watch them thrive!
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {Object.entries(PETS).map(([key, p]) => (
              <button key={key} onClick={() => setSelectedPet(key)}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 transition-all"
                style={selectedPet === key
                  ? { background: "var(--color-hw-black)", border: "2px solid var(--color-hw-clay)" }
                  : { background: "#fff", border: "2px solid var(--color-hw-border)" }}>
                <span className="text-4xl">{p.emoji}</span>
                <span className="text-xs font-bold" style={{ color: selectedPet === key ? "#fff" : "var(--color-hw-text)" }}>{p.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => selectedPet && setStep("name")}
            disabled={!selectedPet}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: "var(--color-hw-clay)" }}>
            Choose {selectedPet ? PETS[selectedPet].name : "Pet"} →
          </button>
        </>
      )}

      {step === "name" && selectedPet && (
        <>
          <div className="text-center">
            <div className="text-7xl mb-3">{PETS[selectedPet].emoji}</div>
            <p className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Name your {PETS[selectedPet].name}</p>
            <p className="text-sm mt-2" style={{ color: "var(--color-hw-text-muted)" }}>Give them a name they&apos;ll be known by throughout your recovery journey.</p>
          </div>
          <input
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder={`e.g. "Storm" or "Maple"`}
            className="w-full px-4 py-3.5 rounded-xl text-base font-semibold text-center outline-none"
            style={{ background: "#fff", border: "2px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}
            autoFocus
          />
          <button
            onClick={confirm}
            disabled={!petName.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: "var(--color-hw-clay)" }}>
            Meet {petName.trim() || "your pet"} → +50 💎
          </button>
          <button onClick={() => setStep("pick")} className="w-full text-sm text-center" style={{ color: "var(--color-hw-text-muted)" }}>
            ← Choose different pet
          </button>
        </>
      )}
    </div>
  );
}
