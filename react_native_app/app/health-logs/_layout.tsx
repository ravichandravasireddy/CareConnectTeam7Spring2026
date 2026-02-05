import { Stack } from 'expo-router';

export default function HealthLogsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Health Logs' }} />
      <Stack.Screen name="add" options={{ title: 'New Health Log', presentation: 'modal' }} />
    </Stack>
  );
}
