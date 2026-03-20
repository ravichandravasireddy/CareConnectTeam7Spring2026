import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Messages from './Messages';

describe('Messages', () => {
  it('renders Messages heading', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Messages/i })).toBeInTheDocument();
  });

  it('renders conversations list', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Margaret Johnson/).length).toBeGreaterThan(0);
    expect(screen.getByRole('listitem', { name: /Conversation with Robert Chen/ })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: /Conversation with Sarah Williams/ })).toBeInTheDocument();
  });

  it('shows selected conversation in chat header', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Margaret Johnson/i })).toBeInTheDocument();
  });

  it('filters conversations when search is used', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search messages/i);
    fireEvent.change(searchInput, { target: { value: 'Margaret' } });
    expect(screen.getByRole('listitem', { name: /Conversation with Margaret Johnson/ })).toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: /Conversation with Robert Chen/ })).not.toBeInTheDocument();
  });

  it('renders message history', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    expect(screen.getByRole('log', { name: /Message history/i })).toBeInTheDocument();
    expect(screen.getByText(/Good morning! I just completed my morning vitals check/i)).toBeInTheDocument();
  });

  it('has message input', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input).toHaveValue('Hello');
  });

  it('switches conversation when selected', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('listitem', { name: /Conversation with Robert Chen/i }));
    expect(screen.getByRole('heading', { name: /Robert Chen/i })).toBeInTheDocument();
  });

  it('shows Offline status for offline contact', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('listitem', { name: /Conversation with Dr. Patricia Lee/ }));
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('renders sent message without sender label', () => {
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );
    expect(screen.getByText(/Wonderful! Your blood pressure looks great today/i)).toBeInTheDocument();
  });
});
