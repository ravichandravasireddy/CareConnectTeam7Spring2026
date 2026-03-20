import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Patients" value="12" />);
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('uses default aria-label when ariaLabel not provided', () => {
    render(<StatCard label="Active Alerts" value="2" />);
    const group = screen.getByRole('group', { name: 'Active Alerts: 2' });
    expect(group).toBeInTheDocument();
  });

  it('uses custom ariaLabel when provided', () => {
    render(<StatCard label="Test" value="5" ariaLabel="Custom label" />);
    const group = screen.getByRole('group', { name: 'Custom label' });
    expect(group).toBeInTheDocument();
  });

  it('renders with different stat types', () => {
    render(<StatCard label="Avg Adherence" value="88%" />);
    expect(screen.getByText('Avg Adherence')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });
});
