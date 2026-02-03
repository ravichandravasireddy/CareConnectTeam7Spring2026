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
  TaskFilter _selectedFilter = TaskFilter.all;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final tasks = _filteredTasks;

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Task Management',
          style: textTheme.headlineLarge?.copyWith(
            color: colorScheme.onSurface,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            Semantics(
              header: true,
              child: Text(
                'Tasks',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Review assignments by patient and due time.',
              style: textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: TaskFilter.values.map((filter) {
                return ChoiceChip(
                  label: Text(filter.label),
                  selected: _selectedFilter == filter,
                  onSelected: (_) => setState(() => _selectedFilter = filter),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            if (tasks.isEmpty)
              _EmptyStateCard(
                message: 'No tasks in this view.',
                colorScheme: colorScheme,
                textTheme: textTheme,
              )
            else
              ...tasks.map(
                (task) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
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

enum TaskFilter { all, today, completed }

extension on TaskFilter {
  String get label {
    switch (this) {
      case TaskFilter.all:
        return 'All';
      case TaskFilter.today:
        return 'Today';
      case TaskFilter.completed:
        return 'Completed';
    }
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
    final localizations = MaterialLocalizations.of(context);
    final dateLabel = localizations.formatFullDate(task.date);
    final timeLabel = localizations.formatTimeOfDay(
      TimeOfDay.fromDateTime(task.date),
    );

    return Semantics(
      label: '${task.title}, ${task.patientName}, $dateLabel at $timeLabel',
      button: true,
      child: Material(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: colorScheme.outline, width: 1),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: task.iconBackground,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(task.icon, color: task.iconColor, size: 22),
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
                        '${task.patientName} • $timeLabel',
                        style: textTheme.bodySmall?.copyWith(
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
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _EmptyStateCard extends StatelessWidget {
  final String message;
  final ColorScheme colorScheme;
  final TextTheme textTheme;

  const _EmptyStateCard({
    required this.message,
    required this.colorScheme,
    required this.textTheme,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
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
}

final List<Task> _mockTasks = [
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
