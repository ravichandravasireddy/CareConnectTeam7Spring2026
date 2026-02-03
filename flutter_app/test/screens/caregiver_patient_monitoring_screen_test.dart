// =============================================================================
// CAREGIVER PATIENT MONITORING SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Patient monitoring layout and action buttons.
//
// KEY CONCEPTS COVERED:
// 1. Rendering patient header and vitals
// 2. Navigation from action cards
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/caregiver_patient_monitoring_screen.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness() {
    final authProvider = AuthProvider()..setTestUser(UserRole.caregiver);

    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: MaterialApp(
        routes: {
          '/video-call': (_) => const Scaffold(body: Text('Video Call')),
        },
        home: const CaregiverPatientMonitoringScreen(),
      ),
    );
  }

  group('CaregiverPatientMonitoringScreen', () {
    testWidgets('renders patient header and vitals', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Patient Details'), findsOneWidget);
      expect(find.text('Sarah Johnson'), findsOneWidget);
      expect(find.text('Latest Vitals'), findsOneWidget);
      expect(find.text('Blood Pressure'), findsOneWidget);
      expect(find.text('Heart Rate'), findsOneWidget);
    });

    testWidgets('video action navigates to video call route', (tester) async {
      await tester.pumpWidget(createTestHarness());

      await tester.tap(find.text('Video'));
      await tester.pumpAndSettle();

      expect(find.text('Video Call'), findsOneWidget);
    });
  });
}
