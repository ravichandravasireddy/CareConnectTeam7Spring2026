import { View } from "react-native";
import { Stack } from "expo-router";

export default function HealthLogsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ presentation: "modal", headerShown: false }} />
      </Stack>
    </View>
  );
}
