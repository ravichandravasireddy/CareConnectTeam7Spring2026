import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Reports from './Reports';

describe('Reports', () => {
  it('renders Reports heading', () => {
    render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Reports/i })).toBeInTheDocument();
  });

  it('renders placeholder content', () => {
    render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );
    expect(screen.getByText(/Reports are coming soon/i)).toBeInTheDocument();
  });

  it('has accessible section', () => {
    render(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );
    expect(screen.getByRole('region', { name: /Reports content/i })).toBeInTheDocument();
  });
});
