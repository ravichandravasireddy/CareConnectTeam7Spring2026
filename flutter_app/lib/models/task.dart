import 'package:flutter/material.dart';

// =============================================================================
// TASK MODEL
// =============================================================================
// Domain model for tasks used across caregiver screens and task details.
// =============================================================================

class Task {
  final String id;
  final String title;
  final String description;
  final DateTime date;
  final String patientName;
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  final DateTime? completedAt;

  Task({
    required this.id,
    required this.title,
    this.description = '',
    required this.date,
    this.patientName = '',
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    this.completedAt,
  });

  bool get isCompleted => completedAt != null;

  /// Date-only (midnight) for filtering by calendar day.
  DateTime get dateOnly => DateTime(date.year, date.month, date.day);

  /// Day of month.
  int get day => date.day;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date.toIso8601String(),
      if (completedAt != null) 'completedAt': completedAt!.toIso8601String(),
    };
  }

  Task copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? date,
    String? patientName,
    IconData? icon,
    Color? iconBackground,
    Color? iconColor,
    DateTime? completedAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      date: date ?? this.date,
      patientName: patientName ?? this.patientName,
      icon: icon ?? this.icon,
      iconBackground: iconBackground ?? this.iconBackground,
      iconColor: iconColor ?? this.iconColor,
      completedAt: completedAt ?? this.completedAt,
    );
  }
}
