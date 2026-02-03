// =============================================================================
// HEALTH LOG ADD SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Health log add form rendering and type-specific fields.
//
// KEY CONCEPTS COVERED:
// 1. Rendering form fields for different log types
// 2. Dropdown interactions for log type selection
// 3. Provider-backed water log fields
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
  });
}
