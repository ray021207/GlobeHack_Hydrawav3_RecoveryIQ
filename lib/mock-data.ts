"use client";

export type PatientId = "maria" | "james" | "sarah" | "alex";

export type Patient = {
  id: PatientId;
  name: string;
  age: number;
  phone: string;
  dysfunction_profile: string;
  primary_region: string;
  prior_injuries: string[];
  sleep_posture: string;
  discomfort_level: number;
  condition_duration: string;
  activity_ranking: string[];
};

export type Checkin = {
  id: string;
  timestamp: string;
  pain: number;
  function_rating: "yes" | "partial" | "no";
  lifestyle: { meds: boolean; exercises: boolean; sleep: boolean; ate_well: boolean };
  note: string;
  lifestyle_score: number;
};

export type CvScan = {
  id: string;
  type: "pre_session" | "post_session" | "home";
  timestamp: string;
  rom: Record<string, number>;
  symmetry_score: number;
  compensation_index: number;
  baseline_tier: 1 | 2 | 3;
  confidence: number;
};

export type Gamification = {
  points: number;
  gems: number;
  streak: number;
  lastCheckin: string | null;
  badges: string[];
  avatar: { animal: string; accessory: string | null; name: string };
};

export const PATIENTS: Record<PatientId, Patient> = {
  maria: {
    id: "maria",
    name: "Maria Chen",
    age: 42,
    phone: "+16025550101",
    dysfunction_profile: "musculoskeletal_tightness",
    primary_region: "shoulder",
    prior_injuries: ["right_shoulder"],
    sleep_posture: "stomach",
    discomfort_level: 6,
    condition_duration: "chronic",
    activity_ranking: ["office", "sport"],
  },
  james: {
    id: "james",
    name: "James Okafor",
    age: 35,
    phone: "+16025550102",
    dysfunction_profile: "chronic_pain",
    primary_region: "low_back",
    prior_injuries: [],
    sleep_posture: "back",
    discomfort_level: 7,
    condition_duration: "chronic",
    activity_ranking: ["manual", "standing"],
  },
  sarah: {
    id: "sarah",
    name: "Sarah Mitchell",
    age: 28,
    phone: "+16025550103",
    dysfunction_profile: "athletic_recovery",
    primary_region: "knee",
    prior_injuries: ["left_knee"],
    sleep_posture: "left_side",
    discomfort_level: 4,
    condition_duration: "subacute",
    activity_ranking: ["sport", "running"],
  },
  alex: {
    id: "alex",
    name: "Alex Rodriguez",
    age: 51,
    phone: "+16025550104",
    dysfunction_profile: "postural_correction",
    primary_region: "neck",
    prior_injuries: ["whiplash"],
    sleep_posture: "back",
    discomfort_level: 5,
    condition_duration: "chronic",
    activity_ranking: ["office", "computer"],
  },
};

const MOCK_CHECKINS: Record<PatientId, Checkin[]> = {
  maria: [],
  james: [],
  sarah: [],
  alex: [],
};

const MOCK_SCANS: Record<PatientId, CvScan[]> = {
  maria: [],
  james: [],
  sarah: [],
  alex: [],
};

const MOCK_GAM: Record<PatientId, Gamification> = {
  maria: { points: 0, gems: 0, streak: 0, lastCheckin: null, badges: [], avatar: { animal: "fox", accessory: null, name: "Swift Fox" } },
  james: { points: 0, gems: 0, streak: 0, lastCheckin: null, badges: [], avatar: { animal: "bear", accessory: null, name: "Iron Bear" } },
  sarah: { points: 0, gems: 0, streak: 0, lastCheckin: null, badges: [], avatar: { animal: "eagle", accessory: null, name: "Swift Eagle" } },
  alex: { points: 0, gems: 0, streak: 0, lastCheckin: null, badges: [], avatar: { animal: "bear", accessory: null, name: "Steady Bear" } },
};

// ── localStorage helpers ──────────────────────────────────────────────────────

export function seedStorage() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("riq_seeded")) return;
  for (const [id, checkins] of Object.entries(MOCK_CHECKINS)) {
    localStorage.setItem(`checkins_${id}`, JSON.stringify(checkins));
  }
  for (const [id, scans] of Object.entries(MOCK_SCANS)) {
    localStorage.setItem(`cv_scans_${id}`, JSON.stringify(scans));
  }
  for (const [id, gam] of Object.entries(MOCK_GAM)) {
    localStorage.setItem(`gamification_${id}`, JSON.stringify(gam));
  }
  localStorage.setItem("riq_seeded", "1");
}

export function getCheckins(patientId: string): Checkin[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(`checkins_${patientId}`) ?? "[]"); } catch { return []; }
}

export function saveCheckin(patientId: string, checkin: Checkin) {
  const list = getCheckins(patientId);
  list.push(checkin);
  localStorage.setItem(`checkins_${patientId}`, JSON.stringify(list));
}

export function getScans(patientId: string): CvScan[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(`cv_scans_${patientId}`) ?? "[]"); } catch { return []; }
}

