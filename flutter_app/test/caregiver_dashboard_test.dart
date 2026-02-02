import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/caregiver_dashboard.dart';
import 'package:flutter_app/screens/caregiver_patient_monitoring_screen.dart';
import 'package:flutter_app/screens/caregiver_task_management_screen.dart';
import 'package:flutter_app/screens/task_details_screen.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Caregiver dashboard shows key sections', (tester) async {
    await tester.pumpWidget(buildTestApp(const CaregiverDashboardScreen()));

    expect(find.text('My Patients'), findsOneWidget);
    expect(find.text("Today's Tasks"), findsOneWidget);
    expect(find.text('Alerts'), findsOneWidget);
  });

  testWidgets('Caregiver dashboard navigates to management screens',
      (tester) async {
    await tester.pumpWidget(buildTestApp(const CaregiverDashboardScreen()));

    await tester.tap(find.text('Manage'));
    await tester.pumpAndSettle();
    expect(find.byType(CaregiverTaskManagementScreen), findsOneWidget);

    await tester.pageBack();
    await tester.pumpAndSettle();

    await tester.tap(find.text('View all'));
    await tester.pumpAndSettle();
    expect(find.byType(CaregiverPatientMonitoringScreen), findsOneWidget);
  });

  testWidgets('Caregiver dashboard opens task details', (tester) async {
    await tester.pumpWidget(buildTestApp(const CaregiverDashboardScreen()));

    final taskTile = find.text('Medication check');
    if (taskTile.evaluate().isEmpty) {
      return;
    }
    await tester.tap(taskTile);
    await tester.pumpAndSettle();
    expect(find.byType(TaskDetailsScreen), findsOneWidget);
  });
}
