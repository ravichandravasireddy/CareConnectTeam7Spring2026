// =============================================================================
// CAREGIVER DASHBOARD SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Dashboard rendering and quick stats content.
//
// KEY CONCEPTS COVERED:
// 1. Rendering dashboard header and greeting
// 2. Quick stats and tasks section presence
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/providers/task_provider.dart';
import 'package:flutter_app/screens/caregiver_dashboard.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness() {
    final authProvider = AuthProvider()..setTestUser(UserRole.caregiver);
    final taskProvider = TaskProvider();

    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
        ChangeNotifierProvider<TaskProvider>.value(value: taskProvider),
      ],
      child: const MaterialApp(home: CaregiverDashboardScreen()),
    );
  }

  group('CaregiverDashboardScreen', () {
    testWidgets('renders dashboard header and stats', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.widgetWithText(AppBar, 'Dashboard'), findsOneWidget);
      expect(find.textContaining('Good'), findsOneWidget);
      expect(find.text('Patients'), findsOneWidget);
      expect(find.text('Tasks'), findsWidgets);
      expect(find.text('Alerts'), findsOneWidget);
    });
  });
}
