import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemePreferenceProvider } from "@/context/theme-preference";

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="role-selection" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false }} />
        <Stack.Screen
          name="patient-dashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="messaging-thread-patient"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="patient-profile"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="preferences-accessibility"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <RootNavigator />
    </ThemePreferenceProvider>
  );
}
