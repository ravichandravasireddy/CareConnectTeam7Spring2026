// =============================================================================
// CAREGIVER HELPER FUNCTIONS
// =============================================================================
// Pure functions for greeting, name parsing, task filtering.
// Extracted for unit testing without loading screen dependencies.
// =============================================================================

import type { Task } from "@/models/Task";

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function greetingName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1 && parts[0] === "Dr.") return parts[1];
  return parts[0] || "Caregiver";
}

export function tasksForToday(tasks: Task[], referenceDate?: Date): Task[] {
  const today = referenceDate ?? new Date();
  return tasks.filter(
    (t) =>
      t.date.getFullYear() === today.getFullYear() &&
      t.date.getMonth() === today.getMonth() &&
      t.date.getDate() === today.getDate()
  );
}

export default { getGreeting, greetingName, tasksForToday } as const;