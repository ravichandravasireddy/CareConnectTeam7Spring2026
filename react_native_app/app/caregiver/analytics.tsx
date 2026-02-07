// =============================================================================
// CAREGIVER: ANALYTICS
// =============================================================================
// High-level overview of patient activity and task completion trends.
// Deaf/HoH: All metrics as text and numbers. No audio summaries.
// =============================================================================

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAppBar } from "@/components/app-app-bar";
import { AppColors, Colors, Typography, Fonts } from "@/constants/theme";
import { useTheme } from "@/providers/ThemeProvider";

function MetricCard({
  title,
  value,
  delta,
  valueColor,
  colors,
}: {
  title: string;
  value: string;
  delta: string;
  valueColor: string;
  colors: typeof Colors.light;
}) {
  return (
    <View
      style={[
        styles.metricCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.metricTitle, { color: colors.textSecondary }]}>
        {title}
      </Text>
      <Text style={[styles.metricValue, { color: valueColor }]}>{value}</Text>
      <Text style={[styles.metricDelta, { color: colors.textSecondary }]}>
        {delta}
      </Text>
    </View>
  );
}

export default function CaregiverAnalyticsScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <AppAppBar
        title="Analytics"
        showMenuButton={false}
        useBackButton={true}
      />

      <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View accessibilityRole="header" accessibilityLabel="Weekly Overview">
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Weekly Overview
            </Text>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Track engagement and task completion trends.
            </Text>
          </View>

          <View style={styles.metricsRow}>
            <MetricCard
              title="Task Completion"
              value="87%"
              delta="↑ 5% from last week"
              valueColor={AppColors.success700}
              colors={colors}
            />
            <MetricCard
              title="Avg Response\nTime"
              value="12m"
              delta="↓ 3m from last week"
              valueColor={AppColors.primary600}
              colors={colors}
            />
          </View>

          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Medication Adherence
            </Text>
            <View
              style={[
                styles.chartPlaceholder,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text
                style={[styles.chartPlaceholderText, { color: colors.textSecondary }]}
              >
                7-day adherence trend chart
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    ...Typography.h5,
    fontFamily: Fonts.sans,
  },
  sectionDesc: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.sans,
    marginTop: 8,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricTitle: {
    ...Typography.bodySmall,
    fontFamily: Fonts.sans,
  },
  metricValue: {
    ...Typography.h4,
    fontFamily: Fonts.sans,
    marginTop: 10,
  },
  metricDelta: {
    ...Typography.body,
    fontFamily: Fonts.sans,
    marginTop: 8,
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
  },
  chartTitle: {
    ...Typography.bodyEmphasized,
    fontFamily: Fonts.sans,
  },
  chartPlaceholder: {
    height: 160,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chartPlaceholderText: {
    ...Typography.body,
    fontFamily: Fonts.sans,
  },
});
