import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

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
    final patients = _mockPatients;

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
          'Patient Monitoring',
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
            Semantics(
              header: true,
              child: Text(
                'Overview',
                style: textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSurface,
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Monitor vitals, alerts, and recent check-ins.',
              style: textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            ...patients.map((patient) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _PatientMonitorCard(patient: patient),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}

class _PatientMonitorCard extends StatelessWidget {
  final PatientMonitorItem patient;

  const _PatientMonitorCard({required this.patient});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final statusColor = _statusColor(patient.alertLevel);
    final statusBg = _statusBackground(patient.alertLevel);

    return Semantics(
      label:
          '${patient.name}. Last check-in ${patient.lastCheckIn}. ${patient.alertLabel} alert.',
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: colorScheme.outline,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: AppColors.primary100,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.person,
                color: colorScheme.primary,
                size: 26,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    patient.name,
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Last check-in: ${patient.lastCheckIn}',
                    style: textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _VitalChip(
                        label: 'HR ${patient.heartRate} bpm',
                        colorScheme: colorScheme,
                        textTheme: textTheme,
                      ),
                      const SizedBox(width: 8),
                      _VitalChip(
                        label: 'BP ${patient.bloodPressure}',
                        colorScheme: colorScheme,
                        textTheme: textTheme,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: statusBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                patient.alertLabel,
                style: textTheme.labelSmall?.copyWith(
                  color: statusColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _statusColor(AlertLevel level) {
    switch (level) {
      case AlertLevel.normal:
        return AppColors.success700;
      case AlertLevel.watch:
        return AppColors.warning700;
      case AlertLevel.urgent:
        return AppColors.error700;
    }
  }

  Color _statusBackground(AlertLevel level) {
    switch (level) {
      case AlertLevel.normal:
        return AppColors.success100;
      case AlertLevel.watch:
        return AppColors.warning100;
      case AlertLevel.urgent:
        return AppColors.error100;
    }
  }
}

class _VitalChip extends StatelessWidget {
  final String label;
  final ColorScheme colorScheme;
  final TextTheme textTheme;

  const _VitalChip({
    required this.label,
    required this.colorScheme,
    required this.textTheme,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: colorScheme.surfaceContainer,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: colorScheme.outline),
      ),
      child: Text(
        label,
        style: textTheme.labelSmall?.copyWith(
          fontWeight: FontWeight.w400,
          color: colorScheme.onSurfaceVariant,
        ),
      ),
    );
  }
}

enum AlertLevel { normal, watch, urgent }

class PatientMonitorItem {
  final String name;
  final String lastCheckIn;
  final String heartRate;
  final String bloodPressure;
  final AlertLevel alertLevel;

  PatientMonitorItem({
    required this.name,
    required this.lastCheckIn,
    required this.heartRate,
    required this.bloodPressure,
    required this.alertLevel,
  });

  String get alertLabel {
    switch (alertLevel) {
      case AlertLevel.normal:
        return 'Normal';
      case AlertLevel.watch:
        return 'Watch';
      case AlertLevel.urgent:
        return 'Urgent';
    }
  }
}

final List<PatientMonitorItem> _mockPatients = [
  PatientMonitorItem(
    name: 'Robert Williams',
    lastCheckIn: 'Today, 9:12 AM',
    heartRate: '72',
    bloodPressure: '118/76',
    alertLevel: AlertLevel.normal,
  ),
  PatientMonitorItem(
    name: 'Mary Johnson',
    lastCheckIn: 'Yesterday, 6:45 PM',
    heartRate: '94',
    bloodPressure: '135/88',
    alertLevel: AlertLevel.watch,
  ),
  PatientMonitorItem(
    name: 'James Carter',
    lastCheckIn: 'Today, 7:30 AM',
    heartRate: '108',
    bloodPressure: '142/92',
    alertLevel: AlertLevel.urgent,
  ),
];
