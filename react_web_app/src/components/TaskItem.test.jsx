import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    title: 'Medication reminder',
    patientName: 'Margaret Johnson',
    time: '2:00 PM',
    onStart: () => {},
  };

  it('renders task title and patient name', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText('Medication reminder')).toBeInTheDocument();
    expect(screen.getByText('Margaret Johnson')).toBeInTheDocument();
  });

  it('renders time', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByText('2:00 PM')).toBeInTheDocument();
  });

  it('calls onStart when Start button is clicked', () => {
    const onStart = vi.fn();
    render(<TaskItem task={{ ...mockTask, onStart }} />);
    const button = screen.getByRole('button', { name: /Start Medication reminder for Margaret Johnson/i });
    fireEvent.click(button);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('has listitem role', () => {
    render(<TaskItem task={mockTask} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders time with dateTime attribute', () => {
    render(<TaskItem task={mockTask} />);
    const timeEl = screen.getByText('2:00 PM');
    expect(timeEl.tagName).toBe('TIME');
    expect(timeEl).toHaveAttribute('dateTime', '2:00 PM');
  });
});
