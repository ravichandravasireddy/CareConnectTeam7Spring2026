// =============================================================================
// NOTE MODEL
// =============================================================================
// Domain model for caregiver/patient notes. Used by NoteProvider, NotesScreen,
// and HealthTimelineProvider. Add new NoteCategory values as needed.
// =============================================================================

export enum NoteCategory {
  medication = 'medication',
  exercise = 'exercise',
  appointment = 'appointment',
  // TODO: Add more categories (e.g. diet, vitals)
}

/// Display label for category (formatting only)
export const formatNoteCategoryDisplay = (category: NoteCategory): string => {
  const name = category;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export interface Note {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: Date;
  category: NoteCategory;
}
