// =============================================================================
// APP APP BAR
// =============================================================================
// Reusable top app bar: menu/back, centered title, optional notification icon.
// Feature parity with flutter_app/lib/widgets/app_app_bar.dart
// Accessibility: semantic labels per AccessiblityNotes.txt
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { AppColors, Colors, Typography, Fonts } from "@/constants/theme";

type AppAppBarProps = {
  title: string;
  showMenuButton?: boolean;
  useBackButton?: boolean;
  showNotificationBadge?: boolean;
  onNotificationTap?: () => void;
  onSettingsPress?: () => void;
};

export function AppAppBar({
  title,
  showMenuButton = true,
  useBackButton = false,
  showNotificationBadge = false,
  onNotificationTap,
  onSettingsPress,
}: AppAppBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const router = useRouter();

  const handleBack = () => router.back();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.leading}>
        {useBackButton ? (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={colors.text}
            />
          </Pressable>
        ) : showMenuButton ? (
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Menu"
          >
            <MaterialIcons
              name="menu"
              size={24}
              color={colors.text}
            />
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={styles.actions}>
        {onNotificationTap && (
          <Pressable
            onPress={onNotificationTap}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={
              showNotificationBadge
                ? "Notifications, 1 unread notification"
                : "Notifications"
            }
          >
            <View>
              <MaterialIcons
                name="notifications-outlined"
                size={24}
                color={colors.text}
              />
              {showNotificationBadge && (
                <View
                  style={[styles.badge, { backgroundColor: AppColors.error500 }]}
                />
              )}
            </View>
          </Pressable>
        )}
        {onSettingsPress && (
          <Pressable
            onPress={onSettingsPress}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <MaterialIcons
              name="settings-outlined"
              size={24}
              color={colors.text}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    minHeight: 56,
    borderBottomWidth: 1,
  },
  leading: {
    width: 48,
    alignItems: "flex-start",
  },
  title: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  actions: {
    flexDirection: "row",
    width: 48,
    justifyContent: "flex-end",
    gap: 4,
  },
  iconButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
