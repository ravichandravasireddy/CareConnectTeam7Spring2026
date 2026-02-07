// =============================================================================
// NOTES SCREEN
// =============================================================================
// List of notes from NoteProvider; tap opens NoteDetailScreen.
// Uses formatNoteTime for list item timestamps. Notes sorted by createdAt descending.
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNoteProvider } from '../../providers/NoteProvider';
import { Note, formatNoteCategoryDisplay } from '../../models/Note';
import { Colors, Typography, AppColors } from '../../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type ThemeColors = typeof Colors.light | typeof Colors.dark;

// Format note time: "Today, 10:30 AM", "Yesterday, 5:15 PM", or "Jan 22, 3:30 PM"
const formatNoteTime = (createdAt: Date): string => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
  const date = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
  const year = createdAt.getFullYear();

  if (date.getTime() === todayStart.getTime()) {
    return `Today, ${createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else if (date.getTime() === yesterdayStart.getTime()) {
    return `Yesterday, ${createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else if (year === now.getFullYear()) {
    return createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  } else {
    return `${createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
};

interface NoteListTileProps {
  note: Note;
  timeLabel: string;
  onPress: () => void;
  colors: ThemeColors;
  categoryColors: { bg: string; fg: string };
}

const NoteListTile: React.FC<NoteListTileProps> = ({
  note,
  timeLabel,
  onPress,
  colors,
  categoryColors,
}) => {
  const preview = note.body.length > 60 ? `${note.body.substring(0, 60)}…` : note.body;
  const semanticsLabel = `${note.title}, ${preview}, by ${note.author}, ${timeLabel}`;

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={semanticsLabel}
      accessibilityHint="Tap to open note"
      accessibilityRole="button"
      onPress={onPress}
      style={[notesStyles.noteCard, { borderColor: colors.border }]}
      activeOpacity={0.7}>
      <View style={notesStyles.noteContent}>
        <View
          style={[
            notesStyles.iconContainer,
            { backgroundColor: categoryColors.bg },
          ]}>
          <MaterialIcons name="description" size={22} color={categoryColors.fg} />
        </View>
        <View style={notesStyles.textContainer}>
          <View style={notesStyles.titleRow}>
            <Text
              style={[Typography.h6, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {note.title}
            </Text>
            <Text
              style={[Typography.bodySmall, { color: colors.textSecondary }]}>
              {timeLabel}
            </Text>
          </View>
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
              notesStyles.previewText,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {preview}
          </Text>
          <View style={[notesStyles.categoryChip, { backgroundColor: categoryColors.bg }]}>
            <Text
              style={[
                Typography.captionBold,
                { color: categoryColors.fg },
              ]}>
              {formatNoteCategoryDisplay(note.category).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function NotesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const noteProvider = useNoteProvider();

  const handleNotePress = (note: Note) => {
    router.push(`/notes/${note.id}` as any);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notes',
          headerShown: true,
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
        }}
      />
      <SafeAreaView
        style={[notesStyles.container, { backgroundColor: colors.surface }]}
        edges={['bottom']}>
        <View style={notesStyles.content}>
          <View style={notesStyles.buttonContainer}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Add New Note, button"
              accessibilityRole="button"
              onPress={() => router.push('/notes/add' as any)}
              style={[
                notesStyles.addButton,
                { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}>
              <MaterialIcons name="add" size={22} color={AppColors.white} />
              <Text
                style={[
                  Typography.buttonLarge,
                  { color: AppColors.white },
                  notesStyles.addButtonText,
                ]}>
                Add New Note
              </Text>
            </TouchableOpacity>
          </View>
          {noteProvider.notes.length === 0 ? (
            <View style={notesStyles.emptyState}>
              <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
                No notes yet.
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={notesStyles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {noteProvider.notes.map((note) => (
                <NoteListTile
                  key={note.id}
                  note={note}
                  timeLabel={formatNoteTime(note.createdAt)}
                  onPress={() => handleNotePress(note)}
                  colors={colors}
                  categoryColors={noteProvider.categoryColors(note.category)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const notesStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    marginLeft: 0,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noteCard: {
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: 12,
    minHeight: 64,
    overflow: 'hidden',
  },
  noteContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  previewText: {
    marginTop: 6,
    marginBottom: 8,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
