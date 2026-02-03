// =============================================================================
// APP APP BAR WIDGET TESTS
// =============================================================================
// SWEN 661 - App bar rendering, menu/back behavior, and notification semantics.
//
// KEY CONCEPTS COVERED:
// 1. Menu button opens drawer
// 2. Back button pops route
// 3. Notification icon semantics
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/widgets/app_app_bar.dart';

void main() {
  group('AppAppBar', () {
    testWidgets('menu button opens drawer', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            appBar: const AppAppBar(title: 'Home'),
            drawer: const Drawer(child: Text('Drawer Content')),
          ),
        ),
      );

      await tester.tap(find.byIcon(Icons.menu));
      await tester.pumpAndSettle();

      expect(find.text('Drawer Content'), findsOneWidget);
    });

    testWidgets('back button pops route', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (context) => Scaffold(
              body: Center(
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const Scaffold(
                          appBar: AppAppBar(
                            title: 'Details',
                            useBackButton: true,
                            showMenuButton: false,
                          ),
                          body: Text('Details Body'),
                        ),
                      ),
                    );
                  },
                  child: const Text('Open'),
                ),
              ),
            ),
          ),
        ),
      );

      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();
      expect(find.text('Details Body'), findsOneWidget);

      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();

      expect(find.text('Details Body'), findsNothing);
    });

    testWidgets('shows notification semantics when enabled', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            appBar: AppAppBar(
              title: 'Home',
              onNotificationTap: () {},
              showNotificationBadge: true,
            ),
          ),
        ),
      );

      expect(find.bySemanticsLabel('Notifications'), findsOneWidget);
      expect(find.byIcon(Icons.notifications_outlined), findsOneWidget);
    });
  });
}
