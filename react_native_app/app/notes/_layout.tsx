import { View } from "react-native";
import { Stack } from "expo-router";

import { AppBottomNavBar, kCaregiverNavHome } from "@/components/app-bottom-nav-bar";

// Shared screen: bar variant comes from useUser() in AppBottomNavBar.
export default function NotesLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Notes" }} />
        <Stack.Screen name="add" options={{ title: "New Note", presentation: "modal" }} />
        <Stack.Screen name="[id]" options={{ title: "Note" }} />
      </Stack>
      <AppBottomNavBar currentIndex={kCaregiverNavHome} />
    </View>
  );
}
