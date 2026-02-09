import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import PatientDashboardScreen from "@/screens/PatientDashboardScreen";
import { Colors, Typography } from "@/constants/theme";
import { useState } from "react";

export default function HomeTab() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];

  return (
    <>
      <PatientDashboardScreen
        userName="Robert Williams"
        onNotificationsPress={() =>
          Alert.alert("Notifications", "Coming soon.")
        }
        onMenuPress={() => setMenuVisible(true)}
        onCalendarPress={() => router.push("/(tabs)/tasks")}
        onHealthLogsPress={() => router.push("/(tabs)/health")}
        onTaskDetailsPress={() => Alert.alert("Task Details", "Coming soon.")}
        onVideoCallPress={() => Alert.alert("Video Call", "Coming soon.")}
        onMessagingPress={() => router.push("/(tabs)/messages")}
        onEmergencyPress={() => Alert.alert("Emergency SOS", "Calling help...")}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuVisible(false)}
          accessible={true}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
        >
          <View
            style={[styles.menuCard, { backgroundColor: colors.surface }]}
            accessible={true}
            accessibilityRole="menu"
          >
            <Text style={[styles.menuTitle, { color: colors.text }]}>Menu</Text>
            <MenuItem
              label="Home"
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)/home");
              }}
              color={colors.text}
            />
            <MenuItem
              label="Patient Profile"
              onPress={() => {
                setMenuVisible(false);
                router.push("/(tabs)/profile");
              }}
              color={colors.text}
            />
            <MenuItem
              label="Preferences & Accessibility"
              onPress={() => {
                setMenuVisible(false);
                router.push("/preferences-accessibility");
              }}
              color={colors.text}
            />
            <MenuItem
              label="Cancel"
              onPress={() => setMenuVisible(false)}
              color={colors.textSecondary}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function MenuItem({
  label,
  onPress,
  color,
}: {
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.menuItem}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.menuItemText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  menuCard: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuTitle: {
    ...Typography.h6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  menuItem: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  menuItemText: {
    ...Typography.body,
  },
});
