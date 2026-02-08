import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, AppColors } from '../constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type UserRole = 'patient' | 'caregiver';

interface RegistrationScreenProps {
  selectedRole?: UserRole;
  onNavigateBack?: () => void;
  onNavigateToSignIn?: () => void;
  onRegistrationSuccess?: (role: UserRole) => void;
}

export default function RegistrationScreen({
  selectedRole = 'patient',
  onNavigateBack,
  onNavigateToSignIn,
  onRegistrationSuccess,
}: RegistrationScreenProps) {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme] as ThemeColors;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('');
      return true;
    }
    if (value.indexOf('@') === -1) {
      setEmailError('Enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('At least 8 characters required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegistration = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!agreedToTerms) {
      Alert.alert(
        'Terms required',
        'Please agree to the Terms of Service and Privacy Policy.'
      );
      AccessibilityInfo.announceForAccessibility(
        'Please agree to the Terms of Service and Privacy Policy.'
      );
      return;
    }

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
      const errors = [];
      if (emailError) errors.push(emailError);
      if (passwordError) errors.push(passwordError);
      if (confirmPasswordError) errors.push(confirmPasswordError);
      AccessibilityInfo.announceForAccessibility(
        `Form validation failed. ${errors.join('. ')}`
      );
      return;
    }

    setIsLoading(true);

    const defaultFirst = selectedRole === 'caregiver'
      ? 'Caregiver'
      : 'Care Recipient';
    const defaultLast = 'User';
    const defaultEmail = selectedRole === 'caregiver'
      ? 'caregiver.user@careconnect.demo'
      : 'patient.user@careconnect.demo';
    const defaultPhone = '(555) 555-0101';

    const normalizedFirst = firstName.trim() || defaultFirst;
    const normalizedLast = lastName.trim() || defaultLast;
    const normalizedEmail = email.trim() || defaultEmail;
    const normalizedPhone = phone.trim() || defaultPhone;

    setTimeout(() => {
      setIsLoading(false);
      AccessibilityInfo.announceForAccessibility('Registration successful');
      Alert.alert(
        'Account created',
        `Welcome ${normalizedFirst} ${normalizedLast}!\nEmail: ${normalizedEmail}\nPhone: ${normalizedPhone}`
      );
      onRegistrationSuccess?.(selectedRole);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setObscurePassword(!obscurePassword);
    AccessibilityInfo.announceForAccessibility(
      obscurePassword ? 'Password visible' : 'Password hidden'
    );
  };

  const toggleConfirmPasswordVisibility = () => {
    setObscureConfirmPassword(!obscureConfirmPassword);
    AccessibilityInfo.announceForAccessibility(
      obscureConfirmPassword ? 'Confirm password visible' : 'Confirm password hidden'
    );
  };

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
          Create Account
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header copy */}
        <Text style={[styles.title, { color: colors.text }]}>
          Join CareConnect
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Create your account to get started
        </Text>

        {/* First & Last Name */}
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={[styles.label, { color: colors.text }]}>
              First Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={firstName}
              onChangeText={(text: string) => setFirstName(text)}
              placeholder="John"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              editable={!isLoading}
              accessible={true}
              accessibilityLabel="First name"
              accessibilityHint="Enter your first name"
            />
          </View>
          <View style={styles.gutter} />
          <View style={styles.flex}>
            <Text style={[styles.label, { color: colors.text }]}>
              Last Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={lastName}
              onChangeText={(text: string) => setLastName(text)}
              placeholder="Doe"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
              editable={!isLoading}
              accessible={true}
              accessibilityLabel="Last name"
              accessibilityHint="Enter your last name"
            />
          </View>
        </View>

        {/* Email */}
        <Text style={[styles.label, { color: colors.text }]}>
          Email Address
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: emailError ? colors.error : colors.border,
              color: colors.text,
            },
          ]}
          value={email}
          onChangeText={(text: string) => {
            setEmail(text);
            if (emailError) validateEmail(text);
          }}
          onBlur={() => validateEmail(email)}
          placeholder="your.email@example.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          editable={!isLoading}
          accessible={true}
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email address"
        />
        {emailError ? (
          <Text
            style={[styles.errorText, { color: colors.error }]}
            accessible={true}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {emailError}
          </Text>
        ) : null}

        {/* Phone */}
        <Text style={[styles.label, { color: colors.text }]}>
          Phone Number
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={phone}
          onChangeText={(text: string) => setPhone(text)}
          placeholder="(555) 123-4567"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          autoComplete="tel"
          editable={!isLoading}
          accessible={true}
          accessibilityLabel="Phone number"
          accessibilityHint="Enter your phone number"
        />

        {/* Password */}
        <Text style={[styles.label, { color: colors.text }]}>
          Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              {
                backgroundColor: colors.surface,
                borderColor: passwordError ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
              if (confirmPassword) validateConfirmPassword(confirmPassword);
            }}
            onBlur={() => validatePassword(password)}
            placeholder="Create a strong password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={obscurePassword}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            editable={!isLoading}
            accessible={true}
            accessibilityLabel="Password"
            accessibilityHint="Create a strong password"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              obscurePassword ? 'Show password' : 'Hide password'
            }
            accessibilityHint={
              obscurePassword
                ? 'Double tap to show password'
                : 'Double tap to hide password'
            }
          >
            <Ionicons
              name={obscurePassword ? 'eye-off' : 'eye'}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text
            style={[styles.errorText, { color: colors.error }]}
            accessible={true}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {passwordError}
          </Text>
        ) : null}
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          At least 8 characters with letters and numbers
        </Text>

        {/* Confirm Password */}
        <Text style={[styles.label, { color: colors.text }]}>
          Confirm Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              {
                backgroundColor: colors.surface,
                borderColor: confirmPasswordError ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            value={confirmPassword}
            onChangeText={(text: string) => {
              setConfirmPassword(text);
              if (confirmPasswordError) validateConfirmPassword(text);
            }}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            placeholder="Re-enter your password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={obscureConfirmPassword}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            editable={!isLoading}
            accessible={true}
            accessibilityLabel="Confirm password"
            accessibilityHint="Re-enter your password to confirm"
          />
          <TouchableOpacity
            onPress={toggleConfirmPasswordVisibility}
            style={styles.eyeIcon}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              obscureConfirmPassword
                ? 'Show confirm password'
                : 'Hide confirm password'
            }
            accessibilityHint={
              obscureConfirmPassword
                ? 'Double tap to show confirm password'
                : 'Double tap to hide confirm password'
            }
          >
            <Ionicons
              name={obscureConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? (
          <Text
            style={[styles.errorText, { color: colors.error }]}
            accessible={true}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
          >
            {confirmPasswordError}
          </Text>
        ) : null}

        {/* Terms */}
        <View
          style={[
            styles.termsContainer,
            { backgroundColor: colors.primarySoft },
          ]}
        >
          <TouchableOpacity
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            style={styles.checkbox}
            accessible={true}
            accessibilityRole="checkbox"
            accessibilityLabel="Agree to terms and privacy policy"
            accessibilityState={{ checked: agreedToTerms }}
            accessibilityHint="Double tap to toggle agreement"
          >
            <Ionicons
              name={agreedToTerms ? 'checkbox' : 'square-outline'}
              size={24}
              color={agreedToTerms ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
          <View style={styles.termsText}>
            <Text style={[styles.termsBody, { color: colors.text }]}>
              I agree to the{' '}
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Terms of Service', 'Coming soon.')}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Terms of Service"
              accessibilityHint="Opens Terms of Service"
            >
              <Text style={[styles.termsLink, { color: colors.primary }]}>
                Terms of Service
              </Text>
            </TouchableOpacity>
            <Text style={[styles.termsBody, { color: colors.text }]}>
              {' '}and{' '}
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Privacy Policy', 'Coming soon.')}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Privacy Policy"
              accessibilityHint="Opens Privacy Policy"
            >
              <Text style={[styles.termsLink, { color: colors.primary }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={handleRegistration}
          disabled={isLoading}
          style={[
            styles.primaryButton,
            {
              backgroundColor: isLoading ? colors.textSecondary : colors.primary,
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Create account"
          accessibilityHint="Double tap to create your account"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Already have an account */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInPrompt, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={onNavigateToSignIn}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel="Sign in"
            accessibilityHint="Opens sign in screen"
          >
            <Text style={[styles.signInLink, { color: colors.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ThemeColors = {
  [K in keyof typeof Colors.light]: string;
};

const createStyles = (colors: ThemeColors) =>
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
      marginBottom: 8,
    },
    subtitle: {
      ...Typography.bodyLarge,
      marginBottom: 32,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    flex: {
      flex: 1,
    },
    gutter: {
      width: 16,
    },
    label: {
      ...Typography.h6,
      marginBottom: 8,
    },
    input: {
      ...Typography.body,
      height: 56,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 24,
    },
    passwordContainer: {
      position: 'relative',
      marginBottom: 8,
    },
    passwordInput: {
      paddingRight: 56,
      marginBottom: 0,
    },
    eyeIcon: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
    },
    helperText: {
      ...Typography.bodySmall,
      marginBottom: 24,
    },
    errorText: {
      ...Typography.bodySmall,
      marginTop: -16,
      marginBottom: 16,
      marginLeft: 4,
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      borderRadius: 12,
      marginBottom: 32,
    },
    checkbox: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    termsText: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingTop: 4,
    },
    termsBody: {
      ...Typography.body,
    },
    termsLink: {
      ...Typography.body,
      fontWeight: '600',
    },
    primaryButton: {
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    primaryButtonText: {
      ...Typography.buttonLarge,
      color: AppColors.white,
    },
    signInContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 48,
    },
    signInPrompt: {
      ...Typography.body,
    },
    signInLink: {
      ...Typography.body,
      fontWeight: '600',
    },
  });
