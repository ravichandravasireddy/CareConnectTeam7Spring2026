import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/task.dart';
import 'package:flutter_app/theme/app_colors.dart';

void main() {
  test('Task copyWith updates fields', () {
    final task = Task(
      id: 't1',
      title: 'Original',
      description: 'Desc',
      date: DateTime(2026, 2, 1, 10),
      patientName: 'Patient',
      icon: Icons.medication,
      iconBackground: AppColors.primary100,
      iconColor: AppColors.primary700,
    );

    final updated = task.copyWith(
      title: 'Updated',
      completedAt: DateTime(2026, 2, 1, 12),
    );

    expect(updated.title, 'Updated');
    expect(updated.completedAt, isNotNull);
    expect(updated.id, task.id);
  });

  test('Task isCompleted reflects completedAt', () {
    final pending = Task(
      id: 't2',
      title: 'Pending',
      description: 'Desc',
      date: DateTime(2026, 2, 1),
      patientName: 'Patient',
      icon: Icons.task,
      iconBackground: AppColors.primary100,
      iconColor: AppColors.primary700,
    );
    final completed = pending.copyWith(
      completedAt: DateTime(2026, 2, 1, 9),
    );

    expect(pending.isCompleted, isFalse);
    expect(completed.isCompleted, isTrue);
  });
}
