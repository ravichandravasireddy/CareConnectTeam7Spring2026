import 'package:flutter/material.dart';
import '../models/health_log.dart';
import '../models/note.dart';
import '../models/task.dart';
import '../models/timeline_event.dart';
import 'health_log_provider.dart';
import 'note_provider.dart';
import 'task_provider.dart';

/// Aggregates health logs, notes, and tasks into a single timeline for app-wide
/// history. Listen to [HealthLogProvider], [NoteProvider], and [TaskProvider];
/// when any change, this provider's [events] list updates.
class HealthTimelineProvider {
  final HealthLogProvider healthLogProvider;
  final NoteProvider noteProvider;
  final TaskProvider taskProvider;

  HealthTimelineProvider({
    required this.healthLogProvider,
    required this.noteProvider,
    required this.taskProvider,
  });

  /// All timeline events from health logs, notes, and tasks, sorted by
  /// timestamp descending (most recent first).
  List<TimelineEvent> get events {
    final list = <TimelineEvent>[];
    for (final log in healthLogProvider.logs) {
      list.add(_eventFromHealthLog(log));
    }
    for (final note in noteProvider.notes) {
      list.add(_eventFromNote(note));
    }
    for (final task in taskProvider.tasks) {
      if (task.completedAt != null) {
        list.add(_eventFromTask(task));
      }
    }
    list.sort((a, b) => b.timestamp.compareTo(a.timestamp));
    return list;
  }

  TimelineEvent _eventFromHealthLog(HealthLog log) {
    final (bg, fg) = HealthLogProvider.typeColors(log.type);
    String subtitle = log.description;
    String? statusLabel;
    if (log.type == HealthLogType.bloodPressure &&
        log.systolic != null &&
        log.diastolic != null) {
      statusLabel = bloodPressureCategoryLabel(log.systolic!, log.diastolic!);
      subtitle = '${log.description} – $statusLabel';
    } else if (log.type == HealthLogType.heartRate &&
        log.heartRateBpm != null) {
      statusLabel = heartRateCategoryLabel(log.heartRateBpm!);
      subtitle = '${log.description} – $statusLabel';
    }
    if (log.note != null && log.note!.isNotEmpty) {
      subtitle = '$subtitle\n${log.note}';
    }
    return TimelineEvent(
      id: 'health-${log.id}',
      source: TimelineEventSource.healthLog,
      timestamp: log.createdAt,
      title: formatHealthLogTypeDisplay(log.type),
      subtitle: subtitle,
      statusLabel: statusLabel,
      icon: _iconForHealthLogType(log.type),
      iconBackground: bg,
      iconColor: fg,
    );
  }

  TimelineEvent _eventFromNote(Note note) {
    final (bg, fg) = NoteProvider.categoryColors(note.category);
    return TimelineEvent(
      id: 'note-${note.id}',
      source: TimelineEventSource.note,
      timestamp: note.createdAt,
      title: 'Note Added',
      subtitle: note.body,
      icon: Icons.description,
      iconBackground: bg,
      iconColor: fg,
    );
  }

  TimelineEvent _eventFromTask(Task task) {
    return TimelineEvent(
      id: 'task-${task.id}',
      source: TimelineEventSource.task,
      timestamp: task.completedAt!,
      title: 'Task Completed',
      subtitle: task.title,
      icon: task.icon,
      iconBackground: task.iconBackground,
      iconColor: task.iconColor,
    );
  }

  static IconData _iconForHealthLogType(HealthLogType type) {
    switch (type) {
      case HealthLogType.mood:
        return Icons.emoji_emotions;
      case HealthLogType.symptoms:
        return Icons.monitor_heart;
      case HealthLogType.meals:
        return Icons.restaurant;
      case HealthLogType.water:
        return Icons.water_drop;
      case HealthLogType.exercise:
        return Icons.favorite;
      case HealthLogType.sleep:
        return Icons.bedtime;
      case HealthLogType.general:
        return Icons.description;
      case HealthLogType.bloodPressure:
        return Icons.monitor_heart_outlined;
      case HealthLogType.heartRate:
        return Icons.speed;
    }
  }
}
