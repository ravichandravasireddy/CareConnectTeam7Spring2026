import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/emergency_sos_alert.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Emergency SOS alert screen renders call to action',
      (tester) async {
    await tester.pumpWidget(
      buildTestApp(const EmergencySOSAlertScreen()),
    );

    expect(find.text('Emergency SOS'), findsOneWidget);
    expect(find.text('Send Emergency Alert'), findsOneWidget);
  });
}
