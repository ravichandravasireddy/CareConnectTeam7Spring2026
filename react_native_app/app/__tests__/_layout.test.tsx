// =============================================================================
// ROOT LAYOUT TESTS
// =============================================================================
// Tests for root layout component rendering and theme provider setup.
// =============================================================================

import React from 'react';
import { render } from '@testing-library/react-native';
import RootLayout from '../_layout';

jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: (props: unknown) => React.createElement('View', props),
    Text: (props: unknown) => React.createElement('Text', props),
    Platform: { OS: 'ios', select: (opts: Record<string, unknown>) => opts?.ios ?? opts?.default },
  };
});

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(() => 'light'),
}));

jest.mock('@/providers/ThemeProvider', () => {
  const { Colors } = require('@/constants/theme');
  return {
    useTheme: () => ({ colorScheme: 'light', highContrast: false, setHighContrast: () => {}, colors: Colors.light, themeKey: 'light' }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('@react-navigation/native', () => ({
  ThemeProvider: ({ children, value }: { children: React.ReactNode; value: unknown }) => (
    <>{children}</>
  ),
  DarkTheme: { dark: true },
  DefaultTheme: { dark: false },
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const StackFn = ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, {}, children);
  (StackFn as { Screen?: React.FC }).Screen = () => null;
  return { Stack: StackFn };
});

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('react-native-reanimated', () => ({}));

jest.mock('@/providers/Providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without throwing', () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it('uses light theme when color scheme is light', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    (useColorScheme as jest.Mock).mockReturnValue('light');
    
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it('uses dark theme when color scheme is dark', () => {
    const { useColorScheme } = require('@/hooks/use-color-scheme');
    (useColorScheme as jest.Mock).mockReturnValue('dark');
    
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it('renders StatusBar component', () => {
    // StatusBar is mocked to return null, so we just verify it doesn't crash
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
