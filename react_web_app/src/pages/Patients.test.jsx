import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Patients from './Patients';

describe('Patients', () => {
  it('renders Patients heading', () => {
    render(
      <MemoryRouter>
        <Patients />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Patients/i })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <MemoryRouter>
        <Patients />
      </MemoryRouter>
    );
    expect(screen.getByText(/All active patients under your care/i)).toBeInTheDocument();
  });

  it('renders all patient cards', () => {
    render(
      <MemoryRouter>
        <Patients />
      </MemoryRouter>
    );
    expect(screen.getByText(/Margaret Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/Robert Chen/)).toBeInTheDocument();
    expect(screen.getByText(/Sarah Williams/)).toBeInTheDocument();
  });

  it('has accessible patients list', () => {
    render(
      <MemoryRouter>
        <Patients />
      </MemoryRouter>
    );
    expect(screen.getByRole('region', { name: /Patients list/i })).toBeInTheDocument();
  });
});
