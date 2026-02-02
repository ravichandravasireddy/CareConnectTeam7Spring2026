import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/screens/navigation_hub_screen.dart';
import 'test_helpers.dart';

void main() {
  testWidgets('Navigation hub lists key screens', (tester) async {
    await tester.pumpWidget(
      buildTestApp(const NavigationHubScreen()),
    );

    expect(find.text('Navigation Hub'), findsOneWidget);
    expect(find.text('Caregiver Dashboard'), findsOneWidget);
    expect(find.text('Emergency SOS Receive'), findsOneWidget);
  });
}