export function saveScan(patientId: string, scan: CvScan) {
  const list = getScans(patientId);
  list.push(scan);
  localStorage.setItem(`cv_scans_${patientId}`, JSON.stringify(list));
}

export function getGamification(patientId: string): Gamification {
  if (typeof window === "undefined") return MOCK_GAM.maria;
  try {
    return JSON.parse(localStorage.getItem(`gamification_${patientId}`) ?? "null") ?? MOCK_GAM[patientId as PatientId] ?? MOCK_GAM.maria;
  } catch { return MOCK_GAM.maria; }
}

export function saveGamification(patientId: string, gam: Gamification) {
  localStorage.setItem(`gamification_${patientId}`, JSON.stringify(gam));
}

// ── Derived stats ─────────────────────────────────────────────────────────────

export function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function getRecoveryScore(patientId: string): number {
  const checkins = getCheckins(patientId);
  const scans = getScans(patientId);
  const gam = getGamification(patientId);

  const painScore = checkins.length
    ? (10 - avg(checkins.slice(-3).map((c) => c.pain))) * 10
    : 50;

  const symmScore = scans.length
    ? 100 - (scans[scans.length - 1].symmetry_score ?? 50)
    : 50;

  const adherence = checkins.length
    ? avg(checkins.slice(-5).map((c) => c.lifestyle_score)) * 100
    : 50;

  const streakBonus = Math.min(gam.streak * 2, 10);

  return Math.min(100, Math.round(painScore * 0.4 + symmScore * 0.3 + adherence * 0.2 + streakBonus));
}

export function getVisitRecommendation(patientId: string): string {
  const checkins = getCheckins(patientId);
  const scans = getScans(patientId);
  const avgNPRS = checkins.length ? avg(checkins.map((c) => c.pain)) : 5;
  const nprsImproving = checkins.length > 2 && checkins[checkins.length - 1].pain < checkins[0].pain;
  const compIndex = scans.length ? scans[scans.length - 1].compensation_index : 50;

  if (avgNPRS >= 7 || compIndex > 70) return "2× per week";
  if (avgNPRS >= 4 || !nprsImproving) return "Weekly";
  if (avgNPRS >= 2) return "Every 2 weeks";
  return "Monthly maintenance";
}

export function getTrend(patientId: string): "improving" | "stable" | "declining" {
  const checkins = getCheckins(patientId);
  if (checkins.length < 2) return "stable";
  const first = checkins[0].pain;
  const last = checkins[checkins.length - 1].pain;
  if (last < first - 1) return "improving";
  if (last > first + 1) return "declining";
  return "stable";
}

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

// ── Recovery Plan Tracking ──────────────────────────────────────────────────

export type RecoveryPlanCompletion = {
  week: number;
  day: number; // 1-7
  exercisesCompleted: string[]; // exercise names
  dietFollowed: boolean;
  lifestyleScore: number; // 0-100
  notes: string;
  createdAt?: string; // ISO timestamp
};

export type RecoveryPlanProgress = {
  planId: string;
  createdAt: string;
  completions: RecoveryPlanCompletion[];
  totalPointsEarned: number;
  streakDays: number;
  accessoriesUnlocked: string[];
};

export function getRecoveryPlan(patientId: string): any {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(`recovery_plan_${patientId}`) ?? "null");
  } catch {
    return null;
  }
}

export function saveRecoveryPlan(patientId: string, plan: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`recovery_plan_${patientId}`, JSON.stringify(plan));
}

export function getRecoveryPlanProgress(patientId: string): RecoveryPlanProgress | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(`recovery_plan_progress_${patientId}`) ?? "null");
  } catch {
    return null;
  }
}

export function initRecoveryPlanProgress(patientId: string, planId: string): RecoveryPlanProgress {
  const progress: RecoveryPlanProgress = {
    planId,
    createdAt: new Date().toISOString(),
    completions: [],
    totalPointsEarned: 0,
    streakDays: 0,
    accessoriesUnlocked: [],
  };
  saveRecoveryPlanProgress(patientId, progress);
  return progress;
}

export function saveRecoveryPlanProgress(patientId: string, progress: RecoveryPlanProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`recovery_plan_progress_${patientId}`, JSON.stringify(progress));
}

export function logPlanCompletion(
  patientId: string,
  week: number,
  day: number,
  exercisesCompleted: string[],
  dietFollowed: boolean,
  lifestyleScore: number,
  notes: string = ""
) {
  let progress = getRecoveryPlanProgress(patientId);
  if (!progress) return;

  const completion: RecoveryPlanCompletion = {
    week,
    day,
    exercisesCompleted,
    dietFollowed,
    lifestyleScore,
    notes,
    createdAt: new Date().toISOString(),
  };

  progress.completions.push(completion);

  // Calculate points: exercises (25pts each), diet (15pts), lifestyle (10pts per 10%)
  let pointsEarned = 0;
  pointsEarned += exercisesCompleted.length * 25;
  if (dietFollowed) pointsEarned += 15;
  pointsEarned += Math.floor(lifestyleScore / 10);

  progress.totalPointsEarned += pointsEarned;

  // Update streak
  const lastCompletion = progress.completions.slice(-2, -1)[0];
  if (lastCompletion && daysSince(lastCompletion.createdAt || "") <= 1) {
    progress.streakDays += 1;
  } else {
    progress.streakDays = 1;
  }

  // Unlock accessories based on milestones
  checkAndUnlockAccessories(patientId, progress);

  // Award gamification points
  const gam = getGamification(patientId);
  gam.points += pointsEarned;
  gam.gems += Math.ceil(pointsEarned / 5);
  saveGamification(patientId, gam);

  saveRecoveryPlanProgress(patientId, progress);
}

