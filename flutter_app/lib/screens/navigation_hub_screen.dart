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
// NAVIGATION HUB (DEV) - ACCESSIBLE VERSION
// =============================================================================
// WCAG 2.1 Level AA compliant screen navigation for development
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
        title: Semantics(
          header: true,
          label: 'Navigation Hub',
          child: Text(
            'Navigation Hub',
            style: textTheme.headlineLarge?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: Semantics(
          label: 'Screen navigation list',
          container: true,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Semantics(
                label: 'Tap a button to open a screen.',
                readOnly: true,
                child: Text(
                  'Tap a button to open a screen.',
                  style: textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              _SectionLabel('Auth & onboarding'),
              _NavButton(
                label: 'Welcome',
                semanticHint: 'Double tap to open Welcome screen',
                onPressed: () => _push(context, const WelcomeScreen()),
              ),
              _NavButton(
                label: 'Role Selection',
                semanticHint: 'Double tap to open Role Selection screen',
                onPressed: () => _push(context, const RoleSelectionScreen()),
              ),
              _NavButton(
                label: 'Registration',
                semanticHint: 'Double tap to open Registration screen',
                onPressed: () => _push(context, const RegistrationScreen()),
              ),
              _NavButton(
                label: 'Sign In',
                semanticHint: 'Double tap to open Sign In screen',
                onPressed: () => _push(context, const SignInScreen()),
              ),
              
              _SectionLabel('Patient'),
              _NavButton(
                label: 'Patient Dashboard',
                semanticHint: 'Double tap to open Patient Dashboard screen',
                onPressed: () => _push(context, const PatientDashboardScreen()),
              ),
              _NavButton(
                label: 'Patient Profile',
                semanticHint: 'Double tap to open Patient Profile screen',
                onPressed: () => _push(context, const PatientProfileScreen()),
              ),
              _NavButton(
                label: 'Preferences & Accessibility',
                semanticHint: 'Double tap to open Preferences and Accessibility screen',
                onPressed: () =>
                    _push(context, const PreferencesAccessibilityScreen()),
              ),
              _NavButton(
                label: 'Messaging Thread',
                semanticHint: 'Double tap to open Messaging Thread screen',
                onPressed: () => _push(context, const MessagingThreadScreen()),
              ),
              _NavButton(
                label: 'Calendar',
                semanticHint: 'Double tap to open Calendar screen',
                onPressed: () => _push(context, const CalendarScreen()),
              ),
              _NavButton(
                label: 'Notifications',
                semanticHint: 'Double tap to open Notifications screen',
                onPressed: () => _push(context, const NotificationScreen()),
              ),
              _NavButton(
                label: 'Notes',
                semanticHint: 'Double tap to open Notes screen',
                onPressed: () => _push(context, const NotesScreen()),
              ),
              _NavButton(
                label: 'Add Note',
                semanticHint: 'Double tap to open Add Note screen',
                onPressed: () => _push(context, const AddNoteScreen()),
              ),
              _NavButton(
                label: 'Note Detail (sample)',
                semanticHint: 'Double tap to open Note Detail sample screen',
                onPressed: () => _push(context, const NoteDetailScreen(noteId: 'demo-note')),
              ),
              _NavButton(
                label: 'Health Logs',
                semanticHint: 'Double tap to open Health Logs screen',
                onPressed: () => _push(context, const HealthLogsScreen()),
              ),
              _NavButton(
                label: 'Add Health Log',
                semanticHint: 'Double tap to open Add Health Log screen',
                onPressed: () => _push(
                  context,
                  const HealthLogAddScreen(initialType: HealthLogType.general),
                ),
              ),
              _NavButton(
                label: 'Health Timeline',
                semanticHint: 'Double tap to open Health Timeline screen',
                onPressed: () => _push(context, const HealthTimelineScreen()),
              ),
              
              _SectionLabel('Caregiver'),
              _NavButton(
                label: 'Caregiver Dashboard',
                semanticHint: 'Double tap to open Caregiver Dashboard screen',
                onPressed: () => _push(context, const CaregiverDashboardScreen()),
              ),
              _NavButton(
                label: 'Caregiver: Patient Monitoring',
                semanticHint: 'Double tap to open Caregiver Patient Monitoring screen',
                onPressed: () =>
                    _push(context, const CaregiverPatientMonitoringScreen()),
              ),
              _NavButton(
                label: 'Caregiver: Task Management',
                semanticHint: 'Double tap to open Caregiver Task Management screen',
                onPressed: () =>
                    _push(context, const CaregiverTaskManagementScreen()),
              ),
              _NavButton(
                label: 'Caregiver: Analytics',
                semanticHint: 'Double tap to open Caregiver Analytics screen',
                onPressed: () => _push(context, const CaregiverAnalyticsScreen()),
              ),
              
              _SectionLabel('Shared & other'),
              _NavButton(
                label: 'Emergency SOS Alert',
                semanticHint: 'Double tap to open Emergency SOS Alert screen',
                onPressed: () => _push(context, const EmergencySOSAlertScreen()),
              ),
              _NavButton(
                label: 'Video Call',
                semanticHint: 'Double tap to open Video Call screen',
                onPressed: () => _push(context, const VideoCallScreen()),
              ),
              _NavButton(
                label: 'Task Details (sample)',
                semanticHint: 'Double tap to open Task Details sample screen',
                onPressed: () => _push(context, TaskDetailsScreen(task: _demoTask)),
              ),
            ],
          ),
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
    return Semantics(
      header: true,
      label: label,
      child: Padding(
        padding: const EdgeInsets.only(top: 8, bottom: 4),
        child: Text(
          label,
          style: textTheme.titleSmall?.copyWith(
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}

class _NavButton extends StatelessWidget {
  final String label;
  final String semanticHint;
  final VoidCallback onPressed;

  const _NavButton({
    required this.label,
    required this.semanticHint,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Semantics(
        button: true,
        label: label,
        hint: semanticHint,
        excludeSemantics: true,
        child: SizedBox(
          width: double.infinity,
          child: FilledButton(
            onPressed: onPressed,
            style: FilledButton.styleFrom(
              backgroundColor: colorScheme.primary,
              foregroundColor: colorScheme.onPrimary,
              padding: const EdgeInsets.symmetric(vertical: 16),
              minimumSize: const Size(0, 56),
            ),
            child: Text(
              label,
              style: textTheme.labelLarge?.copyWith(color: colorScheme.onPrimary),
            ),
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