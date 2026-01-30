import 'package:flutter/material.dart';

/// Source of a timeline event for the Health Timeline screen.
/// Extensible for future models (e.g. appointments, vitals).
enum TimelineEventSource {
  healthLog,
  note,
  task,
  // Future: appointment, vital, medication, etc.
}

/// Unified timeline event for the Health Timeline screen.
/// Built from health logs, notes, and tasks by [HealthTimelineProvider].
class TimelineEvent {
  final String id;
  final TimelineEventSource source;
  final DateTime timestamp;
  final String title;
  final String? subtitle;
  final String? statusLabel;
  final IconData icon;
  final Color iconBackground;
  final Color iconColor;

  const TimelineEvent({
    required this.id,
    required this.source,
    required this.timestamp,
    required this.title,
    this.subtitle,
    this.statusLabel,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
  });
}
