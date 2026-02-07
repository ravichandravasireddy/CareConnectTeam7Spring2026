// =============================================================================
// TASK DETAILS SCREEN (SHARED)
// =============================================================================
// Shows task details for caregiver flow. Feature parity with Flutter.
// Deaf/HoH: All details as text. Visual status (completed/due). No audio cues.
// =============================================================================

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { MOCK_TASKS, isTaskCompleted } from "@/models/task";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const task = MOCK_TASKS.find((t) => t.id === taskId) ?? MOCK_TASKS[0];
  const completed = isTaskCompleted(task);

  const dateLabel = task.date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeLabel = task.date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const TaskIcon =
    task.icon === "medication"
      ? () => <MaterialIcons name="medication" size={28} color={task.iconColor} />
      : task.icon === "monitor-heart"
        ? () => <MaterialCommunityIcons name="monitor-heart" size={28} color={task.iconColor} />
        : () => <MaterialIcons name="directions-walk" size={28} color={task.iconColor} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Task Details"
        showMenuButton={false}
        useBackButton={true}
        onNotificationTap={() => {}}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Task card */}
          <View
            style={[
              styles.taskCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.taskIcon,
                { backgroundColor: task.iconBackground },
              ]}
            >
              <TaskIcon />
            </View>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, { color: colors.text }]}>
                {task.title}
              </Text>
              <Text
                style={[styles.taskDesc, { color: colors.textSecondary }]}
              >
                {task.description}
              </Text>
              <View style={styles.pillsRow}>
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor: completed
                        ? AppColors.success100
                        : AppColors.primary100,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      {
                        color: completed
                          ? AppColors.success700
                          : colors.primary,
                      },
                    ]}
                  >
                    {completed ? "COMPLETED" : `DUE ${timeLabel}`}
                  </Text>
                </View>
                <View
                  style={[
                    styles.pill,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    RECURRING
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Details section */}
          <View
            style={[
              styles.detailsCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.detailRow}>
              <Text
                style={[styles.detailLabel, { color: colors.textSecondary }]}
              >
                Date
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {dateLabel}
              </Text>
            </View>
            {task.patientName ? (
              <View style={[styles.detailRow, styles.detailRowSpaced]}>
                <Text
                  style={[styles.detailLabel, { color: colors.textSecondary }]}
                >
                  Patient
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {task.patientName}
                </Text>
              </View>
            ) : null}
          </View>

          {!completed ? (
            <Pressable
              style={({ pressed }) => [
                styles.completeButton,
                { backgroundColor: colors.primary },
                pressed && styles.pressed,
              ]}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Mark task as complete"
            >
              <MaterialIcons
                name="check"
                size={20}
                color={AppColors.white}
              />
              <Text style={styles.completeButtonText}>Mark as Complete</Text>
            </Pressable>
          ) : (
            <View
              style={[
                styles.completedBanner,
                { backgroundColor: AppColors.success100 },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={24}
                color={AppColors.success700}
              />
              <Text style={[styles.completedText, { color: AppColors.success700 }]}>
                Completed
              </Text>
            </View>
          )}

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.outlineButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.outlineButtonText, { color: colors.text }]}>
                Snooze
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.outlineButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.outlineButtonText, { color: colors.text }]}>
                Skip Today
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  taskCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  taskIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskTitle: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  taskDesc: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillText: {
    ...Typography.captionBold,
    fontFamily: Fonts.sans,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  detailRow: {
    marginTop: 0,
  },
  detailRowSpaced: {
    marginTop: 12,
  },
  detailLabel: {
    ...Typography.bodySmall,
    fontFamily: Fonts.sans,
  },
  detailValue: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.sans,
    marginTop: 6,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 12,
    marginTop: 20,
  },
  completeButtonText: {
    ...Typography.buttonLarge,
    fontFamily: Fonts.sans,
    color: AppColors.white,
  },
  completedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  completedText: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
  },
  pressed: { opacity: 0.8 },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: 14,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    ...Typography.buttonLarge,
    fontFamily: Fonts.sans,
  },
});
