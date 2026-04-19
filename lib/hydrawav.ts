const BASE = "http://54.241.236.53:8080";
let cachedToken: string | null = null;

export async function getHydraToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "testpractitioner", password: "1234", rememberMe: true }),
  });
  const data = await res.json();
  cachedToken = data.JWT_ACCESS_TOKEN.replace("Bearer ", "");
  return cachedToken!;
}

export async function sendDeviceCommand(payloadObj: object): Promise<unknown> {
  const token = await getHydraToken();
  const res = await fetch(`${BASE}/api/v1/mqtt/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ topic: "HydraWav3Pro/config", payload: JSON.stringify(payloadObj) }),
  });
  return res.json();
}

export const MAC = "74:4D:BD:A0:A3:EC";

export const START_PAYLOAD = {
  mac: MAC, sessionCount: 3, sessionPause: 30, sDelay: 0,
  cycle1: 1, cycle5: 1, edgeCycleDuration: 9,
  cycleRepetitions: [6, 6, 3], cycleDurations: [3, 3, 3],
  cyclePauses: [3, 3, 3], pauseIntervals: [3, 3, 3],
  leftFuncs: ["leftColdBlue", "leftHotRed", "leftColdBlue"],
  rightFuncs: ["rightHotRed", "rightColdBlue", "rightHotRed"],
  pwmValues: { hot: [90, 90, 90], cold: [250, 250, 250] },
  playCmd: 1, led: 1, hotDrop: 5, coldDrop: 3,
  vibMin: 15, vibMax: 222, totalDuration: 426,
};

export const PROTOCOLS: Record<string, { name: string; payload: object }> = {
  restore:  { name: "PolarWave 36 — Restore",  payload: { ...START_PAYLOAD } },
  release:  { name: "PolarWave 18 — Release",  payload: { mac: MAC, playCmd: 1, totalDuration: 240 } },
  balance:  { name: "PolarWave 9 — Balance",   payload: { mac: MAC, playCmd: 1, totalDuration: 300 } },
  activate: { name: "PolarWave 6 — Activate",  payload: { mac: MAC, playCmd: 1, totalDuration: 300 } },
  awaken:   { name: "PolarWave 3 — Awaken",    payload: { mac: MAC, playCmd: 1, totalDuration: 240 } },
};
