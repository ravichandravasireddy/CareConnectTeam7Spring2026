// =============================================================================
// NOTIFICATION MODEL
// =============================================================================
// Domain model for in-app notifications. Used by NotificationProvider and
// NotificationScreen. destinationRoute maps type to route for tap handling.
// taskId links notification to a specific task in TaskProvider (optional).
// =============================================================================

export enum NotificationType {
  /// Links to tasks screen (e.g. task list or task detail).
  medication = 'medication',
  /// Links to messages screen.
  message = 'message',
  /// Links to tasks screen (e.g. appointment / calendar).
  appointment = 'appointment',
  /// Links to tasks screen (e.g. health log / reminders).
  healthReminder = 'healthReminder',
  /// Links to tasks screen (e.g. task list or task detail).
  generalReminder = 'generalReminder',
}

export interface NotificationItem {
  id: string;
  title: string;
  summary: string;
  type: NotificationType;
  createdAt: Date;
  isRead: boolean;
  taskId?: string; // Optional link to a task in TaskProvider
}

export const getDestinationRoute = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.medication:
    case NotificationType.appointment:
    case NotificationType.healthReminder:
    case NotificationType.generalReminder:
      return '/task-details'; // Navigate to task-details screen
    case NotificationType.message:
      return '/messages'; // Navigate to messages screen
  }
};

export const isTaskRelated = (type: NotificationType): boolean => {
  return (
    type === NotificationType.medication ||
    type === NotificationType.appointment ||
    type === NotificationType.healthReminder ||
    type === NotificationType.generalReminder
  );
};
