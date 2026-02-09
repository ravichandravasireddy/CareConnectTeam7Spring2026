// =============================================================================
// NAVIGATION HUB (DEV)
// =============================================================================
// Simple list of buttons to reach all screens for demos.
// Deaf/HoH: Text labels on all buttons. Visual-only navigation.
// =============================================================================

import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppAppBar } from "@/components/app-app-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors, Typography, Fonts } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";

function SectionLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.sectionLabel, { color: colors.primary }]}>{label}</Text>
  );
}

function NavButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.navButton,
        { backgroundColor: colors.primary },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.navButtonText, { color: colors.onPrimary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function NavigationHubScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Navigation Hub"
        showMenuButton={false}
        useBackButton={true}
        showNotificationButton={false}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Tap a button to open a screen.
          </Text>

          <SectionLabel label="Auth & onboarding" />
          <NavButton label="Welcome" onPress={() => router.replace("/")} />
          <NavButton
            label="Role Selection"
            onPress={() => router.push("/role-selection")}
          />
          <NavButton
            label="Registration"
            onPress={() => router.push("/registration")}
          />
          <NavButton
            label="Sign In"
            onPress={() => router.push("/sign-in")}
          />

          <SectionLabel label="Caregiver" />
          <NavButton
            label="Caregiver Dashboard"
            onPress={() => router.replace("/caregiver")}
          />
          <NavButton
            label="Caregiver: Patient Monitoring"
            onPress={() => router.push("/caregiver/monitor")}
          />
          <NavButton
            label="Caregiver: Task Management"
            onPress={() => router.push("/caregiver/tasks")}
          />
          <NavButton
            label="Caregiver: Analytics"
            onPress={() => router.push("/caregiver/analytics")}
          />

          <SectionLabel label="Patient" />
          <NavButton
            label="Patient Dashboard"
            onPress={() => router.push("/patient" as any)}
          />
          <NavButton
            label="Patient Profile"
            onPress={() => router.push("/patient/profile" as any)}
          />
          <NavButton
            label="Messaging Thread (Patient)"
            onPress={() => router.push("/patient/messages" as any)}
          />

          <SectionLabel label="Shared & other" />
          <NavButton
            label="Calendar"
            onPress={() => router.push("/calendar")}
          />
          <NavButton
            label="Notifications"
            onPress={() => router.push("/notifications")}
          />
          <NavButton
            label="Notes"
            onPress={() => router.push("/notes")}
          />
          <NavButton
            label="Health Logs"
            onPress={() => router.push("/health-logs")}
          />
          <NavButton
            label="Health Timeline"
            onPress={() => router.push("/health-timeline")}
          />
          <NavButton
            label="Video Call"
            onPress={() => router.push("/video-call")}
          />
          <NavButton
            label="Emergency SOS Alert"
            onPress={() => router.push("/emergency-sos")}
          />
          <NavButton
            label="Task Details (sample)"
            onPress={() =>
              router.push({
                pathname: "/task-details",
                params: { taskId: "task-1" },
              })
            }
          />

          <SectionLabel label="Settings" />
          <NavButton
            label="Preferences & Accessibility"
            onPress={() => router.push("/preferences-accessibility")}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  subtitle: {
    ...Typography.body,
    fontFamily: Fonts.sans,
  },
  sectionLabel: {
    ...Typography.bodySmall,
    fontFamily: Fonts.sans,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
  },
  navButton: {
    width: "100%",
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  navButtonText: {
    ...Typography.buttonLarge,
    fontFamily: Fonts.sans,
  },
  pressed: { opacity: 0.9 },
});
