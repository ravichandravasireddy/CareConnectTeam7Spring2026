import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/patient.dart';
import '../models/task.dart';
import '../providers/auth_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../widgets/app_drawer.dart';
import 'caregiver_task_management_screen.dart';
import '../providers/task_provider.dart';
import 'task_details_screen.dart';

// =============================================================================
// CAREGIVER DASHBOARD SCREEN - ACCESSIBLE VERSION
// =============================================================================
// Dashboard showing urgent and critical alerts (design sample).
// WCAG 2.1 Level AA compliant with comprehensive accessibility support.
// =============================================================================

class CaregiverDashboardScreen extends StatelessWidget {
  const CaregiverDashboardScreen({super.key});

  static final List<Patient> _patients = [
    Patient(id: '1', name: 'Robert Williams'),
    Patient(id: '2', name: 'Maya Patel'),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final allTasks = context.read<TaskProvider>().tasks;
    final todayTasks = _tasksForDate(allTasks, today);
    final completedCount = todayTasks.where((t) => t.isCompleted).length;
    final totalCount = todayTasks.length;

    final userName = context.read<AuthProvider>().userName ?? 'Caregiver';
    final greetingName = _greetingName(userName);

    return Scaffold(
      backgroundColor: colorScheme.surfaceContainerHighest,
      appBar: AppAppBar(
        title: 'Dashboard',
        showNotificationBadge: true,
        onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
        actions: [
          Semantics(
            button: true,
            label: 'Settings',
            hint: 'Double tap to open settings',
            excludeSemantics: true,
            child: IconButton(
              icon: Icon(Icons.settings_outlined, color: colorScheme.onSurface),
              onPressed: () => Navigator.pushNamed(context, '/preferences'),
              style: IconButton.styleFrom(minimumSize: const Size(48, 48)),
              tooltip: 'Settings',
            ),
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome card (matching patient dashboard structure)
              Semantics(
                label: '$_greetingText, $greetingName! Here\'s your care overview for today',
                readOnly: true,
                child: Container(
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
                  child: ExcludeSemantics(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$_greetingText, $greetingName!',
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
                ),
              ),
              const SizedBox(height: 20),
              _buildQuickStats(
                context,
                colorScheme: colorScheme,
                textTheme: textTheme,
                patientCount: _patients.length,
                tasksCompleted: completedCount,
                tasksTotal: totalCount,
                alertCount: 1,
              ),
              const SizedBox(height: 16),
              Semantics(
                label: 'Section divider',
                excludeSemantics: true,
                child: Container(height: 4, color: AppColors.primary600),
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

  /// First name for greeting; strips "Dr." prefix so "Dr. Sarah Johnson" → "Sarah".
  static String _greetingName(String fullName) {
    final parts = fullName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return 'Caregiver';
    if (parts.length > 1 && parts[0] == 'Dr.') return parts[1];
    return parts.first;
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
      label: 'Quick stats: $patientCount patients, $tasksCompleted of $tasksTotal tasks completed, $alertCount alert${alertCount == 1 ? '' : 's'}',
      container: true,
      child: Row(
        children: [
          Expanded(
            child: _buildStatCard(
              context,
              title: 'Patients',
              value: '$patientCount',
              icon: Icons.people_outline,
              color: AppColors.info700,
              colorScheme: colorScheme,
              textTheme: textTheme,
              onTap: () =>
                  Navigator.pushNamed(context, '/caregiver-patient-monitoring'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildStatCard(
              context,
              title: 'Tasks',
              value: '$tasksCompleted/$tasksTotal',
              icon: Icons.check_circle_outline,
              color: AppColors.success700,
              colorScheme: colorScheme,
              textTheme: textTheme,
              onTap: () =>
                  Navigator.pushNamed(context, '/caregiver-task-management'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildStatCard(
              context,
              title: 'Alerts',
              value: '$alertCount',
              icon: Icons.warning_amber_outlined,
              color: AppColors.error700,
              colorScheme: colorScheme,
              textTheme: textTheme,
              onTap: () => Navigator.pushNamed(context, '/emergency-sos'),
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
    VoidCallback? onTap,
  }) {
    // Format value for screen reader
    final spokenValue = value.contains('/') 
        ? value.replaceAll('/', ' of ')
        : value;
    
    final content = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
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
          Semantics(
            label: '$title icon',
            image: true,
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: textTheme.headlineMedium?.copyWith(
              color: colorScheme.onSurface,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            title,
            style: textTheme.bodySmall?.copyWith(
              color: colorScheme.onSurfaceVariant,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );

    if (onTap == null) {
      return Semantics(
        label: '$title: $spokenValue',
        readOnly: true,
        child: content,
      );
    }

    return Semantics(
      button: true,
      label: '$title: $spokenValue',
      hint: 'Double tap to view $title',
      excludeSemantics: true,
      child: Material(
        color: colorScheme.surface.withValues(alpha: 0),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: content,
        ),
      ),
    );
  }

  Widget _buildTasksSection(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
    required List<Task> tasks,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Semantics(
              header: true,
              label: 'Today\'s Tasks, ${tasks.length} task${tasks.length == 1 ? '' : 's'}',
              child: Text(
                'Today\'s Tasks',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Semantics(
              button: true,
              label: 'Manage tasks',
              hint: 'Double tap to manage all tasks',
              excludeSemantics: true,
              child: TextButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const CaregiverTaskManagementScreen(),
                    ),
                  );
                },
                style: TextButton.styleFrom(
                  minimumSize: const Size(0, 48),
                ),
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
        Semantics(
          label: 'Task list, ${tasks.length} task${tasks.length == 1 ? '' : 's'}',
          container: true,
          child: tasks.isEmpty
              ? _buildEmptyCard(
                  context,
                  message: 'No tasks scheduled for today',
                  colorScheme: colorScheme,
                  textTheme: textTheme,
                )
              : Column(
                  children: tasks
                      .take(5)
                      .map(
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
                      )
                      .toList(),
                ),
        ),
      ],
    );
  }

  Widget _buildEmptyCard(
    BuildContext context, {
    required String message,
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return Semantics(
      label: message,
      readOnly: true,
      child: Container(
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
      ),
    );
  }

  List<Task> _tasksForDate(List<Task> tasks, DateTime date) {
    return tasks
        .where(
          (task) =>
              task.date.year == date.year &&
              task.date.month == date.month &&
              task.date.day == date.day,
        )
        .toList();
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
    final taskLabel = task.patientName.isNotEmpty
        ? 'Task: ${task.title}, Patient: ${task.patientName}'
        : 'Task: ${task.title}';

    return Semantics(
      button: true,
      label: taskLabel,
      hint: 'Double tap to view task details',
      excludeSemantics: true,
      child: Material(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(color: colorScheme.outline, width: 1),
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Semantics(
                  label: '${task.title} icon',
                  image: true,
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: task.iconBackground,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(task.icon, color: task.iconColor, size: 22),
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
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (task.patientName.isNotEmpty)
                        Text(
                          task.patientName,
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
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
    );
  }
}