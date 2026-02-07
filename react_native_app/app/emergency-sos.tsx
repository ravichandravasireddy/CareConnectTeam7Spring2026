// =============================================================================
// EMERGENCY SOS ALERT SCREEN
// =============================================================================
// Emergency alert management (placeholder). Feature parity with Flutter.
// Deaf/HoH: Fully visual - no audio. Red background, large text, clear icons.
// All critical info (patient, location) shown as text. Visual acknowledgment.
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors, Typography, Fonts } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";

export default function EmergencySOSAlertScreen() {
  const { colors, colorScheme } = useTheme();
  const router = useRouter();
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const handleAcknowledge = useCallback(() => {
    setIsAcknowledged(true);
    setTimeout(() => router.back(), 3000);
  }, [router]);

  if (isAcknowledged) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.surface }]}
        accessibilityRole="summary"
        accessibilityLabel="Alert acknowledged. You will be redirected in 3 seconds."
        accessibilityHint="You will be redirected in 3 seconds."
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.acknowledgedContent}>
            <MaterialIcons
              name="check-circle"
              size={72}
              color={AppColors.success700}
              accessibilityLabel="Alert acknowledged"
            />
            <Text style={[styles.ackTitle, { color: colors.text }]}>
              Alert Acknowledged
            </Text>
            <Text style={[styles.ackDesc, { color: colors.textSecondary }]}>
              This alert has been cleared.
            </Text>
            <Text style={[styles.ackHint, { color: colors.textSecondary }]}>
              You will be automatically redirected in 3 seconds.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: AppColors.error500 }]}
      accessibilityRole="alert"
      accessibilityLabel="Emergency alert from Robert Williams. Patient ID RW-2847. Location 742 Evergreen Terrace, Springfield. Tap Acknowledge Alert to confirm."
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.alertIcon} accessibilityLabel="Emergency alert icon">
            <View style={[styles.alertIconCircle, { borderColor: AppColors.error100 }]}>
              <MaterialIcons
                name="warning-amber"
                size={48}
                color={AppColors.error700}
              />
            </View>
          </View>

          <Text
            style={[styles.alertTitle, { color: AppColors.white }]}
            accessibilityRole="header"
          >
            EMERGENCY{"\n"}ALERT
          </Text>

          <View style={[styles.fromCard, { backgroundColor: AppColors.error700 }]}>
            <Text style={styles.fromName}>From: Robert Williams</Text>
            <Text style={styles.fromId}>Patient ID: #RW-2847</Text>
          </View>

          <Text style={[styles.timestamp, { color: AppColors.white }]}>
            2 minutes ago
          </Text>

          <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
            <View style={styles.patientRow}>
              <View
                style={[
                  styles.patientAvatar,
                  { backgroundColor: AppColors.secondary600 },
                ]}
              >
                <Text style={[styles.patientInitials, { color: AppColors.white }]}>
                  RW
                </Text>
              </View>
              <View style={styles.patientInfo}>
                <Text style={[styles.patientName, { color: colors.text }]}>
                  Robert Williams
                </Text>
                <Text style={[styles.patientMeta, { color: colors.textSecondary }]}>
                  Age 67 • Diabetes, Hypertension
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.locationCard,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? AppColors.darkBgElevated
                      : AppColors.gray100,
                },
              ]}
            >
              <MaterialIcons
                name="location-on"
                size={24}
                color={colors.primary}
              />
              <View style={styles.locationInfo}>
                <Text style={[styles.locationLabel, { color: colors.text }]}>
                  Patient Location
                </Text>
                <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>
                  742 Evergreen Terrace
                </Text>
                <Text style={[styles.locationAddress, { color: colors.textSecondary }]}>
                  Springfield, IL 62701
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.ackButton,
              { backgroundColor: AppColors.white },
              pressed && styles.pressed,
            ]}
            onPress={handleAcknowledge}
            accessibilityRole="button"
            accessibilityLabel="Acknowledge emergency alert"
            accessibilityHint="Confirms you have seen the alert. Screen will close in 3 seconds."
          >
            <MaterialIcons name="check-circle" size={24} color={AppColors.error700} />
            <Text style={[styles.ackButtonText, { color: AppColors.error700 }]}>
              Acknowledge Alert
            </Text>
          </Pressable>
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
  alertIcon: {
    alignItems: "center",
    marginTop: 8,
  },
  alertIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: AppColors.error100,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  alertTitle: {
    ...Typography.h2,
    fontFamily: Fonts.sans,
    color: AppColors.white,
    textAlign: "center",
    marginTop: 16,
  },
  fromCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  fromName: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
    color: AppColors.white,
  },
  fromId: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    color: "rgba(255,255,255,0.9)",
    marginTop: 6,
  },
  timestamp: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.sans,
    marginTop: 16,
    textAlign: "center",
  },
  detailCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  patientInitials: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  patientMeta: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  locationCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "flex-start",
  },
  locationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  locationLabel: {
    ...Typography.buttonMedium,
    fontFamily: Fonts.sans,
  },
  locationAddress: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  ackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 12,
    marginTop: 24,
  },
  ackButtonText: {
    ...Typography.buttonLarge,
    fontFamily: Fonts.sans,
  },
  pressed: { opacity: 0.9 },
  acknowledgedContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  ackTitle: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
    textAlign: "center",
    marginTop: 16,
  },
  ackDesc: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.sans,
    textAlign: "center",
    marginTop: 8,
  },
  ackHint: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
});
