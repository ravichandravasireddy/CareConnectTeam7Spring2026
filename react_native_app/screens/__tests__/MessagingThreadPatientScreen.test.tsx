import '../test-setup';
import React from 'react';
import { render, screen } from '@testing-library/react-native';

jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const R = require('react');
  const { View } = require('react-native');
  return ({ name, testID, ...p }: { name: string; testID?: string }) =>
    R.createElement(View, { testID: testID ?? `icon-${name}`, ...p });
});
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
const mockUseUser = jest.fn(() => ({
  isPatient: true,
  userName: null as string | null,
}));

jest.mock('@/providers/UserProvider', () => ({
  useUser: () => mockUseUser(),
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@/components/app-bottom-nav-bar', () => {
  const R = require('react');
  const { View } = require('react-native');
  return {
    AppBottomNavBar: () => R.createElement(View, { testID: 'app-bottom-nav-bar' }),
    kPatientNavMessages: 2,
    kCaregiverNavHome: 0,
  };
});

import MessagingThreadPatientScreen from '../MessagingThreadPatientScreen';

describe('MessagingThreadPatientScreen', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({ isPatient: true, userName: null });
  });

  it('renders doctor name in header', () => {
    render(<MessagingThreadPatientScreen />);

    expect(screen.getByText('Dr. Sarah Johnson')).toBeTruthy();
  });

  it('uses custom userName from provider when set', () => {
    mockUseUser.mockReturnValue({ isPatient: true, userName: 'Alex Patient' });
    render(<MessagingThreadPatientScreen />);
    expect(
      screen.getByLabelText(/Alex Patient.*Thank you so much/)
    ).toBeTruthy();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeTruthy();
  });

  it('uses caregiver naming when not patient', () => {
    mockUseUser.mockReturnValue({ isPatient: false, userName: null });
    render(<MessagingThreadPatientScreen />);
    expect(screen.getByText('Robert Williams')).toBeTruthy();
    expect(
      screen.getByLabelText(/Dr\. Sarah Johnson.*Thank you so much/)
    ).toBeTruthy();
  });
});
