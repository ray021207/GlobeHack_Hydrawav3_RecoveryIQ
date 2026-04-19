"use client";

type Props = { score: number; size?: number; strokeWidth?: number };

export function RecoveryScore({ score, size = 120, strokeWidth = 10 }: Props) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "var(--color-hw-green)" : score >= 40 ? "var(--color-hw-amber)" : "var(--color-hw-red)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--color-hw-border)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold" style={{ fontSize: size * 0.22, color: "var(--color-hw-navy)" }}>{score}</span>
        <span style={{ fontSize: size * 0.1, color: "var(--color-hw-muted)" }}>/ 100</span>
      </div>
    </div>
  );
}
