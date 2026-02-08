import '../test-setup';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MessagingThreadDoctorScreen from '../MessagingThreadDoctorScreen';

describe('MessagingThreadDoctorScreen', () => {
  it('renders patient name in header', () => {
    render(<MessagingThreadDoctorScreen />);

    expect(screen.getByText('Riley Wilson')).toBeTruthy();
  });
});
