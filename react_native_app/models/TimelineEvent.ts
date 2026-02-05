// =============================================================================
// TIMELINE EVENT MODEL
// =============================================================================
// Unified event DTO for the Health Timeline screen. Built from health logs,
// notes, and completed tasks. Add new TimelineEventSource values when
// aggregating more data types.
// =============================================================================

export enum TimelineEventSource {
  healthLog = 'healthLog',
  note = 'note',
  task = 'task',
}

export interface TimelineEvent {
  id: string;
  source: TimelineEventSource;
  timestamp: Date;
  title: string;
  subtitle?: string | null;
  statusLabel?: string | null;
  icon: string; // MaterialIcons name
  iconBackground: string;
  iconColor: string;
}
