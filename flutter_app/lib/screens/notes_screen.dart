import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/note.dart';
import '../providers/auth_provider.dart';
import '../providers/note_provider.dart';
import '../widgets/app_bottom_nav_bar.dart';
import 'notes_add_screen.dart';
import 'notes_detail_screen.dart';

// =============================================================================
// NOTES SCREEN - ACCESSIBLE VERSION
// =============================================================================
// WCAG 2.1 Level AA compliant notes list with screen reader support
// =============================================================================

/// Formats [createdAt]: "Today, 10:30 AM", "Yesterday, 5:15 PM", or "Jan 22, 3:30 PM".
String formatNoteTime(DateTime createdAt) {
  final now = DateTime.now();
  final todayStart = DateTime(now.year, now.month, now.day);
  final yesterdayStart = todayStart.subtract(const Duration(days: 1));
  final date = DateTime(createdAt.year, createdAt.month, createdAt.day);
  final year = createdAt.year;

  if (date == todayStart) {
    return 'Today, ${DateFormat.jm().format(createdAt)}';
  } else if (date == yesterdayStart) {
    return 'Yesterday, ${DateFormat.jm().format(createdAt)}';
  } else if (year == now.year) {
    return DateFormat('MMM d, h:mm a').format(createdAt);
  } else {
    return '${DateFormat.yMMMd('en_US').format(createdAt)}, ${DateFormat.jm().format(createdAt)}';
  }
}

class NotesScreen extends StatelessWidget {
  const NotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final noteProvider = context.watch<NoteProvider>();
    final notes = noteProvider.notes;
    final isPatient = context.read<AuthProvider>().userRole == UserRole.patient;
    final navIndex = isPatient ? kPatientNavHealth : kCaregiverNavTasks;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Semantics(
          header: true,
          label: notes.isEmpty ? 'Notes' : 'Notes, ${notes.length} note${notes.length == 1 ? '' : 's'}',
          child: Text(
            'Notes',
            style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
          ),
        ),
        leading: Semantics(
          button: true,
          label: 'Go back',
          hint: 'Double tap to go back to dashboard',
          excludeSemantics: true,
          child: IconButton(
            icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
            onPressed: () => Navigator.pop(context),
            tooltip: 'Go back',
          ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Semantics(
                label: 'Add New Note',
                hint: 'Double tap to create a new note',
                button: true,
                excludeSemantics: true,
                child: SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () async {
                      final result = await Navigator.push<Note>(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const AddNoteScreen(),
                        ),
                      );
                      if (result != null && context.mounted) {
                        context.read<NoteProvider>().addNote(result);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Note "${result.title}" added'),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: colorScheme.onPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      minimumSize: const Size(0, 56),
                    ),
                    icon: const Icon(Icons.add, size: 22),
                    label: const Text('Add New Note'),
                  ),
                ),
              ),
            ),
            Expanded(
              child: notes.isEmpty
                  ? Semantics(
                      label: 'No notes yet. Tap Add New Note to create one.',
                      readOnly: true,
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.note_add,
                                size: 64,
                                color: colorScheme.onSurfaceVariant,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No notes yet',
                                style: textTheme.titleLarge?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Tap Add New Note to create one.',
                                textAlign: TextAlign.center,
                                style: textTheme.bodyMedium?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    )
                  : Semantics(
                      label: 'Notes list, ${notes.length} note${notes.length == 1 ? '' : 's'}',
                      container: true,
                      child: ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                        itemCount: notes.length,
                        itemBuilder: (context, index) {
                          final note = notes[index];
                          return _NoteListTile(
                            note: note,
                            timeLabel: formatNoteTime(note.createdAt),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => NoteDetailScreen(
                                    noteId: note.id,
                                  ),
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: AppBottomNavBar(currentIndex: navIndex),
    );
  }
}

/// Compact note tile: small height, tap opens detail screen.
class _NoteListTile extends StatelessWidget {
  final Note note;
  final String timeLabel;
  final VoidCallback onTap;

  const _NoteListTile({
    required this.note,
    required this.timeLabel,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final (chipBg, chipFg) = NoteProvider.categoryColors(note.category);
    final preview =
        note.body.length > 60 ? '${note.body.substring(0, 60)}…' : note.body;
    
    // Create semantic label with category, title, preview, author, and time
    final categoryLabel = formatNoteCategoryDisplay(note.category);
    final semanticsLabel = '$categoryLabel: ${note.title}, $preview, by ${note.author}, $timeLabel';

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Semantics(
        label: semanticsLabel,
        hint: 'Double tap to open note',
        button: true,
        excludeSemantics: true,
        child: Material(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              constraints: const BoxConstraints(minHeight: 48),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colorScheme.outline.withValues(alpha: 0.5),
                  width: 1,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Semantics(
                    label: '$categoryLabel icon',
                    image: true,
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: chipBg,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.description,
                        color: chipFg,
                        size: 22,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Text(
                                note.title,
                                style: textTheme.titleMedium?.copyWith(
                                  color: colorScheme.onSurface,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Text(
                              timeLabel,
                              style: textTheme.bodySmall?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          note.author,
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          preview,
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: chipBg,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            formatNoteCategoryDisplay(note.category).toUpperCase(),
                            style: textTheme.labelSmall?.copyWith(
                              color: chipFg,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}