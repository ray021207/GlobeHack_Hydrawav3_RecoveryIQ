export type Landmark = { x: number; y: number; z?: number; visibility?: number };

export type RomScores = {
  shoulder_l: number; shoulder_r: number;
  hip_l: number; hip_r: number;
  knee_l: number; knee_r: number;
};

export function getAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let deg = Math.abs(rad * 180 / Math.PI);
  if (deg > 180) deg = 360 - deg;
  return Math.round(deg);
}

export function extractRom(lms: Landmark[]): RomScores {
  return {
    shoulder_l: getAngle(lms[13], lms[11], lms[23]),
    shoulder_r: getAngle(lms[14], lms[12], lms[24]),
    hip_l:      getAngle(lms[11], lms[23], lms[25]),
    hip_r:      getAngle(lms[12], lms[24], lms[26]),
    knee_l:     getAngle(lms[23], lms[25], lms[27]),
    knee_r:     getAngle(lms[24], lms[26], lms[28]),
  };
}

export function computeSymmetry(rom: RomScores): number {
  const pairs: [keyof RomScores, keyof RomScores][] = [
    ["shoulder_l", "shoulder_r"], ["hip_l", "hip_r"], ["knee_l", "knee_r"],
  ];
  const diffs = pairs.map(([l, r]) => {
    const left = rom[l], right = rom[r];
    return left > 0 ? Math.abs(left - right) / left * 100 : 0;
  });
  return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
}

export function computeCompensation(rom: RomScores, symmetryScore: number): number {
  const shoulderImbalance = Math.abs(rom.shoulder_l - rom.shoulder_r);
  const hipImbalance = Math.abs(rom.hip_l - rom.hip_r);
  const base = Math.min(100, symmetryScore * 1.5 + shoulderImbalance * 0.3 + hipImbalance * 0.2);
  return Math.round(Math.max(0, Math.min(100, base)));
}

// Three-tier baseline per joint
const POPULATION_BASELINE: Record<string, number> = {
  shoulder: 160, hip: 120, knee: 140,
};

export function getBaselineForJoint(
  joint: string,
  priorInjuries: string[],
  personalBaseline: Record<string, number> | null
): number {
  const region = joint.replace("_l", "").replace("_r", "");
  const pop = POPULATION_BASELINE[region] ?? 130;

  // Tier 3: personal baseline exists
  if (personalBaseline?.[joint] !== undefined) return personalBaseline[joint];

  // Tier 2: prior injury — widen threshold 25%
  const hasInjury = priorInjuries.some((inj) => inj.includes(region));
  if (hasInjury) return Math.round(pop * 0.75);

  // Tier 1: population default
  return pop;
}

export function formatRomDelta(joint: string, delta: number): string {
  const labels: Record<string, string> = {
    shoulder_l: "left shoulder", shoulder_r: "right shoulder",
    hip_l: "left hip", hip_r: "right hip",
    knee_l: "left knee", knee_r: "right knee",
  };
  const name = labels[joint] ?? joint;
  if (delta > 0) return `Your ${name} moved ${delta}° further than your last scan`;
  if (delta < 0) return `Your ${name} moved ${Math.abs(delta)}° less than your last scan`;
  return `Your ${name} is unchanged`;
}

export function avgLandmarkConfidence(lms: Landmark[]): number {
  if (!lms.length) return 0;
  return lms.reduce((s, l) => s + (l.visibility ?? 1), 0) / lms.length;
}
