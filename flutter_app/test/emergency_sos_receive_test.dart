import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/emergency_sos_receive_screen.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Emergency SOS receive screen shows visual alert actions',
      (tester) async {
    await tester.pumpWidget(
      buildTestApp(const EmergencySOSReceiveScreen()),
    );

    expect(find.text('Incoming Emergency Alert'), findsOneWidget);
    expect(find.text('Call Patient'), findsOneWidget);
    expect(find.text('Send Text Update'), findsOneWidget);
  });
}
