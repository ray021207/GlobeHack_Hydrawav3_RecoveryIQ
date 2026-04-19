"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Activity, Users, Radio, Settings, LogOut } from "lucide-react";
import { Brand } from "./Brand";

const NAV = [
  { label: "Dashboard", href: "/practitioner",         icon: LayoutGrid },
  { label: "Session",   href: "/practitioner/session", icon: Activity },
  { label: "Clients",   href: "/practitioner/clients", icon: Users },
  { label: "Devices",   href: "/practitioner/devices", icon: Radio },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("riq_role");
      localStorage.removeItem("riq_userId");
    }
    router.push("/login");
  }

  return (
    <aside
      className="flex flex-col w-60 shrink-0 h-screen sticky top-0"
      style={{ background: "var(--color-hw-black)", color: "#fff" }}
    >
      <div className="px-5 pt-6 pb-8">
        <Brand variant="dark" size="md" />
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/practitioner" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={
                active
                  ? { background: "var(--color-hw-clay)", color: "#fff" }
                  : { color: "rgba(255,255,255,0.65)" }
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link
          href="/practitioner/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <Settings size={16} strokeWidth={1.8} />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <LogOut size={16} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
        <p className="px-3 pt-3 text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
          V1.0.0 © 2026 HYDRAWAV3
        </p>
      </div>
    </aside>
  );
}
