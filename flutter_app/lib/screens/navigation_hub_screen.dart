import 'package:flutter/material.dart';
import '../models/health_log.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import 'calendar_screen.dart';
import 'caregiver_analytics_screen.dart';
import 'caregiver_dashboard.dart';
import 'caregiver_patient_monitoring_screen.dart';
import 'caregiver_task_management_screen.dart';
import 'emergency_sos_alert.dart';
import 'health_log_add_screen.dart';
import 'health_logs_screen.dart';
import 'health_timeline_screen.dart';
import 'messaging_thread_screen.dart';
import 'notes_add_screen.dart';
import 'notes_detail_screen.dart';
import 'notes_screen.dart';
import 'notification_screen.dart';
import 'patient_dashboard_screen.dart';
import 'patient_profile_screen.dart';
import 'preferences_accessibility_screen.dart';
import 'registration_screen.dart';
import 'role_selection_screen.dart';
import 'signin_screen.dart';
import 'task_details_screen.dart';
import 'video_call_screen.dart';
import 'welcome_screen.dart';

// =============================================================================
// NAVIGATION HUB (DEV)
// =============================================================================
// Simple list of buttons to reach all screens while flows are in progress.
// =============================================================================

class NavigationHubScreen extends StatelessWidget {
  const NavigationHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Navigation Hub',
          style: textTheme.headlineLarge?.copyWith(
            color: colorScheme.onSurface,
          ),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Tap a button to open a screen.',
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            _SectionLabel('Auth & onboarding'),
            _NavButton(
              label: 'Welcome',
              onPressed: () => _push(context, const WelcomeScreen()),
            ),
            _NavButton(
              label: 'Role Selection',
              onPressed: () => _push(context, const RoleSelectionScreen()),
            ),
            _NavButton(
              label: 'Registration',
              onPressed: () => _push(context, const RegistrationScreen()),
            ),
            _NavButton(
              label: 'Sign In',
              onPressed: () => _push(context, const SignInScreen()),
            ),
            _SectionLabel('Patient'),
            _NavButton(
              label: 'Patient Dashboard',
              onPressed: () => _push(context, const PatientDashboardScreen()),
            ),
            _NavButton(
              label: 'Patient Profile',
              onPressed: () => _push(context, const PatientProfileScreen()),
            ),
            _NavButton(
              label: 'Preferences & Accessibility',
              onPressed: () =>
                  _push(context, const PreferencesAccessibilityScreen()),
            ),
            _NavButton(
              label: 'Messaging Thread',
              onPressed: () => _push(context, const MessagingThreadScreen()),
            ),
            _NavButton(
              label: 'Calendar',
              onPressed: () => _push(context, const CalendarScreen()),
            ),
            _NavButton(
              label: 'Notifications',
              onPressed: () => _push(context, const NotificationScreen()),
            ),
            _NavButton(
              label: 'Notes',
              onPressed: () => _push(context, const NotesScreen()),
            ),
            _NavButton(
              label: 'Add Note',
              onPressed: () => _push(context, const AddNoteScreen()),
            ),
            _NavButton(
              label: 'Note Detail (sample)',
              onPressed: () => _push(context, const NoteDetailScreen(noteId: 'demo-note')),
            ),
            _NavButton(
              label: 'Health Logs',
              onPressed: () => _push(context, const HealthLogsScreen()),
            ),
            _NavButton(
              label: 'Add Health Log',
              onPressed: () => _push(
                context,
                const HealthLogAddScreen(initialType: HealthLogType.general),
              ),
            ),
            _NavButton(
              label: 'Health Timeline',
              onPressed: () => _push(context, const HealthTimelineScreen()),
            ),
            _SectionLabel('Caregiver'),
            _NavButton(
              label: 'Caregiver Dashboard',
              onPressed: () => _push(context, const CaregiverDashboardScreen()),
            ),
            _NavButton(
              label: 'Caregiver: Patient Monitoring',
              onPressed: () =>
                  _push(context, const CaregiverPatientMonitoringScreen()),
            ),
            _NavButton(
              label: 'Caregiver: Task Management',
              onPressed: () =>
                  _push(context, const CaregiverTaskManagementScreen()),
            ),
            _NavButton(
              label: 'Caregiver: Analytics',
              onPressed: () => _push(context, const CaregiverAnalyticsScreen()),
            ),
            _SectionLabel('Shared & other'),
            _NavButton(
              label: 'Emergency SOS Alert',
              onPressed: () => _push(context, const EmergencySOSAlertScreen()),
            ),
            _NavButton(
              label: 'Video Call',
              onPressed: () => _push(context, const VideoCallScreen()),
            ),
            _NavButton(
              label: 'Task Details (sample)',
              onPressed: () => _push(context, TaskDetailsScreen(task: _demoTask)),
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

class _SectionLabel extends StatelessWidget {
  final String label;

  const _SectionLabel(this.label);

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 4),
      child: Text(
        label,
        style: textTheme.titleSmall?.copyWith(
          color: Theme.of(context).colorScheme.primary,
          fontWeight: FontWeight.w600,
        ),
      ),
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

final Task _demoTask = Task(
  id: 'task-demo',
  title: 'Medication check',
  description: 'Confirm morning medication taken with water.',
  date: DateTime.now().add(const Duration(hours: 2)),
  patientName: 'Robert Williams',
  icon: Icons.medication,
  iconBackground: AppColors.primary100,
  iconColor: AppColors.primary700,
);
