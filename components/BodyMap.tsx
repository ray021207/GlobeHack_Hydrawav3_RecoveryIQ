"use client";

export type BodyRegion = {
  id: string;
  label: string;
  side?: "left" | "right" | "bilateral";
  view: "front" | "back";
  path: string;
};

const FRONT_REGIONS: BodyRegion[] = [
  { id: "neck_front", label: "Neck", view: "front", path: "M88,38 L112,38 L110,60 L90,60 Z" },
  { id: "shoulder_r", label: "Right Shoulder", side: "right", view: "front", path: "M58,62 L88,62 L86,90 L56,88 Z" },
  { id: "shoulder_l", label: "Left Shoulder", side: "left", view: "front", path: "M112,62 L142,62 L144,88 L114,90 Z" },
  { id: "chest", label: "Chest", view: "front", path: "M88,62 L112,62 L114,105 L86,105 Z" },
  { id: "upper_arm_r", label: "Right Upper Arm", side: "right", view: "front", path: "M44,90 L64,90 L62,128 L42,126 Z" },
  { id: "upper_arm_l", label: "Left Upper Arm", side: "left", view: "front", path: "M136,90 L156,90 L158,126 L138,128 Z" },
  { id: "abdomen", label: "Abdomen", view: "front", path: "M86,105 L114,105 L116,140 L84,140 Z" },
  { id: "forearm_r", label: "Right Forearm", side: "right", view: "front", path: "M38,128 L60,128 L56,164 L36,162 Z" },
  { id: "forearm_l", label: "Left Forearm", side: "left", view: "front", path: "M140,128 L162,128 L164,162 L144,164 Z" },
  { id: "hip_r", label: "Right Hip", side: "right", view: "front", path: "M84,140 L100,140 L100,168 L82,168 Z" },
  { id: "hip_l", label: "Left Hip", side: "left", view: "front", path: "M100,140 L116,140 L118,168 L100,168 Z" },
  { id: "thigh_r", label: "Front Right Upper Leg", side: "right", view: "front", path: "M78,168 L100,168 L98,216 L76,214 Z" },
  { id: "thigh_l", label: "Front Left Upper Leg", side: "left", view: "front", path: "M100,168 L122,168 L124,214 L102,216 Z" },
  { id: "knee_r", label: "Right Knee", side: "right", view: "front", path: "M76,216 L98,216 L97,236 L75,234 Z" },
  { id: "knee_l", label: "Left Knee", side: "left", view: "front", path: "M102,216 L124,214 L125,234 L103,236 Z" },
  { id: "shin_r", label: "Right Lower Leg", side: "right", view: "front", path: "M75,236 L97,236 L95,280 L73,278 Z" },
  { id: "shin_l", label: "Left Lower Leg", side: "left", view: "front", path: "M103,236 L125,234 L127,278 L105,280 Z" },
  { id: "foot_r", label: "Right Foot", side: "right", view: "front", path: "M66,280 L95,280 L92,296 L62,294 Z" },
  { id: "foot_l", label: "Left Foot", side: "left", view: "front", path: "M105,280 L134,278 L138,294 L108,296 Z" },
];

