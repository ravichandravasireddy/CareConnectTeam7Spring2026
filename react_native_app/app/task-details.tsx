// =============================================================================
// TASK DETAILS SCREEN (SHARED)
// =============================================================================
// Shows task details for both patient and caregiver flows. Feature parity with Flutter.
// Deaf/HoH: All details as text. Visual status (completed/due). No audio cues.
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAppBar } from "@/components/app-app-bar";
import { TaskCard } from "@/components/task-card";
import { AppColors, Typography, Fonts } from "@/constants/theme";
import { isTaskCompleted } from "@/models/Task";
import { useTaskProvider } from "@/providers/TaskProvider";
import { useTheme } from "@/providers/ThemeProvider";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { tasks, markCompleted } = useTaskProvider();

  const task = taskId
    ? tasks.find((t) => t.id === taskId) ?? tasks[0]
    : tasks[0];
  const completed = task ? isTaskCompleted(task) : false;

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <AppAppBar
          title="Task Details"
          showMenuButton={false}
          useBackButton={true}
        />
        <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
          <View style={styles.scrollContent}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              No task selected
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const dateLabel = task.date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleMarkComplete = () => {
    if (task && !completed) {
      markCompleted(task.id);
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Task Details"
        showMenuButton={false}
        useBackButton={true}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Task card */}
          <View
            style={[
              styles.taskCardWrapper,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <TaskCard
              task={task}
              showTime={true}
              showPatientName={true}
              description={task.description}
              completed={completed}
              style={[styles.taskCardInner, { borderColor: "transparent", backgroundColor: "transparent" }]}
            />
            <View style={[styles.pill, { backgroundColor: colors.surface }]}>
              <Text style={[styles.pillText, { color: colors.textSecondary }]}>
                RECURRING
              </Text>
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
              onPress={handleMarkComplete}
              accessibilityRole="button"
              accessibilityLabel="Mark task as complete"
            >
              <MaterialIcons
                name="check"
                size={20}
                color={colors.onPrimary}
              />
              <Text style={[styles.completeButtonText, { color: colors.onPrimary }]}>Mark as Complete</Text>
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
  taskCardWrapper: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  taskCardInner: {
    marginBottom: 0,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
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
