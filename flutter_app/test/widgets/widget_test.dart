// =============================================================================
// BASIC APP SMOKE TESTS
// =============================================================================
// SWEN 661 - Verifies the app boots and shows the welcome content.
//
// KEY CONCEPTS COVERED:
// 1. App bootstrap
// 2. Welcome screen copy
// =============================================================================

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/main.dart';

void main() {
  testWidgets('App shows welcome screen', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.text('Get Started'), findsOneWidget);
  });
}
