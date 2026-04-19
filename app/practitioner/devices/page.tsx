"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MapPin, FileText, Wifi, Pencil, Trash2 } from "lucide-react";

interface Device {
  id: string;
  name: string;
  mac: string;
  status: "online" | "offline";
  protocol?: string;
  bodyPart?: string;
}

const DEMO_DEVICES: Device[] = [
  { id: "hydra-19", name: "Hydra-19 (Blue Crystal)", mac: "EC:DA:3B:61:9D:68", status: "online", protocol: "PolarWave 36", bodyPart: "Right Lower Leg" },
  { id: "hydra-11", name: "Hydra-11", mac: "EC:DA:3B:55:0C:AC", status: "offline" },
];

const DEVICE_ACTIONS = [
  { label: "Locate", icon: MapPin },
  { label: "Report", icon: FileText },
  { label: "Edit WiFi", icon: Wifi },
  { label: "Edit Name", icon: Pencil },
  { label: "Remove", icon: Trash2, danger: true },
];

export default function DevicesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("riq_role") !== "practitioner") router.push("/login");
    else setMounted(true);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: "var(--color-hw-text)" }}>Devices Fleet</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-hw-text-muted)" }}>Manage clinical hardware connections and firmware protocols.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--color-hw-text)" }}>
          <Plus size={15} />
          Register Device
        </button>
      </div>

      {/* Filter */}
      <div className="relative">
        <input
          placeholder="Filter by hardware name, MAC ID or protocol type..."
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "#fff", border: "1px solid var(--color-hw-border)", color: "var(--color-hw-text)" }}
        />
      </div>

      {/* Device cards */}
      <div className="grid grid-cols-2 gap-4">
        {DEMO_DEVICES.map((device) => (
          <div key={device.id} className="rounded-2xl p-6"
            style={{ background: "#fff", border: "1px solid var(--color-hw-border)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: device.status === "online" ? "#00bb7f20" : "#e4001412" }}>
                  📡
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--color-hw-text)" }}>{device.name}</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--color-hw-text-muted)" }}>
                    Hardware MAC {device.mac}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  background: device.status === "online" ? "#00bb7f20" : "#99a1af20",
                  color: device.status === "online" ? "var(--color-hw-green)" : "var(--color-hw-text-muted)"
                }}>
                ● {device.status}
              </span>
            </div>

            {device.protocol && (
              <div className="mb-4 p-3 rounded-xl text-xs space-y-1"
                style={{ background: "var(--color-hw-cream)", border: "1px solid var(--color-hw-border)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-hw-text-muted)" }}>Protocol</span>
                  <span className="font-semibold" style={{ color: "var(--color-hw-text)" }}>{device.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-hw-text-muted)" }}>Body Part</span>
                  <span className="font-semibold" style={{ color: "var(--color-hw-text)" }}>{device.bodyPart}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {DEVICE_ACTIONS.map(({ label, icon: Icon, danger }) => (
                <button key={label}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: danger ? "var(--color-hw-red)" : "var(--color-hw-text-muted)" }}>
                  <Icon size={12} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
