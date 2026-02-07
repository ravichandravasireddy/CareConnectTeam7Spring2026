// =============================================================================
// CAREGIVER: PATIENT MONITORING
// =============================================================================
// Overview of patient vitals, alerts, and recent check-ins.
// Deaf/HoH: All patient/vital info as text. Visual action buttons (Call/Video/Message).
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

const PATIENTS = [
  { id: "1", name: "Robert Williams", initials: "RW", patientId: "#RW-2847" },
  { id: "2", name: "Maya Patel", initials: "MP", patientId: "#MP-1932" },
];

function ActionCard({
  icon,
  label,
  color,
  onPress,
  colors,
}: {
  icon: "call" | "videocam" | "message";
  label: string;
  color: string;
  onPress?: () => void;
  colors: typeof Colors.light;
}) {
  const content = (
    <View style={styles.actionContent}>
      <MaterialIcons name={icon} size={26} color={color} />
      <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
    </View>
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {content}
    </Pressable>
  );
}

function VitalTile({
  title,
  value,
  status,
}: {
  title: string;
  value: string;
  status: string;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[
        styles.vitalTile,
        { backgroundColor: colors.surface },
      ]}
    >
      <Text style={[styles.vitalTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.vitalValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.vitalStatus, { color: AppColors.success700 }]}>
        {status}
      </Text>
    </View>
  );
}

export default function CaregiverPatientMonitoringScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Patient Details"
        showMenuButton={false}
        useBackButton={true}
        onNotificationTap={() => {}}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Patients
          </Text>

          <View
            style={[
              styles.patientList,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {PATIENTS.map((p, i) => (
              <View key={p.id}>
                <View style={styles.patientRow}>
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor:
                          i === 0 ? AppColors.primary600 : AppColors.secondary600,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.avatarText,
                        { color: AppColors.white },
                      ]}
                    >
                      {p.initials}
                    </Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>
                      {p.name}
                    </Text>
                    <Text
                      style={[
                        styles.patientId,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Patient ID: {p.patientId}
                    </Text>
                  </View>
                </View>
                {i < PATIENTS.length - 1 && (
                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Selected patient detail */}
          <View style={styles.selectedPatient}>
            <View
              style={[
                styles.selectedAvatar,
                { backgroundColor: AppColors.primary600 },
              ]}
            >
              <Text style={[styles.selectedAvatarText, { color: AppColors.white }]}>
                RW
              </Text>
            </View>
            <View style={styles.selectedInfo}>
              <Text style={[styles.selectedName, { color: colors.text }]}>
                Robert Williams
              </Text>
              <Text
                style={[styles.selectedMeta, { color: colors.textSecondary }]}
              >
                Age 67 • Male • Type 2 Diabetes
              </Text>
            </View>
          </View>

          {/* Action cards */}
          <View style={styles.actionsRow}>
            <ActionCard
              icon="call"
              label="Call"
              color={AppColors.primary600}
              colors={colors}
            />
            <ActionCard
              icon="videocam"
              label="Video"
              color={AppColors.accent500}
              onPress={() => {}}
              colors={colors}
            />
            <ActionCard
              icon="message"
              label="Message"
              color={AppColors.secondary600}
              colors={colors}
            />
          </View>

          {/* Latest vitals */}
          <View
            style={[
              styles.vitalsCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.vitalsTitle, { color: colors.text }]}>
              Latest Vitals
            </Text>
            <View style={styles.vitalsRow}>
              <VitalTile
                title="Blood Pressure"
                value="120/80"
                status="Normal • 2h ago"
              />
              <VitalTile
                title="Heart Rate"
                value="72 bpm"
                status="Normal • 2h ago"
              />
            </View>
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
  sectionTitle: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
    fontWeight: "700",
  },
  patientList: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    overflow: "hidden",
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
    fontWeight: "700",
  },
  patientInfo: {
    flex: 1,
    marginLeft: 12,
  },
  patientName: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
  },
  patientId: {
    ...Typography.bodySmall,
    fontFamily: Fonts.sans,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  selectedPatient: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  selectedAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedAvatarText: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  selectedInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedName: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  selectedMeta: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionCard: {
    flex: 1,
    height: 84,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionContent: {
    alignItems: "center",
    gap: 6,
  },
  actionLabel: {
    ...Typography.body,
    fontFamily: Fonts.sans,
  },
  pressed: { opacity: 0.8 },
  vitalsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  vitalsTitle: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  vitalTile: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  vitalTitle: {
    ...Typography.body,
    fontFamily: Fonts.sans,
  },
  vitalValue: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
    marginTop: 6,
  },
  vitalStatus: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 4,
  },
});
