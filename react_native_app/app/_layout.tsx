import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useTheme } from "@/providers/ThemeProvider";
import { Providers } from "@/providers/Providers";

function LayoutContent() {
  const { colorScheme } = useTheme();
  return (
    <NavThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ title: "Calendar" }} />
        <Stack.Screen name="navigation-hub" options={{ title: "Navigation Hub" }} />
        <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
        <Stack.Screen name="notes" options={{ title: "Notes", headerShown: false }} />
        <Stack.Screen name="health-logs" options={{ title: "Health Logs", headerShown: false }} />
        <Stack.Screen name="health-timeline" options={{ title: "Health Timeline" }} />
        <Stack.Screen name="video-call" options={{ headerShown: false}} />
        <Stack.Screen name="emergency-sos" options={{ headerShown: false }} />
        <Stack.Screen name="caregiver" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="role-selection" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
        <Stack.Screen name="patient-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="messaging-thread-patient" options={{ headerShown: false }} />
        <Stack.Screen name="patient-profile" options={{ headerShown: false }} />
        <Stack.Screen name="preferences-accessibility" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Providers>
        <LayoutContent />
    </Providers>
  );
}
