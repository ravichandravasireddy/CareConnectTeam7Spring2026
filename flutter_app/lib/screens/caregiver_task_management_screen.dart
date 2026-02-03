import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import '../widgets/app_bottom_nav_bar.dart';
import 'task_details_screen.dart';

// =============================================================================
// CAREGIVER: TASK MANAGEMENT
// =============================================================================
// Manage upcoming and completed tasks. Uses mock data until backend exists.
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
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.menu, color: colorScheme.onSurface),
          onPressed: () {},
        ),
        title: Text(
          'Tasks',
          style: textTheme.headlineLarge?.copyWith(
            color: colorScheme.onSurface,
          ),
        ),
        centerTitle: true,
        actions: [
          _NotificationIcon(colorScheme: colorScheme),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            _OverdueTasksCard(
              colorScheme: colorScheme,
              textTheme: textTheme,
              task: _mockTasks.first,
              onNotify: () {},
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
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kCaregiverNavTasks,
        isPatient: false,
      ),
    );
  }

  List<Task> get _filteredTasks {
    switch (_selectedFilter) {
      case TaskFilter.all:
        return _mockTasks;
      case TaskFilter.today:
        final now = DateTime.now();
        final today = DateTime(now.year, now.month, now.day);
        return _mockTasks
            .where((task) =>
                DateTime(task.date.year, task.date.month, task.date.day) ==
                today)
            .toList();
      case TaskFilter.completed:
        return _mockTasks.where((task) => task.isCompleted).toList();
    }
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
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.error100.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.error100, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: AppColors.error500),
              const SizedBox(width: 8),
              Text(
                'Overdue Tasks (2)',
                style: textTheme.titleMedium?.copyWith(
                  color: AppColors.error700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.error100.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(12),
                border: Border(
                  left: BorderSide(color: AppColors.error500, width: 4),
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
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Due 30 min ago',
                          style: textTheme.bodyMedium?.copyWith(
                            color: AppColors.error700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: onNotify,
                    style: FilledButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: colorScheme.onPrimary,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 10,
                      ),
                      minimumSize: const Size(0, 40),
                    ),
                    child: const Text('Notify'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

void _handleNav(BuildContext context, int index) {
  if (index == 0) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const CaregiverDashboardScreen()),
    );
  } else if (index == 1) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CaregiverPatientMonitoringScreen(),
      ),
    );
  } else if (index == 2) {
    return;
  } else if (index == 3) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const CaregiverAnalyticsScreen()),
    );
  }
}

final List<Task> _mockTasks = [
  Task(
    id: 'task-1',
    title: 'Metformin 500mg',
    description: 'Medication reminder',
    date: DateTime.now().add(const Duration(hours: 1)),
    patientName: 'Sarah Johnson',
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
