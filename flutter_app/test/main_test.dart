import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/main.dart';

void main() {
  group('MyApp', () {
    testWidgets('shows the welcome screen on launch', (tester) async {
      await tester.pumpWidget(const MyApp());

      expect(find.text('CareConnect'), findsOneWidget);
      expect(find.text('Get Started'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('can navigate to registration route', (tester) async {
      await tester.pumpWidget(const MyApp());

      final navigator = tester.state<NavigatorState>(find.byType(Navigator));
      navigator.pushNamed('/registration');
      await tester.pumpAndSettle();

      expect(find.widgetWithText(AppBar, 'Create Account'), findsOneWidget);
      expect(find.text('Join CareConnect'), findsOneWidget);
    });
  });
}
