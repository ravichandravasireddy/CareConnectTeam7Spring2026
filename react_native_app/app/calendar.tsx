// =============================================================================
// CALENDAR SCREEN
// =============================================================================
// Month calendar with selectable date; task list shows only scheduled
// (incomplete) tasks for selected date via TaskProvider.getScheduledTasksForDate.
// Dots on dates indicate hasScheduledTasksForDate. Navigate months with arrows.
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTaskProvider } from '../providers/TaskProvider';
import { getTaskDateOnly, areDatesEqual } from '../models/Task';
import { Colors, Typography, AppColors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { TaskCard } from '../components/task-card';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WIDE_BREAKPOINT = 1000;
const CALENDAR_MAX_WIDTH = 600;

// Format date to "MMMM yyyy" (e.g., "February 2026")
const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Format date to "MMMM d" (e.g., "February 5")
const formatMonthDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};


// Get first day of month
const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Get first day of calendar grid (may include previous month)
const getFirstDayOfGrid = (currentMonth: Date): Date => {
  const firstDay = getFirstDayOfMonth(currentMonth);
  // Get weekday (0 = Sunday, 6 = Saturday)
  const weekday = firstDay.getDay();
  return new Date(firstDay.getTime() - weekday * 24 * 60 * 60 * 1000);
};

// Get all dates for calendar grid (6 weeks = 42 days)
const getCalendarDates = (currentMonth: Date): Date[] => {
  const dates: Date[] = [];
  const start = getFirstDayOfGrid(currentMonth);
  for (let i = 0; i < 42; i++) {
    dates.push(new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
  }
  return dates;
};

// Check if date is today
const isToday = (date: Date): boolean => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

// Check if date is in current displayed month
const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return (
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear()
  );
};

// Check if date is selected
const isSelected = (date: Date, selectedDate: Date | null): boolean => {
  if (!selectedDate) return false;
  return areDatesEqual(date, selectedDate);
};

type ThemeColors = typeof Colors.light | typeof Colors.dark;

interface DateCellProps {
  date: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  hasTasks: boolean;
  onPress: () => void;
  colors: ThemeColors;
}

