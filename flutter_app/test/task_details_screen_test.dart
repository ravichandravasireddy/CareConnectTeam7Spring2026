import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/task.dart';
import 'package:flutter_app/screens/task_details_screen.dart';
import 'package:flutter_app/theme/app_colors.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Task details screen displays task info', (tester) async {
    final task = Task(
      id: 't1',
      title: 'Medication check',
      description: 'Confirm morning medication taken with water.',
      date: DateTime(2026, 2, 1, 10),
      patientName: 'Robert Williams',
      icon: Icons.medication,
      iconBackground: AppColors.primary100,
      iconColor: AppColors.primary700,
    );

    await tester.pumpWidget(
      buildTestApp(TaskDetailsScreen(task: task)),
    );

    expect(find.text('Task Details'), findsOneWidget);
    expect(find.text('Medication check'), findsOneWidget);
    expect(find.text('Mark Complete'), findsOneWidget);
  });
}
