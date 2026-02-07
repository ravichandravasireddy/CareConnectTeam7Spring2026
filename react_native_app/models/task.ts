// =============================================================================
// TASK MODEL
// =============================================================================
// Domain model for tasks used across caregiver screens, calendar, and task details.
// Feature parity with flutter_app/lib/models/task.dart
// =============================================================================

/** Icons used by caregiver screens and shared (calendar, TaskProvider) screens. All from Material Icons. */
export type TaskIconName =
  | "medication"
  | "favorite"
  | "directions-walk"
  | "fitness-center"
  | "local-hospital"
  | "science"
  | "medication-liquid"
  | "videocam"
  | "phone";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  patientName: string;
  icon: TaskIconName;
  iconBackground: string;
  iconColor: string;
  completedAt?: Date;
}

export const isTaskCompleted = (task: Task): boolean => !!task.completedAt;

/** Returns the same calendar day at local midnight for date-only comparison. */
export function getTaskDateOnly(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** True if both dates are the same calendar day (ignoring time). */
export function areDatesEqual(a: Date, b: Date): boolean {
  return getTaskDateOnly(a).getTime() === getTaskDateOnly(b).getTime();
}
