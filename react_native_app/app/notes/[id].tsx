// =============================================================================
// NOTE DETAIL SCREEN
// =============================================================================
// Read-only full view of a note by noteId from NoteProvider.getById.
// Shows title, body, author, category, and formatted date. Handles missing note.
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { AppAppBar } from '@/components/app-app-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNoteProvider } from '../../providers/NoteProvider';
import { formatNoteCategoryDisplay } from '../../models/Note';
import { Typography } from '../../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';


// Format note time: "MMM d, y • h:mm AM/PM"
const formatNoteDetailTime = (createdAt: Date): string => {
  const dateStr = createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = createdAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} • ${timeStr}`;
};

export default function NoteDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteProvider = useNoteProvider();

  const note = id ? noteProvider.getById(id) : undefined;

  if (!note) {
    return (
      <>
        <AppAppBar
          title="Note"
          showMenuButton={false}
          useBackButton={true}
          showNotificationButton={false}
        />
        <SafeAreaView
          style={[detailStyles.container, { backgroundColor: colors.surface }]}
          edges={['bottom']}>
          <View style={detailStyles.errorContainer}>
            <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
              Note not found
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const categoryColors = noteProvider.categoryColors(note.category);
  const timeLabel = formatNoteDetailTime(note.createdAt);

  return (
    <>
      <AppAppBar
        title={note.title}
        showMenuButton={false}
        useBackButton={true}
        showNotificationButton={false}
      />
      <SafeAreaView
        style={[detailStyles.container, { backgroundColor: colors.surface }]}
        edges={['bottom']}>
        <ScrollView
          contentContainerStyle={detailStyles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={detailStyles.headerSection}>
            <View
              style={[
                detailStyles.iconContainer,
                { backgroundColor: categoryColors.bg },
              ]}>
              <MaterialIcons
                name="description"
                size={26}
                color={categoryColors.fg}
              />
            </View>
            <View style={detailStyles.metadataContainer}>
              <Text
                style={[Typography.bodySmall, { color: colors.textSecondary }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {note.author}
              </Text>
              <Text
                style={[
                  Typography.bodySmall,
                  { color: colors.textSecondary },
                  detailStyles.timeText,
                ]}>
                {timeLabel}
              </Text>
            </View>
          </View>

          <View
            style={[
              detailStyles.categoryChip,
              { backgroundColor: categoryColors.bg },
            ]}>
            <Text
              style={[
                Typography.captionBold,
                { color: categoryColors.fg },
              ]}>
              {formatNoteCategoryDisplay(note.category).toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              detailStyles.bodyContainer,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}>
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.text },
                detailStyles.bodyText,
              ]}>
              {note.body}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  metadataContainer: {
    flex: 1,
  },
  timeText: {
    marginTop: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  bodyContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  bodyText: {
    lineHeight: 27, // 1.5 * 18px (bodyLarge fontSize)
  },
});
