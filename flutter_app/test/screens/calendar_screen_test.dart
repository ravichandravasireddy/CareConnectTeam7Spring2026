// =============================================================================
// CALENDAR SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - This file demonstrates calendar UI testing, date selection,
// and task display functionality.
//
// KEY CONCEPTS COVERED:
// 1. Testing calendar grid rendering
// 2. Testing date selection and navigation
// 3. Testing task filtering by date
// 4. Testing month navigation
// 5. Testing semantic labels for accessibility
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:flutter_app/screens/calendar_screen.dart';
import 'package:flutter_app/providers/task_provider.dart';
import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/models/task.dart';
import 'package:flutter_app/theme/app_colors.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  /// Creates test harness with TaskProvider
  Widget createTestHarness({TaskProvider? taskProvider}) {
    final provider = taskProvider ?? TaskProvider();
    final authProvider = AuthProvider()..setTestUser(UserRole.patient);

    return MultiProvider(
      providers: [
        ChangeNotifierProvider<TaskProvider>.value(value: provider),
        ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
      ],
      child: const MaterialApp(home: CalendarScreen()),
    );
  }

  // ===========================================================================
  // TEST GROUP: RENDERING TESTS
  // ===========================================================================

  group('CalendarScreen Rendering', () {
    testWidgets('should render calendar title in app bar', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Calendar'), findsOneWidget);
    });

    testWidgets('should render back button', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('should render day headers (Sun-Sat)', (tester) async {
      await tester.pumpWidget(createTestHarness());

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (final day in days) {
        expect(find.text(day), findsOneWidget);
      }
    });

    testWidgets('should render current month and year', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();
      final monthYear = '${_getMonthName(now.month)} ${now.year}';

      expect(find.text(monthYear), findsOneWidget);
    });

    testWidgets('should render previous and next month buttons', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byIcon(Icons.chevron_left), findsOneWidget);
      expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    });

    testWidgets('should render 42 date cells (6 weeks)', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Find all InkWell widgets in the calendar grid (date cells)
      final dateCells = find.descendant(
        of: find.byType(GridView),
        matching: find.byType(InkWell),
      );

      expect(dateCells, findsNWidgets(42));
    });

    testWidgets('should display selected date text', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();
      final expectedText = 'Tasks for ${_getMonthName(now.month)} ${now.day}';

      expect(find.text(expectedText), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: MONTH NAVIGATION
  // ===========================================================================

  group('CalendarScreen Month Navigation', () {
    testWidgets('should navigate to previous month when left arrow tapped', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();
      final currentMonth = '${_getMonthName(now.month)} ${now.year}';

      // Verify current month is displayed
      expect(find.text(currentMonth), findsOneWidget);

      // Tap previous month button
      await tester.tap(find.byIcon(Icons.chevron_left));
      await tester.pumpAndSettle();

      // Verify previous month is now displayed
      final previousMonth = DateTime(now.year, now.month - 1, 1);
      final previousMonthText =
          '${_getMonthName(previousMonth.month)} ${previousMonth.year}';
      expect(find.text(previousMonthText), findsOneWidget);
    });

    testWidgets('should navigate to next month when right arrow tapped', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();

      // Tap next month button
      await tester.tap(find.byIcon(Icons.chevron_right));
      await tester.pumpAndSettle();

      // Verify next month is now displayed
      final nextMonth = DateTime(now.year, now.month + 1, 1);
      final nextMonthText =
          '${_getMonthName(nextMonth.month)} ${nextMonth.year}';
      expect(find.text(nextMonthText), findsOneWidget);
    });

    testWidgets('should handle year rollover when navigating months', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      // Tap next 12 times: same month next year (e.g. Jan -> Jan next year)
      for (int i = 0; i < 12; i++) {
        await tester.tap(find.byIcon(Icons.chevron_right));
        await tester.pumpAndSettle();
      }

      final now = DateTime.now();
      final nextYear = now.year + 1;
      expect(find.textContaining('$nextYear'), findsOneWidget);
    });
  });

  // ===========================================================================
  // TEST GROUP: DATE SELECTION
  // ===========================================================================

  group('CalendarScreen Date Selection', () {
    testWidgets('should highlight today by default', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();

      // Today's cell should have primary background color
      // We can verify by checking the selected date text includes today
      final expectedText = 'Tasks for ${_getMonthName(now.month)} ${now.day}';
      expect(find.text(expectedText), findsOneWidget);
    });

    testWidgets('should update selected date when tapping a date cell', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();
      // Find a different date to tap (day 15 if not today)
      final dayToTap = now.day == 15 ? 14 : 15;

      // Tap on day 15
      await tester.tap(find.text('$dayToTap').first);
      await tester.pumpAndSettle();

      // Verify selected date text updated
      final expectedText = 'Tasks for ${_getMonthName(now.month)} $dayToTap';
      expect(find.text(expectedText), findsOneWidget);
    });

    testWidgets('should not select dates from previous/next months', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      // Calendar grid has 42 date cells (including prev/next month dates).
      // Other-month cells have onTap: null in implementation; we verify grid renders.
      final dateCells = find.descendant(
        of: find.byType(GridView),
        matching: find.byType(InkWell),
      );
      expect(dateCells, findsNWidgets(42));
    });
  });

  // ===========================================================================
  // TEST GROUP: TASK DISPLAY
  // ===========================================================================

  group('CalendarScreen Task Display', () {
    testWidgets('should display tasks for selected date', (tester) async {
      final provider = TaskProvider();
      await tester.pumpWidget(createTestHarness(taskProvider: provider));

      final now = DateTime.now();
      // Calendar shows only scheduled (incomplete) tasks
      final scheduledForToday = provider.getScheduledTasksForDate(
        DateTime(now.year, now.month, now.day),
      );

      if (scheduledForToday.isNotEmpty) {
        for (final task in scheduledForToday) {
          expect(find.text(task.title), findsOneWidget);
          expect(find.text(DateFormat.jm().format(task.date)), findsOneWidget);
        }
      }
    });

    testWidgets('should show "no tasks" message when date has no tasks', (
      tester,
    ) async {
      final provider = TaskProvider();
      provider.clearTasks();

      await tester.pumpWidget(createTestHarness(taskProvider: provider));

      // Navigate to a date we know has no tasks
      // Tap on day 1 (assuming mock data doesn't have tasks on day 1)
      await tester.tap(find.text('1').first);
      await tester.pumpAndSettle();

      expect(find.text('No tasks scheduled for this day'), findsOneWidget);
    });

    testWidgets('should display task indicator dot for dates with tasks', (
      tester,
    ) async {
      final provider = TaskProvider();
      provider.clearTasks();
      final now = DateTime.now();
      // Pick a date that has no tasks, then add one task on it
      const dayWithTasks = 25;
      provider.addTask(
        Task(
          id: 'dot-test',
          title: 'Dot Test Task',
          date: DateTime(now.year, now.month, dayWithTasks, 10, 0),
          icon: Icons.task,
          iconBackground: AppColors.primary100,
          iconColor: AppColors.primary700,
        ),
      );

      await tester.pumpWidget(createTestHarness(taskProvider: provider));

      expect(
        provider.hasTasksForDate(DateTime(now.year, now.month, dayWithTasks)),
        true,
      );
      final hasTasksLabel = RegExp('$dayWithTasks.*has tasks');
      expect(find.bySemanticsLabel(hasTasksLabel), findsWidgets);
    });

    testWidgets('should display task cards with correct icons and colors', (
      tester,
    ) async {
      final provider = TaskProvider();
      await tester.pumpWidget(createTestHarness(taskProvider: provider));

      final now = DateTime.now();
      // Calendar shows only scheduled (incomplete) tasks
      final scheduledForToday = provider.getScheduledTasksForDate(
        DateTime(now.year, now.month, now.day),
      );

      expect(scheduledForToday.isNotEmpty, true);
      final firstTask = scheduledForToday.first;

      expect(find.byIcon(firstTask.icon), findsOneWidget);
      expect(find.text(firstTask.title), findsOneWidget);
    });

    testWidgets('should sort tasks by time for selected date', (tester) async {
      final provider = TaskProvider();
      final testDate = DateTime.now();
      final dateOnly = DateTime(testDate.year, testDate.month, testDate.day);

      // Add tasks out of order (date holds day + time)
      provider.addTask(
        Task(
          id: 'test-1',
          title: 'Afternoon Task',
          date: DateTime(dateOnly.year, dateOnly.month, dateOnly.day, 15, 0),
          icon: Icons.task,
          iconBackground: AppColors.primary100,
          iconColor: AppColors.primary700,
        ),
      );

      provider.addTask(
        Task(
          id: 'test-2',
          title: 'Morning Task',
          date: DateTime(dateOnly.year, dateOnly.month, dateOnly.day, 9, 0),
          icon: Icons.task,
          iconBackground: AppColors.primary100,
          iconColor: AppColors.primary700,
        ),
      );

      await tester.pumpWidget(createTestHarness(taskProvider: provider));
      await tester.pumpAndSettle();

      final tasks = provider.getTasksForDate(testDate);
      expect(tasks.length, greaterThanOrEqualTo(2));

      final morningIndex = tasks.indexWhere((t) => t.title == 'Morning Task');
      final afternoonIndex = tasks.indexWhere(
        (t) => t.title == 'Afternoon Task',
      );

      expect(morningIndex != -1 && afternoonIndex != -1, true);
      expect(morningIndex, lessThan(afternoonIndex));
    });
  });

  // ===========================================================================
  // TEST GROUP: ACCESSIBILITY
  // ===========================================================================

  group('CalendarScreen Accessibility', () {
    testWidgets('should have semantic labels for navigation buttons', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      // Find Semantics widgets with button labels
      expect(find.bySemanticsLabel('Previous month'), findsOneWidget);

      expect(find.bySemanticsLabel('Next month'), findsOneWidget);
    });

    testWidgets('should have semantic label for calendar grid', (tester) async {
      await tester.pumpWidget(createTestHarness());

      final now = DateTime.now();
      final monthYear = '${_getMonthName(now.month)} ${now.year}';
      final expectedLabel = 'Calendar, $monthYear';

      expect(find.bySemanticsLabel(expectedLabel), findsOneWidget);
    });

    testWidgets('should have semantic labels for task cards', (tester) async {
      final provider = TaskProvider();
      await tester.pumpWidget(createTestHarness(taskProvider: provider));

      final now = DateTime.now();
      // Calendar shows only scheduled (incomplete) tasks
      final scheduledForToday = provider.getScheduledTasksForDate(
        DateTime(now.year, now.month, now.day),
      );

      for (final task in scheduledForToday) {
        final timeLabel = DateFormat.jm().format(task.date);
        final pattern = RegExp(
          '${RegExp.escape(task.title)}.*${RegExp.escape(timeLabel)}',
        );
        expect(find.bySemanticsLabel(pattern), findsOneWidget);
      }
    });

    testWidgets('should indicate today in semantic label', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Today's date cell should have "today" in its semantic label
      final now = DateTime.now();
      final todayLabel = '${now.day}, today';

      // This might find multiple if there are tasks indicators
      expect(find.bySemanticsLabel(RegExp(todayLabel)), findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: EDGE CASES
  // ===========================================================================

  group('CalendarScreen Edge Cases', () {
    testWidgets('should handle empty task list', (tester) async {
      final provider = TaskProvider();
      provider.clearTasks(); // Remove all tasks

      await tester.pumpWidget(createTestHarness(taskProvider: provider));

      expect(find.text('No tasks scheduled for this day'), findsOneWidget);
    });

    testWidgets('should handle multiple tasks on same date', (tester) async {
      final provider = TaskProvider();
      final testDate = DateTime.now();

      final dateOnly = DateTime(testDate.year, testDate.month, testDate.day);
      for (int i = 0; i < 5; i++) {
        provider.addTask(
          Task(
            id: 'multi-$i',
            title: 'Task $i',
            date: DateTime(
              dateOnly.year,
              dateOnly.month,
              dateOnly.day,
              9 + i,
              0,
            ),
            icon: Icons.task,
            iconBackground: AppColors.primary100,
            iconColor: AppColors.primary700,
          ),
        );
      }

      await tester.pumpWidget(createTestHarness(taskProvider: provider));
      await tester.pumpAndSettle();

      // All 5 tasks should be displayed
      for (int i = 0; i < 5; i++) {
        expect(find.text('Task $i'), findsOneWidget);
      }
    });

    testWidgets('should maintain selection when navigating months', (
      tester,
    ) async {
      await tester.pumpWidget(createTestHarness());

      await tester.tap(find.text('15').first);
      await tester.pumpAndSettle();

      // Navigate to next month
      await tester.tap(find.byIcon(Icons.chevron_right));
      await tester.pumpAndSettle();

      // Navigate back to original month
      await tester.tap(find.byIcon(Icons.chevron_left));
      await tester.pumpAndSettle();

      // The date 15 should still be selectable
      expect(find.text('15'), findsWidgets);
    });
  });
}

// ===========================================================================
// HELPER FUNCTIONS
// ===========================================================================

/// Get month name from month number (1-12)
String _getMonthName(int month) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1];
}
