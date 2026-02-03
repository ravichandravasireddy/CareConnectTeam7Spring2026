// =============================================================================
// NAVIGATION HUB SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Navigation hub title, description, and button navigation.
//
// KEY CONCEPTS COVERED:
// 1. Screen title and description
// 2. Each nav button pushes the correct screen
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/providers/task_provider.dart';
import 'package:flutter_app/screens/caregiver_analytics_screen.dart';
import 'package:flutter_app/screens/caregiver_dashboard.dart';
import 'package:flutter_app/screens/caregiver_patient_monitoring_screen.dart';
import 'package:flutter_app/screens/caregiver_task_management_screen.dart';
import 'package:flutter_app/screens/emergency_sos_alert.dart';
import 'package:flutter_app/screens/navigation_hub_screen.dart';
import 'package:flutter_app/screens/role_selection_screen.dart';
import 'package:flutter_app/screens/task_details_screen.dart';
import 'package:flutter_app/screens/welcome_screen.dart';

void main() {
  group('NavigationHubScreen', () {
    testWidgets('renders title and description', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: NavigationHubScreen()),
      );

      expect(find.text('Navigation Hub'), findsOneWidget);
      expect(find.text('Tap a button to open a screen.'), findsOneWidget);
    });

    testWidgets('Welcome button pushes WelcomeScreen', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: NavigationHubScreen()),
      );
      await tester.tap(find.text('Welcome'));
      await tester.pumpAndSettle();

      expect(find.byType(WelcomeScreen), findsOneWidget);
    });

    testWidgets('Role Selection button pushes RoleSelectionScreen', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(home: NavigationHubScreen()),
      );
      await tester.tap(find.text('Role Selection'));
      await tester.pumpAndSettle();

      expect(find.byType(RoleSelectionScreen), findsOneWidget);
    });

    testWidgets('Caregiver Dashboard button pushes CaregiverDashboardScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 2400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider<AuthProvider>(create: (_) => AuthProvider()..setTestUser(UserRole.caregiver)),
            ChangeNotifierProvider<TaskProvider>(create: (_) => TaskProvider()),
          ],
          child: const MaterialApp(home: NavigationHubScreen()),
        ),
      );
      await tester.tap(find.text('Caregiver Dashboard'));
      await tester.pumpAndSettle();

      expect(find.byType(CaregiverDashboardScreen), findsOneWidget);
    });

    testWidgets('Caregiver: Patient Monitoring button pushes screen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 2400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: AuthProvider()..setTestUser(UserRole.caregiver),
          child: const MaterialApp(home: NavigationHubScreen()),
        ),
      );
      await tester.tap(find.text('Caregiver: Patient Monitoring'));
      await tester.pumpAndSettle();

      expect(find.byType(CaregiverPatientMonitoringScreen), findsOneWidget);
    });

    testWidgets('Caregiver: Task Management button pushes screen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 2400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: AuthProvider()..setTestUser(UserRole.caregiver),
          child: const MaterialApp(home: NavigationHubScreen()),
        ),
      );
      await tester.tap(find.text('Caregiver: Task Management'));
      await tester.pumpAndSettle();

      expect(find.byType(CaregiverTaskManagementScreen), findsOneWidget);
    });

    testWidgets('Caregiver: Analytics button pushes screen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 2400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: AuthProvider()..setTestUser(UserRole.caregiver),
          child: const MaterialApp(home: NavigationHubScreen()),
        ),
      );
      await tester.tap(find.text('Caregiver: Analytics'));
      await tester.pumpAndSettle();

      expect(find.byType(CaregiverAnalyticsScreen), findsOneWidget);
    });

    testWidgets('Emergency SOS Alert button pushes screen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 2400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        const MaterialApp(home: NavigationHubScreen()),
      );
      await tester.tap(find.text('Emergency SOS Alert'));
      await tester.pumpAndSettle();

      expect(find.byType(EmergencySOSAlertScreen), findsOneWidget);
    });

    testWidgets('Task Details (sample) button pushes TaskDetailsScreen', (tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 2400));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider<AuthProvider>.value(
              value: AuthProvider()..setTestUser(UserRole.caregiver),
            ),
            ChangeNotifierProvider<TaskProvider>.value(
              value: TaskProvider(),
            ),
          ],
          child: const MaterialApp(home: NavigationHubScreen()),
        ),
      );
      await tester.tap(find.text('Task Details (sample)'));
      await tester.pumpAndSettle();

      expect(find.byType(TaskDetailsScreen), findsOneWidget);
    });
  });
}
