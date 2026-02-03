// =============================================================================
// NOTIFICATION ITEM MODEL UNIT TESTS
// =============================================================================
// Tests for NotificationItem: construction defaults, destinationRoute,
// and copyWith behavior.
// =============================================================================

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/models/notification_item.dart';

void main() {
  group('NotificationItem construction', () {
    test('stores id, title, summary, type, and isRead', () {
      final item = NotificationItem(
        id: 'n1',
        title: 'Test Title',
        summary: 'Test Summary',
        type: NotificationType.message,
        isRead: true,
      );

      expect(item.id, 'n1');
      expect(item.title, 'Test Title');
      expect(item.summary, 'Test Summary');
      expect(item.type, NotificationType.message);
      expect(item.isRead, true);
    });

    test('defaults createdAt to now when not provided', () {
      final before = DateTime.now();
      final item = NotificationItem(
        id: 'n2',
        title: 'Now Test',
        summary: 'Created now',
        type: NotificationType.medication,
      );
      final after = DateTime.now();

      expect(
        item.createdAt.isAfter(before) ||
            item.createdAt.isAtSameMomentAs(before),
        true,
      );
      expect(
        item.createdAt.isBefore(after) ||
            item.createdAt.isAtSameMomentAs(after),
        true,
      );
    });
  });

  group('NotificationItem destinationRoute', () {
    test('routes message type to messages', () {
      final item = NotificationItem(
        id: 'm1',
        title: 'Message',
        summary: 'Hi',
        type: NotificationType.message,
      );
      expect(item.destinationRoute, 'messages');
    });

    test('routes task-related types to tasks', () {
      final types = [
        NotificationType.medication,
        NotificationType.appointment,
        NotificationType.healthReminder,
        NotificationType.generalReminder,
      ];

      for (final type in types) {
        final item = NotificationItem(
          id: 't-${type.name}',
          title: 'Task',
          summary: 'Task summary',
          type: type,
        );
        expect(item.destinationRoute, 'tasks');
      }
    });
  });

  group('NotificationItem copyWith', () {
    test('updates only specified fields', () {
      final original = NotificationItem(
        id: 'o1',
        title: 'Original',
        summary: 'Original summary',
        type: NotificationType.healthReminder,
        createdAt: DateTime(2025, 1, 1, 10, 0),
        isRead: false,
      );

      final updated = original.copyWith(title: 'Updated', isRead: true);

      expect(updated.id, original.id);
      expect(updated.title, 'Updated');
      expect(updated.summary, original.summary);
      expect(updated.type, original.type);
      expect(updated.createdAt, original.createdAt);
      expect(updated.isRead, true);
    });

    test('copyWith does not mutate original', () {
      final original = NotificationItem(
        id: 'o2',
        title: 'Original',
        summary: 'Original summary',
        type: NotificationType.medication,
        isRead: false,
      );

      original.copyWith(title: 'Changed', isRead: true);

      expect(original.title, 'Original');
      expect(original.isRead, false);
    });
  });
}
