import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/notification_item.dart';

/// One section of notifications (e.g. "Today", "Yesterday", or a formatted date).
class NotificationSection {
  final String label;
  final List<NotificationItem> items;

  NotificationSection({required this.label, required this.items});
}

/// Provider for managing notifications app-wide.
class NotificationProvider with ChangeNotifier {
  final List<NotificationItem> _notifications = [];

  List<NotificationItem> get notifications => List.unmodifiable(_notifications);

  NotificationProvider() {
    _initializeMockNotifications();
  }

  void _initializeMockNotifications() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final yesterday = today.subtract(const Duration(days: 1));
    final twoDaysAgo = today.subtract(const Duration(days: 2));

    _notifications.addAll([
      NotificationItem(
        id: 'today-1',
        title: 'Medication Reminder',
        summary: 'Time to take your Lisinopril 10mg',
        type: NotificationType.medication,
        createdAt: now.subtract(const Duration(minutes: 15)),
      ),
      NotificationItem(
        id: 'today-2',
        title: 'Task Reminder',
        summary: 'Time for your breakfast',
        type: NotificationType.generalReminder,
        createdAt: now.subtract(const Duration(hours: 2)),
      ),
      NotificationItem(
        id: 'today-3',
        title: 'New Message',
        summary: 'Dr. Helen Nowinski: Your test results look great!',
        type: NotificationType.message,
        createdAt: now.subtract(const Duration(hours: 4)),
      ),
      NotificationItem(
        id: 'yesterday-1',
        title: 'Appointment Reminder',
        summary: 'Virtual appointment with Dr. Johnson tomorrow at 3:00 PM',
        type: NotificationType.appointment,
        createdAt: yesterday.add(const Duration(hours: 17)),
        isRead: true,
      ),
      NotificationItem(
        id: 'yesterday-2',
        title: 'Health Reminder',
        summary: 'Don\'t forget to log your blood pressure reading',
        type: NotificationType.healthReminder,
        createdAt: yesterday.add(const Duration(hours: 14)),
        isRead: false,
      ),
      NotificationItem(
        id: '2-days-ago-1',
        title: 'Task Reminder',
        summary: 'Video call with Sarah Johnson (Caregiver)',
        type: NotificationType.generalReminder,
        createdAt: twoDaysAgo.add(const Duration(hours: 8)),
        isRead: true,
      ),
    ]);
  }

  /// Groups notifications by calendar date; each group has a label ("Today", "Yesterday", or formatted date).
  /// Sections are ordered newest first; items within a section are ordered newest first.
  List<NotificationSection> get notificationSections {
    final now = DateTime.now();
    final todayStart = DateTime(now.year, now.month, now.day);
    final yesterdayStart = todayStart.subtract(const Duration(days: 1));
    // final tomorrowStart = todayStart.add(const Duration(days: 1));

    final byDate = <DateTime, List<NotificationItem>>{};
    for (final n in _notifications) {
      final date = DateTime(n.createdAt.year, n.createdAt.month, n.createdAt.day);
      byDate.putIfAbsent(date, () => []).add(n);
    }

    for (final list in byDate.values) {
      list.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    }

    final dates = byDate.keys.toList()..sort((a, b) => b.compareTo(a));
    final sections = <NotificationSection>[];
    for (final date in dates) {
      final items = byDate[date]!;
      String label;
      if (date == todayStart) {
        label = 'Today';
      } else if (date == yesterdayStart) {
        label = 'Yesterday';
      } else {
        label = DateFormat('MMM d, yyyy').format(date);
      }
      sections.add(NotificationSection(label: label, items: items));
    }
    return sections;
  }

  /// Unread count (e.g. for badge).
  int get unreadCount =>
      _notifications.where((n) => !n.isRead).length;

  void markAsRead(NotificationItem item) {
    final index = _notifications.indexWhere((n) => n.id == item.id);
    if (index != -1 && !_notifications[index].isRead) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      notifyListeners();
    }
  }

  void markAllAsRead() {
    bool changed = false;
    for (int i = 0; i < _notifications.length; i++) {
      if (!_notifications[i].isRead) {
        _notifications[i] = _notifications[i].copyWith(isRead: true);
        changed = true;
      }
    }
    if (changed) notifyListeners();
  }

  void addNotification(NotificationItem item) {
    _notifications.insert(0, item);
    notifyListeners();
  }

  void removeNotification(String id) {
    _notifications.removeWhere((n) => n.id == id);
    notifyListeners();
  }

  void clearAll() {
    _notifications.clear();
    notifyListeners();
  }
}
