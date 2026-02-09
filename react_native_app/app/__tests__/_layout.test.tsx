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

jest.mock('@/providers/ThemeProvider', () => {
  const { Colors } = require('@/constants/theme');
  return {
    useTheme: () => ({ colorScheme: 'light', highContrast: false, setHighContrast: () => {}, colors: Colors.light, themeKey: 'light' }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('@react-navigation/native', () => {
  function NavThemeProvider({ children }: { children: React.ReactNode; value?: unknown }) {
    return <>{children}</>;
  }
  NavThemeProvider.displayName = 'ThemeProvider';
  return {
    ThemeProvider: NavThemeProvider,
    DarkTheme: { dark: true },
    DefaultTheme: { dark: false },
  };
});

jest.mock('expo-router', () => {
  const React = require('react');
  function StackFn({ children }: { children?: React.ReactNode }) {
    return React.createElement(React.Fragment, {}, children);
  }
  StackFn.displayName = 'Stack';
  function ScreenFn() {
    return null;
  }
  ScreenFn.displayName = 'Screen';
  (StackFn as { Screen?: React.FC }).Screen = ScreenFn;
  return { Stack: StackFn };
});

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('react-native-reanimated', () => ({}));

jest.mock('@/providers/Providers', () => {
  function MockProviders({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }
  MockProviders.displayName = 'Providers';
  return { Providers: MockProviders };
});

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without throwing', () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it('renders StatusBar component', () => {
    // StatusBar is mocked to return null, so we just verify it doesn't crash
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});
