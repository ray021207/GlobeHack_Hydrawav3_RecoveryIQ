import type { AssessmentData } from "./kinetic-analysis";

export interface TherapyProtocol {
  id: string;
  name: string;
  description: string;
  severity: "mild" | "moderate" | "severe";
  frequency: string; // e.g., "2x per week", "3x per week"
  duration: string; // e.g., "4 weeks", "6 weeks"
  sessionDuration: number; // minutes
  targetAreas: string[];
  techniques: string[];
  expectedOutcomes: string[];
  contraindications: string[];
  progressionCriteria: string[];
}

export interface PractitionerPlan {
  patientId: string;
  assessmentDate: string;
  severity: "mild" | "moderate" | "severe";
  primaryProblems: string[];
  recommendedProtocols: TherapyProtocol[];
  hydrawavSettings?: {
    protocol: string;
    frequency: string;
    intensity: "low" | "medium" | "high";
    duration: number; // minutes
  };
  manualTherapy?: {
    type: string;
    frequency: string;
    techniques: string[];
  };
  treatmentTimeline: {
    week1_2: string;
    week3_4: string;
  };
  followUpRecommendations: string[];
}

const PROTOCOL_LIBRARY: TherapyProtocol[] = [
  {
    id: "recovery_restore",
    name: "Recovery & Restore Protocol",
    description: "Gentle restoration focusing on pain reduction and ROM restoration",
    severity: "mild",
    frequency: "2x per week",
    duration: "4 weeks",
    sessionDuration: 40,
    targetAreas: ["full body", "affected areas"],
    techniques: [
      "Gentle oscillation at 2-4 Hz",
      "Progressive loading",
      "Pain-guided movement",
      "Myofascial release simulation",
    ],
    expectedOutcomes: [
      "30% reduction in pain",
      "Improved ROM in affected areas",
      "Better movement patterns",
      "Increased daily function",
    ],
    contraindications: [
      "Recent fractures",
      "Acute inflammation",
      "Acute infections",
      "Unstable cardiac conditions",
    ],
    progressionCriteria: [
      "Pain reduces below 5/10",
      "ROM improves 20%+",
      "Patient confidence increases",
      "No adverse reactions",
    ],
  },
  {
    id: "active_mobility",
    name: "Active Mobility Enhancement",
    description: "Targeted ROM improvement with active assisted movement",
    severity: "mild",
    frequency: "3x per week",
    duration: "6 weeks",
    sessionDuration: 45,
    targetAreas: ["joints", "restricted areas"],
    techniques: [
      "Active-assisted exercises",
      "Proprioceptive training",
      "Functional movement patterns",
      "Neuromotor retraining",
    ],
    expectedOutcomes: [
      "40% ROM improvement",
      "Better movement control",
      "Reduced compensation patterns",
      "Improved proprioception",
    ],
    contraindications: ["Severe pain", "Acute swelling", "Recent surgery"],
    progressionCriteria: [
      "ROM improves 20% every 2 weeks",
      "Movement quality improves",
      "Functional tasks improve",
    ],
  },
  {
    id: "moderate_pain_relief",
    name: "Moderate Pain Relief & Stabilization",
    description: "Focused pain management with stabilization for moderate discomfort",
    severity: "moderate",
    frequency: "3x per week",
    duration: "6 weeks",
    sessionDuration: 50,
    targetAreas: ["primary affected areas", "stabilizing muscles"],
    techniques: [
      "Therapeutic oscillation 4-6 Hz",
      "Progressive loading sequences",
      "Stability training",
      "Neuromuscular re-education",
    ],
    expectedOutcomes: [
      "50% pain reduction",
      "Restored strength baseline",
      "Improved stability",
      "Better functional capacity",
    ],
    contraindications: [
      "Acute inflammatory conditions",
      "Recent trauma",
      "Severe neurological deficits",
    ],
    progressionCriteria: [
      "Pain reduces from baseline",
      "Strength improves measurably",
      "Function improves weekly",
      "Patient reports confidence gain",
    ],
  },
  {
    id: "therapeutic_strengthening",
    name: "Therapeutic Strengthening Program",
    description: "Progressive strengthening with load management",
    severity: "moderate",
    frequency: "4x per week",
    duration: "8 weeks",
    sessionDuration: 60,
    targetAreas: ["weak areas", "stabilizing muscles", "functional chains"],
    techniques: [
      "Progressive resistance training",
      "Functional movement patterns",
      "Core stabilization",
      "Proprioceptive challenges",
    ],
    expectedOutcomes: [
      "60% strength improvement",
      "Enhanced muscular endurance",
      "Improved postural control",
      "Return to activities",
    ],
    contraindications: ["Acute pain", "Recent injury", "Severe weakness"],
    progressionCriteria: [
      "Weekly strength gains",
      "Reps/sets increase consistently",
      "Patient performs heavier loads painlessly",
    ],
  },
  {
    id: "severe_pain_management",
    name: "Severe Pain Management Protocol",
    description: "Conservative pain-first approach for severe conditions",
    severity: "severe",
    frequency: "4-5x per week",
    duration: "8 weeks",
    sessionDuration: 35,
    targetAreas: ["localized pain areas", "surrounding support structures"],
    techniques: [
      "Very gentle oscillation 1-2 Hz",
      "Passive movement",
      "Pain education",
      "Gradual sensorimotor retraining",
    ],
    expectedOutcomes: [
      "Pain reduced to moderate levels",
      "Movement tolerance improves",
      "Sleep quality improves",
      "Psychological resilience builds",
    ],
    contraindications: [
      "Rapidly worsening symptoms",
      "Undiagnosed conditions",
      "Systemic infections",
      "Severe psychological distress",
    ],
    progressionCriteria: [
      "Pain consistently below starting level",
      "Patient can do more daily tasks",
      "No adverse reactions for 2 weeks",
      "Patient reports hope/improvement",
    ],
  },
  {
    id: "posture_correction",
    name: "Postural Correction & Prevention",
    description: "Addressing postural dysfunction and prevention of recurrence",
    severity: "moderate",
    frequency: "2-3x per week",
    duration: "8-12 weeks",
    sessionDuration: 50,
    targetAreas: ["postural muscles", "alignment", "ergonomic training"],
    techniques: [
      "Postural assessment and training",
      "Ergonomic education",
      "Desktop/workstation optimization",
      "Core and postural muscle training",
    ],
    expectedOutcomes: [
      "Improved postural awareness",
      "Reduced postural strain pain",
      "Better movement efficiency",
      "Prevention of future issues",
    ],
    contraindications: ["Severe structural issues", "Significant pain"],
    progressionCriteria: [
      "Posture visibly improves",
      "Pain with prolonged sitting/standing reduces",
      "Patient awareness increases",
    ],
  },
  {
    id: "sport_specific_rehab",
    name: "Sport-Specific Rehabilitation",
    description: "Return-to-activity program with sport-specific training",
    severity: "mild",
    frequency: "3x per week",
    duration: "8 weeks",
    sessionDuration: 60,
    targetAreas: ["sport-specific muscles", "movement patterns", "endurance"],
    techniques: [
      "Sport-specific drills",
      "Plyometric training (progressive)",
      "Speed and agility training",
      "Activity-specific strength",
    ],
    expectedOutcomes: [
      "Return to sport readiness",
      "Confidence in movement",
      "Performance improvements",
      "Injury prevention strategies learned",
    ],
    contraindications: ["Active pain", "Incomplete ROM recovery"],
    progressionCriteria: [
      "Can perform sport movements pain-free",
      "Matches pre-injury performance",
      "Confidence level high",
    ],
  },
];

