"use client";

export type BodyRegion = {
  id: string;
  label: string;
  side?: "left" | "right" | "bilateral";
  view: "front" | "back";
  path: string;
};

// ── Front regions - Clean geometric body map ──────────────────────────────────
// ViewBox: 0 0 200 360  |  figure centered at x=100
const FRONT_REGIONS: BodyRegion[] = [
  // HEAD
  { id: "head", label: "Head", view: "front", path: "M80,4 L120,4 L120,40 L80,40 Z" },
  
  // NECK & SHOULDERS
  { id: "neck", label: "Neck", view: "front", path: "M92,40 L108,40 L108,48 L92,48 Z" },
  { id: "shoulder_l", label: "Left Shoulder", side: "left", view: "front", path: "M70,48 L92,48 L92,70 L70,70 Z" },
  { id: "shoulder_r", label: "Right Shoulder", side: "right", view: "front", path: "M108,48 L130,48 L130,70 L108,70 Z" },
  
  // UPPER ARMS
  { id: "upper_arm_l", label: "Left Upper Arm", side: "left", view: "front", path: "M50,70 L70,70 L70,135 L50,135 Z" },
  { id: "upper_arm_r", label: "Right Upper Arm", side: "right", view: "front", path: "M130,70 L150,70 L150,135 L130,135 Z" },
  
  // CHEST
  { id: "chest_l", label: "Left Chest", side: "left", view: "front", path: "M70,70 L100,70 L100,160 L70,160 Z" },
  { id: "chest_r", label: "Right Chest", side: "right", view: "front", path: "M100,70 L130,70 L130,160 L100,160 Z" },
  
  // FOREARMS
  { id: "forearm_l", label: "Left Forearm", side: "left", view: "front", path: "M50,135 L70,135 L70,220 L50,220 Z" },
  { id: "forearm_r", label: "Right Forearm", side: "right", view: "front", path: "M130,135 L150,135 L150,220 L130,220 Z" },
  
  // ABDOMEN
  { id: "abdomen_l", label: "Left Abdomen", side: "left", view: "front", path: "M70,160 L100,160 L100,235 L70,235 Z" },
  { id: "abdomen_r", label: "Right Abdomen", side: "right", view: "front", path: "M100,160 L130,160 L130,235 L100,235 Z" },
  
  // HANDS
  { id: "hand_l", label: "Left Hand", side: "left", view: "front", path: "M50,220 L70,220 L70,235 L50,235 Z" },
  { id: "hand_r", label: "Right Hand", side: "right", view: "front", path: "M130,220 L150,220 L150,235 L130,235 Z" },
  
  // THIGHS
  { id: "thigh_l", label: "Left Thigh", side: "left", view: "front", path: "M75,235 L100,235 L100,260 L75,260 Z" },
  { id: "thigh_r", label: "Right Thigh", side: "right", view: "front", path: "M100,235 L125,235 L125,260 L100,260 Z" },
  
  // LOWER LEGS
  { id: "shin_l", label: "Left Shin", side: "left", view: "front", path: "M60,260 L80,260 L80,330 L60,330 Z" },
  { id: "shin_r", label: "Right Shin", side: "right", view: "front", path: "M120,260 L140,260 L140,330 L120,330 Z" },
  
  // FEET
  { id: "foot_l", label: "Left Foot", side: "left", view: "front", path: "M60,330 L75,330 L75,340 L60,340 Z" },
  { id: "foot_r", label: "Right Foot", side: "right", view: "front", path: "M125,330 L140,330 L140,340 L125,340 Z" },
];

