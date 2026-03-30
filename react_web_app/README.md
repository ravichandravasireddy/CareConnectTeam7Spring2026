# CareConnect Team7 Spring2026 — React Web Application (Vite)

## Description

**CareConnect** is a HIPAA-compliant desktop application (Electron) that connects patients (care recipients) and their caregivers for remote health management and coordination. The website app mirrors the core flows of the desktop app: a caregiver dashboard with patient overview, patient detail, and communication center.

The app is built with accessibility in mind (WCAG 2.1 AA), including keyboard navigation, high contrast colors, skip links, focus indicators, and screen reader support, so caregivers who are deaf or hard of hearing can manage tasks and coordinate care without relying on audio.

## Team Members

- Dominique Rattray (Team Lead)
- Ravichandra Vasireddy
- Zechariah Hillman

## Team Charter

Link: [Team Charter](https://docs.google.com/document/d/1xMF6upCBABr3dtR3aLjk2lLUWFN1IEbwB-vC6tYJCB8/edit?usp=sharing)

## Project Structure & Scaffolding

This project uses [Vite](https://vitejs.dev/) for fast development and optimized production builds.

### Initialized Project Structure

```
react_web_app/
├── public/                 # Static assets
│   ├── manifest.json
│   ├── offline.html
│   ├── robots.txt
│   └── service-worker.js
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.jsx      # Main layout wrapper (renders Outlet for child routes)
│   │   ├── Layout.css
│   │   ├── OfflineBanner.jsx
│   │   ├── PageMeta.jsx
│   │   ├── PatientCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── TaskItem.jsx
│   │   ├── Icons.jsx
│   │   └── Button.css
│   ├── pages/              # Route-level page components
│   │   ├── Dashboard.jsx
│   │   ├── PatientDetails.jsx
│   │   ├── Messages.jsx
│   │   └── Login.jsx
│   ├── App.jsx             # Root app + routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
└── package.json
```

### Routing Setup

Routes are defined in `App.jsx` using React Router:

| Path | Component | Layout |
|------|-----------|--------|
| `/` | Dashboard | Layout |
| `/patient/:id` | PatientDetails | Layout |
| `/messages` | Messages | Layout |
| `/login` | Login | (standalone) |

The `Layout` component wraps Dashboard, PatientDetails, and Messages. Login renders without the layout.

### Layout Component (Rendered in Browser)

The `Layout` component (`src/components/Layout.jsx`) provides the shared shell for the app:

- **OfflineBanner** – Shown when network is unavailable
- **Skip link** – Accessibility: "Skip to main content"
- **Main** – Renders child route content via `<Outlet />`

Child routes (Dashboard, PatientDetails, Messages) render inside the `<main>` area. Run `npm run dev` and open http://localhost:5173 to see the Layout with Dashboard rendered.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `dist` folder.\
The build is minified and optimized for deployment.

### `npm run preview`

Serves the production build locally for testing before deployment.

### `npm test`

Launches the test runner (Vitest) in interactive watch mode.

### `npm run test:run`

Runs tests once without watch mode (useful for CI).

### `npm run test:ui`

Launches the Vitest UI for a visual test interface.

### `npm run test:coverage`

Runs tests with coverage report (90% threshold enforced).

### `npm run test:e2e`

Runs Playwright end-to-end tests (starts dev server automatically).

---

## Testing Documentation

### Example Test Files

#### Unit Test

Tests pure logic and utilities in isolation (no React/DOM):

**File:** `src/utils/formatting.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { getInitials } from './formatting';

describe('getInitials (Unit Test)', () => {
  it('returns first letters of each word, capitalized', () => {
    expect(getInitials('Margaret Johnson')).toBe('MJ');
  });

  it('limits to 2 characters', () => {
    expect(getInitials('John Paul Smith')).toBe('JP');
  });

  it('returns empty string for empty input', () => {
    expect(getInitials('')).toBe('');
  });
});
```

#### Component Test (React Testing Library)

Tests React components, user interactions, and accessibility:

**File:** `src/components/PatientCard.test.jsx`

```javascript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PatientCard from './PatientCard';

const mockPatient = {
  id: '1',
  name: 'Margaret Johnson',
  age: 78,
  status: 'Stable',
  alerts: 0,
  condition: 'Diabetes Type 2',
  heartRate: '72',
  bloodPressure: '120/80',
  adherence: '95',
  lastUpdate: '2 hours ago',
};

describe('PatientCard', () => {
  it('renders patient name and age', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Margaret Johnson, 78/)).toBeInTheDocument();
  });

  it('renders View Details link with correct href', () => {
    render(
      <MemoryRouter>
        <PatientCard patient={mockPatient} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /View details for Margaret Johnson/i });
    expect(link).toHaveAttribute('href', '/patient/1');
  });
});
```

#### End-to-End Test (Playwright)

Tests full user flows in a real browser:

**File:** `e2e/app.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('CareConnect Web App', () => {
  test('homepage loads and shows Caregiver Dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Caregiver Dashboard/i })).toBeVisible();
  });

  test('navigates to Patients page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Patients/i }).click();
    await expect(page).toHaveURL(/\/patients/);
    await expect(page.getByRole('heading', { name: /Patients/i })).toBeVisible();
  });

  test('patient card links to patient details', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /View details for Margaret Johnson/i }).click();
    await expect(page).toHaveURL(/\/patient\/1/);
  });
});
```

---

### Passing Test Suite

Run `npm run test:run` to produce output like:

```
 RUN  v2.1.9

 ✓ src/utils/formatting.test.js (5 tests)
 ✓ src/components/PageMeta.test.jsx (5 tests)
 ✓ src/components/StatCard.test.jsx (4 tests)
 ✓ src/components/TaskItem.test.jsx (5 tests)
 ✓ src/components/PatientCard.test.jsx (6 tests)
 ✓ src/components/Layout.test.jsx (4 tests)
 ✓ src/components/TopNav.test.jsx (5 tests)
 ✓ src/components/OfflineBanner.test.jsx (4 tests)
 ✓ src/App.test.jsx (1 test)
 ✓ src/pages/Login.test.jsx (6 tests)
 ✓ src/pages/Dashboard.test.jsx (7 tests)
 ✓ src/pages/Patients.test.jsx (4 tests)
 ✓ src/pages/Messages.test.jsx (9 tests)
 ✓ src/pages/PatientDetails.test.jsx (9 tests)
 ✓ src/pages/Schedule.test.jsx (3 tests)
 ✓ src/pages/Reports.test.jsx (3 tests)

 Test Files  16 passed (16)
      Tests  80 passed (80)
```

**Screenshot:** Capture your terminal after running `npm run test:run` to include as proof of passing tests.

---

### Test Strategy

CareConnect uses a **three-layer testing pyramid**:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Unit** | Vitest | Fast, isolated tests for pure functions and utilities. No React or DOM. |
| **Component** | Vitest + React Testing Library | Test component rendering, user interactions, and accessibility. Query by roles and labels. |
| **E2E** | Playwright | Full browser tests for critical user journeys (navigation, forms, flows). |

**Principles:**
1. **Unit tests** – Test one thing, mock nothing (or minimal). Example: `getInitials()`.
2. **Component tests** – Test behavior users see. Use `getByRole` and `getByLabelText` over implementation details.
3. **E2E tests** – Cover happy paths and critical flows. Keep them fast and stable.

**Coverage:** 90% minimum for lines, functions, branches, and statements (enforced in `vite.config.js`).

---

## Learn More

- [Vite documentation](https://vitejs.dev/)
- [React documentation](https://reactjs.org/)
