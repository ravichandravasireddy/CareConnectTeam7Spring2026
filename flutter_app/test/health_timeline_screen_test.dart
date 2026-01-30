// =============================================================================
// HEALTH TIMELINE SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - Comprehensive testing for the Health Timeline screen.
//
// KEY CONCEPTS COVERED:
// 1. Testing screens with multiple provider dependencies
// 2. Testing conditional rendering (empty vs populated states)
// 3. Testing complex layouts with positioned widgets
// 4. Testing date formatting logic
// 5. Testing accessibility with multiple event types
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/screens/health_timeline_screen.dart';
import 'package:flutter_app/providers/health_timeline_provider.dart';
import 'package:flutter_app/providers/health_log_provider.dart';
import 'package:flutter_app/providers/note_provider.dart';
import 'package:flutter_app/providers/task_provider.dart';
import 'package:flutter_app/models/health_log.dart';
import 'package:flutter_app/models/note.dart';
import 'package:flutter_app/models/task.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS SETUP
  // ===========================================================================

  Widget createTestHarness({
    HealthLogProvider? healthLogProvider,
    NoteProvider? noteProvider,
    TaskProvider? taskProvider,
  }) {
    final hlProvider = healthLogProvider ?? HealthLogProvider();
    final nProvider = noteProvider ?? NoteProvider();
    final tProvider = taskProvider ?? TaskProvider();

    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: hlProvider),
        ChangeNotifierProvider.value(value: nProvider),
        ChangeNotifierProvider.value(value: tProvider),
        ProxyProvider3<HealthLogProvider, NoteProvider, TaskProvider, HealthTimelineProvider>(
          update: (_, healthLog, note, task, _) => HealthTimelineProvider(
            healthLogProvider: healthLog,
            noteProvider: note,
            taskProvider: task,
          ),
        ),
      ],
      child: const MaterialApp(
        home: HealthTimelineScreen(),
      ),
    );
  }

  HealthLogProvider createEmptyHealthLogProvider() {
    final provider = HealthLogProvider();
    provider.clearLogs();
    return provider;
  }

  NoteProvider createEmptyNoteProvider() {
    final provider = NoteProvider();
    provider.clearNotes();
    return provider;
  }

  TaskProvider createEmptyTaskProvider() {
    final provider = TaskProvider();
    provider.clearTasks();
    return provider;
  }

  // ===========================================================================
  // TEST GROUP: RENDERING TESTS
  // ===========================================================================

  group('HealthTimelineScreen Rendering', () {
    testWidgets('should render app bar with title', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Health Timeline'), findsOneWidget);
      expect(find.byType(AppBar), findsOneWidget);
    });

    testWidgets('should render back button in app bar', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final backButton = find.widgetWithIcon(IconButton, Icons.arrow_back);
      expect(backButton, findsOneWidget);
    });

    testWidgets('should use SafeArea', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(SafeArea), findsWidgets);
    });

    testWidgets('should render timeline events when data exists', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Default providers have mock data
      expect(find.byType(SingleChildScrollView), findsOneWidget);
      
      // Should have timeline items rendered
      expect(find.byType(Row), findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: EMPTY STATE TESTS
  // ===========================================================================

  group('HealthTimelineScreen Empty State', () {
    testWidgets('should display empty message when no events exist', (tester) async {
      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(
        find.text(
          'No timeline events yet. Add health logs, notes, or tasks to see them here.',
        ),
        findsOneWidget,
      );
    });

    testWidgets('empty state should be centered', (tester) async {
      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Only the screen's body Center contains the empty message (AppBar adds 2 more Centers)
      final emptyMessage = find.text(
        'No timeline events yet. Add health logs, notes, or tasks to see them here.',
      );
      final centerFinder = find.ancestor(
        of: emptyMessage,
        matching: find.byType(Center),
      );
      expect(centerFinder, findsOneWidget);
    });

    testWidgets('should NOT render timeline body when empty', (tester) async {
      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should not find the timeline vertical line or items
      expect(find.byType(SingleChildScrollView), findsNothing);
    });

    testWidgets('should still render app bar when empty', (tester) async {
      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.text('Health Timeline'), findsOneWidget);
      expect(find.byType(AppBar), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: TIMELINE ITEM RENDERING
  // ===========================================================================

  group('HealthTimelineScreen Timeline Items', () {
    testWidgets('should render timeline items with icons', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should render the mood icon
      expect(find.byIcon(Icons.emoji_emotions), findsOneWidget);
    });

    testWidgets('should render timeline item titles', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.text('Mood'), findsOneWidget);
    });

    testWidgets('should render timeline item subtitles', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Happy mood description',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.text('Happy mood description'), findsOneWidget);
    });

    testWidgets('should render time labels', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should find "Today" in the time label
      expect(find.textContaining('Today'), findsOneWidget);
    });

    testWidgets('should render status labels when present', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'bp-test',
        type: HealthLogType.bloodPressure,
        description: '120/80',
        createdAt: DateTime.now(),
        systolic: 120,
        diastolic: 80,
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should render a status label container
      final containerFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.padding == const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      );
      expect(containerFinder, findsWidgets);
    });

    testWidgets('should NOT render status labels when not present', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should not find status label padding
      final statusContainerFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.padding == const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      );
      expect(statusContainerFinder, findsNothing);
    });

    testWidgets('should render circular icon backgrounds', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Find the circular icon container
      final circleFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).shape == BoxShape.circle,
      );
      expect(circleFinder, findsOneWidget);
    });

    testWidgets('icon containers should have correct size', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      final container = tester.widget<Container>(
        find.byWidgetPredicate(
          (widget) =>
              widget is Container &&
              widget.decoration is BoxDecoration &&
              (widget.decoration as BoxDecoration).shape == BoxShape.circle,
        ),
      );
      
      expect(container.constraints?.maxWidth, 48);
      expect(container.constraints?.maxHeight, 48);
    });
  });

  // ===========================================================================
  // TEST GROUP: MULTIPLE EVENT TYPES
  // ===========================================================================

  group('HealthTimelineScreen Multiple Event Types', () {
    testWidgets('should render health log events', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'log',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.text('Mood'), findsOneWidget);
    });

    testWidgets('should render note events', (tester) async {
      final noteProvider = createEmptyNoteProvider();
      noteProvider.addNote(Note(
        id: 'note',
        title: 'Test note title',
        body: 'Test note',
        author: 'Test author',
        createdAt: DateTime.now(),
        category: NoteCategory.medication,
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: noteProvider,
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.text('Note Added'), findsOneWidget);
      expect(find.text('Test note'), findsOneWidget);
    });

    testWidgets('should render completed task events', (tester) async {
      final taskProvider = createEmptyTaskProvider();
      taskProvider.addTask(Task(
        id: 'task',
        title: 'Take medication',
        date: DateTime.now(),
        completedAt: DateTime.now(),
        icon: Icons.medication,
        iconBackground: Colors.blue,
        iconColor: Colors.white,
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: createEmptyNoteProvider(),
        taskProvider: taskProvider,
      ));

      expect(find.text('Task Completed'), findsOneWidget);
      expect(find.text('Take medication'), findsOneWidget);
    });

    testWidgets('should render mixed event types together', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      final noteProvider = createEmptyNoteProvider();
      final taskProvider = createEmptyTaskProvider();

      healthLogProvider.addLog(HealthLog(
        id: 'log',
        type: HealthLogType.mood,
        description: 'Happy',
        createdAt: DateTime.now(),
      ));

      noteProvider.addNote(Note(
        id: 'note',
        title: 'Note title',
        body: 'Note text',
        author: 'Test author',
        createdAt: DateTime.now(),
        category: NoteCategory.medication,
      ));

      taskProvider.addTask(Task(
        id: 'task',
        title: 'Task title',
        date: DateTime.now(),
        completedAt: DateTime.now(),
        icon: Icons.check,
        iconBackground: Colors.blue,
        iconColor: Colors.white,
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: noteProvider,
        taskProvider: taskProvider,
      ));

      // All three event types should be visible
      expect(find.text('Mood'), findsOneWidget);
      expect(find.text('Note Added'), findsOneWidget);
      expect(find.text('Task Completed'), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: LAYOUT TESTS
  // ===========================================================================

  group('HealthTimelineScreen Layout', () {
    testWidgets('should use Stack for timeline layout', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Only the timeline body uses Stack; MaterialApp's Overlay also uses a Stack
      final stackInTimeline = find.descendant(
        of: find.byType(SingleChildScrollView),
        matching: find.byType(Stack),
      );
      expect(stackInTimeline, findsOneWidget);
    });

    testWidgets('should use LayoutBuilder for responsive layout', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Scope to the timeline body; framework may add other LayoutBuilders
      final layoutBuilderInTimeline = find.descendant(
        of: find.byType(SingleChildScrollView),
        matching: find.byType(LayoutBuilder),
      );
      expect(layoutBuilderInTimeline, findsOneWidget);
    });

    testWidgets('should render vertical timeline line', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find the vertical line Positioned inside the timeline (Overlay has other Positioned)
      final positionedFinder = find.descendant(
        of: find.byType(SingleChildScrollView),
        matching: find.byWidgetPredicate(
          (widget) =>
              widget is Positioned &&
              widget.left == 23 &&
              widget.top == 24 &&
              widget.bottom == 24,
        ),
      );
      expect(positionedFinder, findsOneWidget);
    });

    testWidgets('vertical line should have correct width', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find the timeline's Positioned (left: 23) so we don't match Overlay's Positioned
      final positionedFinder = find.descendant(
        of: find.byType(SingleChildScrollView),
        matching: find.byWidgetPredicate(
          (widget) => widget is Positioned && widget.left == 23,
        ),
      );
      final positioned = tester.widget<Positioned>(positionedFinder);
      
      final container = positioned.child as Container;
      expect(container.constraints?.maxWidth, 2);
    });

    testWidgets('should use Column for timeline items', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(Column), findsWidgets);
    });

    testWidgets('timeline items should have bottom padding', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Find Padding widgets with bottom: 24
      final paddingFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Padding &&
            widget.padding == const EdgeInsets.only(bottom: 24),
      );
      expect(paddingFinder, findsWidgets);
    });

    testWidgets('should use Row for timeline item layout', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.byType(Row), findsWidgets);
    });

    testWidgets('card should have rounded corners', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      final containerFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).borderRadius != null,
      );
      expect(containerFinder, findsWidgets);
    });

    testWidgets('should be scrollable', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: INTERACTION TESTS
  // ===========================================================================

  group('HealthTimelineScreen Interactions', () {
    testWidgets('back button should pop navigation', (tester) async {
      final navigatorKey = GlobalKey<NavigatorState>();
      
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => HealthLogProvider()),
            ChangeNotifierProvider(create: (_) => NoteProvider()),
            ChangeNotifierProvider(create: (_) => TaskProvider()),
            ProxyProvider3<HealthLogProvider, NoteProvider, TaskProvider, HealthTimelineProvider>(
              update: (_, healthLog, note, task, _) => HealthTimelineProvider(
                healthLogProvider: healthLog,
                noteProvider: note,
                taskProvider: task,
              ),
            ),
          ],
          child: MaterialApp(
            navigatorKey: navigatorKey,
            home: const Scaffold(body: Center(child: Text('Home'))),
            routes: {
              '/timeline': (context) => const HealthTimelineScreen(),
            },
          ),
        ),
      );

      navigatorKey.currentState!.pushNamed('/timeline');
      await tester.pumpAndSettle();

      expect(find.text('Health Timeline'), findsOneWidget);

      await tester.tap(find.widgetWithIcon(IconButton, Icons.arrow_back));
      await tester.pumpAndSettle();

      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Health Timeline'), findsNothing);
    });
  });

  // ===========================================================================
  // TEST GROUP: DATE FORMATTING TESTS
  // ===========================================================================

  group('HealthTimelineScreen Date Formatting', () {
    testWidgets('should display "Today" for today\'s events', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'today',
        type: HealthLogType.mood,
        description: 'Follow Up',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.textContaining('Today,'), findsOneWidget);
    });

    testWidgets('should display "Yesterday" for yesterday\'s events', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      final yesterday = DateTime.now().subtract(const Duration(days: 1));
      
      healthLogProvider.addLog(HealthLog(
        id: 'yesterday',
        type: HealthLogType.mood,
        description: 'Follow Up',
        createdAt: yesterday,
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.textContaining('Yesterday,'), findsOneWidget);
    });

    testWidgets('should include time in all date labels', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should find time with AM or PM
      final timeFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Text &&
            widget.data != null &&
            (widget.data!.contains('AM') || widget.data!.contains('PM')),
      );
      expect(timeFinder, findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: PROVIDER REACTIVITY TESTS
  // ===========================================================================

  group('HealthTimelineScreen Provider Reactivity', () {
    testWidgets('should update when health log is added', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Initially empty
      expect(
        find.text('No timeline events yet. Add health logs, notes, or tasks to see them here.'),
        findsOneWidget,
      );

      // Add a log
      healthLogProvider.addLog(HealthLog(
        id: 'new',
        type: HealthLogType.mood,
        description: 'New log',
        createdAt: DateTime.now(),
      ));
      await tester.pump();

      // Should now show the event
      expect(find.text('Mood'), findsOneWidget);
      expect(
        find.text('No timeline events yet. Add health logs, notes, or tasks to see them here.'),
        findsNothing,
      );
    });

    testWidgets('should update when note is added', (tester) async {
      final noteProvider = createEmptyNoteProvider();

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: noteProvider,
        taskProvider: createEmptyTaskProvider(),
      ));

      // Add a note
      noteProvider.addNote(Note(
        id: 'new',
        title: 'New note title',
        body: 'New note',
        author: 'Test author',
        createdAt: DateTime.now(),
        category: NoteCategory.medication,
      ));
      await tester.pump();

      expect(find.text('Note Added'), findsOneWidget);
    });

    testWidgets('should update when task is completed', (tester) async {
      final taskProvider = createEmptyTaskProvider();

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: createEmptyHealthLogProvider(),
        noteProvider: createEmptyNoteProvider(),
        taskProvider: taskProvider,
      ));

      // Add a completed task
      taskProvider.addTask(Task(
        id: 'new',
        title: 'New task',
        date: DateTime.now(),
        completedAt: DateTime.now(),
        icon: Icons.check,
        iconBackground: Colors.blue,
        iconColor: Colors.white,
      ));
      await tester.pump();

      expect(find.text('Task Completed'), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: VISUAL STYLING TESTS
  // ===========================================================================

  group('HealthTimelineScreen Visual Styling', () {
    testWidgets('cards should have border', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Find container with border
      final containerFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).border != null,
      );
      expect(containerFinder, findsWidgets);
    });

    testWidgets('cards should have shadow', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Find container with box shadow
      final containerFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).boxShadow != null,
      );
      expect(containerFinder, findsWidgets);
    });

    testWidgets('icon circles should have border', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Find circular container with border
      final containerFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Container &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).shape == BoxShape.circle &&
            (widget.decoration as BoxDecoration).border != null,
      );
      expect(containerFinder, findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: EDGE CASES
  // ===========================================================================

  group('HealthTimelineScreen Edge Cases', () {
    testWidgets('should handle very long subtitles', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'long',
        type: HealthLogType.general,
        description: 'A' * 500, // Very long description
        createdAt: DateTime.now(),
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should render without error
      expect(find.byType(HealthTimelineScreen), findsOneWidget);
    });

    testWidgets('should handle events with null subtitles', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      healthLogProvider.addLog(HealthLog(
        id: 'test',
        type: HealthLogType.mood,
        description: 'Test',
        createdAt: DateTime.now(),
        note: null,
      ));

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      expect(find.byType(HealthTimelineScreen), findsOneWidget);
    });

    testWidgets('should handle large number of events', (tester) async {
      final healthLogProvider = createEmptyHealthLogProvider();
      
      // Add 50 events
      for (int i = 0; i < 50; i++) {
        healthLogProvider.addLog(HealthLog(
          id: 'log-$i',
          type: HealthLogType.mood,
          description: 'Log $i',
          createdAt: DateTime.now().subtract(Duration(minutes: i)),
        ));
      }

      await tester.pumpWidget(createTestHarness(
        healthLogProvider: healthLogProvider,
        noteProvider: createEmptyNoteProvider(),
        taskProvider: createEmptyTaskProvider(),
      ));

      // Should render without error
      expect(find.byType(HealthTimelineScreen), findsOneWidget);
      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });
  });
}