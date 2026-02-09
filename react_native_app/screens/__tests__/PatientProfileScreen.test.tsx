import '../test-setup';
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

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
jest.mock('@/components/app-app-bar', () => {
  const R = require('react');
  const { View, Text } = require('react-native');
  return {
    AppAppBar: ({ title }: { title?: string }) =>
      R.createElement(View, { testID: 'app-app-bar' }, title != null ? R.createElement(Text, {}, title) : null),
  };
});
jest.mock('@/components/app-bottom-nav-bar', () => {
  const R = require('react');
  const { View } = require('react-native');
  return {
    AppBottomNavBar: () => R.createElement(View, { testID: 'app-bottom-nav-bar' }),
    kPatientNavProfile: 4,
    kCaregiverNavHome: 0,
  };
});
type MockUserReturn = {
  userRole: 'patient' | 'caregiver';
  isPatient: boolean;
  userName: string | null;
  userEmail: string | null;
};
const mockUseUser = jest.fn<MockUserReturn, []>(() => ({
  userRole: 'patient',
  isPatient: true,
  userName: null,
  userEmail: null,
}));
jest.mock('@/providers/UserProvider', () => ({
  useUser: () => mockUseUser(),
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import PatientProfileScreen from '../PatientProfileScreen';

describe('PatientProfileScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    mockUseUser.mockReturnValue({
      userRole: 'patient',
      isPatient: true,
      userName: null,
      userEmail: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders personal info including blood type', () => {
    render(<PatientProfileScreen />);

    expect(screen.getByText('Personal Information')).toBeTruthy();
    expect(screen.getByText('Blood Type')).toBeTruthy();
    expect(screen.getByText('A+')).toBeTruthy();
  });

  it('handles preferences navigation press', () => {
    const onPreferencesPress = jest.fn();
    render(<PatientProfileScreen onPreferencesPress={onPreferencesPress} />);

    fireEvent.press(screen.getByLabelText('Preferences & Accessibility'));
    expect(onPreferencesPress).toHaveBeenCalledTimes(1);
  });

  it('shows sign out confirmation alert', () => {
    render(<PatientProfileScreen />);

    fireEvent.press(screen.getByLabelText('Sign out'));
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('opens edit profile alert', () => {
    render(<PatientProfileScreen />);

    fireEvent.press(screen.getByLabelText('Edit profile'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Edit Profile',
      'Edit profile feature coming soon.',
    );
  });

  it('opens settings alerts and handles sign out action', () => {
    const onSignOut = jest.fn();
    let lastAlertButtons: { text: string; onPress?: () => void }[] | undefined;
    jest.spyOn(Alert, 'alert').mockImplementation((title, _message, buttons) => {
      lastAlertButtons = buttons as { text: string; onPress?: () => void }[];
    });

    render(<PatientProfileScreen onSignOut={onSignOut} />);

    fireEvent.press(screen.getByLabelText('Notification Settings'));
    fireEvent.press(screen.getByLabelText('Connected Caregivers'));
    fireEvent.press(screen.getByLabelText('Sign out'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Notification Settings',
      'Coming soon.',
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Connected Caregivers',
      'Coming soon.',
    );
    const signOutButton = lastAlertButtons?.find((b) => b.text === 'Sign Out');
    expect(signOutButton?.onPress).toBeDefined();
    signOutButton!.onPress!();
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('renders initials for short names', () => {
    mockUseUser.mockReturnValue({
      userRole: 'patient',
      isPatient: true,
      userName: 'Al',
      userEmail: null,
    });
    render(<PatientProfileScreen />);

    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('renders fallback initials for empty name', () => {
    mockUseUser.mockReturnValue({
      userRole: 'patient',
      isPatient: true,
      userName: '   ',
      userEmail: null,
    });
    render(<PatientProfileScreen />);

    expect(screen.getByText('?')).toBeTruthy();
  });

  it('renders in dark mode', () => {
    (global as any).__mockColorScheme = 'dark';
    render(<PatientProfileScreen />);

    expect(screen.getByText('Profile')).toBeTruthy();

    (global as any).__mockColorScheme = undefined;
  });
});
