"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Play, Zap, ChevronRight, ChevronLeft, Sparkles, Check } from "lucide-react";
import { BodyMap, getRegionLabel } from "@/components/BodyMap";
import { PATIENTS, type PatientId } from "@/lib/mock-data";
import { getTopProtocols, type AssessmentInput } from "@/lib/protocol-recs";
import type { ProtocolRecommendation } from "@/lib/protocol-recs";

// ── Types ────────────────────────────────────────────────────────────────────
type SessionMode = "choose" | "guided" | "quickstart";
type Step = 1 | 2 | 3 | 4;

type AreaEntry = {
  regionId: string;
  discomfort: number;
  behavior: string;
  duration: string;
  notes: string;
  isPrimary: boolean;
};

type RomFinding = {
  exercise: string;
  bodyPart: string;
  side: string;
  position: string;
  sensations: string[];
};

type AssessmentState = {
  areas: AreaEntry[];
  romFindings: RomFinding[];
  dailyActivities: string[];
  sleepPosture: string;
  activitiesWorse: string[];
  activitiesBetter: string[];
  tolerancePos: string;
  remarks: string;
};

const BEHAVIORS = ["Always Present", "Comes and Goes", "Only with Certain Activities", "Varies Day to Day"];
const DURATIONS = ["Less than 6 Weeks", "6 Weeks to 3 Months", "3 to 6 Months", "6 Months to 1 Year", "More than 1 Year"];
const ROM_EXERCISES = ["Forward Bend", "Squat", "Trunk Rotation", "Ankle Dorsiflexion", "Shoulder Flexion", "Neck Flexion", "Neck Rotation", "Manual Entry"];
const SENSATIONS = ["Tight", "Stiff", "Achy", "Heavy/Fatigued", "Sharp", "Burning", "Tingling", "Numb", "Manual Entry"];
const BODY_PARTS = ["Lower Back", "Upper Back", "Neck", "Right Shoulder", "Left Shoulder", "Right Hip", "Left Hip", "Right Knee", "Left Knee", "Right Hamstring", "Left Hamstring", "Other"];
const DAILY_ACTIVITIES = ["Office / Desk Work", "Standing Work", "Manual Work", "Sports / Training", "Yoga / Mobility", "Running / Cycling", "Prolonged Driving"];
const SLEEP_POSTURES = ["On Back", "On Stomach", "Left Side", "Right Side", "Change Positions"];
const FACTORS = ["Sitting", "Standing", "Walking", "Getting up from sitting", "Standing >30 min", "Sitting >30 min", "Stairs", "Bending backward", "Bending forward", "Heat", "Cold", "Stretching", "Standing and moving", "Knees-to-chest"];

const STEP_LABELS: Record<Step, string> = { 1: "Area of Focus", 2: "Range of Motion", 3: "Daily Activities", 4: "Final Remarks" };

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
      style={active
        ? { background: "var(--color-hw-black)", color: "#fff" }
        : { background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}
    >
      {label}
    </button>
  );
}

function StepBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {([1, 2, 3, 4] as Step[]).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={s < step
                ? { background: "var(--color-hw-clay)", color: "#fff" }
                : s === step
                  ? { background: "var(--color-hw-black)", color: "#fff" }
                  : { background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}
            >
              {s < step ? <Check size={13} /> : s}
            </div>
            <span className="text-[10px] font-semibold" style={{ color: s === step ? "var(--color-hw-text)" : "var(--color-hw-text-muted)" }}>
              {STEP_LABELS[s]}
            </span>
          </div>
          {s < 4 && <div className="w-16 h-0.5 mb-5" style={{ background: s < step ? "var(--color-hw-clay)" : "var(--color-hw-border)" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Step 1 ──────────────────────────────────────────────────────────────────
function Step1({
  state, setState,
}: {
  state: AssessmentState;
  setState: React.Dispatch<React.SetStateAction<AssessmentState>>;
}) {
  const [activeRegion, setActiveRegion] = useState<string | null>(state.areas[0]?.regionId ?? null);
  const selectedIds = state.areas.map((a) => a.regionId);

  function toggleRegion(id: string) {
    setState((prev) => {
      const exists = prev.areas.find((a) => a.regionId === id);
      if (exists) {
        const next = prev.areas.filter((a) => a.regionId !== id);
        setTimeout(() => setActiveRegion(next[0]?.regionId ?? null), 0);
        return { ...prev, areas: next };
      }
      const newEntry: AreaEntry = { regionId: id, discomfort: 5, behavior: "", duration: "", notes: "", isPrimary: prev.areas.length === 0 };
      setTimeout(() => setActiveRegion(id), 0);
      return { ...prev, areas: [...prev.areas, newEntry] };
    });
  }

  function updateArea(id: string, patch: Partial<AreaEntry>) {
    setState((prev) => ({ ...prev, areas: prev.areas.map((a) => a.regionId === id ? { ...a, ...patch } : a) }));
  }

  const active = state.areas.find((a) => a.regionId === activeRegion);

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <BodyMap selected={selectedIds} onToggle={toggleRegion} size={280} />
        <p className="text-xs text-center mt-3" style={{ color: "var(--color-hw-text-muted)" }}>
          {selectedIds.length === 0 ? "Click the body map to select areas of focus" : `${selectedIds.length} area${selectedIds.length > 1 ? "s" : ""} selected`}
        </p>
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {state.areas.map((a) => (
              <button key={a.regionId} onClick={() => setActiveRegion(a.regionId)}
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={a.regionId === activeRegion
                  ? { background: "var(--color-hw-clay)", color: "#fff" }
                  : { background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
                {a.isPrimary ? "★ " : ""}{getRegionLabel(a.regionId)}
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="w-80 rounded-2xl p-5 space-y-4 shrink-0" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{getRegionLabel(active.regionId)}</p>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={active.isPrimary ? { background: "var(--color-hw-clay)20", color: "var(--color-hw-clay)" } : { background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)" }}>
              {active.isPrimary ? "Primary" : "Secondary"}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Discomfort Level</p>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>–</span>
              <input type="range" min={1} max={9} value={active.discomfort}
                onChange={(e) => updateArea(active.regionId, { discomfort: Number(e.target.value) })}
                className="flex-1 accent-clay" style={{ accentColor: "var(--color-hw-clay)" }} />
              <span className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>+</span>
              <span className="w-6 text-center font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{active.discomfort}</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Behavior</p>
            <div className="flex flex-wrap gap-2">
              {BEHAVIORS.map((b) => <Chip key={b} label={b} active={active.behavior === b} onClick={() => updateArea(active.regionId, { behavior: b })} />)}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Duration</p>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => <Chip key={d} label={d} active={active.duration === d} onClick={() => updateArea(active.regionId, { duration: d })} />)}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Notes</p>
            <textarea rows={2} value={active.notes} onChange={(e) => updateArea(active.regionId, { notes: e.target.value })}
              placeholder="Specific observation notes..."
              className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
              style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }} />
          </div>
        </div>
      )}

      {selectedIds.length === 0 && (
        <div className="w-80 rounded-2xl p-8 flex items-center justify-center shrink-0"
          style={{ background: "var(--color-hw-cream)", border: "1px dashed var(--color-hw-border)" }}>
          <p className="text-xs text-center" style={{ color: "var(--color-hw-text-faint)" }}>No areas selected<br />Interact with the body map</p>
        </div>
      )}
    </div>
  );
}

// ── Step 2 ──────────────────────────────────────────────────────────────────
function Step2({ state, setState }: { state: AssessmentState; setState: React.Dispatch<React.SetStateAction<AssessmentState>> }) {
  const [activeEx, setActiveEx] = useState(ROM_EXERCISES[0]);
  const finding = state.romFindings.find((f) => f.exercise === activeEx) ?? {
    exercise: activeEx, bodyPart: "", side: "Both", position: "Both", sensations: [],
  };

  function updateFinding(patch: Partial<RomFinding>) {
    setState((prev) => {
      const exists = prev.romFindings.find((f) => f.exercise === activeEx);
      if (exists) return { ...prev, romFindings: prev.romFindings.map((f) => f.exercise === activeEx ? { ...f, ...patch } : f) };
      return { ...prev, romFindings: [...prev.romFindings, { ...finding, ...patch }] };
    });
  }

  return (
    <div className="space-y-4">
      {/* Exercise carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {ROM_EXERCISES.map((ex) => {
          const hasFinding = state.romFindings.some((f) => f.exercise === ex && f.bodyPart);
          return (
            <button key={ex} onClick={() => setActiveEx(ex)}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl shrink-0 transition-colors"
              style={activeEx === ex
                ? { background: "var(--color-hw-black)", color: "#fff", border: "2px solid var(--color-hw-clay)" }
                : { background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
              <div className="text-lg">
                {ex === "Forward Bend" ? "🧍" : ex === "Squat" ? "🏋️" : ex === "Trunk Rotation" ? "🔄" :
                  ex === "Ankle Dorsiflexion" ? "🦵" : ex === "Shoulder Flexion" ? "💪" :
                    ex === "Neck Flexion" ? "🧠" : ex === "Neck Rotation" ? "↔️" : "✏️"}
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight whitespace-nowrap">{ex}</span>
              {hasFinding && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-hw-green)" }} />}
            </button>
          );
        })}
      </div>

      {/* Finding form */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Record Finding for {activeEx}</p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Impacted Body Part</p>
          <select value={finding.bodyPart} onChange={(e) => updateFinding({ bodyPart: e.target.value })}
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}>
            <option value="">Select Affected Part</option>
            {BODY_PARTS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        {finding.bodyPart && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Side</p>
                <div className="flex gap-2">
                  {["Left", "Both", "Right"].map((s) => (
                    <Chip key={s} label={s} active={finding.side === s} onClick={() => updateFinding({ side: s })} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Position</p>
                <div className="flex gap-2">
                  {["Front", "Both", "Back"].map((p) => (
                    <Chip key={p} label={p} active={finding.position === p} onClick={() => updateFinding({ position: p })} />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>Sensation</p>
              <div className="flex flex-wrap gap-2">
                {SENSATIONS.map((s) => (
                  <Chip key={s} label={s}
                    active={finding.sensations.includes(s)}
                    onClick={() => {
                      const next = finding.sensations.includes(s) ? finding.sensations.filter((x) => x !== s) : [...finding.sensations, s];
                      updateFinding({ sensations: next });
                    }} />
                ))}
              </div>
            </div>

            <button
              onClick={() => updateFinding({ bodyPart: finding.bodyPart })}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ color: "var(--color-hw-clay)", background: "var(--color-hw-clay)15" }}>
              + Add Finding
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Step 3 ──────────────────────────────────────────────────────────────────
function Step3({ state, setState }: { state: AssessmentState; setState: React.Dispatch<React.SetStateAction<AssessmentState>> }) {
  function toggleActivity(a: string) {
    setState((prev) => ({
      ...prev,
      dailyActivities: prev.dailyActivities.includes(a) ? prev.dailyActivities.filter((x) => x !== a) : [...prev.dailyActivities, a],
    }));
  }
  function toggleWorse(f: string) {
    setState((prev) => ({ ...prev, activitiesWorse: prev.activitiesWorse.includes(f) ? prev.activitiesWorse.filter((x) => x !== f) : [...prev.activitiesWorse, f] }));
  }
  function toggleBetter(f: string) {
    setState((prev) => ({ ...prev, activitiesBetter: prev.activitiesBetter.includes(f) ? prev.activitiesBetter.filter((x) => x !== f) : [...prev.activitiesBetter, f] }));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <div className="flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: "#3b82f615", color: "#3b82f6" }}>
          Activity Ranking: Activities are prioritized from most time spent (1) to least.
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>Daily Activities</p>
            <div className="flex flex-wrap gap-2">
              {DAILY_ACTIVITIES.map((a) => (
                <Chip key={a} label={a} active={state.dailyActivities.includes(a)} onClick={() => toggleActivity(a)} />
              ))}
              <Chip label="Manual Entry" active={false} onClick={() => {}} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>Ranked Priority (Most to Least)</p>
            {state.dailyActivities.length === 0
              ? <p className="text-xs" style={{ color: "var(--color-hw-text-faint)" }}>No items ranked</p>
              : state.dailyActivities.map((a, i) => (
                <div key={a} className="flex items-center gap-2 py-1 text-xs" style={{ color: "var(--color-hw-text)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "var(--color-hw-clay)" }}>{i + 1}</span>
                  {a}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>Usual Sleep Posture</p>
        <div className="flex flex-wrap gap-2">
          {SLEEP_POSTURES.map((s) => <Chip key={s} label={s} active={state.sleepPosture === s} onClick={() => setState((p) => ({ ...p, sleepPosture: s }))} />)}
        </div>
      </div>

      <div className="rounded-2xl p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>Factor Synthesis</p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-hw-red)" }}>What makes primary discomfort WORSE?</p>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => <Chip key={f} label={f} active={state.activitiesWorse.includes(f)} onClick={() => toggleWorse(f)} />)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-hw-green)" }}>What makes primary discomfort BETTER?</p>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => <Chip key={f} label={f} active={state.activitiesBetter.includes(f)} onClick={() => toggleBetter(f)} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 4 ──────────────────────────────────────────────────────────────────
function Step4({ state, setState, clientId }: { state: AssessmentState; setState: React.Dispatch<React.SetStateAction<AssessmentState>>; clientId?: string }) {
  const [recs, setRecs] = useState<ProtocolRecommendation[] | null>(null);
  const [generating, setGenerating] = useState(false);

  const primary = state.areas.find((a) => a.isPrimary);

  function buildInput(): AssessmentInput {
    const durationMap: Record<string, AssessmentInput["duration"]> = {
      "Less than 6 Weeks": "less_6wk",
      "6 Weeks to 3 Months": "6wk_3mo",
      "3 to 6 Months": "3_6mo",
      "6 Months to 1 Year": "6mo_1yr",
      "More than 1 Year": "over_1yr",
    };
    return {
      primaryArea: primary ? getRegionLabel(primary.regionId) : "general",
      secondaryAreas: state.areas.filter((a) => !a.isPrimary).map((a) => getRegionLabel(a.regionId)),
      discomfortLevel: primary?.discomfort ?? 5,
      duration: durationMap[primary?.duration ?? ""] ?? "3_6mo",
      behavior: primary?.behavior?.includes("Activity") ? "with_activity" : primary?.behavior?.includes("Always") ? "always" : "comes_goes",
      sensations: state.romFindings.flatMap((f) => f.sensations).map((s) => s.toLowerCase().split("/")[0] as AssessmentInput["sensations"][number]).filter(Boolean),
      activitiesWorse: state.activitiesWorse,
      activitiesBetter: state.activitiesBetter,
      activityLevel: state.dailyActivities.some((a) => /sport|run|cycl/i.test(a)) ? "active" : state.dailyActivities.some((a) => /manual|standing/i.test(a)) ? "moderate" : "sedentary",
      dailyActivities: state.dailyActivities,
    };
  }

  function generateReport() {
    setGenerating(true);
    setTimeout(() => {
      const input = buildInput();
      setRecs(getTopProtocols(input, 3));
      setGenerating(false);
      if (clientId) {
        localStorage.setItem(`assessment_${clientId}`, JSON.stringify(state));
        localStorage.setItem(`assessment_recs_${clientId}`, JSON.stringify(getTopProtocols(input, 3)));
      }
    }, 1200);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>
          Any Missing Remarks to be Reported?
        </p>
        <textarea
          rows={4}
          value={state.remarks}
          onChange={(e) => setState((p) => ({ ...p, remarks: e.target.value }))}
          placeholder="Enter your remarks here..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>Step 4 of 4</span>
          <button onClick={generateReport} disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ background: "var(--color-hw-black)" }}>
            <Sparkles size={15} />
            {generating ? "Generating..." : "Generate AI Report"}
          </button>
        </div>
      </div>

      {recs && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: "var(--color-hw-clay)" }} />
            <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Recommended Hydrawav3 Protocols</p>
          </div>
          {recs.map((rec, i) => (
            <div key={rec.protocol.id} className="rounded-xl p-4 space-y-2"
              style={{ background: i === 0 ? "var(--color-hw-clay)12" : "var(--color-hw-cream)", border: `1px solid ${i === 0 ? "var(--color-hw-clay)40" : "var(--color-hw-border)"}` }}>
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{rec.protocol.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: i === 0 ? "var(--color-hw-clay)" : "var(--color-hw-cream-dk)", color: i === 0 ? "#fff" : "var(--color-hw-text-muted)" }}>
                    {i === 0 ? "Primary" : "Alternative"}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>{rec.protocol.durationMin} min</span>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>{rec.rationale}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {rec.protocol.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session plan summary */}
      {state.areas.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>Session Plan</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--color-hw-clay)", color: "#fff" }}>
              {state.areas.length} active area{state.areas.length > 1 ? "s" : ""}
            </span>
          </div>
          {state.areas.map((a) => (
            <div key={a.regionId} className="flex items-center justify-between py-1.5 text-xs border-b last:border-0" style={{ borderColor: "var(--color-hw-border)" }}>
              <span className="font-semibold" style={{ color: "var(--color-hw-text)" }}>{getRegionLabel(a.regionId)}</span>
              <span style={{ color: "var(--color-hw-text-muted)" }}>Pain {a.discomfort}/9 · {a.duration || "duration unset"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function SessionManagerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientParam = searchParams.get("client") as PatientId | null;

  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<SessionMode>("choose");
  const [step, setStep] = useState<Step>(1);
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    areas: [], romFindings: [], dailyActivities: [], sleepPosture: "",
    activitiesWorse: [], activitiesBetter: [], tolerancePos: "", remarks: "",
  });

  useEffect(() => {
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
    else setMounted(true);
  }, [router]);

  if (!mounted) return null;

  const clientName = clientParam && PATIENTS[clientParam] ? PATIENTS[clientParam].name : null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Session Manager</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Intelligent Mapping and Customize Sessions</p>
      </div>

      {mode === "choose" && (
        <div className="space-y-6">
          {/* Session client */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Session Client</p>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: "var(--color-hw-text-muted)" }}>
                {clientName ? `Client: ${clientName}` : "Proceeding as Guest. No client history will be saved."}
              </p>
              <div className="flex gap-2">
                {clientParam
                  ? <span className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--color-hw-clay)", color: "#fff" }}>
                      {clientName}
                    </span>
                  : <>
                      <Link href="/practitioner/clients">
                        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>Client</button>
                      </Link>
                      <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--color-hw-black)", color: "#fff" }}>Guest</button>
                      <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>+ New Client</button>
                    </>}
              </div>
            </div>
          </div>

          {/* Session type */}
          <div>
            <p className="text-sm font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>Choose Session Type</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setMode("guided")}
                className="rounded-2xl p-6 text-left space-y-2 transition-shadow hover:shadow-md"
                style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--color-hw-cream)" }}>
                  <span className="text-lg">📋</span>
                </div>
                <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Guided Assessment</p>
                <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>Analyze movement and generate a recommended session configuration.</p>
              </button>
              <button onClick={() => setMode("quickstart")}
                className="rounded-2xl p-6 text-left space-y-2 transition-shadow hover:shadow-md"
                style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--color-hw-cream)" }}>
                  <Zap size={18} style={{ color: "var(--color-hw-clay)" }} />
                </div>
                <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Quick Start Session</p>
                <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>Manually configure and start your session immediately.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "guided" && (
        <div>
          <StepBar step={step} />

          <div className="min-h-96">
            {step === 1 && <Step1 state={assessmentState} setState={setAssessmentState} />}
            {step === 2 && <Step2 state={assessmentState} setState={setAssessmentState} />}
            {step === 3 && <Step3 state={assessmentState} setState={setAssessmentState} />}
            {step === 4 && <Step4 state={assessmentState} setState={setAssessmentState} clientId={clientParam ?? undefined} />}
          </div>

          <div className="flex items-center justify-between mt-8 pt-5 border-t" style={{ borderColor: "var(--color-hw-border)" }}>
            <button
              onClick={() => step > 1 ? setStep((s) => (s - 1) as Step) : setMode("choose")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
              <ChevronLeft size={15} />
              {step === 1 ? "Back" : "Previous"}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
                {assessmentState.areas.length} device{assessmentState.areas.length !== 1 ? "s" : ""} ready
              </span>
              {step < 4 && (
                <button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: "var(--color-hw-black)" }}>
                  <Play size={13} fill="white" />
                  {step === 3 ? "Final Remarks" : "Next"}
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === "quickstart" && (
        <div className="rounded-2xl p-8 text-center space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <Zap size={32} style={{ color: "var(--color-hw-clay)", margin: "0 auto" }} />
          <p className="font-bold text-lg" style={{ color: "var(--color-hw-text)" }}>Quick Start Session</p>
          <p className="text-sm" style={{ color: "var(--color-hw-text-muted)" }}>Select devices and protocols directly to start immediately.</p>
          <button onClick={() => setMode("choose")} className="text-sm underline" style={{ color: "var(--color-hw-text-muted)" }}>
            ← Back to session type
          </button>
        </div>
      )}
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionManagerInner />
    </Suspense>
  );
}
