import 'package:flutter/material.dart';

// =============================================================================
// TIMELINE EVENT MODEL
// =============================================================================
// Unified event DTO for the Health Timeline screen. Built by [HealthTimelineProvider]
// from health logs, notes, and tasks. Add new [TimelineEventSource] values when
// aggregating more data types.
// =============================================================================

/// Source of a timeline event; used for ordering and future filtering.
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
