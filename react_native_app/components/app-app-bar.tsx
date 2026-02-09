// =============================================================================
// APP APP BAR
// =============================================================================
// Reusable top app bar: menu/back, centered title, optional notification icon.
// Feature parity with flutter_app/lib/widgets/app_app_bar.dart
// Accessibility: semantic labels per AccessiblityNotes.txt
// =============================================================================

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";

import { useTheme } from "@/providers/ThemeProvider";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppColors, Typography, Fonts } from "@/constants/theme";

type AppAppBarProps = {
  title: string;
  showMenuButton?: boolean;
  useBackButton?: boolean;
  /** Show notification icon (default true). Tap navigates to /notifications unless onNotificationTap is provided. */
  showNotificationButton?: boolean;
  showNotificationBadge?: boolean;
  /** Override default navigation to /notifications when notification icon is pressed. */
  onNotificationTap?: () => void;
  onSettingsPress?: () => void;
  /** Override default menu behavior when menu button is pressed. */
  onMenuPress?: () => void;
  /** Custom action buttons to display on the right side (after notification/settings). */
  customActions?: ReactNode;
};

const NOTIFICATIONS_ROUTE = "/notifications";

export function AppAppBar({
  title,
  showMenuButton = true,
  useBackButton = false,
  showNotificationButton = true,
  showNotificationBadge = false,
  onNotificationTap,
  onSettingsPress,
  onMenuPress,
  customActions,
}: AppAppBarProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handleBack = () => router.back();
  const handleNotificationPress = () => {
    (onNotificationTap ?? (() => router.push(NOTIFICATIONS_ROUTE as any)))();
  };
  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    }
  };

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
            onPress={handleMenuPress}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Menu"
            accessibilityHint="Opens menu options"
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
        {showNotificationButton && (
          <Pressable
            onPress={handleNotificationPress}
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
                name="notifications-none"
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
              name="settings"
              size={24}
              color={colors.text}
            />
          </Pressable>
        )}
        {customActions}
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
    minWidth: 48,
    justifyContent: "flex-end",
    alignItems: "center",
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
