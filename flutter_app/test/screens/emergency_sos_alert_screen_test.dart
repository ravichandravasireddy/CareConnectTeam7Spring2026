// =============================================================================
// EMERGENCY SOS ALERT SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Emergency alert UI and acknowledgement state.
//
// KEY CONCEPTS COVERED:
// 1. Rendering alert state content
// 2. Acknowledgement state transition
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/emergency_sos_alert.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness() {
    return const MaterialApp(home: EmergencySOSAlertScreen());
  }

  group('EmergencySOSAlertScreen', () {
    testWidgets('renders alert state content', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('EMERGENCY\nALERT'), findsOneWidget);
      expect(find.text('Acknowledge Alert'), findsOneWidget);
      expect(find.text('From: Robert Williams'), findsOneWidget);
    });

    testWidgets('acknowledge button switches to acknowledged state', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      await tester.ensureVisible(
        find.text('Acknowledge Alert', skipOffstage: false),
      );
      await tester.tap(find.text('Acknowledge Alert'));
      await tester.pump();
      await tester.pump(const Duration(seconds: 3));

      expect(find.text('Alert Acknowledged'), findsOneWidget);
    });
  });
}
