// =============================================================================
// HEALTH LOG PROVIDER UNIT TESTS
// =============================================================================
// Tests for HealthLogProvider: logs, logsForDate, addLog, waterTotalForDate,
// addWaterDelta, removeLog, clearLogs, typeColors, defaultWaterGoalOz.
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/providers/health_log_provider.dart';
import 'package:flutter_app/models/health_log.dart';

void main() {
  group('HealthLogProvider constants and constructor', () {
    test('defaultWaterGoalOz is 64', () {
      expect(HealthLogProvider.defaultWaterGoalOz, 64);
    });

    test('constructor initializes with mock logs', () {
      final provider = HealthLogProvider();
      expect(provider.logs.isNotEmpty, isTrue);
      expect(provider.logs.length, 4);
    });

    test('mock logs are sorted by createdAt descending', () {
      final provider = HealthLogProvider();
      final logs = provider.logs;
      for (int i = 0; i < logs.length - 1; i++) {
        expect(
          logs[i].createdAt.compareTo(logs[i + 1].createdAt),
          greaterThanOrEqualTo(0),
        );
      }
    });
  });

  group('HealthLogProvider logs getter', () {
    test('returns unmodifiable list', () {
      final provider = HealthLogProvider();
      final list = provider.logs;
      expect(() => list.add(provider.logs.first), throwsUnsupportedError);
      expect(() => list.clear(), throwsUnsupportedError);
    });
  });

  group('HealthLogProvider logsForDate', () {
    test('returns today\'s logs when provider has mock data', () {
      final provider = HealthLogProvider();
      final today = DateTime.now();
      final forToday = provider.logsForDate(today);
      expect(forToday.isNotEmpty, isTrue);
      final dateOnly = DateTime(today.year, today.month, today.day);
      for (final log in forToday) {
        expect(log.dateOnly, dateOnly);
      }
    });

    test('returns list sorted by createdAt descending', () {
      final provider = HealthLogProvider();
      final forToday = provider.logsForDate(DateTime.now());
      for (int i = 0; i < forToday.length - 1; i++) {
        expect(
          forToday[i].createdAt.compareTo(forToday[i + 1].createdAt),
          greaterThanOrEqualTo(0),
        );
      }
    });

    test('returns empty for date with no logs', () {
      final provider = HealthLogProvider();
      final otherDate = DateTime(2000, 1, 1);
      expect(provider.logsForDate(otherDate), isEmpty);
    });

    test('returns only logs for requested date after adding different dates', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      final today = DateTime.now();
      final yesterday = today.subtract(const Duration(days: 1));
      provider.addLog(HealthLog(
        id: 't1',
        type: HealthLogType.mood,
        description: 'Today',
        createdAt: today,
      ));
      provider.addLog(HealthLog(
        id: 'y1',
        type: HealthLogType.mood,
        description: 'Yesterday',
        createdAt: yesterday,
      ));
      final todayList = provider.logsForDate(today);
      expect(todayList.length, 1);
      expect(todayList.first.description, 'Today');
      final yesterdayList = provider.logsForDate(yesterday);
      expect(yesterdayList.length, 1);
      expect(yesterdayList.first.description, 'Yesterday');
    });
  });

  group('HealthLogProvider addLog', () {
    test('inserts log at front', () {
      final provider = HealthLogProvider();
      final firstId = provider.logs.first.id;
      provider.addLog(HealthLog(
        id: 'new-first',
        type: HealthLogType.general,
        description: 'New First',
        createdAt: DateTime.now().add(const Duration(hours: 1)),
      ));
      expect(provider.logs.first.id, 'new-first');
      expect(provider.logs.first.description, 'New First');
    });

    test('notifies listeners', () {
      final provider = HealthLogProvider();
      var notified = false;
      provider.addListener(() => notified = true);
      provider.addLog(HealthLog(
        id: 'n',
        type: HealthLogType.general,
        description: 'N',
        createdAt: DateTime.now(),
      ));
      expect(notified, isTrue);
    });
  });

  group('HealthLogProvider waterTotalForDate', () {
    test('returns 0 when no water logs for date', () {
      final provider = HealthLogProvider();
      final empty = HealthLogProvider();
      empty.clearLogs();
      expect(empty.waterTotalForDate(DateTime.now()), 0);
    });

    test('returns most recent water total for date', () {
      final provider = HealthLogProvider();
      final today = DateTime.now();
      // Mock has one water log with 48 oz
      expect(provider.waterTotalForDate(today), 48);
    });

    test('returns correct total after addWaterDelta', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      final today = DateTime.now();
      provider.addWaterDelta(deltaOz: 16, createdAt: today);
      provider.addWaterDelta(deltaOz: 24, createdAt: today);
      // 16 then 24 -> total 16, then 40. Most recent is 40.
      expect(provider.waterTotalForDate(today), 40);
    });
  });

  group('HealthLogProvider addWaterDelta', () {
    test('adds positive delta and returns log with correct description', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      final log = provider.addWaterDelta(deltaOz: 32);
      expect(log.type, HealthLogType.water);
      expect(log.waterDelta, 32);
      expect(log.waterTotal, 32);
      expect(log.waterGoal, HealthLogProvider.defaultWaterGoalOz);
      expect(log.description, contains('Added 32 oz'));
      expect(log.description, contains('Total 32 oz'));
    });

    test('adds negative delta and clamps total at 0', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      provider.addWaterDelta(deltaOz: 20, createdAt: DateTime.now());
      final log = provider.addWaterDelta(deltaOz: -30, createdAt: DateTime.now());
      expect(log.waterTotal, 0);
      expect(log.description, contains('Removed 30 oz'));
    });

    test('passes note to created log', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      final log = provider.addWaterDelta(deltaOz: 8, note: 'Morning glass');
      expect(log.note, 'Morning glass');
    });

    test('uses provided createdAt', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      final when = DateTime(2025, 6, 15, 10, 0);
      final log = provider.addWaterDelta(deltaOz: 16, createdAt: when);
      expect(log.createdAt, when);
      expect(provider.waterTotalForDate(when), 16);
    });

    test('notifies listeners', () {
      final provider = HealthLogProvider();
      provider.clearLogs();
      var notified = false;
      provider.addListener(() => notified = true);
      provider.addWaterDelta(deltaOz: 8);
      expect(notified, isTrue);
    });
  });

  group('HealthLogProvider removeLog', () {
    test('removes log by id', () {
      final provider = HealthLogProvider();
      final id = provider.logs.first.id;
      final count = provider.logs.length;
      provider.removeLog(id);
      expect(provider.logs.length, count - 1);
      expect(provider.logs.any((l) => l.id == id), isFalse);
    });

    test('no-op when id not found', () {
      final provider = HealthLogProvider();
      final count = provider.logs.length;
      provider.removeLog('non-existent-id');
      expect(provider.logs.length, count);
    });

    test('notifies listeners', () {
      final provider = HealthLogProvider();
      final id = provider.logs.first.id;
      var notified = false;
      provider.addListener(() => notified = true);
      provider.removeLog(id);
      expect(notified, isTrue);
    });
  });

  group('HealthLogProvider clearLogs', () {
    test('clears all logs', () {
      final provider = HealthLogProvider();
      expect(provider.logs.isNotEmpty, isTrue);
      provider.clearLogs();
      expect(provider.logs, isEmpty);
    });

    test('notifies listeners', () {
      final provider = HealthLogProvider();
      var notified = false;
      provider.addListener(() => notified = true);
      provider.clearLogs();
      expect(notified, isTrue);
    });
  });

  group('HealthLogProvider typeColors', () {
    test('returns colors for mood', () {
      final (bg, fg) = HealthLogProvider.typeColors(HealthLogType.mood);
      expect(bg, isA<Color>());
      expect(fg, isA<Color>());
    });

    test('returns colors for each type', () {
      for (final type in HealthLogType.values) {
        final (bg, fg) = HealthLogProvider.typeColors(type);
        expect(bg, isA<Color>());
        expect(fg, isA<Color>());
      }
    });

    test('symptoms returns error colors', () {
      final (bg, fg) = HealthLogProvider.typeColors(HealthLogType.symptoms);
      expect(bg, isA<Color>());
      expect(fg, isA<Color>());
    });

    test('general returns gray colors', () {
      final (bg, fg) = HealthLogProvider.typeColors(HealthLogType.general);
      expect(bg, isA<Color>());
      expect(fg, isA<Color>());
    });
  });
}
