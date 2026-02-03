import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'caregiver_dashboard.dart';
import 'caregiver_patient_monitoring_screen.dart';
import 'caregiver_task_management_screen.dart';

// =============================================================================
// CAREGIVER: ANALYTICS
// =============================================================================
// High-level overview of patient activity and task completion trends.
// =============================================================================

class CaregiverAnalyticsScreen extends StatelessWidget {
  const CaregiverAnalyticsScreen({super.key});

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
          'Analytics',
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
            Semantics(
              header: true,
              child: Text(
                'Weekly Overview',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Track engagement and task completion trends.',
              style: textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: const [
                Expanded(
                  child: _MetricCard(
                    title: 'Task Completion',
                    value: '87%',
                    delta: '↑ 5% from last week',
                    valueColor: AppColors.success700,
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: _MetricCard(
                    title: 'Avg Response\nTime',
                    value: '12m',
                    delta: '↓ 3m from last week',
                    valueColor: AppColors.primary600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
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
                  Text(
                    'Medication Adherence',
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    height: 160,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainer,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '7-day adherence trend chart',
                      style: textTheme.bodyMedium?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 3,
        onDestinationSelected: (index) => _handleNav(context, index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outline),
            selectedIcon: Icon(Icons.people),
            label: 'Patients',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_today_outlined),
            selectedIcon: Icon(Icons.calendar_today),
            label: 'Tasks',
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
        ],
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String value;
  final String title;
  final String delta;
  final Color valueColor;

  const _MetricCard({
    required this.value,
    required this.title,
    required this.delta,
    required this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Container(
      width: 160,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 4),
          Text(
            title,
            style: textTheme.titleSmall?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: textTheme.headlineMedium?.copyWith(
              color: valueColor,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            delta,
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
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
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => const CaregiverTaskManagementScreen(),
      ),
    );
  } else if (index == 3) {
    return;
  }
}
