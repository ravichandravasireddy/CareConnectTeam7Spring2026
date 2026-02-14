import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/task.dart';
import '../providers/task_provider.dart';
import '../theme/app_colors.dart';
import '../widgets/app_bottom_nav_bar.dart';
import '../providers/auth_provider.dart';

// =============================================================================
// TASK DETAILS SCREEN (SHARED)
// =============================================================================
// Shows task details for both caregiver and patient flows with WCAG 2.1 Level AA
// accessibility compliance. Includes screen reader support, keyboard navigation,
// and semantic labels for all interactive elements.
// =============================================================================

class TaskDetailsScreen extends StatelessWidget {
  final Task task;

  const TaskDetailsScreen({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final localizations = MaterialLocalizations.of(context);
    final dateLabel = localizations.formatFullDate(task.date);
    final timeLabel = localizations.formatTimeOfDay(
      TimeOfDay.fromDateTime(task.date),
    );
    final taskProvider = context.read<TaskProvider>();
    final isCompleted = task.isCompleted;
    final auth = context.watch<AuthProvider>();
    final isCaregiver = auth.userRole == UserRole.caregiver;

    // Calculate if task is overdue
    final now = DateTime.now();
    final isOverdue = !isCompleted && task.date.isBefore(now);
    final isUpcoming = !isCompleted && task.date.isAfter(now);

    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        leading: Semantics(
          label: 'Go back',
          hint: 'Double tap to return to previous screen',
          button: true,
          excludeSemantics: true,
          child: IconButton(
            icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
            onPressed: () => Navigator.pop(context),
            tooltip: 'Go back',
          ),
        ),
        title: Semantics(
          header: true,
          label: 'Task Details',
          child: Text(
            'Task Details',
            style: textTheme.headlineLarge?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            // Task header card
            Semantics(
              label: _buildTaskHeaderLabel(
                task.title,
                task.description,
                isCompleted,
                isOverdue,
                timeLabel,
              ),
              container: true,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isOverdue && !isCompleted
                        ? AppColors.error700
                        : colorScheme.outline,
                    width: isOverdue && !isCompleted ? 2 : 1,
                  ),
                ),
                child: ExcludeSemantics(
                  child: Row(
                    children: [
                      Semantics(
                        label: '${task.title} icon',
                        image: true,
                        child: Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: task.iconBackground,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            task.icon,
                            color: task.iconColor,
                            size: 28,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.title,
                              style: textTheme.headlineSmall?.copyWith(
                                color: colorScheme.onSurface,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              task.description,
                              style: textTheme.bodyMedium?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                _StatusPill(
                                  label: isCompleted 
                                      ? 'COMPLETED' 
                                      : isOverdue
                                          ? 'OVERDUE'
                                          : 'DUE $timeLabel',
                                  backgroundColor: isCompleted
                                      ? AppColors.success100
                                      : isOverdue
                                          ? AppColors.error100
                                          : AppColors.primary100,
                                  textColor: isCompleted
                                      ? AppColors.success700
                                      : isOverdue
                                          ? AppColors.error700
                                          : colorScheme.primary,
                                  semanticLabel: isCompleted
                                      ? 'Task completed'
                                      : isOverdue
                                          ? 'Task overdue'
                                          : 'Due at $timeLabel',
                                ),
                                const SizedBox(width: 8),
                                _StatusPill(
                                  label: 'RECURRING',
                                  backgroundColor: colorScheme.surfaceContainer,
                                  textColor: colorScheme.onSurfaceVariant,
                                  semanticLabel: 'Recurring task',
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Details card
            Semantics(
              label: _buildDetailsLabel(dateLabel, task.patientName),
              container: true,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colorScheme.outline, width: 1),
                ),
                child: ExcludeSemantics(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _DetailSection(
                        title: 'Date',
                        value: dateLabel,
                      ),
                      if (task.patientName.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        _DetailSection(
                          title: 'Patient',
                          value: task.patientName,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Mark as Complete / Completed Status
            if (!isCompleted)
              Semantics(
                label: 'Mark task as complete',
                hint: 'Double tap to mark ${task.title} as complete',
                button: true,
                excludeSemantics: true,
                child: SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () {
                      taskProvider.markCompleted(task.id);
                      
                      // Announce completion to screen reader
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${task.title} marked as complete'),
                          duration: const Duration(seconds: 2),
                          backgroundColor: AppColors.success700,
                        ),
                      );
                      
                      Navigator.pop(context);
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: colorScheme.onPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      minimumSize: const Size(double.infinity, 56),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(Icons.check, size: 24),
                    label: Text(
                      'Mark as Complete',
                      style: textTheme.titleMedium?.copyWith(
                        color: colorScheme.onPrimary,
                      ),
                    ),
                  ),
                ),
              ),
            
            if (isCompleted)
              Semantics(
                label: 'Task completed',
                readOnly: true,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.success100,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppColors.success700,
                      width: 1,
                    ),
                  ),
                  child: ExcludeSemantics(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.check_circle,
                          color: AppColors.success700,
                          size: 24,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Completed',
                          style: textTheme.titleMedium?.copyWith(
                            color: AppColors.success700,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            
            const SizedBox(height: 12),

            // Action buttons
            Semantics(
              label: 'Task actions',
              container: true,
              child: Row(
                children: [
                  Expanded(
                    child: Semantics(
                      label: 'Snooze task',
                      hint: 'Double tap to postpone this task',
                      button: true,
                      excludeSemantics: true,
                      child: OutlinedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Task snoozed for 30 minutes'),
                              duration: Duration(seconds: 2),
                            ),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: colorScheme.onSurface,
                          backgroundColor: colorScheme.surfaceContainer,
                          side: BorderSide(color: colorScheme.outline),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          minimumSize: const Size(0, 56),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Snooze',
                          style: textTheme.titleMedium,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Semantics(
                      label: 'Skip today',
                      hint: 'Double tap to skip this task for today',
                      button: true,
                      excludeSemantics: true,
                      child: OutlinedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Task skipped for today'),
                              duration: Duration(seconds: 2),
                            ),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: colorScheme.onSurface,
                          backgroundColor: colorScheme.surfaceContainer,
                          side: BorderSide(color: colorScheme.outline),
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          minimumSize: const Size(0, 56),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Skip Today',
                          style: textTheme.titleMedium,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: AppBottomNavBar(
        currentIndex: isCaregiver ? kCaregiverNavHome : kPatientNavProfile,
        isPatient: !isCaregiver,
      ),
    );
  }

  /// Build comprehensive semantic label for task header
  String _buildTaskHeaderLabel(
    String title,
    String description,
    bool isCompleted,
    bool isOverdue,
    String timeLabel,
  ) {
    final status = isCompleted
        ? 'Completed'
        : isOverdue
            ? 'Overdue'
            : 'Due at $timeLabel';
    
    return '$title: $description. Status: $status. Recurring task.';
  }

  /// Build semantic label for details section
  String _buildDetailsLabel(String dateLabel, String patientName) {
    if (patientName.isNotEmpty) {
      return 'Task details: Date: $dateLabel. Patient: $patientName.';
    } else {
      return 'Task details: Date: $dateLabel.';
    }
  }
}

class _StatusPill extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final Color textColor;
  final String semanticLabel;

  const _StatusPill({
    required this.label,
    required this.backgroundColor,
    required this.textColor,
    required this.semanticLabel,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Semantics(
      label: semanticLabel,
      readOnly: true,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: textColor.withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        child: ExcludeSemantics(
          child: Text(
            label,
            style: textTheme.labelSmall?.copyWith(
              color: textColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}

class _DetailSection extends StatelessWidget {
  final String title;
  final String value;

  const _DetailSection({
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: textTheme.titleSmall?.copyWith(
            color: colorScheme.onSurfaceVariant,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: textTheme.bodyLarge?.copyWith(
            color: colorScheme.onSurface,
          ),
        ),
      ],
    );
  }
}