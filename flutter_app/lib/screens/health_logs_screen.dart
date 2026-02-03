import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/health_log.dart';
import '../providers/health_log_provider.dart';
import '../widgets/app_bottom_nav_bar.dart';
import 'health_log_add_screen.dart';

// =============================================================================
// HEALTH LOGS SCREEN
// =============================================================================
// Shows "Latest by type" (one card per [HealthLogType] for today from
// [HealthLogProvider.latestByType]) and a Quick Log grid. Tapping a card or
// quick log opens [HealthLogAddScreen]. Add new types to [quickLogOptions] and
// [HealthLogProvider.typeColors] when extending.
// =============================================================================

/// Health Logs screen with quick log options and today's entries.
class HealthLogsScreen extends StatelessWidget {
  const HealthLogsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final provider = context.watch<HealthLogProvider>();
    final latestByType = provider.latestByType;
    final scaffoldBackground = theme.scaffoldBackgroundColor;

    final quickLogOptions = <_QuickLogOption>[
      _QuickLogOption(
        type: HealthLogType.mood,
        label: 'Mood',
        icon: Icons.emoji_emotions,
      ),
      _QuickLogOption(
        type: HealthLogType.symptoms,
        label: 'Symptoms',
        icon: Icons.monitor_heart,
      ),
      _QuickLogOption(
        type: HealthLogType.meals,
        label: 'Meals',
        icon: Icons.restaurant,
      ),
      _QuickLogOption(
        type: HealthLogType.water,
        label: 'Water',
        icon: Icons.water_drop,
      ),
      _QuickLogOption(
        type: HealthLogType.exercise,
        label: 'Exercise',
        icon: Icons.favorite,
      ),
      _QuickLogOption(
        type: HealthLogType.sleep,
        label: 'Sleep',
        icon: Icons.bedtime,
      ),
      _QuickLogOption(
        type: HealthLogType.bloodPressure,
        label: 'Blood Pressure',
        icon: Icons.monitor_heart_outlined,
      ),
      _QuickLogOption(
        type: HealthLogType.heartRate,
        label: 'Heart Rate',
        icon: Icons.speed,
      ),
      _QuickLogOption(
        type: HealthLogType.general,
        label: 'General',
        icon: Icons.description,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Health Logs',
          style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              child: SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () async {
                    final result = await Navigator.push<HealthLog>(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const HealthLogAddScreen(
                          initialType: HealthLogType.general,
                        ),
                      ),
                    );
                    if (result != null && context.mounted) {
                      context.read<HealthLogProvider>().addLog(result);
                    }
                  },
                  style: FilledButton.styleFrom(
                    backgroundColor: colorScheme.primary,
                    foregroundColor: colorScheme.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    minimumSize: const Size(0, 48),
                  ),
                  child: const Text('Add a Log'),
                ),
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Quick Log Options
                    Container(
                      decoration: BoxDecoration(
                        color: scaffoldBackground,
                        border: Border(
                          bottom: BorderSide(
                            color: colorScheme.outline,
                            width: 1,
                          ),
                        ),
                      ),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Quick Log',
                            style: textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 12),
                          LayoutBuilder(
                            builder: (context, constraints) {
                              const spacing = 8.0;
                              const minButtonWidth = 100.0;
                              const maxButtonWidth = 100.0;
                              final width = constraints.maxWidth;
                              // Max columns so each cell >= 48px; max so each cell <= 200px.
                              final colsForMin = (width + spacing) ~/ (minButtonWidth + spacing);
                              final colsForMax = (width + spacing) ~/ (maxButtonWidth + spacing);
                              final crossAxisCount = (colsForMax >= 1)
                                  ? colsForMax.clamp(1, colsForMin)
                                  : 1;
                              return GridView.count(
                                crossAxisCount: crossAxisCount,
                                crossAxisSpacing: spacing,
                                mainAxisSpacing: spacing,
                                childAspectRatio: 1.0,
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                children: quickLogOptions
                                    .map(
                                      (option) => Center(
                                        child: ConstrainedBox(
                                          constraints: const BoxConstraints(
                                            minWidth: minButtonWidth,
                                            maxWidth: maxButtonWidth,
                                            minHeight: minButtonWidth,
                                            maxHeight: maxButtonWidth,
                                          ),
                                          child: _QuickLogButton(option: option),
                                        ),
                                      ),
                                    )
                                    .toList(),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                    // Latest by type (one card per type; history is on Health Timeline)
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Latest by type',
                            style: textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 12),
                          ...quickLogOptions.map(
                            (option) => Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: _LatestLogCard(
                                type: option.type,
                                label: option.label,
                                icon: option.icon,
                                latestLog: latestByType[option.type],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNavBar(currentIndex: kPatientNavHealth),
    );
  }
}

class _QuickLogOption {
  final HealthLogType type;
  final String label;
  final IconData icon;

  const _QuickLogOption({
    required this.type,
    required this.label,
    required this.icon,
  });
}

class _QuickLogButton extends StatelessWidget {
  final _QuickLogOption option;

  const _QuickLogButton({required this.option});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final (bg, fg) = HealthLogProvider.typeColors(option.type);

    return Semantics(
      label: '${option.label} quick log, button',
      button: true,
      child: OutlinedButton(
        onPressed: () async {
          final result = await Navigator.push<HealthLog>(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  HealthLogAddScreen(initialType: option.type),
            ),
          );
          if (result != null && context.mounted) {
            context.read<HealthLogProvider>().addLog(result);
          }
        },
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
          minimumSize: const Size(0, 0),
          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
          side: BorderSide(color: colorScheme.outline, width: 1.5),
          backgroundColor: colorScheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
              child: Icon(option.icon, color: fg, size: 20),
            ),
            const SizedBox(height: 6),
            Text(
              option.label,
              style: textTheme.labelSmall?.copyWith(
                color: colorScheme.onSurface,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Card showing latest log for a type, or placeholder. Tappable to add/update.
class _LatestLogCard extends StatelessWidget {
  final HealthLogType type;
  final String label;
  final IconData icon;
  final HealthLog? latestLog;

  const _LatestLogCard({
    required this.type,
    required this.label,
    required this.icon,
    required this.latestLog,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: latestLog != null
          ? '$label, ${latestLog!.description}'
          : 'No $label logged, tap to add',
      button: true,
      child: InkWell(
        onTap: () async {
          final result = await Navigator.push<HealthLog>(
            context,
            MaterialPageRoute(
              builder: (context) => HealthLogAddScreen(initialType: type),
            ),
          );
          if (result != null && context.mounted) {
            context.read<HealthLogProvider>().addLog(result);
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: latestLog != null
            ? _HealthLogCard(log: latestLog!)
            : _PlaceholderCard(type: type, label: label, icon: icon),
      ),
    );
  }
}

class _PlaceholderCard extends StatelessWidget {
  final HealthLogType type;
  final String label;
  final IconData icon;

  const _PlaceholderCard({
    required this.type,
    required this.label,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final (bg, fg) = HealthLogProvider.typeColors(type);
    return Container(
      decoration: BoxDecoration(
        color: colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colorScheme.outline, width: 1),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
            child: Icon(icon, color: fg, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'No $label logged',
              style: textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ),
          Icon(Icons.add_circle_outline, color: colorScheme.primary, size: 24),
        ],
      ),
    );
  }
}

class _HealthLogCard extends StatelessWidget {
  final HealthLog log;

  const _HealthLogCard({required this.log});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    final (bg, fg) = HealthLogProvider.typeColors(log.type);
    final timeLabel = DateFormat.jm().format(log.createdAt);

    final semanticsLabel = log.note == null || log.note!.isEmpty
        ? '${log.description}, $timeLabel'
        : '${log.description}, ${log.note}, $timeLabel';

    String displayDescription = log.description;
    String? statusChip;
    if (log.type == HealthLogType.bloodPressure &&
        log.systolic != null &&
        log.diastolic != null) {
      statusChip = bloodPressureCategoryLabel(log.systolic!, log.diastolic!);
    } else if (log.type == HealthLogType.heartRate &&
        log.heartRateBpm != null) {
      statusChip = heartRateCategoryLabel(log.heartRateBpm!);
    }

    return Semantics(
      label: semanticsLabel,
      child: Container(
        decoration: BoxDecoration(
          color: colorScheme.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: colorScheme.outline, width: 1),
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
              child: Icon(_iconForType(log.type), color: fg, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    displayDescription,
                    style: textTheme.titleMedium?.copyWith(
                      color: colorScheme.onSurface,
                    ),
                  ),
                  if (statusChip != null) ...[
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: colorScheme.secondaryContainer,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        statusChip,
                        style: textTheme.labelSmall?.copyWith(
                          color: colorScheme.onPrimaryContainer,
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 4),
                  if (log.note != null && log.note!.isNotEmpty)
                    Text(
                      log.note!,
                      style: textTheme.bodySmall?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  if (log.note != null && log.note!.isNotEmpty)
                    const SizedBox(height: 4),
                  Text(
                    timeLabel,
                    style: textTheme.bodySmall?.copyWith(
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  if (log.hasProgress) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          'Goal: ${log.waterGoal!.toStringAsFixed(0)} oz',
                          style: textTheme.bodySmall?.copyWith(
                            color: colorScheme.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: log.progressRatio,
                              minHeight: 6,
                              backgroundColor: colorScheme.outline,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                colorScheme.primary,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            if (log.emoji != null && log.emoji!.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(left: 8),
                child: Text(
                  log.emoji!,
                  style: textTheme.headlineLarge,
                ),
              ),
          ],
        ),
      ),
    );
  }

  IconData _iconForType(HealthLogType type) {
    switch (type) {
      case HealthLogType.mood:
        return Icons.emoji_emotions;
      case HealthLogType.symptoms:
        return Icons.monitor_heart;
      case HealthLogType.meals:
        return Icons.restaurant;
      case HealthLogType.water:
        return Icons.water_drop;
      case HealthLogType.exercise:
        return Icons.favorite;
      case HealthLogType.sleep:
        return Icons.bedtime;
      case HealthLogType.general:
        return Icons.description;
      case HealthLogType.bloodPressure:
        return Icons.monitor_heart_outlined;
      case HealthLogType.heartRate:
        return Icons.favorite;
    }
  }
}
