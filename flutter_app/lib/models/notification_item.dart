// import 'package:flutter/material.dart';

/// Notification type; each value is intended to link to a specific screen when tapped.
/// TODO: Use [destinationRoute] when implementing navigation to these screens.
enum NotificationType {
  /// Links to tasks screen (e.g. task list or task detail).
  medication,
  /// Links to messages screen.
  message,
  /// Links to tasks screen (e.g. appointment / calendar).
  appointment,
  /// Links to tasks screen (e.g. health log / reminders).
  healthReminder,
  /// Links to tasks screen (e.g. task list or task detail).
  taskReminder,
}

/// Notification model for app-wide use (e.g. NotificationProvider).
/// Time display is derived from [createdAt]; no stored timeLabel.
class NotificationItem {
  final String id;
  final String title;
  final String summary;
  final NotificationType type;
  final DateTime createdAt;

  bool isRead;

  NotificationItem({
    required this.id,
    required this.title,
    required this.summary,
    required this.type,
    DateTime? createdAt,
    this.isRead = false,
  }) : createdAt = createdAt ?? DateTime.now();

  /// Destination for navigation when the user taps this notification.
  /// TODO: Navigate to the corresponding screen (TasksScreen, MessagesScreen, etc.) when created.
  String get destinationRoute {
    switch (type) {
      case NotificationType.medication:
      case NotificationType.appointment:
      case NotificationType.healthReminder:
      case NotificationType.taskReminder:
        return 'tasks';
      case NotificationType.message:
        return 'messages';
    }
  }

  NotificationItem copyWith({
    String? id,
    String? title,
    String? summary,
    NotificationType? type,
    DateTime? createdAt,
    bool? isRead,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      title: title ?? this.title,
      summary: summary ?? this.summary,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      isRead: isRead ?? this.isRead,
    );
  }
}
