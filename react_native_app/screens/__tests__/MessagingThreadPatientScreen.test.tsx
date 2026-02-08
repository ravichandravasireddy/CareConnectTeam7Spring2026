import '../test-setup';
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import MessagingThreadPatientScreen from '../MessagingThreadPatientScreen';

describe('MessagingThreadPatientScreen', () => {
  it('renders doctor name in header', () => {
    render(<MessagingThreadPatientScreen />);

    expect(screen.getByText('Dr. Sarah Johnson')).toBeTruthy();
  });
});
