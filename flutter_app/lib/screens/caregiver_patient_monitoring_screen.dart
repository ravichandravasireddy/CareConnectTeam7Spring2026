import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';

// =============================================================================
// CAREGIVER: PATIENT MONITORING - ACCESSIBLE VERSION
// =============================================================================
// Overview of patient vitals, alerts, and recent check-ins.
// WCAG 2.1 Level AA compliant with comprehensive accessibility support.
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
            Semantics(
              header: true,
              label: 'Patients',
              child: Text(
                'Patients',
                style: textTheme.titleMedium?.copyWith(
                  color: colorScheme.onSurface,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Semantics(
              label: 'Patient list',
              container: true,
              child: Container(
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colorScheme.outline, width: 1),
                ),
                child: Column(
                  children: [
                    Semantics(
                      button: true,
                      label: 'Robert Williams, Patient ID Number RW-2847',
                      hint: 'Double tap to view patient details',
                      excludeSemantics: true,
                      child: ListTile(
                        leading: Semantics(
                          label: 'Robert Williams avatar',
                          image: true,
                          child: CircleAvatar(
                            backgroundColor: AppColors.primary600,
                            child: Text(
                              'RW',
                              style: textTheme.labelLarge?.copyWith(
                                color: colorScheme.onPrimary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ),
                        title: Text(
                          'Robert Williams',
                          style: textTheme.titleMedium?.copyWith(
                            color: colorScheme.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: Text(
                          'Patient ID: #RW-2847',
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                    Divider(height: 1, color: colorScheme.outline),
                    Semantics(
                      button: true,
                      label: 'Maya Patel, Patient ID Number MP-1932',
                      hint: 'Double tap to view patient details',
                      excludeSemantics: true,
                      child: ListTile(
                        leading: Semantics(
                          label: 'Maya Patel avatar',
                          image: true,
                          child: CircleAvatar(
                            backgroundColor: AppColors.secondary600,
                            child: Text(
                              'MP',
                              style: textTheme.labelLarge?.copyWith(
                                color: colorScheme.onSecondary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ),
                        title: Text(
                          'Maya Patel',
                          style: textTheme.titleMedium?.copyWith(
                            color: colorScheme.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: Text(
                          'Patient ID: #MP-1932',
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Semantics(
              label: 'Selected patient: Robert Williams, Age 67, Male, Type 2 Diabetes',
              readOnly: true,
              child: Row(
                children: [
                  Semantics(
                    label: 'Robert Williams avatar',
                    image: true,
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: AppColors.primary600,
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: ExcludeSemantics(
                          child: Text(
                            'RW',
                            style: textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onPrimary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ExcludeSemantics(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Robert Williams',
                            style: textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Age 67 • Male • Type 2 Diabetes',
                            style: textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Semantics(
              label: 'Communication actions',
              container: true,
              child: Row(
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
            ),
            const SizedBox(height: 20),
            Semantics(
              label: 'Latest vitals',
              container: true,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: colorScheme.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colorScheme.outline, width: 1),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Semantics(
                      header: true,
                      label: 'Latest Vitals',
                      child: Text(
                        'Latest Vitals',
                        style: textTheme.titleMedium?.copyWith(
                          color: colorScheme.onSurface,
                          fontWeight: FontWeight.w600,
                        ),
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

    return Semantics(
      button: true,
      label: label,
      hint: 'Double tap to $label Robert Williams',
      excludeSemantics: true,
      child: Container(
        height: 84,
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outline, width: 1),
        ),
        child: Material(
          color: colorScheme.surface.withValues(alpha: 0),
          child: InkWell(
            onTap: onTap ?? () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('$label feature coming soon'),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
            borderRadius: BorderRadius.circular(12),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Semantics(
                  label: '$label icon',
                  image: true,
                  child: Icon(icon, color: color, size: 26),
                ),
                const SizedBox(height: 6),
                Text(
                  label,
                  style: textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurface,
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

    // Format value for screen reader
    final spokenValue = value == '120/80' 
        ? '120 over 80' 
        : value.replaceAll('bpm', 'beats per minute');
    final spokenStatus = status.replaceAll('•', ',');

    return Semantics(
      label: '$title: $spokenValue, $spokenStatus',
      readOnly: true,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: colorScheme.surfaceContainer,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: colorScheme.outline,
            width: 1,
          ),
        ),
        child: ExcludeSemantics(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                value,
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                status,
                style: textTheme.bodyMedium?.copyWith(
                  color: AppColors.success700,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}