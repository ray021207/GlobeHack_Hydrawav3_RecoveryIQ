"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { seedStorage } from "@/lib/mock-data";

const CREDENTIALS: Record<string, { password: string; role: "practitioner" | "patient"; userId: string }> = {
  practitioner: { password: "hydra2026",  role: "practitioner", userId: "practitioner" },
  maria:        { password: "maria123",   role: "patient",      userId: "maria" },
  james:        { password: "james123",   role: "patient",      userId: "james" },
  sarah:        { password: "sarah123",   role: "patient",      userId: "sarah" },
  alex:         { password: "alex123",    role: "patient",      userId: "alex" },
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { seedStorage(); }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const cred = CREDENTIALS[username.toLowerCase().trim()];
    if (!cred || cred.password !== password) {
      setError("Invalid username or password");
      setLoading(false);
      return;
    }
    localStorage.setItem("riq_role", cred.role);
    localStorage.setItem("riq_userId", cred.userId);
    router.push(cred.role === "practitioner" ? "/practitioner" : "/patient");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-hw-sidebar)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "conic-gradient(from 0deg, #c9962a, #e8b84b, #c9962a)" }}>3</div>
          <div>
            <div className="text-white font-bold text-xl tracking-wide">HYDRAWAV3</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>RecoveryIQ</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="practitioner / maria / james / sarah / alex"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
              autoCapitalize="none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>

          {error && <p className="text-sm text-center" style={{ color: "var(--color-hw-red)" }}>{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm mt-2 transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-hw-gold)", color: "#fff" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 p-4 rounded-xl text-xs space-y-1" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
          <p className="font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Demo credentials</p>
          <p>Practitioner: practitioner / hydra2026</p>
          <p>Patients: maria / maria123 · james / james123 · sarah / sarah123</p>
        </div>
      </div>
    </div>
  );
}
