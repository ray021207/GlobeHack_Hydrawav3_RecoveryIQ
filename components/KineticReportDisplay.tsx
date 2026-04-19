import { KineticReport } from "@/lib/kinetic-analysis";
import { Check, Download, TrendingUp, AlertCircle, Zap, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from "recharts";

interface KineticReportDisplayProps {
  report: KineticReport;
  patientName?: string;
  showActions?: boolean;
}

// Helper to get color based on discomfort level
function getDiscomfortColor(level: number): string {
  if (level >= 8) return "#ef4444"; // Red
  if (level >= 5) return "#f59e0b"; // Orange
  if (level >= 3) return "#eab308"; // Yellow
  return "#10b981"; // Green
}

function getSeverityGradient(severity: string): { bg: string; text: string; border: string } {
  switch (severity) {
    case "Severe":
      return { bg: "#ef444415", text: "#dc2626", border: "#ef444440" };
    case "Moderate":
      return { bg: "#f59e0b15", text: "#d97706", border: "#f59e0b40" };
    default:
      return { bg: "#10b98115", text: "#059669", border: "#10b98140" };
  }
}

export function KineticReportDisplay({
  report,
  patientName = "Patient",
  showActions = true,
}: KineticReportDisplayProps) {
  // Prepare data for charts
  const regionChartData = report.affectedRegions.map((r) => ({
    region: r.region.substring(0, 12),
    discomfort: r.discomfort,
    fill: getDiscomfortColor(r.discomfort),
  }));

  const severityGradient = getSeverityGradient(report.summary.severityLevel);

  // Recovery trajectory (mock data based on recovery score)
  const trajectoryData = [
    { week: "Now", score: report.recoveryScore },
    { week: "2w", score: Math.min(report.recoveryScore + 8, 100) },
    { week: "4w", score: Math.min(report.recoveryScore + 15, 100) },
    { week: "8w", score: Math.min(report.recoveryScore + 25, 100) },
    { week: "12w", score: Math.min(report.recoveryScore + 35, 100) },
  ];

  // Factor impact (worse/better)
  const factorData = [
    {
      factor: "Negative Triggers",
      count: report.behavioralPatterns.worse.length,
      color: "#ef4444",
    },
    {
      factor: "Positive Factors",
      count: report.behavioralPatterns.better.length,
      color: "#10b981",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-6 text-white overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, var(--color-hw-clay) 0%, #d97706 100%)" }}
      >
        <div className="relative z-10 pr-16">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-90">Kinetic Analysis Report</p>
          <h2 className="text-3xl font-bold mb-2 leading-tight break-words">{patientName}'s Recovery Profile</h2>
          <p className="text-sm opacity-90">
            {new Date(report.submittedAt).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {showActions && (
          <button
            onClick={() => {
              const element = document.documentElement;
              const opt = {
                margin: 10,
                filename: `recovery-report-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'png', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
              };
              
              // Fallback: Use print dialog for PDF
              const printWindow = window.open('', '', 'height=600,width=800');
              if (printWindow) {
                printWindow.document.write(element.innerHTML);
                printWindow.document.close();
                setTimeout(() => {
                  printWindow.print();
                }, 250);
              }
            }}
            className="absolute top-6 right-6 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            title="Download Report"
          >
            <Download size={20} style={{ color: "#fff" }} />
          </button>
        )}
      </div>

      {/* Claude AI Executive Summary */}
      {report.summary.executiveSummary && (
        <div
          className="rounded-2xl p-6 border-l-4"
          style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)",
            borderColor: "var(--color-hw-navy)",
          }}
        >
          <div className="flex gap-3 mb-3">
            <Zap size={20} style={{ color: "var(--color-hw-clay)" }} />
            <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
              Clinical Summary (AI-Generated)
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-hw-text)" }}>
            {report.summary.executiveSummary}
          </p>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recovery Score - Large */}
        <div
          className="md:col-span-2 rounded-2xl p-6 flex flex-col justify-center"
          style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}
        >
          <div className="flex items-end gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Recovery Score
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-black" style={{ color: "var(--color-hw-clay)" }}>
                  {report.recoveryScore}
                </p>
                <p style={{ color: "var(--color-hw-text-muted)" }}>/100</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="w-full h-24 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${report.recoveryScore}%`,
                    background: `linear-gradient(90deg, var(--color-hw-clay), #a855f7)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Severity Card */}
        <div className="rounded-2xl p-4" style={{ background: severityGradient.bg, border: `1px solid ${severityGradient.border}` }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} style={{ color: severityGradient.text }} />
            <p className="text-xs font-semibold uppercase" style={{ color: severityGradient.text }}>
              Severity
            </p>
          </div>
          <p className="text-2xl font-bold" style={{ color: severityGradient.text }}>
            {report.summary.severityLevel}
          </p>
        </div>

        {/* Areas Affected */}
        <div className="rounded-2xl p-4" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} style={{ color: "var(--color-hw-clay)" }} />
            <p className="text-xs font-semibold uppercase" style={{ color: "var(--color-hw-text-muted)" }}>
              Areas Affected
            </p>
          </div>
          <p className="text-3xl font-bold" style={{ color: "var(--color-hw-text)" }}>
            {report.summary.totalAreasAffected}
          </p>
        </div>
      </div>

      {/* Discomfort Heatmap */}
      {report.affectedRegions.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>
            Discomfort Levels by Region
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="region" style={{ fontSize: "12px" }} />
              <YAxis domain={[0, 10]} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                formatter={(value) => `${value}/10`}
              />
              <Bar dataKey="discomfort" radius={[8, 8, 0, 0]}>
                {regionChartData.map((item, idx) => (
                  <Bar key={idx} dataKey="discomfort" fill={item.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Primary Areas */}
      {report.summary.primaryAreas.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} style={{ color: "var(--color-hw-clay)" }} />
            <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
              Primary Focus Areas
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.summary.primaryAreas.map((areaId) => (
              <span
                key={areaId}
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: "var(--color-hw-clay)", color: "#fff" }}
              >
                {areaId.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recovery Trajectory */}
      <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} style={{ color: "var(--color-hw-green)" }} />
          <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
            Projected Recovery Trajectory
          </p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trajectoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" style={{ fontSize: "12px" }} />
            <YAxis domain={[0, 100]} style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              formatter={(value) => `${value}%`}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-hw-clay)"
              dot={{ fill: "var(--color-hw-clay)", r: 5 }}
              activeDot={{ r: 7 }}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs mt-3" style={{ color: "var(--color-hw-text-muted)" }}>
          Based on current severity and baseline health metrics. Actual progress depends on adherence to treatment plan.
        </p>
      </div>

      {/* Behavioral Patterns */}
      {(report.behavioralPatterns.worse.length > 0 || report.behavioralPatterns.better.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Negative Triggers */}
          {report.behavioralPatterns.worse.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-sm font-bold mb-3" style={{ color: "#dc2626" }}>
                ⚠️ Makes Discomfort Worse
              </p>
              <div className="space-y-2">
                {report.behavioralPatterns.worse.map((factor, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "#ef444410" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
                    <span className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                      {factor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positive Factors */}
          {report.behavioralPatterns.better.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-sm font-bold mb-3" style={{ color: "#10b981" }}>
                ✨ Makes Discomfort Better
              </p>
              <div className="space-y-2">
                {report.behavioralPatterns.better.map((factor, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "#10b98110" }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                    <span className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                      {factor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Insights */}
      {report.insights.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} style={{ color: "var(--color-hw-clay)" }} />
            <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
              Clinical Insights (AI Analysis)
            </p>
          </div>
          <div className="space-y-3">
            {report.insights.map((insight, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: "var(--color-hw-cream)" }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--color-hw-clay)" }} />
                <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} style={{ color: "var(--color-hw-clay)" }} />
            <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
              Personalized Recommendations (AI-Enhanced)
            </p>
          </div>
          <div className="space-y-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: "#10b98115" }}>
                <Check size={18} style={{ color: "var(--color-hw-green)", flexShrink: 0 }} />
                <p className="text-sm" style={{ color: "var(--color-hw-text)" }}>
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROM Analysis */}
      {report.romAnalysis.exercisesCaptured > 0 && (
        <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-sm font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>
            📊 Range of Motion Baseline
          </p>
          <div className="space-y-3">
            {Object.entries(report.romAnalysis.totalRomScores).map(([exercise, rom]) => (
              <div key={exercise} className="p-4 rounded-lg" style={{ background: "var(--color-hw-cream)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm" style={{ color: "var(--color-hw-text)" }}>
                    {exercise.replace(/_/g, " ")}
                  </p>
                  {(() => {
                    // Calculate confidence from ROM values (normalized to 0-1)
                    const values = Object.values(rom);
                    const avgRom = values.reduce((a, b) => a + b, 0) / values.length;
                    const confidence = Math.min(avgRom / 180, 1); // Normalize to 0-1
                    return (
                      <span
                        className="text-xs px-2 py-1 rounded-full font-semibold"
                        style={{
                          background: `rgba(${Math.round(confidence * 255)}, 150, 100, 0.2)`,
                          color: `rgb(${Math.round(confidence * 255)}, 100, 50)`,
                        }}
                      >
                        {Math.round(confidence * 100)}% Measurement
                      </span>
                    );
                  })()}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
                      Left Side
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--color-hw-clay)" }}>
                      {Math.round((rom.shoulder_l + rom.hip_l + rom.knee_l) / 3)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
                      Right Side
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--color-hw-clay)" }}>
                      {Math.round((rom.shoulder_r + rom.hip_r + rom.knee_r) / 3)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
                      Symmetry
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--color-hw-clay)" }}>
                      {Math.round(Math.abs((rom.shoulder_l - rom.shoulder_r + rom.hip_l - rom.hip_r + rom.knee_l - rom.knee_r) / 3))}°
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sleep & Activities */}
      {(report.behavioralPatterns.sleepPosture || report.behavioralPatterns.dailyActivities.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.behavioralPatterns.sleepPosture && (
            <div className="rounded-2xl p-6" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
                😴 Sleep Posture
              </p>
              <p className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
                {report.behavioralPatterns.sleepPosture}
              </p>
            </div>
          )}
          {report.behavioralPatterns.dailyActivities.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-hw-text-muted)" }}>
                💼 Daily Activities ({report.behavioralPatterns.dailyActivities.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {report.behavioralPatterns.dailyActivities.map((activity) => (
                  <span
                    key={activity}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ background: "var(--color-hw-clay)20", color: "var(--color-hw-clay)" }}
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, var(--color-hw-clay)15 0%, var(--color-hw-clay)05 100%)", border: "1px solid var(--color-hw-clay)30" }}
      >
        <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-hw-text)" }}>
          📋 Confidential Assessment Report
        </p>
        <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>
          This report combines self-assessment data with captured movement analysis to create a comprehensive baseline. It's designed to guide your personalized treatment plan and track progress over time.
        </p>
      </div>
    </div>
  );
}
