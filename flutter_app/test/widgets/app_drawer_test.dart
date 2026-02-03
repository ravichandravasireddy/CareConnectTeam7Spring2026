// =============================================================================
// APP DRAWER WIDGET TESTS
// =============================================================================
// SWEN 661 - Role-based drawer items, header, tile navigation, sign-out.
//
// KEY CONCEPTS COVERED:
// 1. Patient vs caregiver drawer tiles
// 2. Drawer header shows user name and email from AuthProvider
// 3. Tapping each tile navigates to correct route
// 4. Sign out pops drawer, calls auth.signOut(), navigates to /
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/widgets/app_drawer.dart';

void main() {
  Widget createDrawerHarness({
    required bool isPatient,
    Map<String, WidgetBuilder> routes = const {},
  }) {
    final authProvider = AuthProvider()
      ..setTestUser(isPatient ? UserRole.patient : UserRole.caregiver);

    final allRoutes = <String, WidgetBuilder>{
      '/dashboard': (_) => const Scaffold(body: Text('Dashboard')),
      '/calendar': (_) => const Scaffold(body: Text('Calendar')),
      '/messaging': (_) => const Scaffold(body: Text('Messages')),
      '/health-logs': (_) => const Scaffold(body: Text('Health Logs')),
      '/health-timeline': (_) => const Scaffold(body: Text('Health Timeline')),
      '/profile': (_) => const Scaffold(body: Text('Profile')),
      '/notes': (_) => const Scaffold(body: Text('Notes')),
      '/preferences': (_) => const Scaffold(body: Text('Preferences')),
      '/caregiver-dashboard': (_) => const Scaffold(body: Text('Caregiver Dashboard')),
      '/caregiver-patient-monitoring': (_) => const Scaffold(body: Text('Patient Monitor')),
      '/caregiver-task-management': (_) => const Scaffold(body: Text('Task Management')),
      '/caregiver-analytics': (_) => const Scaffold(body: Text('Analytics')),
      ...routes,
    };

    return ChangeNotifierProvider<AuthProvider>.value(
      value: authProvider,
      child: MaterialApp(
        home: Scaffold(body: AppDrawer(isPatient: isPatient)),
        routes: allRoutes,
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
      expect(find.text('Health Timeline'), findsOneWidget);
      expect(find.text('Preferences'), findsOneWidget);
    });

    testWidgets('renders caregiver drawer tiles', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: false));

      expect(find.text('Dashboard'), findsOneWidget);
      expect(find.text('Patients'), findsOneWidget);
      expect(find.text('Tasks'), findsOneWidget);
      expect(find.text('Analytics'), findsOneWidget);
    });

    testWidgets('drawer header shows user name and email', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: true));

      expect(find.text('Robert Williams'), findsOneWidget);
      expect(find.text('patient@careconnect.demo'), findsOneWidget);
    });

    testWidgets('tapping patient Home navigates to dashboard', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: true));

      await tester.tap(find.text('Home'));
      await tester.pumpAndSettle();

      expect(find.text('Dashboard'), findsOneWidget);
    });

    testWidgets('tapping patient Preferences navigates to preferences', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: true));

      await tester.dragUntilVisible(
        find.text('Preferences'),
        find.byType(ListView),
        const Offset(0, -200),
      );
      await tester.tap(find.text('Preferences'));
      await tester.pumpAndSettle();

      expect(find.text('Preferences'), findsWidgets);
    });

    testWidgets('tapping caregiver Dashboard navigates to caregiver dashboard', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: false));

      await tester.tap(find.text('Dashboard'));
      await tester.pumpAndSettle();

      expect(find.text('Caregiver Dashboard'), findsOneWidget);
    });

    testWidgets('tapping caregiver Tasks navigates to task management', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: false));

      await tester.tap(find.text('Tasks'));
      await tester.pumpAndSettle();

      expect(find.text('Task Management'), findsOneWidget);
    });

    testWidgets('renders sign out action', (tester) async {
      await tester.pumpWidget(createDrawerHarness(isPatient: true));

      await tester.dragUntilVisible(
        find.text('Sign Out'),
        find.byType(ListView),
        const Offset(0, -200),
      );

      expect(find.text('Sign Out'), findsOneWidget);
      expect(find.byIcon(Icons.logout), findsOneWidget);
    });

    testWidgets('sign out pops drawer and navigates to root', (tester) async {
      await tester.binding.setSurfaceSize(const Size(400, 900));
      addTearDown(() => tester.binding.setSurfaceSize(null));

      final authProvider = AuthProvider()..setTestUser(UserRole.patient);
      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: authProvider,
          child: MaterialApp(
            initialRoute: '/drawer',
            routes: {
              '/': (_) => const Scaffold(body: Text('Welcome Root')),
              '/drawer': (_) => Scaffold(body: AppDrawer(isPatient: true)),
              '/dashboard': (_) => const Scaffold(body: Text('Dashboard')),
            },
          ),
        ),
      );

      await tester.dragUntilVisible(
        find.text('Sign Out'),
        find.byType(ListView),
        const Offset(0, -200),
      );
      await tester.tap(find.text('Sign Out'));
      await tester.pumpAndSettle();
      await tester.tap(find.widgetWithText(TextButton, 'Sign Out'));
      await tester.pumpAndSettle();

      expect(find.text('Welcome Root'), findsOneWidget);
    });
  });
}
