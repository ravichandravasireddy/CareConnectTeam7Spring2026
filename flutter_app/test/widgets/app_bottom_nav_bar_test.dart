// =============================================================================
// APP BOTTOM NAV BAR WIDGET TESTS
// =============================================================================
// SWEN 661 - Patient vs caregiver navigation bar rendering and routing.
//
// KEY CONCEPTS COVERED:
// 1. Role-based nav item sets
// 2. Navigation on tab tap
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/widgets/app_bottom_nav_bar.dart';

void main() {
  group('AppBottomNavBar', () {
    testWidgets('renders patient items based on AuthProvider', (tester) async {
      final authProvider = AuthProvider()..setTestUser(UserRole.patient);

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            routes: {
              '/dashboard': (_) => const Scaffold(body: Text('Dashboard')),
              '/messaging': (_) => const Scaffold(body: Text('Messages')),
            },
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
            routes: {
              '/dashboard': (_) => const Scaffold(body: Text('Dashboard')),
              '/messaging': (_) => const Scaffold(body: Text('Messages')),
            },
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
  });
}
