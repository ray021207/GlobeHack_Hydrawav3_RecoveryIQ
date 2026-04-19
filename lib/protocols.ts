export type Modality = "red_light" | "blue_light" | "alt_light" | "heat" | "cold" | "alt_thermal" | "vibration";
export type SwitchMode = "pulse" | "continuous_cycling";
export type ProtocolTag =
  | "Recovery" | "Post-Activity" | "Pre-Activity" | "Activation"
  | "Circulation" | "Mobility" | "Energy" | "Signature"
  | "Cryo" | "Numbing" | "Chronic Support" | "Extended"
  | "Calm" | "Tension Relief" | "Versatile" | "Balanced"
  | "Warm-Up" | "Preparation" | "Quick Reset" | "Deep Release"
  | "Contrast" | "Immersive" | "Everyday" | "Tissue Support"
  | "Cellular Function" | "Skin Care" | "Surface";

export interface Protocol {
  id: string;
  name: string;
  durationMin: number;
  modalities: Modality[];
  switchMode: SwitchMode;
  switchSec: number;
  description: string;
  commonUses: string[];
  caution?: string;
  tags: ProtocolTag[];
}

export const PROTOCOLS: Protocol[] = [
  {
    id: "hydraflush",
    name: "HydraFlush",
    durationMin: 9,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "pulse",
    switchSec: 6,
    description: "Use post-activity to support venous return, lymphatic clearance, and reduce delayed-onset muscle soreness (DOMS).",
    commonUses: [
      "Post-workout soreness in quads, hamstrings, or calves",
      "General lower-leg fatigue after long days on feet",
      "Recovery after prolonged sitting or travel",
    ],
    caution: "Screen for DVT risk before use on swollen calves (recent surgery, immobilization, unilateral swelling with warmth/redness).",
    tags: ["Recovery", "Post-Activity"],
  },
  {
    id: "hydraflush_intense",
    name: "HydraFlush (Intense)",
    durationMin: 8,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "pulse",
    switchSec: 6,
    description: "Use pre-activity to prime neuromuscular activation and improve tissue compliance before training.",
    commonUses: [
      "Sluggish or fatigued legs before a workout",
      "Priming quads, hamstrings, and glutes",
      "Warm-up for explosive or high-load training",
    ],
    caution: "Screen for DVT risk before use on swollen calves. Avoid on acute strains within 48 hours.",
    tags: ["Activation", "Pre-Activity"],
  },
  {
    id: "precision_dilation",
    name: "Precision Dilation",
    durationMin: 9,
    modalities: ["red_light", "heat", "vibration"],
    switchMode: "pulse",
    switchSec: 9,
    description: "Use pre-activity to promote local vasodilation and increase tissue temperature, supporting circulation and muscle readiness.",
    commonUses: [
      "Stiff hip flexors or hamstrings before training",
      "Cold hands or feet from poor peripheral circulation",
      "Pre-session warm-up for targeted muscle groups",
    ],
    caution: "Use caution with peripheral neuropathy, Raynaud's, PAD, or impaired sensation — heat perception may be reduced. Avoid over open wounds or active inflammation.",
    tags: ["Circulation", "Pre-Activity"],
  },
  {
    id: "skin_rejuvenation_blue",
    name: "Skin Rejuvenation Blue Light",
    durationMin: 16,
    modalities: ["blue_light", "vibration"],
    switchMode: "pulse",
    switchSec: 180,
    description: "Use for superficial skin support. Blue light (415nm) targets surface-level skin concerns through its antimicrobial properties.",
    commonUses: [
      "Minor surface-level skin irritation or redness",
      "Targeted areas prone to breakouts",
      "Low-intensity surface stimulation",
    ],
    tags: ["Skin Care", "Surface"],
  },
  {
    id: "high_intensity_red",
    name: "High Intensity Red Light",
    durationMin: 16,
    modalities: ["red_light"],
    switchMode: "pulse",
    switchSec: 300,
    description: "Delivers concentrated 660nm red light to support mitochondrial function and ATP production, promoting tissue revitalization and local circulation.",
    commonUses: [
      "Dense or stiff muscle tissue",
      "Scalp and hairline applications",
      "Areas with reduced local circulation",
    ],
    tags: ["Tissue Support", "Cellular Function"],
  },
  {
    id: "precision_cryo",
    name: "Precision Cryo",
    durationMin: 8,
    modalities: ["blue_light", "cold", "vibration"],
    switchMode: "pulse",
    switchSec: 9,
    description: "Creates a localized numbing effect mimicking targeted cold exposure. Post-session produces a tingling, revitalized 'flush' sensation as circulation returns.",
    commonUses: [
      "Subacute muscle tweaks (after the first 48 hours)",
      "Localized post-impact discomfort",
      "Discomfort following high-exertion sessions",
    ],
    caution: "Avoid on acute strains within the first 48 hours. Not for use over areas with reduced sensation or circulatory compromise.",
    tags: ["Cryo", "Numbing"],
  },
  {
    id: "energizing",
    name: "Energizing",
    durationMin: 6,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "pulse",
    switchSec: 3,
    description: "Stimulating effect that promotes circulation and may improve perceived mobility. Best applied to the limbs (arms and legs).",
    commonUses: [
      "Morning activation for arms and legs",
      "Pre-walk or pre-workout boost",
      "Combating perceived sluggishness in the extremities",
    ],
    tags: ["Energy", "Mobility"],
  },
  {
    id: "signature_short",
    name: "Signature Short (Recovery & Relief)",
    durationMin: 9,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "pulse",
    switchSec: 9,
    description: "Use pre-activity for activation, acute complaints, to improve range of motion, decrease tension, and enhance movement, strength & balance.",
    commonUses: [
      "General muscular soreness",
      "Reduced range of motion",
      "Daily recovery maintenance",
    ],
    tags: ["Signature", "Pre-Activity"],
  },
  {
    id: "signature_long",
    name: "Signature Long (Recovery & Relief)",
    durationMin: 26,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "pulse",
    switchSec: 9,
    description: "Practitioner-led protocol for chronic complaints. Supports sustained neuromuscular relaxation, reduces perceived tension and mild discomfort, and may improve range of motion and mobility over an extended session.",
    commonUses: [
      "Whole-leg recovery sessions",
      "Lumbar paraspinal and gluteal tension",
      "End-of-day decompression and downregulation",
    ],
    tags: ["Signature", "Recovery"],
  },
  {
    id: "mobility_surge",
    name: "Mobility Surge",
    durationMin: 7,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "pulse",
    switchSec: 3,
    description: "Rapid thermal contrast cycling to support circulation and modulate inflammation. Use pre-activity to improve perceived mobility.",
    commonUses: [
      "Tight quads or hamstrings before training",
      "Muscles that feel restricted or 'stuck'",
      "Priming tissue before stretching or movement work",
    ],
    caution: "Avoid use on the head and extremities (hands and feet) due to rapid thermal switching.",
    tags: ["Mobility", "Pre-Activity"],
  },
  {
    id: "deep_session",
    name: "Deep Session",
    durationMin: 18,
    modalities: ["alt_light", "alt_thermal", "vibration"],
    switchMode: "continuous_cycling",
    switchSec: 18,
    description: "Extended-duration protocol for clients with long-standing complaints. Combines sustained light, thermal contrast, and vibration to support circulation, neuromuscular relaxation, and tissue response in larger muscle groups requiring longer exposure.",
    commonUses: [
      "Large muscle groups with persistent discomfort",
      "Lumbar paraspinals, gluteals, or quadriceps",
      "Recovery after sustained physical or postural stress",
    ],
    tags: ["Extended", "Chronic Support"],
  },
  {
    id: "polarwave_36",
    name: "PolarWave 36",
    durationMin: 7,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 36,
    description: "Very slow cycling with extended phases that promote stability and calm immersion. Best suited for recovery-focused or longer sessions.",
    commonUses: [
      "Deep recovery sessions",
      "Post-activity wind-down",
      "When stability and calm are the priority",
    ],
    tags: ["Recovery", "Calm"],
  },
  {
    id: "polarwave_18",
    name: "PolarWave 18",
    durationMin: 4,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 18,
    description: "Slower transitions with longer holds that feel heavier and more sustained. Ideal when the goal is easing tension and encouraging deeper response.",
    commonUses: [
      "Easing deep tension",
      "Encouraging deeper tissue response",
      "Sustained recovery work",
    ],
    tags: ["Recovery", "Tension Relief"],
  },
  {
    id: "polarwave_9",
    name: "PolarWave 9",
    durationMin: 5,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 9,
    description: "Moderate tempo that blends activation and calming phases smoothly. A versatile option when you want a steady, grounded experience.",
    commonUses: [
      "Steady grounded recovery",
      "Balanced activation and calming",
      "General-purpose sessions",
    ],
    tags: ["Versatile", "Balanced"],
  },
  {
    id: "polarwave_6",
    name: "PolarWave 6",
    durationMin: 5,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 6,
    description: "Fast balanced cycling that keeps tissue responsive without lingering too long in one state. Good for warm-up or general preparation.",
    commonUses: [
      "Pre-activity warm-up",
      "General preparation",
      "Keeping tissue responsive",
    ],
    tags: ["Warm-Up", "Preparation"],
  },
  {
    id: "polarwave_3",
    name: "PolarWave 3",
    durationMin: 4,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 3,
    description: "Rapid, rhythmic switching that feels light and energizing. Best when you want quick stimulation and a surface-level reset.",
    commonUses: [
      "Quick stimulation",
      "Surface-level reset",
      "Light energizing boost",
    ],
    tags: ["Energy", "Quick Reset"],
  },
  {
    id: "contrast_pulse_36",
    name: "Contrast Pulse 36",
    durationMin: 7,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 36,
    description: "Extended contrast holds that feel immersive and calming rather than rhythmic. Ideal for longer recovery sessions where stability and gradual reset are the priority.",
    commonUses: [
      "Long recovery sessions",
      "Gradual reset",
      "When stability is the priority",
    ],
    tags: ["Recovery", "Immersive"],
  },
  {
    id: "contrast_pulse_18",
    name: "Contrast Pulse 18",
    durationMin: 4,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 18,
    description: "Slower hot-cold transitions that allow the body to adapt more fully to each temperature phase. Select when you want a deeper-feeling release without abrupt changes.",
    commonUses: [
      "Deeper-feeling release",
      "Gradual temperature adaptation",
      "Avoiding abrupt changes",
    ],
    tags: ["Deep Release", "Contrast"],
  },
  {
    id: "contrast_pulse_9",
    name: "Contrast Pulse 9",
    durationMin: 8,
    modalities: ["alt_light", "alt_thermal"],
    switchMode: "continuous_cycling",
    switchSec: 9,
    description: "Moderate contrast pacing that blends stimulation and settling phases smoothly. A strong everyday option when the goal is balanced circulation and comfort.",
    commonUses: [
      "Balanced circulation",
      "Everyday comfort sessions",
      "Blending stimulation and settling",
    ],
    tags: ["Everyday", "Balanced"],
  },
];

export function getProtocolById(id: string): Protocol | undefined {
  return PROTOCOLS.find((p) => p.id === id);
}

export function getProtocolsByTag(tag: ProtocolTag): Protocol[] {
  return PROTOCOLS.filter((p) => p.tags.includes(tag));
}
