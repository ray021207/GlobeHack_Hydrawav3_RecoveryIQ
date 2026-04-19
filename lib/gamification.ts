"use client";

import { getGamification, saveGamification, getCheckins, type Gamification } from "./mock-data";

export const BADGES: Record<string, { label: string; icon: string }> = {
  first_checkin:    { label: "First Check-in",   icon: "✅" },
  week_warrior:     { label: "Week Warrior",      icon: "🔥" },
  pain_drop_25:     { label: "Pain Drop 25%",     icon: "📉" },
  movement_pioneer: { label: "Movement Pioneer",  icon: "📹" },
  symmetry_star:    { label: "Symmetry Star",     icon: "⭐" },
  lifestyle_pro:    { label: "Lifestyle Pro",     icon: "🌿" },
  hydra_fan:        { label: "Hydra Fan",         icon: "💧" },
  comeback_kid:     { label: "Comeback Kid",      icon: "💪" },
  zero_pain:        { label: "Zero Pain",         icon: "🎉" },
  consistency:      { label: "Consistency King",  icon: "👑" },
  peak_performer:   { label: "Peak Performer",    icon: "🏆" },
};

export function addPoints(patientId: string, pts: number): Gamification {
  const gam = getGamification(patientId);
  const multiplier = gam.streak >= 7 ? 1.5 : 1;
  const earned = Math.round(pts * multiplier);
  const updated: Gamification = { ...gam, points: gam.points + earned, gems: gam.gems + earned };
  saveGamification(patientId, updated);
  return updated;
}

export function updateStreak(patientId: string): Gamification {
  const gam = getGamification(patientId);
  const now = Date.now();
  const last = gam.lastCheckin ? new Date(gam.lastCheckin).getTime() : 0;
  const hoursSince = (now - last) / 3600000;

  let newStreak = gam.streak;
  if (hoursSince <= 36 && hoursSince > 0) newStreak += 1;
  else if (hoursSince > 36) newStreak = 1;

  const streakBonus = newStreak > 1 ? newStreak * 10 : 0;
  const updated: Gamification = {
    ...gam,
    streak: newStreak,
    lastCheckin: new Date().toISOString(),
    points: gam.points + streakBonus,
    gems: gam.gems + streakBonus,
  };
  saveGamification(patientId, updated);
  return updated;
}

export function checkAndAwardBadges(patientId: string): string[] {
  if (typeof window === "undefined") return [];
  const gam = getGamification(patientId);
  const checkins = getCheckins(patientId);
  const scans: { symmetry_score: number }[] = JSON.parse(localStorage.getItem(`cv_scans_${patientId}`) ?? "[]");
  const newBadges: string[] = [];

  const checks: Record<string, boolean> = {
    first_checkin:    checkins.length >= 1,
    week_warrior:     gam.streak >= 7,
    pain_drop_25:     checkins.length > 1 && checkins[checkins.length - 1].pain <= checkins[0].pain * 0.75,
    movement_pioneer: scans.length >= 1,
    symmetry_star:    scans.some((s) => s.symmetry_score < 10),
    zero_pain:        checkins.some((c) => c.pain === 0),
    consistency:      gam.streak >= 14,
    comeback_kid:     gam.streak >= 1 && !!gam.lastCheckin,
    lifestyle_pro:    localStorage.getItem(`lifestyle_sections_${patientId}`) === "6",
  };

  for (const [id, met] of Object.entries(checks)) {
    if (met && !gam.badges.includes(id)) newBadges.push(id);
  }

  if (newBadges.length > 0) {
    saveGamification(patientId, { ...gam, badges: [...gam.badges, ...newBadges] });
  }
  return newBadges;
}
