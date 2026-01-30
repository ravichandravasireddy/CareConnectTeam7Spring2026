import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/health_log.dart';
import '../providers/health_log_provider.dart';
import '../theme/app_colors.dart';
import 'health_log_add_screen.dart';

/// Health Logs screen with quick log options and today's entries.
class HealthLogsScreen extends StatelessWidget {
  const HealthLogsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final provider = context.watch<HealthLogProvider>();
    final todayLogs = provider.logsForDate(DateTime.now());
    final scaffoldBackground = Theme.of(context).scaffoldBackgroundColor;

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
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Health Logs',
          style: TextStyle(
            color: colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
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
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 12),
                          GridView.count(
                            crossAxisCount: 3,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            children: quickLogOptions
                                .map(
                                  (option) => _QuickLogButton(option: option),
                                )
                                .toList(),
                          ),
                        ],
                      ),
                    ),
                    // Today's Logs
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Today's Logs",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: colorScheme.onSurface,
                            ),
                          ),
                          const SizedBox(height: 12),
                          if (todayLogs.isEmpty)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: colorScheme.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: colorScheme.outline,
                                  width: 1,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'No logs yet today. Use Quick Log to add one.',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ),
                            )
                          else
                            ...todayLogs.map(
                              (log) => Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: _HealthLogCard(log: log),
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
    final colorScheme = Theme.of(context).colorScheme;
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
          padding: const EdgeInsets.symmetric(vertical: 12),
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
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurface,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HealthLogCard extends StatelessWidget {
  final HealthLog log;

  const _HealthLogCard({required this.log});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final (bg, fg) = HealthLogProvider.typeColors(log.type);
    final timeLabel = DateFormat.jm().format(log.createdAt);

    final semanticsLabel = log.note == null || log.note!.isEmpty
        ? '${log.description}, $timeLabel'
        : '${log.description}, ${log.note}, $timeLabel';

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
                    log.description,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (log.note != null && log.note!.isNotEmpty)
                    Text(
                      log.note!,
                      style: TextStyle(
                        fontSize: 13,
                        color: colorScheme.onSurfaceVariant,
                      ),
                    ),
                  const SizedBox(height: 4),
                  Text(
                    timeLabel,
                    style: TextStyle(
                      fontSize: 12,
                      color: colorScheme.onSurfaceVariant,
                    ),
                  ),
                  if (log.hasProgress) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Text(
                          'Goal: ${log.waterGoal!.toStringAsFixed(0)} oz',
                          style: TextStyle(
                            fontSize: 11,
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
                              backgroundColor: AppColors.gray300,
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
                child: Text(log.emoji!, style: const TextStyle(fontSize: 22)),
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
    }
  }
}
