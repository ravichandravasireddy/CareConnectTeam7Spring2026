// =============================================================================
// CAREGIVER DASHBOARD SCREEN
// =============================================================================
// Dashboard showing urgent and critical alerts (design sample).
// Deaf/HoH: All stats and tasks shown as text. Visual badges for alerts.
// No audio notifications; tap targets ≥48px.
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAppBar } from "@/components/app-app-bar";
import { AppMenu } from "@/components/app-menu";
import { TaskCard } from "@/components/task-card";
import { AppColors, Typography, Fonts } from "@/constants/theme";
import { isTaskCompleted } from "@/models/task";
import { useTaskProvider } from "@/providers/TaskProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { getGreeting, greetingName, tasksForToday } from "./helpers";

export { getGreeting, greetingName, tasksForToday };

const PATIENTS = [
  { id: "1", name: "Robert Williams" },
  { id: "2", name: "Maya Patel" },
];

export default function CaregiverDashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const { getTasksForDate } = useTaskProvider();
  const todayTasks = useMemo(
    () => getTasksForDate(new Date()),
    [getTasksForDate]
  );
  const completedCount = todayTasks.filter(isTaskCompleted).length;
  const totalCount = todayTasks.length;

  const greeting = getGreeting();
  const name = greetingName("Dr. Sarah Johnson");

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
      accessibilityLabel="Caregiver dashboard. Quick stats and today's tasks."
    >
      <AppAppBar
        title="Dashboard"
        showMenuButton={true}
        useBackButton={false}
        showNotificationBadge={true}
        onMenuPress={() => setMenuVisible(true)}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome card */}
          <LinearGradient
            colors={[AppColors.primary600, `${AppColors.primary600}B3`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeCard}
          >
            <Text style={[styles.welcomeTitle, { color: colors.onPrimary }]}>
              {greeting}, {name}!
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.onPrimary }]}>
              Here&apos;s your care overview for today
            </Text>
          </LinearGradient>

          {/* Quick stats */}
          <View
            style={styles.statsRow}
            accessibilityLabel={`Quick stats: ${PATIENTS.length} patients, ${completedCount} of ${totalCount} tasks, 1 alerts`}
            accessibilityRole="summary"
          >
            <Pressable
              style={({ pressed }) => [
                styles.statCard,
                { backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/caregiver/monitor")}
              accessibilityRole="button"
              accessibilityLabel="Patients, tap to view patient monitoring"
            >
              <MaterialIcons
                name="people-outline"
                size={28}
                color={AppColors.info700}
              />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {PATIENTS.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Patients
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.statCard,
                { backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/caregiver/tasks")}
              accessibilityRole="button"
              accessibilityLabel="Tasks, tap to manage tasks"
            >
              <MaterialIcons
                name="check-circle-outline"
                size={28}
                color={AppColors.success700}
              />
              <Text style={[styles.statValue, { color: colors.text }]}>
                {completedCount}/{totalCount}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Tasks
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.statCard,
                { backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}
              onPress={() => router.push("/emergency-sos")}
              accessibilityRole="button"
              accessibilityLabel="Alerts, 1 unread. Tap to view emergency SOS"
              accessibilityHint="Opens emergency alert screen. All alerts are visual only."
            >
              <MaterialIcons
                name="warning-amber"
                size={28}
                color={AppColors.error700}
              />
              <Text style={[styles.statValue, { color: colors.text }]}>1</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Alerts
              </Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: AppColors.primary600 }]} />

          {/* Today's tasks */}
          <View accessibilityRole="header" accessibilityLabel="Upcoming tasks for today">
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Today&apos;s Tasks
              </Text>
              <Pressable
                onPress={() => router.push("/caregiver/tasks")}
                accessibilityRole="button"
                accessibilityLabel="Manage tasks"
              >
                <Text style={[styles.manageLink, { color: colors.primary }]}>
                  Manage
                </Text>
              </Pressable>
            </View>

            {todayTasks.length === 0 ? (
              <View
                style={[
                  styles.emptyCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No tasks scheduled for today
                </Text>
              </View>
            ) : (
              todayTasks.slice(0, 5).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showTime={true}
                  showPatientName={true}
                  onPress={() =>
                    router.push({
                      pathname: "/task-details",
                      params: { taskId: task.id },
                    })
                  }
                />
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <AppMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollContent: {
      padding: 24,
      paddingBottom: 32,
    },
    welcomeCard: {
      padding: 24,
      borderRadius: 16,
    },
    welcomeTitle: {
      ...Typography.h5,
      fontFamily: Fonts.sans,
      fontWeight: "700",
    },
    welcomeSubtitle: {
      ...Typography.bodyLarge,
      fontFamily: Fonts.sans,
      marginTop: 8,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
    },
    statValue: {
      ...Typography.h4,
      fontFamily: Fonts.sans,
      marginTop: 8,
    },
    statLabel: {
      ...Typography.bodySmall,
      fontFamily: Fonts.sans,
      marginTop: 4,
    },
    pressed: { opacity: 0.8 },
    divider: {
      height: 4,
      marginTop: 24,
      borderRadius: 2,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 24,
    },
    sectionTitle: {
      ...Typography.h5,
      fontFamily: Fonts.sans,
    },
    manageLink: {
      ...Typography.buttonMedium,
      fontFamily: Fonts.sans,
    },
    emptyCard: {
      width: "100%",
      padding: 24,
      borderRadius: 12,
      borderWidth: 1,
      marginTop: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      ...Typography.bodySmall,
      fontFamily: Fonts.sans,
    },
  });
