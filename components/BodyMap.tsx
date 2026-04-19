"use client";

export type BodyRegion = {
  id: string;
  label: string;
  side?: "left" | "right" | "bilateral";
  view: "front" | "back";
  path: string;
};

// ── Front regions - Detailed medical body map ──────────────────────────────────
// ViewBox: 0 0 200 360  |  figure centered at x=100
const FRONT_REGIONS: BodyRegion[] = [
  // HEAD
  { id: "head_front_l", label: "Head Left", side: "left", view: "front", path: "M85,8 L100,8 L100,28 L85,28 Z" },
  { id: "head_front_r", label: "Head Right", side: "right", view: "front", path: "M100,8 L115,8 L115,28 L100,28 Z" },
  { id: "forehead", label: "Forehead", view: "front", path: "M85,8 L115,8 L115,18 L85,18 Z" },
  { id: "face", label: "Face", view: "front", path: "M85,18 L115,18 L115,36 L85,36 Z" },
  
  // NECK
  { id: "neck_front", label: "Neck", view: "front", path: "M92,36 L108,36 L108,48 L92,48 Z" },
  
  // SHOULDERS & UPPER CHEST
  { id: "shoulder_r", label: "Right Shoulder", side: "right", view: "front", path: "M60,48 L92,48 L92,62 L60,62 Z" },
  { id: "shoulder_l", label: "Left Shoulder", side: "left", view: "front", path: "M108,48 L140,48 L140,62 L108,62 Z" },
  { id: "upper_chest_c", label: "Upper Chest Center", view: "front", path: "M92,48 L108,48 L108,70 L92,70 Z" },
  
  // CHEST
  { id: "chest_l", label: "Left Chest", side: "left", view: "front", path: "M75,62 L100,62 L100,95 L75,95 Z" },
  { id: "chest_r", label: "Right Chest", side: "right", view: "front", path: "M100,62 L125,62 L125,95 L100,95 Z" },
  { id: "chest_center", label: "Chest Center", view: "front", path: "M92,62 L108,62 L108,80 L92,80 Z" },
  
  // UPPER ARMS
  { id: "upper_arm_l", label: "Left Upper Arm", side: "left", view: "front", path: "M48,62 L75,70 L75,115 L48,110 Z" },
  { id: "upper_arm_r", label: "Right Upper Arm", side: "right", view: "front", path: "M125,70 L152,62 L152,110 L125,115 Z" },
  
  // FOREARMS
  { id: "forearm_l", label: "Left Forearm", side: "left", view: "front", path: "M36,115 L60,120 L58,155 L34,150 Z" },
  { id: "forearm_r", label: "Right Forearm", side: "right", view: "front", path: "M140,120 L164,115 L166,150 L142,155 Z" },
  
  // HANDS
  { id: "hand_l", label: "Left Hand", side: "left", view: "front", path: "M28,155 L58,160 L56,175 L26,170 Z" },
  { id: "hand_r", label: "Right Hand", side: "right", view: "front", path: "M142,160 L172,155 L174,170 L144,175 Z" },
  
  // ABDOMEN
  { id: "abdomen_l", label: "Left Abdomen", side: "left", view: "front", path: "M75,95 L100,95 L100,135 L75,135 Z" },
  { id: "abdomen_r", label: "Right Abdomen", side: "right", view: "front", path: "M100,95 L125,95 L125,135 L100,135 Z" },
  { id: "abdomen_lower_l", label: "Lower Abdomen Left", side: "left", view: "front", path: "M80,135 L100,135 L100,160 L80,160 Z" },
  { id: "abdomen_lower_r", label: "Lower Abdomen Right", side: "right", view: "front", path: "M100,135 L120,135 L120,160 L100,160 Z" },
  
  // HIPS & GROIN
  { id: "groin_l", label: "Left Groin", side: "left", view: "front", path: "M78,160 L95,160 L95,175 L78,175 Z" },
  { id: "groin_r", label: "Right Groin", side: "right", view: "front", path: "M105,160 L122,160 L122,175 L105,175 Z" },
  
  // THIGHS
  { id: "thigh_l", label: "Left Thigh", side: "left", view: "front", path: "M70,175 L100,175 L100,235 L70,235 Z" },
  { id: "thigh_r", label: "Right Thigh", side: "right", view: "front", path: "M100,175 L130,175 L130,235 L100,235 Z" },
  
  // KNEES
  { id: "knee_l", label: "Left Knee", side: "left", view: "front", path: "M75,235 L100,235 L100,255 L75,255 Z" },
  { id: "knee_r", label: "Right Knee", side: "right", view: "front", path: "M100,235 L125,235 L125,255 L100,255 Z" },
  
  // LOWER LEGS / SHINS
  { id: "shin_l", label: "Left Shin", side: "left", view: "front", path: "M72,255 L100,255 L100,310 L72,310 Z" },
  { id: "shin_r", label: "Right Shin", side: "right", view: "front", path: "M100,255 L128,255 L128,310 L100,310 Z" },
  
  // FEET
  { id: "foot_l", label: "Left Foot", side: "left", view: "front", path: "M58,310 L98,310 L98,330 L58,330 Z" },
  { id: "foot_r", label: "Right Foot", side: "right", view: "front", path: "M102,310 L142,310 L142,330 L102,330 Z" },
];

