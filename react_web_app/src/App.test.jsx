import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CareConnect dashboard', () => {
  render(<App />);
  expect(screen.getByText(/Caregiver Dashboard/i)).toBeInTheDocument();
});
