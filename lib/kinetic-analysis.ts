import { RomScores } from "./cv-engine";

export interface AssessmentData {
  areas: Array<{
    regionId: string;
    discomfort: number;
    behavior: string;
    duration: string;
    notes: string;
    isPrimary: boolean;
  }>;
  dailyActivities: string[];
  sleepPosture: string;
  activitiesWorse: string[];
  activitiesBetter: string[];
  remarks: string;
  romNote: string;
  capturedRom: Record<string, RomScores>;
  submittedAt?: string;
}

export interface KineticReport {
  id: string;
  submittedAt: string;
  summary: {
    primaryAreas: string[];
    totalAreasAffected: number;
    severityLevel: "Mild" | "Moderate" | "Severe";
    averageDiscomfort: number;
    executiveSummary?: string;
  };
  affectedRegions: Array<{
    region: string;
    discomfort: number;
    behavior: string;
    duration: string;
    isPrimary: boolean;
  }>;
  romAnalysis: {
    exercisesCaptured: number;
    totalRomScores: Record<string, RomScores>;
    notes: string;
  };
  behavioralPatterns: {
    worse: string[];
    better: string[];
    dailyActivities: string[];
    sleepPosture: string;
  };
  recommendations: string[];
  insights: string[];
  treatmentPriorities?: string[];
  recoveryScore: number;
}

export function generateKineticReport(data: AssessmentData): KineticReport {
  const primaryAreas = data.areas.filter((a) => a.isPrimary).map((a) => a.regionId);
  const avgDiscomfort =
    data.areas.length > 0
      ? data.areas.reduce((sum, a) => sum + a.discomfort, 0) / data.areas.length
      : 0;

  let severityLevel: "Mild" | "Moderate" | "Severe" = "Mild";
  if (avgDiscomfort > 7) severityLevel = "Severe";
  else if (avgDiscomfort > 4) severityLevel = "Moderate";

  const recommendations = generateRecommendations(data, severityLevel);
  const insights = generateInsights(data, avgDiscomfort);
  const recoveryScore = calculateRecoveryScore(data);

  return {
    id: `report_${Date.now()}`,
    submittedAt: data.submittedAt || new Date().toISOString(),
    summary: {
      primaryAreas,
      totalAreasAffected: data.areas.length,
      severityLevel,
      averageDiscomfort: Math.round(avgDiscomfort * 10) / 10,
    },
    affectedRegions: data.areas.map((a) => ({
      region: a.regionId,
      discomfort: a.discomfort,
      behavior: a.behavior,
      duration: a.duration,
      isPrimary: a.isPrimary,
    })),
    romAnalysis: {
      exercisesCaptured: Object.keys(data.capturedRom).length,
      totalRomScores: data.capturedRom,
      notes: data.romNote,
    },
    behavioralPatterns: {
      worse: data.activitiesWorse,
      better: data.activitiesBetter,
      dailyActivities: data.dailyActivities,
      sleepPosture: data.sleepPosture,
    },
    recommendations,
    insights,
    recoveryScore,
  };
}

function generateRecommendations(
  data: AssessmentData,
  severity: "Mild" | "Moderate" | "Severe"
): string[] {
  const recommendations: string[] = [];

  // ROM-based recommendations
  if (Object.keys(data.capturedRom).length > 0) {
    recommendations.push(
      "Your baseline ROM has been captured. Your practitioner will monitor improvements over time."
    );
  } else {
    recommendations.push(
      "Complete ROM exercises with camera capture for better baseline tracking."
    );
  }

  // Activity-based recommendations
  if (data.activitiesBetter.includes("Stretching")) {
    recommendations.push("Continue with regular stretching as it provides relief.");
  }
  if (data.activitiesWorse.includes("Sitting >30 min")) {
    recommendations.push("Break up prolonged sitting with short movement breaks every 30 minutes.");
  }
  if (data.activitiesWorse.includes("Standing >30 min")) {
    recommendations.push("Alternate between sitting and standing every 30 minutes.");
  }

  // Sleep posture recommendations
  if (data.sleepPosture === "On Stomach") {
    recommendations.push("Consider changing sleep position to back or side for better spinal alignment.");
  }

  // Duration-based recommendations
  const hasChronicCondition = data.areas.some(
    (a) => a.duration === "More than 1 Year" || a.duration === "6 Months to 1 Year"
  );
  if (hasChronicCondition) {
    recommendations.push(
      "Long-standing condition detected. Structured rehabilitation program recommended."
    );
  }

  // Severity recommendations
  if (severity === "Severe") {
    recommendations.push("High discomfort levels noted. Prioritize practitioner consultation.");
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

function generateInsights(data: AssessmentData, avgDiscomfort: number): string[] {
  const insights: string[] = [];

  // Multi-region insights
  if (data.areas.length >= 3) {
    insights.push(
      `Multiple regions affected (${data.areas.length} areas). This suggests a postural or systemic pattern.`
    );
  }

  // Pattern insights
  if (data.activitiesWorse.length > 3) {
    insights.push(
      "Many movement patterns trigger discomfort. Limited mobility range may be present."
    );
  }

  // Activity insights
  if (data.dailyActivities.includes("Office / Desk Work")) {
    insights.push(
      "Desk work routines likely contributing. Ergonomic assessment and frequent postural resets recommended."
    );
  }

  // Behavioral insights
  const comeAndGoes = data.areas.filter((a) => a.behavior === "Comes and Goes").length;
  if (comeAndGoes > data.areas.length / 2) {
    insights.push(
      "Intermittent discomfort pattern suggests inflammatory or activity-dependent triggers."
    );
  }

  // Positional insights
  if (data.activitiesBetter.includes("Heat")) {
    insights.push("Heat provides relief — indicates muscle stiffness component.");
  }

  return insights.slice(0, 4); // Limit to 4 insights
}

function calculateRecoveryScore(data: AssessmentData): number {
  let score = 100;

  // Deduct based on discomfort
  const avgDiscomfort =
    data.areas.length > 0
      ? data.areas.reduce((sum, a) => sum + a.discomfort, 0) / data.areas.length
      : 0;
  score -= avgDiscomfort * 5; // 0-50 point deduction

  // Deduct based on area count
  score -= Math.min(data.areas.length * 2, 20); // Up to 20 point deduction

  // Deduct based on duration (chronic = lower recovery potential initially)
  const chronicAreas = data.areas.filter(
    (a) => a.duration === "More than 1 Year" || a.duration === "6 Months to 1 Year"
  ).length;
  score -= chronicAreas * 3;

  // Bonus for ROM capture
  score += Object.keys(data.capturedRom).length * 2;

  // Bonus for positive factors
  score += Math.min(data.activitiesBetter.length, 5);

  return Math.max(Math.min(Math.round(score), 100), 20); // Keep between 20-100
}

export function formatReportDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
