// =============================================================================
// TASK DETAILS SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Task detail rendering and action button presence.
//
// KEY CONCEPTS COVERED:
// 1. Rendering task metadata and sections
// 2. Status pill and action button presence
// 3. App bar title validation
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/models/task.dart';
import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/task_details_screen.dart';
import 'package:flutter_app/theme/app_colors.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness(Task task) {
    final authProvider = AuthProvider()..setTestUser(UserRole.patient);

    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: MaterialApp(
        home: TaskDetailsScreen(task: task),
      ),
    );
  }

  group('TaskDetailsScreen Rendering', () {
    testWidgets('renders app bar title and task content', (tester) async {
      final task = Task(
        id: 't1',
        title: 'Morning Medication',
        description: 'Take one tablet with water',
        date: DateTime(2025, 4, 12, 9, 30),
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );

      await tester.pumpWidget(createTestHarness(task));

      expect(find.widgetWithText(AppBar, 'Task Details'), findsOneWidget);
      expect(find.text('Morning Medication'), findsOneWidget);
      expect(find.text('Take one tablet with water'), findsWidgets);
      expect(find.text('Medication'), findsOneWidget);
      expect(find.text('Instructions'), findsOneWidget);

      await tester.ensureVisible(
        find.text('Mark as Complete', skipOffstage: false),
      );
      await tester.pump();

      expect(find.text('Mark as Complete'), findsOneWidget);
      expect(find.text('Snooze'), findsOneWidget);
      expect(find.text('Skip Today'), findsOneWidget);
    });

    testWidgets('shows due status pill text', (tester) async {
      final task = Task(
        id: 't2',
        title: 'BP Check',
        description: 'Record blood pressure',
        date: DateTime(2025, 4, 12, 8, 0),
        icon: Icons.monitor_heart,
        iconBackground: AppColors.accent100,
        iconColor: AppColors.accent600,
      );

      await tester.pumpWidget(createTestHarness(task));

      expect(find.textContaining('DUE'), findsOneWidget);
    });
  });
}
