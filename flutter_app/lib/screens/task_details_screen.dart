import 'package:flutter/material.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';
import '../widgets/app_bottom_nav_bar.dart';

// =============================================================================
// TASK DETAILS SCREEN (SHARED)
// =============================================================================
// Shows task details for both caregiver and patient flows.
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
          'Task Details',
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
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colorScheme.outline, width: 1),
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: AppColors.primary600,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.medication,
                      color: colorScheme.onPrimary,
                      size: 28,
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
                              label: 'DUE $timeLabel',
                              backgroundColor: AppColors.primary100,
                              textColor: colorScheme.primary,
                            ),
                            const SizedBox(width: 8),
                            _StatusPill(
                              label: 'RECURRING',
                              backgroundColor: colorScheme.surfaceContainer,
                              textColor: colorScheme.onSurfaceVariant,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: colorScheme.outline, width: 1),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _DetailSection(
                    title: 'Medication',
                    value: 'Lisinopril 10mg',
                  ),
                  const SizedBox(height: 12),
                  _DetailSection(
                    title: 'Instructions',
                    value: 'Take one tablet with water',
                  ),
                  const SizedBox(height: 12),
                  _DetailSection(
                    title: 'Frequency',
                    value: 'Once daily at $timeLabel',
                  ),
                  const SizedBox(height: 12),
                  _DetailSection(
                    title: 'Notes',
                    value: 'Best taken with food. Avoid grapefruit.',
                  ),
                  const SizedBox(height: 12),
                  _DetailSection(
                    title: 'Date',
                    value: dateLabel,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Semantics(
              label: 'Mark task as complete, button',
              button: true,
              child: SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(
                    backgroundColor: colorScheme.primary,
                    foregroundColor: colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(0, 48),
                  ),
                  icon: const Icon(Icons.check),
                  label: const Text('Mark as Complete'),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colorScheme.onSurface,
                      backgroundColor: colorScheme.surfaceContainer,
                      side: BorderSide(color: colorScheme.outline),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      minimumSize: const Size(0, 48),
                    ),
                    child: const Text('Snooze'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colorScheme.onSurface,
                      backgroundColor: colorScheme.surfaceContainer,
                      side: BorderSide(color: colorScheme.outline),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      minimumSize: const Size(0, 48),
                    ),
                    child: const Text('Skip Today'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(currentIndex: kPatientNavTasks),
    );
  }
}

class _StatusPill extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final Color textColor;

  const _StatusPill({
    required this.label,
    required this.backgroundColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: textTheme.labelSmall?.copyWith(
          color: textColor,
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
