import '../test-setup';
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

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
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    AppAppBar: ({
      title,
      showMenuButton,
      showNotificationButton,
      showNotificationBadge,
      onMenuPress,
      onNotificationTap,
    }: {
      title?: string;
      showMenuButton?: boolean;
      showNotificationButton?: boolean;
      showNotificationBadge?: boolean;
      onMenuPress?: () => void;
      onNotificationTap?: () => void;
    }) =>
      R.createElement(
        View,
        { testID: 'app-app-bar' },
        showMenuButton &&
          R.createElement(
            TouchableOpacity,
            {
              accessibilityLabel: 'Menu',
              accessibilityRole: 'button',
              onPress: onMenuPress,
            },
            R.createElement(Text, {}, 'Menu'),
          ),
        title != null && R.createElement(Text, {}, title),
        showNotificationButton &&
          R.createElement(
            TouchableOpacity,
            {
              accessibilityLabel: showNotificationBadge
                ? 'Notifications, 1 unread notification'
                : 'Notifications',
              accessibilityRole: 'button',
              onPress: onNotificationTap,
            },
            R.createElement(Text, {}, 'Notifications'),
          ),
      ),
  };
});

const today = new Date();
const todayAt2PM = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0);
const mockTasks = [
  {
    id: 'task-1',
    title: 'Take Medication',
    description: 'Metformin 500mg',
    date: today,
    patientName: 'Patient',
    icon: 'medication',
    iconBackground: '#E3F2FD',
    iconColor: '#1976D2',
    completedAt: new Date(),
  },
  {
    id: 'task-2',
    title: 'Blood Pressure Check',
    description: '',
    date: todayAt2PM,
    patientName: 'Patient',
    icon: 'monitor-heart',
    iconBackground: '#E8F5E9',
    iconColor: '#2E7D32',
    completedAt: undefined,
  },
  {
    id: 'task-3',
    title: 'Take Medication',
    description: 'Metformin 500mg',
    date: todayAt2PM,
    patientName: 'Patient',
    icon: 'medication',
    iconBackground: '#E3F2FD',
    iconColor: '#1976D2',
    completedAt: undefined,
  },
];
jest.mock('@/providers/TaskProvider', () => ({
  useTaskProvider: () => ({ tasks: mockTasks }),
}));

import PatientDashboardScreen from '../PatientDashboardScreen';

describe('PatientDashboardScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders welcome and sections', () => {
    render(<PatientDashboardScreen userName="Alex Smith" />);

    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Good Morning, Alex!')).toBeTruthy();
    expect(screen.getByText('Upcoming Tasks')).toBeTruthy();
  });

  it('handles dark mode and empty name', () => {
    (global as any).__mockColorScheme = 'dark';
    render(<PatientDashboardScreen userName="" />);

    expect(screen.getByText('Good Morning, !')).toBeTruthy();

    (global as any).__mockColorScheme = undefined;
  });

  it('has accessibility labels for menu and notifications', () => {
    render(<PatientDashboardScreen />);

    expect(screen.getByLabelText('Menu')).toBeTruthy();
    expect(
      screen.getByLabelText('Notifications, 1 unread notification'),
    ).toBeTruthy();
  });

  it('handles menu and notifications taps', () => {
    const onMenuPress = jest.fn();
    const onNotificationsPress = jest.fn();
    render(
      <PatientDashboardScreen
        onMenuPress={onMenuPress}
        onNotificationsPress={onNotificationsPress}
      />,
    );

    fireEvent.press(screen.getByLabelText('Menu'));
    fireEvent.press(
      screen.getByLabelText('Notifications, 1 unread notification'),
    );

    expect(onMenuPress).toHaveBeenCalledTimes(1);
    expect(onNotificationsPress).toHaveBeenCalledTimes(1);
  });

  it('opens Emergency SOS alert on press', () => {
    render(<PatientDashboardScreen />);

    fireEvent.press(
      screen.getByLabelText(
        'Emergency SOS button. Alerts all caregivers with your current location.',
      ),
    );

    expect(Alert.alert).toHaveBeenCalled();
  });

  it('handles summary cards, tasks, actions, and video call', () => {
    const onCalendarPress = jest.fn();
    const onHealthLogsPress = jest.fn();
    const onTaskDetailsPress = jest.fn();
    const onMessagingPress = jest.fn();
    const onVideoCallPress = jest.fn();

    render(
      <PatientDashboardScreen
        onCalendarPress={onCalendarPress}
        onHealthLogsPress={onHealthLogsPress}
        onTaskDetailsPress={onTaskDetailsPress}
        onMessagingPress={onMessagingPress}
        onVideoCallPress={onVideoCallPress}
      />,
    );

    fireEvent.press(screen.getByText('View All'));
    fireEvent.press(screen.getByLabelText('Tasks, 3/5. Completed today'));
    fireEvent.press(screen.getByLabelText('BP Today, 120/80. Normal'));
    fireEvent.press(screen.getByLabelText(/^Take Medication\./));
    fireEvent.press(screen.getByLabelText(/^Blood Pressure Check\./));
    fireEvent.press(screen.getByLabelText('Log Health Data'));
    fireEvent.press(screen.getByLabelText('Send Message'));
    fireEvent.press(screen.getByLabelText('Start video call'));

    expect(onCalendarPress).toHaveBeenCalledTimes(2);
    expect(onHealthLogsPress).toHaveBeenCalledTimes(2);
    expect(onTaskDetailsPress).toHaveBeenCalledTimes(2);
    expect(onMessagingPress).toHaveBeenCalledTimes(1);
    expect(onVideoCallPress).toHaveBeenCalledTimes(1);
  });

  it('renders task card without due badge', () => {
    render(<PatientDashboardScreen />);

    expect(
      screen.getByLabelText(/^Blood Pressure Check\./),
    ).toBeTruthy();
  });
});
