// =============================================================================
// HEALTH LOG ADD SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Health log add form rendering, type-specific fields, save, close.
//
// KEY CONCEPTS COVERED:
// 1. Rendering form fields for different log types
// 2. Dropdown interactions for log type selection
// 3. Provider-backed water log fields
// 4. Close button pops route
// 5. Save flows for mood, sleep, blood pressure, heart rate, generic
// 6. Validation when required fields empty
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/models/health_log.dart';
import 'package:flutter_app/providers/health_log_provider.dart';
import 'package:flutter_app/screens/health_log_add_screen.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  Widget createTestHarness({required HealthLogType initialType}) {
    return ChangeNotifierProvider<HealthLogProvider>(
      create: (_) => HealthLogProvider(),
      child: MaterialApp(home: HealthLogAddScreen(initialType: initialType)),
    );
  }

  group('HealthLogAddScreen Rendering', () {
    testWidgets('renders base form elements for mood', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.mood),
      );

      expect(find.text('New Health Log'), findsOneWidget);
      expect(find.text('Save Log'), findsOneWidget);
      expect(find.text('Log Type'), findsOneWidget);
      expect(find.text('Mood'), findsWidgets);
    });

    testWidgets('shows water fields after selecting Water type', (
      tester,
    ) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.mood),
      );

      await tester.tap(find.text('Mood').first);
      await tester.pumpAndSettle();
      await tester.tap(find.text('Water').last);
      await tester.pumpAndSettle();

      expect(find.textContaining('Current total:'), findsOneWidget);
      expect(find.text('Add (or subtract) ounces'), findsOneWidget);
    });

    testWidgets('close button pops route', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.mood),
      );
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();
      expect(find.text('New Health Log'), findsNothing);
    });

    testWidgets('renders blood pressure fields for blood pressure type', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.bloodPressure),
      );
      expect(find.text('Systolic (upper)'), findsOneWidget);
      expect(find.text('Diastolic (lower)'), findsOneWidget);
    });

    testWidgets('renders heart rate field for heart rate type', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.heartRate),
      );
      expect(find.text('Heart rate (bpm)'), findsOneWidget);
    });

    testWidgets('renders sleep slider for sleep type', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.sleep),
      );
      expect(find.textContaining('Sleep duration:'), findsOneWidget);
      expect(find.byType(Slider), findsOneWidget);
    });

    testWidgets('renders description field for general type', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.general),
      );
      expect(find.text('Description'), findsOneWidget);
    });
  });

  group('HealthLogAddScreen Save', () {
    testWidgets('save mood log pops with HealthLog', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.mood),
      );
      await tester.tap(find.text('😊 Happy'));
      await tester.pump();
      await tester.tap(find.text('Save Log'));
      await tester.pumpAndSettle();

      expect(find.text('New Health Log'), findsNothing);
    });

    testWidgets('save sleep log pops with HealthLog', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.sleep),
      );
      await tester.tap(find.text('Save Log'));
      await tester.pumpAndSettle();

      expect(find.text('New Health Log'), findsNothing);
    });

    testWidgets('save blood pressure log with valid values pops', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.bloodPressure),
      );
      // First two TextFormFields are systolic and diastolic.
      final formFields = find.byType(TextFormField);
      await tester.enterText(formFields.at(0), '120');
      await tester.enterText(formFields.at(1), '80');
      await tester.pump();
      await tester.tap(find.text('Save Log'));
      await tester.pumpAndSettle();

      expect(find.text('New Health Log'), findsNothing);
    });

    testWidgets('save heart rate log with valid bpm pops', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.heartRate),
      );
      // First TextFormField is bpm (dropdown is DropdownButtonFormField).
      final bpmField = find.byType(TextFormField).first;
      await tester.enterText(bpmField, '72');
      await tester.pump();
      await tester.tap(find.text('Save Log'));
      await tester.pumpAndSettle();

      expect(find.text('New Health Log'), findsNothing);
    });

    testWidgets('save general log with description pops', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.general),
      );
      await tester.enterText(find.byType(TextFormField).first, 'General note');
      await tester.pump();
      await tester.tap(find.text('Save Log'));
      await tester.pumpAndSettle();

      expect(find.text('New Health Log'), findsNothing);
    });

    testWidgets('save general without description shows validation', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.general),
      );
      await tester.tap(find.text('Save Log'));
      await tester.pump();
      expect(find.text('Enter a description'), findsOneWidget);
    });

    testWidgets('save water log with amount pops', (tester) async {
      await tester.pumpWidget(
        createTestHarness(initialType: HealthLogType.water),
      );
      await tester.enterText(
        find.byType(TextFormField).first,
        '8',
      );
      await tester.pump();
      await tester.tap(find.text('Save Log'));
      await tester.pumpAndSettle();

      expect(find.text('New Health Log'), findsNothing);
    });
  });
}
