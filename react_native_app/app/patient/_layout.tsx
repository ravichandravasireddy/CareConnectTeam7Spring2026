// =============================================================================
// PATIENT LAYOUT
// =============================================================================
// Stack of patient screens with shared AppBottomNavBar (no separate Tabs).
// Bar shows on home, tasks, messages, health, profile; hidden on detail screens.
// =============================================================================

import { View } from "react-native";
import { Stack, usePathname } from "expo-router";

import {
  AppBottomNavBar,
  kPatientNavHome,
  kPatientNavTasks,
  kPatientNavMessages,
  kPatientNavHealth,
  kPatientNavProfile,
} from "@/components/app-bottom-nav-bar";

function patientIndexFromPathname(pathname: string): number {
  // Hide bar on detail screens if needed in the future
  // Profile and messages screens handle their own bottom bars since they're shared with caregivers
  if (pathname.endsWith("/patient/messages")) return -1; // Messages handles its own bar
  if (pathname.endsWith("/patient/profile")) return -1; // Profile handles its own bar
  if (pathname.endsWith("/patient") || pathname.endsWith("/patient/")) return kPatientNavHome;
  return kPatientNavHome;
}

export default function PatientLayout() {
  const pathname = usePathname();
  const currentIndex = patientIndexFromPathname(pathname ?? "");
  const showBar = currentIndex >= 0;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="profile" />
      </Stack>
      {showBar && (
        <AppBottomNavBar currentIndex={currentIndex} isPatient={true} />
      )}
    </View>
  );
}
