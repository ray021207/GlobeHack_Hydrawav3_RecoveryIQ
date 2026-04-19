type BrandProps = {
  variant?: "dark" | "light";
  showRecoveryIQ?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: { wordmark: "text-sm",  sublabel: "text-[9px]",  markW: 22 },
  md: { wordmark: "text-base", sublabel: "text-[10px]", markW: 26 },
  lg: { wordmark: "text-xl",  sublabel: "text-xs",     markW: 34 },
};

export function Mark({ size = 26, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M6 8 C6 8, 12 4, 16 10 C20 16, 14 18, 16 22 C18 26, 24 24, 26 20"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <text x="18" y="23" fontSize="14" fontWeight="800" fill={color} fontFamily="var(--font-manrope), system-ui">
        3
      </text>
    </svg>
  );
}

export function Brand({
  variant = "dark",
  showRecoveryIQ = true,
  size = "md",
  className = "",
}: BrandProps) {
  const s = SIZES[size];
  const primary = variant === "dark" ? "#ffffff" : "var(--color-hw-text)";
  const secondary = variant === "dark" ? "rgba(255,255,255,0.55)" : "var(--color-hw-text-muted)";
  const accent = "var(--color-hw-clay)";

  return (
    <div className={`flex items-center gap-2.5 font-display ${className}`}>
      <Mark size={s.markW} color={accent} />
      <div className="leading-none">
        <div className={`${s.wordmark} font-extrabold tracking-[0.08em]`} style={{ color: primary }}>
          HYDRAWAV<span style={{ color: accent }}>3</span>
        </div>
        {showRecoveryIQ && (
          <div
            className={`${s.sublabel} font-semibold tracking-[0.22em] uppercase mt-1`}
            style={{ color: secondary }}
          >
            + RecoveryIQ
          </div>
        )}
      </div>
    </div>
  );
}
