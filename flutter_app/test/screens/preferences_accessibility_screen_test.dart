// =============================================================================
// PREFERENCES & ACCESSIBILITY SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Preferences toggles, dialog interactions, and section rendering.
//
// KEY CONCEPTS COVERED:
// 1. Rendering settings sections and tiles
// 2. Switch state updates
// 3. Dialog opening and dismissal
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/screens/preferences_accessibility_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  group('PreferencesAccessibilityScreen', () {
    testWidgets('renders main sections', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const PreferencesAccessibilityScreen()),
      );

      expect(find.text('Preferences & Accessibility'), findsOneWidget);
      expect(find.text('Display'), findsOneWidget);
      expect(find.text('Accessibility'), findsOneWidget);
      expect(find.text('Notifications'), findsOneWidget);
    });

    testWidgets('toggles dark mode switch', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const PreferencesAccessibilityScreen()),
      );

      final darkModeRow = find.ancestor(
        of: find.text('Dark Mode'),
        matching: find.byType(Row),
      );
      final darkModeSwitch = find.descendant(
        of: darkModeRow,
        matching: find.byType(Switch),
      );

      expect(tester.widget<Switch>(darkModeSwitch).value, isFalse);

      await tester.tap(darkModeSwitch);
      await tester.pump();

      expect(tester.widget<Switch>(darkModeSwitch).value, isTrue);
    });

    testWidgets('opens display and language dialogs', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const PreferencesAccessibilityScreen()),
      );

      final textSizeTile = find.text('Text Size');
      await tester.ensureVisible(textSizeTile);
      await tester.tap(textSizeTile);
      await tester.pumpAndSettle();
      expect(
        find.text('Text size adjustment feature coming soon'),
        findsOneWidget,
      );
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      final languageTile = find.text('Language');
      await tester.ensureVisible(languageTile);
      await tester.tap(languageTile);
      await tester.pumpAndSettle();
      expect(find.text('Select Language'), findsOneWidget);
      await tester.tap(find.text('Spanish'));
      await tester.pumpAndSettle();
    });

    testWidgets('opens time format dialog', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const PreferencesAccessibilityScreen()),
      );

      final timeFormatTile = find.text('Time Format');
      await tester.ensureVisible(timeFormatTile);
      await tester.tap(timeFormatTile);
      await tester.pumpAndSettle();

      expect(find.text('Time Format'), findsWidgets);
    });

    testWidgets('toggles accessibility switches', (tester) async {
      await tester.pumpWidget(
        createTestHarness(child: const PreferencesAccessibilityScreen()),
      );

      final boldTextRow = find.ancestor(
        of: find.text('Bold Text'),
        matching: find.byType(Row),
      );
      final boldTextSwitch = find.descendant(
        of: boldTextRow,
        matching: find.byType(Switch),
      );

      expect(tester.widget<Switch>(boldTextSwitch).value, isFalse);
      await tester.ensureVisible(boldTextSwitch);
      await tester.tap(boldTextSwitch);
      await tester.pump();
      expect(tester.widget<Switch>(boldTextSwitch).value, isTrue);
    });
  });
}
