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
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, AppColors } from '../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface PatientDashboardScreenProps {
  userName?: string;
  onNotificationsPress?: () => void;
  onMenuPress?: () => void;
  onTasksPress?: () => void;
  onHealthLogsPress?: () => void;
  onCalendarPress?: () => void;
  onTaskDetailsPress?: () => void;
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
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;
  const styles = useMemo(() => createStyles(colors), [colors]);

  const firstName = userName.trim().split(' ')[0] || userName;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onMenuPress}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Menu"
          accessibilityHint="Opens menu options"
        >
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Home"
        >
          Home
        </Text>
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Notifications, 1 unread notification"
          accessibilityHint="Opens notifications"
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <LinearGradient
          colors={[colors.primary, AppColors.primary500]}
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
            iconName="checkmark-circle-outline"
            iconColor={AppColors.success700}
            iconBackground={AppColors.success100}
            onPress={onCalendarPress}
          />
          <SummaryCard
            title="BP Today"
            value="120/80"
            subtitle="Normal"
            subtitleColor={AppColors.success700}
            iconName="heart-outline"
            iconColor={AppColors.error500}
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

        <TaskCard
          iconName="medkit"
          iconColor={colors.error}
          iconBackground={colors.error}
          title="Take Medication"
          subtitle="Metformin 500mg"
          dueText="DUE IN 15 MIN"
          dueColor={AppColors.error700}
          backgroundColor={AppColors.error100}
          onPress={onTaskDetailsPress}
        />

        <TaskCard
          iconName="heart"
          iconColor={colors.primary}
          iconBackground={colors.primarySoft}
          title="Blood Pressure Check"
          subtitle="Due at 2:00 PM"
          showChevron={true}
          onPress={onTaskDetailsPress}
        />

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
            iconName="heart-outline"
            label="Log Health Data"
            color={colors.secondary}
            onPress={onHealthLogsPress}
          />
          <ActionButton
            iconName="chatbubbles-outline"
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
          <Ionicons name="warning" size={22} color={AppColors.white} />
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
  iconName: React.ComponentProps<typeof Ionicons>['name'];
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
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;
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
          <Ionicons name={iconName} size={20} color={iconColor} />
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
  iconName: React.ComponentProps<typeof Ionicons>['name'];
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
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;
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
        <Ionicons name={iconName} size={24} color={iconColor} />
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
        <Ionicons
          name="chevron-forward"
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
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;
  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.appointmentCard,
        { borderColor: colors.accent, backgroundColor: colors.accentSoft },
      ]}
    >
      <View style={[styles.appointmentIcon, { backgroundColor: colors.accent }]}>
        <Ionicons name="videocam" size={24} color={AppColors.white} />
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
        <Ionicons name="videocam" size={20} color={AppColors.white} />
      </TouchableOpacity>
    </View>
  );
}

interface ActionButtonProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color: string;
  onPress?: () => void;
}

function ActionButton({ iconName, label, color, onPress }: ActionButtonProps) {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;
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
        <Ionicons name={iconName} size={26} color={color} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

type ThemeColors = {
  [K in keyof typeof Colors.light]: string;
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    headerTitle: {
      ...Typography.h5,
      flex: 1,
      textAlign: 'center',
    },
    iconButton: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationDot: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: AppColors.error500,
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