function checkAndUnlockAccessories(patientId: string, progress: RecoveryPlanProgress) {
  const gam = getGamification(patientId);
  const accessoriesToUnlock: string[] = [];

  // 7-day streak = yoga mat accessory
  if (progress.streakDays >= 7 && !progress.accessoriesUnlocked.includes("yoga_mat")) {
    accessoriesToUnlock.push("yoga_mat");
  }

  // 14-day streak = meditation cushion
  if (progress.streakDays >= 14 && !progress.accessoriesUnlocked.includes("meditation_cushion")) {
    accessoriesToUnlock.push("meditation_cushion");
  }

  // Complete week 1 = resistance band
  const week1Completed = progress.completions.filter((c) => c.week === 1).length >= 7;
  if (week1Completed && !progress.accessoriesUnlocked.includes("resistance_band")) {
    accessoriesToUnlock.push("resistance_band");
  }

  // Complete full 4 weeks = achievement badge
  const week4Completed = progress.completions.filter((c) => c.week === 4).length >= 7;
  if (week4Completed && !progress.accessoriesUnlocked.includes("master_recovery")) {
    accessoriesToUnlock.push("master_recovery");
    if (!gam.badges.includes("Master of Recovery")) {
      gam.badges.push("Master of Recovery");
    }
  }

  // 500+ total points = champion status
  if (progress.totalPointsEarned >= 500 && !progress.accessoriesUnlocked.includes("champion_crown")) {
    accessoriesToUnlock.push("champion_crown");
  }

  // 100% adherence for week = weekly champion
  for (let w = 1; w <= 4; w++) {
    const weekCompletions = progress.completions.filter((c) => c.week === w);
    const weekPerfect = weekCompletions.length === 7 && weekCompletions.every((c) => c.exercisesCompleted.length > 0 && c.dietFollowed);
    if (weekPerfect && !progress.accessoriesUnlocked.includes(`week${w}_perfect`)) {
      accessoriesToUnlock.push(`week${w}_perfect`);
    }
  }

  // Apply unlocked accessories
  for (const accessory of accessoriesToUnlock) {
    if (!progress.accessoriesUnlocked.includes(accessory)) {
      progress.accessoriesUnlocked.push(accessory);
      gam.avatar.accessory = accessory; // Equip latest accessory
    }
  }

  saveGamification(patientId, gam);
}

export function getPlanAdherenceScore(patientId: string): number {
  const progress = getRecoveryPlanProgress(patientId);
  if (!progress || !progress.completions.length) return 0;

  const completions = progress.completions;
  const exerciseAdherence = completions.filter((c) => c.exercisesCompleted.length > 0).length / completions.length;
  const dietAdherence = completions.filter((c) => c.dietFollowed).length / completions.length;
  const lifestyleScore = completions.reduce((a, b) => a + b.lifestyleScore, 0) / completions.length / 100;

  return Math.round((exerciseAdherence * 0.4 + dietAdherence * 0.35 + lifestyleScore * 0.25) * 100);
}

export function getWeeklyProgress(patientId: string, week: number): number {
  const progress = getRecoveryPlanProgress(patientId);
  if (!progress) return 0;

  const weekCompletions = progress.completions.filter((c) => c.week === week);
  if (!weekCompletions.length) return 0;

  const exerciseScore = weekCompletions.filter((c) => c.exercisesCompleted.length > 0).length / 7;
  const dietScore = weekCompletions.filter((c) => c.dietFollowed).length / 7;
  const lifestyleScore = weekCompletions.reduce((a, b) => a + b.lifestyleScore, 0) / 700;

  return Math.round((exerciseScore * 0.4 + dietScore * 0.35 + lifestyleScore * 0.25) * 100);
}

// ── Full Reset Function ─────────────────────────────────────────────────────

export function clearAllUserData() {
  if (typeof window === "undefined") return;
  const patientIds: PatientId[] = ["maria", "james", "sarah", "alex"];
  
  // Clear all patient-related data
  for (const id of patientIds) {
    localStorage.removeItem(`checkins_${id}`);
    localStorage.removeItem(`cv_scans_${id}`);
    localStorage.removeItem(`gamification_${id}`);
    localStorage.removeItem(`assessment_${id}`);
    localStorage.removeItem(`riq_assessment_${id}`);
    localStorage.removeItem(`kinetic_report_${id}`);
  }
  
  // Clear global/session data
  localStorage.removeItem("riq_seeded");
  localStorage.removeItem("riq_userId");
  localStorage.removeItem("riq_role");
  
  // Re-seed with fresh empty data
  seedStorage();
}
