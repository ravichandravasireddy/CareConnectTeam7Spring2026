// =============================================================================
// HEALTH LOG ADD SCREEN
// =============================================================================
// Form to create a new HealthLog; initialType from params. On save, add via
// HealthLogProvider.addLog and go back.
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppAppBar } from '@/components/app-app-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHealthLogProvider } from '../../providers/HealthLogProvider';
import {
  HealthLog,
  HealthLogType,
  formatHealthLogTypeDisplay,
} from '../../models/HealthLog';
import { DEFAULT_WATER_GOAL_OZ } from '../../providers/HealthLogProvider';
import { Typography } from '../../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

const HEALTH_LOG_TYPES = [
  HealthLogType.mood,
  HealthLogType.symptoms,
  HealthLogType.meals,
  HealthLogType.water,
  HealthLogType.exercise,
  HealthLogType.sleep,
  HealthLogType.bloodPressure,
  HealthLogType.heartRate,
  HealthLogType.general,
];

const MOOD_OPTIONS: { label: string; emoji: string }[] = [
  { label: 'Ecstatic', emoji: '🤩' },
  { label: 'Happy', emoji: '😊' },
  { label: 'Okay', emoji: '🙂' },
  { label: 'Low', emoji: '😕' },
  { label: 'Depressed', emoji: '😞' },
];

function hintForType(type: HealthLogType): string {
  switch (type) {
    case HealthLogType.meals: return 'What did you eat today?';
    case HealthLogType.symptoms: return 'What symptoms did you notice?';
    case HealthLogType.exercise: return 'What activity did you do today?';
    case HealthLogType.general: return 'Add a general note';
    default: return 'Add details';
  }
}

