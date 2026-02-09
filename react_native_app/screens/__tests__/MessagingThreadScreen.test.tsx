import '../test-setup';
import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react-native';
import { Alert } from 'react-native';

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

import { MessagingThreadScreen } from '../MessagingThreadScreen';

describe('MessagingThreadScreen', () => {
  const messages = [
    {
      id: '1',
      fromCurrentUser: false,
      content: 'Hello!',
      time: '9:00 AM',
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders messages and header', () => {
    render(
      <MessagingThreadScreen
        currentUserName="Riley Wilson"
        otherUserName="Dr. Sarah Johnson"
        initialMessages={messages}
      />,
    );

    expect(screen.getByText('Dr. Sarah Johnson')).toBeTruthy();
    expect(screen.getByText('Hello!')).toBeTruthy();
  });

  it('has accessibility label for message input', () => {
    render(
      <MessagingThreadScreen
        currentUserName="Riley Wilson"
        otherUserName="Dr. Sarah Johnson"
        initialMessages={messages}
      />,
    );

    expect(screen.getByLabelText('Message input')).toBeTruthy();
  });

  it('sends a new message when Send is pressed', () => {
    render(
      <MessagingThreadScreen
        currentUserName="Riley Wilson"
        otherUserName="Dr. Sarah Johnson"
        initialMessages={messages}
      />,
    );

    fireEvent.changeText(screen.getByLabelText('Message input'), 'New message');
    fireEvent.press(screen.getByLabelText('Send message'));

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('New message')).toBeTruthy();
  });

  it('does not send an empty message', () => {
    render(
      <MessagingThreadScreen
        currentUserName="Riley Wilson"
        otherUserName="Dr. Sarah Johnson"
        initialMessages={messages}
      />,
    );

    fireEvent.press(screen.getByLabelText('Send message'));
    expect(screen.queryByText('Now')).toBeNull();
  });

  it('opens attachment alert', () => {
    render(
      <MessagingThreadScreen
        currentUserName="Riley Wilson"
        otherUserName="Dr. Sarah Johnson"
        initialMessages={messages}
      />,
    );

    fireEvent.press(screen.getByLabelText('Add attachment'));
    expect(Alert.alert).toHaveBeenCalledWith('Attachments', 'Coming soon.');
  });
});
