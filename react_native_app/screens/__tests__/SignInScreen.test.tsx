import '../test-setup';
import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, act } from '@testing-library/react-native';
import SignInScreen from '../SignInScreen';

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders key content', () => {
    render(<SignInScreen />);

    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0);
    expect(screen.getByText('Welcome Back')).toBeTruthy();
    expect(screen.getByText('Forgot Password?')).toBeTruthy();
  });

  it('has accessibility labels for inputs and button', () => {
    render(<SignInScreen />);

    expect(screen.getByPlaceholderText('your.email@example.com')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
    expect(screen.getByLabelText('Sign in')).toBeTruthy();
  });

  it('allows sign in interaction and triggers success', () => {
    const onSignInSuccess = jest.fn();
    render(<SignInScreen onSignInSuccess={onSignInSuccess} />);

    fireEvent.changeText(
      screen.getByPlaceholderText('your.email@example.com'),
      'user@example.com',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Enter your password'),
      'password123',
    );

    fireEvent.press(screen.getByLabelText('Sign in'));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Sign in successful!');
    expect(onSignInSuccess).toHaveBeenCalledTimes(1);
  });

  it('shows validation errors for empty and invalid inputs', () => {
    render(<SignInScreen />);

    fireEvent.press(screen.getByLabelText('Sign in'));
    expect(screen.getByText('Email is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText('your.email@example.com'),
      'invalid-email',
    );
    fireEvent(screen.getByPlaceholderText('your.email@example.com'), 'blur');
    expect(screen.getByText('Enter a valid email')).toBeTruthy();
  });

  it('validates password on blur', () => {
    render(<SignInScreen />);

    fireEvent(screen.getByPlaceholderText('Enter your password'), 'blur');
    expect(screen.getByText('Password is required')).toBeTruthy();
  });

  it('clears password error when typing after validation', () => {
    render(<SignInScreen />);

    fireEvent.press(screen.getByLabelText('Sign in'));
    expect(screen.getByText('Password is required')).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText('Enter your password'),
      'password123',
    );
    expect(screen.queryByText('Password is required')).toBeNull();
  });

  it('toggles password visibility', () => {
    render(<SignInScreen />);

    const showPassword = screen.getByLabelText('Show password');
    fireEvent.press(showPassword);
    expect(showPassword).toBeTruthy();
  });

  it('shows forgot password alert', () => {
    render(<SignInScreen />);

    fireEvent.press(screen.getByLabelText('Forgot password'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Coming Soon',
      'Forgot password feature coming soon',
    );
  });

  it('navigates to registration when Sign Up is pressed', () => {
    const onNavigateToRegistration = jest.fn();
    render(
      <SignInScreen onNavigateToRegistration={onNavigateToRegistration} />,
    );

    fireEvent.press(screen.getByText('Sign Up'));
    expect(onNavigateToRegistration).toHaveBeenCalledTimes(1);
  });
});
