# Detox E2E Testing Plan — React Native (CareConnect)

This plan describes how to set up and run end-to-end (E2E) tests for the React Native CareConnect app using **Detox**, aligned with the screen flows already covered by Maestro in the Flutter app.

---

## 1. Overview

### 1.1 Goal

- Add Detox to the **React Native** app (`react_native_app`) to run E2E tests for screen flows (auth, patient, caregiver, cross-cutting).
- Mirror the flow coverage of the Flutter app’s Maestro tests where applicable.
- Do **not** modify app screens for this plan beyond adding `testID`/accessibility where needed for selectors; the plan focuses on setup and test design.

### 1.2 Current Stack

- **Framework:** React Native with **Expo** (SDK 54), **expo-router** for navigation.
- **Entry:** `expo-router/entry` (see `react_native_app/package.json`).
- **Existing tests:** Jest + React Native Testing Library (unit/component tests in `__tests__`).
- **E2E reference:** Flutter app uses Maestro (`.maestro/` flows).

### 1.3 Detox + Expo

- Detox runs against a **built app** (simulator/emulator or device), not the Expo dev server.
- **Expo:** Use either:
  - **EAS Build** to produce a development or production build (recommended), or
  - **Expo dev client** (`expo-dev-client`) and a local development build.
- Detox does **not** drive the Expo Go app; you need a custom build that includes your app code.

---

## 2. React Native App — Screens and Routes

### 2.1 Route Map (from `app/_layout.tsx` and `app/`)

| Route | Screen / Purpose |
|-------|-------------------|
| `/` (`index`) | Welcome — “Get Started”, “Sign In”, “Navigation Hub” |
| `/role-selection` | Select role: Care Recipient / Caregiver |
| `/sign-in` | Sign In (email/password; demo credentials) |
| `/registration` | Create Account (params: role) |
| `/patient` | Patient dashboard (tabs: Home, etc.) |
| `/patient/profile` | Patient profile |
| `/patient/messages` | Patient messages |
| `/caregiver` | Caregiver dashboard (tabs: Home, Tasks, Analytics, Monitor) |
| `/caregiver/tasks` | Caregiver task management |
| `/caregiver/analytics` | Caregiver analytics |
| `/caregiver/monitor` | Caregiver patient monitoring |
| `/calendar` | Calendar |
| `/health-logs` | Health logs |
| `/health-timeline` | Health timeline |
| `/notes` | Notes list |
| `/notes/add` | Add note |
| `/notes/[id]` | Note detail |
| `/notifications` | Notifications |
| `/task-details` | Task details (params: taskId) |
| `/video-call` | Video call |
| `/emergency-sos` | Emergency SOS |
| `/preferences-accessibility` | Preferences / accessibility |
| `/navigation-hub` | Dev navigation hub |

### 2.2 Key UI Text / Elements (for selectors)

- **Welcome:** “CareConnect”, “Get Started”, “Sign In” (buttons have `accessibilityLabel` “Get started”, “Sign in”).
- **Role selection:** “Select Your Role”, “Care Recipient”, “Caregiver”, “How will you use CareConnect?”.
- **Sign-in:** “Welcome Back”, “Email Address”, “Password”, “Sign In”, “Sign Up”, “Forgot Password?”; placeholders “your.email@example.com”, “Enter your password”.
- **Demo credentials:** Patient: `patient@careconnect.demo` / `password123`; Caregiver: `caregiver@careconnect.demo` / `password123`.
- **Patient dashboard:** “Home”, “Robert Williams”, tasks, “BP Today”, etc.
- **Caregiver dashboard:** “Patients”, “Tasks”, “Alerts”, greeting, “Today’s Tasks”, etc.

Many screens already use `accessibilityLabel`; adding `testID` on key buttons and inputs will make Detox selectors stable.

---

## 3. Detox Setup — Steps You Can Take

### Step 1: Prerequisites

- **Node.js** 18+ (match project).
- **Android:** Android Studio, SDK, emulator or device; `ANDROID_HOME` set.
- **iOS (macOS only):** Xcode, simulator; `applesimutils`:  
  `brew tap wix/brew && brew install --HEAD applesimutils`
- **Expo:** Ensure you can run `npx expo start` and build (EAS or local) from `react_native_app`.

