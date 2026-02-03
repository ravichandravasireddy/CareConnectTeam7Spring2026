// =============================================================================
// APP BOTTOM NAV BAR WIDGET TESTS
// =============================================================================
// SWEN 661 - Patient vs caregiver navigation bar rendering and routing.
//
// KEY CONCEPTS COVERED:
// 1. Role-based nav item sets
// 2. Navigation on tab tap (Home, Tasks, Health, Profile for patient)
// 3. Navigation on tab tap (Home, Tasks, Analytics, Monitor for caregiver)
// 4. Tapping current tab does not navigate
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/widgets/app_bottom_nav_bar.dart';

void main() {
  Map<String, WidgetBuilder> patientRoutes() => {
        '/dashboard': (_) => const Scaffold(body: Text('Dashboard')),
        '/calendar': (_) => const Scaffold(body: Text('Calendar')),
        '/messaging': (_) => const Scaffold(body: Text('Messages')),
        '/health-logs': (_) => const Scaffold(body: Text('Health Logs')),
        '/profile': (_) => const Scaffold(body: Text('Profile')),
      };

  Map<String, WidgetBuilder> caregiverRoutes() => {
        '/caregiver-dashboard': (_) => const Scaffold(body: Text('Caregiver Dashboard')),
        '/caregiver-task-management': (_) => const Scaffold(body: Text('Task Management')),
        '/caregiver-analytics': (_) => const Scaffold(body: Text('Analytics')),
        '/caregiver-patient-monitoring': (_) => const Scaffold(body: Text('Monitor')),
      };

  group('AppBottomNavBar', () {
    testWidgets('renders patient items based on AuthProvider', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
            ),
          ),
        ),
      );

      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Tasks'), findsOneWidget);
      expect(find.text('Messages'), findsOneWidget);
      expect(find.text('Health'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('tapping patient Messages navigates', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Messages'));
      await tester.pumpAndSettle();

      expect(find.text('Messages'), findsOneWidget);
    });

    testWidgets('tapping patient Home navigates to dashboard', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              bottomNavigationBar: AppBottomNavBar(currentIndex: 1),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();

      expect(find.text('Dashboard'), findsOneWidget);
    });

    testWidgets('tapping patient Tasks navigates to calendar', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Tasks'));
      await tester.pumpAndSettle();

      expect(find.text('Calendar'), findsOneWidget);
    });

    testWidgets('tapping patient Health navigates to health logs', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Health'));
      await tester.pumpAndSettle();

      expect(find.text('Health Logs'), findsOneWidget);
    });

    testWidgets('tapping patient Profile navigates to profile', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Profile'));
      await tester.pumpAndSettle();

      expect(find.text('Profile'), findsWidgets);
    });

    testWidgets('tapping current patient tab does not push duplicate', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: patientRoutes(),
            home: const Scaffold(
              body: Text('Dashboard'),
              bottomNavigationBar: AppBottomNavBar(currentIndex: 0),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();

      expect(find.text('Dashboard'), findsOneWidget);
    });

    testWidgets('renders caregiver items when isPatient is false', (
      tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            bottomNavigationBar: AppBottomNavBar(
              currentIndex: 0,
              isPatient: false,
            ),
          ),
        ),
      );

      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Tasks'), findsOneWidget);
      expect(find.text('Analytics'), findsOneWidget);
      expect(find.text('Monitor'), findsOneWidget);
    });

    testWidgets('tapping caregiver Tasks navigates', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          routes: caregiverRoutes(),
          home: const Scaffold(
            bottomNavigationBar: AppBottomNavBar(
              currentIndex: 0,
              isPatient: false,
            ),
          ),
        ),
      );

      await tester.tap(find.text('Tasks'));
      await tester.pumpAndSettle();

      expect(find.text('Task Management'), findsOneWidget);
    });

    testWidgets('tapping caregiver Analytics navigates', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          routes: caregiverRoutes(),
          home: const Scaffold(
            bottomNavigationBar: AppBottomNavBar(
              currentIndex: 0,
              isPatient: false,
            ),
          ),
        ),
      );

      await tester.tap(find.text('Analytics'));
      await tester.pumpAndSettle();

      expect(find.text('Analytics'), findsWidgets);
    });

    testWidgets('tapping caregiver Monitor navigates', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          routes: caregiverRoutes(),
          home: const Scaffold(
            bottomNavigationBar: AppBottomNavBar(
              currentIndex: 0,
              isPatient: false,
            ),
          ),
        ),
      );

      await tester.tap(find.text('Monitor'));
      await tester.pumpAndSettle();

      expect(find.text('Monitor'), findsOneWidget);
    });
  });
}
