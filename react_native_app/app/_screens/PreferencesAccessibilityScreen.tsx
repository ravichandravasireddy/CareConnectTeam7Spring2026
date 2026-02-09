import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography, AppColors } from '../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

interface PreferencesAccessibilityScreenProps {
  onBack?: () => void;
}

export default function PreferencesAccessibilityScreen({
  onBack,
}: PreferencesAccessibilityScreenProps) {
  const { colorScheme, preference, setPreference, highContrast, setHighContrast, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isDarkMode = colorScheme === 'dark';
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeTouchTargets, setLargeTouchTargets] = useState(true);
  const [boldText, setBoldText] = useState(false);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [language, setLanguage] = useState('English (US)');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);

  const showTextSizeDialog = () => {
    Alert.alert('Text Size', 'Text size adjustment feature coming soon.');
  };

  const showLanguageDialog = () => {
    Alert.alert('Select Language', undefined, [
      { text: 'English (US)', onPress: () => setLanguage('English (US)') },
      { text: 'Spanish', onPress: () => setLanguage('Spanish') },
      { text: 'French', onPress: () => setLanguage('French') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const showTimeFormatDialog = () => {
    Alert.alert('Time Format', undefined, [
      { text: '12-hour', onPress: () => setTimeFormat('12-hour') },
      { text: '24-hour', onPress: () => setTimeFormat('24-hour') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const showDateFormatDialog = () => {
    Alert.alert('Date Format', undefined, [
      { text: 'MM/DD/YYYY', onPress: () => setDateFormat('MM/DD/YYYY') },
      { text: 'DD/MM/YYYY', onPress: () => setDateFormat('DD/MM/YYYY') },
      { text: 'YYYY-MM-DD', onPress: () => setDateFormat('YYYY-MM-DD') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.iconButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Preferences & Accessibility
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SectionHeader title="Display" />
        <SettingTile
          title="Text Size"
          subtitle="Adjust text size for better readability"
          onPress={showTextSizeDialog}
        />
        <SwitchTile
          title="Dark Mode"
          subtitle="Reduce eye strain in low light"
          value={isDarkMode}
          onValueChange={(value) =>
            setPreference(value ? 'dark' : 'light')
          }
        />
        <SwitchTile
          title="High Contrast"
          subtitle="Increase contrast for visibility"
          value={highContrast}
          onValueChange={setHighContrast}
        />

        <SectionHeader title="Accessibility" />
        <SwitchTile
          title="Screen Reader"
          subtitle="Enable voice guidance"
          value={screenReaderEnabled}
          onValueChange={setScreenReaderEnabled}
        />
        <SwitchTile
          title="Reduce Motion"
          subtitle="Minimize animations"
          value={reduceMotion}
          onValueChange={setReduceMotion}
        />
        <SwitchTile
          title="Large Touch Targets"
          subtitle="Increase button sizes (44x44pt minimum)"
          value={largeTouchTargets}
          onValueChange={setLargeTouchTargets}
        />
        <SwitchTile
          title="Bold Text"
          subtitle="Make text easier to read"
          value={boldText}
          onValueChange={setBoldText}
        />

        <SectionHeader title="Notifications" />
        <SwitchTile
          title="Medication Reminders"
          subtitle="Get notified to take medication"
          value={medicationReminders}
          onValueChange={setMedicationReminders}
        />
        <SwitchTile
          title="Task Alerts"
          subtitle="Reminders for scheduled tasks"
          value={taskAlerts}
          onValueChange={setTaskAlerts}
        />
        <SwitchTile
          title="Health Alerts"
          subtitle="Important health notifications"
          value={healthAlerts}
          onValueChange={setHealthAlerts}
        />
        <SwitchTile
          title="Message Notifications"
          subtitle="New messages from caregivers"
          value={messageNotifications}
          onValueChange={setMessageNotifications}
        />

        <SectionHeader title="Language & Region" />
        <SettingTile
          title="Language"
          subtitle={language}
          onPress={showLanguageDialog}
        />
        <SettingTile
          title="Time Format"
          subtitle={timeFormat}
          onPress={showTimeFormatDialog}
        />
        <SettingTile
          title="Date Format"
          subtitle={dateFormat}
          onPress={showDateFormatDialog}
        />

        <SectionHeader title="Privacy & Security" />
        <SwitchTile
          title="Biometric Login"
          subtitle="Use Face ID or Touch ID"
          value={biometricLogin}
          onValueChange={setBiometricLogin}
        />
        <SwitchTile
          title="Data Sharing"
          subtitle="Share data with caregivers"
          value={dataSharing}
          onValueChange={setDataSharing}
        />
        <SettingTile
          title="HIPAA Consent"
          subtitle="View privacy policy"
          onPress={() =>
            Alert.alert('HIPAA Consent', 'Privacy policy viewer coming soon.')
          }
        />

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Saved', 'Preferences saved successfully.')
          }
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Save preferences"
          accessibilityHint="Saves your preferences"
        >
          <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Text style={[styles.sectionHeader, { color: colors.text }]}>{title}</Text>
  );
}

function SettingTile({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tile, { borderColor: colors.border }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      accessibilityHint="Opens selection"
    >
      <View style={styles.tileText}>
        <Text style={[styles.tileTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.tileSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function SwitchTile({
  title,
  subtitle,
  value,
  onValueChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.tile, { borderColor: colors.border }]}>
      <View style={styles.tileText}>
        <Text style={[styles.tileTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.tileSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={AppColors.white}
        accessibilityLabel={title}
        accessibilityHint={subtitle}
      />
    </View>
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
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
    },
    headerTitle: {
      ...Typography.h5,
      flex: 1,
      textAlign: 'center',
    },
    iconButton: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24,
    },
    headerSpacer: {
      width: 48,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    sectionHeader: {
      ...Typography.h6,
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 12,
    },
    tile: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.background,
      minHeight: 64,
    },
    tileText: {
      flex: 1,
      marginRight: 12,
    },
    tileTitle: {
      ...Typography.h6,
      marginBottom: 4,
    },
    tileSubtitle: {
      ...Typography.bodySmall,
    },
    saveButton: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveButtonText: {
      ...Typography.buttonLarge,
    },
  });
