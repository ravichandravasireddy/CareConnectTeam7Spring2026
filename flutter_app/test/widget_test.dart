import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/main.dart';

void main() {
  testWidgets('App shows welcome screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.text('Get Started'), findsOneWidget);
  });
}
