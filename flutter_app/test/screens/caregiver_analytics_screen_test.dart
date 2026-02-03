// =============================================================================
// CAREGIVER ANALYTICS SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Analytics overview rendering.
//
// KEY CONCEPTS COVERED:
// 1. Rendering analytics header and metrics
// 2. Rendering chart placeholder section
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/caregiver_analytics_screen.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness() {
    final authProvider = AuthProvider()..setTestUser(UserRole.caregiver);

    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: const MaterialApp(home: CaregiverAnalyticsScreen()),
    );
  }

  group('CaregiverAnalyticsScreen', () {
    testWidgets('renders analytics summary', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Analytics'), findsWidgets);
      expect(find.text('Weekly Overview'), findsOneWidget);
      expect(find.text('Task Completion'), findsOneWidget);
      expect(find.text('Medication Adherence'), findsOneWidget);
    });
  });
}
