import '../test-setup';
import React from 'react';
import { Alert, AccessibilityInfo } from 'react-native';
import { fireEvent, render, screen, act } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));
jest.mock('@/providers/ThemeProvider', () => {
  const { Colors } = require('@/constants/theme');
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: 'light', highContrast: false, setHighContrast: () => {}, themeKey: 'light' }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock('@/providers/UserProvider', () => ({
  useUser: () => ({ setUserRole: jest.fn(), setUserInfo: jest.fn() }),
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import RegistrationScreen from '../RegistrationScreen';

describe('RegistrationScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders header and form fields', () => {
    render(<RegistrationScreen />);

    expect(screen.getByText('Join CareConnect')).toBeTruthy();
    expect(screen.getAllByText('Create Account').length).toBeGreaterThan(0);
    expect(screen.getByText('Confirm Password')).toBeTruthy();
  });

  it('has accessibility label for terms checkbox', () => {
    render(<RegistrationScreen />);

    expect(
      screen.getByLabelText('Agree to terms and privacy policy'),
    ).toBeTruthy();
  });

  it('submits registration and triggers success', () => {
    const onRegistrationSuccess = jest.fn();
    render(
      <RegistrationScreen
        selectedRole="patient"
        onRegistrationSuccess={onRegistrationSuccess}
      />,
    );

    fireEvent.changeText(
      screen.getByPlaceholderText('Create a strong password'),
      'password123',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Re-enter your password'),
      'password123',
    );

    fireEvent.press(
      screen.getByLabelText('Agree to terms and privacy policy'),
    );
    fireEvent.press(screen.getByLabelText('Create account'));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(Alert.alert).toHaveBeenCalled();
    expect(onRegistrationSuccess).toHaveBeenCalledWith('patient');
  });

  it('shows validation errors for invalid email and password mismatch', () => {
    render(<RegistrationScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('your.email@example.com'),
      'invalid-email',
    );
    fireEvent(screen.getByPlaceholderText('your.email@example.com'), 'blur');

    fireEvent.changeText(
      screen.getByPlaceholderText('Create a strong password'),
      'password123',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Re-enter your password'),
      'different',
    );
    fireEvent(screen.getByPlaceholderText('Re-enter your password'), 'blur');

    expect(screen.getByText('Enter a valid email')).toBeTruthy();
    expect(screen.getByText('Passwords do not match')).toBeTruthy();
  });

  it('blocks submission until terms are agreed', () => {
    render(<RegistrationScreen />);

    fireEvent.press(screen.getByLabelText('Create account'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Terms required',
      'Please agree to the Terms of Service and Privacy Policy.',
    );
  });

  it('announces validation failures when terms are agreed', () => {
    jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(jest.fn());
    render(<RegistrationScreen />);

    fireEvent.press(
      screen.getByLabelText('Agree to terms and privacy policy'),
    );
    fireEvent.press(screen.getByLabelText('Create account'));

    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalled();
  });

  it('toggles password visibility controls', () => {
    render(<RegistrationScreen />);

    const showPassword = screen.getByLabelText('Show password');
    fireEvent.press(showPassword);

    const showConfirm = screen.getByLabelText('Show confirm password');
    fireEvent.press(showConfirm);

    expect(showPassword).toBeTruthy();
    expect(showConfirm).toBeTruthy();
  });

  it('opens terms and privacy links', () => {
    render(<RegistrationScreen />);

    fireEvent.press(screen.getByLabelText('Terms of Service'));
    fireEvent.press(screen.getByLabelText('Privacy Policy'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Terms of Service',
      'Coming soon.',
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Privacy Policy',
      'Coming soon.',
    );
  });

  it('navigates to Sign In when Sign In link is pressed', () => {
    const onNavigateToSignIn = jest.fn();
    render(<RegistrationScreen onNavigateToSignIn={onNavigateToSignIn} />);

    fireEvent.press(screen.getByText('Sign In'));
    expect(onNavigateToSignIn).toHaveBeenCalledTimes(1);
  });

  it('renders in dark mode when color scheme is dark', () => {
    (global as any).__mockColorScheme = 'dark';

    render(<RegistrationScreen />);
    expect(screen.getByText('Join CareConnect')).toBeTruthy();

    (global as any).__mockColorScheme = undefined;
  });

  it('uses caregiver defaults when role is caregiver', () => {
    render(<RegistrationScreen selectedRole="caregiver" />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Create a strong password'),
      'password123',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Re-enter your password'),
      'password123',
    );
    fireEvent.press(
      screen.getByLabelText('Agree to terms and privacy policy'),
    );
    fireEvent.press(screen.getByLabelText('Create account'));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('updates name and phone fields and validates password flow', () => {
    render(<RegistrationScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('John'), 'Jane');
    fireEvent.changeText(screen.getByPlaceholderText('Doe'), 'Smith');
    fireEvent.changeText(
      screen.getByPlaceholderText('(555) 123-4567'),
      '(555) 555-1212',
    );

    const passwordInput = screen.getByPlaceholderText(
      'Create a strong password',
    );
    const confirmInput = screen.getByPlaceholderText(
      'Re-enter your password',
    );

    fireEvent.changeText(confirmInput, 'different');
    fireEvent(passwordInput, 'blur');
    expect(screen.getByText('Password is required')).toBeTruthy();

    fireEvent.changeText(passwordInput, 'password123');
    expect(screen.getByText('Passwords do not match')).toBeTruthy();
  });
});
