import 'package:flutter/material.dart';
import '../models/health_log.dart';
import '../theme/app_colors.dart';

// =============================================================================
// HEALTH LOG PROVIDER
// =============================================================================
// Holds all [HealthLog] entries; used by Health Logs screen, Health Log Add
// screen, and [HealthTimelineProvider]. [latestByType] drives "Latest by type"
// cards (today only). Add new [HealthLogType] handling in [typeColors] and
// [addWaterDelta] / add-log flows as needed.
// =============================================================================

/// Provider for managing health logs app-wide.
class HealthLogProvider with ChangeNotifier {
  final List<HealthLog> _logs = [];
  static const double defaultWaterGoalOz = 64;

  List<HealthLog> get logs => List.unmodifiable(_logs);

  /// Latest log per type for the current day only (most recent per [HealthLogType]).
  /// Used by Health Logs screen "Latest by type" section.
  Map<HealthLogType, HealthLog> get latestByType {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final todayLogs =
        _logs.where((log) => log.dateOnly == today).toList();
    final map = <HealthLogType, HealthLog>{};
    for (final log in todayLogs) {
      if (!map.containsKey(log.type) ||
          log.createdAt.isAfter(map[log.type]!.createdAt)) {
        map[log.type] = log;
      }
    }
    return map;
  }

  HealthLogProvider() {
    _initializeMockLogs();
  }

  void _initializeMockLogs() {
    final now = DateTime.now();
    _logs.addAll([
      HealthLog(
        id: 'mood-1',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime(now.year, now.month, now.day, 10, 30),
        emoji: '😊',
        note: 'Feeling energized this morning.',
      ),
      HealthLog(
        id: 'meal-1',
        type: HealthLogType.meals,
        description: 'Oatmeal with berries',
        createdAt: DateTime(now.year, now.month, now.day, 8, 15),
      ),
      HealthLog(
        id: 'water-1',
        type: HealthLogType.water,
        description: 'Added 48 oz. Total 48 oz',
        createdAt: DateTime(now.year, now.month, now.day, 9, 45),
        waterTotal: 48,
        waterDelta: 48,
        waterGoal: defaultWaterGoalOz,
      ),
      HealthLog(
        id: 'symptom-1',
        type: HealthLogType.symptoms,
        description: 'Mild headache',
        createdAt: DateTime(now.year, now.month, now.day, 9, 0),
      ),
      HealthLog(
        id: 'blood-pressure-1',
        type: HealthLogType.bloodPressure,
        description: 'Blood Pressure: 120/80 mmHg',
        createdAt: DateTime(now.year, now.month, now.day, 9, 0),
        systolic: 120,
        diastolic: 80,
      ),
    ]);
    _logs.sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  /// All logs for a given calendar day, newest first.
  List<HealthLog> logsForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    return _logs.where((log) => log.dateOnly == dateOnly).toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  void addLog(HealthLog log) {
    _logs.insert(0, log);
    notifyListeners();
  }

  double waterTotalForDate(DateTime date) {
    final dateOnly = DateTime(date.year, date.month, date.day);
    final waterLogs =
        _logs
            .where(
              (log) =>
                  log.type == HealthLogType.water && log.dateOnly == dateOnly,
            )
            .toList()
          ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    if (waterLogs.isEmpty) return 0;
    return waterLogs.first.waterTotal ?? 0;
  }

  /// Add a water log entry; computes running total and description. Returns the new log.
  HealthLog addWaterDelta({
    required double deltaOz,
    String? note,
    DateTime? createdAt,
  }) {
    final now = createdAt ?? DateTime.now();
    final currentTotal = waterTotalForDate(now);
    final double newTotal = (currentTotal + deltaOz).clamp(0, double.infinity);
    final description = deltaOz >= 0
      ? 'Added ${deltaOz.toStringAsFixed(0)} oz. Total ${newTotal.toStringAsFixed(0)} oz'
      : 'Removed ${deltaOz.abs().toStringAsFixed(0)} oz. Total ${newTotal.toStringAsFixed(0)} oz';

    final log = HealthLog(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      type: HealthLogType.water,
      description: description,
      createdAt: now,
      note: note,
      waterTotal: newTotal,
      waterDelta: deltaOz,
      waterGoal: defaultWaterGoalOz,
    );
    addLog(log);
    return log;
  }

  void removeLog(String id) {
    _logs.removeWhere((log) => log.id == id);
    notifyListeners();
  }

  void clearLogs() {
    _logs.clear();
    notifyListeners();
  }

  /// Default colors for quick log buttons by type.
  static (Color bg, Color fg) typeColors(HealthLogType type) {
    switch (type) {
      case HealthLogType.mood:
        return (AppColors.success100, AppColors.success700);
      case HealthLogType.symptoms:
        return (AppColors.error100, AppColors.error700);
      case HealthLogType.meals:
        return (AppColors.warning100, AppColors.warning700);
      case HealthLogType.water:
        return (AppColors.info100, AppColors.info700);
      case HealthLogType.exercise:
        return (AppColors.secondary100, AppColors.secondary700);
      case HealthLogType.sleep:
        return (AppColors.accent100, AppColors.accent600);
      case HealthLogType.general:
        return (AppColors.gray100, AppColors.gray700);
      case HealthLogType.bloodPressure:
        return (AppColors.error100, AppColors.error700);
      case HealthLogType.heartRate:
        return (AppColors.primary100, AppColors.primary700);
    }
  }
}
