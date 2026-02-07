// =============================================================================
// TASK MODEL
// =============================================================================
// Domain model for tasks used across caregiver screens and task details.
// Feature parity with flutter_app/lib/models/task.dart
// =============================================================================

import { AppColors } from "@/constants/theme";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  patientName: string;
  icon: "medication" | "monitor-heart" | "directions-walk";
  iconBackground: string;
  iconColor: string;
  completedAt?: Date;
}

export const isTaskCompleted = (task: Task): boolean => !!task.completedAt;

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Metformin 500mg",
    description: "Medication reminder",
    date: new Date(Date.now() + 60 * 60 * 1000),
    patientName: "Maya Patel",
    icon: "medication",
    iconBackground: AppColors.primary100,
    iconColor: AppColors.primary700,
  },
  {
    id: "task-2",
    title: "Blood pressure log",
    description: "Record BP and upload to the care plan.",
    date: new Date(Date.now() + 3 * 60 * 60 * 1000),
    patientName: "Mary Johnson",
    icon: "monitor-heart",
    iconBackground: AppColors.accent100,
    iconColor: AppColors.accent600,
  },
  {
    id: "task-3",
    title: "Evening walk",
    description: "Assist with 15-minute walk after dinner.",
    date: new Date(Date.now() + 6 * 60 * 60 * 1000),
    patientName: "James Carter",
    icon: "directions-walk",
    iconBackground: AppColors.success100,
    iconColor: AppColors.success700,
    completedAt: new Date(),
  },
];
