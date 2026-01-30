/// Types of health logs that can be recorded.
enum HealthLogType { mood, symptoms, meals, water, exercise, sleep, general }

/// Display label for type (formatting only; add new enum values without relisting here).
String formatHealthLogTypeDisplay(HealthLogType type) =>
    type.name[0].toUpperCase() + type.name.substring(1);

/// Health log model for quick logs and daily entries.
class HealthLog {
  final String id;
  final HealthLogType type;
  final String description;
  final String? note;
  final DateTime createdAt;
  final String? emoji;
  final double? waterTotal;
  final double? waterDelta;
  final double? waterGoal;
  final double? sleepHours;

  HealthLog({
    required this.id,
    required this.type,
    required this.description,
    required this.createdAt,
    this.note,
    this.emoji,
    this.waterTotal,
    this.waterDelta,
    this.waterGoal,
    this.sleepHours,
  });

  HealthLog copyWith({
    String? id,
    HealthLogType? type,
    String? description,
    String? note,
    DateTime? createdAt,
    String? emoji,
    double? waterTotal,
    double? waterDelta,
    double? waterGoal,
    double? sleepHours,
  }) {
    return HealthLog(
      id: id ?? this.id,
      type: type ?? this.type,
      description: description ?? this.description,
      createdAt: createdAt ?? this.createdAt,
      note: note ?? this.note,
      emoji: emoji ?? this.emoji,
      waterTotal: waterTotal ?? this.waterTotal,
      waterDelta: waterDelta ?? this.waterDelta,
      waterGoal: waterGoal ?? this.waterGoal,
      sleepHours: sleepHours ?? this.sleepHours,
    );
  }

  /// Date-only (midnight) for filtering by calendar day.
  DateTime get dateOnly =>
      DateTime(createdAt.year, createdAt.month, createdAt.day);

  /// Whether this log has water progress information.
  bool get hasProgress => waterTotal != null && waterGoal != null;

  /// Clamp ratio between 0 and 1 for progress display.
  double get progressRatio {
    if (!hasProgress || waterGoal == 0) return 0;
    return (waterTotal! / waterGoal!).clamp(0, 1);
  }
}
