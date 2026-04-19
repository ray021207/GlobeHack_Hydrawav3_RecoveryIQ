import type { AssessmentData } from "./kinetic-analysis";

export interface Exercise {
  id: string;
  name: string;
  area: string;
  type: "rom" | "strengthen" | "flexibility" | "balance" | "functional";
  difficulty: 1 | 2 | 3 | 4;
  reps: string;
  duration?: string;
  frequency: "daily" | "every-other-day" | "3x-week" | "2x-week";
  instructions: string[];
  modifications: string[];
  cautions: string[];
  week: 1 | 2 | 3 | 4;
}

export interface ExercisePlan {
  patientId: string;
  startDate: string;
  duration: "4-weeks" | "6-weeks" | "8-weeks";
  severity: "mild" | "moderate" | "severe";
  affectedAreas: string[];
  week1Exercises: Exercise[];
  week2Exercises: Exercise[];
  week3Exercises: Exercise[];
  week4Exercises: Exercise[];
  progressionNotes: string;
}

export interface ExerciseLog {
  exerciseId: string;
  date: string;
  completed: boolean;
  repsCompleted?: number;
  duration?: number; // minutes
  difficulty: number;
  notes?: string;
  painLevel?: number; // 0-10
}

const EXERCISE_LIBRARY: Record<string, Exercise[]> = {
  // Neck exercises
  neck_front: [
    {
      id: "neck_gentle_turn",
      name: "Gentle Neck Turns",
      area: "Neck",
      type: "rom",
      difficulty: 1,
      reps: "8-10 each side",
      duration: "2-3 minutes",
      frequency: "daily",
      week: 1,
      instructions: [
        "Sit upright with shoulders relaxed",
        "Slowly turn head to look over right shoulder",
        "Hold 2-3 seconds, return to center",
        "Repeat on left side",
        "Move slowly and controlled",
      ],
      modifications: ["Only go 50% range if pain increases", "Use hand resistance for gentle stretch"],
      cautions: ["No sudden jerking movements", "Stop if dizzy", "Avoid pushing into pain"],
    },
    {
      id: "neck_flexion",
      name: "Neck Flexion Stretch",
      area: "Neck",
      type: "flexibility",
      difficulty: 2,
      reps: "3 sets of 10-15 seconds",
      frequency: "daily",
      week: 2,
      instructions: [
        "Sit upright",
        "Gently bring chin toward chest",
        "Feel stretch in back of neck",
        "Hold 15 seconds",
        "Relax and repeat",
      ],
      modifications: ["Reduce range if neck feels stiff", "Use warming pad before stretching"],
      cautions: ["No forcing movement", "Stop immediately if sharp pain occurs"],
    },
  ],

  // Shoulder exercises
  shoulder_r: [
    {
      id: "shoulder_circles",
      name: "Shoulder Circles",
      area: "Shoulder",
      type: "rom",
      difficulty: 1,
      reps: "10 forward, 10 backward",
      duration: "3 minutes",
      frequency: "daily",
      week: 1,
      instructions: [
        "Stand with arms at sides",
        "Lift shoulders toward ears",
        "Roll them backward in smooth circles",
        "Do 10 backward circles",
        "Reverse direction for 10 forward circles",
      ],
      modifications: ["Reduce circle size if painful", "One shoulder at a time if needed"],
      cautions: ["Keep movements smooth", "No jerking"],
    },
    {
      id: "shoulder_pendulum",
      name: "Pendulum Swings",
      area: "Shoulder",
      type: "flexibility",
      difficulty: 1,
      reps: "20-30 each direction",
      frequency: "3x-week",
      week: 1,
      instructions: [
        "Bend forward at waist, let arm hang",
        "Swing arm gently side to side",
        "Let gravity do the work",
        "Gradually increase range",
      ],
      modifications: ["Support torso with other hand on table", "Use wall support if needed"],
      cautions: ["No forcing movement", "Stop if sharp pain"],
    },
    {
      id: "shoulder_external_rotation",
      name: "External Shoulder Rotation",
      area: "Shoulder",
      type: "rom",
      difficulty: 2,
      reps: "8-10 each side",
      frequency: "every-other-day",
      week: 2,
      instructions: [
        "Lie on right side",
        "Bend elbow to 90 degrees",
        "Slowly rotate forearm up toward ceiling",
        "Hold 2 seconds at top",
        "Return to start",
      ],
      modifications: ["Reduce range for pain", "Can do standing with band"],
      cautions: ["No forcing rotation", "Keep elbow tucked"],
    },
  ],

  // Lower back/Lumbar exercises
  lumbar: [
    {
      id: "cat_cow",
      name: "Cat-Cow Stretch",
      area: "Lower Back",
      type: "flexibility",
      difficulty: 1,
      reps: "8-10 each direction",
      frequency: "daily",
      week: 1,
      instructions: [
        "Start on hands and knees",
        "Cow: Drop belly, lift head/tailbone (gentle arch)",
        "Hold 2 seconds",
        "Cat: Round spine, tuck chin/tailbone",
        "Hold 2 seconds, repeat",
      ],
      modifications: ["Go slower if stiff", "Reduce range of motion"],
      cautions: ["Move gently", "No forced stretching"],
    },
    {
      id: "pelvic_tilt",
      name: "Pelvic Tilt",
      area: "Lower Back",
      type: "strengthen",
      difficulty: 1,
      reps: "2 sets of 10",
      frequency: "daily",
      week: 1,
      instructions: [
        "Lie on back, knees bent, feet on floor",
        "Tighten abdominal muscles",
        "Tilt pelvis so lower back flattens",
        "Hold 3-5 seconds",
        "Release and repeat",
      ],
      modifications: ["Smaller tilts if weak", "Rest between sets"],
      cautions: ["No straining", "Breathe continuously"],
    },
    {
      id: "bridges",
      name: "Glute Bridges",
      area: "Lower Back",
      type: "strengthen",
      difficulty: 2,
      reps: "2 sets of 8-10",
      frequency: "every-other-day",
      week: 2,
      instructions: [
        "Lie on back, knees bent, feet flat",
        "Lift hips toward ceiling",
        "Squeeze glutes at top",
        "Hold 2-3 seconds",
        "Lower slowly",
      ],
      modifications: ["Hold bridges for shorter time", "Single leg once strong enough"],
      cautions: ["Don't overarch lower back", "Stop if sharp pain"],
    },
    {
      id: "child_pose",
      name: "Child's Pose",
      area: "Lower Back",
      type: "flexibility",
      difficulty: 1,
      reps: "Hold 30-60 seconds",
      frequency: "daily",
      week: 1,
      instructions: [
        "Start on hands and knees",
        "Sit hips back toward heels",
        "Extend arms forward",
        "Rest forehead down",
        "Breathe deeply",
      ],
      modifications: ["Keep arms closer if tight", "Use pillow for support"],
      cautions: ["No forcing stretch", "Breathe slowly"],
    },
  ],

  // Hip/Glute exercises
  hip_l: [
    {
      id: "hip_circles",
      name: "Hip Circles",
      area: "Hip",
      type: "rom",
      difficulty: 1,
      reps: "8-10 each direction",
      frequency: "daily",
      week: 1,
      instructions: [
        "Stand on one leg (hold wall if needed)",
        "Make small circles with free knee",
        "Circle forward 8-10 times",
        "Reverse direction",
        "Switch legs",
      ],
      modifications: ["Smaller circles", "Hold support with both hands"],
      cautions: ["Maintain balance", "Move slowly"],
    },
    {
      id: "clamshells",
      name: "Clamshells",
      area: "Hip",
      type: "strengthen",
      difficulty: 1,
      reps: "2 sets of 12-15",
      frequency: "every-other-day",
      week: 1,
      instructions: [
        "Lie on right side, knees bent",
        "Keep feet together",
        "Lift top knee toward ceiling",
        "Hold 1 second",
        "Lower and repeat",
      ],
      modifications: ["Smaller range if weak", "Place pillow between knees"],
      cautions: ["Keep lower body stable", "No rotating hips"],
    },
  ],

  // Knee exercises
  knee_l: [
    {
      id: "quad_sets",
      name: "Quadriceps Sets",
      area: "Knee",
      type: "strengthen",
      difficulty: 1,
      reps: "2 sets of 15",
      frequency: "daily",
      week: 1,
      instructions: [
        "Sit with leg extended or lie down",
        "Tighten thigh muscle",
        "Hold 5 seconds",
        "Relax",
        "Repeat",
      ],
      modifications: ["Place pillow under knee", "Smaller holds if fatigued"],
      cautions: ["No joint pain", "Stop if swelling increases"],
    },
    {
      id: "straight_leg_raise",
      name: "Straight Leg Raises",
      area: "Knee",
      type: "strengthen",
      difficulty: 2,
      reps: "2 sets of 10",
      frequency: "every-other-day",
      week: 2,
      instructions: [
        "Lie on back, one knee bent",
        "Extend other leg",
        "Tighten quad and lift leg 6-12 inches",
        "Hold 2 seconds",
        "Lower slowly",
      ],
      modifications: ["Keep knee bent if too difficult", "Reduce height"],
      cautions: ["Stop if knee pain", "Keep core engaged"],
    },
  ],
};

