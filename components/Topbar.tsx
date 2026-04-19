"use client";
import { Bell } from "lucide-react";

interface TopbarProps {
  accountName?: string;
}

export function Topbar({ accountName = "Annie's Demo Account" }: TopbarProps) {
  return (
    <header
      className="h-14 flex items-center justify-between px-6 shrink-0 border-b"
      style={{ background: "#fff", borderColor: "var(--color-hw-border)" }}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold" style={{ color: "var(--color-hw-text)" }}>
          {accountName}
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase"
          style={{ background: "#ec7c1320", color: "#ec7c13", border: "1px solid #ec7c1340" }}
        >
          Beta Version
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-full" style={{ background: "var(--color-hw-cream)" }}>
          <Bell size={16} style={{ color: "var(--color-hw-text-muted)" }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "var(--color-hw-red)" }}
          />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "var(--color-hw-teal)" }}
          >
            A
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--color-hw-text)" }}>
            Annie Sturm
          </span>
        </div>
      </div>
    </header>
  );
}
