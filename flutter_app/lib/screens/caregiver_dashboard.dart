import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../models/patient.dart';
import '../models/task.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../widgets/app_drawer.dart';
import 'caregiver_patient_monitoring_screen.dart';
import 'caregiver_task_management_screen.dart';
// import 'caregiver_analytics_screen.dart';
import 'emergency_sos_alert.dart';
import 'task_details_screen.dart';

// =============================================================================
// CAREGIVER DASHBOARD SCREEN
// =============================================================================
// Dashboard showing urgent and critical alerts (design sample).
// =============================================================================

class CaregiverDashboardScreen extends StatelessWidget {
  const CaregiverDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final todayTasks = _tasksForDate(today);
    final completedCount = todayTasks.where((t) => t.isCompleted).length;
    final totalCount = todayTasks.length;

    final userName = context.read<AuthProvider>().userName ?? 'Caregiver';

    return Scaffold(
      backgroundColor: colorScheme.surfaceContainerHighest,
      appBar: AppAppBar(
        title: 'Dashboard',
        showNotificationBadge: true,
        onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
        actions: [
          Semantics(
            label: 'Settings',
            button: true,
            child: IconButton(
              icon: Icon(Icons.settings_outlined, color: colorScheme.onSurface),
              onPressed: () => Navigator.pushNamed(context, '/preferences'),
              style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
            ),
          ),
        ],
      ),
      drawer: const AppDrawer(isPatient: false),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome card (matching patient dashboard structure)
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      colorScheme.primary,
                      colorScheme.primary.withValues(alpha: 0.7),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$_greetingText, ${userName.split(' ').first}!',
                      style: textTheme.headlineSmall?.copyWith(
                        color: colorScheme.onPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Here's your care overview for today",
                      style: textTheme.bodyLarge?.copyWith(
                        color: colorScheme.onPrimary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              _buildQuickStats(
                context,
                colorScheme: colorScheme,
                textTheme: textTheme,
                onTap: () {},
              ),
              const SizedBox(height: 16),
              Container(
                height: 4,
                color: AppColors.primary600,
              ),
              const SizedBox(height: 24),
              _buildTasksSection(
                context,
                colorScheme: colorScheme,
                textTheme: textTheme,
                tasks: todayTasks,
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kCaregiverNavHome,
        isPatient: false,
      ),
    );
  }

  String get _greetingText {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  Widget _buildQuickStats(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
    required int patientCount,
    required int tasksCompleted,
    required int tasksTotal,
    required int alertCount,
  }) {
    return Semantics(
      label: 'Quick stats: $patientCount patients, $tasksCompleted of $tasksTotal tasks, $alertCount alerts',
      child: Row(
        children: [
          Expanded(
            child: _buildStatCard(
              context,
              title: 'Patients',
              value: '$patientCount',
              icon: Icons.people_outline,
              color: AppColors.info500,
              colorScheme: colorScheme,
              textTheme: textTheme,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildStatCard(
              context,
              title: 'Tasks',
              value: '$tasksCompleted/$tasksTotal',
              icon: Icons.check_circle_outline,
              color: AppColors.success500,
              colorScheme: colorScheme,
              textTheme: textTheme,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildStatCard(
              context,
              title: 'Alerts',
              value: '$alertCount',
              icon: Icons.warning_amber_outlined,
              color: AppColors.error500,
              colorScheme: colorScheme,
              textTheme: textTheme,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: colorScheme.shadow.withValues(alpha: 0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            value,
            style: textTheme.headlineMedium?.copyWith(
              color: colorScheme.onSurface,
              fontWeight: FontWeight.w700,
            ),
          ),
          Text(
            title,
            style: textTheme.labelSmall?.copyWith(
              fontWeight: FontWeight.w400,
              color: colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyBanner(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return Semantics(
      label: 'Emergency alert: 1 active alert. Tap for details.',
      button: true,
      child: Material(
        color: AppColors.error100,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (_) => const EmergencySOSAlertScreen(),
              ),
            );
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.error500.withValues(alpha: 0.5),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.warning_amber_rounded,
                  color: AppColors.error700,
                  size: 28,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '1 Active Alert',
                        style: textTheme.titleMedium?.copyWith(
                          color: colorScheme.onSurface,
                        ),
                      ),
                      Text(
                        'Tap to view details',
                        style: textTheme.bodySmall?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.chevron_right,
                  color: colorScheme.onSurfaceVariant,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPatientsSection(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return Semantics(
      label: 'Patient list, ${_patients.length} patients',
      header: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'My Patients',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
              Semantics(
                label: 'View all patients',
                button: true,
                child: TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const CaregiverPatientMonitoringScreen(),
                      ),
                    );
                  },
                  child: Text(
                    'View all',
                    style: textTheme.labelMedium?.copyWith(
                      color: colorScheme.primary,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (_patients.isEmpty)
            _buildEmptyCard(
              context,
              message: 'No patients assigned yet',
              colorScheme: colorScheme,
              textTheme: textTheme,
            )
          else
            ..._patients.map(
              (p) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: _PatientCard(
                  patient: p,
                  colorScheme: colorScheme,
                  textTheme: textTheme,
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const CaregiverPatientMonitoringScreen(),
                      ),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTasksSection(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
    required List<Task> tasks,
  }) {
    return Semantics(
      label: 'Upcoming tasks for today, ${tasks.length} tasks',
      header: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Today\'s Tasks',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
              Semantics(
                label: 'Manage tasks',
                button: true,
                child: TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const CaregiverTaskManagementScreen(),
                      ),
                    );
                  },
                  child: Text(
                    'Manage',
                    style: textTheme.labelMedium?.copyWith(
                      color: colorScheme.primary,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (tasks.isEmpty)
            _buildEmptyCard(
              context,
              message: 'No tasks scheduled for today',
              colorScheme: colorScheme,
              textTheme: textTheme,
            )
          else
            ...tasks.take(5).map(
                  (task) => Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _TaskCard(
                      task: task,
                      colorScheme: colorScheme,
                      textTheme: textTheme,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => TaskDetailsScreen(task: task),
                          ),
                        );
                      },
                    ),
                  ),
                ),
        ],
      ),
    );
  }

  Widget _buildEmptyCard(
    BuildContext context, {
    required String message,
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: colorScheme.outline,
          width: 1,
        ),
      ),
      child: Center(
        child: Text(
          message,
          style: textTheme.bodySmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
          ),
        ),
      ),
    );
  }

  List<Task> _tasksForDate(DateTime date) {
    return _tasks
        .where(
          (task) =>
              task.date.year == date.year &&
              task.date.month == date.month &&
              task.date.day == date.day,
        )
        .toList();
  }
}

class _UrgentBanner extends StatelessWidget {
  final ColorScheme colorScheme;
  final TextTheme textTheme;
  final VoidCallback onTap;

  const _UrgentBanner({
    required this.colorScheme,
    required this.textTheme,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.error100,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: AppColors.error500),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '2 URGENT ALERTS',
                      style: textTheme.titleMedium?.copyWith(
                        color: AppColors.error700,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Immediate attention required',
                      style: textTheme.bodyMedium?.copyWith(
                        color: AppColors.error700.withValues(alpha: 0.8),
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: AppColors.error700),
            ],
          ),
        ),
      ),
    );
  }
}

class _AlertCard extends StatelessWidget {
  final String severityLabel;
  final Color severityColor;
  final String timeLabel;
  final String initials;
  final String name;
  final String details;
  final String alertTitle;
  final String alertBody;
  final String? actionLeft;
  final String? actionRight;

