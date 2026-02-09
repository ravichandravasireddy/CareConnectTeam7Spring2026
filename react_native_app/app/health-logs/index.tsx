// =============================================================================
// HEALTH LOGS SCREEN
// =============================================================================
// "Add a Log" button, Quick Log grid, and "Latest by type" (one card per type
// for today). Tapping opens Health Log Add screen.
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppAppBar } from '@/components/app-app-bar';
import { AppBottomNavBar, kPatientNavHealth, kCaregiverNavHome } from '@/components/app-bottom-nav-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUser } from '@/providers/UserProvider';
import { useHealthLogProvider } from '../../providers/HealthLogProvider';
import {
  HealthLog,
  HealthLogType,
  bloodPressureCategoryLabel,
  heartRateCategoryLabel,
  healthLogHasProgress,
  healthLogProgressRatio,
} from '../../models/HealthLog';
import { Typography } from '../../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

const QUICK_LOG_OPTIONS: { type: HealthLogType; label: string; icon: string }[] = [
  { type: HealthLogType.mood, label: 'Mood', icon: 'sentiment-satisfied' },
  { type: HealthLogType.symptoms, label: 'Symptoms', icon: 'monitor-heart' },
  { type: HealthLogType.meals, label: 'Meals', icon: 'restaurant' },
  { type: HealthLogType.water, label: 'Water', icon: 'water-drop' },
  { type: HealthLogType.exercise, label: 'Exercise', icon: 'favorite' },
  { type: HealthLogType.sleep, label: 'Sleep', icon: 'bedtime' },
  { type: HealthLogType.bloodPressure, label: 'Blood Pressure', icon: 'local-hospital' },
  { type: HealthLogType.heartRate, label: 'Heart Rate', icon: 'speed' },
  { type: HealthLogType.general, label: 'General', icon: 'description' },
];

function LatestLogCard({
  type,
  label,
  icon,
  latestLog,
  onPress,
  colors,
  typeColorsFn,
}: {
  type: HealthLogType;
  label: string;
  icon: string;
  latestLog: HealthLog | undefined;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  typeColorsFn: (t: HealthLogType) => { bg: string; fg: string };
}) {
  const { bg, fg } = typeColorsFn(type);
  const timeLabel = latestLog
    ? latestLog.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '';

  let statusChip: string | null = null;
  if (latestLog?.type === HealthLogType.bloodPressure && latestLog.systolic != null && latestLog.diastolic != null) {
    statusChip = bloodPressureCategoryLabel(latestLog.systolic, latestLog.diastolic);
  } else if (latestLog?.type === HealthLogType.heartRate && latestLog.heartRateBpm != null) {
    statusChip = heartRateCategoryLabel(latestLog.heartRateBpm);
  }

  const semanticsLabel = latestLog
    ? (latestLog.note ? `${label}, ${latestLog.description}, ${latestLog.note}, ${timeLabel}` : `${label}, ${latestLog.description}, ${timeLabel}`)
    : `No ${label} logged, tap to add`;

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={semanticsLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.latestCard, { borderColor: colors.border, backgroundColor: colors.surface }]}
      activeOpacity={0.7}>
      <View style={[styles.latestIconWrap, { backgroundColor: bg }]}>
        <MaterialIcons name={icon as any} size={20} color={fg} />
      </View>
      <View style={styles.latestContent}>
        {latestLog ? (
          <>
            <Text style={[Typography.h6, { color: colors.text }]} numberOfLines={1}>
              {latestLog.description}
            </Text>
            {statusChip != null && (
              <View style={[styles.statusChip, { backgroundColor: colors.secondarySoft }]}>
                <Text style={[Typography.captionBold, { color: colors.text }]}>{statusChip}</Text>
              </View>
            )}
            {latestLog.note != null && latestLog.note !== '' && (
              <Text style={[Typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={2}>
                {latestLog.note}
              </Text>
            )}
            <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>{timeLabel}</Text>
            {healthLogHasProgress(latestLog) && latestLog.waterGoal != null && (
              <View style={styles.progressRow}>
                <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
                  Goal: {latestLog.waterGoal.toFixed(0)} oz
                </Text>
                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { backgroundColor: colors.primary, width: `${Math.min(100, healthLogProgressRatio(latestLog) * 100)}%` },
                    ]}
                  />
                </View>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>No {label} logged</Text>
            <MaterialIcons name="add-circle-outline" size={24} color={colors.primary} style={styles.addIcon} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HealthLogsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const healthLogProvider = useHealthLogProvider();
  const { isPatient } = useUser();

  const openAdd = (initialType?: HealthLogType) => {
    const type = initialType ?? HealthLogType.general;
    router.push({ pathname: '/health-logs/add', params: { initialType: type } } as any);
  };

  return (
    <>
      <AppAppBar
        title="Health Logs"
        showMenuButton={false}
        useBackButton={true}
        showNotificationButton={false}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <View style={styles.topButton}>
          <TouchableOpacity
            accessible
            accessibilityLabel="Add a Log, button"
            accessibilityRole="button"
            onPress={() => openAdd()}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}>
            <Text style={[Typography.buttonLarge, { color: colors.onPrimary }]}>Add a Log</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { borderBottomColor: colors.border }]}>
            <Text style={[Typography.h4, { color: colors.text }]}>Quick Log</Text>
            <View style={styles.quickGrid}>
              {QUICK_LOG_OPTIONS.map((opt) => {
                const { bg, fg } = healthLogProvider.typeColors(opt.type);
                return (
                  <TouchableOpacity
                    key={opt.type}
                    accessible
                    accessibilityLabel={`${opt.label} quick log, button`}
                    accessibilityRole="button"
                    onPress={() => openAdd(opt.type)}
                    style={[styles.quickButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                    activeOpacity={0.7}>
                    <View style={[styles.quickIcon, { backgroundColor: bg }]}>
                      <MaterialIcons name={opt.icon as any} size={20} color={fg} />
                    </View>
                    <Text style={[Typography.captionBold, { color: colors.text }]} numberOfLines={1}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[Typography.h4, { color: colors.text }]}>Latest by type</Text>
            {QUICK_LOG_OPTIONS.map((opt) => (
              <LatestLogCard
                key={opt.type}
                type={opt.type}
                label={opt.label}
                icon={opt.icon}
                latestLog={healthLogProvider.latestByType[opt.type]}
                onPress={() => openAdd(opt.type)}
                colors={colors}
                typeColorsFn={healthLogProvider.typeColors}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <AppBottomNavBar 
        currentIndex={isPatient ? kPatientNavHealth : kCaregiverNavHome}
        isPatient={isPatient}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topButton: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  addButton: {
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingBottom: 24 },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  latestCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  latestIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  latestContent: { flex: 1 },
  statusChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  progressBarBg: { flex: 1, height: 6, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  addIcon: { marginTop: 4 },
});
