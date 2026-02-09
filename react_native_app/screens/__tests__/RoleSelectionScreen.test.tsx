import '../test-setup';
import React from 'react';
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
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: { name: string }) => null,
}));

import RoleSelectionScreen from '../RoleSelectionScreen';

describe('RoleSelectionScreen', () => {
  it('renders role selection content', () => {
    render(<RoleSelectionScreen />);

    expect(screen.getByText('Select Your Role')).toBeTruthy();
    expect(screen.getByText('Care Recipient')).toBeTruthy();
    expect(screen.getByText('Caregiver')).toBeTruthy();
  });

  it('invokes onSelectRole with patient', () => {
    const onSelectRole = jest.fn();
    render(<RoleSelectionScreen onSelectRole={onSelectRole} />);

    fireEvent.press(screen.getByLabelText(/Care Recipient\./));
    expect(onSelectRole).toHaveBeenCalledWith('patient');
  });

  it('invokes onSelectRole with caregiver', () => {
    const onSelectRole = jest.fn();
    render(<RoleSelectionScreen onSelectRole={onSelectRole} />);

    fireEvent.press(screen.getByLabelText(/Caregiver\./));
    expect(onSelectRole).toHaveBeenCalledWith('caregiver');
  });

  it('handles back navigation and dark mode render', () => {
    (global as any).__mockColorScheme = 'dark';
    const onNavigateBack = jest.fn();
    render(<RoleSelectionScreen onNavigateBack={onNavigateBack} />);

    fireEvent.press(screen.getByLabelText('Go back'));
    expect(onNavigateBack).toHaveBeenCalledTimes(1);

    (global as any).__mockColorScheme = undefined;
  });
});
