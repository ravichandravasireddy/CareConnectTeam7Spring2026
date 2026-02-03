import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/patient_dashboard_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('PatientDashboardScreen', () {
    testWidgets('renders core dashboard sections', (tester) async {
      final auth = AuthProvider();
      await auth.signIn('patient@careconnect.demo', 'password123');

      await tester.pumpWidget(
        ChangeNotifierProvider<AuthProvider>.value(
          value: auth,
          child: createTestHarness(child: const PatientDashboardScreen()),
        ),
      );

      expect(find.widgetWithText(AppBar, 'Home'), findsOneWidget);
      expect(find.text('Good Morning, Robert!'), findsOneWidget);
      expect(find.text('Upcoming Tasks'), findsOneWidget);
      expect(find.text("Today's Appointments"), findsOneWidget);
    });
  });
}
