import '../test-setup';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
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
