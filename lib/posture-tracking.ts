export interface PostureMetrics {
  headPosition: number; // 0-100 score
  shoulderAlignment: number; // symmetry 0-100
  spinalAlignment: number; // 0-100 (lower back, thoracic, cervical)
  pelvisAlignment: number; // 0-100
  overallScore: number; // average 0-100
  timestamp: string;
  notes?: string;
}

export interface PostureLog {
  date: string;
  metrics: PostureMetrics;
  comparisonToPrevious?: {
    changePercent: number; // positive = improvement
    areas: string[];
  };
  recommendations: string[];
}

export interface PostureBaseline {
  createdDate: string;
  metrics: PostureMetrics;
  confidence: number; // 0-1
}

// Posture analysis based on MediaPipe landmarks
// Landmarks: 0=nose, 11=left shoulder, 12=right shoulder, 23=left hip, 24=right hip, etc.
export function analyzePostureFromLandmarks(landmarks: any[]): PostureMetrics {
  if (!landmarks || landmarks.length < 33) {
    return {
      headPosition: 0,
      shoulderAlignment: 0,
      spinalAlignment: 0,
      pelvisAlignment: 0,
      overallScore: 0,
      timestamp: new Date().toISOString(),
      notes: "Insufficient data for analysis",
    };
  }

  // Head position analysis
  const nose = landmarks[0];
  const leftEar = landmarks[8];
  const rightEar = landmarks[7];

  let headPosition = 50; // neutral
  if (nose && leftEar && rightEar) {
    const noseY = nose.y || 0;
    const earAvgY = ((leftEar.y || 0) + (rightEar.y || 0)) / 2;
    const headTilt = Math.abs(noseY - earAvgY);
    headPosition = Math.max(0, 100 - headTilt * 200); // penalize forward head
  }

  // Shoulder alignment (symmetry)
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  let shoulderAlignment = 50;
  if (leftShoulder && rightShoulder) {
    const shoulderDiff = Math.abs((leftShoulder.y || 0) - (rightShoulder.y || 0));
    shoulderAlignment = Math.max(0, 100 - shoulderDiff * 150);
  }

  // Spinal alignment (shoulder-hip alignment)
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  let spinalAlignment = 50;
  if (leftShoulder && leftHip && rightShoulder && rightHip) {
    const leftSpinalAngle = Math.atan2(
      (leftHip.y || 0) - (leftShoulder.y || 0),
      (leftHip.x || 0) - (leftShoulder.x || 0)
    );
    const rightSpinalAngle = Math.atan2(
      (rightHip.y || 0) - (rightShoulder.y || 0),
      (rightHip.x || 0) - (rightShoulder.x || 0)
    );
    const spinalDiff = Math.abs(leftSpinalAngle - rightSpinalAngle);
    spinalAlignment = Math.max(0, 100 - spinalDiff * 50);
  }

  // Pelvis alignment (symmetry)
  let pelvisAlignment = 50;
  if (leftHip && rightHip) {
    const pelvisDiff = Math.abs((leftHip.y || 0) - (rightHip.y || 0));
    pelvisAlignment = Math.max(0, 100 - pelvisDiff * 150);
  }

  const overallScore = (headPosition + shoulderAlignment + spinalAlignment + pelvisAlignment) / 4;

  return {
    headPosition: Math.round(headPosition),
    shoulderAlignment: Math.round(shoulderAlignment),
    spinalAlignment: Math.round(spinalAlignment),
    pelvisAlignment: Math.round(pelvisAlignment),
    overallScore: Math.round(overallScore),
    timestamp: new Date().toISOString(),
  };
}

export function comparePostureMetrics(current: PostureMetrics, baseline: PostureMetrics): PostureLog {
  const headDelta = ((current.headPosition - baseline.headPosition) / baseline.headPosition) * 100;
  const shoulderDelta = ((current.shoulderAlignment - baseline.shoulderAlignment) / baseline.shoulderAlignment) * 100;
  const spinalDelta = ((current.spinalAlignment - baseline.spinalAlignment) / baseline.spinalAlignment) * 100;
  const pelvisDelta = ((current.pelvisAlignment - baseline.pelvisAlignment) / baseline.pelvisAlignment) * 100;
  const overallDelta = ((current.overallScore - baseline.overallScore) / baseline.overallScore) * 100;

  const improvedAreas: string[] = [];
  const declinedAreas: string[] = [];

  if (headDelta > 5) improvedAreas.push("Head Position");
  else if (headDelta < -5) declinedAreas.push("Head Position");

  if (shoulderDelta > 5) improvedAreas.push("Shoulder Alignment");
  else if (shoulderDelta < -5) declinedAreas.push("Shoulder Alignment");

  if (spinalDelta > 5) improvedAreas.push("Spinal Alignment");
  else if (spinalDelta < -5) declinedAreas.push("Spinal Alignment");

  if (pelvisDelta > 5) improvedAreas.push("Pelvis Alignment");
  else if (pelvisDelta < -5) declinedAreas.push("Pelvis Alignment");

  const recommendations: string[] = [];

  if (declinedAreas.includes("Head Position")) {
    recommendations.push(
      "⚠️ Forward head posture detected. Keep chin slightly tucked when working.",
      "Take frequent breaks from desk work to reset posture"
    );
  }

  if (declinedAreas.includes("Shoulder Alignment")) {
    recommendations.push("👁️ Shoulder asymmetry detected. Practice shoulder blade squeezes and retractions.");
  }

  if (declinedAreas.includes("Spinal Alignment")) {
    recommendations.push("🔄 Spinal alignment declined. Focus on core engagement and upright posture.");
  }

  if (declinedAreas.includes("Pelvis Alignment")) {
    recommendations.push("💪 Pelvic tilt detected. Practice pelvic tilt exercises and glute engagement.");
  }

  if (improvedAreas.length > 0) {
    recommendations.push(`✅ Great progress in: ${improvedAreas.join(", ")}`);
  }

  if (overallDelta > 10) {
    recommendations.push("🌟 Excellent posture improvement! Continue current exercises and habits.");
  }

  return {
    date: new Date().toISOString().split("T")[0],
    metrics: current,
    comparisonToPrevious: {
      changePercent: Math.round(overallDelta),
      areas: improvedAreas,
    },
    recommendations,
  };
}

export function getPostureStatusEmoji(score: number): string {
  if (score >= 80) return "🟢"; // Good
  if (score >= 60) return "🟡"; // Fair
  if (score >= 40) return "🟠"; // Poor
  return "🔴"; // Critical
}

export function getPostureStatusText(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair - Needs Attention";
  return "Poor - Requires Intervention";
}

export function shouldPerformPostureCheck(): boolean {
  // Every other day = check if today is an appropriate day
  const lastCheckKey = "last_posture_check_date";
  const today = new Date().toISOString().split("T")[0];
  const lastCheck = localStorage.getItem(lastCheckKey);

  if (!lastCheck) return true; // First check

  const lastDate = new Date(lastCheck);
  const todayDate = new Date(today);
  const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  return daysDiff >= 2; // Check every other day (2+ days since last check)
}

export function savePostureCheckDate(): void {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("last_posture_check_date", today);
}

export function getNextPostureCheckDate(): string {
  const lastCheck = localStorage.getItem("last_posture_check_date");
  if (!lastCheck) return "Today";

  const lastDate = new Date(lastCheck);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 2);
  return nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
