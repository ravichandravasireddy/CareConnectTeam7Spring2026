// =============================================================================
// CAREGIVER TASK MANAGEMENT SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Task management rendering and navigation.
//
// KEY CONCEPTS COVERED:
// 1. Rendering overdue tasks card
// 2. Task detail navigation
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/caregiver_task_management_screen.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness() {
    final authProvider = AuthProvider()..setTestUser(UserRole.caregiver);

    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: const MaterialApp(home: CaregiverTaskManagementScreen()),
    );
  }

  group('CaregiverTaskManagementScreen', () {
    testWidgets('renders overdue tasks card', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Tasks'), findsWidgets);
      expect(find.text('Overdue Tasks (2)'), findsOneWidget);
      expect(find.text('Notify'), findsOneWidget);
    });

    testWidgets('tapping overdue task opens task details', (tester) async {
      await tester.pumpWidget(createTestHarness());

      await tester.tap(find.textContaining('Medication reminder:'));
      await tester.pumpAndSettle();

      expect(find.text('Task Details'), findsOneWidget);
    });
  });
}