// ── Back regions - Detailed medical body map ──────────────────────────────────
const BACK_REGIONS: BodyRegion[] = [
  // HEAD
  { id: "head_back_l", label: "Head Left Back", side: "left", view: "back", path: "M85,8 L100,8 L100,28 L85,28 Z" },
  { id: "head_back_r", label: "Head Right Back", side: "right", view: "back", path: "M100,8 L115,8 L115,28 L100,28 Z" },
  { id: "back_of_head", label: "Back of Head", view: "back", path: "M85,18 L115,18 L115,32 L85,32 Z" },
  
  // NECK
  { id: "neck_back", label: "Neck Back", view: "back", path: "M92,36 L108,36 L108,48 L92,48 Z" },
  
  // SHOULDERS
  { id: "shoulder_back_r", label: "Right Shoulder Back", side: "right", view: "back", path: "M60,48 L92,48 L92,62 L60,62 Z" },
  { id: "shoulder_back_l", label: "Left Shoulder Back", side: "left", view: "back", path: "M108,48 L140,48 L140,62 L108,62 Z" },
  
  // UPPER BACK
  { id: "upper_back", label: "Upper Back", view: "back", path: "M92,48 L108,48 L108,75 L92,75 Z" },
  { id: "trapezius_l", label: "Left Trapezius", side: "left", view: "back", path: "M75,62 L100,62 L100,85 L75,85 Z" },
  { id: "trapezius_r", label: "Right Trapezius", side: "right", view: "back", path: "M100,62 L125,62 L125,85 L100,85 Z" },
  
  // REAR ARMS
  { id: "rear_upper_arm_l", label: "Left Rear Upper Arm", side: "left", view: "back", path: "M48,62 L75,70 L75,115 L48,110 Z" },
  { id: "rear_upper_arm_r", label: "Right Rear Upper Arm", side: "right", view: "back", path: "M125,70 L152,62 L152,110 L125,115 Z" },
  
  // REAR FOREARMS
  { id: "rear_forearm_l", label: "Left Rear Forearm", side: "left", view: "back", path: "M36,115 L60,120 L58,155 L34,150 Z" },
  { id: "rear_forearm_r", label: "Right Rear Forearm", side: "right", view: "back", path: "M140,120 L164,115 L166,150 L142,155 Z" },
  
  // REAR HANDS
  { id: "rear_hand_l", label: "Left Rear Hand", side: "left", view: "back", path: "M28,155 L58,160 L56,175 L26,170 Z" },
  { id: "rear_hand_r", label: "Right Rear Hand", side: "right", view: "back", path: "M142,160 L172,155 L174,170 L144,175 Z" },
  
  // MID BACK
  { id: "mid_back_l", label: "Left Mid Back", side: "left", view: "back", path: "M75,85 L100,85 L100,130 L75,130 Z" },
  { id: "mid_back_r", label: "Right Mid Back", side: "right", view: "back", path: "M100,85 L125,85 L125,130 L100,130 Z" },
  { id: "mid_back_c", label: "Mid Back Center", view: "back", path: "M92,75 L108,75 L108,95 L92,95 Z" },
  
  // LOWER BACK
  { id: "lower_back_l", label: "Left Lower Back", side: "left", view: "back", path: "M80,130 L100,130 L100,165 L80,165 Z" },
  { id: "lower_back_r", label: "Right Lower Back", side: "right", view: "back", path: "M100,130 L120,130 L120,165 L100,165 Z" },
  { id: "sacrum", label: "Sacrum", view: "back", path: "M92,160 L108,160 L108,175 L92,175 Z" },
  
  // BUTTOCKS
  { id: "glute_l", label: "Left Buttock", side: "left", view: "back", path: "M75,165 L100,165 L100,205 L75,205 Z" },
  { id: "glute_r", label: "Right Buttock", side: "right", view: "back", path: "M100,165 L125,165 L125,205 L100,205 Z" },
  
  // REAR THIGHS
  { id: "rear_thigh_l", label: "Left Rear Thigh", side: "left", view: "back", path: "M70,205 L100,205 L100,235 L70,235 Z" },
  { id: "rear_thigh_r", label: "Right Rear Thigh", side: "right", view: "back", path: "M100,205 L130,205 L130,235 L100,235 Z" },
  
  // REAR KNEES
  { id: "rear_knee_l", label: "Left Rear Knee", side: "left", view: "back", path: "M75,235 L100,235 L100,255 L75,255 Z" },
  { id: "rear_knee_r", label: "Right Rear Knee", side: "right", view: "back", path: "M100,235 L125,235 L125,255 L100,255 Z" },
  
  // REAR LOWER LEGS / CALVES
  { id: "calf_l", label: "Left Calf", side: "left", view: "back", path: "M72,255 L100,255 L100,310 L72,310 Z" },
  { id: "calf_r", label: "Right Calf", side: "right", view: "back", path: "M100,255 L128,255 L128,310 L100,310 Z" },
  
  // REAR FEET
  { id: "rear_foot_l", label: "Left Rear Foot", side: "left", view: "back", path: "M58,310 L98,310 L98,330 L58,330 Z" },
  { id: "rear_foot_r", label: "Right Rear Foot", side: "right", view: "back", path: "M102,310 L142,310 L142,330 L102,330 Z" },
];

