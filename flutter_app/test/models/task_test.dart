// =============================================================================
// TASK MODEL UNIT TESTS
// =============================================================================
// Tests for the Task model: construction, dateOnly/day getters,
// copyWith, and toJson.
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/task.dart';
import 'package:flutter_app/theme/app_colors.dart';

void main() {
  late Task baseTask;

  setUp(() {
    baseTask = Task(
      id: 'task-1',
      title: 'Morning Medication',
      date: DateTime(2025, 3, 15, 9, 0),
      icon: Icons.medication,
      iconBackground: AppColors.primary100,
      iconColor: AppColors.primary700,
    );
  });

  group('Task construction and properties', () {
    test('stores id, title, date, icon, and colors', () {
      expect(baseTask.id, 'task-1');
      expect(baseTask.title, 'Morning Medication');
      expect(baseTask.date, DateTime(2025, 3, 15, 9, 0));
      expect(baseTask.icon, Icons.medication);
      expect(baseTask.iconBackground, AppColors.primary100);
      expect(baseTask.iconColor, AppColors.primary700);
      expect(baseTask.completedAt, isNull);
      expect(baseTask.isCompleted, false);
    });

    test('stores completedAt when provided', () {
      final when = DateTime(2025, 3, 15, 9, 5);
      final task = Task(
        id: 't',
        title: 'T',
        date: DateTime(2025, 3, 15, 9, 0),
        icon: Icons.task,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
        completedAt: when,
      );
      expect(task.completedAt, when);
      expect(task.isCompleted, true);
    });

    test('date holds both day and time', () {
      final task = Task(
        id: 't',
        title: 'T',
        date: DateTime(2025, 1, 22, 14, 30),
        icon: Icons.task,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );
      expect(task.date.year, 2025);
      expect(task.date.month, 1);
      expect(task.date.day, 22);
      expect(task.date.hour, 14);
      expect(task.date.minute, 30);
    });
  });

  group('Task dateOnly getter', () {
    test('returns same calendar day at midnight', () {
      final dateOnly = baseTask.dateOnly;
      expect(dateOnly.year, 2025);
      expect(dateOnly.month, 3);
      expect(dateOnly.day, 15);
      expect(dateOnly.hour, 0);
      expect(dateOnly.minute, 0);
      expect(dateOnly.second, 0);
    });

    test('two tasks on same day have equal dateOnly', () {
      final task1 = Task(
        id: 'a',
        title: 'A',
        date: DateTime(2025, 2, 10, 9, 0),
        icon: Icons.task,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );
      final task2 = Task(
        id: 'b',
        title: 'B',
        date: DateTime(2025, 2, 10, 15, 30),
        icon: Icons.task,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );
      expect(task1.dateOnly, task2.dateOnly);
    });

    test('tasks on different days have different dateOnly', () {
      final task1 = Task(
        id: 'a',
        title: 'A',
        date: DateTime(2025, 2, 10, 9, 0),
        icon: Icons.task,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );
      final task2 = Task(
        id: 'b',
        title: 'B',
        date: DateTime(2025, 2, 11, 9, 0),
        icon: Icons.task,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );
      expect(task1.dateOnly, isNot(equals(task2.dateOnly)));
    });
  });

  group('Task day getter', () {
    test('returns date.day', () {
      expect(baseTask.day, 15);
    });

    test('day matches dateOnly.day', () {
      expect(baseTask.day, baseTask.dateOnly.day);
    });
  });

  group('Task copyWith', () {
    test('with no arguments returns equal task', () {
      final copied = baseTask.copyWith();
      expect(copied.id, baseTask.id);
      expect(copied.title, baseTask.title);
      expect(copied.date, baseTask.date);
      expect(copied.icon, baseTask.icon);
      expect(copied.iconBackground, baseTask.iconBackground);
      expect(copied.iconColor, baseTask.iconColor);
    });

    test('overrides only provided id', () {
      final copied = baseTask.copyWith(id: 'new-id');
      expect(copied.id, 'new-id');
      expect(copied.title, baseTask.title);
      expect(copied.date, baseTask.date);
    });

    test('overrides only provided title', () {
      final copied = baseTask.copyWith(title: 'New Title');
      expect(copied.id, baseTask.id);
      expect(copied.title, 'New Title');
      expect(copied.date, baseTask.date);
    });

    test('overrides only provided date', () {
      final newDate = DateTime(2025, 4, 20, 10, 15);
      final copied = baseTask.copyWith(date: newDate);
      expect(copied.id, baseTask.id);
      expect(copied.date, newDate);
      expect(copied.day, 20);
    });

    test('overrides multiple fields', () {
      final newDate = DateTime(2025, 5, 1, 8, 0);
      final copied = baseTask.copyWith(
        title: 'Updated',
        date: newDate,
        icon: Icons.alarm,
      );
      expect(copied.title, 'Updated');
      expect(copied.date, newDate);
      expect(copied.icon, Icons.alarm);
      expect(copied.iconBackground, baseTask.iconBackground);
    });

    test('overrides completedAt', () {
      final when = DateTime(2025, 3, 15, 9, 10);
      final copied = baseTask.copyWith(completedAt: when);
      expect(copied.completedAt, when);
      expect(copied.isCompleted, true);
    });

    test('copyWith does not mutate original', () {
      final originalDate = baseTask.date;
      baseTask.copyWith(title: 'Changed', date: DateTime(2030, 1, 1));
      expect(baseTask.title, 'Morning Medication');
      expect(baseTask.date, originalDate);
    });
  });

  group('Task toJson', () {
    test('contains id, title, and date keys', () {
      final json = baseTask.toJson();
      expect(json.containsKey('id'), true);
      expect(json.containsKey('title'), true);
      expect(json.containsKey('date'), true);
    });

    test('id and title are string values', () {
      final json = baseTask.toJson();
      expect(json['id'], 'task-1');
      expect(json['title'], 'Morning Medication');
    });

    test('date is ISO8601 string', () {
      final json = baseTask.toJson();
      final dateStr = json['date'] as String;
      expect(dateStr, contains('2025'));
      expect(dateStr, contains('03'));
      expect(dateStr, contains('15'));
      final parsed = DateTime.parse(dateStr);
      expect(parsed, baseTask.date);
    });

    test('toJson does not include icon/colors (not serialized)', () {
      final json = baseTask.toJson();
      expect(json.containsKey('icon'), false);
      expect(json.containsKey('iconBackground'), false);
      expect(json.containsKey('iconColor'), false);
    });

    test('toJson includes completedAt when set', () {
      final task = baseTask.copyWith(
        completedAt: DateTime(2025, 3, 15, 9, 5),
      );
      final json = task.toJson();
      expect(json.containsKey('completedAt'), true);
      expect(DateTime.parse(json['completedAt'] as String), task.completedAt);
    });
  });
}
