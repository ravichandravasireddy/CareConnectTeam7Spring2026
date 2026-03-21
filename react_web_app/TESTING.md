# CareConnect Testing Guide

## Test Strategy

CareConnect uses a **three-layer testing pyramid**:

1. **Unit Tests** – Fast, isolated tests for pure logic and utilities
2. **Component Tests** – React Testing Library tests for UI components and user interactions
3. **End-to-End (E2E) Tests** – Playwright tests for full user flows in a real browser

### Unit & Component Tests (Vitest + React Testing Library)

- **Framework**: Vitest (Jest-compatible API – same `describe`, `it`, `expect` syntax) with React Testing Library
- **Location**: Co-located with source (`*.test.jsx` next to components)
- **Run**: `npm run test` (watch) or `npm run test:run` (single run)
- **Coverage**: `npm run test:coverage` – enforces **90% minimum** for lines, functions, branches, and statements

### E2E Tests (Playwright)

- **Framework**: Playwright
- **Location**: `e2e/*.spec.js`
- **Run**: `npm run test:e2e` (starts dev server automatically)
- **Browsers**: Chromium (configurable in `playwright.config.js`)

---

## Example Test Files

| Type | File | Purpose |
|------|------|---------|
| App | `src/App.test.jsx` | Root app and routing |
| Component | `src/components/StatCard.test.jsx` | Stat display card |
| Component | `src/components/PatientCard.test.jsx` | Patient card with links |
| Component | `src/components/TaskItem.test.jsx` | Task list item and actions |
| Component | `src/components/Layout.test.jsx` | Layout, skip link, nav |
| Component | `src/components/TopNav.test.jsx` | Top nav, PWA install |
| Component | `src/components/PageMeta.test.jsx` | SEO metadata |
| Component | `src/components/OfflineBanner.test.jsx` | Offline indicator |
| Page | `src/pages/Login.test.jsx` | Login form |
| Page | `src/pages/Dashboard.test.jsx` | Dashboard content |
| Page | `src/pages/Patients.test.jsx` | Patients list |
| Page | `src/pages/Messages.test.jsx` | Messaging |
| Page | `src/pages/PatientDetails.test.jsx` | Patient details |
| Page | `src/pages/Schedule.test.jsx` | Schedule |
| Page | `src/pages/Reports.test.jsx` | Reports |
| E2E | `e2e/app.spec.js` | Full app navigation flows |

---

## Coverage Report

### Minimum 90% Overall Coverage

Coverage thresholds are configured in `vite.config.js`:

```js
thresholds: {
  lines: 90,
  functions: 90,
  branches: 90,
  statements: 90,
}
```

### Intentionally Excluded Areas

| Path/Pattern | Reason |
|--------------|--------|
| `src/main.jsx` | App entry point; no business logic |
| `src/reportWebVitals.js` | Vite/analytics bootstrap; not app logic |
| `**/*.test.{js,jsx}` | Test files themselves |
| `**/setupTests.js` | Test environment setup |

These exclusions keep coverage focused on application code and avoid penalizing infrastructure.

---

## Quick Commands

```bash
# Unit + component tests (watch)
npm run test

# Unit + component tests (single run)
npm run test:run

# Coverage report (75% threshold)
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

---

## Screenshots for Documentation

To capture the required screenshots for your submission:

### 1. Passing Test Suite
Run `npm run test:run` and take a screenshot of the terminal showing:
```
Test Files  15 passed (15)
     Tests  75 passed (75)
```

### 2. Coverage Summary (≥90%)
Run `npm run test:coverage` and capture:
- The terminal coverage table, or
- Open `coverage/index.html` in a browser and screenshot the summary

### 3. E2E Tests (Optional)
Run `npm run test:e2e` and screenshot the Playwright output showing all tests passed.
