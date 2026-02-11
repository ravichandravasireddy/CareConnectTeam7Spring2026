// =============================================================================
// CAREGIVER: TASK MANAGEMENT
// =============================================================================
// Manage upcoming and completed tasks. Feature parity with Flutter.
// Deaf/HoH: All task info as text. Overdue uses red visual indicators.
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
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
import { isTaskCompleted } from "@/models/task";
import { useTaskProvider } from "@/providers/TaskProvider";
import { useTheme } from "@/providers/ThemeProvider";

export default function CaregiverTaskManagementScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { tasks } = useTaskProvider();

  const now = Date.now();
  const overdueTasks = tasks.filter(
    (t) => !isTaskCompleted(t) && t.date.getTime() < now
  );
  const overdueTask = overdueTasks[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Tasks"
        showMenuButton={false}
        useBackButton={true}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Overdue tasks card */}
          <View
            style={[
              styles.overdueCard,
              {
                backgroundColor: `${AppColors.error100}33`,
                borderColor: AppColors.error100,
              },
            ]}
          >
            <View style={styles.overdueHeader}>
              <MaterialIcons
                name="warning-amber"
                size={24}
                color={AppColors.error500}
              />
              <Text
                style={[styles.overdueTitle, { color: AppColors.error700 }]}
              >
                Overdue Tasks ({overdueTasks.length})
              </Text>
            </View>

            {overdueTask ? (
            <View
              style={[
                styles.overdueItem,
                {
                  backgroundColor: `${AppColors.error100}4D`,
                  borderLeftColor: AppColors.error700,
                },
              ]}
            >
              <View style={styles.overdueTaskCardWrap}>
                <TaskCard
                  task={overdueTask}
                  showTime={true}
                  showPatientName={true}
                  description={overdueTask.description}
                  style={[styles.overdueTaskCard, { borderColor: "transparent", backgroundColor: "transparent" }]}
                  onPress={() =>
                    router.push({
                      pathname: "/task-details",
                      params: { taskId: overdueTask.id },
                    })
                  }
                />
              </View>
              <Pressable
                style={[styles.notifyButton, { backgroundColor: colors.primary }]}
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="Notify patient"
              >
                <Text style={[styles.notifyButtonText, { color: colors.onPrimary }]}>
                  Notify
                </Text>
              </Pressable>
            </View>
            ) : (
              <Text style={[styles.overdueDesc, { color: colors.textSecondary, marginTop: 16 }]}>
                No overdue tasks
              </Text>
            )}
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
  overdueCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  overdueHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  overdueTitle: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
  },
  overdueItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
  },
  overdueTaskCardWrap: {
    flex: 1,
  },
  overdueTaskCard: {
    marginBottom: 0,
  },
  overdueDesc: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  notifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    borderRadius: 8,
    justifyContent: "center",
    marginLeft: 8,
  },
  notifyButtonText: {
    ...Typography.buttonMedium,
    fontFamily: Fonts.sans,
  },
  pressed: { opacity: 0.8 },
});
