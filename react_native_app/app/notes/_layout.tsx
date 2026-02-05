import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Notes' }} />
      <Stack.Screen name="add" options={{ title: 'New Note', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Note' }} />
    </Stack>
  );
}
