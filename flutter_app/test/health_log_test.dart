// =============================================================================
// HEALTH LOG MODEL UNIT TESTS
// =============================================================================
// Tests for HealthLog, HealthLogType, formatHealthLogTypeDisplay,
// dateOnly, hasProgress, progressRatio, and copyWith.
// =============================================================================

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/health_log.dart';

void main() {
  group('HealthLogType and formatHealthLogTypeDisplay', () {
    test('formatHealthLogTypeDisplay returns title case for each type', () {
      expect(formatHealthLogTypeDisplay(HealthLogType.mood), 'Mood');
      expect(formatHealthLogTypeDisplay(HealthLogType.symptoms), 'Symptoms');
      expect(formatHealthLogTypeDisplay(HealthLogType.meals), 'Meals');
      expect(formatHealthLogTypeDisplay(HealthLogType.water), 'Water');
      expect(formatHealthLogTypeDisplay(HealthLogType.exercise), 'Exercise');
      expect(formatHealthLogTypeDisplay(HealthLogType.sleep), 'Sleep');
      expect(formatHealthLogTypeDisplay(HealthLogType.general), 'General');
      expect(formatHealthLogTypeDisplay(HealthLogType.bloodPressure), 'Blood Pressure');
      expect(formatHealthLogTypeDisplay(HealthLogType.heartRate), 'Heart Rate');
    });

    test('HealthLogType has all expected values', () {
      expect(HealthLogType.values.length, 9);
      expect(HealthLogType.values, contains(HealthLogType.mood));
      expect(HealthLogType.values, contains(HealthLogType.general));
      expect(HealthLogType.values, contains(HealthLogType.bloodPressure));
      expect(HealthLogType.values, contains(HealthLogType.heartRate));
    });
  });

  group('bloodPressureCategoryLabel', () {
    test('returns Normal for <120 and <80', () {
      expect(bloodPressureCategoryLabel(119, 79), 'Normal');
    });
    test('returns Elevated for 120-129 systolic and diastolic <80', () {
      expect(bloodPressureCategoryLabel(120, 79), 'Elevated');
      expect(bloodPressureCategoryLabel(129, 79), 'Elevated');
    });
    test('returns High Stage 1 for 130-139 or 80-89', () {
      expect(bloodPressureCategoryLabel(130, 80), 'High (Stage 1)');
      expect(bloodPressureCategoryLabel(139, 89), 'High (Stage 1)');
    });
    test('returns High Stage 2 for >=140 or >=90', () {
      expect(bloodPressureCategoryLabel(140, 90), 'High (Stage 2)');
    });
    test('returns Hypertensive crisis for >=180 or >=120', () {
      expect(bloodPressureCategoryLabel(180, 120), 'Hypertensive crisis');
    });
  });

  group('heartRateCategoryLabel', () {
    test('returns Bradycardia for <60 bpm', () {
      expect(heartRateCategoryLabel(59), 'Bradycardia');
    });
    test('returns Normal for 60-100 bpm', () {
      expect(heartRateCategoryLabel(60), 'Normal');
      expect(heartRateCategoryLabel(100), 'Normal');
    });
    test('returns Tachycardia for >100 bpm', () {
      expect(heartRateCategoryLabel(101), 'Tachycardia');
    });
  });

  group('HealthLog construction', () {
    test('stores required fields', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime(2025, 1, 15, 10, 30),
      );
      expect(log.id, '1');
      expect(log.type, HealthLogType.mood);
      expect(log.description, 'Happy');
      expect(log.createdAt, DateTime(2025, 1, 15, 10, 30));
      expect(log.note, isNull);
      expect(log.emoji, isNull);
      expect(log.waterTotal, isNull);
      expect(log.waterDelta, isNull);
      expect(log.waterGoal, isNull);
      expect(log.sleepHours, isNull);
    });

    test('stores optional fields when provided', () {
      final log = HealthLog(
        id: '2',
        type: HealthLogType.water,
        description: '48 oz',
        createdAt: DateTime(2025, 1, 15, 9, 0),
        note: 'Morning water',
        emoji: '💧',
        waterTotal: 48,
        waterDelta: 16,
        waterGoal: 64,
        sleepHours: 7.5,
      );
      expect(log.note, 'Morning water');
      expect(log.emoji, '💧');
      expect(log.waterTotal, 48);
      expect(log.waterDelta, 16);
      expect(log.waterGoal, 64);
      expect(log.sleepHours, 7.5);
    });
  });

  group('HealthLog dateOnly', () {
    test('returns same calendar day at midnight', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.mood,
        description: 'Ok',
        createdAt: DateTime(2025, 3, 22, 14, 45),
      );
      final d = log.dateOnly;
      expect(d.year, 2025);
      expect(d.month, 3);
      expect(d.day, 22);
      expect(d.hour, 0);
      expect(d.minute, 0);
    });

    test('two logs on same day have equal dateOnly', () {
      final log1 = HealthLog(
        id: 'a',
        type: HealthLogType.mood,
        description: 'A',
        createdAt: DateTime(2025, 2, 10, 8, 0),
      );
      final log2 = HealthLog(
        id: 'b',
        type: HealthLogType.mood,
        description: 'B',
        createdAt: DateTime(2025, 2, 10, 20, 0),
      );
      expect(log1.dateOnly, log2.dateOnly);
    });
  });

  group('HealthLog hasProgress', () {
    test('returns false when waterTotal is null', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterGoal: 64,
      );
      expect(log.hasProgress, false);
    });

    test('returns false when waterGoal is null', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 32,
      );
      expect(log.hasProgress, false);
    });

    test('returns true when both waterTotal and waterGoal are set', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 48,
        waterGoal: 64,
      );
      expect(log.hasProgress, true);
    });

    test('returns false for non-water log with nulls', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.mood,
        description: 'Mood',
        createdAt: DateTime.now(),
      );
      expect(log.hasProgress, false);
    });
  });

  group('HealthLog progressRatio', () {
    test('returns 0 when hasProgress is false', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
      );
      expect(log.progressRatio, 0);
    });

    test('returns 0 when waterGoal is 0', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 50,
        waterGoal: 0,
      );
      expect(log.progressRatio, 0);
    });

    test('returns correct ratio when total < goal', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 32,
        waterGoal: 64,
      );
      expect(log.progressRatio, 0.5);
    });

    test('returns 1 when total >= goal (clamped)', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 80,
        waterGoal: 64,
      );
      expect(log.progressRatio, 1);
    });

    test('returns 0 when total is negative (clamped)', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: -10,
        waterGoal: 64,
      );
      expect(log.progressRatio, 0);
    });

    test('returns 1 when total equals goal', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 64,
        waterGoal: 64,
      );
      expect(log.progressRatio, 1);
    });

    test('returns 0 when total is 0 and goal is positive', () {
      final log = HealthLog(
        id: '1',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 0,
        waterGoal: 64,
      );
      expect(log.progressRatio, 0);
    });
  });

  group('HealthLog copyWith', () {
    late HealthLog base;

    setUp(() {
      base = HealthLog(
        id: '1',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime(2025, 1, 15, 10, 0),
        note: 'Note',
        emoji: '😊',
      );
    });

    test('with no arguments returns equal log', () {
      final copied = base.copyWith();
      expect(copied.id, base.id);
      expect(copied.type, base.type);
      expect(copied.description, base.description);
      expect(copied.note, base.note);
      expect(copied.emoji, base.emoji);
    });

    test('overrides only id', () {
      final copied = base.copyWith(id: '2');
      expect(copied.id, '2');
      expect(copied.description, base.description);
    });

    test('overrides only type', () {
      final copied = base.copyWith(type: HealthLogType.water);
      expect(copied.type, HealthLogType.water);
      expect(copied.id, base.id);
    });

    test('overrides only description', () {
      final copied = base.copyWith(description: 'Sad');
      expect(copied.description, 'Sad');
    });

    test('overrides only createdAt', () {
      final newDate = DateTime(2025, 2, 20, 12, 0);
      final copied = base.copyWith(createdAt: newDate);
      expect(copied.createdAt, newDate);
      expect(copied.dateOnly, DateTime(2025, 2, 20));
    });

    test('overrides optional fields', () {
      final copied = base.copyWith(
        note: 'New note',
        emoji: '😢',
        waterTotal: 32,
        waterGoal: 64,
      );
      expect(copied.note, 'New note');
      expect(copied.emoji, '😢');
      expect(copied.waterTotal, 32);
      expect(copied.waterGoal, 64);
    });

    test('overrides waterDelta and sleepHours', () {
      final withWater = HealthLog(
        id: 'w',
        type: HealthLogType.water,
        description: 'Water',
        createdAt: DateTime.now(),
        waterTotal: 16,
        waterGoal: 64,
      );
      final copied = withWater.copyWith(waterDelta: 8, sleepHours: 6.5);
      expect(copied.waterDelta, 8);
      expect(copied.sleepHours, 6.5);
    });

    test('copyWith does not mutate original', () {
      base.copyWith(description: 'Changed', type: HealthLogType.symptoms);
      expect(base.description, 'Happy');
      expect(base.type, HealthLogType.mood);
    });
  });
}
