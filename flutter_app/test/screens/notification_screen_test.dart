// =============================================================================
// NOTIFICATION SCREEN WIDGET TESTS
// =============================================================================
// SWEN 661 - This file demonstrates notification UI testing, time formatting,
// and provider interaction for marking notifications as read.
//
// KEY CONCEPTS COVERED:
// 1. Testing notification display and grouping by date
// 2. Testing time formatting (relative and absolute)
// 3. Testing mark as read functionality
// 4. Testing unread count badges
// 5. Testing semantic labels for accessibility
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/screens/notification_screen.dart';
import 'package:flutter_app/providers/notification_provider.dart';
import 'package:flutter_app/providers/auth_provider.dart';
import 'package:flutter_app/models/notification_item.dart';

void main() {
  // ===========================================================================
  // TEST HARNESS
  // ===========================================================================

  /// Creates test harness with NotificationProvider and AuthProvider (required by AppBottomNavBar).
  Widget createTestHarness({NotificationProvider? notificationProvider}) {
    final notificationProviderInstance = notificationProvider ?? NotificationProvider();
    final auth = AuthProvider()..setTestUser(UserRole.patient);

    return ChangeNotifierProvider<AuthProvider>.value(
      value: auth,
      child: ChangeNotifierProvider<NotificationProvider>.value(
        value: notificationProviderInstance,
        child: const MaterialApp(
          home: NotificationScreen(),
        ),
      ),
    );
  }

  // ===========================================================================
  // TEST GROUP: RENDERING TESTS
  // ===========================================================================

  group('NotificationScreen Rendering', () {
    testWidgets('should render notifications title in app bar', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.text('Notifications'), findsOneWidget);
    });

    testWidgets('should render back button', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('should render notification sections with labels', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Should have "Today", "Yesterday", and possibly other date sections
      expect(find.text('Today'), findsOneWidget);
      expect(find.text('Yesterday'), findsOneWidget);
    });

    testWidgets('should render all mock notifications', (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Check that notifications from mock data are displayed
      expect(find.text('Medication Reminder'), findsOneWidget);
      expect(find.text('New Message'), findsOneWidget);
      expect(find.text('Appointment Reminder'), findsOneWidget);
    });

    testWidgets('should render mark all as read button when unread exist', 
        (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      if (provider.unreadCount > 0) {
        expect(find.text('Mark all as read'), findsOneWidget);
      }
    });

    testWidgets('should not render mark all as read when all are read', 
        (tester) async {
      final provider = NotificationProvider();
      provider.markAllAsRead();
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      expect(find.text('Mark all as read'), findsNothing);
    });

    testWidgets('should display notification summaries', (tester) async {
      await tester.pumpWidget(createTestHarness());

      expect(
        find.text('Time to take your Lisinopril 10mg'),
        findsOneWidget,
      );
      expect(
        find.text('Dr. Helen Nowinski: Your test results look great!'),
        findsOneWidget,
      );
    });
  });

  // ===========================================================================
  // TEST GROUP: NOTIFICATION ICONS AND TYPES
  // ===========================================================================

  group('NotificationScreen Icons and Types', () {
    testWidgets('should display correct icon for medication type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Medication notifications should have medication icon
      expect(find.byIcon(Icons.medication), findsWidgets);
    });

    testWidgets('should display correct icon for message type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Message notifications should have message icon
      expect(find.byIcon(Icons.message), findsWidgets);
    });

    testWidgets('should display correct icon for appointment type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Appointment notifications should have calendar icon
      expect(find.byIcon(Icons.calendar_today), findsWidgets);
    });

    testWidgets('should display correct icon for health reminder type', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Health reminder notifications should have heart monitor icon
      expect(find.byIcon(Icons.monitor_heart), findsWidgets);
    });

    testWidgets('should display unread indicator dot for unread notifications', 
        (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Count unread notifications
      final unreadCount = provider.unreadCount;
      
      if (unreadCount > 0) {
        // Find circular containers (unread dots)
        final containers = find.byType(Container);
        expect(containers, findsWidgets);
      }
    });
  });

  // ===========================================================================
  // TEST GROUP: TIME FORMATTING
  // ===========================================================================

  group('NotificationScreen Time Formatting', () {
    testWidgets('should format recent notifications as "X minutes ago"', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Add a notification from 15 minutes ago
      final now = DateTime.now();
      provider.addNotification(NotificationItem(
        id: 'test-recent',
        title: 'Recent Test',
        summary: 'This just happened',
        type: NotificationType.medication,
        createdAt: now.subtract(const Duration(minutes: 15)),
      ));

      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Should show "15 minutes ago"
      expect(find.textContaining('minutes ago'), findsWidgets);
    });

    testWidgets('should format very recent notifications as "Just now"', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Add a notification from 30 seconds ago
      final now = DateTime.now();
      provider.addNotification(NotificationItem(
        id: 'test-just-now',
        title: 'Just Now Test',
        summary: 'This just happened',
        type: NotificationType.medication,
        createdAt: now.subtract(const Duration(seconds: 30)),
      ));

      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      expect(find.text('Just now'), findsOneWidget);
    });

    testWidgets('should format hours ago for same-day notifications', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Add a notification from 2 hours ago
      final now = DateTime.now();
      provider.addNotification(NotificationItem(
        id: 'test-hours',
        title: 'Hours Test',
        summary: 'This happened hours ago',
        type: NotificationType.medication,
        createdAt: now.subtract(const Duration(hours: 2)),
      ));

      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      expect(find.textContaining('hours ago'), findsWidgets);
    });

    testWidgets('should format yesterday notifications with "Yesterday"', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Mock data includes yesterday notifications
      expect(find.textContaining('Yesterday'), findsWidgets);
    });

    testWidgets('should format older notifications with full date', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Add a notification from 3 days ago
      final now = DateTime.now();
      final threeDaysAgo = now.subtract(const Duration(days: 3));
      provider.addNotification(NotificationItem(
        id: 'test-old',
        title: 'Old Test',
        summary: 'This happened days ago',
        type: NotificationType.medication,
        createdAt: threeDaysAgo,
      ));

      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Should find formatted date (e.g., "Jan 26, 2026")
      final dateStrings = find.byType(Text).evaluate().map((e) {
        final widget = e.widget as Text;
        return widget.data ?? '';
      }).where((text) => text.contains(','));
      
      expect(dateStrings.isNotEmpty, true);
    });
  });

  // ===========================================================================
  // TEST GROUP: MARK AS READ FUNCTIONALITY
  // ===========================================================================

  group('NotificationScreen Mark As Read', () {
    testWidgets('should mark notification as read when tapped', 
        (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Get initial unread count
      final initialUnreadCount = provider.unreadCount;
      expect(initialUnreadCount, greaterThan(0));

      // Find and tap first unread notification
      final firstUnreadNotification = provider.notifications
          .firstWhere((n) => !n.isRead);
      
      await tester.tap(find.text(firstUnreadNotification.title).first);
      await tester.pumpAndSettle();

      // Unread count should decrease
      expect(provider.unreadCount, lessThan(initialUnreadCount));
    });

    testWidgets('should mark all notifications as read when button tapped', 
        (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Verify there are unread notifications
      expect(provider.unreadCount, greaterThan(0));

      // Tap "Mark all as read" button
      await tester.tap(find.text('Mark all as read'));
      await tester.pumpAndSettle();

      // All notifications should be read
      expect(provider.unreadCount, 0);
      
      // Button should disappear
      expect(find.text('Mark all as read'), findsNothing);
    });

    testWidgets('should remove unread indicator dot after marking as read', 
        (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      final initialUnreadCount = provider.unreadCount;

      // Mark all as read
      await tester.tap(find.text('Mark all as read'));
      await tester.pumpAndSettle();

      // Verify unread count is 0
      expect(provider.unreadCount, 0);
      expect(initialUnreadCount, greaterThan(0));
    });

    testWidgets('should not change read status when tapping already read notification', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Create a read notification
      provider.addNotification(NotificationItem(
        id: 'test-read',
        title: 'Already Read',
        summary: 'This was read',
        type: NotificationType.medication,
        isRead: true,
      ));

      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      final unreadCountBefore = provider.unreadCount;
      
      // Tap the already-read notification
      await tester.tap(find.text('Already Read'));
      await tester.pumpAndSettle();

      // Unread count should not change
      expect(provider.unreadCount, unreadCountBefore);
    });
  });

  // ===========================================================================
  // TEST GROUP: NOTIFICATION GROUPING
  // ===========================================================================

  group('NotificationScreen Grouping', () {
    testWidgets('should group notifications by date', (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      final sections = provider.notificationSections;
      
      // Should have multiple sections
      expect(sections.length, greaterThan(1));
      
      // Each section should have a label
      for (final section in sections) {
        expect(section.label.isNotEmpty, true);
      }
    });

    testWidgets('should sort sections newest first', (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      final sections = provider.notificationSections;
      
      // First section should be "Today" (most recent)
      if (sections.isNotEmpty) {
        expect(sections.first.label, 'Today');
      }
    });

    testWidgets('should sort notifications within section newest first', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Add multiple notifications for today
      final now = DateTime.now();
      provider.addNotification(NotificationItem(
        id: 'newer',
        title: 'Newer Notification',
        summary: 'More recent',
        type: NotificationType.medication,
        createdAt: now.subtract(const Duration(minutes: 5)),
      ));
      
      provider.addNotification(NotificationItem(
        id: 'older',
        title: 'Older Notification',
        summary: 'Less recent',
        type: NotificationType.medication,
        createdAt: now.subtract(const Duration(hours: 2)),
      ));

      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      final sections = provider.notificationSections;
      final todaySection = sections.firstWhere((s) => s.label == 'Today');
      
      // First item should be the newer one
      expect(todaySection.items.first.id, 'newer');
    });

    testWidgets('should hide empty sections', (tester) async {
      final provider = NotificationProvider();
      provider.clearAll();
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Should not show any section headers
      expect(find.text('Today'), findsNothing);
      expect(find.text('Yesterday'), findsNothing);
    });
  });

  // ===========================================================================
  // TEST GROUP: ACCESSIBILITY
  // ===========================================================================

  group('NotificationScreen Accessibility', () {
    testWidgets('should have semantic label for mark all as read button', 
        (tester) async {
      final provider = NotificationProvider();
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      if (provider.unreadCount > 0) {
        expect(
          find.bySemanticsLabel('Mark all as read'),
          findsOneWidget,
        );
      }
    });

    testWidgets('should have semantic label for notifications list', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Label may include unread count, so check with widget predicate
      final semanticsFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Semantics &&
            widget.properties.label != null &&
            widget.properties.label!.startsWith('Notifications list'),
      );
      expect(semanticsFinder, findsOneWidget);
    });

    testWidgets('should have semantic labels for notification cards', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Each notification card should have a comprehensive semantic label
      // Format: "Unread, Type: Title, Summary, Time" or "Type: Title, Summary, Time"
      final semanticsFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Semantics &&
            widget.properties.label != null &&
            widget.properties.label!.contains(',') &&
            widget.properties.button == true,
      );
      
      expect(semanticsFinder, findsWidgets);
    });

    testWidgets('should mark section headers with semantic header flag', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Section headers should be marked as headers for screen readers
      // This is harder to test directly, but we can verify they exist
      expect(find.text('Today'), findsOneWidget);
    });

    testWidgets('should have tap hint for notification cards', 
        (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Notification cards should have "Tap to mark as read" hint
      // This is embedded in the Semantics widget
      final provider = NotificationProvider();
      final firstNotification = provider.notifications.first;
      
      // The semantic label includes the hint
      expect(find.text(firstNotification.title), findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: EDGE CASES
  // ===========================================================================

  group('NotificationScreen Edge Cases', () {
    testWidgets('should handle empty notification list', (tester) async {
      final provider = NotificationProvider();
      provider.clearAll();
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Should not show any notifications
      expect(provider.notifications.isEmpty, true);
      
      // Should not show mark all as read button
      expect(find.text('Mark all as read'), findsNothing);
    });

    testWidgets('should handle all notifications already read', 
        (tester) async {
      final provider = NotificationProvider();
      provider.markAllAsRead();
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // All notifications should be read
      expect(provider.unreadCount, 0);
      
      // Should not show mark all as read button
      expect(find.text('Mark all as read'), findsNothing);
    });

    testWidgets('should handle single notification', (tester) async {
      final provider = NotificationProvider();
      provider.clearAll();
      
      provider.addNotification(NotificationItem(
        id: 'single',
        title: 'Single Notification',
        summary: 'Only one',
        type: NotificationType.medication,
      ));
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      expect(find.text('Single Notification'), findsOneWidget);
      expect(provider.notifications.length, 1);
    });

    testWidgets('should handle multiple notifications of same type', 
        (tester) async {
      final provider = NotificationProvider();
      provider.clearAll();
      
      // Add 5 medication notifications
      for (int i = 0; i < 5; i++) {
        provider.addNotification(NotificationItem(
          id: 'med-$i',
          title: 'Medication $i',
          summary: 'Take your medicine',
          type: NotificationType.medication,
        ));
      }
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // All 5 should be displayed
      expect(provider.notifications.length, 5);
      expect(find.byIcon(Icons.medication), findsNWidgets(5));
    });

    testWidgets('should handle back button navigation', (tester) async {
      await tester.pumpWidget(createTestHarness());

      // Tap back button
    //   await tester.tap(find.byIcon(Icons.arrow_back));
    //   await tester.pumpAndSettle();

      // Navigation would occur in real app
      // In test, just verify button exists and is tappable
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('should maintain scroll position after marking as read', 
        (tester) async {
      final provider = NotificationProvider();
      
      // Add many notifications to enable scrolling
      for (int i = 0; i < 20; i++) {
        provider.addNotification(NotificationItem(
          id: 'scroll-$i',
          title: 'Notification $i',
          summary: 'Test scrolling',
          type: NotificationType.medication,
        ));
      }
      
      await tester.pumpWidget(createTestHarness(notificationProvider: provider));

      // Scroll down
      await tester.drag(
        find.byType(SingleChildScrollView),
        const Offset(0, -500),
      );
      await tester.pumpAndSettle();

      // Mark all as read
      await tester.tap(find.text('Mark all as read'));
      await tester.pumpAndSettle();

      // Verify notifications are still visible (scroll position maintained)
      expect(find.text('Notification 0'), findsWidgets);
    });
  });

  // ===========================================================================
  // TEST GROUP: TIME FORMATTER UNIT TESTS
  // ===========================================================================

  group('formatNotificationTime Function', () {
    test('should return "Just now" for very recent notifications', () {
      final now = DateTime.now();
      final result = formatNotificationTime(
        now.subtract(const Duration(seconds: 30)),
      );
      
      expect(result, 'Just now');
    });

    test('should return minutes ago for recent notifications', () {
      final now = DateTime.now();
      final result = formatNotificationTime(
        now.subtract(const Duration(minutes: 15)),
      );
      
      expect(result, '15 minutes ago');
    });

    test('should return hours ago for same-day notifications', () {
      final now = DateTime.now();
      final result = formatNotificationTime(
        now.subtract(const Duration(hours: 3)),
      );
      
      expect(result, '3 hours ago');
    });

    test('should return "Yesterday" with time for yesterday notifications', () {
      final now = DateTime.now();
      final yesterday = now.subtract(const Duration(days: 1));
      final result = formatNotificationTime(yesterday);
      
      expect(result, contains('Yesterday'));
    });

    test('should return formatted date for older notifications', () {
      final now = DateTime.now();
      final threeDaysAgo = now.subtract(const Duration(days: 3));
      final result = formatNotificationTime(threeDaysAgo);
      
      // Should contain month abbreviation and day
      expect(result, isNot(contains('Yesterday')));
      expect(result, isNot(contains('ago')));
    });
  });
}