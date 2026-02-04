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
  group('My CareConnectApp', () {
    testWidgets('shows the welcome screen on launch', (tester) async {
      await tester.pumpWidget(const MyApp());

      expect(find.text('CareConnect'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
    });
  });

  group('My CareConnectApp\'s Navigation', () {
    Future<void> pushRoute(
      WidgetTester tester,
      String route, {
      Object? arguments,
      bool settle = true,
    }) async {
      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pushNamed(route, arguments: arguments);
      if (settle) {
        await tester.pumpAndSettle();
      } else {
        await tester.pump();
      }
    }

    testWidgets('can navigate to registration route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/registration');

      expect(find.widgetWithText(AppBar, 'Create Account'), findsOneWidget);
      expect(find.text('Join CareConnect'), findsOneWidget);
    });

    testWidgets('can navigate to role selection route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/role-selection');

      expect(find.text('How will you use\nCareConnect?'), findsOneWidget);
      expect(
        find.text('Select the option that best describes you'),
        findsOneWidget,
      );
      expect(find.text('Care Recipient'), findsOneWidget);
      expect(find.text('Caregiver'), findsOneWidget);
    });

    testWidgets('can navigate to task details route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final task = Task(
        id: 'task-1',
        title: 'Take Medication',
        date: DateTime(2025, 1, 15, 9, 0),
        icon: Icons.medication,
        iconBackground: AppColors.primary100,
        iconColor: AppColors.primary700,
      );

      await pushRoute(tester, '/task-details', arguments: task);

      expect(find.text('Task Details'), findsOneWidget);
      expect(find.text('Take Medication'), findsOneWidget);
    });

    testWidgets('can navigate to sign in route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/signin');

      expect(find.text('Sign In'), findsWidgets);
    });

    testWidgets('can navigate to caregiver dashboard route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/caregiver-dashboard');

      expect(find.widgetWithText(AppBar, 'Dashboard'), findsOneWidget);
    });

    testWidgets('can navigate to emergency sos route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/emergency-sos');

      expect(find.text('EMERGENCY\nALERT'), findsOneWidget);
    });

    testWidgets('can navigate to patient dashboard route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/dashboard');

      expect(find.widgetWithText(AppBar, 'Home'), findsOneWidget);
    });

    testWidgets('can navigate to messaging route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/messaging');

      expect(find.text('Dr. Sarah Johnson'), findsOneWidget);
      expect(find.text('Today'), findsOneWidget);
    });

    testWidgets('can navigate to profile route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/profile');

      expect(find.widgetWithText(AppBar, 'Profile'), findsOneWidget);
      expect(find.text('Robert Williams'), findsOneWidget);
    });

    testWidgets('can navigate to preferences route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/preferences');

      expect(find.text('Preferences & Accessibility'), findsOneWidget);
    });

    testWidgets('can navigate to calendar route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/calendar');

      expect(find.text('Calendar'), findsOneWidget);
    });

    testWidgets('can navigate to notifications route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/notifications');

      expect(find.text('Notifications'), findsOneWidget);
    });

    testWidgets('can navigate to notes route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/notes');

      expect(find.text('Notes'), findsOneWidget);
    });

    testWidgets('can navigate to health timeline route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/health-timeline');

      expect(find.text('Health Timeline'), findsOneWidget);
    });

    testWidgets('can navigate to navigation hub route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/nav-hub');

      expect(find.text('Navigation Hub'), findsOneWidget);
      expect(find.text('Tap a button to open a screen.'), findsOneWidget);
    });

    testWidgets('can navigate to caregiver patient monitoring route', (
      tester,
    ) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/caregiver-patient-monitoring');

      expect(find.text('Patient Details'), findsOneWidget);
      expect(find.text('Robert Williams'), findsWidgets);
    });

    testWidgets('can navigate to caregiver task management route', (
      tester,
    ) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/caregiver-task-management');

      expect(find.text('Tasks'), findsWidgets);
      expect(find.text('Overdue Tasks (2)'), findsOneWidget);
    });

    testWidgets('can navigate to caregiver analytics route', (tester) async {
      await tester.pumpWidget(const MyApp());

      await pushRoute(tester, '/caregiver-analytics');

      expect(find.text('Analytics'), findsWidgets);
      expect(find.text('Weekly Overview'), findsOneWidget);
    });
  });
}
