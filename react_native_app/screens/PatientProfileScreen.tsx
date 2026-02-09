import { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Typography, AppColors } from '../constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { useUser } from '@/providers/UserProvider';
import { AppAppBar } from '@/components/app-app-bar';
import { AppBottomNavBar, kPatientNavProfile, kCaregiverNavHome } from '@/components/app-bottom-nav-bar';

interface PatientProfileScreenProps {
  onBack?: () => void;
  onPreferencesPress?: () => void;
  onSignOut?: () => void;
}

export default function PatientProfileScreen({
  onBack,
  onPreferencesPress,
  onSignOut,
}: PatientProfileScreenProps) {
  const { colors } = useTheme();
  const { userRole, isPatient, userName, userEmail } = useUser();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Get role-based defaults matching Flutter app
  const displayName = userName ?? (isPatient ? 'Robert Williams' : 'Dr. Sarah Johnson');
  const displayEmail = userEmail ?? (isPatient ? 'robert.w@email.com' : 'sarah.johnson@careconnect.demo');
  const profileId = isPatient ? 'Patient ID: #RW-2847' : 'Caregiver ID: #SJ-1024';
  const ageValue = isPatient ? '67 years' : '41 years';
  const phoneValue = isPatient ? '(555) 123-4567' : '(555) 555-0183';
  const addressValue = isPatient
    ? '742 Evergreen Terrace\nSpringfield, IL 62701'
    : '1250 Health Ave\nRochester, NY 14620';
  const conditionsValue = isPatient ? 'Diabetes, Hypertension' : 'Primary Care';
  const allergiesValue = isPatient ? 'Penicillin, Shellfish' : 'N/A';
  const primaryProviderLabel = isPatient ? 'Primary Care Provider' : 'Care Team Lead';
  const primaryProviderValue = isPatient ? 'Dr. Sarah Johnson' : 'Dr. Avery Chen';
  const emergencyContactValue = isPatient
    ? 'Mary Smith (Daughter)\n(555) 987-6543'
    : 'Operations Desk\n(555) 555-0199';

  const initials = getInitials(displayName);

  return (
    <View style={styles.container}>
      <AppAppBar
        title="Profile"
        showMenuButton={false}
        useBackButton={true}
        showNotificationButton={false}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.avatarText, { color: AppColors.white }]}>
              {initials}
            </Text>
          </View>
          <Text style={[styles.nameText, { color: colors.text }]}>
            {userName}
          </Text>
          <Text style={[styles.idText, { color: colors.textSecondary }]}>
            Patient ID: #RW-2847
          </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Edit Profile', 'Edit profile feature coming soon.')
            }
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            accessibilityHint="Opens edit profile"
          >
            <Text style={[styles.editButtonText, { color: colors.onPrimary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Personal Information */}
        <SectionHeader title="Personal Information" />
        <InfoItem label="Age" value={ageValue} />
        {isPatient && <InfoItem label="Blood Type" value="A+" />}
        <InfoItem label="Email" value={displayEmail} />
        <InfoItem label="Phone" value={phoneValue} />
        <InfoItem label="Address" value={addressValue} />

        <View style={styles.divider} />

        {/* Medical Information */}
        <SectionHeader title="Medical Information" />
        <InfoItem label="Conditions" value={conditionsValue} />
        <InfoItem label="Allergies" value={allergiesValue} />
        <InfoItem label={primaryProviderLabel} value={primaryProviderValue} />
        <InfoItem label="Emergency Contact" value={emergencyContactValue} />

        <View style={styles.divider} />

        {/* Account Settings */}
        <SectionHeader title="Account Settings" />
        <SettingItem
          iconName="settings-outline"
          iconColor={colors.primary}
          label="Preferences & Accessibility"
          onPress={onPreferencesPress}
        />
        <SettingItem
          iconName="notifications-outline"
          iconColor={colors.accent}
          label="Notification Settings"
          onPress={() =>
            Alert.alert('Notification Settings', 'Coming soon.')
          }
        />
        {isPatient && (
          <SettingItem
            iconName="people-outline"
            iconColor={AppColors.success700}
            label="Connected Caregivers"
            onPress={() =>
              Alert.alert('Connected Caregivers', 'Coming soon.')
            }
          />
        )}

        <TouchableOpacity
          onPress={() => {
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign Out',
                style: 'destructive',
                onPress: () => onSignOut?.(),
              },
            ]);
          }}
          style={[styles.signOutButton, { borderColor: colors.error }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          accessibilityHint="Signs you out of CareConnect"
        >
          <Text style={[styles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <AppBottomNavBar 
        currentIndex={isPatient ? kPatientNavProfile : kCaregiverNavHome}
        isPatient={isPatient}
      />
      </SafeAreaView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Text style={[styles.sectionHeader, { color: colors.text }]}>
      {title}
    </Text>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.infoItem, { borderColor: colors.border }]}>
      <View style={styles.infoText}>
        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </View>
  );
}

function SettingItem({
  iconName,
  iconColor,
  label,
  onPress,
}: {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  label: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.infoItem, { borderColor: colors.border }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Opens this setting"
    >
      <View style={styles.settingIcon}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + '1A' }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
      </View>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) {
    const part = parts[0];
    return part.length >= 2 ? part.slice(0, 2).toUpperCase() : part.toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 24,
    },
    profileHeader: {
      alignItems: 'center',
      padding: 24,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      ...Typography.h2,
    },
    nameText: {
      ...Typography.h5,
      marginBottom: 4,
    },
    idText: {
      ...Typography.bodySmall,
      marginBottom: 16,
    },
    editButton: {
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 24,
    },
    editButtonText: {
      ...Typography.buttonMedium,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    sectionHeader: {
      ...Typography.h6,
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 12,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.background,
    },
    infoText: {
      flex: 1,
    },
    infoLabel: {
      ...Typography.bodySmall,
      marginBottom: 4,
    },
    infoValue: {
      ...Typography.h6,
    },
    settingIcon: {
      marginRight: 16,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingLabel: {
      ...Typography.h6,
      flex: 1,
    },
    signOutButton: {
      marginHorizontal: 16,
      marginTop: 8,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    signOutText: {
      ...Typography.buttonLarge,
    },
  });
