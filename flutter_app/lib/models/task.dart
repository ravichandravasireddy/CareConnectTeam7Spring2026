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
    required this.description,
    required this.date,
    required this.patientName,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    this.completedAt,
  });

  bool get isCompleted => completedAt != null;

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
