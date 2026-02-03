// =============================================================================
// WELCOME SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Verifies welcome copy, actions, and navigation.
//
// KEY CONCEPTS COVERED:
// 1. Action button rendering
// 2. Route navigation to role selection
// 3. Route navigation to sign in
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/welcome_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('WelcomeScreen', () {
    testWidgets('renders title and action buttons', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const WelcomeScreen()));

      expect(find.text('CareConnect'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('navigates to role selection', (tester) async {
      await tester.pumpWidget(
        createTestHarness(
          child: const WelcomeScreen(),
          routes: {
            '/role-selection': (_) => placeholderScreen('Role Selection'),
          },
        ),
      );

      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();

      expect(find.text('Role Selection'), findsOneWidget);
    });

    testWidgets('navigates to sign in', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 900));
      addTearDown(() => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        createTestHarness(
          child: const WelcomeScreen(),
          routes: {'/signin': (_) => placeholderScreen('Sign In Screen')},
        ),
      );

      await tester.tap(find.text('Sign In'));
      await tester.pumpAndSettle();

      expect(find.text('Sign In Screen'), findsOneWidget);
    });
  });
}
