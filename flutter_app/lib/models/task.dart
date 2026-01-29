import 'package:flutter/material.dart';

/// Task model representing a scheduled task/appointment
class Task {
  final String id;
  final String title;
  final String time;
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;
  final DateTime date; // Full date instead of just day

  Task({
    required this.id,
    required this.title,
    required this.time,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    required this.date,
  });

  /// Get the day of month for this task
  int get day => date.day;

  /// Create a copy of this task with updated fields
  Task copyWith({
    String? id,
    String? title,
    String? time,
    IconData? icon,
    Color? iconBackground,
    Color? iconColor,
    DateTime? date,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      time: time ?? this.time,
      icon: icon ?? this.icon,
      iconBackground: iconBackground ?? this.iconBackground,
      iconColor: iconColor ?? this.iconColor,
      date: date ?? this.date,
    );
  }

  /// Convert to JSON for persistence (if needed later)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'time': time,
      'date': date.toIso8601String(),
      // Note: icon, iconBackground, iconColor are not serialized
      // You may want to store these as strings/ints if persistence is needed
    };
  }
}
