import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../widgets/app_app_bar.dart';
import '../widgets/app_bottom_nav_bar.dart';

// =============================================================================
// CAREGIVER: ANALYTICS - ACCESSIBLE VERSION
// =============================================================================
// High-level overview of patient activity and task completion trends.
// WCAG 2.1 Level AA compliant with comprehensive accessibility support.
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
      appBar: AppAppBar(
        title: 'Analytics',
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
              label: 'Weekly Overview',
              child: Text(
                'Weekly Overview',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Semantics(
              label: 'Track engagement and task completion trends',
              readOnly: true,
              child: Text(
                'Track engagement and task completion trends.',
                style: textTheme.bodyLarge?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ),
            const SizedBox(height: 24),
            Semantics(
              label: 'Key metrics',
              container: true,
              child: Row(
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
            ),
            const SizedBox(height: 24),
            Semantics(
              label: 'Medication adherence chart',
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
                      label: 'Medication Adherence',
                      child: Text(
                        'Medication Adherence',
                        style: textTheme.titleMedium?.copyWith(
                          color: colorScheme.onSurface,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Semantics(
                      label: '7-day medication adherence trend chart placeholder',
                      image: true,
                      child: Container(
                        height: 160,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: colorScheme.surfaceContainer,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: colorScheme.outline,
                            width: 1,
                          ),
                        ),
                        alignment: Alignment.center,
                        child: ExcludeSemantics(
                          child: Text(
                            '7-day adherence trend chart',
                            style: textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(
        currentIndex: kCaregiverNavAnalytics,
        isPatient: false,
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

    // Format for screen reader
    final cleanTitle = title.replaceAll('\n', ' ');
    
    // Format delta for speech
    String spokenDelta = delta
        .replaceAll('↑', 'up')
        .replaceAll('↓', 'down')
        .replaceAll('m', ' minutes');
    
    // Format value for speech
    final spokenValue = value == '12m' ? '12 minutes' : value;

    final semanticLabel = '$cleanTitle: $spokenValue, $spokenDelta';

    return Semantics(
      label: semanticLabel,
      readOnly: true,
      child: Container(
        width: 160,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outline, width: 1),
        ),
        child: ExcludeSemantics(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 4),
              Text(
                title,
                style: textTheme.titleSmall?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                value,
                style: textTheme.headlineMedium?.copyWith(
                  color: valueColor,
                  fontWeight: FontWeight.bold,
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
        ),
      ),
    );
  }
}