"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/Brand";

const NAV = [
  { href: "/patient",             label: "Home",    icon: "🏠" },
  { href: "/patient/scan",        label: "Scan",    icon: "📹" },
  { href: "/patient/checkin",     label: "Check-in", icon: "✅" },
  { href: "/patient/avatar",      label: "Pet",     icon: "🐾" },
  { href: "/patient/leaderboard", label: "Ranks",   icon: "🏆" },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const role = localStorage.getItem("riq_role");
    if (role !== "patient") router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen pb-20 flex flex-col" style={{ background: "var(--color-hw-cream)" }}>
      <header className="px-5 py-3.5 flex items-center justify-between border-b"
        style={{ background: "var(--color-hw-black)", borderColor: "rgba(255,255,255,0.08)" }}>
        <Brand variant="dark" size="sm" showRecoveryIQ />
        <button
          onClick={() => { localStorage.removeItem("riq_role"); localStorage.removeItem("riq_userId"); router.push("/login"); }}
          className="text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.08)" }}>
          Log out
        </button>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 flex border-t"
        style={{ background: "#fff", borderColor: "var(--color-hw-border)" }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
              <span className="text-xl">{icon}</span>
              <span className="text-[10px] font-semibold"
                style={{ color: active ? "var(--color-hw-clay)" : "var(--color-hw-text-muted)" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
