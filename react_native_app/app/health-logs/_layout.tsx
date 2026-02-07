import { View } from "react-native";
import { Stack } from "expo-router";

import {
  AppBottomNavBar,
  kPatientNavHealth,
} from "@/components/app-bottom-nav-bar";

export default function HealthLogsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Health Logs" }} />
        <Stack.Screen name="add" options={{ title: "New Health Log", presentation: "modal" }} />
      </Stack>
      <AppBottomNavBar currentIndex={kPatientNavHealth} isPatient={true} />
    </View>
  );
}
