"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Send } from "lucide-react";

const REGIONS = ["Shoulder", "Low Back", "Neck", "Hip", "Knee", "Ankle", "Wrist / Elbow", "Full Body"];
const PROFILES = [
  { value: "musculoskeletal_tightness", label: "Musculoskeletal Tightness" },
  { value: "chronic_pain",              label: "Chronic Pain" },
  { value: "athletic_recovery",         label: "Athletic Recovery" },
  { value: "acute_inflammatory",        label: "Acute / Inflammatory" },
  { value: "post_surgical",             label: "Post-Surgical" },
  { value: "neurological",              label: "Neurological" },
];
const DURATIONS = [
  { value: "less_6wk",   label: "< 6 weeks" },
  { value: "6wk_3mo",    label: "6 weeks – 3 months" },
  { value: "3_6mo",      label: "3 – 6 months" },
  { value: "6mo_1yr",    label: "6 months – 1 year" },
  { value: "over_1yr",   label: "> 1 year" },
];
const SLEEP_POSTURES = ["On Back", "On Stomach", "Left Side", "Right Side", "Changes Positions"];
const ACTIVITIES = ["Office / Desk Work", "Standing Work", "Manual Labour", "Sports / Training", "Yoga / Mobility", "Running / Cycling", "Prolonged Driving"];

type Step = "info" | "profile" | "lifestyle" | "done";

interface FormData {
  name: string;
  age: string;
  phone: string;
  email: string;
  primaryRegion: string;
  discomfortLevel: number;
  conditionDuration: string;
  dysfunctionProfile: string;
  priorInjuries: string;
  sleepPosture: string;
  activities: string[];
}

const INITIAL: FormData = {
  name: "", age: "", phone: "", email: "",
  primaryRegion: "", discomfortLevel: 5,
  conditionDuration: "", dysfunctionProfile: "",
  priorInjuries: "", sleepPosture: "", activities: [],
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-hw-text-muted)" }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
      style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}
    />
  );
}

function ChipGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={value === o
            ? { background: "var(--color-hw-clay)", color: "#fff" }
            : { background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
          {o}
        </button>
      ))}
    </div>
  );
}

