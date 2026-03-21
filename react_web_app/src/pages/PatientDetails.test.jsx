import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PatientDetails from './PatientDetails';

describe('PatientDetails', () => {
  const renderWithRoute = (id) => {
    return render(
      <MemoryRouter initialEntries={[`/patient/${id}`]}>
        <Routes>
          <Route path="/patient/:id" element={<PatientDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders patient name and info for valid id', () => {
    renderWithRoute('1');
    expect(screen.getByText(/Margaret Johnson, 78/)).toBeInTheDocument();
    expect(screen.getByText(/P-2024-001/)).toBeInTheDocument();
  });

  it('renders back link', () => {
    renderWithRoute('1');
    expect(screen.getByRole('link', { name: /Back to dashboard/i })).toBeInTheDocument();
  });

  it('renders vitals tab content by default', () => {
    renderWithRoute('1');
    expect(screen.getByRole('heading', { name: /Current Vitals/i })).toBeInTheDocument();
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('switches to medications tab', () => {
    renderWithRoute('1');
    fireEvent.click(screen.getByRole('tab', { name: /Medications/i }));
    expect(screen.getByText(/Medication schedule coming soon/i)).toBeInTheDocument();
  });

  it('switches to activity tab', () => {
    renderWithRoute('1');
    fireEvent.click(screen.getByRole('tab', { name: /Activity/i }));
    expect(screen.getByText(/Activity timeline coming soon/i)).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithRoute('1');
    expect(screen.getByRole('button', { name: /Start video call/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Call patient/i })).toBeInTheDocument();
  });

  it('renders health trends', () => {
    renderWithRoute('1');
    expect(screen.getByRole('heading', { name: /Health Trends/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Medication Adherence/).length).toBeGreaterThan(0);
  });

  it('renders achievements', () => {
    renderWithRoute('1');
    expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/7-Day Streak/i)).toBeInTheDocument();
  });

  it('handles unknown patient id', () => {
    renderWithRoute('999');
    expect(screen.getByRole('heading', { name: /Patient/ })).toBeInTheDocument();
    expect(screen.getByText(/Patient ID: —/)).toBeInTheDocument();
  });
});
