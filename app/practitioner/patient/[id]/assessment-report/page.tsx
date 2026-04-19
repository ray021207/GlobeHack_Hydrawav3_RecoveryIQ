"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { KineticReportDisplay } from "@/components/KineticReportDisplay";
import { PATIENTS, type PatientId } from "@/lib/mock-data";
import type { KineticReport } from "@/lib/kinetic-analysis";

export default function PractitionerAssessmentReportPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const patientId = id as PatientId;
  const [report, setReport] = useState<KineticReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
  }, [router]);

  useEffect(() => {
    // Load kinetic report from localStorage
    const savedReport = localStorage.getItem(`kinetic_report_${patientId}`);
    if (savedReport) {
      try {
        setReport(JSON.parse(savedReport));
      } catch (e) {
        console.error("Failed to parse report:", e);
      }
    }
    setLoading(false);
  }, [patientId]);

  if (!PATIENTS[patientId]) return <div className="p-8">Patient not found</div>;
  if (loading) return <div className="p-8">Loading report...</div>;
  if (!report) return <div className="p-8">No assessment report available yet</div>;

  const patient = PATIENTS[patientId];

  return (
    <div className="space-y-6">
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
            Patient Assessment Review
          </p>
          <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>
            {patient.name} — Kinetic Analysis Report
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>
            Review and manage the patient's assessment data
          </p>
        </div>
      </div>

      {/* Report Display */}
      <KineticReportDisplay report={report} patientName={patient.name} showActions={true} />

      {/* Clinical Notes Section */}
      <div className="rounded-2xl p-6" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-sm font-bold mb-4" style={{ color: "var(--color-hw-text)" }}>
          📝 Clinical Notes
        </p>
        <textarea
          value={clinicalNotes}
          onChange={(e) => setClinicalNotes(e.target.value)}
          placeholder="Add your clinical observations, treatment recommendations, and follow-up notes..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
          style={{
            background: "var(--color-hw-cream)",
            border: "1px solid var(--color-hw-border)",
            color: "var(--color-hw-text)",
          }}
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              // Save clinical notes
              localStorage.setItem(
                `clinical_notes_${patientId}`,
                JSON.stringify({
                  notes: clinicalNotes,
                  timestamp: new Date().toISOString(),
                })
              );
              alert("Clinical notes saved!");
            }}
            className="px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: "var(--color-hw-clay)" }}
          >
            Save Notes
          </button>
          <button
            onClick={() => router.push(`/practitioner/patient/${patientId}`)}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{ background: "#fff", color: "var(--color-hw-text)", border: "1px solid var(--color-hw-border)" }}
          >
            Back to Patient
          </button>
        </div>
      </div>

      {/* Treatment Plan Section */}
      <div className="rounded-2xl p-6" style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
        <p className="text-sm font-bold mb-3" style={{ color: "var(--color-hw-text)" }}>
          🎯 Create Treatment Plan
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--color-hw-text-muted)" }}>
          Use the patient's assessment data to create a personalized recovery plan with specific exercises and follow-up timeline.
        </p>
        <button
          onClick={() => router.push(`/practitioner/patient/${patientId}`)}
          className="px-4 py-2 rounded-lg font-semibold text-white"
          style={{ background: "var(--color-hw-clay)" }}
        >
          Go to Patient Dashboard
        </button>
      </div>
    </div>
  );
}
