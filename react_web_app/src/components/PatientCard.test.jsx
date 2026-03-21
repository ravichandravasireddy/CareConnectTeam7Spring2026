import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PatientCard from './PatientCard';

const mockPatient = {
  id: '1',
  name: 'Margaret Johnson',
  age: 78,
  status: 'Stable',
  alerts: 0,
  condition: 'Diabetes Type 2',
  heartRate: '72',
  bloodPressure: '120/80',
  adherence: '95',
  lastUpdate: '2 hours ago',
};

describe('PatientCard', () => {
  it('renders patient name and age', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Margaret Johnson, 78/)).toBeInTheDocument();
  });

  it('renders patient condition', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    expect(screen.getByText('Diabetes Type 2')).toBeInTheDocument();
  });

  it('renders vitals', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    expect(screen.getByText('72 bpm')).toBeInTheDocument();
    expect(screen.getByText('120/80')).toBeInTheDocument();
  });

  it('renders View Details link with correct href', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /View details for Margaret Johnson/i });
    expect(link).toHaveAttribute('href', '/patient/1');
  });

  it('shows alerts when patient has alerts', () => {
    const patientWithAlerts = { ...mockPatient, alerts: 2, status: 'Needs Attention' };
    render(
      <MemoryRouter>
        <PatientCard patient={patientWithAlerts} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('2 alerts')).toBeInTheDocument();
    expect(screen.getByText('2 Alerts')).toBeInTheDocument();
  });

  it('has accessible article role', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    expect(screen.getByRole('article', { name: 'Patient: Margaret Johnson' })).toBeInTheDocument();
  });
});
