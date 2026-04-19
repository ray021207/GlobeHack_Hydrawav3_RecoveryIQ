import { PROTOCOLS, type Protocol } from "./protocols";

export type PainDuration = "less_6wk" | "6wk_3mo" | "3_6mo" | "6mo_1yr" | "over_1yr";
export type PainBehavior = "always" | "comes_goes" | "with_activity" | "varies";
export type Sensation = "tight" | "stiff" | "achy" | "heavy" | "sharp" | "burning" | "tingling" | "numb";
export type ActivityTolerance = "standing" | "sitting" | "both" | "neither";

export interface AssessmentInput {
  primaryArea: string;
  secondaryAreas?: string[];
  discomfortLevel: number;        // 1–10
  duration: PainDuration;
  behavior: PainBehavior;
  sensations: Sensation[];
  activitiesWorse: string[];
  activitiesBetter: string[];
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athletic";
  hardToTolerate?: ActivityTolerance;
  dailyActivities?: string[];     // office, standing, manual, sports, yoga, running, driving
}

export interface ProtocolRecommendation {
  protocol: Protocol;
  score: number;
  rationale: string;
  priority: "primary" | "secondary";
}

function p(id: string): Protocol {
  return PROTOCOLS.find((x) => x.id === id)!;
}

export function recommendProtocols(input: AssessmentInput): ProtocolRecommendation[] {
  const scores: Map<string, number> = new Map();
  const rationales: Map<string, string[]> = new Map();

  function add(id: string, pts: number, reason: string) {
    scores.set(id, (scores.get(id) ?? 0) + pts);
    const r = rationales.get(id) ?? [];
    r.push(reason);
    rationales.set(id, r);
  }

  const { discomfortLevel, duration, behavior, sensations, activityLevel, dailyActivities = [] } = input;
  const isAcute = duration === "less_6wk";
  const isSubacute = duration === "6wk_3mo";
  const isChronic = duration === "3_6mo" || duration === "6mo_1yr" || duration === "over_1yr";
  const isChronicLong = duration === "over_1yr";
  const isHighPain = discomfortLevel >= 7;
  const isModeratePain = discomfortLevel >= 4 && discomfortLevel < 7;
  const isLowPain = discomfortLevel < 4;
  const isAthletic = activityLevel === "active" || activityLevel === "athletic";
  const isSedentary = activityLevel === "sedentary" || activityLevel === "light";
  const hasTight = sensations.includes("tight") || sensations.includes("stiff");
  const hasSharp = sensations.includes("sharp");
  const hasHeavy = sensations.includes("heavy") || sensations.includes("achy");
  const hasNeural = sensations.includes("burning") || sensations.includes("tingling") || sensations.includes("numb");
  const hasLegArea = /leg|knee|hip|quad|hamstring|calf|glut|lower back|lumbar/i.test(input.primaryArea);
  const hasUpperArea = /shoulder|neck|arm|upper back|thoracic|cervical/i.test(input.primaryArea);
  const doesSports = dailyActivities.some((a) => /sport|train|run|cycl/i.test(a));
  const doesDesk = dailyActivities.some((a) => /office|desk|sitting/i.test(a));
  const doesManual = dailyActivities.some((a) => /manual|standing/i.test(a));

  // --- CHRONIC / LONG-STANDING ---
  if (isChronic) {
    add("signature_long", 30, "Chronic complaint — Signature Long provides sustained neuromuscular relaxation over 26 min");
    add("deep_session", 25, "Long-standing discomfort benefits from extended thermal + light exposure (18 min Deep Session)");
    if (isChronicLong) add("polarwave_36", 20, "Over 1 year duration — slow 36-sec cycling promotes calm immersion and deep recovery");
    if (hasLegArea) {
      add("signature_long", 10, "Lumbar/gluteal/leg involvement — core Signature Long use case");
      add("deep_session", 10, "Lumbar paraspinals and quadriceps respond well to Deep Session's extended protocol");
    }
  }

  // --- ACUTE (<6wk) ---
  if (isAcute) {
    if (!hasSharp) {
      add("signature_short", 25, "Acute complaint (<6 wk) — Signature Short improves ROM and reduces tension pre-activity");
      add("hydraflush", 20, "Post-activity venous return and DOMS prevention during acute recovery phase");
    }
    if (hasSharp) {
      add("precision_cryo", 30, "Sharp pain + acute onset — Precision Cryo provides localized numbing (use after 48h)");
    }
  }

  // --- SUBACUTE ---
  if (isSubacute) {
    add("signature_short", 20, "Subacute phase — Signature Short supports daily maintenance and ROM improvement");
    add("polarwave_9", 15, "PolarWave 9 offers balanced activation/calming ideal for subacute recovery");
    add("contrast_pulse_9", 10, "Contrast Pulse 9 provides moderate everyday circulation support");
  }

  // --- PAIN LEVEL ---
  if (isHighPain) {
    add("precision_cryo", 20, "High discomfort level — Precision Cryo's numbing effect can reduce perceived pain");
    add("signature_long", 15, "High pain with chronic pattern — sustained relaxation protocol recommended");
    add("polarwave_36", 10, "High pain benefits from very slow, calm PolarWave 36 cycling");
  }
  if (isModeratePain) {
    add("signature_short", 15, "Moderate pain — Signature Short for daily management and tension relief");
    add("mobility_surge", 10, "Moderate pain with restricted movement — Mobility Surge helps pre-activity");
  }
  if (isLowPain) {
    add("energizing", 20, "Low pain level — Energizing protocol supports maintenance circulation and mobility");
    add("polarwave_6", 15, "Low pain, tissue readiness focus — PolarWave 6 warm-up preparation");
  }

  // --- SENSATIONS ---
  if (hasTight) {
    add("mobility_surge", 25, "Tight/stiff tissue — Mobility Surge's rapid thermal contrast releases restriction pre-activity");
    add("precision_dilation", 20, "Stiffness responds well to Precision Dilation vasodilation and tissue warming");
    add("signature_short", 10, "Tight musculature — Signature Short improves ROM and decreases tension");
  }
  if (hasHeavy) {
    add("hydraflush", 25, "Heavy/achy sensation — HydraFlush clears metabolic waste and supports venous return");
    add("polarwave_18", 15, "Heavy sensation benefits from PolarWave 18's slow, sustained cycling for deeper response");
  }
  if (hasNeural) {
    add("precision_dilation", 20, "Neural symptoms (burning/tingling/numb) — Precision Dilation cautiously improves peripheral circulation");
    add("high_intensity_red", 15, "Neural involvement may benefit from High Intensity Red Light's cellular support");
  }
  if (hasSharp && !isAcute) {
    add("precision_cryo", 20, "Sharp localized pain — Precision Cryo provides targeted numbing effect");
  }

  // --- ACTIVITY LEVEL ---
  if (isAthletic) {
    add("hydraflush_intense", 25, "Athletic population — HydraFlush Intense primes neuromuscular activation pre-training");
    add("mobility_surge", 20, "Active/athletic — Mobility Surge pre-activity supports circulation and perceived mobility");
    add("energizing", 15, "Athletic performance context — Energizing boosts circulation in limbs pre-activity");
  }
  if (isSedentary) {
    add("precision_dilation", 20, "Sedentary lifestyle — Precision Dilation addresses cold extremities and poor circulation");
    add("signature_long", 15, "Sedentary + chronic tension — Signature Long's decompression and downregulation protocol");
    add("contrast_pulse_36", 10, "Sedentary recovery pattern — Contrast Pulse 36 slow immersive reset");
  }

  // --- DAILY ACTIVITIES ---
  if (doesDesk) {
    add("signature_long", 15, "Desk work — end-of-day decompression and paraspinal tension release (Signature Long)");
    add("deep_session", 10, "Postural stress from prolonged sitting — Deep Session addresses sustained physical stress");
  }
  if (doesSports) {
    add("hydraflush", 15, "Sports/training — HydraFlush post-workout soreness support");
    add("hydraflush_intense", 15, "Sports/training — HydraFlush Intense pre-training neuromuscular priming");
  }
  if (doesManual) {
    add("hydraflush", 20, "Manual/standing work — HydraFlush supports lower-leg fatigue and venous return");
    add("polarwave_36", 10, "Manual labor fatigue — PolarWave 36 post-work calm recovery");
  }

  // --- LOWER LIMB SPECIFIC ---
  if (hasLegArea && isAthletic) {
    add("hydraflush", 10, "Lower limb + athletic context — HydraFlush core use case");
    add("hydraflush_intense", 10, "Lower limb priming for athletic population");
  }

  // --- UPPER BODY ---
  if (hasUpperArea) {
    add("high_intensity_red", 15, "Upper body/cervical — High Intensity Red Light for dense or stiff muscle tissue");
    add("precision_dilation", 10, "Upper extremity stiffness — Precision Dilation tissue warming and vasodilation");
  }

  // Build sorted recommendations
  const entries = Array.from(scores.entries())
    .filter(([id]) => PROTOCOLS.find((x) => x.id === id))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return entries.map(([id, score], i) => ({
    protocol: p(id),
    score,
    rationale: (rationales.get(id) ?? []).slice(0, 2).join(". "),
    priority: i === 0 ? "primary" : "secondary",
  }));
}

export function getTopProtocols(input: AssessmentInput, n = 2): ProtocolRecommendation[] {
  return recommendProtocols(input).slice(0, n);
}
