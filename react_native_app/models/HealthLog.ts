// =============================================================================
// HEALTH LOG MODEL
// =============================================================================
// Domain model for health-related entries (mood, water, meals, blood pressure,
// etc.). Used by HealthLogProvider and Health Logs / Health Timeline screens.
// =============================================================================

export enum HealthLogType {
  mood = 'mood',
  symptoms = 'symptoms',
  meals = 'meals',
  water = 'water',
  exercise = 'exercise',
  sleep = 'sleep',
  general = 'general',
  bloodPressure = 'bloodPressure',
  heartRate = 'heartRate',
}

export function formatHealthLogTypeDisplay(type: HealthLogType): string {
  switch (type) {
    case HealthLogType.bloodPressure:
      return 'Blood Pressure';
    case HealthLogType.heartRate:
      return 'Heart Rate';
    default:
      const name = type;
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

/** Blood pressure category per AHA guidelines (systolic/diastolic mmHg). */
export function bloodPressureCategoryLabel(systolic: number, diastolic: number): string {
  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive crisis';
  if (systolic >= 140 || diastolic >= 90) return 'High (Stage 2)';
  if (systolic >= 130 || diastolic >= 80) return 'High (Stage 1)';
  if (systolic >= 120 && diastolic < 80) return 'Elevated';
  return 'Normal';
}

/** Heart rate category for resting adult (bpm). */
export function heartRateCategoryLabel(bpm: number): string {
  if (bpm < 60) return 'Bradycardia';
  if (bpm <= 100) return 'Normal';
  return 'Tachycardia';
}

export interface HealthLog {
  id: string;
  type: HealthLogType;
  description: string;
  note?: string | null;
  createdAt: Date;
  emoji?: string | null;
  waterTotal?: number | null;
  waterDelta?: number | null;
  waterGoal?: number | null;
  sleepHours?: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  heartRateBpm?: number | null;
}

/** Date-only (midnight) for filtering by calendar day. */
export function getHealthLogDateOnly(log: HealthLog): Date {
  const d = log.createdAt;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function healthLogHasProgress(log: HealthLog): boolean {
  return log.waterTotal != null && log.waterGoal != null && log.waterGoal > 0;
}

export function healthLogProgressRatio(log: HealthLog): number {
  if (!healthLogHasProgress(log) || !log.waterGoal) return 0;
  return Math.min(1, Math.max(0, (log.waterTotal ?? 0) / log.waterGoal));
}
