// =============================================================================
// MAIN APP WIDGET TESTS
// =============================================================================
// SWEN 661 - App bootstrap and initial navigation coverage for MyApp.
//
// KEY CONCEPTS COVERED:
// 1. Root widget rendering
// 2. Initial welcome screen content
// 3. Named route navigation
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/main.dart';
import 'package:flutter_app/models/task.dart';
import 'package:flutter_app/theme/app_colors.dart';

void main() {
  group('MyApp', () {
    testWidgets('shows the welcome screen on launch', (tester) async {
      await tester.pumpWidget(const MyApp());

      expect(find.text('CareConnect'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('can navigate to registration route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pushNamed('/registration');
      await tester.pumpAndSettle();

      expect(find.widgetWithText(AppBar, 'Create Account'), findsOneWidget);
      expect(find.text('Join CareConnect'), findsOneWidget);
    });

    testWidgets('can navigate to task details route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      final task = Task(
        id: 'task-1',
        title: 'Take Medication',
        date: DateTime(2025, 1, 15, 9, 0),
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );

      navigator.pushNamed('/task-details', arguments: task);
      await tester.pumpAndSettle();

      expect(find.text('Task Details'), findsOneWidget);
      expect(find.text('Take Medication'), findsOneWidget);
    });

    testWidgets('can navigate to sign in route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pushNamed('/signin');
      await tester.pumpAndSettle();

      expect(find.text('Sign In'), findsWidgets);
    });

    testWidgets('can navigate to caregiver dashboard route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pushNamed('/caregiver-dashboard');
      await tester.pumpAndSettle();

      expect(find.widgetWithText(AppBar, 'Dashboard'), findsOneWidget);
    });

    testWidgets('can navigate to emergency sos route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pushNamed('/emergency-sos');
      await tester.pumpAndSettle();

      expect(find.text('EMERGENCY\nALERT'), findsOneWidget);
    });
  });
}
