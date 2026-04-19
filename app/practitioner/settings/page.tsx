"use client";
import { useState } from "react";
import { Bell, Shield, Smartphone, Building2 } from "lucide-react";

const SECTIONS = [
  {
    icon: Building2, title: "Practice Info",
    fields: [
      { label: "Practice Name", value: "Annie Sturm Wellness Clinic" },
      { label: "Practitioner", value: "Annie Sturm" },
      { label: "Email", value: "annie@hydrawav3.studio" },
    ],
  },
  {
    icon: Bell, title: "Notifications",
    toggles: [
      { label: "Pre-visit assessment submitted", on: true },
      { label: "Client check-in received", on: true },
      { label: "Compensation index flag", on: true },
      { label: "Weekly outcomes digest", on: false },
    ],
  },
  {
    icon: Smartphone, title: "SMS Check-ins (Twilio)",
    fields: [
      { label: "From Number", value: "+1 602 555 0199" },
      { label: "Day 3 message", value: "Hi {name}! Quick 10-sec check-in 👋" },
      { label: "Day 7 message", value: "Hi {name}! Time for your movement check 📹" },
      { label: "Day 14 message", value: "Hi {name}! 2-week follow-up — how are you feeling?" },
    ],
  },
  {
    icon: Shield, title: "Privacy & Compliance",
    items: [
      "MediaPipe runs fully on-device — zero video transmitted",
      "Only numerical scores sync to cloud (HIPAA-aligned)",
      "All data encrypted at rest and in transit",
      "Patients access check-ins via SMS link — no account required",
    ],
  },
];

export default function SettingsPage() {
  const [toasts, setToasts] = useState<Record<string, boolean>>({});

  function save(label: string) {
    setToasts((t) => ({ ...t, [label]: true }));
    setTimeout(() => setToasts((t) => ({ ...t, [label]: false })), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Practice and notification preferences.</p>
      </div>

      {SECTIONS.map(({ icon: Icon, title, fields, toggles, items }) => (
        <div key={title} className="rounded-2xl p-6 space-y-4" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: "var(--color-hw-border)" }}>
            <Icon size={17} style={{ color: "var(--color-hw-text-muted)" }} />
            <h2 className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{title}</h2>
          </div>

          {fields?.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-hw-text-muted)" }}>{label}</p>
              <div className="flex gap-2">
                <input defaultValue={value} className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }} />
                <button onClick={() => save(label)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold"
                  style={{ background: toasts[label] ? "#00bb7f20" : "var(--color-hw-cream)", color: toasts[label] ? "var(--color-hw-green)" : "var(--color-hw-text-muted)", border: "1px solid var(--color-hw-border)" }}>
                  {toasts[label] ? "Saved ✓" : "Save"}
                </button>
              </div>
            </div>
          ))}

          {toggles?.map(({ label, on }) => {
            const [active, setActive] = useState(on);
            return (
              <div key={label} className="flex items-center justify-between py-1">
                <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>{label}</p>
                <button onClick={() => setActive(!active)}
                  className="w-10 h-6 rounded-full relative transition-all"
                  style={{ background: active ? "var(--color-hw-clay)" : "var(--color-hw-border)" }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                    style={{ left: active ? "calc(100% - 1.375rem)" : "2px" }} />
                </button>
              </div>
            );
          })}

          {items?.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--color-hw-green)" }} />
              <p className="text-sm" style={{ color: "var(--color-hw-text-muted)" }}>{item}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
