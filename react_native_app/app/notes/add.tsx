// =============================================================================
// NOTES ADD SCREEN (AddNoteScreen)
// =============================================================================
// Form to create a new Note (title, body, category). On save, add via
// NoteProvider.addNote and go back. Author placeholder until auth is wired.
// =============================================================================

import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useNoteProvider } from '../../providers/NoteProvider';
import { Note, NoteCategory, formatNoteCategoryDisplay } from '../../models/Note';
import { Typography } from '../../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

const kCurrentUserAuthor = 'Sarah Johnson (Caregiver)';

const NOTE_CATEGORIES = [NoteCategory.medication, NoteCategory.exercise, NoteCategory.appointment];

export default function AddNoteScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const noteProvider = useNoteProvider();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NoteCategory>(NoteCategory.medication);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const validate = (): boolean => {
    const t = title.trim();
    const b = body.trim();
    const e: { title?: string; body?: string } = {};
    if (!t) e.title = 'Enter a title';
    if (!b) e.body = 'Enter note content';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const note: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      author: kCurrentUserAuthor,
      createdAt: new Date(),
      category,
    };
    noteProvider.addNote(note);
    router.back();
  };

  const inputStyle = (field: 'title' | 'body') => [
    styles.input,
    { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text },
    errors[field] ? { borderColor: colors.error } : undefined,
  ];

  return (
    <>
      <AppAppBar
        title="New Note"
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
              accessibilityLabel="Save, button"
              accessibilityRole="button"
              onPress={save}
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}>
              <Text style={[Typography.buttonLarge, { color: colors.onPrimary }]}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={[Typography.captionBold, { color: colors.textSecondary, marginBottom: 8 }]}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Medication Side Effects"
              placeholderTextColor={colors.textSecondary}
              style={inputStyle('title')}
            />
            {errors.title ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.title}</Text> : null}

            <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Note</Text>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Write your note here…"
              placeholderTextColor={colors.textSecondary}
              style={[inputStyle('body'), styles.bodyInput]}
              multiline
              numberOfLines={6}
            />
            {errors.body ? <Text style={[Typography.caption, { color: colors.error }]}>{errors.body}</Text> : null}

            <Text style={[Typography.captionBold, { color: colors.textSecondary, marginTop: 16, marginBottom: 8 }]}>Category</Text>
            <View style={styles.categoryRow}>
              {NOTE_CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.categoryChip,
                    { borderColor: colors.border, backgroundColor: category === c ? colors.primarySoft : colors.surface },
                  ]}>
                  <Text style={[Typography.bodySmall, { color: category === c ? colors.primary : colors.text }]}>
                    {formatNoteCategoryDisplay(c)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  bodyInput: { minHeight: 120, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
});
