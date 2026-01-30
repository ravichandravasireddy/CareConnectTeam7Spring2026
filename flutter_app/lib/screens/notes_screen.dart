import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/note.dart';
import '../providers/note_provider.dart';
import 'notes_add_screen.dart';
import 'notes_detail_screen.dart';

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
    // return DateFormat('MMM d, j').format(createdAt);
    return DateFormat('MMM d, h:mm a').format(createdAt);
  } else {
    return '${DateFormat.yMMMd('en_US').format(createdAt)}, ${DateFormat.jm().format(createdAt)}';
  }
}

class NotesScreen extends StatelessWidget {
  const NotesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final noteProvider = context.watch<NoteProvider>();
    final notes = noteProvider.notes;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Notes',
          style: TextStyle(
            color: colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Semantics(
                label: 'Add New Note, button',
                button: true,
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
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: colorScheme.onPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      minimumSize: const Size(0, 48),
                    ),
                    icon: const Icon(Icons.add, size: 22),
                    label: const Text('Add New Note'),
                  ),
                ),
              ),
            ),
            Expanded(
              child: notes.isEmpty
                  ? Center(
                      child: Text(
                        'No notes yet. Tap Add New Note to create one.',
                        style: TextStyle(
                          fontSize: 16,
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    )
                  : ListView.builder(
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
          ],
        ),
      ),
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
    final colorScheme = Theme.of(context).colorScheme;
    final (chipBg, chipFg) = NoteProvider.categoryColors(note.category);
    final preview =
        note.body.length > 60 ? '${note.body.substring(0, 60)}…' : note.body;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Semantics(
        label: '${note.title}, $preview, by ${note.author}, $timeLabel',
        hint: 'Tap to open note',
        button: true,
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
                  color: colorScheme.outline.withOpacity(0.5),
                  width: 1,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
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
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                  color: colorScheme.onSurface,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            Text(
                              timeLabel,
                              style: TextStyle(
                                fontSize: 12,
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          note.author,
                          style: TextStyle(
                            fontSize: 12,
                            color: colorScheme.onSurfaceVariant,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          preview,
                          style: TextStyle(
                            fontSize: 14,
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
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: chipFg,
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
