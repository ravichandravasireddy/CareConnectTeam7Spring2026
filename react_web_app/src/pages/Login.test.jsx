import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login', () => {
  it('renders Sign In heading', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('renders Sign In button', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('form has accessible label', () => {
    render(<Login />);
    expect(screen.getByRole('form', { name: /Sign in form/i })).toBeInTheDocument();
  });

  it('has email input with correct type and autocomplete', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autocomplete', 'email');
  });

  it('prevents default on form submit', () => {
    render(<Login />);
    const form = screen.getByRole('form', { name: /Sign in form/i });
    const event = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    form.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
