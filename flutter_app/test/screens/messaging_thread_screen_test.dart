import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/messaging_thread_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('MessagingThreadScreen', () {
    testWidgets('renders header and initial content', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const MessagingThreadScreen()),
      );

      expect(find.text('Dr. Sarah Johnson'), findsOneWidget);
      expect(find.text('Active now'), findsOneWidget);
      expect(find.text('Today'), findsOneWidget);
    });

    testWidgets('sends a new message', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const MessagingThreadScreen()),
      );

      await tester.enterText(find.byType(TextField), 'Hello there');
      await tester.tap(find.byIcon(Icons.send));
      await tester.pump();
      await tester.pump(const Duration(seconds: 3));
      await tester.pumpAndSettle();
      await tester.dragUntilVisible(
        find.text('Hello there'),
        find.byType(ListView),
        const Offset(0, -200),
      );

      expect(find.text('Hello there'), findsOneWidget);
    });
  });
}
