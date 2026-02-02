import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/patient_dashboard_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('PatientDashboardScreen', () {
    testWidgets('renders core dashboard sections', (tester) async {
      await tester.pumpWidget(createTestHarness(child: const PatientDashboardScreen()));

      expect(find.widgetWithText(AppBar, 'Home'), findsOneWidget);
      expect(find.text('Good Morning, Robert!'), findsOneWidget);
      expect(find.text('Upcoming Tasks'), findsOneWidget);
      expect(find.text("Today's Appointments"), findsOneWidget);
    });
  });
}
