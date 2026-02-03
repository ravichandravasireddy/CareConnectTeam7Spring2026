// =============================================================================
// APP DRAWER WIDGET TESTS
// =============================================================================
// SWEN 661 - Role-based drawer items and sign-out action.
//
// KEY CONCEPTS COVERED:
// 1. Patient vs caregiver drawer tiles
// 2. Sign out action navigation
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/widgets/app_drawer.dart';

void main() {
  Widget createDrawerHarness({required bool isPatient}) {
    final authProvider = AuthProvider()
      ..setTestUser(isPatient ? UserRole.patient : UserRole.caregiver);

    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: MaterialApp(
        home: Scaffold(body: AppDrawer(isPatient: isPatient)),
      ),
    );
  }

  group('AppDrawer', () {
    testWidgets('renders patient drawer tiles', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: true));

      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Tasks'), findsOneWidget);
      expect(find.text('Messages'), findsOneWidget);
      expect(find.text('Health Logs'), findsOneWidget);
      expect(find.text('Preferences'), findsOneWidget);
    });

    testWidgets('renders caregiver drawer tiles', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: false));

      expect(find.text('Dashboard'), findsOneWidget);
      expect(find.text('Patient'), findsOneWidget);
      expect(find.text('Task'), findsOneWidget);
      expect(find.text('Analytics'), findsOneWidget);
    });

    testWidgets('renders sign out action', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: true));

      // Sign Out is at the bottom of the drawer; scroll so it is built and visible
      await tester.dragUntilVisible(
        find.text('Sign Out'),
        find.byType(ListView),
        const Offset(0, -200),
      );

      expect(find.text('Sign Out'), findsOneWidget);
      expect(find.byIcon(Icons.logout), findsOneWidget);
    });
  });
}
