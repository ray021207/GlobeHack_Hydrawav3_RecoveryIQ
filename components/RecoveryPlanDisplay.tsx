"use client";

import { CheckCircle2, Leaf, Zap, AlertCircle, ChevronDown, ChevronUp, Check, Download } from "lucide-react";
import { useState } from "react";

interface Exercise {
  name: string;
  duration: string;
  frequency: string;
  modifications: string;
  precautions: string;
}

interface DietEntry {
  meal: string;
  recommendations: string[];
  ayurvedicPrinciples: string[];
}

interface Lifestyle {
  activity: string;
  duration: string;
  benefits: string;
}

interface RecoveryWeek {
  week: number;
  focus: string;
  exercises: Exercise[];
  diet: DietEntry[];
  lifestyle: Lifestyle[];
}

interface AyurvedicAssessment {
  dosha: string;
  imbalance: string;
  recommendations: string[];
}

interface RecoveryPlan {
  overviewSummary: string;
  ayurvedicAssessment: AyurvedicAssessment;
  weeks: RecoveryWeek[];
  supplementaryTips: {
    mobility: string[];
    nutrition: string[];
    lifestyle: string[];
  };
}

export function RecoveryPlanDisplay({ plan, patientId, onCompletion }: { plan: RecoveryPlan; patientId?: string; onCompletion?: (week: number, day: number, data: any) => void }) {
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [weeklyProgress, setWeeklyProgress] = useState<Record<string, { exercises: string[]; diet: boolean; lifestyle: number }>>({});

  function toggleExercise(weekDay: string, exerciseName: string) {
    const key = weekDay;
    const current = weeklyProgress[key] || { exercises: [], diet: false, lifestyle: 0 };
    const exercises = current.exercises.includes(exerciseName) ? current.exercises.filter((e) => e !== exerciseName) : [...current.exercises, exerciseName];
    setWeeklyProgress({ ...weeklyProgress, [key]: { ...current, exercises } });
  }

  function toggleDiet(weekDay: string) {
    const key = weekDay;
    const current = weeklyProgress[key] || { exercises: [], diet: false, lifestyle: 0 };
    setWeeklyProgress({ ...weeklyProgress, [key]: { ...current, diet: !current.diet } });
  }

  function updateLifestyle(weekDay: string, value: number) {
    const key = weekDay;
    const current = weeklyProgress[key] || { exercises: [], diet: false, lifestyle: 0 };
    setWeeklyProgress({ ...weeklyProgress, [key]: { ...current, lifestyle: value } });
  }

  function downloadPDF() {
    const planText = `RECOVERY PLAN
\n${plan.overviewSummary}\n\nAYURVEDIC ASSESSMENT\nDosha: ${plan.ayurvedicAssessment.dosha}\n\n${plan.weeks.map(w => `WEEK ${w.week}: ${w.focus}\nExercises: ${w.exercises.map(e => e.name).join(", ")}\n`).join("\n")}\n\nSUPPLEMENTARY TIPS:\n${plan.supplementaryTips.lifestyle.join("\n")}`;
    const blob = new Blob([planText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recovery-plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: "linear-gradient(135deg, var(--color-hw-clay)20 0%, #10b98120 100%)", border: "1px solid var(--color-hw-clay)40" }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            <Leaf size={24} style={{ color: "var(--color-hw-clay)" }} />
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--color-hw-navy)" }}>AI-Powered Recovery Plan</h2>
              <p className="text-sm" style={{ color: "var(--color-hw-muted)" }}>4-week personalized program combining physical therapy & Ayurveda</p>
            </div>
          </div>
          <button onClick={downloadPDF} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--color-hw-clay)", color: "#fff" }}>
            <Download size={14} /> Download
          </button>
        </div>
        <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>{plan.overviewSummary}</p>
      </div>

      {/* Ayurvedic Assessment */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={18} style={{ color: "var(--color-hw-clay)" }} />
          <h3 className="font-bold" style={{ color: "var(--color-hw-navy)" }}>Ayurvedic Assessment</h3>
        </div>
        <div>
          <p className="text-xs uppercase font-semibold mb-1" style={{ color: "var(--color-hw-muted)" }}>Primary Dosha Imbalance</p>
          <p className="font-bold mb-2" style={{ color: "var(--color-hw-navy)" }}>{plan.ayurvedicAssessment.dosha}</p>
          <p className="text-sm mb-3" style={{ color: "var(--color-hw-text)" }}>{plan.ayurvedicAssessment.imbalance}</p>
          <div className="space-y-1">
            {plan.ayurvedicAssessment.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={14} style={{ color: "var(--color-hw-green)", marginTop: "2px", flexShrink: 0 }} />
                <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Week Program */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg" style={{ color: "var(--color-hw-navy)" }}>4-Week Recovery Program</h3>
        {plan.weeks.map((week) => (
          <div key={week.week} className="rounded-2xl border overflow-hidden" style={{ background: "var(--color-hw-card)", borderColor: "var(--color-hw-border)" }}>
            {/* Week Header */}
            <button
              onClick={() => setExpandedWeek(expandedWeek === week.week ? 0 : week.week)}
              className="w-full px-5 py-4 flex items-center justify-between hover:opacity-75 transition-opacity"
              style={{ background: expandedWeek === week.week ? "var(--color-hw-cream)" : "transparent" }}
            >
              <div className="text-left">
                <p className="font-bold" style={{ color: "var(--color-hw-navy)" }}>Week {week.week}</p>
                <p className="text-sm" style={{ color: "var(--color-hw-muted)" }}>{week.focus}</p>
              </div>
              {expandedWeek === week.week ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Week Content */}
            {expandedWeek === week.week && (
              <div className="px-5 py-4 border-t space-y-6" style={{ borderColor: "var(--color-hw-border)" }}>
                {/* Daily Tracker */}
                <div className="rounded-xl p-4" style={{ background: "linear-gradient(135deg, var(--color-hw-clay)15 0%, #10b98115 100%)" }}>
                  <h4 className="font-bold mb-3" style={{ color: "var(--color-hw-navy)" }}>📊 Track Daily Progress</h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                      const dayKey = `week${week.week}_day${day}`;
                      const dayData = weeklyProgress[dayKey] || { exercises: [], diet: false, lifestyle: 0 };
                      const allExerciseNames = week.exercises.map((e) => e.name);

                      return (
                        <div key={day} className="bg-white rounded-lg p-3 border" style={{ borderColor: "var(--color-hw-border)" }}>
                          <p className="font-semibold text-sm mb-2" style={{ color: "var(--color-hw-navy)" }}>Day {day}</p>
                          
                          {/* Exercise Checkboxes */}
                          <div className="space-y-1.5 mb-2">
                            {allExerciseNames.map((exName) => (
                              <label key={exName} className="flex items-center gap-2 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={dayData.exercises.includes(exName)}
                                  onChange={() => toggleExercise(dayKey, exName)}
                                  className="w-4 h-4 rounded"
                                />
                                <span style={{ color: "var(--color-hw-text)" }}>{exName}</span>
                              </label>
                            ))}
                          </div>

                          {/* Diet Checkbox */}
                          <label className="flex items-center gap-2 text-xs cursor-pointer mb-2">
                            <input
                              type="checkbox"
                              checked={dayData.diet}
                              onChange={() => toggleDiet(dayKey)}
                              className="w-4 h-4 rounded"
                            />
                            <span style={{ color: "var(--color-hw-text)" }}>Followed diet plan</span>
                          </label>

                          {/* Lifestyle Score Slider */}
                          <div className="flex items-center gap-2 text-xs">
                            <span style={{ color: "var(--color-hw-muted)" }}>Lifestyle:</span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={dayData.lifestyle}
                              onChange={(e) => updateLifestyle(dayKey, parseInt(e.target.value))}
                              className="flex-1"
                            />
                            <span className="font-semibold" style={{ color: "var(--color-hw-clay)" }}>{dayData.lifestyle}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Exercises */}
                <div className="mb-5">
                  <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--color-hw-navy)" }}>
                    <Zap size={16} />
                    Week {week.week} Exercises
                  </h4>
                  <div className="space-y-3">
                    {week.exercises.map((ex, idx) => (
                      <div key={idx} className="rounded-xl p-3" style={{ background: "var(--color-hw-cream)" }}>
                        <p className="font-semibold" style={{ color: "var(--color-hw-navy)" }}>{idx + 1}. {ex.name}</p>
                        <div className="text-xs mt-2 space-y-1" style={{ color: "var(--color-hw-text)" }}>
                          <p><span className="font-semibold">Duration:</span> {ex.duration}</p>
                          <p><span className="font-semibold">Frequency:</span> {ex.frequency}</p>
                          <p><span className="font-semibold">Form:</span> {ex.modifications}</p>
                        </div>
                        {ex.precautions && (
                          <div className="mt-2 p-2 rounded bg-red-50 border border-red-100">
                            <p className="text-xs font-semibold text-red-700">⚠ {ex.precautions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div className="mb-5">
                  <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--color-hw-navy)" }}>
                    <Leaf size={16} />
                    Nutrition & Diet
                  </h4>
                  <div className="space-y-3">
                    {week.diet.map((meal, idx) => (
                      <div key={idx} className="rounded-xl p-3" style={{ background: "var(--color-hw-cream)" }}>
                        <p className="font-semibold mb-2" style={{ color: "var(--color-hw-navy)" }}>{meal.meal}</p>
                        <div className="space-y-2 text-xs" style={{ color: "var(--color-hw-text)" }}>
                          <div>
                            <p className="font-semibold">Recommendations:</p>
                            <ul className="list-disc list-inside">
                              {meal.recommendations.map((rec, i) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold">Ayurvedic Principles:</p>
                            <ul className="list-disc list-inside">
                              {meal.ayurvedicPrinciples.map((prin, i) => (
                                <li key={i}>{prin}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifestyle */}
                <div>
                  <h4 className="font-bold mb-3" style={{ color: "var(--color-hw-navy)" }}>Lifestyle Practices</h4>
                  <div className="space-y-2">
                    {week.lifestyle.map((life, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "var(--color-hw-cream)" }}>
                        <CheckCircle2 size={16} style={{ color: "var(--color-hw-green)", marginTop: "2px", flexShrink: 0 }} />
                        <div className="text-sm">
                          <p className="font-semibold" style={{ color: "var(--color-hw-navy)" }}>{life.activity}</p>
                          <p style={{ color: "var(--color-hw-muted)" }}>{life.duration} — {life.benefits}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Supplementary Tips */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--color-hw-card)", border: "1px solid var(--color-hw-border)" }}>
        <h3 className="font-bold text-lg" style={{ color: "var(--color-hw-navy)" }}>Additional Support Tips</h3>

        <div>
          <p className="font-semibold mb-2" style={{ color: "var(--color-hw-navy)" }}>🧘 Mobility & Flexibility</p>
          <ul className="space-y-1 text-sm">
            {plan.supplementaryTips.mobility.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: "var(--color-hw-green)" }}>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-2" style={{ color: "var(--color-hw-navy)" }}>🌿 Nutrition</p>
          <ul className="space-y-1 text-sm">
            {plan.supplementaryTips.nutrition.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: "var(--color-hw-green)" }}>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-2" style={{ color: "var(--color-hw-navy)" }}>🌙 Lifestyle</p>
          <ul className="space-y-1 text-sm">
            {plan.supplementaryTips.lifestyle.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: "var(--color-hw-green)" }}>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
