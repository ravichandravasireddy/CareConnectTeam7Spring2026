import '../test-setup';
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import PatientProfileScreen from '../PatientProfileScreen';

describe('PatientProfileScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
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
    render(<PatientProfileScreen onSignOut={onSignOut} />);

    fireEvent.press(screen.getByLabelText('Notification Settings'));
    fireEvent.press(screen.getByLabelText('Connected Caregivers'));
    fireEvent.press(screen.getByLabelText('Sign out'));

    const signOutCall = (Alert.alert as jest.Mock).mock.calls.find(
      ([title]) => title === 'Sign Out',
    );
    const actions = signOutCall?.[2] as { text: string; onPress?: () => void }[];
    actions?.[1]?.onPress?.();

    expect(Alert.alert).toHaveBeenCalledWith(
      'Notification Settings',
      'Coming soon.',
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Connected Caregivers',
      'Coming soon.',
    );
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('renders initials for short names', () => {
    render(<PatientProfileScreen userName="Al" />);

    expect(screen.getByText('AL')).toBeTruthy();
  });

  it('renders fallback initials for empty name', () => {
    render(<PatientProfileScreen userName="   " />);

    expect(screen.getByText('?')).toBeTruthy();
  });

  it('renders in dark mode', () => {
    (global as any).__mockColorScheme = 'dark';
    render(<PatientProfileScreen />);

    expect(screen.getByText('Profile')).toBeTruthy();

    (global as any).__mockColorScheme = undefined;
  });
});
