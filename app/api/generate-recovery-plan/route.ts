import { Anthropic } from "@anthropic-ai/sdk";

interface RecoveryPlanRequest {
  patientName: string;
  affectedRegions: string[];
  severityLevel: string;
  recoveryScore: number;
  primaryComplaint: string;
  duration: string;
  lifestyle: string;
}

interface RecoveryWeek {
  week: number;
  focus: string;
  exercises: Array<{ name: string; duration: string; frequency: string; modifications: string; precautions: string }>;
  diet: Array<{ meal: string; recommendations: string[]; ayurvedicPrinciples: string[] }>;
  lifestyle: Array<{ activity: string; duration: string; benefits: string }>;
}

interface RecoveryPlan {
  overviewSummary: string;
  ayurvedicAssessment: { dosha: string; imbalance: string; recommendations: string[] };
  weeks: RecoveryWeek[];
  supplementaryTips: { mobility: string[]; nutrition: string[]; lifestyle: string[] };
}

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const body: RecoveryPlanRequest = await request.json();

    const prompt = `You are an expert in integrative recovery, combining evidence-based physical therapy with Ayurvedic principles. Create a personalized 4-week recovery plan.

Patient Profile:
- Name: ${body.patientName}
- Affected Regions: ${body.affectedRegions.join(", ")}
- Severity: ${body.severityLevel}
- Recovery Score: ${body.recoveryScore}/100
- Primary Complaint: ${body.primaryComplaint}
- Duration: ${body.duration}
- Lifestyle: ${body.lifestyle}

Create a comprehensive 4-week recovery plan in the following JSON format (RESPOND ONLY WITH VALID JSON, NO MARKDOWN):

{
  "overviewSummary": "2-3 sentence overview of the recovery approach",
  "ayurvedicAssessment": {
    "dosha": "Identified dosha imbalance (Vata/Pitta/Kapha)",
    "imbalance": "Brief explanation of dosha imbalance",
    "recommendations": ["3-4 specific Ayurvedic recommendations"]
  },
  "weeks": [
    {
      "week": 1,
      "focus": "Phase focus (e.g., 'Gentle Mobility & Tissue Healing')",
      "exercises": [
        {
          "name": "Exercise name",
          "duration": "e.g., 15-20 minutes",
          "frequency": "e.g., 2-3 times daily",
          "modifications": "Specific form cues and range modifications",
          "precautions": "Safety notes"
        }
      ],
      "diet": [
        {
          "meal": "Breakfast/Lunch/Dinner/Snacks",
          "recommendations": ["Food recommendations specific to recovery"],
          "ayurvedicPrinciples": ["Warm foods aid digestion", "Ghee for joint lubrication"]
        }
      ],
      "lifestyle": [
        {
          "activity": "Activity name",
          "duration": "Recommended duration",
          "benefits": "How it supports recovery"
        }
      ]
    }
  ],
  "supplementaryTips": {
    "mobility": ["Mobility tips integrating gentle stretching"],
    "nutrition": ["Supplement suggestions and dietary principles"],
    "lifestyle": ["Sleep, stress management, seasonal adjustments"]
  }
}

Ensure:
1. Exercises progress in intensity from week 1→4
2. All exercises include Ayurvedic principles (warm oils, gentle movements for Vata, cooling for Pitta)
3. Diet recommendations use whole foods, seasonal ingredients, digestive support (ghee, spices)
4. Include specific joint care for ${body.affectedRegions[0] || "affected areas"}
5. Precautions for ${body.severityLevel} severity level`;

    console.log("Calling Claude API with model and request body...");

    const message = await client.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    let plan: RecoveryPlan;
    try {
      plan = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from the response if it's wrapped in markdown code blocks
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse recovery plan response");
      }
    }

    return Response.json(plan);
  } catch (error) {
    console.error("Recovery plan generation error:", error);
    return Response.json(
      {
        error: "Failed to generate recovery plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
