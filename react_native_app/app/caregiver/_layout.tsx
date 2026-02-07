// =============================================================================
// CAREGIVER LAYOUT
// =============================================================================
// Stack of caregiver screens with shared AppBottomNavBar (no separate Tabs).
// Bar shows on index, tasks, analytics, monitor; hidden on task-details.
// =============================================================================

import { View } from "react-native";
import { Stack, usePathname } from "expo-router";

import {
  AppBottomNavBar,
  kCaregiverNavAnalytics,
  kCaregiverNavHome,
  kCaregiverNavMonitor,
  kCaregiverNavTasks,
} from "@/components/app-bottom-nav-bar";

function caregiverIndexFromPathname(pathname: string): number {
  if (pathname.endsWith("/caregiver/task-details")) return -1;
  if (pathname.endsWith("/caregiver/tasks")) return kCaregiverNavTasks;
  if (pathname.endsWith("/caregiver/analytics")) return kCaregiverNavAnalytics;
  if (pathname.endsWith("/caregiver/monitor")) return kCaregiverNavMonitor;
  if (pathname.endsWith("/caregiver") || pathname.endsWith("/caregiver/")) return kCaregiverNavHome;
  return kCaregiverNavHome;
}

export default function CaregiverLayout() {
  const pathname = usePathname();
  const currentIndex = caregiverIndexFromPathname(pathname ?? "");
  const showBar = currentIndex >= 0;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tasks" />
        <Stack.Screen name="analytics" />
        <Stack.Screen name="monitor" />
        <Stack.Screen name="task-details" />
      </Stack>
      {showBar && (
        <AppBottomNavBar currentIndex={currentIndex} isPatient={false} />
      )}
    </View>
  );
}
