import { View } from "react-native";
import { Stack } from "expo-router";

import { AppBottomNavBar, kCaregiverNavHome, kPatientNavHome } from "@/components/app-bottom-nav-bar";
import { useUser } from "@/providers/UserProvider";

// Shared screen: bar variant comes from useUser() in AppBottomNavBar.
export default function NotesLayout() {
  const { isPatient } = useUser();
  
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="add" options={{ presentation: "modal" }} />
        <Stack.Screen name="[id]" />
      </Stack>
      <AppBottomNavBar 
        currentIndex={isPatient ? kPatientNavHome : kCaregiverNavHome}
        isPatient={isPatient}
      />
    </View>
  );
}