const BACK_REGIONS: BodyRegion[] = [
  { id: "neck_back", label: "Neck / Cervical Spine", view: "back", path: "M88,38 L112,38 L110,60 L90,60 Z" },
  { id: "trap_r", label: "Right Trapezius", side: "right", view: "back", path: "M58,62 L88,62 L86,90 L56,88 Z" },
  { id: "trap_l", label: "Left Trapezius", side: "left", view: "back", path: "M112,62 L142,62 L144,88 L114,90 Z" },
  { id: "upper_back", label: "Upper Back / Thoracic", view: "back", path: "M88,62 L112,62 L114,105 L86,105 Z" },
  { id: "rear_shoulder_r", label: "Right Rear Shoulder", side: "right", view: "back", path: "M44,90 L64,90 L62,120 L42,118 Z" },
  { id: "rear_shoulder_l", label: "Left Rear Shoulder", side: "left", view: "back", path: "M136,90 L156,90 L158,118 L138,120 Z" },
  { id: "lower_back", label: "Lower Back / Lumbar", view: "back", path: "M86,105 L114,105 L116,140 L84,140 Z" },
  { id: "glute_r", label: "Right Glute", side: "right", view: "back", path: "M84,140 L100,140 L100,170 L82,168 Z" },
  { id: "glute_l", label: "Left Glute", side: "left", view: "back", path: "M100,140 L116,140 L118,168 L100,170 Z" },
  { id: "hamstring_r", label: "Right Hamstring", side: "right", view: "back", path: "M78,168 L100,168 L98,216 L76,214 Z" },
  { id: "hamstring_l", label: "Left Hamstring", side: "left", view: "back", path: "M100,168 L122,168 L124,214 L102,216 Z" },
  { id: "calf_r", label: "Right Calf", side: "right", view: "back", path: "M75,236 L97,236 L95,280 L73,278 Z" },
  { id: "calf_l", label: "Left Calf", side: "left", view: "back", path: "M103,236 L125,234 L127,278 L105,280 Z" },
];

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
  const scale = size / 320;
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-hw-text-muted)" }}>
        {view === "front" ? "Front View" : "Back View"}
      </p>
      <svg
        viewBox="0 0 200 310"
        width={size * 0.625}
        height={size}
        style={{ cursor: "pointer" }}
      >
        {/* Head */}
        <ellipse cx="100" cy="22" rx="18" ry="20" fill="#c8bfb4" />
        {/* Torso base */}
        <rect x="82" y="38" width="36" height="102" rx="4" fill="#d4cbc0" />
        {/* Pelvis */}
        <rect x="80" y="136" width="40" height="36" rx="4" fill="#d4cbc0" />
        {/* Arms */}
        <rect x="38" y="62" width="22" height="104" rx="8" fill="#d4cbc0" />
        <rect x="140" y="62" width="22" height="104" rx="8" fill="#d4cbc0" />
        {/* Legs */}
        <rect x="74" y="168" width="24" height="128" rx="8" fill="#d4cbc0" />
        <rect x="102" y="168" width="24" height="128" rx="8" fill="#d4cbc0" />

        {/* Clickable regions */}
        {regions.map((r) => (
          <path
            key={r.id}
            d={r.path}
            fill={selected.includes(r.id) ? "var(--color-hw-clay)" : "transparent"}
            stroke={selected.includes(r.id) ? "var(--color-hw-clay)" : "transparent"}
            strokeWidth="1"
            opacity={selected.includes(r.id) ? 0.75 : 0}
            onClick={() => onToggle(r.id)}
            style={{ cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={(e) => { if (!selected.includes(r.id)) (e.target as SVGPathElement).style.opacity = "0.25"; (e.target as SVGPathElement).style.fill = "var(--color-hw-clay)"; }}
            onMouseLeave={(e) => { if (!selected.includes(r.id)) { (e.target as SVGPathElement).style.opacity = "0"; (e.target as SVGPathElement).style.fill = "transparent"; } }}
          />
        ))}

        {/* Hit-zone overlay (transparent, catches clicks) */}
        {regions.map((r) => (
          <path
            key={`hit-${r.id}`}
            d={r.path}
            fill="transparent"
            onClick={() => onToggle(r.id)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BodyMap({ selected, onToggle, size = 300 }: BodyMapProps) {
  return (
    <div className="flex gap-8 justify-center">
      <SilhouetteSVG view="front" regions={FRONT_REGIONS} selected={selected} onToggle={onToggle} size={size} />
      <SilhouetteSVG view="back" regions={BACK_REGIONS} selected={selected} onToggle={onToggle} size={size} />
    </div>
  );
}

export function getRegionLabel(id: string): string {
  return [...FRONT_REGIONS, ...BACK_REGIONS].find((r) => r.id === id)?.label ?? id;
}

export const ALL_REGIONS = [...FRONT_REGIONS, ...BACK_REGIONS];