  const _AlertCard({
    required this.severityLabel,
    required this.severityColor,
    required this.timeLabel,
    required this.initials,
    required this.name,
    required this.details,
    required this.alertTitle,
    required this.alertBody,
    this.actionLeft,
    this.actionRight,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: severityColor, width: 3),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: severityColor,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Icon(Icons.error_outline, color: AppColors.white, size: 18),
                const SizedBox(width: 8),
                Text(
                  severityLabel,
                  style: textTheme.labelLarge?.copyWith(
                    color: AppColors.white,
                    letterSpacing: 0.4,
                  ),
                ),
                const Spacer(),
                Text(
                  timeLabel,
                  style: textTheme.bodyMedium?.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: AppColors.primary600,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Text(
                          initials,
                          style: textTheme.titleMedium?.copyWith(
                            color: AppColors.white,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            style: textTheme.titleMedium?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                          Text(
                            details,
                            style: textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: severityColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border(
                      left: BorderSide(color: severityColor, width: 4),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.warning_amber_rounded, color: severityColor),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              alertTitle,
                              style: textTheme.titleSmall?.copyWith(
                                color: colorScheme.onSurface,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              alertBody,
                              style: textTheme.bodyMedium?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                if (actionLeft != null && actionRight != null) ...[
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: () {},
                          style: FilledButton.styleFrom(
                            backgroundColor: AppColors.primary600,
                            foregroundColor: AppColors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          icon: const Icon(Icons.message),
                          label: Text(actionLeft!),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: () {},
                          style: FilledButton.styleFrom(
                            backgroundColor: AppColors.accent500,
                            foregroundColor: AppColors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                          icon: const Icon(Icons.videocam),
                          label: Text(actionRight!),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NotificationIcon extends StatelessWidget {
  final ColorScheme colorScheme;

  const _NotificationIcon({required this.colorScheme});

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        IconButton(
          icon: Icon(Icons.notifications_outlined, color: colorScheme.onSurface),
          onPressed: () {},
        ),
        Positioned(
          right: 10,
          top: 10,
          child: Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: AppColors.error500,
              shape: BoxShape.circle,
            ),
          ),
        ),
      ],
    );
  }
}

void _handleNav(BuildContext context, int index) {
  if (index == 0) {
    return;
  } else if (index == 1) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CaregiverPatientMonitoringScreen(),
      ),
    );
  } else if (index == 2) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CaregiverTaskManagementScreen(),
      ),
    );
  } else if (index == 3) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CaregiverAnalyticsScreen(),
      ),
    );
  }
}