export default function HealthLogAddScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ initialType?: string }>();
  const healthLogProvider = useHealthLogProvider();

  const rawType = params.initialType ?? 'general';
  const initialType = HEALTH_LOG_TYPES.includes(rawType as HealthLogType) ? (rawType as HealthLogType) : HealthLogType.general;
  const [type, setType] = useState<HealthLogType>(initialType);
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [moodIndex, setMoodIndex] = useState(1);
  const [waterDelta, setWaterDelta] = useState('');
  const [sleepHours, setSleepHours] = useState(7);
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRateBpm, setHeartRateBpm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setType(initialType);
  }, [initialType]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (type === HealthLogType.mood) {
      // no required fields
    } else if (type === HealthLogType.water) {
      if (!waterDelta.trim()) e.waterDelta = 'Enter an amount';
      else if (isNaN(Number(waterDelta))) e.waterDelta = 'Enter a number';
    } else if (type === HealthLogType.bloodPressure) {
      if (!systolic.trim()) e.systolic = 'Required';
      else if (isNaN(Number(systolic))) e.systolic = 'Enter a number';
      if (!diastolic.trim()) e.diastolic = 'Required';
      else if (isNaN(Number(diastolic))) e.diastolic = 'Enter a number';
    } else if (type === HealthLogType.heartRate) {
      if (!heartRateBpm.trim()) e.heartRateBpm = 'Enter bpm';
      else if (isNaN(Number(heartRateBpm))) e.heartRateBpm = 'Enter a number';
    } else if (type !== HealthLogType.sleep) {
      if (!description.trim()) e.description = type === HealthLogType.general ? 'Enter a description' : 'Enter a description';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const now = new Date();
    const id = now.getTime().toString();
    const noteVal = note.trim() || null;

    if (type === HealthLogType.mood) {
      const mood = MOOD_OPTIONS[moodIndex] ?? MOOD_OPTIONS[1];
      const log: HealthLog = {
        id,
        type: HealthLogType.mood,
        description: mood.label,
        createdAt: now,
        emoji: mood.emoji,
        note: noteVal,
      };
      healthLogProvider.addLog(log);
      router.back();
      return;
    }

    if (type === HealthLogType.water) {
      const delta = Number(waterDelta);
      const currentTotal = healthLogProvider.waterTotalForDate(now);
      const newTotal = Math.max(0, currentTotal + delta);
      const desc = delta >= 0
        ? `Added ${delta.toFixed(0)} oz. Total ${newTotal.toFixed(0)} oz`
        : `Removed ${Math.abs(delta).toFixed(0)} oz. Total ${newTotal.toFixed(0)} oz`;
      const log: HealthLog = {
        id,
        type: HealthLogType.water,
        description: desc,
        createdAt: now,
        note: noteVal,
        waterTotal: newTotal,
        waterDelta: delta,
        waterGoal: DEFAULT_WATER_GOAL_OZ,
      };
      healthLogProvider.addLog(log);
      router.back();
      return;
    }

    if (type === HealthLogType.bloodPressure) {
      const sys = Number(systolic);
      const dia = Number(diastolic);
      const log: HealthLog = {
        id,
        type: HealthLogType.bloodPressure,
        description: `Blood Pressure: ${sys}/${dia} mmHg`,
        createdAt: now,
        note: noteVal,
        systolic: sys,
        diastolic: dia,
      };
      healthLogProvider.addLog(log);
      router.back();
      return;
    }

    if (type === HealthLogType.heartRate) {
      const bpm = Number(heartRateBpm);
      const log: HealthLog = {
        id,
        type: HealthLogType.heartRate,
        description: `Heart Rate: ${bpm} bpm`,
        createdAt: now,
        note: noteVal,
        heartRateBpm: bpm,
      };
      healthLogProvider.addLog(log);
      router.back();
      return;
    }

    const computedDescription = type === HealthLogType.sleep
      ? `Slept ${sleepHours.toFixed(1)} hours`
      : description.trim();
    const log: HealthLog = {
      id,
      type,
      description: computedDescription,
      createdAt: now,
      note: noteVal,
      sleepHours: type === HealthLogType.sleep ? sleepHours : undefined,
    };
    healthLogProvider.addLog(log);
    router.back();
  };

  const inputStyle = (field: string) => [
    styles.input,
    { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
    errors[field] ? { borderColor: colors.error } : undefined,
  ];

  return (
    <>
      <AppAppBar
        title="New Health Log"
        showMenuButton={false}
        useBackButton={true}
        showNotificationButton={false}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}>
          <View style={styles.topButton}>
            <TouchableOpacity
              accessible
              accessibilityLabel="Save Log, button"
              accessibilityRole="button"
              onPress={save}
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}>
              <Text style={[Typography.buttonLarge, { color: colors.onPrimary }]}>Save Log</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={[Typography.captionBold, { color: colors.textSecondary, marginBottom: 8 }]}>Log Type</Text>
            <View style={styles.typeRow}>
              {HEALTH_LOG_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.typeChip,
                    { borderColor: colors.border, backgroundColor: type === t ? colors.primarySoft : colors.surface },
                  ]}>
                  <Text style={[Typography.captionBold, { color: type === t ? colors.primary : colors.text }]} numberOfLines={1}>
                    {formatHealthLogTypeDisplay(t)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {type === HealthLogType.mood && (
              <>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Mood</Text>
                <View style={styles.moodRow}>
                  {MOOD_OPTIONS.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setMoodIndex(i)}
                      style={[
                        styles.moodChip,
                        { borderColor: colors.border, backgroundColor: moodIndex === i ? colors.primarySoft : colors.surface },
                      ]}>
                      <Text style={[Typography.bodySmall, { color: moodIndex === i ? colors.primary : colors.text }]}>{m.emoji} {m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Add note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add details about your mood"
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('note')}
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            {type === HealthLogType.water && (
              <>
                <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 16 }]}>
                  Current total: {healthLogProvider.waterTotalForDate(new Date()).toFixed(0)} oz
                </Text>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 12, marginBottom: 8 }]}>Add (or subtract) ounces</Text>
                <TextInput
                  value={waterDelta}
                  onChangeText={setWaterDelta}
                  placeholder="e.g. 12 or -8"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  style={inputStyle('waterDelta')}
                />
                {errors.waterDelta ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.waterDelta}</Text> : null}
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a quick note"
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('note')}
                  multiline
                />
              </>
            )}

            {type === HealthLogType.bloodPressure && (
              <>
                <View style={styles.row}>
                  <View style={styles.half}>
                    <Text style={[Typography.captionBold, { color: colors.textSecondary, marginBottom: 8 }]}>Systolic (upper)</Text>
                    <TextInput
                      value={systolic}
                      onChangeText={setSystolic}
                      placeholder="120"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      style={inputStyle('systolic')}
                    />
                    {errors.systolic ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.systolic}</Text> : null}
                  </View>
                  <View style={styles.half}>
                    <Text style={[Typography.captionBold, { color: colors.textSecondary, marginBottom: 8 }]}>Diastolic (lower)</Text>
                    <TextInput
                      value={diastolic}
                      onChangeText={setDiastolic}
                      placeholder="80"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="numeric"
                      style={inputStyle('diastolic')}
                    />
                    {errors.diastolic ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.diastolic}</Text> : null}
                  </View>
                </View>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add context (e.g. before medication)"
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('note')}
                  multiline
                />
              </>
            )}

            {type === HealthLogType.heartRate && (
              <>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Heart rate (bpm)</Text>
                <TextInput
                  value={heartRateBpm}
                  onChangeText={setHeartRateBpm}
                  placeholder="72"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  style={inputStyle('heartRateBpm')}
                />
                {errors.heartRateBpm ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.heartRateBpm}</Text> : null}
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="e.g. resting, after exercise"
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('note')}
                  multiline
                />
              </>
            )}

            {type === HealthLogType.sleep && (
              <>
                <Text style={[Typography.bodySmall, { color: colors.textSecondary, marginTop: 16 }]}>
                  Sleep duration: {sleepHours.toFixed(1)} hours
                </Text>
                <View style={styles.sliderRow}>
                  <Text style={[Typography.captionBold, { color: colors.text }]}>0</Text>
                  <View style={styles.sliderTrack}>
                    <View
                      style={[styles.sliderFill, { backgroundColor: colors.primary, width: `${(sleepHours / 12) * 100}%` }]}
                    />
                  </View>
                  <Text style={[Typography.captionBold, { color: colors.text }]}>12</Text>
                </View>
                <View style={styles.sliderButtons}>
                  {[0, 4, 6, 7, 8, 9, 10, 12].map((h) => (
                    <TouchableOpacity
                      key={h}
                      onPress={() => setSleepHours(h)}
                      style={[styles.sliderBtn, { backgroundColor: sleepHours === h ? colors.primary : colors.border }]}>
                      <Text style={[Typography.captionBold, { color: sleepHours === h ? colors.onPrimary : colors.text }]}>{h}h</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="How did you sleep?"
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('note')}
                  multiline
                />
              </>
            )}

            {type !== HealthLogType.mood &&
             type !== HealthLogType.water &&
             type !== HealthLogType.sleep &&
             type !== HealthLogType.bloodPressure &&
             type !== HealthLogType.heartRate && (
              <>
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder={hintForType(type)}
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('description')}
                  multiline
                  numberOfLines={3}
                />
                {errors.description ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.description}</Text> : null}
                <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Note (optional)</Text>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note"
                  placeholderTextColor={colors.textSecondary}
                  style={inputStyle('note')}
                  multiline
                />
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboard: { flex: 1 },
  closeBtn: { padding: 12, minWidth: 48, minHeight: 48, justifyContent: 'center' },
  topButton: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  saveButton: {
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    fontSize: 16,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 16 },
  half: { flex: 1 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  sliderTrack: { flex: 1, height: 8, backgroundColor: '#ccc', borderRadius: 4, overflow: 'hidden' },
  sliderFill: { height: '100%', borderRadius: 4 },
  sliderButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  sliderBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
});
