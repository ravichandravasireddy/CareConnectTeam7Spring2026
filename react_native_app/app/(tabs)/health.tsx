import { View, Text, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography } from "@/constants/theme";

export default function HealthTab() {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = Colors[scheme];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
      edges={["top"]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Health</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Health logs coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    ...Typography.h2,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.bodyLarge,
    textAlign: "center",
  },
});
