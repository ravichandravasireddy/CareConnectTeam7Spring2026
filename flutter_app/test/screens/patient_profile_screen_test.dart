import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/patient_profile_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('PatientProfileScreen', () {
    testWidgets('renders profile info', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientProfileScreen()));

      expect(find.widgetWithText(AppBar, 'Profile'), findsOneWidget);
      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('Personal Information'), findsOneWidget);
    });

    testWidgets('tapping edit profile shows snackbar', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientProfileScreen()));

      await tester.tap(find.widgetWithText(ElevatedButton, 'Edit Profile'));
      await tester.pump();

      expect(find.text('Edit profile feature coming soon'), findsOneWidget);
    });
  });
}
