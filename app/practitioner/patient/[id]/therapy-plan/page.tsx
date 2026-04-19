"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check, AlertCircle, Calendar, Clock } from "lucide-react";
import { generatePractitionerPlan, type PractitionerPlan } from "@/lib/therapy-protocols";
import type { AssessmentData } from "@/lib/kinetic-analysis";
import { PATIENTS, type PatientId } from "@/lib/mock-data";

export default function PractitionerTherapyPlanPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const patientId = id as PatientId;
  const [plan, setPlan] = useState<PractitionerPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
  }, [router]);

  useEffect(() => {
    const assessmentData = localStorage.getItem(`assessment_${patientId}`);
    if (assessmentData) {
      const data = JSON.parse(assessmentData) as AssessmentData;
      const therapyPlan = generatePractitionerPlan(data);
      setPlan(therapyPlan);
    }
    setLoading(false);
  }, [patientId]);

  if (!PATIENTS[patientId]) return <div className="p-8">Patient not found</div>;
  if (loading) return <div className="p-8">Loading treatment plan...</div>;
  if (!plan) return <div className="p-8">No assessment data available</div>;

  const patient = PATIENTS[patientId];
  const severityColor =
    plan.severity === "severe" ? "#ef4444" : plan.severity === "moderate" ? "#f59e0b" : "#10b981";

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <Link
          href={`/practitioner/patient/${patientId}`}
          className="flex items-center gap-2 text-sm mb-4"
          style={{ color: "var(--color-hw-clay)" }}
        >
          <ChevronLeft size={16} />
          Back to Patient
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-hw-clay)" }}>
            Treatment Plan
          </p>
          <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>
            {patient.name} — Therapy Protocol
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
            Personalized treatment recommendations based on assessment
          </p>
        </div>
      </div>

      {/* Severity Summary */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>
              Severity Assessment
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{
                color: severityColor,
              }}
            >
              {plan.severity.charAt(0).toUpperCase() + plan.severity.slice(1)}
            </p>
          </div>
          <AlertCircle size={24} style={{ color: severityColor }} />
        </div>
        <div className="space-y-1">
          {plan.primaryProblems.map((problem, i) => (
            <p key={i} className="text-sm" style={{ color: "var(--color-hw-text-muted)" }}>
              • {problem}
            </p>
          ))}
        </div>
      </div>

      {/* Recommended Protocols */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--color-hw-text)" }}>
          🎯 Recommended Protocols
        </h2>
        {plan.recommendedProtocols.map((protocol) => (
          <div key={protocol.id} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {protocol.name}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
                  {protocol.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                  Frequency
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {protocol.frequency}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                  Duration
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {protocol.duration}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                  Session Time
                </p>
                <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {protocol.sessionDuration} min
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                  Target Areas
                </p>
                <p className="text-xs font-bold" style={{ color: "var(--color-hw-text)" }}>
                  {protocol.targetAreas.length} areas
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--color-hw-text)" }}>
                  Techniques:
                </p>
                <ul className="space-y-1 pl-5 list-disc" style={{ color: "var(--color-hw-text-muted)" }}>
                  {protocol.techniques.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--color-hw-text)" }}>
                  Expected Outcomes:
                </p>
                <ul className="space-y-1 pl-5 list-disc" style={{ color: "#10b981" }}>
                  {protocol.expectedOutcomes.map((outcome, i) => (
                    <li key={i}>{outcome}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-1" style={{ color: "var(--color-hw-text)" }}>
                  Progression Criteria:
                </p>
                <ul className="space-y-1 pl-5 list-disc" style={{ color: "var(--color-hw-text-muted)" }}>
                  {protocol.progressionCriteria.map((crit, i) => (
                    <li key={i}>{crit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hydrawav Settings */}
      {plan.hydrawavSettings && (
        <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-lg font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>
            ⚡ Hydrawav Device Settings
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Protocol
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                {plan.hydrawavSettings.protocol}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Frequency
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                {plan.hydrawavSettings.frequency}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Intensity
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                {plan.hydrawavSettings.intensity.charAt(0).toUpperCase() + plan.hydrawavSettings.intensity.slice(1)}
              </p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--color-hw-cream)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-hw-text-muted)" }}>
                Session Duration
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-hw-text)" }}>
                {plan.hydrawavSettings.duration} min
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Therapy */}
      {plan.manualTherapy && (
        <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
          <p className="text-lg font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
            🤝 Manual Therapy
          </p>
          <div className="mb-3">
            <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text-muted)" }}>
              Type: {plan.manualTherapy.type}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
              Frequency: {plan.manualTherapy.frequency}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-hw-text-muted)" }}>
              Techniques:
            </p>
            <div className="flex flex-wrap gap-2">
              {plan.manualTherapy.techniques.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs rounded-full"
                  style={{ background: "var(--color-hw-cream)", color: "var(--color-hw-clay)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Treatment Timeline */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-lg font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>
          📅 Treatment Timeline
        </p>
        <div className="space-y-3">
          <div className="border-l-4 pl-4" style={{ borderColor: "var(--color-hw-clay)" }}>
            <p className="font-semibold" style={{ color: "var(--color-hw-text)" }}>
              Weeks 1-2
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
              {plan.treatmentTimeline.week1_2}
            </p>
          </div>
          <div className="border-l-4 pl-4" style={{ borderColor: "var(--color-hw-clay)" }}>
            <p className="font-semibold" style={{ color: "var(--color-hw-text)" }}>
              Weeks 3-4
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
              {plan.treatmentTimeline.week3_4}
            </p>
          </div>
        </div>
      </div>

      {/* Follow-up Recommendations */}
      <div className="rounded-2xl p-5" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-lg font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
          ✅ Follow-up Recommendations
        </p>
        <ul className="space-y-2">
          {plan.followUpRecommendations.map((rec, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-hw-text)" }}>
              <Check size={16} style={{ color: "var(--color-hw-clay)", flexShrink: 0 }} />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Practitioner Notes */}
      <div className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-sm font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
          📝 Practitioner Notes
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add personal notes for this treatment plan..."
          rows={4}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{
            background: "var(--color-hw-cream)",
            border: "1px solid var(--color-hw-border)",
            color: "var(--color-hw-text)",
          }}
        />
        <button
          onClick={() => {
            localStorage.setItem(`treatment_notes_${patientId}`, notes);
            alert("Notes saved!");
          }}
          className="mt-3 px-4 py-2 rounded-lg font-semibold text-white"
          style={{ background: "var(--color-hw-clay)" }}
        >
          Save Notes
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/practitioner/patient/${patientId}`}
          className="flex-1 py-2.5 rounded-lg text-sm font-bold text-center"
          style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}
        >
          Back to Patient
        </Link>
        <button
          onClick={() => window.print()}
          className="flex-1 py-2.5 rounded-lg text-sm font-bold text-white"
          style={{ background: "var(--color-hw-clay)" }}
        >
          Print Plan
        </button>
      </div>
    </div>
  );
}
