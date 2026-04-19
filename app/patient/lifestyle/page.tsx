"use client";
import { useState, useEffect } from "react";
import { PATIENTS, type PatientId } from "@/lib/mock-data";
import { addPoints } from "@/lib/gamification";

type Section = { key: string; label: string; emoji: string; items: string[] };

function getSections(pid: PatientId): Section[] {
  const p = PATIENTS[pid];
  const region = p.primary_region;
  const profile = p.dysfunction_profile;
  const discomfort = p.discomfort_level;

  const nutritionExtras: Record<string, string[]> = {
    musculoskeletal_tightness: ["Increase protein intake (1.4–1.6g/kg)", "Add magnesium-rich foods: dark chocolate, spinach, pumpkin seeds", "Electrolytes post-session: sodium, potassium"],
    chronic_pain:              ["B-complex vitamins support nerve health", "Magnesium for muscle relaxation", "Omega-3s reduce systemic inflammation"],
    post_surgical:             ["Vitamin C for collagen synthesis (1000mg/day)", "Zinc for tissue repair: pumpkin seeds, beef", "Calcium + Vitamin D for bone support"],
    athletic_recovery:         ["Carbohydrate window: refuel within 30min post-session", "Creatine monohydrate (3-5g/day) for muscle recovery", "Protein shake post-workout: 20-30g"],
    acute_inflammatory:        ["Vitamin C + Zinc: immune and repair support", "Anti-inflammatory protein sources: turkey, fish", "Avoid processed foods and trans fats"],
  };

  const movementMap: Record<string, string[]> = {
    shoulder: ["Doorframe chest stretch: 30 sec hold, 3× daily", "Pendulum shoulder circles: 20 reps each direction", "Thoracic rotation in chair: 10 reps each side, hourly", "Band pull-aparts: 3 × 15 reps at low resistance"],
    low_back:  ["Hip hinge: 3 × 10 reps, maintain neutral spine", "Cat-cow stretch: 10 reps every 60 minutes", "Glute bridge: 3 × 15 reps, 2× daily", "Walking 15 min — reduces disc pressure"],
    knee:      ["Seated leg extension: 3 × 15 reps, controlled", "Calf raise standing: 3 × 20 reps", "Step-ups on low step: 3 × 10 each leg", "Hamstring stretch: 30 sec hold, 3× daily"],
  };

  const sleepExtra = p.sleep_posture === "stomach" && region === "shoulder"
    ? "Side-sleep with body pillow between arms to protect shoulder"
    : p.sleep_posture === "back" && region === "low_back"
    ? "Place pillow under knees to reduce lumbar load"
    : "Maintain consistent sleep position — avoid twisting";

  const stressExtra = discomfort > 6
    ? "High discomfort can amplify pain signals — pain education resources recommended"
    : "Regular parasympathetic activation accelerates tissue repair";

  return [
    {
      key: "nutrition", label: "Nutrition", emoji: "🥗",
      items: [
        "Omega-3 sources: salmon, walnuts, flaxseed (anti-inflammatory)",
        "Colourful vegetables at every meal for antioxidant support",
        "Whole grains over refined carbs for sustained energy",
        "Reduce sugar and processed foods — linked to inflammation",
        ...(nutritionExtras[profile] ?? []),
      ],
    },
    {
      key: "sleep", label: "Sleep", emoji: "😴",
      items: [
        "Target 7–9 hours for optimal tissue repair",
        "Screen-free 30 min before bed — blue light disrupts melatonin",
        "Consistent sleep/wake time within 30 min, 7 days/week",
        "Room temperature 65–68°F for deeper sleep stages",
        sleepExtra,
      ],
    },
    {
      key: "stress", label: "Stress & Nervous System", emoji: "🧘",
      items: [
        "10–15 min daily parasympathetic activation (breathing or meditation)",
        "Journaling: 3 positive recovery wins each evening",
        stressExtra,
        "Limit news and screens 2 hrs before sleep",
        "Social connection supports recovery — reach out to support network",
      ],
    },
    {
      key: "hydration", label: "Hydration", emoji: "💧",
      items: [
        "Daily target: 35ml/kg body weight (~2.5 L for 70kg)",
        "+500ml post-session to replace exercise losses",
        ...(profile === "musculoskeletal_tightness" ? ["Add electrolytes post-session: sodium, potassium, magnesium"] : []),
        "Check urine colour: pale yellow = well hydrated",
        "Start mornings with 500ml water before coffee",
      ],
    },
    {
      key: "movement", label: "Movement Snacks", emoji: "🏃",
      items: [
        ...(movementMap[region] ?? movementMap.shoulder),
        "15–20 min walking daily — gentle blood flow for recovery",
        "Set hourly reminders for movement breaks",
      ],
    },
    {
      key: "breathwork", label: "Breathwork", emoji: "🌬️",
      items: [
        "Box breathing (4-4-4-4): morning + evening for cortisol management",
        "4-7-8 breathing before sleep: inhale 4s, hold 7s, exhale 8s",
        "Physiological sigh: double inhale through nose + long exhale — instant calm",
        ...(discomfort > 6 ? ["Diaphragmatic breathing during rest periods — reduces compensation patterns", "Progressive Muscle Relaxation (PMR) before bed for pain relief"] : []),
      ],
    },
  ];
}

export default function LifestylePage() {
  const [userId, setUserId] = useState<PatientId>("maria");
  const [open, setOpen] = useState<string | null>("nutrition");
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const id = (localStorage.getItem("riq_userId") || "maria") as PatientId;
    setUserId(id);
    const viewedSections = parseInt(localStorage.getItem(`lifestyle_sections_${id}`) ?? "0");
    if (viewedSections > 0) setViewed(new Set(getSections(id).slice(0, viewedSections).map((s) => s.key)));
  }, []);

  function toggleSection(key: string) {
    setOpen((o) => (o === key ? null : key));
    if (!viewed.has(key)) {
      const next = new Set([...viewed, key]);
      setViewed(next);
      localStorage.setItem(`lifestyle_sections_${userId}`, String(next.size));
      addPoints(userId, 20);
    }
  }

  const sections = getSections(userId);

  return (
    <div className="px-5 py-5 space-y-3 max-w-lg mx-auto">
      <div className="mb-2">
        <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>Lifestyle Plan</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-muted)" }}>Personalised for your recovery · +20 pts per section</p>
      </div>

      <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-sidebar)", border: "none" }}>
        <p className="text-white text-sm font-semibold">Your recovery happens between visits.</p>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          These evidence-based recommendations are tailored to your {PATIENTS[userId]?.primary_region} recovery profile. Each section viewed earns +20 pts.
        </p>
      </div>

      {sections.map(({ key, label, emoji, items }) => (
        <div key={key} className="rounded-2xl overflow-hidden" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
          <button className="w-full px-5 py-4 flex items-center gap-3 text-left" onClick={() => toggleSection(key)}>
            <span className="text-xl">{emoji}</span>
            <span className="flex-1 font-semibold text-sm" style={{ color: "var(--color-hw-navy)" }}>{label}</span>
            {viewed.has(key) && <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: "rgba(34,197,94,0.1)", color: "var(--color-hw-green)" }}>+20 pts</span>}
            <span className="text-sm" style={{ color: "var(--color-hw-muted)" }}>{open === key ? "▲" : "▼"}</span>
          </button>
          {open === key && (
            <div className="px-5 pb-4 space-y-2 border-t" style={{ borderColor: "var(--color-hw-border)" }}>
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "var(--color-hw-gold)" }} />
                  <p className="text-sm" style={{ color: "var(--color-hw-navy)" }}>{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