function MultiChip({ options, values, onChange }: { options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  function toggle(o: string) {
    onChange(values.includes(o) ? values.filter((x) => x !== o) : [...values, o]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => toggle(o)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={values.includes(o)
            ? { background: "var(--color-hw-clay)", color: "#fff" }
            : { background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState<FormData>(INITIAL);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function canProceedInfo() {
    return form.name.trim() && form.age && form.phone.trim();
  }

  function canProceedProfile() {
    return form.primaryRegion && form.conditionDuration && form.dysfunctionProfile;
  }

  function handleSubmit() {
    const id = `client_${Date.now()}`;
    const newClient = {
      id,
      name: form.name.trim(),
      age: parseInt(form.age) || 0,
      phone: form.phone.trim(),
      email: form.email.trim(),
      dysfunction_profile: form.dysfunctionProfile,
      primary_region: form.primaryRegion.toLowerCase().replace(/ \/ /g, "_").replace(/ /g, "_"),
      prior_injuries: form.priorInjuries ? form.priorInjuries.split(",").map((s) => s.trim().toLowerCase().replace(/ /g, "_")) : [],
      sleep_posture: form.sleepPosture.toLowerCase().replace(/ /g, "_"),
      discomfort_level: form.discomfortLevel,
      condition_duration: form.conditionDuration,
      activity_ranking: form.activities.map((a) => a.split(" ")[0].toLowerCase()),
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem("riq_extra_clients") ?? "[]");
      existing.push(newClient);
      localStorage.setItem("riq_extra_clients", JSON.stringify(existing));
    }
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: "#00bb7f20" }}>
          <Check size={36} style={{ color: "var(--color-hw-green)" }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>
            {form.name} added!
          </h2>
          <p className="text-sm mt-2 max-w-sm mx-auto" style={{ color: "var(--color-hw-text-muted)" }}>
            A welcome SMS has been sent to <strong>{form.phone}</strong> with their login link and onboarding instructions.
          </p>
        </div>
        <div className="rounded-2xl p-5 text-left space-y-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>Summary</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {[
              ["Name", form.name],
              ["Age", form.age],
              ["Phone", form.phone],
              ["Primary Region", form.primaryRegion],
              ["Discomfort", `${form.discomfortLevel}/10`],
              ["Duration", DURATIONS.find((d) => d.value === form.conditionDuration)?.label ?? "—"],
              ["Profile", PROFILES.find((d) => d.value === form.dysfunctionProfile)?.label ?? "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <span style={{ color: "var(--color-hw-text-muted)" }}>{label}: </span>
                <span className="font-semibold" style={{ color: "var(--color-hw-text)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/practitioner/clients">
            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}>
              Back to Clients
            </button>
          </Link>
          <button onClick={() => router.push("/practitioner/session")}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-hw-clay)" }}>
            Start Session →
          </button>
        </div>
      </div>
    );
  }

  const STEPS: Step[] = ["info", "profile", "lifestyle"];
  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/practitioner/clients">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
            <ArrowLeft size={16} style={{ color: "var(--color-hw-text-muted)" }} />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>New Client Intake</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Step {stepIdx + 1} of 3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: i <= stepIdx ? "var(--color-hw-clay)" : "var(--color-hw-border)" }} />
        ))}
      </div>

      <div className="rounded-2xl p-6 space-y-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>

        {/* Step 1: Basic info */}
        {step === "info" && (
          <>
            <h2 className="text-base font-bold" style={{ color: "var(--color-hw-text)" }}>Client Information</h2>
            <div className="space-y-4">
              <div>
                <FieldLabel>Full Name *</FieldLabel>
                <TextInput value={form.name} onChange={(v) => set("name", v)} placeholder="e.g. Alex Johnson" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Age *</FieldLabel>
                  <TextInput value={form.age} onChange={(v) => set("age", v)} placeholder="e.g. 38" />
                </div>
                <div>
                  <FieldLabel>Phone *</FieldLabel>
                  <TextInput value={form.phone} onChange={(v) => set("phone", v)} placeholder="+1 602 555 0100" />
                </div>
              </div>
              <div>
                <FieldLabel>Email (optional)</FieldLabel>
                <TextInput value={form.email} onChange={(v) => set("email", v)} placeholder="alex@example.com" />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Clinical profile */}
        {step === "profile" && (
          <>
            <h2 className="text-base font-bold" style={{ color: "var(--color-hw-text)" }}>Recovery Profile</h2>
            <div className="space-y-5">
              <div>
                <FieldLabel>Primary Body Region *</FieldLabel>
                <ChipGroup options={REGIONS} value={form.primaryRegion} onChange={(v) => set("primaryRegion", v)} />
              </div>
              <div>
                <FieldLabel>Discomfort Level (1–10) *</FieldLabel>
                <div className="flex items-center gap-3">
                  <input type="range" min={1} max={10} value={form.discomfortLevel}
                    onChange={(e) => set("discomfortLevel", parseInt(e.target.value))}
                    className="flex-1 accent-[var(--color-hw-clay)]" />
                  <span className="text-xl font-bold w-8 text-center" style={{ color: "var(--color-hw-clay)" }}>
                    {form.discomfortLevel}
                  </span>
                </div>
              </div>
              <div>
                <FieldLabel>Condition Duration *</FieldLabel>
                <ChipGroup options={DURATIONS.map((d) => d.label)} value={DURATIONS.find((d) => d.value === form.conditionDuration)?.label ?? ""}
                  onChange={(v) => set("conditionDuration", DURATIONS.find((d) => d.label === v)?.value ?? "")} />
              </div>
              <div>
                <FieldLabel>Dysfunction Profile *</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {PROFILES.map((p) => (
                    <button key={p.value} onClick={() => set("dysfunctionProfile", p.value)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                      style={form.dysfunctionProfile === p.value
                        ? { background: "var(--color-hw-clay)", color: "#fff" }
                        : { background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Prior Injuries (comma-separated)</FieldLabel>
                <TextInput value={form.priorInjuries} onChange={(v) => set("priorInjuries", v)} placeholder="e.g. right shoulder, left knee" />
              </div>
            </div>
          </>
        )}

        {/* Step 3: Lifestyle */}
        {step === "lifestyle" && (
          <>
            <h2 className="text-base font-bold" style={{ color: "var(--color-hw-text)" }}>Lifestyle & Habits</h2>
            <p className="text-xs -mt-3" style={{ color: "var(--color-hw-text-muted)" }}>
              Used to auto-generate the client's personalised Lifestyle Tab — no extra questions needed at the session.
            </p>
            <div className="space-y-5">
              <div>
                <FieldLabel>Sleep Posture</FieldLabel>
                <ChipGroup options={SLEEP_POSTURES} value={form.sleepPosture} onChange={(v) => set("sleepPosture", v)} />
              </div>
              <div>
                <FieldLabel>Daily Activities (select all that apply)</FieldLabel>
                <MultiChip options={ACTIVITIES} values={form.activities} onChange={(v) => set("activities", v)} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            const prev: Step[] = ["info", "info", "profile"];
            setStep(prev[stepIdx]);
          }}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)", visibility: stepIdx === 0 ? "hidden" : "visible" }}>
          ← Back
        </button>

        {step !== "lifestyle" ? (
          <button
            onClick={() => {
              const next: Step[] = ["profile", "lifestyle", "done"];
              setStep(next[stepIdx]);
            }}
            disabled={step === "info" ? !canProceedInfo() : !canProceedProfile()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: "var(--color-hw-clay)" }}>
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: "var(--color-hw-clay)" }}>
            <Send size={14} />
            Add Client & Send SMS
          </button>
        )}
      </div>
    </div>
  );
}
