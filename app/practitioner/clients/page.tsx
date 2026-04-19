"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Play, Trash2, TrendingDown } from "lucide-react";
import { PATIENTS, getCheckins, getRecoveryScore, daysSince, type PatientId } from "@/lib/mock-data";

const PATIENT_IDS: PatientId[] = ["maria", "james", "sarah"];

const SORT_OPTIONS = ["Most Recently Seen", "Name A–Z", "Highest Pain"] as const;
type Sort = (typeof SORT_OPTIONS)[number];

export default function ClientsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("Most Recently Seen");

  useEffect(() => {
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
    else setMounted(true);
  }, [router]);

  if (!mounted) return null;

  const rows = PATIENT_IDS.map((id) => {
    const p = PATIENTS[id];
    const checkins = getCheckins(id);
    const last = checkins[checkins.length - 1];
    const daysSinceLast = last ? daysSince(last.timestamp) : null;
    const currentPain = last?.pain ?? p.discomfort_level;
    const score = getRecoveryScore(id);
    const avgPainRed = checkins.length >= 2
      ? Math.round(Math.max(0, ((checkins[0].pain - last!.pain) / checkins[0].pain) * 100))
      : 0;
    return { id, p, daysSinceLast, currentPain, score, avgPainRed, totalVisits: checkins.length };
  });

  const filtered = rows
    .filter((r) => r.p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Name A–Z") return a.p.name.localeCompare(b.p.name);
      if (sort === "Highest Pain") return b.currentPain - a.currentPain;
      return (a.daysSinceLast ?? 99) - (b.daysSinceLast ?? 99);
    });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Clients</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Manage client records and history.</p>
        </div>
        <Link href="/practitioner/clients/new">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--color-hw-text)" }}>
            <Plus size={15} />
            New Client Intake Form
          </button>
        </Link>
      </div>

      {/* Search + sort */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-hw-text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "#fff", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="px-4 py-2.5 rounded-xl text-sm font-medium outline-none"
          style={{ background: "#fff", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}
        >
          {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--color-hw-border)" }}>
              {["Client Name", "DOB / AGE", "Last Session", "Total Visits", "Avg. Pain Relief", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-hw-text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ id, p, daysSinceLast, avgPainRed, totalVisits }) => (
              <tr key={id} className="border-b last:border-0 hover:bg-stone-50 transition-colors"
                style={{ borderColor: "var(--color-hw-border)" }}>
                <td className="px-5 py-4">
                  <Link href={`/practitioner/clients/${id}`}>
                    <p className="font-semibold hover:underline" style={{ color: "var(--color-hw-text)" }}>{p.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>
                      ID: {id.slice(0, 8)}...
                    </p>
                  </Link>
                </td>
                <td className="px-5 py-4" style={{ color: "var(--color-hw-text-muted)" }}>
                  {p.age ?? "—"}
                </td>
                <td className="px-5 py-4" style={{ color: "var(--color-hw-text-muted)" }}>
                  {daysSinceLast === null ? "No sessions yet" : daysSinceLast === 0 ? "Today" : `${daysSinceLast}d ago`}
                </td>
                <td className="px-5 py-4 font-medium" style={{ color: "var(--color-hw-text)" }}>{totalVisits}</td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: avgPainRed > 0 ? "var(--color-hw-green)" : "var(--color-hw-text-muted)" }}>
                    {avgPainRed > 0 && <TrendingDown size={13} />}
                    {avgPainRed > 0 ? `${avgPainRed}%` : "↘ 0%"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link href={`/practitioner/session?client=${id}`}>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: "var(--color-hw-text)" }}>
                        <Play size={11} fill="white" />
                        Start Session
                      </button>
                    </Link>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ color: "var(--color-hw-red)", background: "#e4001412" }}>
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm" style={{ color: "var(--color-hw-text-muted)" }}>
            No clients match your search.
          </div>
        )}
      </div>
    </div>
  );
}
