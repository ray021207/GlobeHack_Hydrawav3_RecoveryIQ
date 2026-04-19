import { NextRequest, NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import type { AssessmentData } from "@/lib/kinetic-analysis";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assessmentData: AssessmentData = body.assessmentData;

    // Format assessment data into a detailed prompt
    const prompt = formatAssessmentPrompt(assessmentData);

    // Call Claude Sonnet 3.5
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the response text
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse Claude's response
    const parsed = parseClaudeResponse(responseText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

function formatAssessmentPrompt(data: AssessmentData): string {
  const primaryAreas = data.areas.filter((a) => a.isPrimary).map((a) => a.regionId);
  const avgDiscomfort =
    data.areas.reduce((sum, a) => sum + a.discomfort, 0) / Math.max(data.areas.length, 1);

  return `You are an expert clinical physiotherapist analyzing a patient's musculoskeletal assessment. Provide intelligent, personalized recommendations based on the following assessment data.

PATIENT ASSESSMENT DATA:
======================================
AFFECTED AREAS & SYMPTOMS:
${data.areas
  .map(
    (area) => `
- ${area.regionId.toUpperCase()}
  Discomfort: ${area.discomfort}/10
  Type: ${area.behavior}
  Duration: ${area.duration}
  Primary Problem: ${area.isPrimary ? "Yes" : "No"}
  Patient Notes: ${area.notes || "None"}
`
  )
  .join("")}

BEHAVIORAL PATTERNS:
- Activities that worsen symptoms: ${data.activitiesWorse.join(", ") || "None reported"}
- Activities that improve symptoms: ${data.activitiesBetter.join(", ") || "None reported"}
- Daily activities: ${data.dailyActivities.join(", ") || "None reported"}
- Sleep posture: ${data.sleepPosture || "Not specified"}

RANGE OF MOTION ANALYSIS:
${Object.keys(data.capturedRom).length > 0
  ? `Exercises captured: ${Object.keys(data.capturedRom).join(", ")}`
  : "No ROM measurements captured yet"}
${data.romNote ? `Patient notes: ${data.romNote}` : ""}

SEVERITY SUMMARY:
- Average discomfort level: ${avgDiscomfort.toFixed(1)}/10
- Severity: ${avgDiscomfort > 7 ? "SEVERE" : avgDiscomfort > 4 ? "MODERATE" : "MILD"}
- Number of affected areas: ${data.areas.length}
- Primary problem areas: ${primaryAreas.join(", ")}

======================================

GENERATE A COMPREHENSIVE RECOVERY ASSESSMENT. Return your response in this exact JSON format:

{
  "executiveSummary": "A 2-3 sentence professional summary of the patient's condition and recovery potential",
  "recommendations": [
    "First specific, actionable recommendation based on the assessment",
    "Second specific recommendation",
    "Third specific recommendation",
    "Fourth specific recommendation",
    "Fifth specific recommendation"
  ],
  "insights": [
    "First clinical insight about the condition patterns",
    "Second insight about contributing factors",
    "Third insight about recovery prognosis"
  ],
  "treatmentPriorities": [
    "Highest priority issue to address",
    "Secondary priority",
    "Tertiary priority"
  ],
  "progressionWarnings": [
    "Any warning signs or red flags to monitor"
  ]
}

Focus on practical, evidence-based recommendations that consider:
1. The specific body regions affected and their interdependencies
2. Activity and postural triggers identified by the patient
3. Sleep quality and positioning impacts
4. ROM limitations and their functional implications
5. Timeline and severity of symptoms
6. Individual patient behaviors that help or hinder recovery

Ensure recommendations are specific to THIS patient's assessment, not generic advice.`;
}

function parseClaudeResponse(text: string) {
  try {
    // Extract JSON from the response (Claude might include other text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      executiveSummary: parsed.executiveSummary || "",
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      treatmentPriorities: Array.isArray(parsed.treatmentPriorities)
        ? parsed.treatmentPriorities
        : [],
      progressionWarnings: Array.isArray(parsed.progressionWarnings)
        ? parsed.progressionWarnings
        : [],
    };
  } catch (error) {
    console.error("Failed to parse Claude response:", error);
    return {
      executiveSummary: "Assessment completed",
      recommendations: [],
      insights: [],
      treatmentPriorities: [],
      progressionWarnings: [],
    };
  }
}
