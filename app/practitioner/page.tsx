"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play, Plus, ArrowRight, TrendingDown, Users, Activity, LifeBuoy, MessageCircle, Rocket } from "lucide-react";
import { PATIENTS, getCheckins, getRecoveryScore, getTrend, daysSince, type PatientId } from "@/lib/mock-data";

const PATIENT_IDS: PatientId[] = ["maria", "james", "sarah"];

function StatCard({ label, value, sub, icon: Icon, trendUp }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; trendUp?: boolean | null;
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-hw-text-muted)" }}>{label}</p>
        <Icon size={16} style={{ color: "var(--color-hw-text-faint)" }} />
      </div>
      <p className="text-3xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>{value}</p>
      <p className="text-xs" style={{ color: trendUp === true ? "var(--color-hw-green)" : trendUp === false ? "var(--color-hw-red)" : "var(--color-hw-text-muted)" }}>
        {sub}
      </p>
    </div>
  );
}

export default function PractitionerDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
    else setMounted(true);
  }, [router]);

  if (!mounted) return null;

  const totalSessions = PATIENT_IDS.reduce((acc, id) => acc + getCheckins(id).length, 0);
  const avgPainReduction = Math.round(
    PATIENT_IDS.reduce((acc, id) => {
      const checkins = getCheckins(id);
      if (checkins.length < 2) return acc;
      const first = checkins[0].pain;
      const last = checkins[checkins.length - 1].pain;
      return acc + Math.max(0, ((first - last) / first) * 100);
    }, 0) / PATIENT_IDS.length
  );

  const pendingAssessments = PATIENT_IDS.filter((id) => {
    const checkins = getCheckins(id);
    return checkins.length === 0 || daysSince(checkins[checkins.length - 1].timestamp) >= 3;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-hw-text-muted)" }}>Welcome back, <strong>Annie Sturm</strong></p>
      </div>

      {/* Quick Actions */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Quick Actions</p>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/practitioner/session">
            <div className="rounded-2xl p-6 flex items-center justify-between cursor-pointer group"
              style={{ background: "var(--color-hw-black)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-hw-clay)" }}>
                  <Play size={16} fill="white" color="white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Start New Session</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Configure devices and begin therapy</p>
                </div>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ color: "rgba(255,255,255,0.4)" }} />
            </div>
          </Link>
          <Link href="/practitioner/clients/new">
            <div className="rounded-2xl p-6 flex items-center justify-between cursor-pointer group"
              style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--color-hw-cream)" }}>
                  <Plus size={18} style={{ color: "var(--color-hw-text-muted)" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Add New Client</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Complete intake form and analysis</p>
                </div>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" style={{ color: "var(--color-hw-text-faint)" }} />
            </div>
          </Link>
        </div>
      </section>

      {/* Practice Analytics */}
      <section>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Practice Analytics</p>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Sessions" value={String(totalSessions)} sub="→ 0% vs last month" icon={Activity} trendUp={null} />
          <StatCard label="Avg. Pain Reduction" value={`${avgPainReduction}%`} sub="Based on pre/post session scores" icon={TrendingDown} trendUp={avgPainReduction > 0} />
          <StatCard label="Total Clients" value={String(PATIENT_IDS.length)} sub="Current users" icon={Users} trendUp={null} />
        </div>
      </section>

      {/* Pending pre-visit assessments */}
      {pendingAssessments.length > 0 && (
        <section>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-hw-text-muted)" }}>
            Pending Pre-Visit Assessments
          </p>
          <div className="rounded-2xl divide-y" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            {pendingAssessments.map((id) => {
              const p = PATIENTS[id];
              const score = getRecoveryScore(id);
              const trend = getTrend(id);
              return (
                <Link key={id} href={`/practitioner/clients/${id}`}>
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors cursor-pointer first:rounded-t-2xl last:rounded-b-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: "var(--color-hw-teal)" }}>
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>{p.name}</p>
                        <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>{p.primary_region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{ background: trend === "improving" ? "#00bb7f20" : "#e4001420", color: trend === "improving" ? "var(--color-hw-green)" : "var(--color-hw-red)" }}>
                        Score: {score}
                      </span>
                      <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "var(--color-hw-clay)", color: "#fff" }}>
                        Review →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Business Resources + Support */}
      <div className="grid grid-cols-2 gap-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Business Resources &amp; Growth</p>
          <div className="rounded-2xl p-6 flex items-center justify-between" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--color-hw-clay)20" }}>
                <Rocket size={22} style={{ color: "var(--color-hw-clay)" }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>Expand Your Practice</p>
                <p className="text-xs mt-1 max-w-[200px]" style={{ color: "var(--color-hw-text-muted)" }}>
                  Access marketing kits, manage practice growth resources, and publish custom protocols.
                </p>
              </div>
            </div>
            <button className="text-xs font-bold px-4 py-2 rounded-lg shrink-0 flex items-center gap-1.5"
              style={{ background: "var(--color-hw-blue)", color: "#fff" }}>
              Explore Growth <ArrowRight size={12} />
            </button>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--color-hw-text-muted)" }}>Support &amp; Help</p>
          <div className="space-y-3">
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <LifeBuoy size={18} style={{ color: "var(--color-hw-text-muted)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>Submit Support Ticket</p>
                <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>Report hardware issues or bugs</p>
              </div>
            </div>
            <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
              <MessageCircle size={18} style={{ color: "var(--color-hw-text-muted)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>Live Chat with Success</p>
                <p className="text-xs" style={{ color: "var(--color-hw-text-muted)" }}>Get immediate help from our team</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