### Step 2: Install Detox

From **`react_native_app`**:

```bash
cd react_native_app
npm install --save-dev detox jest-circus
```

If you use Jest for E2E (recommended):

```bash
npm install --save-dev detox
```

(Detox can use Jest or Mocha; Jest aligns with your existing tests.)

### Step 3: Initialize Detox

```bash
cd react_native_app
npx detox init -r jest
```

This typically creates:

- `.detoxrc.js` (or `.detoxrc.json`) — Detox config.
- `e2e/` (or similar) — E2E test folder with an example spec and `setup.js` (or `jest.setup.js`).

### Step 4: Configure Detox for Expo

- **App binary:** Point Detox to the **built** app (Expo dev build or EAS build), not Expo Go.
- **Android:** Use the `.apk` or `.aab` path from your build output (e.g. `android/app/build/outputs/apk/...` or EAS artifact).
- **iOS:** Use the `.app` path from the simulator build (e.g. `ios/build/Build/Products/.../YourApp.app`).

Example **`.detoxrc.js`** (adjust paths and app name to your Expo app name):

```js
module.exports = {
  testRunner: {
    type: 'jest',
    options: {
      config: 'e2e/jest.config.js',
      timeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'path/to/YourApp.app',  // from Expo build
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'path/to/app-debug.apk', // from Expo/Android build
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 16', os: 'iOS 18.1' },
    },
    emulator: {
      type: 'android.emulator',
      device: { type: 'Pixel_6_API_35', avdName: 'Pixel_6_API_35' },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
```

- Replace `binaryPath` with the actual path to your built app (EAS or `expo run:ios` / `expo run:android` output).
- Ensure `device`/`avdName` match your installed simulators/AVDs (`xcrun simctl list`, `emulator -list-avds`).

### Step 5: Build the App for E2E

- **Option A — EAS Build (recommended):**  
  - Create `eas.json` if needed, then e.g.  
    `eas build --profile development --platform ios`  
    (and similarly for Android).  
  - Download the built binary and set `binaryPath` in `.detoxrc.js` to that path (or a stable path where you copy it).

- **Option B — Local Expo dev build:**  
  - Install dev client: `npx expo install expo-dev-client`.  
  - Build: `npx expo run:ios` / `npx expo run:android`.  
  - Use the generated `.app` (iOS) or `.apk` (Android) path in `.detoxrc.js`.

### Step 6: E2E Folder Structure (aligned with Maestro-style flows)

Suggested layout under `react_native_app/e2e/`:

```
e2e/
├── jest.config.js          # Jest config for E2E (timeouts, testMatch)
├── setup.js                # globalSetup / globalTeardown if needed
├── helpers/
│   └── auth.js             # signInAsPatient(), signInAsCaregiver(), etc.
├── flows/
│   ├── auth/
│   │   ├── signIn.patient.e2e.js
│   │   ├── signIn.caregiver.e2e.js
│   │   ├── invalidCredentials.e2e.js
│   │   └── registration.e2e.js (optional)
│   ├── patient/
│   │   └── dashboard.e2e.js
│   └── caregiver/
│       └── dashboard.e2e.js
└── config/
    └── testCredentials.js   # demo emails/passwords (same as Flutter)
```

- Reuse demo credentials in `config/testCredentials.js` so flows match Flutter/Maestro.

### Step 7: Add testID Where Helpful

To avoid flaky tests, prefer **testID** for critical taps and inputs. You can add them in a separate pass (no screen logic changes):

- Welcome: `testID="welcome-get-started"`, `testID="welcome-sign-in"`.
- Role selection: `testID="role-care-recipient"`, `testID="role-caregiver"`.
- Sign-in: `testID="signin-email"`, `testID="signin-password"`, `testID="signin-submit"`, `testID="signin-sign-up"`.
- Dashboards: main heading or container `testID="patient-dashboard"` / `testID="caregiver-dashboard"`.

Use `by.id('signin-email')` etc. in Detox; fallback to `by.text(...)` where needed.

### Step 8: Write a First E2E Spec (auth flow)

Example **`e2e/flows/auth/signIn.patient.e2e.js`** (Jest + Detox):

