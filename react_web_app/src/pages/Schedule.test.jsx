import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Schedule from './Schedule';

describe('Schedule', () => {
  it('renders Schedule heading', () => {
    render(
      <MemoryRouter>
        <Schedule />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Schedule/i })).toBeInTheDocument();
  });

  it('renders placeholder content', () => {
    render(
      <MemoryRouter>
        <Schedule />
      </MemoryRouter>
    );
    expect(screen.getByText(/Schedule is coming soon/i)).toBeInTheDocument();
  });

  it('has accessible section', () => {
    render(
      <MemoryRouter>
        <Schedule />
      </MemoryRouter>
    );
    expect(screen.getByRole('region', { name: /Schedule content/i })).toBeInTheDocument();
  });
});
