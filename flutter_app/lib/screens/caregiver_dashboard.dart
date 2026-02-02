import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/patient.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import 'caregiver_patient_monitoring_screen.dart';
import 'caregiver_task_management_screen.dart';
import 'caregiver_analytics_screen.dart';
import 'emergency_sos_alert.dart';
import 'task_details_screen.dart';

// =============================================================================
// CAREGIVER DASHBOARD SCREEN
// =============================================================================
// Dashboard for caregivers: quick stats, emergency banner, patient list, tasks.
// Uses [TaskProvider] for tasks; mock patient data until a patient provider exists.
// Follows theme colors (AppColors, colorScheme) and app typography.
// =============================================================================

class CaregiverDashboardScreen extends StatefulWidget {
  const CaregiverDashboardScreen({super.key});

  @override
  State<CaregiverDashboardScreen> createState() =>
      _CaregiverDashboardScreenState();
}

class _CaregiverDashboardScreenState extends State<CaregiverDashboardScreen> {
  int _selectedIndex = 0;

  // Mock data until PatientProvider exists
  final List<Patient> _patients = [
    Patient(id: '1', name: 'Robert Williams'),
    Patient(id: '2', name: 'Mary Johnson'),
  ];

  final List<Task> _tasks = [
    Task(
      id: 'task-1',
      title: 'Medication check',
      description: 'Confirm morning medication taken with water.',
      date: DateTime.now().add(const Duration(hours: 1)),
      patientName: 'Robert Williams',
      icon: Icons.medication,
      iconBackground: AppColors.primary100,
      iconColor: AppColors.primary700,
    ),
    Task(
      id: 'task-2',
      title: 'Blood pressure log',
      description: 'Record BP and upload to the care plan.',
      date: DateTime.now().add(const Duration(hours: 3)),
      patientName: 'Mary Johnson',
      icon: Icons.monitor_heart,
      iconBackground: AppColors.accent100,
      iconColor: AppColors.accent600,
    ),
    Task(
      id: 'task-3',
      title: 'Evening walk',
      description: 'Assist with 15-minute walk after dinner.',
      date: DateTime.now().add(const Duration(hours: 6)),
      patientName: 'James Carter',
      icon: Icons.directions_walk,
      iconBackground: AppColors.success100,
      iconColor: AppColors.success700,
      completedAt: DateTime.now(),
    ),
  ];

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

    return Scaffold(
      backgroundColor: colorScheme.surfaceContainerHighest ?? colorScheme.surface,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: colorScheme.surface,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _greetingText,
              style: textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            Text(
              'Sarah Johnson',
              style: textTheme.headlineMedium?.copyWith(
                color: colorScheme.onSurface,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        actions: [
          Semantics(
            label: 'Notifications',
            button: true,
            child: IconButton(
              icon: Icon(
                Icons.notifications_outlined,
                color: colorScheme.onSurface,
              ),
              onPressed: () {},
              style: IconButton.styleFrom(
                minimumSize: const Size(48, 48),
              ),
            ),
          ),
          Semantics(
            label: 'Settings',
            button: true,
            child: IconButton(
              icon: Icon(
                Icons.settings_outlined,
                color: colorScheme.onSurface,
              ),
              onPressed: () {},
              style: IconButton.styleFrom(
                minimumSize: const Size(48, 48),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildQuickStats(
                context,
                colorScheme: colorScheme,
                textTheme: textTheme,
                patientCount: _patients.length,
                tasksCompleted: completedCount,
                tasksTotal: totalCount,
                alertCount: 3,
              ),
              const SizedBox(height: 24),
              _buildEmergencyBanner(
                context,
                colorScheme: colorScheme,
                textTheme: textTheme,
              ),
              const SizedBox(height: 24),
              _buildPatientsSection(
                context,
                colorScheme: colorScheme,
                textTheme: textTheme,
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
      bottomNavigationBar: _buildBottomNav(
        context,
        colorScheme: colorScheme,
        textTheme: textTheme,
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

  Widget _buildBottomNav(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return NavigationBar(
      selectedIndex: _selectedIndex,
      onDestinationSelected: (index) {
        setState(() => _selectedIndex = index);
        if (index == 1) {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const CaregiverTaskManagementScreen(),
            ),
          );
        } else if (index == 2) {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const CaregiverAnalyticsScreen(),
            ),
          );
        } else if (index == 3) {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const CaregiverPatientMonitoringScreen(),
            ),
          );
        }
      },
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.home_outlined),
          selectedIcon: Icon(Icons.home),
          label: 'Home',
        ),
        NavigationDestination(
          icon: Icon(Icons.checklist_outlined),
          selectedIcon: Icon(Icons.checklist),
          label: 'Tasks',
        ),
        NavigationDestination(
          icon: Icon(Icons.analytics_outlined),
          selectedIcon: Icon(Icons.analytics),
          label: 'Analytics',
        ),
        NavigationDestination(
          icon: Icon(Icons.monitor_heart_outlined),
          selectedIcon: Icon(Icons.monitor_heart),
          label: 'Monitor',
        ),
      ],
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

class _PatientCard extends StatelessWidget {
  final Patient patient;
  final ColorScheme colorScheme;
  final TextTheme textTheme;
  final VoidCallback onTap;

  const _PatientCard({
    required this.patient,
    required this.colorScheme,
    required this.textTheme,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '${patient.name}, patient card. Tap to view details.',
      button: true,
      child: Material(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Container(
            constraints: const BoxConstraints(minHeight: 64),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: colorScheme.outline.withValues(alpha: 0.5),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: AppColors.primary100,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.person,
                    color: AppColors.primary600,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    patient.name,
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                    ),
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
}

class _TaskCard extends StatelessWidget {
  final Task task;
  final ColorScheme colorScheme;
  final TextTheme textTheme;
  final VoidCallback onTap;

  const _TaskCard({
    required this.task,
    required this.colorScheme,
    required this.textTheme,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final timeLabel = DateFormat.jm().format(task.date);
    return Semantics(
      label: '${task.title}, $timeLabel${task.isCompleted ? ", completed" : ""}',
      button: true,
      child: Material(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: colorScheme.outline,
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: task.iconBackground,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    task.icon,
                    color: task.iconColor,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        style: textTheme.titleMedium?.copyWith(
                          color: colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        timeLabel,
                        style: textTheme.bodySmall?.copyWith(
                          fontSize: 13,
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                if (task.isCompleted)
                  Icon(
                    Icons.check_circle,
                    color: AppColors.success500,
                    size: 24,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
