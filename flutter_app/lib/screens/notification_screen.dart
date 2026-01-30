import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/notification_item.dart';
import '../providers/notification_provider.dart';

// =============================================================================
// NOTIFICATION SCREEN
// =============================================================================
// Lists notifications grouped by [NotificationProvider.notificationSections]
// (Today / Yesterday / date). Tap should navigate via [NotificationItem.destinationRoute].
// Uses [formatNotificationTime] for relative/absolute timestamps.
// =============================================================================

/// Formats [createdAt] dynamically: relative for today ("X min ago"), "Yesterday" + time, or date for older.
String formatNotificationTime(DateTime createdAt) {
  final now = DateTime.now();
  final todayStart = DateTime(now.year, now.month, now.day);
  final yesterdayStart = todayStart.subtract(const Duration(days: 1));
  final date = DateTime(createdAt.year, createdAt.month, createdAt.day);

  if (date == todayStart) {
    final diff = now.difference(createdAt);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes} minutes ago';
    if (diff.inHours < 24) return '${diff.inHours} hours ago';
    return DateFormat.jm().format(createdAt);
  } else if (date == yesterdayStart) {
    return 'Yesterday, ${DateFormat.jm().format(createdAt)}';
  } else {
    return DateFormat.yMMMd().format(createdAt);
  }
}

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final notificationProvider = context.watch<NotificationProvider>();
    final sections = notificationProvider.notificationSections;

    return Scaffold(
      // using scaffoldBackgroundColor set in main.dart
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Notifications',
          style: TextStyle(
            color: colorScheme.onSurface,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            if (notificationProvider.unreadCount > 0)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Semantics(
                    label: 'Mark all as read, button',
                    button: true,
                    child: TextButton(
                      onPressed: () =>
                          context.read<NotificationProvider>().markAllAsRead(),
                      style: TextButton.styleFrom(
                        minimumSize: const Size(48, 48),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 12,
                        ),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        'Mark all as read',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: colorScheme.primary,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            Expanded(
              child: Semantics(
                label: 'Notifications list',
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      for (final section in sections)
                        _NotificationSection(
                          title: section.label,
                          notifications: section.items,
                          onTap: (item) {
                            context.read<NotificationProvider>().markAsRead(
                              item,
                            );
                            // TODO: Navigate to item.destinationRoute (e.g. TasksScreen, MessagesScreen) when those screens exist.
                          },
                          timeFormatter: formatNotificationTime,
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NotificationSection extends StatelessWidget {
  final String title;
  final List<NotificationItem> notifications;
  final ValueChanged<NotificationItem> onTap;
  final String Function(DateTime) timeFormatter;

  const _NotificationSection({
    required this.title,
    required this.notifications,
    required this.onTap,
    required this.timeFormatter,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    if (notifications.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Semantics(
            header: true,
            child: Text(
              title,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: colorScheme.onSurfaceVariant,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Column(
            children: notifications
                .map(
                  (item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: _NotificationCard(
                      item: item,
                      onTap: onTap,
                      timeLabel: timeFormatter(item.createdAt),
                    ),
                  ),
                )
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _NotificationCard extends StatelessWidget {
  final NotificationItem item;
  final ValueChanged<NotificationItem> onTap;
  final String timeLabel;

  const _NotificationCard({
    required this.item,
    required this.onTap,
    required this.timeLabel,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    final (borderColor, backgroundColor, avatarColor, iconColor) = _typeStyles(
      item.type,
      item.isRead,
      colorScheme,
    );

    final semanticsLabel = '${item.title}, ${item.summary}, $timeLabel, button';
    return Semantics(
      label: semanticsLabel,
      hint: 'Tap to mark as read',
      button: true,
      child: Material(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () => onTap(item),
          child: Container(
            constraints: const BoxConstraints(minHeight: 48),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border(left: BorderSide(color: borderColor, width: 4)),
            ),
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: avatarColor,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    _iconForType(item.type),
                    color: iconColor,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              item.title,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: colorScheme.onSurface,
                              ),
                            ),
                          ),
                          if (!item.isRead)
                            Padding(
                              padding: const EdgeInsets.only(left: 4),
                              child: Container(
                                width: 8,
                                height: 8,
                                decoration: BoxDecoration(
                                  color: colorScheme.primary,
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.summary,
                        style: TextStyle(
                          fontSize: 14,
                          color: colorScheme.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        timeLabel,
                        style: TextStyle(
                          fontSize: 12,
                          color: colorScheme.onSurfaceVariant.withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  IconData _iconForType(NotificationType type) {
    switch (type) {
      case NotificationType.medication:
        return Icons.medication;
      case NotificationType.message:
        return Icons.message;
      case NotificationType.appointment:
        return Icons.calendar_today;
      case NotificationType.healthReminder:
        return Icons.monitor_heart;
      case NotificationType.generalReminder:
        return Icons.task;
    }
  }

  /// Colors by [type] when unread; grayscale when [isRead].
  (Color border, Color background, Color avatar, Color icon) _typeStyles(
    NotificationType type,
    bool isRead,
    ColorScheme colorScheme,
  ) {
    if (isRead) {
      return (
        colorScheme.outline, // decorative border
        colorScheme.surface, // card background
        colorScheme.outline, // avatar background
        colorScheme.onSurfaceVariant, // text color
      );
    }
    switch (type) {
      case NotificationType.medication:
        return (
          colorScheme.primary,
          colorScheme.surface,
          colorScheme.primary,
          colorScheme.onPrimary,
        );
      case NotificationType.message:
        return (
          colorScheme.tertiary,
          colorScheme.surface,
          colorScheme.tertiary,
          colorScheme.onTertiary,
        );
      case NotificationType.appointment:
      case NotificationType.healthReminder:
      case NotificationType.generalReminder:
        return (
          colorScheme.secondary,
          colorScheme.surface,
          colorScheme.secondary,
          colorScheme.onSecondary,
        );
    }
  }
}
