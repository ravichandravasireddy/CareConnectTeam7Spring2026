import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type UserRole = 'patient' | 'caregiver';

interface RoleSelectionScreenProps {
  onNavigateBack?: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export default function RoleSelectionScreen({
  onNavigateBack,
  onSelectRole,
}: RoleSelectionScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onNavigateBack}
          style={styles.backButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Select Your Role
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          How will you use{'\n'}CareConnect?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select the option that best describes you
        </Text>

        <RoleCard
          iconName="heart"
          iconColor={colors.primary}
          iconBackground={colors.primarySoft}
          title="Care Recipient"
          description="I'm managing my\nown health and tasks"
          onPress={() => onSelectRole?.('patient')}
        />

        <RoleCard
          iconName="people"
          iconColor={colors.accent}
          iconBackground={colors.accentSoft}
          title="Caregiver"
          description="I'm caring for one or\nmore people"
          onPress={() => onSelectRole?.('caregiver')}
        />

        <View
          style={[
            styles.infoBox,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="You can change this later in your account settings"
        >
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            You can change this later in your account settings
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface RoleCardProps {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBackground: string;
  title: string;
  description: string;
  onPress: () => void;
}

function RoleCard({
  iconName,
  iconColor,
  iconBackground,
  title,
  description,
  onPress,
}: RoleCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.roleCard, { borderColor: colors.border }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description.replace('\n', ' ')}`}
      accessibilityHint="Double tap to select this role"
    >
      <View style={[styles.roleIcon, { backgroundColor: iconBackground }]}>
        <Ionicons name={iconName} size={32} color={iconColor} />
      </View>
      <View style={styles.roleText}>
        <Text style={[styles.roleTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.roleDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={28}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    backButton: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24,
    },
    headerTitle: {
      ...Typography.h5,
      flex: 1,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 48,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 40,
    },
    title: {
      ...Typography.h2,
      lineHeight: 34,
      marginBottom: 12,
    },
    subtitle: {
      ...Typography.bodyLarge,
      marginBottom: 32,
    },
    roleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderRadius: 16,
      borderWidth: 1.5,
      backgroundColor: colors.background,
      marginBottom: 16,
      minHeight: 96,
    },
    roleIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    roleText: {
      flex: 1,
      marginLeft: 16,
    },
    roleTitle: {
      ...Typography.h5,
      marginBottom: 4,
    },
    roleDescription: {
      ...Typography.bodySmall,
      lineHeight: 18,
    },
    infoBox: {
      marginTop: 16,
      padding: 20,
      borderRadius: 12,
      borderWidth: 1,
    },
    infoText: {
      ...Typography.bodySmall,
      textAlign: 'center',
    },
  });
