import { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Typography, AppColors } from '../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { useTaskProvider } from '@/providers/TaskProvider';
import { isTaskCompleted } from '@/models/task';
import { AppAppBar } from '@/components/app-app-bar';

interface PatientDashboardScreenProps {
  userName?: string;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onTasksPress?: () => void;
  onHealthLogsPress?: () => void;
  onCalendarPress?: () => void;
  onTaskDetailsPress?: (taskId: string) => void;
  onVideoCallPress?: () => void;
  onMessagingPress?: () => void;
  onEmergencyPress?: () => void;
}

export default function PatientDashboardScreen({
  userName = 'Patient',
  onNotificationsPress,
  onMenuPress,
  onTasksPress,
  onHealthLogsPress,
  onCalendarPress,
  onTaskDetailsPress,
  onVideoCallPress,
  onMessagingPress,
  onEmergencyPress,
}: PatientDashboardScreenProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { tasks } = useTaskProvider();

  const firstName = userName.trim().split(' ')[0] || userName;

  // Get upcoming tasks for the current user
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return tasks
      .filter((task) => {
        // Filter by patient name
        if (task.patientName !== userName) return false;
        // Filter out completed tasks
        if (isTaskCompleted(task)) return false;
        // Filter tasks that are today or in the future
        const taskDate = new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate());
        return taskDate >= today;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 2);
  }, [tasks, userName]);

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Calculate "due in" text for urgent tasks
  const getDueText = (taskDate: Date): { text: string; color: string } | null => {
    const now = new Date();
    const diffMs = taskDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) return null; // Past due
    if (diffMins < 60) {
      return { text: `DUE IN ${diffMins} MIN`, color: AppColors.error700 };
    }
    return null; // Not urgent enough
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppAppBar
        title="Home"
        showMenuButton={true}
        useBackButton={false}
        showNotificationButton={true}
        showNotificationBadge={true}
        onNotificationTap={onNotificationsPress}
        onMenuPress={onMenuPress}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <LinearGradient
          colors={[AppColors.primary700, AppColors.primary600]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCard}
        >
          <Text style={[styles.welcomeTitle, { color: AppColors.white }]}>
            Good Morning, {firstName}!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: AppColors.white }]}>
            Here&apos;s your health overview for today
          </Text>
        </LinearGradient>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <SummaryCard
            title="Tasks"
            value="3/5"
            subtitle="Completed today"
            iconName="check-circle-outline"
            iconColor={AppColors.success700}
            iconBackground={AppColors.success100}
            onPress={onCalendarPress}
          />
          <SummaryCard
            title="BP Today"
            value="120/80"
            subtitle="Normal"
            subtitleColor={AppColors.success700}
            iconName="favorite-outline"
            iconColor={AppColors.error700}
            iconBackground={AppColors.error100}
            onPress={onHealthLogsPress}
          />
        </View>

        {/* Upcoming Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Upcoming Tasks
          </Text>
          <TouchableOpacity
            onPress={onCalendarPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="View all tasks"
            accessibilityHint="Opens your calendar"
          >
            <Text style={[styles.sectionAction, { color: colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {upcomingTasks.length === 0 ? (
          <View style={[styles.taskCard, { borderColor: colors.border }]}>
            <Text style={[styles.taskSubtitle, { color: colors.textSecondary }]}>
              No upcoming tasks
            </Text>
          </View>
        ) : (
          upcomingTasks.map((task) => {
            const dueInfo = getDueText(task.date);
            const isUrgent = dueInfo !== null;
            const timeStr = formatTime(task.date);
            const isToday = new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate())
              .getTime() === new Date().getTime();
            const subtitle = isToday 
              ? `Due at ${timeStr}`
              : task.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` at ${timeStr}`;

            // Use MaterialIcons directly since Task model uses MaterialIcons names
            const iconName = task.icon as React.ComponentProps<typeof MaterialIcons>['name'];

            return (
              <TaskCard
                key={task.id}
                iconName={iconName}
                iconColor={task.iconColor}
                iconBackground={task.iconBackground}
                title={task.title}
                subtitle={subtitle}
                dueText={dueInfo?.text}
                dueColor={dueInfo?.color}
                backgroundColor={isUrgent ? AppColors.error100 : undefined}
                showChevron={true}
                onPress={() => {
                  if (onTaskDetailsPress) {
                    onTaskDetailsPress(task.id);
                  }
                }}
              />
            );
          })
        )}

        {/* Appointments */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Today&apos;s Appointments
        </Text>
        <AppointmentCard
          title="Virtual Appointment"
          subtitle="Dr. Johnson • 3:00 PM"
          onPress={onVideoCallPress}
        />

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <ActionButton
            iconName="favorite-outline"
            label="Log Health Data"
            color={colors.secondary}
            onPress={onHealthLogsPress}
          />
          <ActionButton
            iconName="chat-bubble-outline"
            label="Send Message"
            color={colors.primary}
            onPress={onMessagingPress}
          />
        </View>

        {/* Emergency SOS */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Emergency SOS',
              'Are you experiencing an emergency?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Call Help',
                  style: 'destructive',
                  onPress: onEmergencyPress,
                },
              ]
            );
          }}
          style={[styles.sosButton, { backgroundColor: colors.error }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Emergency SOS button. Alerts all caregivers with your current location."
          accessibilityHint="Double tap to confirm emergency"
        >
          <MaterialIcons name="warning" size={22} color={AppColors.white} />
          <Text style={styles.sosText}>Emergency SOS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor?: string;
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
  iconBackground: string;
  onPress?: () => void;
}

function SummaryCard({
  title,
  value,
  subtitle,
  subtitleColor,
  iconName,
  iconColor,
  iconBackground,
  onPress,
}: SummaryCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.summaryCard, { borderColor: colors.border }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${value}. ${subtitle}`}
      accessibilityHint="Double tap for details"
    >
      <View style={styles.summaryHeader}>
        <View style={[styles.summaryIcon, { backgroundColor: iconBackground }]}>
          <MaterialIcons name={iconName} size={20} color={iconColor} />
        </View>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.summaryValue, { color: colors.text }]}>{value}</Text>
      <Text
        style={[
          styles.summarySubtitle,
          { color: subtitleColor ?? colors.textSecondary },
        ]}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

interface TaskCardProps {
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  iconColor: string;
  iconBackground: string;
  title: string;
  subtitle: string;
  dueText?: string;
  dueColor?: string;
  backgroundColor?: string;
  showChevron?: boolean;
  onPress?: () => void;
}

function TaskCard({
  iconName,
  iconColor,
  iconBackground,
  title,
  subtitle,
  dueText,
  dueColor,
  backgroundColor,
  showChevron,
  onPress,
}: TaskCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.taskCard,
        { borderColor: colors.border, backgroundColor: backgroundColor ?? colors.surface },
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}.`}
      accessibilityHint="Double tap to open task details"
    >
      <View style={[styles.taskIcon, { backgroundColor: iconBackground }]}>
        <MaterialIcons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.taskText}>
        <Text style={[styles.taskTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.taskSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      {dueText ? (
        <View style={styles.dueBadge}>
          <Text style={[styles.dueText, { color: dueColor }]}>{dueText}</Text>
        </View>
      ) : null}
      {showChevron ? (
        <MaterialIcons
          name="chevron-right"
          size={22}
          color={colors.textSecondary}
        />
      ) : null}
    </TouchableOpacity>
  );
}

