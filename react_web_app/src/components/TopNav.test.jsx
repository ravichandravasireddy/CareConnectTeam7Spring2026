import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopNav from './TopNav';

describe('TopNav', () => {
  it('renders CareConnect brand when not on login page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /CareConnect home/i })).toBeInTheDocument();
  });

  it('returns null on login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <TopNav />
      </MemoryRouter>
    );
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });

  it('renders nav links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Patients/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Schedule/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reports/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Messages/i })).toBeInTheDocument();
  });

  it('shows Install button when beforeinstallprompt fires', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav />
      </MemoryRouter>
    );
    const ev = new CustomEvent('beforeinstallprompt');
    ev.preventDefault = vi.fn();
    ev.prompt = vi.fn().mockResolvedValue(undefined);
    ev.userChoice = Promise.resolve({ outcome: 'accepted' });
    await act(async () => {
      window.dispatchEvent(ev);
    });
    const installBtn = screen.getByRole('button', { name: /Install CareConnect/i });
    expect(installBtn).toBeInTheDocument();
  });

  it('calls prompt when Install button is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav />
      </MemoryRouter>
    );
    const promptSpy = vi.fn().mockResolvedValue(undefined);
    const ev = new CustomEvent('beforeinstallprompt');
    ev.preventDefault = vi.fn();
    ev.prompt = promptSpy;
    ev.userChoice = Promise.resolve({ outcome: 'accepted' });
    await act(async () => {
      window.dispatchEvent(ev);
    });
    const installBtn = screen.getByRole('button', { name: /Install CareConnect/i });
    await act(async () => {
      fireEvent.click(installBtn);
    });
    expect(promptSpy).toHaveBeenCalled();
  });
});
