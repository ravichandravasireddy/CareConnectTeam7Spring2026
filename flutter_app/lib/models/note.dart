// =============================================================================
// NOTE MODEL
// =============================================================================
// Domain model for caregiver/patient notes. Used by [NoteProvider], [NotesScreen],
// and [HealthTimelineProvider]. Add new [NoteCategory] values as needed; update
// [formatNoteCategoryDisplay] and [NoteProvider.categoryColors] if adding.
// =============================================================================

/// Category of note; used for filtering and chip/icon styling.
enum NoteCategory {
  medication,
  exercise,
  appointment,
  // TODO: Add more categories (e.g. diet, vitals)
}

/// Display label for category (formatting only; add new enum values without relisting here).
String formatNoteCategoryDisplay(NoteCategory c) =>
    c.name[0].toUpperCase() + c.name.substring(1);

/// Note model: title, body, author, createdAt, category.
///
/// Immutable; use [copyWith] for updates. [createdAt] drives sort order in
/// list and timeline.
class Note {
  final String id;
  final String title;
  final String body;
  final String author;
  final DateTime createdAt;
  final NoteCategory category;

  Note({
    required this.id,
    required this.title,
    required this.body,
    required this.author,
    required this.createdAt,
    required this.category,
  });

  Note copyWith({
    String? id,
    String? title,
    String? body,
    String? author,
    DateTime? createdAt,
    NoteCategory? category,
  }) {
    return Note(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      author: author ?? this.author,
      createdAt: createdAt ?? this.createdAt,
      category: category ?? this.category,
    );
  }
}