// ── Back regions - Clean geometric body map ──────────────────────────────────
const BACK_REGIONS: BodyRegion[] = [
  // HEAD
  { id: "head_back", label: "Head", view: "back", path: "M80,4 L120,4 L120,40 L80,40 Z" },
  
  // NECK
  { id: "neck_back", label: "Neck", view: "back", path: "M92,40 L108,40 L108,48 L92,48 Z" },
  
  // SHOULDERS
  { id: "shoulder_back_l", label: "Left Shoulder", side: "left", view: "back", path: "M70,48 L92,48 L92,70 L70,70 Z" },
  { id: "shoulder_back_r", label: "Right Shoulder", side: "right", view: "back", path: "M108,48 L130,48 L130,70 L108,70 Z" },
  
  // UPPER BACK
  { id: "upper_back", label: "Upper Back", view: "back", path: "M70,70 L130,70 L130,100 L70,100 Z" },
  
  // REAR UPPER ARMS
  { id: "rear_upper_arm_l", label: "Left Upper Arm", side: "left", view: "back", path: "M50,70 L70,70 L70,135 L50,135 Z" },
  { id: "rear_upper_arm_r", label: "Right Upper Arm", side: "right", view: "back", path: "M130,70 L150,70 L150,135 L130,135 Z" },
  
  // MID BACK
  { id: "mid_back", label: "Mid Back", view: "back", path: "M70,100 L130,100 L130,180 L70,180 Z" },
  
  // REAR FOREARMS
  { id: "rear_forearm_l", label: "Left Forearm", side: "left", view: "back", path: "M50,135 L70,135 L70,220 L50,220 Z" },
  { id: "rear_forearm_r", label: "Right Forearm", side: "right", view: "back", path: "M130,135 L150,135 L150,220 L130,220 Z" },
  
  // LOWER BACK
  { id: "lower_back_l", label: "Left Lower Back", side: "left", view: "back", path: "M70,180 L100,180 L100,235 L70,235 Z" },
  { id: "lower_back_r", label: "Right Lower Back", side: "right", view: "back", path: "M100,180 L130,180 L130,235 L100,235 Z" },
  
  // REAR HANDS
  { id: "rear_hand_l", label: "Left Hand", side: "left", view: "back", path: "M50,220 L70,220 L70,235 L50,235 Z" },
  { id: "rear_hand_r", label: "Right Hand", side: "right", view: "back", path: "M130,220 L150,220 L150,235 L130,235 Z" },
  
  // REAR THIGHS
  { id: "rear_thigh_l", label: "Left Thigh", side: "left", view: "back", path: "M75,235 L100,235 L100,260 L75,260 Z" },
  { id: "rear_thigh_r", label: "Right Thigh", side: "right", view: "back", path: "M100,235 L125,235 L125,260 L100,260 Z" },
  
  // REAR CALVES / LOWER LEGS
  { id: "calf_l", label: "Left Calf", side: "left", view: "back", path: "M60,260 L80,260 L80,330 L60,330 Z" },
  { id: "calf_r", label: "Right Calf", side: "right", view: "back", path: "M120,260 L140,260 L140,330 L120,330 Z" },
  
  // REAR FEET
  { id: "rear_foot_l", label: "Left Foot", side: "left", view: "back", path: "M60,330 L75,330 L75,340 L60,340 Z" },
  { id: "rear_foot_r", label: "Right Foot", side: "right", view: "back", path: "M125,330 L140,330 L140,340 L125,340 Z" },
];

// ── Silhouette outline paths (clean geometric style) ─────────────────────────
const FRONT_SILHOUETTE = `
  M100,4
  C88,4 80,12 80,22 C80,32 88,40 100,40
  C112,40 120,32 120,22 C120,12 112,4 100,4 Z
  M70,48 L130,48
  L130,70 L70,70 Z
  M50,70 L70,70
  L70,135 L50,135 Z
  M130,70 L150,70
  L150,135 L130,135 Z
  M70,70 L130,70
  L130,160 L70,160 Z
  M65,160 L75,160
  L75,235 L65,235 Z
  M125,160 L135,160
  L135,235 L125,235 Z
  M75,160 L125,160
  L125,235 L75,235 Z
  M65,235 L75,235
  L75,260 L65,260 Z
  M125,235 L135,235
  L135,260 L125,260 Z
  M75,235 L125,235
  L125,260 L75,260 Z
  M60,260 L80,260
  L80,330 L60,330 Z
  M120,260 L140,260
  L140,330 L120,330 Z
`;

const BACK_SILHOUETTE = `
  M100,4
  C88,4 80,12 80,22 C80,32 88,40 100,40
  C112,40 120,32 120,22 C120,12 112,4 100,4 Z
  M70,48 L130,48
  L130,70 L70,70 Z
  M50,70 L70,70
  L70,135 L50,135 Z
  M130,70 L150,70
  L150,135 L130,135 Z
  M70,70 L130,70
  L130,180 L70,180 Z
  M65,180 L75,180
  L75,235 L65,235 Z
  M125,180 L135,180
  L135,235 L125,235 Z
  M75,180 L125,180
  L125,235 L75,235 Z
  M65,235 L75,235
  L75,260 L65,260 Z
  M125,235 L135,235
  L135,260 L125,260 Z
  M75,235 L125,235
  L125,260 L75,260 Z
  M60,260 L80,260
  L80,330 L60,330 Z
  M120,260 L140,260
  L140,330 L120,330 Z
`;

// ── Component ─────────────────────────────────────────────────────────────────
interface BodyMapProps {
  selected: string[];
  onToggle: (regionId: string) => void;
  size?: number;
}

