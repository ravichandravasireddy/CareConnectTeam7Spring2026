import 'package:flutter/material.dart';
import '../models/note.dart';
import '../theme/app_colors.dart';

/// Provider for managing notes app-wide.
class NoteProvider with ChangeNotifier {
  final List<Note> _notes = [];

  List<Note> get notes => List.unmodifiable(_notes);

  NoteProvider() {
    _initializeMockNotes();
  }

  void _initializeMockNotes() {
    final now = DateTime.now();
    _notes.addAll([
      Note(
        id: '1',
        title: 'Medication Side Effects',
        body:
            'Felt slight dizziness about 30 minutes after taking Lisinopril. Subsided after drinking water and resting for 15 minutes.',
        author: 'Robert Williams (Patient)',
        createdAt: DateTime(now.year, now.month, now.day, 10, 30),
        category: NoteCategory.medication,
      ),
      Note(
        id: '2',
        title: 'Exercise Progress',
        body:
            'Completed 20-minute walk around the neighborhood with Robert. Patient reported feeling "great." Heart rate averaged 85 bpm.',
        author: 'Sarah Johnson (Caregiver)',
        createdAt: DateTime(now.year, now.month, now.day - 1, 17, 15),
        category: NoteCategory.exercise,
      ),
      Note(
        id: '3',
        title: "Doctor's Appointment",
        body:
            "Dr. Johnson reviewed my test results. Blood pressure is improving. Continue current medication regimen.",
        author: 'Robert Williams (Patient)',
        createdAt: DateTime(now.year, now.month, 22, 15, 30),
        category: NoteCategory.appointment,
      ),
    ]);
    _notes.sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  Note? getById(String id) {
    try {
      return _notes.firstWhere((n) => n.id == id);
    } catch (_) {
      return null;
    }
  }

  void addNote(Note note) {
    _notes.insert(0, note);
    notifyListeners();
  }

  void updateNote(Note note) {
    final i = _notes.indexWhere((n) => n.id == note.id);
    if (i >= 0) {
      _notes[i] = note;
      _notes.sort((a, b) => b.createdAt.compareTo(a.createdAt));
      notifyListeners();
    }
  }

  void deleteNote(String id) {
    _notes.removeWhere((n) => n.id == id);
    notifyListeners();
  }

  /// Colors for note category chip/icon (theme-aware via context optional; here using AppColors).
  static (Color bg, Color fg) categoryColors(NoteCategory category) {
    switch (category) {
      case NoteCategory.medication:
        return (AppColors.primary100, AppColors.primary600);
      case NoteCategory.exercise:
        return (AppColors.secondary100, AppColors.secondary700);
      case NoteCategory.appointment:
        return (AppColors.info100, AppColors.info700);
    }
  }
}
