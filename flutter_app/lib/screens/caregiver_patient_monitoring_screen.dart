import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'caregiver_analytics_screen.dart';
import 'caregiver_dashboard.dart';
import 'caregiver_task_management_screen.dart';

// =============================================================================
// CAREGIVER: PATIENT MONITORING
// =============================================================================
// Overview of patient vitals, alerts, and recent check-ins.
// =============================================================================

class CaregiverPatientMonitoringScreen extends StatelessWidget {
  const CaregiverPatientMonitoringScreen({super.key});

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
          'Patient Details',
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
            TextButton.icon(
              onPressed: () {},
              icon: Icon(Icons.arrow_back, color: colorScheme.primary),
              label: Text(
                'Back to Patients',
                style: textTheme.bodyLarge?.copyWith(
                  color: colorScheme.primary,
                  decoration: TextDecoration.underline,
                ),
              ),
              style: TextButton.styleFrom(
                padding: EdgeInsets.zero,
                minimumSize: const Size(0, 44),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: AppColors.primary600,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      'SJ',
                      style: textTheme.titleMedium?.copyWith(
                        color: colorScheme.onPrimary,
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
                        'Sarah Johnson',
                        style: textTheme.titleMedium?.copyWith(
                          color: colorScheme.onSurface,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Age 68 • Female • Type 2 Diabetes',
                        style: textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: const [
                Expanded(
                  child: _ActionCard(
                    icon: Icons.call,
                    label: 'Call',
                    color: AppColors.primary600,
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: _ActionCard(
                    icon: Icons.videocam,
                    label: 'Video',
                    color: AppColors.accent500,
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: _ActionCard(
                    icon: Icons.message,
                    label: 'Message',
                    color: AppColors.secondary600,
                  ),
                ),
              ],
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
                  Text(
                    'Latest Vitals',
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: const [
                      Expanded(
                        child: _VitalTile(
                          title: 'Blood Pressure',
                          value: '120/80',
                          status: 'Normal • 2h ago',
                        ),
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: _VitalTile(
                          title: 'Heart Rate',
                          value: '72 bpm',
                          status: 'Normal • 2h ago',
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 1,
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

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _ActionCard({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Container(
      height: 84,
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 26),
          const SizedBox(height: 6),
          Text(
            label,
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
        ],
      ),
    );
  }
}

class _VitalTile extends StatelessWidget {
  final String title;
  final String value;
  final String status;

  const _VitalTile({
    required this.title,
    required this.value,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: textTheme.headlineSmall?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            status,
            style: textTheme.bodyMedium?.copyWith(
              color: AppColors.success700,
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
    return;
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
