// =============================================================================
// APP MENU COMPONENT
// =============================================================================
// Reusable menu with role-based links.
// Patient: Home, Tasks, Messages, Health Logs, Health Timeline, Profile, Notes, Preferences, Notifications.
// Caregiver: Dashboard, Patients, Tasks, Analytics, Notes, Messages, Profile, Preferences, Notifications.
// Uses UserProvider for role detection.
// =============================================================================

import React from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Typography } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";
import { useUser } from "@/providers/UserProvider";

interface AppMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
}

const PATIENT_MENU_ITEMS: MenuItem[] = [
  { label: "Home", icon: "home-outline", route: "/patient" },
  { label: "Tasks", icon: "calendar-outline", route: "/calendar" },
  { label: "Messages", icon: "chatbubbles-outline", route: "/patient/messages" },
  { label: "Health Logs", icon: "heart-outline", route: "/health-logs" },
  { label: "Health Timeline", icon: "time-outline", route: "/health-timeline" },
  { label: "Profile", icon: "person-outline", route: "/patient/profile" },
  { label: "Notes", icon: "document-text-outline", route: "/notes" },
  { label: "Preferences", icon: "settings-outline", route: "/preferences-accessibility" },
  { label: "Notifications", icon: "notifications-outline", route: "/notifications" },
];

const CAREGIVER_MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", icon: "grid-outline", route: "/caregiver" },
  { label: "Patients", icon: "people-outline", route: "/caregiver/monitor" },
  { label: "Tasks", icon: "list-outline", route: "/caregiver/tasks" },
  { label: "Analytics", icon: "analytics-outline", route: "/caregiver/analytics" },
  { label: "Notes", icon: "document-text-outline", route: "/notes" },
  { label: "Messages", icon: "chatbubbles-outline", route: "/patient/messages" },
  { label: "Profile", icon: "person-outline", route: "/patient/profile" },
  { label: "Preferences", icon: "settings-outline", route: "/preferences-accessibility" },
  { label: "Notifications", icon: "notifications-outline", route: "/notifications" },
];

export function AppMenu({ visible, onClose }: AppMenuProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { isPatient } = useUser();

  const menuItems = isPatient ? PATIENT_MENU_ITEMS : CAREGIVER_MENU_ITEMS;

  const handleMenuItemPress = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleSignOut = () => {
    onClose();
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          router.replace("/sign-in");
        },
      },
    ]);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        accessible={true}
        accessibilityLabel="Close menu"
        accessibilityRole="button"
      >
        <View
          style={[styles.menuCard, { backgroundColor: colors.surface }]}
          accessible={true}
          accessibilityRole="menu"
          onStartShouldSetResponder={() => true}
        >
          <Text style={[styles.menuTitle, { color: colors.text }]}>Menu</Text>
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={() => handleMenuItemPress(item.route)}
              color={colors.text}
            />
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem
            label="Sign Out"
            icon="log-out-outline"
            onPress={handleSignOut}
            color={colors.error}
          />
          <MenuItem
            label="Cancel"
            icon="close-outline"
            onPress={onClose}
            color={colors.textSecondary}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

interface MenuItemProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  color: string;
}

function MenuItem({ label, icon, onPress, color }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.menuItem}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color={color} style={styles.menuIcon} />
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
  divider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    ...Typography.body,
  },
});
