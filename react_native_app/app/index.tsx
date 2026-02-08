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
import { useColorScheme } from "@/hooks/use-color-scheme";

import { AppColors, Colors, Fonts, Typography } from "@/constants/theme";

export const normalizeColorScheme = (
  scheme: string | null | undefined,
): "light" | "dark" => (scheme === "dark" ? "dark" : "light");

export const calculateTopSpacing = (height: number) =>
  Math.max(32, height * 0.12);

export const calculateBottomSpacing = (height: number) =>
  Math.max(24, height * 0.1);

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = normalizeColorScheme(useColorScheme());
  const colors = Colors[colorScheme];
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { height } = useWindowDimensions();
  const topSpacing = calculateTopSpacing(height);
  const bottomSpacing = calculateBottomSpacing(height);
  const onPrimary =
    colorScheme === "dark" ? AppColors.darkTextPrimary : AppColors.white;

  const handleGetStarted = () => {
    router.push("/role-selection");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <SafeAreaView style={styles.safeArea} accessibilityLabel="Welcome screen">
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
            <Text style={[styles.iconText, { color: colors.primary }]}>❤</Text>
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
              accessibilityHint="TODO: Navigates to role selection"
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
              accessibilityHint="TODO: Navigates to sign in"
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
    iconText: {
      fontSize: 48,
      lineHeight: 56,
      fontFamily: Fonts.rounded,
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
  });
