import 'package:flutter/material.dart';

/// Task model representing a scheduled task/appointment.
/// [date] holds both day and time; format for display where needed (e.g. DateFormat.jm(date) for time).
class Task {
  final String id;
  final String title;
  final DateTime date; // Date and time of the task
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  /// When non-null, the task is completed; used for timeline and history.
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
