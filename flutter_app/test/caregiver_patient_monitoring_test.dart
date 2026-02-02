import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/caregiver_patient_monitoring_screen.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Patient monitoring screen renders overview and patients',
      (tester) async {
    await tester.pumpWidget(
      buildTestApp(const CaregiverPatientMonitoringScreen()),
    );

    expect(find.text('Patient Monitoring'), findsOneWidget);
    expect(find.text('Overview'), findsOneWidget);
    expect(find.text('Robert Williams'), findsOneWidget);
  });
}
