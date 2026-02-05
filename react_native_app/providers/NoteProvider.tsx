// =============================================================================
// NOTE PROVIDER
// =============================================================================
// Holds all Note entries; used by Notes screen and HealthTimelineProvider.
// Notes are sorted by createdAt descending.
// =============================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Note, NoteCategory } from '../models/Note';
import { AppColors } from '../constants/theme';

interface NoteContextType {
  notes: Note[];
  getById: (id: string) => Note | undefined;
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  clearNotes: () => void;
  categoryColors: (category: NoteCategory) => { bg: string; fg: string };
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNoteProvider = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteProvider must be used within NoteProvider');
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    // Initialize with mock notes
    const now = new Date();
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Medication Side Effects',
        body:
          'Felt slight dizziness about 30 minutes after taking Lisinopril. Subsided after drinking water and resting for 15 minutes.',
        author: 'Robert Williams (Patient)',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30),
        category: NoteCategory.medication,
      },
      {
        id: '2',
        title: 'Exercise Progress',
        body:
          'Completed 20-minute walk around the neighborhood with Robert. Patient reported feeling "great." Heart rate averaged 85 bpm.',
        author: 'Sarah Johnson (Caregiver)',
        createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 17, 15),
        category: NoteCategory.exercise,
      },
      {
        id: '3',
        title: "Doctor's Appointment",
        body:
          "Dr. Johnson reviewed my test results. Blood pressure is improving. Continue current medication regimen.",
        author: 'Robert Williams (Patient)',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 22, 15, 30),
        category: NoteCategory.appointment,
      },
    ];
    // Sort by createdAt descending (newest first)
    return mockNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  });

  const getById = useCallback((id: string): Note | undefined => {
    return notes.find((n) => n.id === id);
  }, [notes]);

  const addNote = useCallback((note: Note) => {
    setNotes((prev) => {
      const updated = [note, ...prev];
      return updated.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });
  }, []);

  const updateNote = useCallback((note: Note) => {
    setNotes((prev) => {
      const updated = prev.map((n) => (n.id === note.id ? note : n));
      return updated.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotes = useCallback(() => {
    setNotes([]);
  }, []);

  const categoryColors = useCallback((category: NoteCategory): { bg: string; fg: string } => {
    switch (category) {
      case NoteCategory.medication:
        return { bg: AppColors.primary100, fg: AppColors.primary600 };
      case NoteCategory.exercise:
        return { bg: AppColors.secondary100, fg: AppColors.secondary700 };
      case NoteCategory.appointment:
        return { bg: AppColors.info100, fg: AppColors.info700 };
    }
  }, []);

  const value: NoteContextType = {
    notes,
    getById,
    addNote,
    updateNote,
    deleteNote,
    clearNotes,
    categoryColors,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};