export function generateExercisePlan(assessment: AssessmentData): ExercisePlan {
  const severity =
    assessment.areas.reduce((sum, a) => sum + a.discomfort, 0) / Math.max(assessment.areas.length, 1) > 7
      ? "severe"
      : assessment.areas.reduce((sum, a) => sum + a.discomfort, 0) / Math.max(assessment.areas.length, 1) > 4
      ? "moderate"
      : "mild";

  const affectedAreas = assessment.areas.map((a) => a.regionId);

  // Build week-by-week progressions
  const allExercises: Exercise[] = [];
  affectedAreas.forEach((area) => {
    if (EXERCISE_LIBRARY[area]) {
      allExercises.push(...EXERCISE_LIBRARY[area]);
    }
  });

  const weekExercises: Record<1 | 2 | 3 | 4, Exercise[]> = { 1: [], 2: [], 3: [], 4: [] };
  [1, 2, 3, 4].forEach((week) => {
    weekExercises[week as 1 | 2 | 3 | 4] = allExercises
      .filter((e) => e.week <= week)
      .sort((a, b) => a.difficulty - b.difficulty)
      .slice(0, Math.min(5, week + 2));
  });

  const progressionNotes =
    severity === "severe"
      ? "Start with gentle ROM exercises. Progress slowly. Stop if pain increases."
      : severity === "moderate"
      ? "Mix ROM and light strengthening. Progress to moderate intensity in week 3-4."
      : "Mix all exercise types. Progress to higher difficulty by week 3.";

  return {
    patientId: assessment.areas[0]?.regionId ?? "unknown",
    startDate: new Date().toISOString(),
    duration: "4-weeks",
    severity,
    affectedAreas,
    week1Exercises: weekExercises[1],
    week2Exercises: weekExercises[2],
    week3Exercises: weekExercises[3],
    week4Exercises: weekExercises[4],
    progressionNotes,
  };
}

export function getExercisesByWeek(plan: ExercisePlan, week: 1 | 2 | 3 | 4): Exercise[] {
  return plan[`week${week}Exercises` as keyof ExercisePlan] as Exercise[];
}
