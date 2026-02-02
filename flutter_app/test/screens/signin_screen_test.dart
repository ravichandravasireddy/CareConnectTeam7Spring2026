import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/signin_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('SignInScreen', () {
    testWidgets('renders sign in form', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SignInScreen()));

      expect(find.text('Sign In'), findsWidgets);
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
    });

    testWidgets('shows validation errors when empty', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SignInScreen()));

      final signInButton = find.byType(ElevatedButton).first;
      await tester.ensureVisible(signInButton);
      await tester.tap(signInButton);
      await tester.pump();

      expect(find.text('Email is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);
    });

    testWidgets('submits and shows success snackbar', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SignInScreen()));

      await tester.enterText(find.byType(TextFormField).at(0), 'test@example.com');
      await tester.enterText(find.byType(TextFormField).at(1), 'password123');
      final signInButton = find.byType(ElevatedButton).first;
      await tester.ensureVisible(signInButton);
      await tester.tap(signInButton);
      await tester.pump();

      expect(find.byType(CircularProgressIndicator), findsOneWidget);

      await tester.pump(const Duration(seconds: 1));
      await tester.pump();

      expect(find.text('Sign in successful!'), findsOneWidget);
    });

    testWidgets('toggles password visibility', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const SignInScreen()));

      expect(find.byIcon(Icons.visibility_off), findsOneWidget);
      await tester.tap(find.byIcon(Icons.visibility_off));
      await tester.pump();

      expect(find.byIcon(Icons.visibility), findsOneWidget);
    });
  });
}
