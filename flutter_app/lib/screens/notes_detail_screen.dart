import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/note.dart';
import '../providers/note_provider.dart';

// =============================================================================
// NOTE DETAIL SCREEN - ACCESSIBLE VERSION
// =============================================================================
// WCAG 2.1 Level AA compliant full note view with screen reader support
// =============================================================================

/// Full note view (read-only).
class NoteDetailScreen extends StatelessWidget {
  final String noteId;

  const NoteDetailScreen({super.key, required this.noteId});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final note = context.watch<NoteProvider>().getById(noteId);

    if (note == null) {
      return Scaffold(
        appBar: AppBar(
          backgroundColor: colorScheme.surface,
          leading: Semantics(
            button: true,
            label: 'Go back',
            hint: 'Double tap to go back to notes list',
            excludeSemantics: true,
            child: IconButton(
              icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
              onPressed: () => Navigator.pop(context),
              tooltip: 'Go back',
            ),
          ),
        ),
        body: Semantics(
          label: 'Note not found',
          liveRegion: true,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.error_outline,
                  size: 64,
                  color: colorScheme.onSurfaceVariant,
                ),
                const SizedBox(height: 16),
                Text(
                  'Note not found',
                  style: textTheme.titleLarge?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final (chipBg, chipFg) = NoteProvider.categoryColors(note.category);
    final timeLabel = DateFormat('MMM d, y • jm').format(note.createdAt);
    final categoryLabel = formatNoteCategoryDisplay(note.category);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        title: Semantics(
          header: true,
          label: note.title,
          child: Text(
            note.title,
            style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
          ),
        ),
        leading: Semantics(
          button: true,
          label: 'Go back',
          hint: 'Double tap to go back to notes list',
          excludeSemantics: true,
          child: IconButton(
            icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
            onPressed: () => Navigator.pop(context),
            tooltip: 'Go back',
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Semantics(
            label: 'Note details',
            container: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Author and timestamp section
                Semantics(
                  label: 'Note information',
                  container: true,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Semantics(
                        label: '$categoryLabel icon',
                        image: true,
                        child: Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: chipBg,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(Icons.description, color: chipFg, size: 26),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Semantics(
                          label: 'Written by ${note.author}, $timeLabel',
                          readOnly: true,
                          child: ExcludeSemantics(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  note.author,
                                  style: textTheme.bodySmall?.copyWith(
                                    color: colorScheme.onSurfaceVariant,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  timeLabel,
                                  style: textTheme.bodySmall?.copyWith(
                                    color: colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                
                // Category badge
                Semantics(
                  label: 'Category: $categoryLabel',
                  readOnly: true,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: chipBg,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: ExcludeSemantics(
                      child: Text(
                        categoryLabel.toUpperCase(),
                        style: textTheme.labelSmall?.copyWith(
                          color: chipFg,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                
                // Note body
                Semantics(
                  label: 'Note content: ${note.body}',
                  readOnly: true,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: colorScheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: colorScheme.outline.withValues(alpha: 0.5),
                        width: 1,
                      ),
                    ),
                    child: ExcludeSemantics(
                      child: SelectableText(
                        note.body,
                        style: textTheme.bodyLarge?.copyWith(
                          height: 1.5,
                          color: colorScheme.onSurface,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}