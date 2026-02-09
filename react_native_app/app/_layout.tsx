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
        <Stack.Screen name="calendar" options={{ headerShown: false }} />
        <Stack.Screen name="navigation-hub" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="notes" options={{ headerShown: false }} />
        <Stack.Screen name="health-logs" options={{ headerShown: false }} />
        <Stack.Screen name="health-timeline" options={{ headerShown: false }} />
        <Stack.Screen name="video-call" options={{ headerShown: false}} />
        <Stack.Screen name="emergency-sos" options={{ headerShown: false }} />
        <Stack.Screen name="task-details" options={{ headerShown: false }} />
        <Stack.Screen name="caregiver" options={{ headerShown: false }} />
        <Stack.Screen name="patient" options={{ headerShown: false }} />
        <Stack.Screen name="role-selection" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
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
