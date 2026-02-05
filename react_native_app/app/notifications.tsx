// =============================================================================
// NOTIFICATION SCREEN
// =============================================================================
// Lists notifications grouped by NotificationProvider.notificationSections
// (Today / Yesterday / date). Tap should navigate via NotificationItem.destinationRoute.
// Uses formatNotificationTime for relative/absolute timestamps.
// Task-related notifications can link to specific tasks via taskId.
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNotificationProvider } from '../providers/NotificationProvider';
import { useTaskProvider } from '../providers/TaskProvider';
import { NotificationItem, NotificationType, getDestinationRoute, isTaskRelated } from '../models/NotificationItem';
import { Colors, Typography } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

type ThemeColors = typeof Colors.light | typeof Colors.dark;

// Format notification time dynamically: relative for today ("X min ago"), "Yesterday" + time, or date for older.
const formatNotificationTime = (createdAt: Date): string => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const date = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());

  if (date.getTime() === todayStart.getTime()) {
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (date.getTime() === yesterdayStart.getTime()) {
    return `Yesterday, ${createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else {
    return createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

// Get icon for notification type
const getIconForType = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.medication:
      return 'medication';
    case NotificationType.message:
      return 'message';
    case NotificationType.appointment:
      return 'calendar-today';
    case NotificationType.healthReminder:
      return 'monitor-heart';
    case NotificationType.generalReminder:
      return 'task';
  }
};

// Get colors for notification type and read state
const getTypeStyles = (
  type: NotificationType,
  isRead: boolean,
  colors: ThemeColors
): { borderColor: string; backgroundColor: string; avatarColor: string; iconColor: string } => {
  if (isRead) {
    return {
      borderColor: colors.border,
      backgroundColor: colors.surface,
      avatarColor: colors.border,
      iconColor: colors.textSecondary,
    };
  }

  switch (type) {
    case NotificationType.medication:
      return {
        borderColor: colors.primary,
        backgroundColor: colors.surface,
        avatarColor: colors.primary,
        iconColor: colors.background,
      };
    case NotificationType.message:
      return {
        borderColor: colors.accent,
        backgroundColor: colors.surface,
        avatarColor: colors.accent,
        iconColor: colors.background,
      };
    case NotificationType.appointment:
    case NotificationType.healthReminder:
    case NotificationType.generalReminder:
      return {
        borderColor: colors.secondary,
        backgroundColor: colors.surface,
        avatarColor: colors.secondary,
        iconColor: colors.background,
      };
  }
};

interface NotificationCardProps {
  item: NotificationItem;
  onPress: () => void;
  timeLabel: string;
  colors: ThemeColors;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ item, onPress, timeLabel, colors }) => {
  const styles = getTypeStyles(item.type, item.isRead, colors);
  const iconName = getIconForType(item.type);
  const semanticsLabel = `${item.title}, ${item.summary}, ${timeLabel}, button`;

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={semanticsLabel}
      accessibilityHint="Tap to mark as read"
      accessibilityRole="button"
      onPress={onPress}
      style={[notificationStyles.card, { backgroundColor: styles.backgroundColor }]}
      activeOpacity={0.7}>
      <View
        style={[
          notificationStyles.cardContent,
          { borderLeftColor: styles.borderColor, borderLeftWidth: 4 },
        ]}>
        <View
          style={[
            notificationStyles.iconContainer,
            { backgroundColor: styles.avatarColor },
          ]}>
          <MaterialIcons name={iconName as any} size={22} color={styles.iconColor} />
        </View>
        <View style={notificationStyles.textContainer}>
          <View style={notificationStyles.titleRow}>
            <Text style={[Typography.h6, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            {!item.isRead && (
              <View
                style={[
                  notificationStyles.unreadDot,
                  { backgroundColor: colors.primary },
                ]}
              />
            )}
          </View>
          <Text
            style={[Typography.bodySmall, { color: colors.textSecondary }]}
            numberOfLines={2}>
            {item.summary}
          </Text>
          <Text
            style={[
              Typography.bodySmall,
              { color: colors.textSecondary, opacity: 0.8 },
            ]}>
            {timeLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface NotificationSectionProps {
  title: string;
  notifications: NotificationItem[];
  onPress: (item: NotificationItem) => void;
  colors: ThemeColors;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  notifications,
  onPress,
  colors,
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <View style={notificationStyles.section}>
      <Text
        accessible={true}
        accessibilityRole="header"
        style={[Typography.captionBold, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <View style={notificationStyles.sectionContent}>
        {notifications.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onPress={() => onPress(item)}
            timeLabel={formatNotificationTime(item.createdAt)}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
};

export default function NotificationScreen() {
  const colorScheme = useColorScheme();
  const themeKey = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[themeKey];
  const router = useRouter();
  const notificationProvider = useNotificationProvider();
  const taskProvider = useTaskProvider();

  const handleNotificationPress = (item: NotificationItem) => {
    // Mark as read
    notificationProvider.markAsRead(item);
    
    // don't navigate to any screen for notifications
    return null;
   
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerShown: true,
        }}
      />
      <SafeAreaView
        style={[notificationStyles.container, { backgroundColor: colors.surface }]}
        edges={['bottom']}>
        {notificationProvider.unreadCount > 0 && (
          <View style={notificationStyles.markAllContainer}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Mark all as read, button"
              accessibilityRole="button"
              onPress={notificationProvider.markAllAsRead}
              style={notificationStyles.markAllButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[Typography.captionBold, { color: colors.primary }]}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          accessible={true}
          accessibilityLabel="Notifications list"
          contentContainerStyle={notificationStyles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {notificationProvider.notificationSections.map((section, index) => (
            <NotificationSection
              key={`${section.label}-${index}`}
              title={section.label}
              notifications={section.items}
              onPress={handleNotificationPress}
              colors={colors}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markAllContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  markAllButton: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    padding: 16,
  },
  sectionContent: {
    marginTop: 8,
    gap: 8,
  },
  card: {
    borderRadius: 12,
    minHeight: 64,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginTop: 4,
  },
});
