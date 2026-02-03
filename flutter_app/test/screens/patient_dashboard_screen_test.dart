// =============================================================================
// PATIENT DASHBOARD SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Verifies core sections and greeting on the patient dashboard.
//
// KEY CONCEPTS COVERED:
// 1. App bar and greeting
// 2. Upcoming tasks section
// 3. Appointments section
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/patient_dashboard_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('PatientDashboardScreen', () {
    testWidgets('renders core dashboard sections', (tester) async {
      final auth = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: auth,
          child: createTestHarness(child: const PatientDashboardScreen()),
        ),
      );

      expect(find.widgetWithText(AppBar, 'Home'), findsOneWidget);
      expect(find.textContaining('Good '), findsOneWidget);
      expect(find.text('Upcoming Tasks'), findsOneWidget);
      expect(find.text("Today's Appointments"), findsOneWidget);
    });
  });
}
