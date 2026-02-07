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
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAppBar } from "@/components/app-app-bar";
import { AppColors, Colors, Typography, Fonts } from "@/constants/theme";
import { MOCK_TASKS } from "@/models/task";

export default function CaregiverTaskManagementScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const overdueTask = MOCK_TASKS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Tasks"
        showMenuButton={false}
        useBackButton={true}
        onNotificationTap={() => {}}
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
                Overdue Tasks (2)
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.overdueItem,
                {
                  backgroundColor: `${AppColors.error100}4D`,
                  borderLeftColor: AppColors.error500,
                },
                pressed && styles.pressed,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/caregiver/task-details",
                  params: { taskId: overdueTask.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`${overdueTask.patientName}, medication reminder ${overdueTask.title}, due 30 min ago, tap to view details`}
            >
              <View style={styles.overdueItemContent}>
                <Text style={[styles.overduePatient, { color: colors.text }]}>
                  {overdueTask.patientName}
                </Text>
                <Text style={[styles.overdueDesc, { color: colors.textSecondary }]}>
                  Medication reminder:
                </Text>
                <Text style={[styles.overdueDesc, { color: colors.textSecondary }]}>
                  {overdueTask.title}
                </Text>
                <Text style={[styles.overdueTime, { color: AppColors.error700 }]}>
                  Due 30 min ago
                </Text>
              </View>
              <Pressable
                style={[styles.notifyButton, { backgroundColor: colors.primary }]}
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="Notify patient"
              >
                <Text style={[styles.notifyButtonText, { color: AppColors.white }]}>
                  Notify
                </Text>
              </Pressable>
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
  overdueItemContent: {
    flex: 1,
  },
  overduePatient: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
  },
  overdueDesc: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  overdueTime: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 6,
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