export function generatePractitionerPlan(assessment: AssessmentData): PractitionerPlan {
  const severity =
    assessment.areas.reduce((sum, a) => sum + a.discomfort, 0) / Math.max(assessment.areas.length, 1) > 7
      ? "severe"
      : assessment.areas.reduce((sum, a) => sum + a.discomfort, 0) / Math.max(assessment.areas.length, 1) > 4
      ? "moderate"
      : "mild";

  const primaryProblems = assessment.areas
    .filter((a) => a.isPrimary)
    .map((a) => `${a.regionId}: ${a.discomfort}/10 discomfort`);

  // Select best matching protocols
  let recommendedProtocols: TherapyProtocol[] = [];

  if (severity === "severe") {
    recommendedProtocols = [
      PROTOCOL_LIBRARY.find((p) => p.id === "severe_pain_management")!,
      PROTOCOL_LIBRARY.find((p) => p.id === "recovery_restore")!,
    ];
  } else if (severity === "moderate") {
    recommendedProtocols = [
      PROTOCOL_LIBRARY.find((p) => p.id === "moderate_pain_relief")!,
      assessment.dailyActivities.length > 3
        ? PROTOCOL_LIBRARY.find((p) => p.id === "therapeutic_strengthening")!
        : PROTOCOL_LIBRARY.find((p) => p.id === "posture_correction")!,
    ];
  } else {
    recommendedProtocols = [
      PROTOCOL_LIBRARY.find((p) => p.id === "active_mobility")!,
      assessment.dailyActivities.includes("Sports / Training")
        ? PROTOCOL_LIBRARY.find((p) => p.id === "sport_specific_rehab")!
        : PROTOCOL_LIBRARY.find((p) => p.id === "posture_correction")!,
    ];
  }

  const hydrawavSettings =
    severity === "severe"
      ? { protocol: "restore", frequency: "4-5x per week", intensity: "low" as const, duration: 35 }
      : severity === "moderate"
      ? { protocol: "therapeutic", frequency: "3x per week", intensity: "medium" as const, duration: 50 }
      : { protocol: "active", frequency: "2-3x per week", intensity: "medium" as const, duration: 45 };

  const manualTherapy =
    severity === "severe"
      ? {
          type: "Gentle soft tissue mobilization",
          frequency: "3x per week",
          techniques: ["Gentle massage", "Trigger point release (light)", "Myofascial release"],
        }
      : severity === "moderate"
      ? {
          type: "Targeted manual therapy",
          frequency: "2-3x per week",
          techniques: [
            "Soft tissue mobilization",
            "Joint mobilization (grade II-III)",
            "Muscle energy techniques",
          ],
        }
      : {
          type: "Maintenance manual therapy",
          frequency: "1-2x per week",
          techniques: [
            "Myofascial release",
            "Joint mobilization (grade III-IV)",
            "Advanced soft tissue techniques",
          ],
        };

  return {
    patientId: assessment.areas[0]?.regionId ?? "unknown",
    assessmentDate: assessment.submittedAt ?? new Date().toISOString(),
    severity,
    primaryProblems,
    recommendedProtocols,
    hydrawavSettings,
    manualTherapy,
    treatmentTimeline: {
      week1_2: `Focus on ${severity === "severe" ? "pain reduction and gentle ROM" : "assessment and baseline establishment"}. 2-3 sessions per week.`,
      week3_4: `Progress to functional training and strengthening. Assess progress toward goals. Consider discharge or phase 2 plan.`,
    },
    followUpRecommendations: [
      "Reassess at 4 weeks to progress or modify plan",
      "Patient should track pain and function daily",
      "Review adherence to home exercise program weekly",
      "Consider discharge and prevention strategies by week 6-8",
    ],
  };
}

export function getProtocolById(id: string): TherapyProtocol | undefined {
  return PROTOCOL_LIBRARY.find((p) => p.id === id);
}