// ── Silhouette outline paths (drawn as background fill) ──────────────────────
const FRONT_SILHOUETTE = `
  M100,2
  C88,2 82,10 82,20 C82,30 88,38 94,40
  L92,56 L52,56 C38,60 28,68 28,76
  L32,118 L24,160 L18,176 L22,186 L46,186 L46,180
  L74,180 L68,238 L64,262 L60,308 L52,324 L60,330 L92,330 L94,318 L100,316
  L106,318 L108,330 L140,330 L148,324 L140,308 L136,262 L132,238 L126,180
  L154,180 L154,186 L178,186 L182,176 L176,160 L168,118 L172,76
  C172,68 162,60 148,56
  L108,56 L106,40
  C112,38 118,30 118,20 C118,10 112,2 100,2 Z
`;

const BACK_SILHOUETTE = FRONT_SILHOUETTE;

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

        {/* Full silhouette background */}
        <path
          d={view === "front" ? FRONT_SILHOUETTE : BACK_SILHOUETTE}
          fill="#1c2a3a"
          filter="url(#body-shadow)"
        />

        {/* Head circle */}
        <ellipse cx="100" cy="20" rx="18" ry="20" fill="#1c2a3a" />

        {/* Segment divider lines - Clean white segments */}
        {[
          // Head divisions
          "M100,8 L100,32",
          "M85,18 L115,18",
          
          // Neck
          "M92,36 L108,36",
          "M92,48 L108,48",
          
          // Shoulder lines
          "M60,56 L140,56",
          "M75,62 L125,62",
          "M92,62 L108,62",
          
          // Upper arm/chest
          "M48,70 L60,70",
          "M152,70 L140,70",
          "M100,48 L100,70",
          
          // Chest divisions
          "M75,62 L75,95",
          "M125,62 L125,95",
          "M92,70 L92,95",
          "M108,70 L108,95",
          
          // Upper arm
          "M48,110 L60,115",
          "M152,110 L140,115",
          
          // Forearm/hand divisions
          "M36,155 L60,160",
          "M164,155 L140,160",
          "M28,170 L58,175",
          "M172,170 L142,175",
          
          // Abdomen/torso divisions
          "M75,95 L125,95",
          "M75,135 L125,135",
          "M80,160 L120,160",
          "M100,95 L100,175",
          
          // Thigh divisions
          "M70,175 L130,175",
          "M75,235 L125,235",
          "M100,175 L100,235",
          
          // Knee/shin divisions
          "M70,255 L130,255",
          "M72,310 L128,310",
          
          // Foot divisions
          "M58,330 L100,330",
          "M100,330 L142,330",
        ].map((d, i) => (
          <path key={i} d={d} stroke="#d4d4d4" strokeWidth="2.2" fill="none" opacity="0.9" />
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
