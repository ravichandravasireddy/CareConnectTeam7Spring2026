import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/registration_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('RegistrationScreen', () {
    testWidgets('renders main fields and button', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const RegistrationScreen()));

      expect(find.text('Create Account'), findsWidgets);
      expect(find.text('First Name'), findsOneWidget);
      expect(find.text('Last Name'), findsOneWidget);
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Phone Number'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.text('Confirm Password'), findsOneWidget);
    });

    testWidgets('shows validation errors when empty', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const RegistrationScreen()));

      final createAccountButton = find.widgetWithText(ElevatedButton, 'Create Account');
      await tester.ensureVisible(createAccountButton);
      await tester.tap(createAccountButton);
      await tester.pump();

      expect(find.text('Required'), findsNWidgets(2));
      expect(find.text('Email is required'), findsOneWidget);
      expect(find.text('Phone number is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);
      expect(find.text('Please confirm your password'), findsOneWidget);
    });

    testWidgets('requires agreeing to terms', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const RegistrationScreen()));

      await tester.enterText(find.byType(TextFormField).at(0), 'John');
      await tester.enterText(find.byType(TextFormField).at(1), 'Doe');
      await tester.enterText(find.byType(TextFormField).at(2), 'john@example.com');
      await tester.enterText(find.byType(TextFormField).at(3), '(555) 123-4567');
      await tester.enterText(find.byType(TextFormField).at(4), 'password1');
      await tester.enterText(find.byType(TextFormField).at(5), 'password1');

      final createAccountButton = find.widgetWithText(ElevatedButton, 'Create Account');
      await tester.ensureVisible(createAccountButton);
      await tester.tap(createAccountButton);
      await tester.pump();

      expect(
        find.text('Please agree to the Terms of Service and Privacy Policy'),
        findsOneWidget,
      );
    });

    testWidgets('submits and navigates to dashboard', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const RegistrationScreen(),
          routes: {
            '/dashboard': (_) => placeholderScreen('Dashboard'),
          },
        ),
      );

      await tester.enterText(find.byType(TextFormField).at(0), 'John');
      await tester.enterText(find.byType(TextFormField).at(1), 'Doe');
      await tester.enterText(find.byType(TextFormField).at(2), 'john@example.com');
      await tester.enterText(find.byType(TextFormField).at(3), '(555) 123-4567');
      await tester.enterText(find.byType(TextFormField).at(4), 'password1');
      await tester.enterText(find.byType(TextFormField).at(5), 'password1');

      final termsCheckbox = find.byType(Checkbox);
      await tester.ensureVisible(termsCheckbox);
      await tester.tap(termsCheckbox);
      await tester.pump();

      final createAccountButton = find.widgetWithText(ElevatedButton, 'Create Account');
      await tester.ensureVisible(createAccountButton);
      await tester.tap(createAccountButton);
      await tester.pump();

      await tester.pump(const Duration(seconds: 1));
      await tester.pumpAndSettle();

      expect(find.text('Dashboard'), findsOneWidget);
    });
  });
}
