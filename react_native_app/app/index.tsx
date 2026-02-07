import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AppColors, Fonts, Typography } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";

export const normalizeColorScheme = (
  scheme: string | null | undefined,
): "light" | "dark" => (scheme === "dark" ? "dark" : "light");

export const calculateTopSpacing = (height: number) =>
  Math.max(32, height * 0.12);

export const calculateBottomSpacing = (height: number) =>
  Math.max(24, height * 0.1);

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, colorScheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { height } = useWindowDimensions();
  const topSpacing = calculateTopSpacing(height);
  const bottomSpacing = calculateBottomSpacing(height);
  const onPrimary =
    colorScheme === "dark" ? AppColors.darkTextPrimary : AppColors.white;

  const handleGetStarted = () => {
    router.replace("/caregiver" as any);
  };

  const handleSignIn = () => {
    router.replace("/caregiver" as any);
  };

  const handleNavigationHub = () => {
    router.push("/navigation-hub" as any);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      accessibilityLabel="CareConnect welcome. Get started or sign in. All feedback is visual only."
    >
      <LinearGradient
        colors={[AppColors.primary600, AppColors.accent500]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topSpacing, paddingBottom: bottomSpacing },
        ]}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View
            style={[styles.iconCircle, { backgroundColor: colors.surface }]}
            accessibilityLabel="CareConnect logo"
            accessible
          >
            <MaterialIcons
              name="favorite"
              size={56}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.title, { color: onPrimary }]}>CareConnect</Text>

          <Text
            style={[styles.subtitle, { color: onPrimary }]}
            accessibilityRole="text"
          >
            Remote health management and coordination for patients and
            caregivers
          </Text>

          <View style={styles.buttonGroup}>
            <Pressable
              onPress={handleGetStarted}
              accessibilityRole="button"
              accessibilityLabel="Get started"
              accessibilityHint="Opens caregiver dashboard"
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.surface, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text
                style={[styles.primaryButtonText, { color: colors.primary }]}
              >
                Get Started
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSignIn}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              accessibilityHint="Opens caregiver dashboard"
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: onPrimary, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: onPrimary }]}>
                Sign In
              </Text>
            </Pressable>
          </View>

          <Text
            style={[styles.complianceText, { color: onPrimary }]}
            accessibilityRole="text"
          >
            HIPAA-compliant • Secure • Private
          </Text>

          {/* Temporary dev link - remove in production */}
          <Pressable
            onPress={handleNavigationHub} // handleNavigationHub
            accessibilityRole="button"
            accessibilityLabel="Open Navigation Hub screen"
            style={({ pressed }) => [
              styles.devLink,
              { borderColor: onPrimary, opacity: pressed ? 0.7 : 0.5 },
            ]}
          >
            <Text style={[styles.devLinkText, { color: onPrimary }]}>
            Navigation Hub →
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    gradient: {
      ...StyleSheet.absoluteFill,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    content: {
      alignItems: "center",
      gap: 16,
    },
    iconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    title: {
      ...Typography.h1,
      fontFamily: Fonts.sans,
      textAlign: "center",
    },
    subtitle: {
      ...Typography.bodyLarge,
      fontFamily: Fonts.sans,
      textAlign: "center",
      maxWidth: 320,
      opacity: 0.92,
    },
    buttonGroup: {
      width: "100%",
      gap: 12,
      marginTop: 12,
    },
    primaryButton: {
      minHeight: 56,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    primaryButtonText: {
      ...Typography.buttonLarge,
      fontFamily: Fonts.sans,
    },
    secondaryButton: {
      minHeight: 56,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      borderWidth: 2,
      backgroundColor: "transparent",
    },
    secondaryButtonText: {
      ...Typography.buttonLarge,
      fontFamily: Fonts.sans,
    },
    complianceText: {
      ...Typography.bodySmall,
      fontFamily: Fonts.sans,
      marginTop: 8,
      opacity: 0.85,
    },
    devLink: {
      marginTop: 24,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor: "transparent",
    },
    devLinkText: {
      ...Typography.bodySmall,
      fontFamily: Fonts.sans,
      opacity: 0.7,
    },
    navHubLink: {
      marginTop: 24,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
    },
    navHubLinkText: {
      ...Typography.bodySmall,
      fontFamily: Fonts.sans,
      opacity: 0.9,
    },
  });
