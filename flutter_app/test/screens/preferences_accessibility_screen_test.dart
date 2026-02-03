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
import 'package:provider/provider.dart';

import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/screens/preferences_accessibility_screen.dart';

import '../helpers/test_harness.dart';

void main() {
  Widget createPreferencesHarness({Map<String, WidgetBuilder>? routes}) {
    final auth = AuthProvider()..setTestUser(UserRole.patient);
    return ChangeNotifierProvider<AuthProvider>.value(
      value: auth,
      child: createTestHarness(
        child: const PreferencesAccessibilityScreen(),
        routes: routes,
      ),
    );
  }

  group('PreferencesAccessibilityScreen', () {
    testWidgets('renders main sections', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());

      expect(find.text('Preferences & Accessibility'), findsOneWidget);
      expect(find.text('Display'), findsOneWidget);
      expect(find.text('Accessibility'), findsOneWidget);
      expect(find.text('Notifications'), findsOneWidget);
    });

    testWidgets('toggles dark mode switch', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());

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
      await tester.pumpWidget(createPreferencesHarness());

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
      await tester.pumpWidget(createPreferencesHarness());

      final timeFormatTile = find.text('Time Format');
      await tester.ensureVisible(timeFormatTile);
      await tester.tap(timeFormatTile);
      await tester.pumpAndSettle();

      expect(find.text('Time Format'), findsWidgets);
    });

    testWidgets('toggles accessibility switches', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());

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

    testWidgets('back button pops route', (tester) async {
      await tester.pumpWidget(
        createPreferencesHarness(
          routes: {
            '/preferences': (_) => const PreferencesAccessibilityScreen(),
            '/dashboard': (_) => const Scaffold(body: Text('Dashboard')),
          },
        ),
      );
      await tester.tap(find.byIcon(Icons.arrow_back));
      await tester.pumpAndSettle();
      expect(find.text('Preferences & Accessibility'), findsNothing);
    });

    testWidgets('toggles High Contrast switch', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      final row = find.ancestor(of: find.text('High Contrast'), matching: find.byType(Row));
      final sw = find.descendant(of: row, matching: find.byType(Switch));
      expect(tester.widget<Switch>(sw).value, isFalse);
      await tester.ensureVisible(sw);
      await tester.tap(sw);
      await tester.pump();
      expect(tester.widget<Switch>(sw).value, isTrue);
    });

    testWidgets('toggles notification and privacy switches', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      for (final label in ['Medication Reminders', 'Biometric Login', 'Data Sharing']) {
        final row = find.ancestor(of: find.text(label), matching: find.byType(Row));
        final sw = find.descendant(of: row, matching: find.byType(Switch));
        await tester.ensureVisible(sw);
        final before = tester.widget<Switch>(sw).value;
        await tester.tap(sw);
        await tester.pump();
        expect(tester.widget<Switch>(sw).value, isNot(equals(before)));
      }
    });

    testWidgets('opens date format dialog and selects option', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      await tester.ensureVisible(find.text('Date Format'));
      await tester.tap(find.text('Date Format'));
      await tester.pumpAndSettle();
      expect(find.text('Date Format'), findsWidgets);
      await tester.tap(find.text('YYYY-MM-DD'));
      await tester.pumpAndSettle();
    });

    testWidgets('HIPAA Consent shows snackbar', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      await tester.ensureVisible(find.text('HIPAA Consent'));
      await tester.tap(find.text('HIPAA Consent'));
      await tester.pump();
      expect(find.text('Privacy policy viewer coming soon'), findsOneWidget);
    });

    testWidgets('Save Preferences shows success snackbar', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      await tester.ensureVisible(find.text('Save Preferences'));
      await tester.tap(find.text('Save Preferences'));
      await tester.pump();
      expect(find.text('Preferences saved successfully'), findsOneWidget);
    });

    testWidgets('renders Language & Region and Privacy sections', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      expect(find.text('Language & Region'), findsOneWidget);
      expect(find.text('Privacy & Security'), findsOneWidget);
      expect(find.text('Language'), findsOneWidget);
      expect(find.text('Time Format'), findsOneWidget);
      expect(find.text('Biometric Login'), findsOneWidget);
    });

    testWidgets('toggles Screen Reader and Reduce Motion', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      for (final label in ['Screen Reader', 'Reduce Motion', 'Large Touch Targets']) {
        final row = find.ancestor(of: find.text(label), matching: find.byType(Row));
        final sw = find.descendant(of: row, matching: find.byType(Switch));
        await tester.ensureVisible(sw);
        final before = tester.widget<Switch>(sw).value;
        await tester.tap(sw);
        await tester.pump();
        expect(tester.widget<Switch>(sw).value, isNot(equals(before)));
      }
    });

    testWidgets('toggles Task Alerts and Health Alerts and Message Notifications', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      for (final label in ['Task Alerts', 'Health Alerts', 'Message Notifications']) {
        final row = find.ancestor(of: find.text(label), matching: find.byType(Row));
        final sw = find.descendant(of: row, matching: find.byType(Switch));
        await tester.ensureVisible(sw);
        final before = tester.widget<Switch>(sw).value;
        await tester.tap(sw);
        await tester.pump();
        expect(tester.widget<Switch>(sw).value, isNot(equals(before)));
      }
    });

    testWidgets('time format dialog select 24-hour', (tester) async {
      await tester.pumpWidget(createPreferencesHarness());
      await tester.ensureVisible(find.text('Time Format'));
      await tester.tap(find.text('Time Format'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('24-hour'));
      await tester.pumpAndSettle();
    });
  });
}
