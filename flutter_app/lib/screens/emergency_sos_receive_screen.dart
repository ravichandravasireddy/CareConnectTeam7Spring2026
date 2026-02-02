import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

// =============================================================================
// EMERGENCY SOS RECEIVE SCREEN
// =============================================================================
// Used when a caregiver receives an SOS alert from a patient.
// =============================================================================

class EmergencySOSReceiveScreen extends StatelessWidget {
  const EmergencySOSReceiveScreen({super.key});

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
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'SOS Alert',
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
            _AlertBanner(
              title: 'EMERGENCY SOS',
              message: 'Immediate attention required',
            ),
            const SizedBox(height: 16),
            Semantics(
              header: true,
              child: Text(
                'Incoming Emergency Alert',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'A patient has requested immediate assistance.',
              style: textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                _StatusChip(
                  label: 'VISUAL ALERT',
                  backgroundColor: AppColors.error100,
                  textColor: AppColors.error700,
                ),
                const SizedBox(width: 8),
                _StatusChip(
                  label: 'HIGH PRIORITY',
                  backgroundColor: AppColors.warning100,
                  textColor: AppColors.warning700,
                ),
              ],
            ),
            const SizedBox(height: 20),
            _InfoCard(
              title: 'Patient',
              value: 'Robert Williams',
            ),
            const SizedBox(height: 12),
            _InfoCard(
              title: 'Location',
              value: '123 Maple Street, Springfield',
            ),
            const SizedBox(height: 12),
            _InfoCard(
              title: 'Time',
              value: 'Just now',
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.error100,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.error500.withValues(alpha: 0.5),
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.warning_amber_rounded,
                      color: AppColors.error700, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Emergency alert is active. Please respond immediately.',
                      style: textTheme.bodySmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Recommended Actions',
              style: textTheme.titleMedium?.copyWith(
                color: colorScheme.onSurface,
              ),
            ),
            const SizedBox(height: 8),
            _ActionStep(
              icon: Icons.call,
              label: 'Call the patient immediately',
            ),
            const SizedBox(height: 8),
            _ActionStep(
              icon: Icons.message,
              label: 'Send a text update if call fails',
            ),
            const SizedBox(height: 8),
            _ActionStep(
              icon: Icons.location_on,
              label: 'Confirm location and dispatch help',
            ),
            const SizedBox(height: 24),
            Semantics(
              label: 'Call patient, button',
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
                  icon: const Icon(Icons.call),
                  label: const Text('Call Patient'),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Semantics(
              label: 'Send text message to patient, button',
              button: true,
              child: SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: () {},
                  style: FilledButton.styleFrom(
                    backgroundColor: colorScheme.secondary,
                    foregroundColor: colorScheme.onSecondary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(0, 48),
                  ),
                  icon: const Icon(Icons.message),
                  label: const Text('Send Text Update'),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Semantics(
              label: 'Mark as resolved, button',
              button: true,
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    foregroundColor: colorScheme.error,
                    side: BorderSide(color: colorScheme.error),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(0, 48),
                  ),
                  icon: const Icon(Icons.check_circle),
                  label: const Text('Mark as Resolved'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AlertBanner extends StatelessWidget {
  final String title;
  final String message;

  const _AlertBanner({
    required this.title,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Semantics(
      label: '$title. $message.',
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.error100,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: AppColors.error500,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.error500,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.sos,
                color: AppColors.white,
                size: 26,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    message,
                    style: textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.warning_amber_rounded,
              color: AppColors.error700,
              size: 28,
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  final Color backgroundColor;
  final Color textColor;

  const _StatusChip({
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
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: textTheme.labelSmall?.copyWith(
          color: textColor,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _ActionStep extends StatelessWidget {
  final IconData icon;
  final String label;

  const _ActionStep({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: colorScheme.surfaceContainer,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: colorScheme.primary, size: 18),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: textTheme.bodyLarge?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
        ),
      ],
    );
  }
}

class _InfoCard extends StatelessWidget {
  final String title;
  final String value;

  const _InfoCard({
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ),
          Text(
            value,
            style: textTheme.titleMedium?.copyWith(
              color: colorScheme.onSurface,
            ),
          ),
        ],
      ),
    );
  }
}
