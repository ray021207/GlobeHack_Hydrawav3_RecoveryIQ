"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronRight, Calendar, Zap, Heart, Activity } from "lucide-react";
import { generateExercisePlan, getExercisesByWeek, type Exercise, type ExercisePlan } from "@/lib/exercise-suggestions";
import { generateAyurvedicPlan, formatDoshaName, type AyurvedicPlan } from "@/lib/lifestyle-recommendations";
import type { AssessmentData } from "@/lib/kinetic-analysis";

export default function PatientRecoveryPlanPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [exercisePlan, setExercisePlan] = useState<ExercisePlan | null>(null);
  const [ayurvedicPlan, setAyurvedicPlan] = useState<AyurvedicPlan | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeTab, setActiveTab] = useState<"exercises" | "lifestyle" | "progress">("exercises");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = localStorage.getItem("riq_userId") as string;
    setUserId(id);

    if (id) {
      const assessmentData = localStorage.getItem(`assessment_${id}`);
      if (assessmentData) {
        const data = JSON.parse(assessmentData) as AssessmentData;
        setAssessment(data);

        const plan = generateExercisePlan(data);
        setExercisePlan(plan);

        const lifestyle = generateAyurvedicPlan(id, plan.severity, plan.affectedAreas);
        setAyurvedicPlan(lifestyle);
      } else {
        router.push("/patient/assessment");
      }
    }
  }, [router]);

  if (!assessment || !exercisePlan || !ayurvedicPlan) {
    return <div className="p-8 text-center">Loading recovery plan...</div>;
  }

  const weekExercises = getExercisesByWeek(exercisePlan, currentWeek as 1 | 2 | 3 | 4);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <Link href="/patient" className="text-sm" style={{ color: "var(--color-hw-clay)" }}>
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold font-display mt-2" style={{ color: "var(--color-hw-text)" }}>
          Your 4-Week Recovery Plan
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
          Personalized exercises and lifestyle guidance for {exercisePlan.severity} recovery
        </p>
      </div>

      {/* Plan Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={18} style={{ color: "var(--color-hw-clay)" }} />
            <p className="text-xs font-semibold uppercase" style={{ color: "var(--color-hw-text-muted)" }}>
              This Week
            </p>
          </div>
          <p className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
            {weekExercises.length} Exercises
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
            {exercisePlan.duration.replace("-", " ")} program
          </p>
        </div>

        <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Heart size={18} style={{ color: "#e74c3c" }} />
            <p className="text-xs font-semibold uppercase" style={{ color: "var(--color-hw-text-muted)" }}>
              Your Dosha
            </p>
          </div>
          <p className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
            {formatDoshaName(ayurvedicPlan.dosha)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
            {ayurvedicPlan.season} season
          </p>
        </div>

        <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} style={{ color: "#f39c12" }} />
            <p className="text-xs font-semibold uppercase" style={{ color: "var(--color-hw-text-muted)" }}>
              Severity
            </p>
          </div>
          <p className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
            {exercisePlan.severity.charAt(0).toUpperCase() + exercisePlan.severity.slice(1)}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
            {exercisePlan.affectedAreas.length} areas affected
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b" style={{ borderColor: "var(--color-hw-border)" }}>
        {(["exercises", "lifestyle", "progress"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-3 text-sm font-semibold border-b-2 transition-colors"
            style={
              activeTab === tab
                ? { borderColor: "var(--color-hw-clay)", color: "var(--color-hw-clay)" }
                : { borderColor: "transparent", color: "var(--color-hw-text-muted)" }
            }
          >
            {tab === "exercises" ? "💪 Exercises" : tab === "lifestyle" ? "🧘 Lifestyle" : "📊 Progress"}
          </button>
        ))}
      </div>

      {/* EXERCISES TAB */}
      {activeTab === "exercises" && (
        <div className="space-y-6">
          {/* Week Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((week) => (
              <button
                key={week}
                onClick={() => setCurrentWeek(week)}
                className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors"
                style={
                  currentWeek === week
                    ? { background: "var(--color-hw-clay)", color: "#fff" }
                    : { background: "var(--color-hw-cream)", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }
                }
              >
                Week {week}
              </button>
            ))}
          </div>

          {/* Progression Note */}
          <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
              💡 Progression Guide
            </p>
            <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>
              {exercisePlan.progressionNotes}
            </p>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            {weekExercises.length === 0 ? (
              <p style={{ color: "var(--color-hw-text-muted)" }}>No exercises scheduled for this week.</p>
            ) : (
              weekExercises.map((exercise) => (
                <div key={exercise.id} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                        {exercise.name}
                      </p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-clay)" }}>
                          {exercise.area}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)" }}>
                          {exercise.frequency}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-text-muted)" }}>
                          Level {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Mark as complete!")}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1"
                      style={{ background: "var(--color-hw-clay)", color: "#fff" }}
                    >
                      <Check size={14} /> Done
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold mb-1" style={{ color: "var(--color-hw-text)" }}>
                        {exercise.reps}
                      </p>
                      {exercise.duration && (
                        <p style={{ color: "var(--color-hw-text-muted)" }}>{exercise.duration}</p>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold mb-2" style={{ color: "var(--color-hw-text)" }}>
                        Instructions:
                      </p>
                      <ol className="space-y-1 pl-5 list-decimal" style={{ color: "var(--color-hw-text)" }}>
                        {exercise.instructions.map((inst, i) => (
                          <li key={i} className="text-sm">
                            {inst}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {exercise.modifications.length > 0 && (
                      <div>
                        <p className="font-semibold text-xs mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                          ⚙️ Modifications:
                        </p>
                        <ul className="space-y-1 pl-5 list-disc" style={{ color: "var(--color-hw-text-muted)" }}>
                          {exercise.modifications.map((mod, i) => (
                            <li key={i} className="text-xs">
                              {mod}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exercise.cautions.length > 0 && (
                      <div>
                        <p className="font-semibold text-xs mb-1" style={{ color: "#e74c3c" }}>
                          ⚠️ Cautions:
                        </p>
                        <ul className="space-y-1 pl-5 list-disc" style={{ color: "#e74c3c" }}>
                          {exercise.cautions.map((caution, i) => (
                            <li key={i} className="text-xs">
                              {caution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* LIFESTYLE TAB */}
      {activeTab === "lifestyle" && (
        <div className="space-y-6">
          {/* Sleep Protocol */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
              😴 Sleep Protocol for {formatDoshaName(ayurvedicPlan.dosha)}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--color-hw-text-muted)" }}>
                  Bedtime
                </p>
                <p className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {ayurvedicPlan.sleepProtocol.bedtime}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--color-hw-text-muted)" }}>
                  Wake Time
                </p>
                <p className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {ayurvedicPlan.sleepProtocol.wakeTime}
                </p>
              </div>
              <div className="col-span-2 rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                  Sleep Posture
                </p>
                <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                  {ayurvedicPlan.sleepProtocol.sleepPosture}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
                Pre-Sleep Routine:
              </p>
              <ul className="space-y-1 pl-5 list-disc">
                {ayurvedicPlan.sleepProtocol.preSleeproutine.map((item, i) => (
                  <li key={i} className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Daily Activities */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
              💼 Recommended Daily Activities
            </p>
            <div className="flex flex-wrap gap-2">
              {ayurvedicPlan.dailyActivities.map((activity) => (
                <span
                  key={activity}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-clay)" }}
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>

          {/* Diet Guidelines */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
              🍽️ Dietary Guidelines
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
                  ✅ Favor These:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ayurvedicPlan.favoredFoods.map((food) => (
                    <span key={food} className="px-2 py-1 text-xs rounded" style={{ background: "#10b98120", color: "#059669" }}>
                      {food}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
                  ❌ Avoid These:
                </p>
                <div className="flex flex-wrap gap-2">
                  {ayurvedicPlan.avoidFoods.map((food) => (
                    <span key={food} className="px-2 py-1 text-xs rounded" style={{ background: "#ef444420", color: "#dc2626" }}>
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stress Management */}
          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-sm font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
              🧘 Stress Management Practices
            </p>
            <ul className="space-y-2">
              {ayurvedicPlan.stressManagement.map((practice, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-hw-text)" }}>
                  <Check size={16} style={{ color: "var(--color-hw-clay)", flexShrink: 0 }} />
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PROGRESS TAB */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <Link
            href="/patient/posture-check"
            className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: "var(--color-hw-clay)20", border: "1px solid var(--color-hw-clay)40" }}
          >
            <div>
              <p className="font-bold" style={{ color: "var(--color-hw-clay)" }}>
                📹 CV-Based Posture Check
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Record your posture every other day to track alignment improvements
              </p>
            </div>
            <ChevronRight style={{ color: "var(--color-hw-clay)" }} />
          </Link>

          <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>
              📊 Weekly Check-in
            </p>
            <button
              className="w-full py-2.5 rounded-lg font-semibold text-white"
              style={{ background: "var(--color-hw-clay)" }}
            >
              Log Weekly Progress
            </button>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
            <p className="text-sm font-bold mb-2" style={{ color: "var(--color-hw-text)" }}>
              🎯 4-Week Goals
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--color-hw-text)" }}>
              <li className="flex gap-2">
                <Check size={16} style={{ color: "var(--color-hw-green)" }} />
                Reduce pain by 30-50%
              </li>
              <li className="flex gap-2">
                <Check size={16} style={{ color: "var(--color-hw-green)" }} />
                Improve ROM by 20-30%
              </li>
              <li className="flex gap-2">
                <Check size={16} style={{ color: "var(--color-hw-green)" }} />
                Complete 80%+ exercises
              </li>
              <li className="flex gap-2">
                <Check size={16} style={{ color: "var(--color-hw-green)" }} />
                Return to daily activities
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
