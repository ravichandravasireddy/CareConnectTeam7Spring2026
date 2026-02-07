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
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors, Colors, Typography, Fonts } from "@/constants/theme";

function SectionLabel({ label }: { label: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

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
      <Text style={[styles.navButtonText, { color: AppColors.white }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function NavigationHubScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const showComingSoon = () => {
    // Alert.alert("Coming Soon", "This screen is not yet implemented.");
    return;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Navigation Hub
        </Text>
      </View>

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
          <NavButton label="Role Selection" onPress={showComingSoon} />
          <NavButton label="Registration" onPress={showComingSoon} />
          <NavButton label="Sign In" onPress={showComingSoon} />

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

          <SectionLabel label="Shared & other" />
          <NavButton
            label="Emergency SOS Alert"
            onPress={() => router.push("/emergency-sos")}
          />
          <NavButton
            label="Task Details (sample)"
            onPress={() =>
              router.push({
                pathname: "/caregiver/task-details",
                params: { taskId: "task-1" },
              })
            }
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  title: {
    ...Typography.h2,
    fontFamily: Fonts.sans,
  },
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
