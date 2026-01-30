import 'package:flutter/material.dart';

// =============================================================================
// TASK MODEL
// =============================================================================
// Domain model for scheduled tasks/appointments. Used by [TaskProvider],
// [CalendarScreen], and [HealthTimelineProvider]. [dateOnly] / [day] support
// calendar filtering; [completedAt] excludes task from calendar when set.
// =============================================================================

/// Task model representing a scheduled task/appointment.
///
/// [date] holds both day and time; use [dateOnly] for calendar day, format
/// time with DateFormat.jm(date) where needed. [completedAt] non-null means
/// completed; calendar shows only incomplete tasks via [getScheduledTasksForDate].
class Task {
  final String id;
  final String title;
  final DateTime date;
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  /// When non-null, task is completed; excluded from calendar task list.
  final DateTime? completedAt;

  Task({
    required this.id,
    required this.title,
    required this.date,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    this.completedAt,
  });

  bool get isCompleted => completedAt != null;

  /// Date-only (midnight) for filtering by calendar day
  DateTime get dateOnly => DateTime(date.year, date.month, date.day);

  /// Get the day of month
  int get day => date.day;

  Task copyWith({
    String? id,
    String? title,
    DateTime? date,
    IconData? icon,
    Color? iconBackground,
    Color? iconColor,
    DateTime? completedAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      date: date ?? this.date,
      icon: icon ?? this.icon,
      iconBackground: iconBackground ?? this.iconBackground,
      iconColor: iconColor ?? this.iconColor,
      completedAt: completedAt ?? this.completedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date.toIso8601String(),
      if (completedAt != null) 'completedAt': completedAt!.toIso8601String(),
      // Note: icon, iconBackground, iconColor are not serialized
    };
  }
}