function SilhouetteSVG({
  view,
  regions,
  selected,
  onToggle,
  size,
}: {
  view: "front" | "back";
  regions: BodyRegion[];
  selected: string[];
  onToggle: (id: string) => void;
  size: number;
}) {
  const W = 200;
  const H = 360;
  const displayW = size * (W / H);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-hw-text-muted)" }}>
        {view === "front" ? "Front View" : "Back View"}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={displayW}
        height={size}
        style={{ cursor: "pointer", overflow: "visible" }}
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="body-shadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000030" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Full silhouette background - Dark navy/teal */}
        <path
          d={view === "front" ? FRONT_SILHOUETTE : BACK_SILHOUETTE}
          fill="#2c3e50"
          filter="url(#body-shadow)"
        />

        {/* Segment divider lines - Clean white segments */}
        {[
          // Head outline
          "M80,4 L120,4",
          "M80,40 L120,40",
          "M80,4 L80,40",
          "M120,4 L120,40",
          
          // Neck
          "M92,48 L108,48",
          
          // Shoulder/neck lines
          "M70,48 L130,48",
          "M70,70 L130,70",
          "M92,48 L92,70",
          "M108,48 L108,70",
          
          // Arm lines
          "M50,70 L70,70",
          "M130,70 L150,70",
          "M50,135 L70,135",
          "M130,135 L150,135",
          "M50,235 L70,235",
          "M130,235 L150,235",
          
          // Torso vertical lines
          "M70,70 L70,235",
          "M130,70 L130,235",
          "M100,70 L100,235",
          
          // Abdomen/lower torso divisions
          "M70,160 L130,160",
          
          // Thigh lines
          "M75,235 L125,235",
          "M75,260 L125,260",
          "M100,235 L100,260",
          
          // Leg lines
          "M60,260 L80,260",
          "M120,260 L140,260",
          "M60,330 L80,330",
          "M120,330 L140,330",
          "M60,260 L60,330",
          "M80,260 L80,330",
          "M120,260 L120,330",
          "M140,260 L140,330",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#f5f5f5" strokeWidth="2" fill="none" opacity="0.95" />
        ))}

        {/* Clickable region overlays */}
        {regions.map((r) => {
          const isSelected = selected.includes(r.id);
          return (
            <path
              key={r.id}
              d={r.path}
              fill={isSelected ? "#d4a574" : "transparent"}
              opacity={isSelected ? 0.7 : 0}
              stroke={isSelected ? "#e8c4a0" : "transparent"}
              strokeWidth="1.5"
              onClick={() => onToggle(r.id)}
              style={{ cursor: "pointer", transition: "opacity 0.15s, fill 0.15s" }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as SVGPathElement).style.fill = "#d4a574";
                  (e.currentTarget as SVGPathElement).style.opacity = "0.4";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as SVGPathElement).style.fill = "transparent";
                  (e.currentTarget as SVGPathElement).style.opacity = "0";
                }
              }}
            />
          );
        })}

        {/* Invisible wide hit-zones for easier tapping */}
        {regions.map((r) => (
          <path
            key={`hit-${r.id}`}
            d={r.path}
            fill="transparent"
            onClick={() => onToggle(r.id)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Selected indicators - subtle highlight */}
        {regions
          .filter((r) => selected.includes(r.id))
          .map((r) => {
            const pts = r.path.match(/[\d.]+,[\d.]+/g) ?? [];
            if (pts.length === 0) return null;
            const xs = pts.map((p) => parseFloat(p.split(",")[0]));
            const ys = pts.map((p) => parseFloat(p.split(",")[1]));
            const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
            const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
            return (
              <circle
                key={`dot-${r.id}`}
                cx={cx} cy={cy} r="4"
                fill="#fff"
                opacity="0.85"
                style={{ pointerEvents: "none" }}
              />
            );
          })}
      </svg>
    </div>
  );
}

export function BodyMap({ selected, onToggle, size = 320 }: BodyMapProps) {
  return (
    <div className="flex gap-6 justify-center">
      <SilhouetteSVG view="front" regions={FRONT_REGIONS} selected={selected} onToggle={onToggle} size={size} />
      <SilhouetteSVG view="back" regions={BACK_REGIONS} selected={selected} onToggle={onToggle} size={size} />
    </div>
  );
}

export function getRegionLabel(id: string): string {
  return [...FRONT_REGIONS, ...BACK_REGIONS].find((r) => r.id === id)?.label ?? id;
}

export const ALL_REGIONS = [...FRONT_REGIONS, ...BACK_REGIONS];
