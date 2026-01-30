// =============================================================================
// HEALTH LOG MODEL
// =============================================================================
// Domain model for health-related entries (mood, water, meals, blood pressure,
// etc.). Used by [HealthLogProvider] and displayed on Health Logs and
// Health Timeline screens. Add new [HealthLogType] values and optional fields
// as needed; update [formatHealthLogTypeDisplay] and provider typeColors.
// =============================================================================

/// Types of health logs that can be recorded.
enum HealthLogType {
  mood,
  symptoms,
  meals,
  water,
  exercise,
  sleep,
  general,
  bloodPressure,
  heartRate,
}

/// Display label for type (formatting only; add new enum values without relisting here).
String formatHealthLogTypeDisplay(HealthLogType type) {
  switch (type) {
    case HealthLogType.bloodPressure:
      return 'Blood Pressure';
    case HealthLogType.heartRate:
      return 'Heart Rate';
    default:
      return type.name[0].toUpperCase() + type.name.substring(1);
  }
}

/// Blood pressure category per AHA guidelines (systolic/diastolic mmHg).
String bloodPressureCategoryLabel(int systolic, int diastolic) {
  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive crisis';
  if (systolic >= 140 || diastolic >= 90) return 'High (Stage 2)';
  if (systolic >= 130 || diastolic >= 80) return 'High (Stage 1)';
  if (systolic >= 120 && diastolic < 80) return 'Elevated';
  return 'Normal';
}

/// Heart rate category for resting adult (bpm).
String heartRateCategoryLabel(int bpm) {
  if (bpm < 60) return 'Bradycardia';
  if (bpm <= 100) return 'Normal';
  return 'Tachycardia';
}

/// Health log model for quick logs and daily entries.
///
/// [type] determines which UI and validation apply (e.g. water goal, BP fields).
/// [dateOnly] is used for "today" filtering; [hasProgress] / [progressRatio] for
/// water progress bars. Blood pressure and heart rate use the category label
/// helpers for display.
class HealthLog {
  final String id;
  final HealthLogType type;
  final String description;
  final String? note;
  final DateTime createdAt;
  final String? emoji;
  /// For water type: running total and delta for this entry; [waterGoal] for progress.
  final double? waterTotal;
  final double? waterDelta;
  final double? waterGoal;
  final double? sleepHours;
  /// Blood pressure (mmHg); used with [bloodPressureCategoryLabel].
  final int? systolic;
  final int? diastolic;
  final int? heartRateBpm;

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
    this.systolic,
    this.diastolic,
    this.heartRateBpm,
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
    int? systolic,
    int? diastolic,
    int? heartRateBpm,
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
      systolic: systolic ?? this.systolic,
      diastolic: diastolic ?? this.diastolic,
      heartRateBpm: heartRateBpm ?? this.heartRateBpm,
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
