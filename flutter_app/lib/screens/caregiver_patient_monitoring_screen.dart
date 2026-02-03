import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';

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
      appBar: AppAppBar(
        title: 'Patient Details',
        showMenuButton: false,
        useBackButton: true,
        onNotificationTap: () => Navigator.pushNamed(context, '/notifications'),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            
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
              children: [
                Expanded(
                  child: _ActionCard(
                    icon: Icons.call,
                    label: 'Call',
                    color: AppColors.primary600,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _ActionCard(
                    icon: Icons.videocam,
                    label: 'Video',
                    color: AppColors.accent500,
                    onTap: () => Navigator.pushNamed(context, '/video-call'),
                  ),
                ),
                const SizedBox(width: 12),
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
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kCaregiverNavMonitor,
        isPatient: false,
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onTap;

  const _ActionCard({
    required this.icon,
    required this.label,
    required this.color,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    final content = Column(
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
    );

    return Container(
      height: 84,
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: content,
        ),
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
