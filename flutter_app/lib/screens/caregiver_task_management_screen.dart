import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import 'task_details_screen.dart';

// =============================================================================
// CAREGIVER: TASK MANAGEMENT - ACCESSIBLE VERSION
// =============================================================================
// Manage upcoming and completed tasks. Uses mock data until backend exists.
// WCAG 2.1 Level AA compliant with comprehensive accessibility support.
// =============================================================================

class CaregiverTaskManagementScreen extends StatefulWidget {
  const CaregiverTaskManagementScreen({super.key});

  @override
  State<CaregiverTaskManagementScreen> createState() =>
      _CaregiverTaskManagementScreenState();
}

class _CaregiverTaskManagementScreenState
    extends State<CaregiverTaskManagementScreen> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppAppBar(
        title: 'Tasks',
        showMenuButton: false,
        useBackButton: true,
        onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
      ),
      body: SafeArea(
        child: Semantics(
          label: 'Task management list',
          container: true,
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              _OverdueTasksCard(
                colorScheme: colorScheme,
                textTheme: textTheme,
                task: _mockTasks.first,
                onNotify: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Patient ${_mockTasks.first.patientName} has been notified'),
                      duration: const Duration(seconds: 2),
                    ),
                  );
                },
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => TaskDetailsScreen(task: _mockTasks.first),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kCaregiverNavTasks,
        isPatient: false,
      ),
    );
  }
}

class _OverdueTasksCard extends StatelessWidget {
  final ColorScheme colorScheme;
  final TextTheme textTheme;
  final Task task;
  final VoidCallback onNotify;
  final VoidCallback onTap;

  const _OverdueTasksCard({
    required this.colorScheme,
    required this.textTheme,
    required this.task,
    required this.onNotify,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Overdue tasks section',
      container: true,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.error100.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.error100,
            width: 2,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Semantics(
              header: true,
              label: 'Overdue Tasks, 2 tasks overdue',
              child: ExcludeSemantics(
                child: Row(
                  children: [
                    Icon(Icons.warning_amber_rounded, color: AppColors.error500),
                    const SizedBox(width: 8),
                    Text(
                      'Overdue Tasks (2)',
                      style: textTheme.titleMedium?.copyWith(
                        color: AppColors.error700,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Semantics(
              button: true,
              label: 'Overdue task for ${task.patientName}: Medication reminder, ${task.title}, Due 30 minutes ago',
              hint: 'Double tap to view task details',
              excludeSemantics: true,
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: onTap,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.error100.withValues(alpha: 0.3),
                      borderRadius: BorderRadius.circular(12),
                      border: Border(
                        left: BorderSide(
                          color: AppColors.error500,
                          width: 4,
                        ),
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                task.patientName,
                                style: textTheme.titleMedium?.copyWith(
                                  color: colorScheme.onSurface,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Medication reminder:',
                                style: textTheme.bodyMedium?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                ),
                              ),
                              Text(
                                task.title,
                                style: textTheme.bodyMedium?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                'Due 30 min ago',
                                style: textTheme.bodyMedium?.copyWith(
                                  color: AppColors.error700,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Semantics(
                          button: true,
                          label: 'Notify ${task.patientName}',
                          hint: 'Double tap to send notification to patient',
                          excludeSemantics: true,
                          child: FilledButton(
                            onPressed: onNotify,
                            style: FilledButton.styleFrom(
                              backgroundColor: colorScheme.primary,
                              foregroundColor: colorScheme.onPrimary,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 10,
                              ),
                              minimumSize: const Size(0, 48),
                            ),
                            child: const Text('Notify'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

final List<Task> _mockTasks = [
  Task(
    id: 'task-1',
    title: 'Metformin 500mg',
    description: 'Medication reminder',
    date: DateTime.now().add(const Duration(hours: 1)),
    patientName: 'Maya Patel',
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