// REMOVE BEFORE SUBMISSION
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'calendar_screen.dart';
import 'create_account_screen.dart';
import 'health_logs_screen.dart';
import 'health_timeline_screen.dart';
import 'notes_screen.dart';
import 'notes_detail_screen.dart';
import 'notification_screen.dart';
import 'role_selection_screen.dart';
import 'video_call_screen.dart';
import 'welcome_screen.dart';
import '../providers/note_provider.dart';

// Temporary welcome screen with buttons that lead to all other screens for testing.

class TemporaryScreen extends StatelessWidget {
  const TemporaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Testing Hub',
          style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
        ),
        backgroundColor: colorScheme.surface,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Tap a button to open the screen for testing.',
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            _NavButton(
              label: 'Welcome',
              onPressed: () => _push(context, const WelcomeScreen()),
            ),
            _NavButton(
              label: 'Role Selection',
              onPressed: () => _push(context, const RoleSelectionScreen()),
            ),
            _NavButton(
              label: 'Create Account',
              onPressed: () => _push(context, const CreateAccountScreen()),
            ),
            _NavButton(
              label: 'Calendar',
              onPressed: () => _push(context, const CalendarScreen()),
            ),
            _NavButton(
              label: 'Health Logs',
              onPressed: () => _push(context, const HealthLogsScreen()),
            ),
            _NavButton(
              label: 'Health Timeline',
              onPressed: () => _push(context, const HealthTimelineScreen()),
            ),
            _NavButton(
              label: 'Notes',
              onPressed: () => _push(context, const NotesScreen()),
            ),
            _NavButton(
              label: 'Note Detail (first or "test")',
              onPressed: () {
                final notes = context.read<NoteProvider>().notes;
                final id = notes.isNotEmpty ? notes.first.id : 'test';
                _push(context, NoteDetailScreen(noteId: id));
              },
            ),
            _NavButton(
              label: 'Notifications',
              onPressed: () => _push(context, const NotificationScreen()),
            ),
            _NavButton(
              label: 'Video Call',
              onPressed: () => _push(context, const VideoCallScreen()),
            ),
          ],
        ),
      ),
    );
  }

  void _push(BuildContext context, Widget screen) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => screen),
    );
  }
}

class _NavButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;

  const _NavButton({required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: SizedBox(
        width: double.infinity,
        child: FilledButton(
          onPressed: onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
            padding: const EdgeInsets.symmetric(vertical: 16),
            minimumSize: const Size(0, 48),
          ),
          child: Text(
            label,
            style: textTheme.labelLarge?.copyWith(color: colorScheme.onPrimary),
          ),
        ),
      ),
    );
  }
}