const DateCell: React.FC<DateCellProps> = ({
  date,
  currentMonth,
  selectedDate,
  hasTasks,
  onPress,
  colors,
}) => {
  const isCurrentMonthDate = isCurrentMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const isSelectedDate = isSelected(date, selectedDate);

  let backgroundColor: string = 'transparent';
  let textColor: string = colors.text;
  let borderColor: string = 'transparent';

  if (isTodayDate) {
    backgroundColor = colors.primary;
    textColor = colors.background;
  } else if (isSelectedDate && isCurrentMonthDate) {
    backgroundColor = 'transparent';
    textColor = colors.text;
    borderColor = colors.primary;
  } else if (isCurrentMonthDate) {
    backgroundColor = 'transparent';
    textColor = colors.text;
  } else {
    backgroundColor = 'transparent';
    // Use opacity for non-current month dates
    textColor = colors.textSecondary;
  }

  const parts: string[] = [`${date.getDate()}`];
  if (isTodayDate) parts.push('today');
  if (hasTasks) parts.push('has tasks');
  const accessibilityLabel = parts.join(', ');

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={isCurrentMonthDate ? 'Tap to select' : undefined}
      accessibilityRole="button"
      onPress={isCurrentMonthDate ? onPress : undefined}
      disabled={!isCurrentMonthDate}
      style={[
        styles.dateCell,
        {
          backgroundColor,
          borderColor: isSelectedDate && !isTodayDate ? borderColor : 'transparent',
          borderWidth: isSelectedDate && !isTodayDate ? 2 : 0,
          minHeight: 48,
          minWidth: 48,
        },
      ]}
      activeOpacity={0.7}>
      <Text
        style={[
          isTodayDate || isSelectedDate ? Typography.h6 : Typography.bodySmall,
          {
            color: textColor,
            opacity: isCurrentMonthDate ? 1 : 0.6,
          },
        ]}>
        {isCurrentMonthDate ? date.getDate() : ''}
      </Text>
      {hasTasks && (
        <View
          style={[
            styles.taskDot,
            {
              backgroundColor: isTodayDate ? colors.background : colors.primary,
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
};


export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const themeKey = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[themeKey];
  const { width } = useWindowDimensions();
  const router = useRouter();
  const taskProvider = useTaskProvider();

  const now = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(now.getFullYear(), now.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(now.getFullYear(), now.getMonth(), now.getDate())
  );

  const calendarDates = useMemo(
    () => getCalendarDates(currentMonth),
    [currentMonth]
  );

  const selectedTasks = useMemo(() => {
    if (!selectedDate) return [];
    return taskProvider.getScheduledTasksForDate(selectedDate);
  }, [selectedDate, taskProvider]);

  const monthYearText = formatMonthYear(currentMonth);
  const selectedDateText = selectedDate
    ? `Tasks for ${formatMonthDay(selectedDate)}`
    : 'Select a date to view tasks';

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const useWideLayout = width >= WIDE_BREAKPOINT;
  const calendarWidth = useWideLayout
    ? Math.min(width * 0.5, CALENDAR_MAX_WIDTH)
    : undefined;

  const calendarSection = (
    <View style={[styles.calendarSection, { borderBottomColor: colors.border }]}>
      <View style={styles.monthHeader}>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Previous month"
          accessibilityRole="button"
          onPress={previousMonth}
          style={styles.monthButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons
            name="chevron-left"
            size={28}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
        <Text
          accessible={true}
          accessibilityLabel={monthYearText}
          accessibilityRole="header"
          style={[Typography.h3, { color: colors.text }]}>
          {monthYearText}
        </Text>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel="Next month"
          accessibilityRole="button"
          onPress={nextMonth}
          style={styles.monthButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons
            name="chevron-right"
            size={28}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <View
        accessible={true}
        accessibilityLabel={`Calendar, ${monthYearText}`}
        style={styles.calendarGrid}>
        {DAYS.map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={[Typography.caption, { color: colors.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
        {calendarDates.map((date, index) => (
          <DateCell
            key={`${date.getTime()}-${index}`}
            date={date}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            hasTasks={taskProvider.hasScheduledTasksForDate(date)}
            onPress={() => {
              if (isCurrentMonth(date, currentMonth)) {
                setSelectedDate(date);
              }
            }}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );

  const tasksSection = (
    <View style={styles.tasksSection}>
      <Text
        accessible={true}
        accessibilityLabel={selectedDateText}
        accessibilityRole="header"
        style={[Typography.h4, { color: colors.text }]}>
        {selectedDateText}
      </Text>
      {selectedTasks.length === 0 && selectedDate ? (
        <View style={[styles.emptyState, { borderColor: colors.border }]}>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
            No tasks scheduled for this day
          </Text>
        </View>
      ) : (
        selectedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => {
              // TODO: Navigate to task details screen
              // router.push(`/task-details?id=${task.id}`);
            }}
            showTime={true}
            showPatientName={true}
          />
        ))
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Calendar',
          headerShown: true,
        }}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.surface }]}
        edges={['bottom']}>
        {useWideLayout ? (
          <View style={styles.wideLayout}>
            <ScrollView
              style={[{ width: calendarWidth }]}
              contentContainerStyle={styles.scrollContent}>
              {calendarSection}
            </ScrollView>
            <ScrollView
              style={styles.tasksScrollView}
              contentContainerStyle={[styles.scrollContent, styles.tasksPadding]}>
              {tasksSection}
            </ScrollView>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.narrowLayout}>
              {calendarSection}
              {tasksSection}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wideLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  narrowLayout: {
    maxWidth: CALENDAR_MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  tasksScrollView: {
    flex: 1,
  },
  tasksPadding: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  calendarSection: {
    padding: 16,
    borderBottomWidth: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthButton: {
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -2,
  },
  dayHeader: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  dateCell: {
    width: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginVertical: 2,
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  tasksSection: {
    padding: 16,
  },
  emptyState: {
    width: '100%',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 12,
  },
});
