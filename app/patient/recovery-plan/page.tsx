'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Leaf, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecoveryPlanPage() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("riq_userId");
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadData = () => {
      try {
        const savedPlan = localStorage.getItem(`recovery_plan_${userId}`);
        const savedProgress = localStorage.getItem(`recovery_plan_progress_${userId}`);

        if (savedPlan) {
          setPlan(JSON.parse(savedPlan));
        }
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (e) {
        console.error('Error loading plan data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-hw-bg)' }}>
        <div className="text-center">
          <Leaf size={48} className="mx-auto mb-4 animate-pulse" style={{ color: 'var(--color-hw-green)' }} />
          <p style={{ color: 'var(--color-hw-text)' }}>Loading your recovery plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-hw-bg)' }}>
        <div className="max-w-md text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--color-hw-clay)' }} />
          <p className="text-xl font-bold mb-2" style={{ color: 'var(--color-hw-text)' }}>No Recovery Plan Yet</p>
          <p className="mb-6" style={{ color: 'var(--color-hw-text-muted)' }}>
            Generate a personalized recovery plan from your assessment to get started with your recovery journey.
          </p>
          <Link
            href="/patient/assessment"
            className="inline-block px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: 'var(--color-hw-clay)' }}
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-hw-bg)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 p-6 border-b" style={{ background: 'var(--color-hw-bg)', borderColor: 'var(--color-hw-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-hw-text)' }}>
            Your Recovery Plan
          </h1>
          <Link href="/patient">
            <button className="px-4 py-2 rounded-lg" style={{ background: 'var(--color-hw-cream)', color: 'var(--color-hw-text)' }}>
              ← Back
            </button>
          </Link>
        </div>

        {/* Avatar & Accessories */}
        <div className="flex items-center gap-4">
          <div className="text-5xl">👤</div>
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-hw-text-muted)' }}>
              Unlocked Accessories
            </p>
            <div className="flex gap-2 flex-wrap">
              {progress?.accessoriesUnlocked?.length === 0 ? (
                <span className="text-sm" style={{ color: 'var(--color-hw-text-muted)' }}>Keep tracking to unlock</span>
              ) : (
                progress?.accessoriesUnlocked?.map((acc: string, i: number) => (
                  <span key={i} className="text-2xl">
                    {acc === 'yoga_mat' && '🧘'}
                    {acc === 'meditation_cushion' && '🏵️'}
                    {acc === 'resistance_band' && '💪'}
                    {acc === 'master_recovery' && '🎖️'}
                    {acc === 'champion_crown' && '👑'}
                    {acc === 'week1_perfect' && '⭐'}
                    {acc === 'week2_perfect' && '⭐'}
                    {acc === 'week3_perfect' && '⭐'}
                    {acc === 'week4_perfect' && '⭐'}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--color-hw-border)' }}>
            <p className="text-xs font-semibold mb-2 uppercase" style={{ color: 'var(--color-hw-text-muted)' }}>
              Adherence
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-hw-clay)' }}>
              {Math.round((progress?.totalPointsEarned || 0) / 10)}%
            </p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--color-hw-border)' }}>
            <p className="text-xs font-semibold mb-2 uppercase" style={{ color: 'var(--color-hw-text-muted)' }}>
              🔥 Streak
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-hw-green)' }}>
              {progress?.streakDays || 0}
            </p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--color-hw-border)' }}>
            <p className="text-xs font-semibold mb-2 uppercase" style={{ color: 'var(--color-hw-text-muted)' }}>
              Points Earned
            </p>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-hw-text)' }}>
              {progress?.totalPointsEarned || 0}
            </p>
          </div>
        </div>

        {/* Plan Overview */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid var(--color-hw-border)' }}>
          <p className="text-lg font-bold mb-4" style={{ color: 'var(--color-hw-text)' }}>
            📋 Plan Overview
          </p>
          <p style={{ color: 'var(--color-hw-text)' }}>
            {plan.overviewSummary}
          </p>
        </div>

        {/* Ayurvedic Assessment */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--color-hw-cream)', border: '1px solid var(--color-hw-border)' }}>
          <p className="text-lg font-bold mb-4" style={{ color: 'var(--color-hw-text)' }}>
            🌿 Ayurvedic Assessment
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-hw-text-muted)' }}>
                Your Dosha
              </p>
              <p className="text-lg font-bold" style={{ color: 'var(--color-hw-clay)' }}>
                {plan.ayurvedicAssessment?.dosha || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-hw-text-muted)' }}>
                Imbalance Assessment
              </p>
              <p style={{ color: 'var(--color-hw-text)' }}>
                {plan.ayurvedicAssessment?.imbalance || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-hw-text-muted)' }}>
                Recommendations
              </p>
              <ul className="space-y-1">
                {plan.ayurvedicAssessment?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--color-hw-text)' }}>
                    <span>✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid var(--color-hw-border)' }}>
          <p className="text-lg font-bold mb-4" style={{ color: 'var(--color-hw-text)' }}>
            📊 Weekly Progress
          </p>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((week) => {
              const weekData = plan.weeks?.[week - 1];
              const completions = progress?.completions?.filter((c: any) => c.week === week) || [];
              const weekProgress = Math.round((completions.length / 7) * 100);

              return (
                <div key={week}>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold" style={{ color: 'var(--color-hw-text)' }}>
                      Week {week}: {weekData?.focus || 'Recovery'}
                    </p>
                    <p style={{ color: 'var(--color-hw-text-muted)' }}>
                      {weekProgress}%
                    </p>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'var(--color-hw-border)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ background: 'var(--color-hw-clay)', width: `${weekProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pb-6">
          <button
            onClick={() => {
              localStorage.removeItem(`recovery_plan_${userId}`);
              localStorage.removeItem(`recovery_plan_progress_${userId}`);
              window.location.reload();
            }}
            className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: '#ef4444' }}
          >
            Reset Plan
          </button>
          <Link href="/patient/checkin" className="flex-1">
            <button
              className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: 'var(--color-hw-green)' }}
            >
              Log Check-in <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
