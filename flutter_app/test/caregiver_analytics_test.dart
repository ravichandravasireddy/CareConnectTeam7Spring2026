import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/caregiver_analytics_screen.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Analytics screen shows metrics', (tester) async {
    await tester.pumpWidget(
      buildTestApp(const CaregiverAnalyticsScreen()),
    );

    expect(find.text('Analytics'), findsOneWidget);
    expect(find.text('Weekly Overview'), findsOneWidget);
    expect(find.text('Active Patients'), findsOneWidget);
    expect(find.text('Tasks Completed'), findsOneWidget);
  });
}
