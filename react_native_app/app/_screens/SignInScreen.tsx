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
import { Typography, AppColors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import { useUser, UserRole } from '@/providers/UserProvider';

interface SignInScreenProps {
  onNavigateToRegistration?: () => void;
  onNavigateBack?: () => void;
  onSignInSuccess?: (role: UserRole) => void;
}

// Mock credentials matching Flutter app
const MOCK_PATIENT_EMAIL = 'patient@careconnect.demo';
const MOCK_CAREGIVER_EMAIL = 'caregiver@careconnect.demo';
const MOCK_PASSWORD = 'password123';

export default function SignInScreen({
  onNavigateToRegistration,
  onNavigateBack,
  onSignInSuccess,
}: SignInScreenProps) {
  const { colors } = useTheme();
  const { setUserRole, setUserInfo } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
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
    setPasswordError('');
    return true;
  };

  const handleSignIn = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      // Announce validation errors to screen reader
      const errors = [];
      if (emailError) errors.push(emailError);
      if (passwordError) errors.push(passwordError);
      AccessibilityInfo.announceForAccessibility(
        `Form validation failed. ${errors.join('. ')}`
      );
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      // Check demo credentials
      if (normalizedEmail === MOCK_PATIENT_EMAIL && normalizedPassword === MOCK_PASSWORD) {
        // Sign in as patient
        setUserRole('patient');
        setUserInfo('Robert Williams', normalizedEmail);
        AccessibilityInfo.announceForAccessibility('Sign in successful as patient');
        onSignInSuccess?.('patient');
      } else if (normalizedEmail === MOCK_CAREGIVER_EMAIL && normalizedPassword === MOCK_PASSWORD) {
        // Sign in as caregiver
        setUserRole('caregiver');
        setUserInfo('Dr. Sarah Johnson', normalizedEmail);
        AccessibilityInfo.announceForAccessibility('Sign in successful as caregiver');
        onSignInSuccess?.('caregiver');
      } else {
        // Invalid credentials
        setPasswordError('Invalid email or password');
        AccessibilityInfo.announceForAccessibility('Sign in failed. Invalid email or password');
        Alert.alert('Sign In Failed', 'Invalid email or password. Please check your credentials and try again.');
      }
    }, 800);
  };

  const handleForgotPassword = () => {
    Alert.alert('Coming Soon', 'Forgot password feature coming soon');
  };

  const togglePasswordVisibility = () => {
    setObscurePassword(!obscurePassword);
    AccessibilityInfo.announceForAccessibility(
      obscurePassword ? 'Password visible' : 'Password hidden'
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
          Sign In
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View
          style={[styles.logoContainer, { backgroundColor: colors.primary }]}
          accessible={true}
          accessibilityLabel="CareConnect logo"
          accessibilityRole="image"
        >
          <Ionicons name="heart" size={60} color={colors.background} />
        </View>

        {/* Welcome Header */}
        <Text
          style={[styles.welcomeTitle, { color: colors.text }]}
          accessible={true}
          accessibilityRole="header"
        >
          Welcome Back
        </Text>
        <Text
          style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}
        >
          Sign in to your CareConnect account
        </Text>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text
            style={[styles.label, { color: colors.text }]}
            nativeID="email-label"
          >
            Email Address
          </Text>
          <View>
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
              accessibilityLabelledBy="email-label"
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
          </View>
        </View>

        {/* Password Field */}
        <View style={styles.fieldContainer}>
          <Text
            style={[styles.label, { color: colors.text }]}
            nativeID="password-label"
          >
            Password
          </Text>
          <View>
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
                }}
                onBlur={() => validatePassword(password)}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={obscurePassword}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                editable={!isLoading}
                accessible={true}
                accessibilityLabel="Password"
                accessibilityHint="Enter your password"
                accessibilityLabelledBy="password-label"
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
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordButton}
          accessible={true}
          accessibilityRole="link"
          accessibilityLabel="Forgot password"
          accessibilityHint="Opens password recovery"
        >
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={isLoading}
          style={[
            styles.signInButton,
            {
              backgroundColor: isLoading
                ? colors.textSecondary
                : colors.primary
            },
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          accessibilityHint="Double tap to sign in to your account"
          accessibilityState={{ disabled: isLoading, busy: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onPrimary} size="small" />
          ) : (
            <Text style={[styles.signInButtonText, { color: colors.onPrimary }]}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Demo Credentials */}
        <View
          style={[
            styles.demoContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Demo login. Patient: patient@careconnect.demo slash password123. Caregiver: caregiver@careconnect.demo slash password123."
        >
          <Text style={[styles.demoTitle, { color: colors.textSecondary }]}>
            Demo login
          </Text>
          <Text style={[styles.demoText, { color: colors.textSecondary }]}>
            Patient: patient@careconnect.demo / password123
          </Text>
          <Text style={[styles.demoText, { color: colors.textSecondary }]}>
            Caregiver: caregiver@careconnect.demo / password123
          </Text>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpPrompt, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={onNavigateToRegistration}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel="Sign up"
            accessibilityHint="Opens registration screen"
          >
            <Text style={[styles.signUpLink, { color: colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 32,
    },
    welcomeTitle: {
      ...Typography.h2,
      textAlign: 'center',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      ...Typography.bodyLarge,
      textAlign: 'center',
      marginBottom: 40,
    },
    fieldContainer: {
      marginBottom: 24,
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
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      paddingRight: 56,
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
    errorText: {
      ...Typography.bodySmall,
      marginTop: 4,
      marginLeft: 4,
    },
    forgotPasswordButton: {
      alignSelf: 'flex-start',
      marginBottom: 32,
      minHeight: 48,
      justifyContent: 'center',
    },
    forgotPasswordText: {
      ...Typography.body,
      fontWeight: '600',
    },
    signInButton: {
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    signInButtonText: {
      ...Typography.buttonLarge,
    },
    demoContainer: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 24,
    },
    demoTitle: {
      ...Typography.bodySmall,
      fontWeight: '600',
      marginBottom: 4,
    },
    demoText: {
      ...Typography.bodySmall,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 48,
    },
    signUpPrompt: {
      ...Typography.body,
    },
    signUpLink: {
      ...Typography.body,
      fontWeight: '600',
    },
  });