interface AppointmentCardProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

function AppointmentCard({ title, subtitle, onPress }: AppointmentCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.appointmentCard,
        { borderColor: colors.accent, backgroundColor: colors.accentSoft },
      ]}
    >
      <View style={[styles.appointmentIcon, { backgroundColor: colors.accent }]}>
        <MaterialIcons name="videocam" size={24} color={AppColors.white} />
      </View>
      <View style={styles.appointmentText}>
        <Text style={[styles.appointmentTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.appointmentSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.appointmentButton, { backgroundColor: colors.accent }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Start video call"
        accessibilityHint="Opens video call"
      >
        <MaterialIcons name="videocam" size={20} color={AppColors.white} />
      </TouchableOpacity>
    </View>
  );
}

interface ActionButtonProps {
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  color: string;
  onPress?: () => void;
}

function ActionButton({ iconName, label, color, onPress }: ActionButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionCard, { borderColor: colors.border }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Double tap to open"
    >
      <View style={[styles.actionIcon, { backgroundColor: color + '1A' }]}>
        <MaterialIcons name={iconName} size={26} color={color} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    welcomeCard: {
      borderRadius: 16,
      padding: 24,
      marginTop: 8,
      marginBottom: 20,
    },
    welcomeTitle: {
      ...Typography.h2,
      marginBottom: 8,
    },
    welcomeSubtitle: {
      ...Typography.bodyLarge,
    },
    summaryRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    summaryCard: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      backgroundColor: colors.background,
      minHeight: 120,
    },
    summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    summaryTitle: {
      ...Typography.h6,
    },
    summaryValue: {
      ...Typography.h3,
      marginBottom: 4,
    },
    summarySubtitle: {
      ...Typography.bodySmall,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      ...Typography.h5,
      marginBottom: 12,
    },
    sectionAction: {
      ...Typography.body,
      fontWeight: '600',
    },
    taskCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 12,
      minHeight: 72,
    },
    taskIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    taskText: {
      flex: 1,
      marginLeft: 16,
    },
    taskTitle: {
      ...Typography.h6,
    },
    taskSubtitle: {
      ...Typography.bodySmall,
      marginTop: 4,
    },
    dueBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: 8,
    },
    dueText: {
      ...Typography.captionBold,
    },
    appointmentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderWidth: 1,
      borderRadius: 12,
      marginBottom: 24,
    },
    appointmentIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    appointmentText: {
      flex: 1,
      marginLeft: 16,
    },
    appointmentTitle: {
      ...Typography.h6,
    },
    appointmentSubtitle: {
      ...Typography.bodySmall,
      marginTop: 4,
    },
    appointmentButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    actionCard: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      minHeight: 120,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    actionLabel: {
      ...Typography.body,
      textAlign: 'center',
    },
    sosButton: {
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 24,
    },
    sosText: {
      ...Typography.h5,
      color: AppColors.white,
    },
  });
