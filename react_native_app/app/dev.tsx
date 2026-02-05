// =============================================================================
// DEV SCREEN
// =============================================================================
// Temporary screen with links to components being worked on.
// This is for development purposes only.
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ComponentLink {
  title: string;
  route: string;
  description?: string;
  icon?: string;
}

const COMPONENT_LINKS: ComponentLink[] = [
  {
    title: 'Calendar',
    route: '/calendar',
    description: 'Month calendar with task scheduling',
    icon: 'calendar-today',
  },
  {
    title: 'Notifications',
    route: '/notifications',
    description: 'View and manage notifications',
    icon: 'notifications',
  },
  {
    title: 'Notes',
    route: '/notes',
    description: 'View caregiver and patient notes',
    icon: 'description',
  },
  // Add more component links here as you create them
  // {
  //   title: 'Task Details',
  //   route: '/task-details',
  //   description: 'View and edit task details',
  //   icon: 'task',
  // },
];

export default function DevScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const styles = createStyles(colors);

  const handleLinkPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[Typography.h2, { color: colors.text }]}>
            Component Links
          </Text>
          <Text style={[Typography.bodySmall, { color: colors.textSecondary }]}>
            Development screen - temporary
          </Text>
        </View>

        <View style={styles.linksContainer}>
          {COMPONENT_LINKS.map((link, index) => (
            <TouchableOpacity
              key={index}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Navigate to ${link.title}`}
              accessibilityHint={link.description}
              onPress={() => handleLinkPress(link.route)}
              style={[styles.linkCard, { borderColor: colors.border }]}
              activeOpacity={0.7}>
              <View style={styles.linkContent}>
                {link.icon && (
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: colors.primarySoft },
                    ]}>
                    <MaterialIcons
                      name={link.icon as any}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                )}
                <View style={styles.linkTextContainer}>
                  <Text style={[Typography.h6, { color: colors.text }]}>
                    {link.title}
                  </Text>
                  {link.description && (
                    <Text
                      style={[Typography.bodySmall, { color: colors.textSecondary }]}>
                      {link.description}
                    </Text>
                  )}
                </View>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {COMPONENT_LINKS.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              No components added yet. Add links in app/dev.tsx
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light | typeof Colors.dark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    linksContainer: {
      gap: 12,
    },
    linkCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.background,
      minHeight: 64,
    },
    linkContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    linkTextContainer: {
      flex: 1,
    },
    emptyState: {
      padding: 24,
      alignItems: 'center',
    },
  });
