// =============================================================================
// EMERGENCY SOS ALERT SCREEN - ACCESSIBLE VERSION
// =============================================================================
// Emergency alert management (placeholder). This screen matches app theme
// and accessibility patterns while the full implementation is unavailable.
// WCAG 2.1 Level AA compliant with comprehensive accessibility support.
// =============================================================================

import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class EmergencySOSAlertScreen extends StatefulWidget {
  const EmergencySOSAlertScreen({super.key});

  @override
  State<EmergencySOSAlertScreen> createState() =>
      _EmergencySOSAlertScreenState();
}

class _EmergencySOSAlertScreenState extends State<EmergencySOSAlertScreen> {
  bool _isAcknowledged = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Scaffold(
      backgroundColor:
          _isAcknowledged ? colorScheme.surface : AppColors.error700,
      body: SafeArea(
        child: _isAcknowledged
            ? Semantics(
                liveRegion: true,
                label: 'Alert acknowledged. This alert has been cleared. You will be automatically redirected in 3 seconds.',
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: _buildAcknowledgedState(
                      context,
                      colorScheme: colorScheme,
                      textTheme: textTheme,
                    ),
                  ),
                ),
              )
            : Semantics(
                liveRegion: true,
                label: 'Emergency alert from Robert Williams, Patient ID Number RW-2847, 2 minutes ago',
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: _buildAlertState(
                    context,
                    colorScheme: colorScheme,
                    textTheme: textTheme,
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildAlertState(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 8),
        Semantics(
          label: 'Emergency warning icon',
          image: true,
          child: Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              color: AppColors.error100,
              shape: BoxShape.circle,
              border: Border.all(
                color: AppColors.error100.withValues(alpha: 0.8),
                width: 6,
              ),
            ),
            child: Icon(
              Icons.warning_amber_rounded,
              color: AppColors.error700,
              size: 48,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Semantics(
          header: true,
          label: 'Emergency Alert',
          child: ExcludeSemantics(
            child: Text(
              'EMERGENCY\nALERT',
              textAlign: TextAlign.center,
              style: textTheme.displaySmall?.copyWith(
                color: colorScheme.onError,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Semantics(
          label: 'Alert from Robert Williams, Patient ID Number RW-2847',
          readOnly: true,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              color: AppColors.error700,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppColors.white.withValues(alpha: 0.3),
                width: 2,
              ),
            ),
            child: ExcludeSemantics(
              child: Column(
                children: [
                  Text(
                    'From: Robert Williams',
                    style: textTheme.headlineSmall?.copyWith(
                      color: AppColors.white,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Patient ID: #RW-2847',
                    style: textTheme.bodyMedium?.copyWith(
                      color: AppColors.white.withValues(alpha: 0.9),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Semantics(
          label: 'Alert time: 2 minutes ago',
          readOnly: true,
          child: Text(
            '2 minutes ago',
            style: textTheme.bodyLarge?.copyWith(
              color: colorScheme.onError,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(height: 20),
        Semantics(
          label: 'Patient information',
          container: true,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: colorScheme.outline,
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Semantics(
                  label: 'Patient: Robert Williams, Age 67, Conditions: Diabetes, Hypertension',
                  readOnly: true,
                  child: ExcludeSemantics(
                    child: Row(
                      children: [
                        Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            color: AppColors.secondary600,
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              'RW',
                              style: textTheme.headlineSmall?.copyWith(
                                color: colorScheme.onSecondary,
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
                                'Robert Williams',
                                style: textTheme.headlineSmall?.copyWith(
                                  color: colorScheme.onSurface,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Age 67 • Diabetes, Hypertension',
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
                ),
                const SizedBox(height: 16),
                Semantics(
                  label: 'Patient location: 742 Evergreen Terrace, Springfield, IL 62701',
                  readOnly: true,
                  child: Container(
                    width: double.infinity,
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
                      child: Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            color: colorScheme.primary,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Patient Location',
                                  style: textTheme.labelMedium?.copyWith(
                                    color: colorScheme.onSurface,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '742 Evergreen Terrace',
                                  style: textTheme.bodyMedium?.copyWith(
                                    color: colorScheme.onSurfaceVariant,
                                  ),
                                ),
                                Text(
                                  'Springfield, IL 62701',
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
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        Semantics(
          label: 'Acknowledge emergency alert',
          hint: 'Double tap to acknowledge and clear this emergency alert',
          button: true,
          excludeSemantics: true,
          child: SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: () {
                setState(() => _isAcknowledged = true);
                
                // Announce acknowledgment
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Emergency alert acknowledged. Redirecting...'),
                    duration: Duration(seconds: 2),
                  ),
                );
                
                final navigator = Navigator.of(context);
                Future.delayed(const Duration(seconds: 3), () {
                  if (mounted) navigator.pop();
                });
              },
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.white,
                foregroundColor: AppColors.error700,
                padding: const EdgeInsets.symmetric(vertical: 16),
                minimumSize: const Size(0, 56),
              ),
              icon: const Icon(Icons.check_circle),
              label: const Text('Acknowledge Alert'),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildAcknowledgedState(
    BuildContext context, {
    required ColorScheme colorScheme,
    required TextTheme textTheme,
  }) {
    return ExcludeSemantics(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(
            Icons.check_circle,
            color: AppColors.success700,
            size: 72,
          ),
          const SizedBox(height: 16),
          Text(
            'Alert Acknowledged',
            style: textTheme.headlineSmall?.copyWith(
              color: colorScheme.onSurface,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'This alert has been cleared.',
            style: textTheme.bodyLarge?.copyWith(
              color: colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            'You will be automatically redirected in 3 seconds.',
            style: textTheme.bodyMedium?.copyWith(
              color: colorScheme.onSurfaceVariant,
              fontStyle: FontStyle.italic,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}