// =============================================================================
// HEALTH TIMELINE EVENTS HOOK
// =============================================================================
// Aggregates HealthLog, Note, and completed Task into a single TimelineEvent
// list sorted by timestamp descending. Only tasks with completedAt set appear.
// =============================================================================

import { useMemo } from 'react';
import { useHealthLogProvider } from '../providers/HealthLogProvider';
import { useNoteProvider } from '../providers/NoteProvider';
import { useTaskProvider } from '../providers/TaskProvider';
import { TimelineEvent, TimelineEventSource } from '../models/TimelineEvent';
import {
  HealthLog,
  HealthLogType,
  formatHealthLogTypeDisplay,
  bloodPressureCategoryLabel,
  heartRateCategoryLabel,
} from '../models/HealthLog';
import { Note } from '../models/Note';
import { Task, isTaskCompleted } from '../models/task';

function iconForHealthLogType(type: HealthLogType): string {
  switch (type) {
    case HealthLogType.mood:
      return 'sentiment-satisfied';
    case HealthLogType.symptoms:
      return 'monitor-heart';
    case HealthLogType.meals:
      return 'restaurant';
    case HealthLogType.water:
      return 'water-drop';
    case HealthLogType.exercise:
      return 'favorite';
    case HealthLogType.sleep:
      return 'bedtime';
    case HealthLogType.general:
      return 'description';
    case HealthLogType.bloodPressure:
      return 'local-hospital';
    case HealthLogType.heartRate:
      return 'speed';
  }
}

function eventFromHealthLog(log: HealthLog, typeColors: (t: HealthLogType) => { bg: string; fg: string }): TimelineEvent {
  const { bg, fg } = typeColors(log.type);
  let subtitle = log.description;
  let statusLabel: string | null = null;
  if (log.type === HealthLogType.bloodPressure && log.systolic != null && log.diastolic != null) {
    statusLabel = bloodPressureCategoryLabel(log.systolic, log.diastolic);
    subtitle = `${log.description} – ${statusLabel}`;
  } else if (log.type === HealthLogType.heartRate && log.heartRateBpm != null) {
    statusLabel = heartRateCategoryLabel(log.heartRateBpm);
    subtitle = `${log.description} – ${statusLabel}`;
  }
  if (log.note != null && log.note !== '') {
    subtitle = `${subtitle}\n${log.note}`;
  }
  return {
    id: `health-${log.id}`,
    source: TimelineEventSource.healthLog,
    timestamp: log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt),
    title: formatHealthLogTypeDisplay(log.type),
    subtitle,
    statusLabel,
    icon: iconForHealthLogType(log.type),
    iconBackground: bg,
    iconColor: fg,
  };
}

function eventFromNote(note: Note, categoryColors: (c: import('../models/Note').NoteCategory) => { bg: string; fg: string }): TimelineEvent {
  const { bg, fg } = categoryColors(note.category);
  const createdAt = note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt);
  return {
    id: `note-${note.id}`,
    source: TimelineEventSource.note,
    timestamp: createdAt,
    title: 'Note Added',
    subtitle: note.body,
    icon: 'description',
    iconBackground: bg,
    iconColor: fg,
  };
}

function eventFromTask(task: Task): TimelineEvent {
  const completedAt = task.completedAt!;
  const ts = completedAt instanceof Date ? completedAt : new Date(completedAt);
  return {
    id: `task-${task.id}`,
    source: TimelineEventSource.task,
    timestamp: ts,
    title: 'Task Completed',
    subtitle: task.title,
    icon: task.icon,
    iconBackground: task.iconBackground,
    iconColor: task.iconColor,
  };
}

/** Returns all timeline events from health logs, notes, and completed tasks, sorted newest first. */
export function useHealthTimelineEvents(): TimelineEvent[] {
  const healthLogProvider = useHealthLogProvider();
  const noteProvider = useNoteProvider();
  const taskProvider = useTaskProvider();

  return useMemo(() => {
    const list: TimelineEvent[] = [];
    healthLogProvider.logs.forEach((log) => list.push(eventFromHealthLog(log, healthLogProvider.typeColors)));
    noteProvider.notes.forEach((note) => list.push(eventFromNote(note, noteProvider.categoryColors)));
    taskProvider.tasks.forEach((task) => {
      if (isTaskCompleted(task) && task.completedAt != null) {
        list.push(eventFromTask(task));
      }
    });
    list.sort((a, b) => {
      const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
      const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
      return tb - ta;
    });
    return list;
  }, [
    healthLogProvider.logs,
    healthLogProvider.typeColors,
    noteProvider.notes,
    noteProvider.categoryColors,
    taskProvider.tasks,
  ]);
}
