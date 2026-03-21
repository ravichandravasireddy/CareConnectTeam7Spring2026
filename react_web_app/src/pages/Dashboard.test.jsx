import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders Caregiver Dashboard heading', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Caregiver Dashboard/i })).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome back, Dr. Anderson/i)).toBeInTheDocument();
  });

  it('renders stats section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('region', { name: /Quick statistics/i })).toBeInTheDocument();
    expect(screen.getByText('Total Patients')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders Active Patients section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Active Patients/i })).toBeInTheDocument();
    expect(screen.getByText('Margaret Johnson')).toBeInTheDocument();
  });

  it('renders Upcoming Tasks section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Upcoming Tasks/i })).toBeInTheDocument();
    expect(screen.getByText('Medication reminder')).toBeInTheDocument();
  });

  it('has Start Video Call button', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /Start video call/i })).toBeInTheDocument();
  });

  it('calls onStart when Start button is clicked on a task', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /Start Medication reminder for Margaret Johnson/i }));
    expect(logSpy).toHaveBeenCalledWith('Start task', 'Medication reminder');
    logSpy.mockRestore();
  });
});
