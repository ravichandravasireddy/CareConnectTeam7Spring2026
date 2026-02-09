// =============================================================================
// TASK MODEL
// =============================================================================
// Domain model for tasks used across caregiver screens and task details.
// =============================================================================

import { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type TaskIcon = ComponentProps<typeof MaterialIcons>['name'];

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  patientName: string;
  icon: TaskIcon;
  iconBackground: string;
  iconColor: string;
  completedAt?: Date;
}

export const isTaskCompleted = (task: Task): boolean => {
  return task.completedAt !== undefined && task.completedAt !== null;
};

export const getTaskDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const areDatesEqual = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