```js
describe('Sign In (Patient)', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('opens sign-in from welcome and signs in as patient', async () => {
    await element(by.text('Sign In')).tap();
    await expect(element(by.text('Welcome Back'))).toBeVisible();
    await element(by.id('signin-email')).typeText('patient@careconnect.demo');
    await element(by.id('signin-password')).typeText('password123');
    await element(by.id('signin-submit')).tap();
    await expect(element(by.text('Home'))).toBeVisible({ timeout: 10000 });
    await expect(element(by.text('Robert Williams'))).toBeVisible();
  });
});
```

(If `testID` are not added yet, use `by.text('Sign In')`, `by.text('Email Address')` and placeholder-based taps as in your Maestro flows.)

### Step 9: Jest Config for E2E

In `e2e/jest.config.js` (or the path you use in `.detoxrc.js`):

- Set `testMatch` to your E2E specs (e.g. `**/*.e2e.js`).
- Set `testTimeout` to 120000 or higher.
- Use `detox/jest/setup` (or the setup file Detox generated) so `device`, `element`, `expect` are available.

### Step 10: Run Detox

- Start emulator/simulator, then:

```bash
cd react_native_app
detox build --configuration ios.sim.debug   # or android.emu.debug
detox test --configuration ios.sim.debug
```

- To run a single file:  
  `detox test --configuration ios.sim.debug e2e/flows/auth/signIn.patient.e2e.js`

### Step 11: Keep Unit Tests Separate

- In the **root** Jest config (e.g. `package.json` or `jest.config.js` used by `npm test`), add:

```json
"jest": {
  "modulePathIgnorePatterns": ["e2e"]
}
```

so `npm test` does not pick up Detox specs. Run E2E only via `detox test`.

---

## 4. Suggested E2E Flows (mirroring Maestro)

| Flow | Scope | Main steps |
|------|--------|------------|
| **Auth — Sign in (patient)** | P0 | Welcome → Sign In → email/password → assert Patient dashboard (Home, name) |
| **Auth — Sign in (caregiver)** | P0 | Welcome → Sign In → email/password → assert Caregiver dashboard (Patients, Tasks, Alerts) |
| **Auth — Invalid credentials** | P1 | Sign In → wrong email/password → assert error (e.g. “Invalid email or password”) |
| **Auth — Role → Registration** | P0/P1 | Get Started → Care Recipient/Caregiver → assert Create Account / Sign In link |
| **Patient — Dashboard** | P0 | Sign in as patient → assert Home, tasks, key nav |
| **Caregiver — Dashboard** | P0 | Sign in as caregiver → assert stats, Tasks, Alerts |
| **Patient — Health / Notes / Calendar** | P1 | From patient dashboard → open Health logs, Notes, Calendar → assert screens |

Implement in this order: (1) auth sign-in patient, (2) auth sign-in caregiver, (3) invalid credentials, (4) dashboards, (5) optional registration and deeper flows.

---

## 5. Checklist Summary

- [ ] Prerequisites: Node, Android Studio/Xcode, emulator/simulator, applesimutils (macOS).
- [ ] Install Detox (and Jest runner) in `react_native_app`.
- [ ] Run `detox init -r jest` and get `.detoxrc.js` + `e2e/` folder.
- [ ] Configure `.detoxrc.js` with correct app binary path (Expo build) and device.
- [ ] Build the app (EAS or `expo run:ios`/`expo run:android`) and set `binaryPath`.
- [ ] Add `e2e/jest.config.js` and optional `e2e/helpers/auth.js`, `e2e/config/testCredentials.js`.
- [ ] Add `testID` to welcome, role-selection, sign-in, and dashboard screens (optional but recommended).
- [ ] Implement `e2e/flows/auth/signIn.patient.e2e.js` (and caregiver, invalid credentials).
- [ ] Exclude `e2e` from main Jest config so `npm test` does not run E2E.
- [ ] Run `detox build` then `detox test` for one configuration; repeat for the other platform if needed.

---

## 6. References

- [Detox — Getting Started](https://wix.github.io/Detox/docs/introduction/getting-started/)
- [Detox — Jest](https://wix.github.io/Detox/docs/api/jest)
- [Expo — Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- Flutter Maestro flows: `flutter_app/.maestro/` (auth, patient, caregiver flows and README).
