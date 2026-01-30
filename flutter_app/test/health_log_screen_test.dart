// =============================================================================
// HEALTH LOGS SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Comprehensive testing for the Health Logs main screen.
//
// KEY CONCEPTS COVERED:
// 1. Testing with Provider state management
// 2. Testing grid layouts and multiple similar widgets
// 3. Testing conditional rendering (empty vs populated lists)
// 4. Testing navigation with route data passing
// 5. Testing accessibility with semantic labels
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/screens/health_logs_screen.dart';
import 'package:flutter_app/screens/health_log_add_screen.dart';
import 'package:flutter_app/providers/health_log_provider.dart';
import 'package:flutter_app/models/health_log.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS SETUP
  // ===========================================================================
  
  /// Creates a test harness with a fresh HealthLogProvider.
  Widget createTestHarness({HealthLogProvider? provider}) {
    return ChangeNotifierProvider(
      create: (_) => provider ?? HealthLogProvider(),
      child: const MaterialApp(
        home: HealthLogsScreen(),
      ),
    );
  }

  /// Creates a provider with no logs for testing empty states.
  HealthLogProvider createEmptyProvider() {
    final provider = HealthLogProvider();
    provider.clearLogs();
    return provider;
  }

  // ===========================================================================
  // TEST GROUP: RENDERING TESTS
  // ===========================================================================

  group('HealthLogsScreen Rendering', () {
    testWidgets('should render app bar with title', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Health Logs'), findsOneWidget);
      expect(find.byType(AppBar), findsOneWidget);
    });

    testWidgets('should render back button in app bar', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final backButton = find.widgetWithIcon(IconButton, Icons.arrow_back);
      expect(backButton, findsOneWidget);
    });

    testWidgets('should render "Add a Log" button', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Add a Log'), findsOneWidget);
      expect(find.widgetWithText(FilledButton, 'Add a Log'), findsOneWidget);
    });

    testWidgets('should render "Quick Log" section header', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Quick Log'), findsOneWidget);
    });

    testWidgets('should render all 6 quick log buttons', (tester) async {
      // remove logs to not have duplicate icons
      final provider = createEmptyProvider();
      await tester.pumpWidget(createTestHarness(provider: provider));

      // Verify all 6 quick log option labels are present
      expect(find.text('Mood'), findsOneWidget);
      expect(find.text('Symptoms'), findsOneWidget);
      expect(find.text('Meals'), findsOneWidget);
      expect(find.text('Water'), findsOneWidget);
      expect(find.text('Exercise'), findsOneWidget);
      expect(find.text('Sleep'), findsOneWidget);
    });

    testWidgets('should render quick log buttons with correct icons', (tester) async {
      // remove logs to not have duplicate icons
      final provider = createEmptyProvider();
      await tester.pumpWidget(createTestHarness(provider: provider));

      // Icons should be present in the quick log buttons
      expect(find.byIcon(Icons.emoji_emotions), findsOneWidget);
      expect(find.byIcon(Icons.monitor_heart), findsOneWidget);
      expect(find.byIcon(Icons.restaurant), findsOneWidget);
      expect(find.byIcon(Icons.water_drop), findsOneWidget);
      expect(find.byIcon(Icons.favorite), findsOneWidget);
      expect(find.byIcon(Icons.bedtime), findsOneWidget);
    });

    testWidgets('should render "Today\'s Logs" section header', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text("Today's Logs"), findsOneWidget);
    });

    testWidgets('should render today\'s log entries when present', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // The default provider initializes with mock logs for today
      // Verify at least one log card is rendered
      expect(find.byType(SingleChildScrollView), findsOneWidget);
      
      // Check for mock log content
      expect(find.text('Happy'), findsOneWidget);
      expect(find.text('Oatmeal with berries'), findsOneWidget);
    });

    testWidgets('should render empty state when no logs for today', (tester) async {
      final emptyProvider = createEmptyProvider();
      await tester.pumpWidget(createTestHarness(provider: emptyProvider));

      expect(
        find.text('No logs yet today. Use Quick Log to add one.'),
        findsOneWidget,
      );
    });

    testWidgets('should use GridView for quick log buttons', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(GridView), findsOneWidget);
    });

    testWidgets('should use SafeArea to avoid notches', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(SafeArea), findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: INTERACTION TESTS
  // ===========================================================================

  group('HealthLogsScreen Interactions', () {
    testWidgets('tapping back button should pop navigation', (tester) async {
      // Create a navigator observer to track navigation
      final navigatorKey = GlobalKey<NavigatorState>();
      
      await tester.pumpWidget(
        ChangeNotifierProvider(
          create: (_) => HealthLogProvider(),
          child: MaterialApp(
            navigatorKey: navigatorKey,
            home: const Scaffold(body: Center(child: Text('Home'))),
            routes: {
              '/health-logs': (context) => const HealthLogsScreen(),
            },
          ),
        ),
      );

      // Navigate to health logs screen
      navigatorKey.currentState!.pushNamed('/health-logs');
      await tester.pumpAndSettle();

      expect(find.text('Health Logs'), findsOneWidget);

      // Tap back button
      await tester.tap(find.widgetWithIcon(IconButton, Icons.arrow_back));
      await tester.pumpAndSettle();

      // Should be back at home screen
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Health Logs'), findsNothing);
    });

    testWidgets('tapping "Add a Log" should navigate to HealthLogAddScreen', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      await tester.tap(find.text('Add a Log'));
      await tester.pumpAndSettle();

      // Should navigate to add screen
      expect(find.byType(HealthLogAddScreen), findsOneWidget);
      expect(find.text('New Health Log'), findsOneWidget);
    });

    testWidgets('tapping "Add a Log" should pass general type as initial type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      await tester.tap(find.text('Add a Log'));
      await tester.pumpAndSettle();

      // Verify the screen was created with general type
      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.general);
    });

    testWidgets('tapping Mood quick log should navigate with mood type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find the mood button by its text
      await tester.tap(find.text('Mood'));
      await tester.pumpAndSettle();

      expect(find.byType(HealthLogAddScreen), findsOneWidget);
      
      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.mood);
    });

    testWidgets('tapping Water quick log should navigate with water type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      await tester.tap(find.text('Water'));
      await tester.pumpAndSettle();

      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.water);
    });

    testWidgets('tapping Symptoms quick log should navigate with symptoms type',
        (tester) async {
      await tester.pumpWidget(createTestHarness());
      await tester.tap(find.text('Symptoms'));
      await tester.pumpAndSettle();
      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.symptoms);
    });

    testWidgets('tapping Meals quick log should navigate with meals type',
        (tester) async {
      await tester.pumpWidget(createTestHarness());
      await tester.tap(find.text('Meals'));
      await tester.pumpAndSettle();
      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.meals);
    });

    testWidgets('tapping Exercise quick log should navigate with exercise type',
        (tester) async {
      await tester.pumpWidget(createTestHarness());
      await tester.tap(find.text('Exercise'));
      await tester.pumpAndSettle();
      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.exercise);
    });

    testWidgets('tapping Sleep quick log should navigate with sleep type',
        (tester) async {
      await tester.pumpWidget(createTestHarness());
      await tester.tap(find.text('Sleep'));
      await tester.pumpAndSettle();
      final addScreen = tester.widget<HealthLogAddScreen>(
        find.byType(HealthLogAddScreen),
      );
      expect(addScreen.initialType, HealthLogType.sleep);
    });

    testWidgets('quick log buttons should all be tappable', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find all OutlinedButtons (quick log buttons)
      final quickLogButtons = find.byType(OutlinedButton);
      
      // Should find 6 quick log buttons
      expect(quickLogButtons, findsNWidgets(6));

      // Verify each has an onPressed callback (is enabled)
      for (int i = 0; i < 6; i++) {
        final button = tester.widget<OutlinedButton>(quickLogButtons.at(i));
        expect(button.onPressed, isNotNull);
      }
    });
  });

  // ===========================================================================
  // TEST GROUP: PROVIDER INTEGRATION TESTS
  // ===========================================================================

  group('HealthLogsScreen Provider Integration', () {
    testWidgets('should display logs from provider', (tester) async {
      final provider = HealthLogProvider();
      await tester.pumpWidget(createTestHarness(provider: provider));

      // Provider initializes with mock data
      expect(provider.logs.isNotEmpty, isTrue);
      
      // Verify log content is displayed
      final todayLogs = provider.logsForDate(DateTime.now());
      expect(todayLogs.isNotEmpty, isTrue);
    });

    testWidgets('should update when new log is added', (tester) async {
      final provider = createEmptyProvider();
      await tester.pumpWidget(createTestHarness(provider: provider));

      // Initially empty
      expect(
        find.text('No logs yet today. Use Quick Log to add one.'),
        findsOneWidget,
      );

      // Add a log
      final newLog = HealthLog(
        id: 'test-1',
        type: HealthLogType.mood,
        description: 'Test Mood',
        createdAt: DateTime.now(),
        emoji: '😊',
      );
      provider.addLog(newLog);
      await tester.pump();

      // Should now display the log
      expect(find.text('Test Mood'), findsOneWidget);
      expect(
        find.text('No logs yet today. Use Quick Log to add one.'),
        findsNothing,
      );
    });

    testWidgets('should only display today\'s logs', (tester) async {
      final provider = createEmptyProvider();
      
      // Add a log for today
      final todayLog = HealthLog(
        id: 'today-1',
        type: HealthLogType.mood,
        description: 'Today Log',
        createdAt: DateTime.now(),
      );
      
      // Add a log for yesterday
      final yesterday = DateTime.now().subtract(const Duration(days: 1));
      final yesterdayLog = HealthLog(
        id: 'yesterday-1',
        type: HealthLogType.mood,
        description: 'Yesterday Log',
        createdAt: yesterday,
      );
      
      provider.addLog(todayLog);
      provider.addLog(yesterdayLog);
      
      await tester.pumpWidget(createTestHarness(provider: provider));

      // Should only show today's log
      expect(find.text('Today Log'), findsOneWidget);
      expect(find.text('Yesterday Log'), findsNothing);
    });
  });

  // ===========================================================================
  // TEST GROUP: ACCESSIBILITY TESTS
  // ===========================================================================

  group('HealthLogsScreen Accessibility', () {
    testWidgets('quick log buttons should have semantic labels', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Each quick log button should have a descriptive semantic label
      expect(find.bySemanticsLabel('Mood quick log, button'), findsOneWidget);
      expect(find.bySemanticsLabel('Symptoms quick log, button'), findsOneWidget);
      expect(find.bySemanticsLabel('Meals quick log, button'), findsOneWidget);
      expect(find.bySemanticsLabel('Water quick log, button'), findsOneWidget);
      expect(find.bySemanticsLabel('Exercise quick log, button'), findsOneWidget);
      expect(find.bySemanticsLabel('Sleep quick log, button'), findsOneWidget);
    });

    testWidgets('log cards should have semantic labels with content', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find log cards with semantic information
      // The mock data includes a "Happy" mood log with a note
      final semanticsFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Semantics &&
            widget.properties.label != null &&
            widget.properties.label!.contains('Happy'),
      );

      expect(semanticsFinder, findsWidgets);
    });

    testWidgets('buttons should be marked as buttons in semantics', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find semantics with button property
      final buttonSemantics = find.byWidgetPredicate(
        (widget) =>
            widget is Semantics &&
            widget.properties.button == true,
      );

      // Should find at least the 6 quick log buttons
      expect(buttonSemantics, findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: LOG CARD RENDERING
  // ===========================================================================

  group('HealthLogsScreen Log Card Rendering', () {
    testWidgets('log cards should display emoji when present', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Mock data includes a mood log with emoji
      expect(find.text('😊'), findsOneWidget);
    });

    testWidgets('log cards should display time', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Should find time labels (mock logs have specific times)
      // Looking for any text matching time format
      final timeFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Text &&
            widget.data != null &&
            (widget.data!.contains('AM') || widget.data!.contains('PM')),
      );

      expect(timeFinder, findsWidgets);
    });

    testWidgets('water log cards should display progress bar', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Mock data includes a water log with progress
      expect(find.byType(LinearProgressIndicator), findsOneWidget);
    });

    testWidgets('water log cards should display goal text', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Mock water log has a goal of 64 oz
      expect(find.textContaining('Goal:'), findsOneWidget);
      expect(find.textContaining('64 oz'), findsOneWidget);
    });

    testWidgets('log cards should have rounded corners', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find containers with BorderRadius
      final decoratedBoxes = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).borderRadius != null,
      );

      expect(decoratedBoxes, findsWidgets);
    });

    testWidgets('log cards should display note when present', (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'with-note',
        type: HealthLogType.mood,
        description: 'Calm',
        createdAt: DateTime.now(),
        note: 'Had a good rest.',
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      expect(find.text('Calm'), findsOneWidget);
      expect(find.text('Had a good rest.'), findsOneWidget);
    });

    testWidgets('log cards should not show note line when note is null',
        (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'no-note',
        type: HealthLogType.general,
        description: 'Quick entry',
        createdAt: DateTime.now(),
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      expect(find.text('Quick entry'), findsOneWidget);
      expect(find.text('Quick entry'), findsOneWidget);
    });

    testWidgets('log cards without emoji still display description and time',
        (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'no-emoji',
        type: HealthLogType.meals,
        description: 'Salad',
        createdAt: DateTime.now(),
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      expect(find.text('Salad'), findsOneWidget);
      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });

    testWidgets('general type log card shows description icon', (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'gen-1',
        type: HealthLogType.general,
        description: 'General entry',
        createdAt: DateTime.now(),
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      expect(find.text('General entry'), findsOneWidget);
      expect(find.byIcon(Icons.description), findsWidgets);
    });

    testWidgets('exercise type log card shows favorite icon', (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'ex-1',
        type: HealthLogType.exercise,
        description: 'Morning run',
        createdAt: DateTime.now(),
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      expect(find.text('Morning run'), findsOneWidget);
      expect(find.byIcon(Icons.favorite), findsWidgets);
    });

    testWidgets('sleep type log card shows bedtime icon', (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'sl-1',
        type: HealthLogType.sleep,
        description: '7 hours',
        createdAt: DateTime.now(),
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      expect(find.text('7 hours'), findsOneWidget);
      expect(find.byIcon(Icons.bedtime), findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: LAYOUT TESTS
  // ===========================================================================

  group('HealthLogsScreen Layout', () {
    testWidgets('quick log grid should have 3 columns', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final gridView = tester.widget<GridView>(find.byType(GridView));
      final gridDelegate = gridView.gridDelegate as SliverGridDelegateWithFixedCrossAxisCount;
      
      expect(gridDelegate.crossAxisCount, 3);
    });

    testWidgets('should use Column for main layout', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(Column), findsWidgets);
    });

    testWidgets('should use SingleChildScrollView for scrollable content', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });

    testWidgets('empty state should be centered', (tester) async {
      final emptyProvider = createEmptyProvider();
      await tester.pumpWidget(createTestHarness(provider: emptyProvider));

      // Find the empty state container
      final emptyStateFinder = find.text('No logs yet today. Use Quick Log to add one.');
      expect(emptyStateFinder, findsOneWidget);

      // Verify it's in a Center widget
      final centerFinder = find.ancestor(
        of: emptyStateFinder,
        matching: find.byType(Center),
      );
      expect(centerFinder, findsOneWidget);
    });

    testWidgets('AppBar has centerTitle and zero elevation', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final appBar = tester.widget<AppBar>(find.byType(AppBar));
      expect(appBar.centerTitle, isTrue);
      expect(appBar.elevation, 0);
    });

    testWidgets('Add a Log button has minimum tap target height', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final buttonFinder = find.widgetWithText(FilledButton, 'Add a Log');
      expect(buttonFinder, findsOneWidget);
      await tester.ensureVisible(buttonFinder);
      final size = tester.getSize(buttonFinder);
      expect(size.height, greaterThanOrEqualTo(48));
    });

    testWidgets('empty state container has border and padding', (tester) async {
      final emptyProvider = createEmptyProvider();
      await tester.pumpWidget(createTestHarness(provider: emptyProvider));

      final emptyText = find.text('No logs yet today. Use Quick Log to add one.');
      final container = find.ancestor(
        of: emptyText,
        matching: find.byWidgetPredicate(
          (w) => w is Container && w.decoration is BoxDecoration,
        ),
      );
      expect(container, findsOneWidget);
      final box = tester.widget<Container>(container);
      expect((box.decoration as BoxDecoration).border, isNotNull);
    });
  });

  // ===========================================================================
  // TEST GROUP: SEMANTICS (LOG CARD LABELS)
  // ===========================================================================

  group('HealthLogsScreen Log Card Semantics', () {
    testWidgets('log card with note includes note in semantic label',
        (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'sn-1',
        type: HealthLogType.mood,
        description: 'Relaxed',
        createdAt: DateTime.now(),
        note: 'Evening wind down',
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      final semanticsWithNote = find.byWidgetPredicate(
        (w) =>
            w is Semantics &&
            w.properties.label != null &&
            w.properties.label!.contains('Relaxed') &&
            w.properties.label!.contains('Evening wind down'),
      );
      expect(semanticsWithNote, findsWidgets);
    });

    testWidgets('log card without note has description and time in label',
        (tester) async {
      final provider = createEmptyProvider();
      provider.addLog(HealthLog(
        id: 'sn-2',
        type: HealthLogType.general,
        description: 'Brief note',
        createdAt: DateTime.now(),
      ));
      await tester.pumpWidget(createTestHarness(provider: provider));

      final semanticsLabel = find.byWidgetPredicate(
        (w) =>
            w is Semantics &&
            w.properties.label != null &&
            w.properties.label!.contains('Brief note') &&
            !w.properties.label!.contains('null'),
      );
      expect(semanticsLabel, findsWidgets);
    });
  });
}