export type Dosha = "vata" | "pitta" | "kapha" | "balanced";
export type Season = "spring" | "summer" | "autumn" | "winter";

export interface LifestyleRecommendation {
  category: "morning" | "meals" | "activity" | "evening" | "general";
  recommendation: string;
  dosha: Dosha;
  reason: string;
  durationMin?: number; // minutes
}

export interface AyurvedicPlan {
  dosha: Dosha;
  season: Season;
  severity: "mild" | "moderate" | "severe";
  dinacharya: LifestyleRecommendation[]; // daily routine
  dietaryGuidelines: string[];
  avoidFoods: string[];
  favoredFoods: string[];
  dailyActivities: string[];
  sleepProtocol: {
    bedtime: string; // e.g., "10:00 PM"
    wakeTime: string;
    sleepDuration: string;
    sleepPosture: string;
    preSleeproutine: string[];
  };
  stressManagement: string[];
  seasonalAdjustments: string[];
}

function getDoshaFromName(name: string): Dosha {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("vata") || nameLower.includes("air") || nameLower.includes("thin")) return "vata";
  if (nameLower.includes("pitta") || nameLower.includes("fire") || nameLower.includes("athletic")) return "pitta";
  if (nameLower.includes("kapha") || nameLower.includes("water") || nameLower.includes("robust")) return "kapha";
  return "balanced";
}

