// =============================================================================
// HEALTH TIMELINE SCREEN
// =============================================================================
// Unified timeline of health logs, notes, and completed tasks. Data from
// useHealthTimelineEvents(); rebuilds when HealthLog, Note, or Task providers
// change. Empty state shows message; otherwise vertical timeline with cards.
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useHealthTimelineEvents } from '../hooks/useHealthTimelineEvents';
import { TimelineEvent } from '../models/TimelineEvent';
import { Colors, Typography } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';

type ThemeColors = typeof Colors.light | typeof Colors.dark;

function formatTimelineTimestamp(dateTime: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const eventDate = new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
  const timeStr = dateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (eventDate.getTime() === today.getTime()) return `Today, ${timeStr}`;
  if (eventDate.getTime() === yesterday.getTime()) return `Yesterday, ${timeStr}`;
  if (dateTime.getFullYear() === now.getFullYear()) {
    const dateStr = dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dateStr}, ${timeStr}`;
  }
  const fullDate = dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fullDate}, ${timeStr}`;
}

function TimelineItem({
  event,
  colors,
}: {
  event: TimelineEvent;
  colors: ThemeColors;
}) {
  const ts = event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp);
  const timeLabel = formatTimelineTimestamp(ts);

  return (
    <View style={styles.itemRow}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: event.iconBackground, borderColor: colors.surface },
        ]}>
        <MaterialIcons name={event.icon as any} size={24} color={event.iconColor} />
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleWrap}>
            <Text style={[Typography.h6, { color: colors.text }]} numberOfLines={2}>
              {event.title}
            </Text>
          </View>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
            {timeLabel}
          </Text>
        </View>
        {event.subtitle != null && event.subtitle !== '' && (
          <Text
            style={[Typography.bodySmall, { color: colors.text }]}
            numberOfLines={4}>
            {event.subtitle}
          </Text>
        )}
        {event.statusLabel != null && event.statusLabel !== '' && (
          <View style={[styles.statusChip, { backgroundColor: colors.secondarySoft }]}>
            <Text style={[Typography.captionBold, { color: colors.text }]}>
              {event.statusLabel}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function HealthTimelineScreen() {
  const colorScheme = useColorScheme();
  const themeKey = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[themeKey];
  const events = useHealthTimelineEvents();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Health Timeline',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              style={[Typography.bodySmall, { color: colors.textSecondary }]}
              textAlign="center">
              No timeline events yet. Add health logs, notes, or complete tasks to see them here.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
            <View style={styles.timelineItems}>
              {events.map((event) => (
                <View key={event.id} style={styles.itemWrap}>
                  <TimelineItem event={event} colors={colors} />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  timelineLine: {
    position: 'absolute',
    left: 23,
    top: 24,
    bottom: 24,
    width: 2,
  },
  timelineItems: {},
  itemWrap: { marginBottom: 24 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleWrap: { flex: 1, marginRight: 8 },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
