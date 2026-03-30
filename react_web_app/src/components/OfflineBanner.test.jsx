import { render, screen, waitFor, act } from '@testing-library/react';
import OfflineBanner from './OfflineBanner';

describe('OfflineBanner', () => {
  const originalNavigator = window.navigator;

  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator, onLine: true },
      configurable: true,
    });
    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true,
    });
  });

  it('does not render when online', () => {
    render(<OfflineBanner />);
    expect(screen.queryByRole('status', { name: /You are offline/i })).not.toBeInTheDocument();
  });

  it('renders offline message when navigator.onLine is false', () => {
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator, onLine: false },
      configurable: true,
    });
    render(<OfflineBanner />);
    expect(screen.getByRole('status', { name: /You are offline/i })).toBeInTheDocument();
    expect(screen.getByText(/You are offline/i)).toBeInTheDocument();
  });

  it('shows offline banner when offline event fires', async () => {
    render(<OfflineBanner />);
    expect(screen.queryByText(/You are offline/i)).not.toBeInTheDocument();

    Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await waitFor(() => {
      expect(screen.getByText(/You are offline/i)).toBeInTheDocument();
    });
  });

  it('shows last sync time when offline and previously synced', async () => {
    const syncTime = new Date('2026-01-15T10:30:00').toISOString();
    localStorage.setItem('careconnect-last-sync', syncTime);
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator, onLine: false },
      configurable: true,
    });
    render(<OfflineBanner />);
    await waitFor(() => {
      expect(screen.getByText(/Last synced:/i)).toBeInTheDocument();
    });
  });

  it('hides banner when connection is restored', async () => {
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator, onLine: false },
      configurable: true,
    });
    render(<OfflineBanner />);
    await waitFor(() => {
      expect(screen.getByText(/You are offline/i)).toBeInTheDocument();
    });
    act(() => {
      Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));
    });
    await waitFor(() => {
      expect(screen.queryByRole('status', { name: /You are offline/i })).not.toBeInTheDocument();
    });
  });
});