export function generateAyurvedicPlan(
  patientName: string,
  severity: "mild" | "moderate" | "severe",
  affectedAreas: string[]
): AyurvedicPlan {
  const dosha = getDoshaFromName(patientName);
  const season = getSeasonByMonth();

  const baseRecommendations: LifestyleRecommendation[] = [
    // VATA recommendations
    {
      category: "morning",
      recommendation: "Wake up between 6-7 AM, drink warm water with lemon",
      dosha: "vata",
      reason: "Warmth and routine stabilize vata's airy nature",
    },
    {
      category: "morning",
      recommendation: "Abhyanga (self-massage) with warm sesame oil for 10-15 minutes",
      dosha: "vata",
      reason: "Oil massage grounds vata energy and relieves joint stiffness",
      durationMin: 15,
    },
    {
      category: "activity",
      recommendation: "Gentle yoga (Hatha or Iyengar) 20-30 minutes, grounding poses",
      dosha: "vata",
      reason: "Grounding and stabilizing for vata, prevents anxious thoughts",
      durationMin: 30,
    },
    {
      category: "meals",
      recommendation: "Eat warm, nourishing foods at regular times",
      dosha: "vata",
      reason: "Routine and warmth regulate vata digestion",
    },
    {
      category: "evening",
      recommendation: "Warm milk with ghee, nutmeg, and cardamom 1 hour before bed",
      dosha: "vata",
      reason: "Calms vata's tendency toward insomnia and worry",
    },

    // PITTA recommendations
    {
      category: "morning",
      recommendation: "Wake up between 5-6 AM, cool water (not ice) with mint",
      dosha: "pitta",
      reason: "Cooling starts the day, prevents pitta overheating",
    },
    {
      category: "morning",
      recommendation: "Coconut or cooling oil massage (avoid heating oils)",
      dosha: "pitta",
      reason: "Cooling oils balance pitta's heat and inflammation",
      durationMin: 15,
    },
    {
      category: "activity",
      recommendation: "Swimming or water-based exercise, cooling yoga (forward bends)",
      dosha: "pitta",
      reason: "Water activities cool and soothe pitta inflammation",
      durationMin: 30,
    },
    {
      category: "meals",
      recommendation: "Eat cool/room temperature foods, emphasize bitter & sweet tastes",
      dosha: "pitta",
      reason: "Cooling foods reduce pitta aggravation and inflammation",
    },
    {
      category: "evening",
      recommendation: "Cool coconut milk with rose petals before bed",
      dosha: "pitta",
      reason: "Rose is cooling and calming for pitta's intense nature",
    },

    // KAPHA recommendations
    {
      category: "morning",
      recommendation: "Wake up between 4-5 AM, warm ginger tea with honey",
      dosha: "kapha",
      reason: "Early rising and ginger stimulate kapha's slow metabolism",
      durationMin: 5,
    },
    {
      category: "morning",
      recommendation: "Vigorous oil massage or dry brush massage (Garshana)",
      dosha: "kapha",
      reason: "Stimulates circulation and energy in kapha's heavy nature",
      durationMin: 15,
    },
    {
      category: "activity",
      recommendation: "Vigorous aerobic exercise - running, dancing, gym 45-60 minutes",
      dosha: "kapha",
      reason: "Kapha needs vigorous exercise to overcome sluggishness",
      durationMin: 60,
    },
    {
      category: "meals",
      recommendation: "Light meals, warm foods, stimulating spices (ginger, black pepper)",
      dosha: "kapha",
      reason: "Light food prevents kapha heaviness and sluggishness",
    },
    {
      category: "evening",
      recommendation: "Light dinner before 7 PM, herbal tea with warming spices",
      dosha: "kapha",
      reason: "Early light meal supports kapha's sluggish digestion",
    },
  ];

  // Filter relevant recommendations
  const relevantRecs = baseRecommendations.filter((r) => r.dosha === dosha || r.dosha === "balanced");

  const dinacharya = relevantRecs;

  const dietaryGuidelines =
    dosha === "vata"
      ? [
          "Eat warm, cooked foods with healthy fats",
          "Include sesame, ghee, and warming spices",
          "Stay hydrated with warm herbal teas",
          "Eat at consistent times each day",
          "Avoid raw, cold, or dried foods",
        ]
      : dosha === "pitta"
      ? [
          "Emphasize cooling foods like coconut, cucumber, melons",
          "Use ghee moderately, avoid excess oil",
          "Include bitter & sweet tastes",
          "Drink room temperature or cool water",
          "Avoid spicy, acidic, or fried foods",
        ]
      : [
          "Keep meals light and warm",
          "Emphasize stimulating spices and warming foods",
          "Avoid heavy, oily, or cold foods",
          "Eat smaller portions more frequently",
          "Include bitter and pungent tastes",
        ];

  const avoidFoods =
    dosha === "vata"
      ? ["Cold drinks", "Raw vegetables", "Dry snacks", "Caffeine", "Alcohol"]
      : dosha === "pitta"
      ? ["Spicy foods", "Acidic foods", "Alcohol", "Excess oil", "Red meat"]
      : ["Heavy meats", "Dairy", "Oils", "Sweets", "Cold foods"];

  const favoredFoods =
    dosha === "vata"
      ? ["Sesame seeds", "Ghee", "Warm soups", "Grains", "Root vegetables"]
      : dosha === "pitta"
      ? ["Coconut", "Cucumber", "Leafy greens", "Grains", "Fresh fruits"]
      : ["Light grains", "Legumes", "Leafy greens", "Raw vegetables", "Honey"];

  const dailyActivities =
    dosha === "vata"
      ? ["Grounding practices", "Meditation", "Gentle walks", "Creative activities", "Social time"]
      : dosha === "pitta"
      ? ["Swimming", "Outdoor time (cool hours)", "Competitive sports", "Problem-solving", "Creative work"]
      : ["Vigorous exercise", "Team sports", "Motivating activities", "Learning", "Helping others"];

  const sleepProtocol =
    dosha === "vata"
      ? {
          bedtime: "10:00 PM",
          wakeTime: "7:00 AM",
          sleepDuration: "7-8 hours",
          sleepPosture: "On side (left for better digestion)",
          preSleeproutine: [
            "Warm oil massage 15 min before bed",
            "Warm milk with nutmeg and cardamom",
            "Gentle breathing exercises (Nadi Shodhana)",
            "Avoid screens 30 min before sleep",
          ],
        }
      : dosha === "pitta"
      ? {
          bedtime: "10:30 PM",
          wakeTime: "6:00 AM",
          sleepDuration: "7-8 hours",
          sleepPosture: "On right side or back",
          preSleeproutine: [
            "Cooling oil massage with coconut oil",
            "Cool coconut milk with rose",
            "Meditation or calming music",
            "Sleep in cool, well-ventilated room",
          ],
        }
      : {
          bedtime: "9:30 PM",
          wakeTime: "5:00 AM",
          sleepDuration: "6-7 hours",
          sleepPosture: "On back or side",
          preSleeproutine: [
            "Light stretching or gentle massage",
            "Warm water or herbal tea",
            "Journaling to clear mind",
            "Avoid napping during day",
          ],
        };

  const stressManagement =
    dosha === "vata"
      ? [
          "Regular meditation (10-20 min daily)",
          "Grounding breathing: Bhramari (bee breath)",
          "Warm herbal baths",
          "Routine and predictability",
          "Warm hugs and social connection",
        ]
      : dosha === "pitta"
      ? [
          "Cooling breathing: Shitali (cooling breath)",
          "Moonlight walks in cool hours",
          "Forgiveness and letting go practices",
          "Humor and playfulness",
          "Time in nature (water, trees)",
        ]
      : [
          "Vigorous exercise as stress relief",
          "Motivational activities",
          "Community service",
          "Stimulating mental activities",
          "Social engagement and movement",
        ];

  const seasonalAdjustments =
    season === "spring"
      ? [
          "Increase ginger and warming spices",
          "Light cleansing practices",
          "More vigorous exercise",
          "Avoid excess dairy and sweets",
        ]
      : season === "summer"
      ? ["Emphasize cooling foods and drinks", "Lighter meals", "More water activities", "Avoid excessive heat exposure"]
      : season === "autumn"
      ? [
          "Add more healthy fats and warmth",
          "Establish stronger routine",
          "Ground yourself with roots and grains",
          "Stay hydrated",
        ]
      : ["Nourishing warm foods", "Longer sleep", "More indoor activities", "Warming spices and oils"];

  return {
    dosha,
    season,
    severity,
    dinacharya,
    dietaryGuidelines,
    avoidFoods,
    favoredFoods,
    dailyActivities,
    sleepProtocol,
    stressManagement,
    seasonalAdjustments,
  };
}

function getSeasonByMonth(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring"; // Mar-May
  if (month >= 5 && month <= 7) return "summer"; // Jun-Aug
  if (month >= 8 && month <= 10) return "autumn"; // Sep-Nov
  return "winter"; // Dec-Feb
}

export function formatDoshaName(dosha: Dosha): string {
  return dosha.charAt(0).toUpperCase() + dosha.slice(1);
}
