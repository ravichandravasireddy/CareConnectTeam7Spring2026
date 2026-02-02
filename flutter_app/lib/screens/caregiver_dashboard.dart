import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import 'caregiver_analytics_screen.dart';
import 'caregiver_patient_monitoring_screen.dart';
import 'caregiver_task_management_screen.dart';

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
          'Dashboard',
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _UrgentBanner(
                colorScheme: colorScheme,
                textTheme: textTheme,
                onTap: () {},
              ),
              const SizedBox(height: 16),
              Container(
                height: 4,
                color: AppColors.primary600,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: AppColors.error500,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'CRITICAL ALERTS',
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _AlertCard(
                severityLabel: 'CRITICAL',
                severityColor: AppColors.error500,
                timeLabel: '2 min ago',
                initials: 'MJ',
                name: 'Marie Johnson',
                details: 'Age 72 • Diabetes',
                alertTitle: 'Missed Medication',
                alertBody: 'Metformin 500mg - Due 30 min ago',
                actionLeft: 'MESSAGE',
                actionRight: 'VIDEO',
              ),
              const SizedBox(height: 16),
              _AlertCard(
                severityLabel: 'WARNING',
                severityColor: AppColors.warning500,
                timeLabel: '45 min ago',
                initials: 'RW',
                name: 'Robert Williams',
                details: 'Age 67 • Hypertension',
                alertTitle: 'Elevated Blood Pressure',
                alertBody: 'Reading 160/98 - recheck needed',
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
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
