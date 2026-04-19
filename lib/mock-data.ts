"use client";

export type PatientId = "maria" | "james" | "sarah";

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
};

const MOCK_CHECKINS: Record<PatientId, Checkin[]> = {
  maria: [
    { id: "c1", timestamp: "2026-04-04T09:00:00Z", pain: 7, function_rating: "partial", lifestyle: { meds: true, exercises: false, sleep: false, ate_well: true }, note: "Shoulder stiff in morning", lifestyle_score: 0.5 },
    { id: "c2", timestamp: "2026-04-07T09:00:00Z", pain: 6, function_rating: "partial", lifestyle: { meds: true, exercises: true, sleep: false, ate_well: true }, note: "", lifestyle_score: 0.75 },
    { id: "c3", timestamp: "2026-04-10T09:00:00Z", pain: 5, function_rating: "partial", lifestyle: { meds: true, exercises: true, sleep: true, ate_well: true }, note: "Feeling better after exercises", lifestyle_score: 1.0 },
    { id: "c4", timestamp: "2026-04-14T09:00:00Z", pain: 4, function_rating: "yes", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "", lifestyle_score: 0.75 },
    { id: "c5", timestamp: "2026-04-17T09:00:00Z", pain: 3, function_rating: "yes", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "Much improved!", lifestyle_score: 1.0 },
  ],
  james: [
    { id: "c1", timestamp: "2026-04-05T09:00:00Z", pain: 8, function_rating: "no", lifestyle: { meds: true, exercises: false, sleep: false, ate_well: false }, note: "Bad flare-up", lifestyle_score: 0.25 },
    { id: "c2", timestamp: "2026-04-08T09:00:00Z", pain: 7, function_rating: "no", lifestyle: { meds: true, exercises: false, sleep: true, ate_well: false }, note: "", lifestyle_score: 0.5 },
    { id: "c3", timestamp: "2026-04-11T09:00:00Z", pain: 7, function_rating: "partial", lifestyle: { meds: true, exercises: true, sleep: true, ate_well: true }, note: "Tried the exercises", lifestyle_score: 1.0 },
    { id: "c4", timestamp: "2026-04-15T09:00:00Z", pain: 6, function_rating: "partial", lifestyle: { meds: true, exercises: true, sleep: false, ate_well: true }, note: "", lifestyle_score: 0.75 },
    { id: "c5", timestamp: "2026-04-18T09:00:00Z", pain: 6, function_rating: "partial", lifestyle: { meds: true, exercises: false, sleep: true, ate_well: false }, note: "Stable", lifestyle_score: 0.5 },
  ],
  sarah: [
    { id: "c1", timestamp: "2026-04-06T09:00:00Z", pain: 5, function_rating: "partial", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "Knee swollen after run", lifestyle_score: 0.75 },
    { id: "c2", timestamp: "2026-04-09T09:00:00Z", pain: 4, function_rating: "partial", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "", lifestyle_score: 1.0 },
    { id: "c3", timestamp: "2026-04-12T09:00:00Z", pain: 3, function_rating: "yes", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "Great progress", lifestyle_score: 1.0 },
    { id: "c4", timestamp: "2026-04-16T09:00:00Z", pain: 3, function_rating: "yes", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "", lifestyle_score: 1.0 },
    { id: "c5", timestamp: "2026-04-18T09:00:00Z", pain: 2, function_rating: "yes", lifestyle: { meds: false, exercises: true, sleep: true, ate_well: true }, note: "Feeling strong!", lifestyle_score: 1.0 },
  ],
};

const MOCK_SCANS: Record<PatientId, CvScan[]> = {
  maria: [
    { id: "s1", type: "pre_session", timestamp: "2026-04-10T10:00:00Z", rom: { shoulder_l: 130, shoulder_r: 108, hip_l: 112, hip_r: 110, knee_l: 135, knee_r: 133 }, symmetry_score: 17, compensation_index: 62, baseline_tier: 2, confidence: 0.82 },
    { id: "s2", type: "post_session", timestamp: "2026-04-10T11:30:00Z", rom: { shoulder_l: 148, shoulder_r: 126, hip_l: 115, hip_r: 113, knee_l: 138, knee_r: 136 }, symmetry_score: 15, compensation_index: 38, baseline_tier: 2, confidence: 0.85 },
  ],
  james: [
    { id: "s1", type: "pre_session", timestamp: "2026-04-11T10:00:00Z", rom: { shoulder_l: 155, shoulder_r: 158, hip_l: 90, hip_r: 88, knee_l: 140, knee_r: 138 }, symmetry_score: 22, compensation_index: 71, baseline_tier: 1, confidence: 0.79 },
    { id: "s2", type: "post_session", timestamp: "2026-04-11T11:30:00Z", rom: { shoulder_l: 158, shoulder_r: 160, hip_l: 105, hip_r: 102, knee_l: 142, knee_r: 140 }, symmetry_score: 18, compensation_index: 58, baseline_tier: 1, confidence: 0.81 },
  ],
  sarah: [
    { id: "s1", type: "pre_session", timestamp: "2026-04-12T10:00:00Z", rom: { shoulder_l: 162, shoulder_r: 160, hip_l: 118, hip_r: 115, knee_l: 120, knee_r: 138 }, symmetry_score: 14, compensation_index: 42, baseline_tier: 2, confidence: 0.88 },
    { id: "s2", type: "post_session", timestamp: "2026-04-12T11:30:00Z", rom: { shoulder_l: 164, shoulder_r: 162, hip_l: 122, hip_r: 120, knee_l: 132, knee_r: 140 }, symmetry_score: 6, compensation_index: 28, baseline_tier: 2, confidence: 0.91 },
  ],
};

const MOCK_GAM: Record<PatientId, Gamification> = {
  maria: { points: 420, gems: 420, streak: 5, lastCheckin: "2026-04-17T09:00:00Z", badges: ["first_checkin", "movement_pioneer"], avatar: { animal: "fox", accessory: null, name: "Swift Fox" } },
  james: { points: 280, gems: 280, streak: 3, lastCheckin: "2026-04-18T09:00:00Z", badges: ["first_checkin"], avatar: { animal: "fox", accessory: null, name: "Iron Bear" } },
  sarah: { points: 560, gems: 560, streak: 7, lastCheckin: "2026-04-18T09:00:00Z", badges: ["first_checkin", "movement_pioneer", "week_warrior", "symmetry_star"], avatar: { animal: "fox", accessory: null, name: "Swift Eagle" } },
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
