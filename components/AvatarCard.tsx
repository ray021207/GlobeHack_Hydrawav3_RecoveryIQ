"use client";

const ANIMAL_EMOJI: Record<string, string> = { fox: "🦊", wolf: "🐺", bear: "🐻", eagle: "🦅", lion: "🦁" };
const GRADIENTS: Record<string, string> = {
  fox:   "linear-gradient(135deg,#f97316,#fbbf24)",
  wolf:  "linear-gradient(135deg,#475569,#94a3b8)",
  bear:  "linear-gradient(135deg,#78350f,#b45309)",
  eagle: "linear-gradient(135deg,#1e40af,#93c5fd)",
  lion:  "linear-gradient(135deg,#b45309,#fbbf24)",
};

type Props = {
  animal: string;
  score: number;
  name?: string;
  accessory?: string | null;
  size?: number;
  showState?: boolean;
};

function getState(score: number) {
  if (score >= 76) return { label: "Peak Form", ring: "#c9962a", particle: "🔥" };
  if (score >= 51) return { label: "Thriving",  ring: "#22c55e", particle: "⚡" };
  if (score >= 26) return { label: "Recovering", ring: "#3b82f6", particle: "🌱" };
  return { label: "Resting", ring: "#94a3b8", particle: "💤" };
}

export function AvatarCard({ animal, score, name, size = 96, showState = true }: Props) {
  const state = getState(score);
  const emoji = ANIMAL_EMOJI[animal] ?? "🦊";
  const gradient = GRADIENTS[animal] ?? GRADIENTS.fox;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size, background: gradient, boxShadow: `0 0 0 3px ${state.ring}, 0 0 16px ${state.ring}40` }}>
        <span style={{ fontSize: size * 0.5 }} role="img">{emoji}</span>
        {showState && (
          <div className="absolute flex items-center justify-center rounded-full bg-white shadow-md"
            style={{ top: -4, right: -4, width: size * 0.28, height: size * 0.28, fontSize: size * 0.14 }}>
            {state.particle}
          </div>
        )}
      </div>
      {name && <p className="text-sm font-bold" style={{ color: "var(--color-hw-navy)" }}>{name}</p>}
      {showState && (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: `${state.ring}20`, color: state.ring, border: `1px solid ${state.ring}50` }}>
          {state.particle} {state.label}
        </span>
      )}
    </div>
  );
}

export function AvatarBubble({ animal, score = 50, size = 36 }: { animal: string; score?: number; size?: number }) {
  const state = getState(score);
  return (
    <div className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: size, height: size, background: GRADIENTS[animal] ?? GRADIENTS.fox, boxShadow: `0 0 0 2px ${state.ring}`, fontSize: size * 0.5 }}>
      {ANIMAL_EMOJI[animal] ?? "🦊"}
    </div>
  );
}
