// =============================================================================
// ROLE SELECTION SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Ensures role choices render and navigate to registration.
//
// KEY CONCEPTS COVERED:
// 1. Role option rendering
// 2. Tap navigation to registration
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/role_selection_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('RoleSelectionScreen', () {
    testWidgets('renders role options', (tester) async {
      await tester.binding.setSurfaceSize(const Size(1000, 1200));
      addTearDown(() => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        createTestHarness(child: const RoleSelectionScreen()),
      );

      expect(find.text('Select Your Role'), findsOneWidget);
      expect(find.text('Care Recipient'), findsOneWidget);
      expect(find.text('Caregiver'), findsOneWidget);
    });

    testWidgets('tapping a role navigates to registration', (tester) async {
      await tester.binding.setSurfaceSize(const Size(1000, 1200));
      addTearDown(() => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        createTestHarness(child: const RoleSelectionScreen()),
      );

      await tester.tap(find.text('Care Recipient'));
      await tester.pumpAndSettle();

      // RoleSelectionScreen pushes RegistrationScreen (Create Account) via MaterialPageRoute
      expect(find.text('Create Account'), findsWidgets);
    });
  });
}
