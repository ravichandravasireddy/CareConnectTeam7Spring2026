// =============================================================================
// TASK CARD COMPONENT
// =============================================================================
// Reusable task card component for displaying task information.
// Used in calendar screen and other task list views.
// Follows accessibility guidelines for hearing-impaired caregivers.
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Task } from '@/models/task';
import { Typography, AppColors } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

export interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  showTime?: boolean;
  showPatientName?: boolean;
  /** When set, shows a status pill: "COMPLETED" (green) or "DUE {time}" (primary). */
  completed?: boolean;
  /** Optional description shown below the title. */
  description?: string;
}

// Format time to "h:mm a" (e.g., "9:00 AM")
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * TaskCard component displays a task with icon, title, and optional time/patient name.
 * 
 * Accessibility:
 * - Minimum touch target: 48px height (meets WCAG AAA)
 * - Semantic labels for screen readers
 * - Proper accessibility roles
 */
export function TaskCard({
  task,
  onPress,
  style,
  showTime = true,
  showPatientName = false,
  completed,
  description,
}: TaskCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const timeLabel = showTime ? formatTime(task.date) : '';
  const accessibilityParts: string[] = [task.title];
  if (timeLabel) accessibilityParts.push(timeLabel);
  if (showPatientName && task.patientName) {
    accessibilityParts.push(`for ${task.patientName}`);
  }
  const accessibilityLabel = accessibilityParts.join(', ');

  const TaskIcon = (
    <MaterialIcons
      name={task.icon as React.ComponentProps<typeof MaterialIcons>['name']}
      size={22}
      color={task.iconColor}
    />
  );

  const content = (
    <View style={[styles.taskCard, { borderColor: colors.border }, style]}>
      <View
        style={[
          styles.taskIconContainer,
          { backgroundColor: task.iconBackground },
        ]}
        accessible={false}>
        {TaskIcon}
      </View>
      <View style={styles.taskContent}>
        <Text style={[Typography.h6, { color: colors.text }]} numberOfLines={2}>
          {task.title}
        </Text>
        {description != null && description !== '' && (
          <Text
            style={[Typography.bodySmall, { color: colors.textSecondary }, styles.description]}
            numberOfLines={2}>
            {description}
          </Text>
        )}
        {showTime && timeLabel && (
          <Text
            style={[Typography.bodySmall, { color: colors.textSecondary }]}
            numberOfLines={1}>
            {timeLabel}
          </Text>
        )}
        {showPatientName && task.patientName && (
          <Text
            style={[Typography.bodySmall, { color: colors.textSecondary }]}
            numberOfLines={1}>
            {task.patientName}
          </Text>
        )}
        {completed !== undefined && (
          <View
            style={[
              styles.pill,
              {
                backgroundColor: completed ? AppColors.success100 : AppColors.primary100,
                alignSelf: 'flex-start',
                marginTop: 8,
              },
            ]}>
            <Text
              style={[
                Typography.captionBold,
                { color: completed ? AppColors.success700 : colors.primary },
              ]}>
              {completed ? 'COMPLETED' : `DUE ${timeLabel || formatTime(task.date)}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityHint="Double tap to view task details"
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.touchable}>
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View accessible={true} accessibilityLabel={accessibilityLabel}>
      {content}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    touchable: {
      marginBottom: 12,
    },
    taskCard: {
      flexDirection: 'row',
      width: '100%',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      minHeight: 64, // Meets accessibility minimum touch target
      backgroundColor: colors.background,
    },
    taskIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    taskContent: {
      flex: 1,
      marginLeft: 12,
    },
    description: {
      marginTop: 4,
    },
    pill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
  });
