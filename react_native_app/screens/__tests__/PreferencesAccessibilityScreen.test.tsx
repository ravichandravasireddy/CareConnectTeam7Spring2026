import '../test-setup';
import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import PreferencesAccessibilityScreen from '../PreferencesAccessibilityScreen';

const mockSetPreference = jest.fn();
const mockSetHighContrast = jest.fn();

jest.mock('@/providers/ThemeProvider', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    preference: 'system',
    setPreference: mockSetPreference,
    highContrast: false,
    setHighContrast: mockSetHighContrast,
    colors: require('@/constants/theme').Colors.light,
    themeKey: 'light',
  }),
}));

describe('PreferencesAccessibilityScreen', () => {
  beforeEach(() => {
    mockSetPreference.mockClear();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders sections and header', () => {
    render(<PreferencesAccessibilityScreen />);

    expect(screen.getByText('Preferences & Accessibility')).toBeTruthy();
    expect(screen.getByText('Display')).toBeTruthy();
    expect(screen.getByText('Accessibility')).toBeTruthy();
  });

  it('renders in dark mode', () => {
    (global as any).__mockColorScheme = 'dark';
    render(<PreferencesAccessibilityScreen />);

    expect(screen.getByText('Display')).toBeTruthy();

    (global as any).__mockColorScheme = undefined;
  });

  it('has accessibility labels on switches', () => {
    render(<PreferencesAccessibilityScreen />);

    expect(screen.getByLabelText('Dark Mode')).toBeTruthy();
    expect(screen.getByLabelText('Reduce Motion')).toBeTruthy();
  });

  it('toggles dark mode preference immediately', () => {
    render(<PreferencesAccessibilityScreen />);

    fireEvent(screen.getByLabelText('Dark Mode'), 'valueChange', true);
    expect(mockSetPreference).toHaveBeenCalledWith('dark');
  });

  it('opens selection dialogs and save action', () => {
    render(<PreferencesAccessibilityScreen />);

    fireEvent.press(screen.getByLabelText('Text Size. Adjust text size for better readability'));
    fireEvent.press(screen.getByLabelText('Language. English (US)'));
    fireEvent.press(screen.getByLabelText('Time Format. 12-hour'));
    fireEvent.press(screen.getByLabelText('Date Format. MM/DD/YYYY'));
    fireEvent.press(screen.getByLabelText('HIPAA Consent. View privacy policy'));
    fireEvent.press(screen.getByLabelText('Save preferences'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Text Size',
      'Text size adjustment feature coming soon.',
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Select Language',
      undefined,
      expect.any(Array),
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Time Format',
      undefined,
      expect.any(Array),
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Date Format',
      undefined,
      expect.any(Array),
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'HIPAA Consent',
      'Privacy policy viewer coming soon.',
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Saved',
      'Preferences saved successfully.',
    );
  });

  it('applies language, time, and date selections from dialogs', () => {
    let lastAlertButtons: { text: string; onPress?: () => void }[] | undefined;
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      lastAlertButtons = buttons as { text: string; onPress?: () => void }[];
    });

    render(<PreferencesAccessibilityScreen />);

    fireEvent.press(screen.getByLabelText('Language. English (US)'));
    const spanishButton = lastAlertButtons?.find((b) => b.text === 'Spanish');
    act(() => {
      spanishButton?.onPress?.();
    });
    expect(screen.getByLabelText('Language. Spanish')).toBeTruthy();
    const englishButton = lastAlertButtons?.find((b) => b.text === 'English (US)');
    act(() => {
      englishButton?.onPress?.();
    });
    expect(screen.getByLabelText('Language. English (US)')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Time Format. 12-hour'));
    const time24Button = lastAlertButtons?.find((b) => b.text === '24-hour');
    act(() => {
      time24Button?.onPress?.();
    });
    expect(screen.getByLabelText('Time Format. 24-hour')).toBeTruthy();
    const time12Button = lastAlertButtons?.find((b) => b.text === '12-hour');
    act(() => {
      time12Button?.onPress?.();
    });
    expect(screen.getByLabelText('Time Format. 12-hour')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Date Format. MM/DD/YYYY'));
    const yyyyMmDdButton = lastAlertButtons?.find((b) => b.text === 'YYYY-MM-DD');
    act(() => {
      yyyyMmDdButton?.onPress?.();
    });
    expect(screen.getByLabelText('Date Format. YYYY-MM-DD')).toBeTruthy();
    const ddMmYyyyButton = lastAlertButtons?.find((b) => b.text === 'DD/MM/YYYY');
    act(() => {
      ddMmYyyyButton?.onPress?.();
    });
    expect(screen.getByLabelText('Date Format. DD/MM/YYYY')).toBeTruthy();
  });
});
