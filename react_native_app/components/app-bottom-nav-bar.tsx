// =============================================================================
// APP BOTTOM NAVIGATION BAR
// =============================================================================
// Reusable bottom nav: patient variant (Home, Tasks, Messages, Health, Profile)
// and caregiver variant (Home, Tasks, Analytics, Monitor). Pass [currentIndex]
// to highlight the active tab. When [isPatient] is not passed, uses useUser()
// so shared screens (notes, notifications) show the bar for the current role.
// Matches flutter_app/lib/widgets/app_bottom_nav_bar.dart.
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Typography, Fonts } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";

/** Caregiver nav indices: Home=0, Tasks=1, Analytics=2, Monitor=3. */
export const kCaregiverNavHome = 0;
export const kCaregiverNavTasks = 1;
export const kCaregiverNavAnalytics = 2;
export const kCaregiverNavMonitor = 3;

/** Patient nav indices: Home=0, Tasks=1, Messages=2, Health=3, Profile=4. */
export const kPatientNavHome = 0;
export const kPatientNavTasks = 1;
export const kPatientNavMessages = 2;
export const kPatientNavHealth = 3;
export const kPatientNavProfile = 4;

export interface AppBottomNavBarProps {
  /** Which tab is currently active (0-based). */
  currentIndex: number;
  /** If omitted, uses useUser().isPatient so shared screens show the right bar by role. */
  isPatient?: boolean;
}

interface TabItem {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  route: string;
}

const CAREGIVER_TABS: TabItem[] = [
  { label: "Home", icon: "home", route: "/caregiver" },
  { label: "Tasks", icon: "checklist", route: "/caregiver/tasks" },
  { label: "Analytics", icon: "analytics", route: "/caregiver/analytics" },
  { label: "Monitor", icon: "monitor-heart", route: "/caregiver/monitor" },
];

// Patient routes: Home/Profile/Messages point to "/" until patient dashboard, messaging, profile exist.
const PATIENT_TABS: TabItem[] = [
  { label: "Home", icon: "home", route: "/" },
  { label: "Tasks", icon: "calendar-today", route: "/calendar" },
  { label: "Messages", icon: "message", route: "/" },
  { label: "Health", icon: "favorite", route: "/health-logs" },
  { label: "Profile", icon: "person", route: "/" },
];

export function AppBottomNavBar({
  currentIndex,
  isPatient: isPatientProp,
}: AppBottomNavBarProps) {
  const { isPatient: isPatientFromUser } = useUser();
  const isPatient = isPatientProp ?? isPatientFromUser;

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tabs = isPatient ? PATIENT_TABS : CAREGIVER_TABS;
  const clampedIndex = Math.max(0, Math.min(currentIndex, tabs.length - 1));

  const handlePress = (index: number, route: string) => {
    if (index === clampedIndex) return;
    router.push(route as any);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {tabs.map((tab, index) => {
        const active = index === clampedIndex;
        return (
          <Pressable
            key={tab.label}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.pressed,
            ]}
            onPress={() => handlePress(index, tab.route)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
          >
            <MaterialIcons
              name={tab.icon}
              size={24}
              color={active ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.label,
                {
                  color: active ? colors.primary : colors.textSecondary,
                },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 48,
  },
  label: {
    ...Typography.caption,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  pressed: { opacity: 0.8 },
});
