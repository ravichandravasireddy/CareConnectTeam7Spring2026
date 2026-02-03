// =============================================================================
// PATIENT PROFILE SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Profile UI rendering, settings actions, and sign-out dialog.
//
// KEY CONCEPTS COVERED:
// 1. Rendering profile header and sections
// 2. Action button behavior and SnackBar feedback
// 3. Dialog visibility and confirmation handling
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/patient_profile_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  Widget createProfileHarness() {
    final authProvider = AuthProvider()..setTestUser(UserRole.patient);
    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: createTestHarness(child: const PatientProfileScreen()),
    );
  }

  group('PatientProfileScreen', () {
    testWidgets('renders profile info', (tester) async {
      await tester.pumpWidget(createProfileHarness());

      expect(find.widgetWithText(AppBar, 'Profile'), findsOneWidget);
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Personal Information'), findsOneWidget);
    });

    testWidgets('tapping edit profile shows snackbar', (tester) async {
      await tester.pumpWidget(createProfileHarness());

      await tester.tap(find.widgetWithText(ElevatedButton, 'Edit Profile'));
      await tester.pump();

      expect(find.text('Edit profile feature coming soon'), findsOneWidget);
    });

    testWidgets('sign out shows confirmation dialog and snackbar', (
      tester,
    ) async {
      await tester.pumpWidget(createProfileHarness());

      await tester.ensureVisible(find.text('Sign Out'));
      await tester.tap(find.text('Sign Out'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));

      expect(find.text('Are you sure you want to sign out?'), findsOneWidget);

      await tester.tap(find.widgetWithText(TextButton, 'Sign Out'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 350));

      expect(find.text('Signed out successfully'), findsOneWidget);
    });
  });
}
