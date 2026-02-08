import '../test-setup';
import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
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
