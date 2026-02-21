# CareConnect Team7 Spring2026 — Electron Desktop Application

## Description

**CareConnect** is a HIPAA-compliant desktop application (Electron) that connects patients (care recipients) and their caregivers for remote health management and coordination. The desktop app mirrors the core flows of the mobile apps: welcome, role selection, sign in, registration, and a caregiver dashboard with patient overview, patient detail, and communication center.

The app is built with accessibility in mind (WCAG 2.1 AA), including keyboard navigation, skip links, focus indicators, and screen reader support, so caregivers who are deaf or hard of hearing can manage tasks and coordinate care without relying on audio.

## Team Members

- Dominique Rattray (Team Lead)
- Ravichandra Vasireddy
- Jordene Downer

## Team Charter

Link: [Team Charter](https://docs.google.com/document/d/1xMF6upCBABr3dtR3aLjk2lLUWFN1IEbwB-vC6tYJCB8/edit?usp=sharing)

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)

To check your versions:

```bash
node --version
npm --version
```

## Setup and Run Instructions (From Scratch)

### 1. Clone the repository

```bash
git clone <repository-url>
cd CareConnectTeam7Spring2026
```

### 2. Navigate to the Electron app

```bash
cd electron_app
```

### 3. Install dependencies

```bash
npm install
```

This installs Electron and all required packages into `node_modules`.

### 4. Run the app

```bash
npm start
```

The CareConnect desktop window will open. You can sign in with the mock credentials:

- **Patient:** `patient@careconnect.demo` / `password123`
- **Caregiver:** `caregiver@careconnect.demo` / `password123`

## Project Structure

```
electron_app/
├── index.js          # Main process (window, menu, IPC)
├── preload.js        # Preload script (context bridge)
├── package.json      # Dependencies and scripts
├── renderer/
│   ├── index.html    # App UI
│   ├── styles.css    # Styles
│   └── app.js        # Renderer logic (auth, dashboard, navigation)
├── KEYBOARD-SHORTCUTS.md   # Keyboard shortcuts reference
└── WCAG-AUDIT.md     # Accessibility audit
```

## How to Run Tests

From the `electron_app` directory:

```bash
npm test
```

*(Note: Test suite is not yet configured. Add unit or E2E tests as needed.)*

## Related Documentation

- [Keyboard Shortcuts](KEYBOARD-SHORTCUTS.md) — Navigation and menu shortcuts
- [WCAG Audit](WCAG-AUDIT.md) — Accessibility audit results
