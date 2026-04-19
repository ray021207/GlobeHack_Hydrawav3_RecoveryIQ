import { AssessmentData } from "./kinetic-analysis";

export async function generateIntelligentReport(data: AssessmentData): Promise<{
  recommendations: string[];
  insights: string[];
  executiveSummary: string;
  treatmentPriorities: string[];
}> {
  try {
    const response = await fetch("/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assessmentData: data,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate report with Claude");
    }

    return await response.json();
  } catch (error) {
    console.error("Claude report generation failed:", error);
    // Fallback to template-based recommendations
    return generateFallbackReport(data);
  }
}

function generateFallbackReport(data: AssessmentData) {
  return {
    recommendations: [
      "Follow prescribed exercise regimen",
      "Monitor activity levels and symptoms",
      "Maintain consistent sleep schedule",
    ],
    insights: [
      "Assessment completed successfully",
      "Multiple areas affected",
    ],
    executiveSummary:
      "Patient has completed comprehensive assessment. Detailed analysis available upon successful Claude integration.",
    treatmentPriorities: ["Symptom Management", "ROM Restoration", "Activity Normalization"],
  };
}
