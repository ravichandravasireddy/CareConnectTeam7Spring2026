// =============================================================================
// CAREGIVER DASHBOARD SCREEN
// =============================================================================
// Dashboard showing urgent and critical alerts (design sample).
// Deaf/HoH: All stats and tasks shown as text. Visual badges for alerts.
// No audio notifications; tap targets ≥48px.
// =============================================================================

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAppBar } from "@/components/app-app-bar";
import { AppColors, Colors, Typography, Fonts } from "@/constants/theme";
import { MOCK_TASKS, Task, isTaskCompleted } from "@/models/task";

const PATIENTS = [
  { id: "1", name: "Robert Williams" },
  { id: "2", name: "Maya Patel" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function greetingName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1 && parts[0] === "Dr.") return parts[1];
  return parts[0] || "Caregiver";
}

function tasksForToday(tasks: Task[]): Task[] {
  const today = new Date();
  return tasks.filter(
    (t) =>
      t.date.getFullYear() === today.getFullYear() &&
      t.date.getMonth() === today.getMonth() &&
      t.date.getDate() === today.getDate()
  );
}

export default function CaregiverDashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const todayTasks = useMemo(() => tasksForToday(MOCK_TASKS), []);
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
        onNotificationTap={() => {}}
        onSettingsPress={() => {}}
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
            <Text style={styles.welcomeTitle}>
              {greeting}, {name}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
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
                color={AppColors.info500}
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
                color={AppColors.success500}
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
                color={AppColors.error500}
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
                <Pressable
                  key={task.id}
                  style={({ pressed }) => [
                    styles.taskCard,
                    { backgroundColor: colors.surface },
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/caregiver/task-details",
                      params: { taskId: task.id },
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`${task.title}, ${task.patientName || "no patient"}, tap to view details`}
                >
                  <View
                    style={[
                      styles.taskIcon,
                      { backgroundColor: task.iconBackground },
                    ]}
                  >
                    {task.icon === "medication" ? (
                      <MaterialIcons name="medication" size={22} color={task.iconColor} />
                    ) : task.icon === "monitor-heart" ? (
                      <MaterialCommunityIcons name="monitor-heart" size={22} color={task.iconColor} />
                    ) : (
                      <MaterialIcons name="directions-walk" size={22} color={task.iconColor} />
                    )}
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, { color: colors.text }]}>
                      {task.title}
                    </Text>
                    {task.patientName ? (
                      <Text
                        style={[styles.taskSubtitle, { color: colors.textSecondary }]}
                      >
                        {task.patientName}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (colors: typeof Colors.light) =>
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
      color: AppColors.white,
      fontWeight: "700",
    },
    welcomeSubtitle: {
      ...Typography.bodyLarge,
      fontFamily: Fonts.sans,
      color: AppColors.white,
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
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginTop: 12,
    },
    taskIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    taskContent: {
      flex: 1,
      marginLeft: 12,
    },
    taskTitle: {
      ...Typography.bodyEmphasized,
      fontFamily: Fonts.sans,
    },
    taskSubtitle: {
      ...Typography.bodySmall,
      fontFamily: Fonts.sans,
      marginTop: 2,
    },
  });
