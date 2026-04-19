"use client";
import { useState, useEffect } from "react";
import { getGamification, saveGamification, type PatientId } from "@/lib/mock-data";

const ANIMALS = [
  { id: "fox",   name: "Fox",   emoji: "🦊", cost: 0,   gradient: "linear-gradient(135deg,#f97316,#fbbf24)" },
  { id: "wolf",  name: "Wolf",  emoji: "🐺", cost: 50,  gradient: "linear-gradient(135deg,#475569,#94a3b8)" },
  { id: "bear",  name: "Bear",  emoji: "🐻", cost: 100, gradient: "linear-gradient(135deg,#78350f,#b45309)" },
  { id: "eagle", name: "Eagle", emoji: "🦅", cost: 150, gradient: "linear-gradient(135deg,#1e40af,#93c5fd)" },
  { id: "lion",  name: "Lion",  emoji: "🦁", cost: 200, gradient: "linear-gradient(135deg,#b45309,#fbbf24)" },
];

const ACCESSORIES = [
  { id: "crown",     name: "Crown",     emoji: "👑", cost: 30 },
  { id: "lightning", name: "Lightning", emoji: "⚡", cost: 20 },
  { id: "fire",      name: "Fire Aura", emoji: "🔥", cost: 40 },
  { id: "stars",     name: "Stars",     emoji: "✨", cost: 25 },
];

type Tab = "animals" | "accessories";

export default function AvatarPage() {
  const [userId, setUserId] = useState<PatientId>("maria");
  const [gam, setGam] = useState<ReturnType<typeof getGamification> | null>(null);
  const [tab, setTab] = useState<Tab>("animals");
  const [nameInput, setNameInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const id = (localStorage.getItem("riq_userId") || "maria") as PatientId;
    setUserId(id);
    const g = getGamification(id);
    setGam(g);
    setNameInput(g.avatar.name ?? "");
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function selectAnimal(animalId: string) {
    if (!gam) return;
    const animal = ANIMALS.find((a) => a.id === animalId)!;
    const unlocked = gam.gems >= animal.cost || animal.cost === 0;
    if (!unlocked) { showToast(`Need ${animal.cost} 💎 to unlock`); return; }
    if (gam.gems < animal.cost && animal.cost > 0) { showToast(`Not enough gems — you have ${gam.gems} 💎`); return; }
    const spent = gam.avatar.animal === animalId ? 0 : animal.cost;
    const updated = { ...gam, gems: gam.gems - spent, avatar: { ...gam.avatar, animal: animalId } };
    setGam(updated);
    saveGamification(userId, updated);
    showToast(`${animal.name} selected!`);
  }

  function toggleAccessory(accId: string) {
    if (!gam) return;
    const acc = ACCESSORIES.find((a) => a.id === accId)!;
    const owned = gam.avatar.accessory === accId;
    if (!owned && gam.gems < acc.cost) { showToast(`Need ${acc.cost} 💎 — you have ${gam.gems}`); return; }
    const updated = {
      ...gam,
      gems: owned ? gam.gems : gam.gems - acc.cost,
      avatar: { ...gam.avatar, accessory: owned ? null : accId },
    };
    setGam(updated);
    saveGamification(userId, updated);
    showToast(owned ? `${acc.name} removed` : `${acc.name} equipped!`);
  }

  function saveName() {
    if (!gam) return;
    const updated = { ...gam, avatar: { ...gam.avatar, name: nameInput.slice(0, 24) } };
    setGam(updated);
    saveGamification(userId, updated);
    setEditing(false);
    showToast("Name saved!");
  }

  if (!gam) return null;
  const currentAnimal = ANIMALS.find((a) => a.id === gam.avatar.animal) ?? ANIMALS[0];

  return (
    <div className="px-5 py-5 space-y-4 max-w-lg mx-auto">
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg"
          style={{ background: "var(--color-hw-navy)" }}>{toast}</div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>My Avatar</h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm"
          style={{ background: "rgba(201,150,42,0.12)", color: "var(--color-hw-gold)", border: "1px solid rgba(201,150,42,0.25)" }}>
          💎 {gam.gems}
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-2xl p-6 flex flex-col items-center gap-3" style={{ background: currentAnimal.gradient, border: "none" }}>
        <div className="w-28 h-28 rounded-full flex items-center justify-center text-6xl shadow-lg" style={{ background: "rgba(255,255,255,0.2)" }}>
          {currentAnimal.emoji}
          {gam.avatar.accessory && (
            <span className="absolute text-2xl" style={{ marginTop: "-60px", marginLeft: "60px" }}>
              {ACCESSORIES.find((a) => a.id === gam.avatar.accessory)?.emoji}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} maxLength={24}
                className="px-3 py-1.5 rounded-xl text-sm font-medium outline-none"
                style={{ background: "rgba(255,255,255,0.9)", color: "var(--color-hw-navy)" }}
                autoFocus onKeyDown={(e) => e.key === "Enter" && saveName()} />
              <button onClick={saveName} className="px-3 py-1.5 rounded-xl text-sm font-semibold" style={{ background: "var(--color-hw-navy)", color: "#fff" }}>Save</button>
              <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.3)", color: "#fff" }}>✕</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="px-4 py-1.5 rounded-xl text-sm font-medium" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
              ✏️ {gam.avatar.name || "Name your avatar"}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([["animals", "🐾 Animals"], ["accessories", "✨ Accessories"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={tab === key ? { background: "var(--color-hw-navy)", color: "#fff" } : { background: "var(--color-hw-card)", color: "var(--color-hw-navy)", border: "1px solid var(--color-hw-border)" }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "animals" && (
        <div className="grid grid-cols-1 gap-3">
          {ANIMALS.map((a) => {
            const isActive = gam.avatar.animal === a.id;
            const canAfford = a.cost === 0 || gam.gems >= a.cost;
            return (
              <div key={a.id} className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
                style={{ background: "var(--color-hw-card)", border: `2px solid ${isActive ? "var(--color-hw-gold)" : "var(--color-hw-border)"}` }}
                onClick={() => selectAnimal(a.id)}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shrink-0" style={{ background: a.gradient }}>{a.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm" style={{ color: "var(--color-hw-navy)" }}>{a.name}</p>
                    {isActive && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(201,150,42,0.15)", color: "var(--color-hw-gold)" }}>Active</span>}
                  </div>
                  {a.cost === 0 ? <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-green)" }}>Free — default</p>
                    : <p className="text-xs mt-0.5 font-bold" style={{ color: canAfford ? "var(--color-hw-gold)" : "var(--color-hw-muted)" }}>💎 {a.cost} gems</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "accessories" && (
        <div className="grid grid-cols-2 gap-3">
          {ACCESSORIES.map((acc) => {
            const owned = gam.avatar.accessory === acc.id;
            const canAfford = gam.gems >= acc.cost;
            return (
              <div key={acc.id} className="rounded-2xl p-4 cursor-pointer"
                style={{ background: "var(--color-hw-card)", border: `2px solid ${owned ? "var(--color-hw-teal)" : "var(--color-hw-border)"}` }}
                onClick={() => toggleAccessory(acc.id)}>
                <div className="text-3xl mb-2">{acc.emoji}</div>
                <p className="font-semibold text-sm" style={{ color: "var(--color-hw-navy)" }}>{acc.name}</p>
                {owned ? <p className="text-xs mt-0.5 font-bold" style={{ color: "var(--color-hw-teal)" }}>✓ Equipped</p>
                  : <p className="text-xs mt-0.5 font-bold" style={{ color: canAfford ? "var(--color-hw-gold)" : "var(--color-hw-muted)" }}>💎 {acc.cost}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
