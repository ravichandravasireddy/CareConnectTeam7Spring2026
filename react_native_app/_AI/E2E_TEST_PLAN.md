# End-to-End Test Plan for React Native CareConnect App

## Overview

This document outlines a comprehensive end-to-end (E2E) test plan for the React Native CareConnect application (Expo). E2E tests verify complete user workflows from start to finish, ensuring that all components work together correctly in realistic scenarios. The plan mirrors the Flutter app's E2E scope and priorities, adapted for Maestro and the React Native / expo-router stack.

## Test Scope

### In Scope

- Complete user journeys across authentication, patient workflows, and caregiver workflows
- Navigation flows between screens (expo-router routes)
- Data persistence and state management across screens
- Critical user interactions (CRUD operations)
- Cross-cutting features (notifications, preferences, accessibility)
- Error handling and edge cases

### Out of Scope (for E2E tests)

- Unit tests for individual components (already covered in `__tests__/` with Jest and React Native Testing Library)
- Component-level rendering tests (covered by existing tests)
- Provider/context logic in isolation (covered by unit tests)
- Performance testing (separate concern)
- Visual regression testing (separate tooling)

## Test Infrastructure

### Tools & Framework

- **Framework**: Maestro (mobile UI testing framework; works with React Native and Expo)
- **Test Runner**: `maestro test` or `maestro cloud`
- **Test Format**: YAML files (`.yaml` or `.yml`)
- **Installation**:
  - Install Maestro CLI: `curl -Ls "https://get.maestro.mobile.dev" | bash` (macOS/Linux) or `npm install -g @maestro/cli`
  - Verify: `maestro --version`
- **Mocking Strategy**:
  - Use existing app providers and mock data where the app already supports demo credentials
  - Test data is fixed (patient/caregiver credentials) for consistent runs
- **Test Data**:
  - Patient: `patient@careconnect.demo` / `password123`
  - Caregiver: `caregiver@careconnect.demo` / `password123`

### Test Organization

```
react_native_app/
├── .maestro/
│   ├── config.yaml           # Maestro configuration (appId, flows)
│   ├── helpers/
│   │   ├── test_data.yaml         # Test data constants (or use runScript for JS)
│   │   └── common_flows/          # Reusable flows
│   │       ├── sign_in_patient.yaml
│   │       └── sign_in_caregiver.yaml
│   └── flows/
│       ├── auth/
│       │   ├── sign_in_patient.yaml
│       │   ├── sign_in_caregiver.yaml
│       │   ├── invalid_credentials.yaml
│       │   ├── registration.yaml
│       │   └── sign_out.yaml
│       ├── patient/
│       │   ├── dashboard.yaml
│       │   ├── view_complete_task.yaml
│       │   ├── add_health_log.yaml
│       │   ├── view_health_timeline.yaml
│       │   ├── create_note.yaml
│       │   ├── view_calendar.yaml
│       │   ├── update_profile.yaml
│       │   └── preferences.yaml
│       ├── caregiver/
│       │   ├── dashboard.yaml
│       │   ├── manage_tasks.yaml
│       │   ├── patient_monitoring.yaml
│       │   ├── analytics.yaml
│       │   └── emergency_sos.yaml
│       ├── cross_cutting/
│       │   ├── notifications.yaml
│       │   ├── navigation.yaml
│       │   ├── video_call.yaml
│       │   └── messaging.yaml
│       └── error_handling/
│           ├── validation.yaml
│           └── empty_states.yaml
```

### Maestro Configuration

- **Platform**: Android (primary); iOS optional when building for simulator.
- **App ID**: `com.anonymous.react_native_app` (from `app.json`).
- **App Path**: Expo build output, e.g. `android/app/build/outputs/apk/debug/app-debug.apk` when building from a prebuild copy, or pass via `--app` when running tests.
- **Device**: Android emulator or physical device; verify with `maestro device list`.
- **Tags**: Use `tags` in YAML for filtering (e.g. `["P0", "auth", "patient"]`). Run with `maestro test .maestro/flows/ --tags "P0"`.

### Maestro Test Structure Examples

#### Basic test (welcome → sign in as patient)

```yaml
appId: com.anonymous.react_native_app
tags: ["P0", "auth", "patient"]
---
- launchApp
- assertVisible: "Get Started"
- tapOn: "Sign In"
- waitForAnimationToEnd
- assertVisible: ".*Welcome Back.*"
- assertVisible: "Email Address"
- tapOn:
    id: "email_input"  # or placeholder text
- inputText: "patient@careconnect.demo"
- assertVisible: "Password"
- tapOn:
    id: "password_input"
- inputText: "password123"
- hideKeyboard
- tapOn: "Sign In"
- waitForAnimationToEnd
- assertVisible: "Home"
- assertVisible: ".*Robert.*"
- assertVisible: ".*Tasks.*"
- assertVisible: ".*BP Today.*"
```

#### Reusable flow (common_flows/sign_in_patient.yaml)

```yaml
appId: com.anonymous.react_native_app
---
- launchApp
- assertVisible: "Sign In"
- tapOn: "Sign In"
- waitForAnimationToEnd
- assertVisible: ".*Welcome Back.*"
- tapOn: "your.email@example.com"
- inputText: "patient@careconnect.demo"
- tapOn: "Enter your password"
- inputText: "password123"
- hideKeyboard
- tapOn: "Sign In"
- waitForAnimationToEnd
- assertVisible: "Home"
```

#### Composition (patient dashboard using runFlow)

```yaml
appId: com.anonymous.react_native_app
tags: ["P0", "patient"]
---
- runFlow: ".maestro/helpers/common_flows/sign_in_patient.yaml"
- assertVisible: "Home"
- assertVisible: ".*Robert.*"
- assertVisible: "Tasks"
- assertVisible: "BP Today"
- assertVisible: "Upcoming Tasks"
```

#### Invalid credentials

```yaml
appId: com.anonymous.react_native_app
tags: ["P0", "auth"]
---
- launchApp
- tapOn: "Sign In"
- tapOn: "Care Recipient"
- inputText: "invalid@example.com"
- inputText: "wrongpassword"
- tapOn: "Sign In"
- assertVisible:
    text: ".*Invalid.*"
    timeout: 5000
```

## Test Scenarios

Screen names below refer to expo-router routes and UI: index (welcome), role-selection, sign-in, registration, patient (dashboard), caregiver (dashboard), and feature routes under `app/`. UI text matches the React Native app (e.g. "Get Started", "Sign In", "Care Recipient", "Caregiver", "Welcome Back", "Email Address", "Password", "Home", "Tasks", "BP Today", "Upcoming Tasks", "Robert").

### 1. Authentication & Onboarding Flows

#### 1.1 Welcome Screen → Sign In Flow (Patient)

**Priority**: High  
**Description**: User starts at welcome screen and successfully signs in as a patient.

**Steps**:

1. Launch app → Verify welcome screen (index) is displayed
2. Verify "Get Started" and "Sign In" are visible
3. Tap "Sign In" → Verify role selection or sign-in screen
4. Select "Care Recipient" if shown → Verify sign-in screen ("Welcome Back", "Email Address", "Password")
5. Enter valid patient credentials (`patient@careconnect.demo` / `password123`)
6. Tap "Sign In"
7. Verify successful authentication
8. Verify navigation to patient dashboard (/patient)
9. Verify user name is displayed ("Robert" or "Robert Williams")

**Expected Results**:

- All screens render correctly
- Navigation transitions smoothly
- Authentication state persists
- User role is set to patient

**Edge Cases to Test**:

- Invalid email format
- Password too short
- Wrong credentials
- Empty fields

#### 1.2 Welcome Screen → Registration Flow

**Priority**: High  
**Description**: New user registers for an account.

**Steps**:

1. Launch app → Welcome screen
2. Tap "Get Started" → Role selection
3. Select "Care Recipient" → Registration screen
4. Fill in registration form (First Name, Last Name, Email, Phone, Password)
5. Tap "Register"
6. Verify registration success and automatic sign-in
7. Verify navigation to patient dashboard

**Expected Results**:

- Form validation works
- Registration completes and user is authenticated
- Dashboard displays correctly

**Edge Cases to Test**:

- Duplicate email, invalid phone, password validation, missing required fields

#### 1.3 Caregiver Sign In Flow

**Priority**: High  
**Description**: Caregiver signs in and accesses caregiver dashboard.

**Steps**:

1. Launch app → Welcome screen
2. Navigate to sign-in (e.g. "Sign In" then "Caregiver")
3. Enter caregiver credentials (`caregiver@careconnect.demo` / `password123`)
4. Tap "Sign In"
5. Verify navigation to caregiver dashboard (/caregiver)
6. Verify caregiver-specific UI (e.g. "Today's Tasks", greeting with "Dr. Sarah Johnson" or similar)
7. Verify caregiver bottom navigation (Home, Tasks, Analytics, Monitor)

**Expected Results**:

- Correct role assignment
- Caregiver dashboard and navigation are shown

#### 1.4 Sign Out Flow

**Priority**: Medium  
**Description**: Authenticated user signs out and returns to welcome screen.

**Steps**:

1. Sign in as patient or caregiver
2. Open drawer/menu
3. Tap "Sign Out"
4. Confirm if required
5. Verify authentication cleared and navigation to welcome screen
6. Verify protected screens are inaccessible without re-authentication

**Expected Results**:

- Session cleared, welcome screen displayed, protected routes inaccessible

### 2. Patient User Flows

#### 2.1 Patient Dashboard Overview

**Priority**: High  
**Description**: Patient views dashboard and sees key information.

**Steps**:

1. Sign in as patient
2. Verify patient dashboard is displayed (/patient)
3. Verify greeting and user name
4. Verify "Upcoming Tasks" section
5. Verify "Today's Appointments" or equivalent if present
6. Verify bottom navigation (Home, Tasks, Health, Profile)
7. Verify all tabs are accessible

**Expected Results**:

- Dashboard loads, task/appointment info shown, navigation works

#### 2.2 View and Complete Task

**Priority**: High  
**Description**: Patient views task details and marks task as completed.

**Steps**:

1. Sign in as patient, go to dashboard
2. Find a task in "Upcoming Tasks", tap task card
3. Verify task details screen
4. Verify task title, description, date
5. Mark as completed if action exists
6. Return to dashboard and verify task state updated

**Expected Results**:

- Task details accurate, completion persists, navigation works

**Edge Cases**: Empty task list, multiple tasks

#### 2.3 Add Health Log Entry

**Priority**: High  
**Description**: Patient records a health log (e.g. mood, blood pressure).

**Steps**:

1. Sign in as patient, navigate to Health tab/screen
2. Verify health logs screen
3. Tap "Add a Log" (or equivalent)
4. Select log type (e.g. Mood), fill details, save
5. Verify success and new entry in list

**Expected Results**:

- Log saved, appears in list with correct data

**Edge Cases**: Invalid values, missing fields

#### 2.4 View Health Timeline

**Priority**: Medium  
**Description**: Patient views health timeline with historical entries.

**Steps**:

1. Sign in as patient, go to Health
2. Open timeline view if available
3. Verify entries and order
4. Tap an entry and verify details if applicable

**Expected Results**:

- Timeline loads, entries ordered correctly, navigation works

#### 2.5 Create and View Note

**Priority**: Medium  
**Description**: Patient creates a note and views it in the notes list.

**Steps**:

1. Sign in as patient, navigate to Notes
2. Tap add note, enter title and content, save
3. Verify note in list and detail view

**Expected Results**:

- Note saved, appears in list and detail with correct content

**Edge Cases**: Empty note, long content, special characters

#### 2.6 View Calendar and Tasks

**Priority**: Medium  
**Description**: Patient views calendar and tasks for dates.

**Steps**:

1. Sign in as patient, navigate to Calendar
2. Verify current month and task indicators
3. Tap a date with tasks, verify task list
4. Change month and verify data

**Expected Results**:

- Calendar renders, task indicators and date selection work

#### 2.7 View and Update Profile

**Priority**: Medium  
**Description**: Patient views profile and updates information.

**Steps**:

1. Sign in as patient, go to Profile tab
2. Verify profile data
3. Edit profile, save, verify updated data

**Expected Results**:

- Profile loads, edit and save work, validation for invalid inputs

#### 2.8 Access Preferences and Accessibility Settings

**Priority**: Medium  
**Description**: Patient accesses and modifies preferences.

**Steps**:

1. Sign in as patient, open menu, go to Preferences
2. Modify settings (e.g. text size, date format)
3. Save and verify persistence and UI application

**Expected Results**:

- Preferences screen works, settings persist and apply

### 3. Caregiver User Flows

#### 3.1 Caregiver Dashboard Overview

**Priority**: High  
**Description**: Caregiver views dashboard with patient stats and tasks.

**Steps**:

1. Sign in as caregiver
2. Verify caregiver dashboard (/caregiver)
3. Verify greeting and stats (patients, tasks, alerts)
4. Verify "Today's Tasks" and task cards with patient names
5. Verify "Manage" or equivalent

**Expected Results**:

- Dashboard loads, stats and tasks displayed, navigation present

#### 3.2 Manage Tasks (Caregiver)

**Priority**: High  
**Description**: Caregiver views and manages tasks for all patients.

**Steps**:

1. Sign in as caregiver, go to dashboard
2. Tap "Manage" (or navigate to task management)
3. Verify task list for all patients
4. Tap a task, verify details, update status if applicable
5. Return and verify status updated

**Expected Results**:

- Task management screen loads, tasks visible, details and updates persist

**Edge Cases**: Empty list, multiple patients, overdue/completed filtering

#### 3.3 View Patient Monitoring

**Priority**: High  
**Description**: Caregiver monitors patient health data.

**Steps**:

1. Sign in as caregiver, go to Monitor tab/screen
2. Verify patient list and key info
3. Tap a patient, verify details and health metrics if shown

**Expected Results**:

- Patient list and details load, navigation works

#### 3.4 View Analytics

**Priority**: Medium  
**Description**: Caregiver views analytics and reports.

**Steps**:

1. Sign in as caregiver, navigate to Analytics
2. Verify analytics screen and charts/filters/export if implemented

**Expected Results**:

- Screen loads, visualizations and filters work

#### 3.5 Respond to Emergency SOS Alert

**Priority**: Critical  
**Description**: Caregiver receives and acknowledges an emergency alert.

**Steps**:

1. Sign in as caregiver
2. Trigger or simulate SOS alert
3. Verify alert screen/notification and details
4. Acknowledge alert and verify state updated

**Expected Results**:

- Alert displayed, acknowledgment works, state persists

**Edge Cases**: Multiple alerts, timeout, cancellation

### 4. Cross-Cutting Features

#### 4.1 Notification System

**Priority**: High  
**Description**: User receives and interacts with notifications.

**Steps**: Sign in, verify notification badge/icon, open notifications list, verify read/unread, tap notification, mark as read, verify badge update.

**Expected Results**: Notifications display correctly, read state and navigation work.

**Edge Cases**: Empty list, long text, missing data

#### 4.2 Navigation and Drawer Menu

**Priority**: High  
**Description**: User navigates via drawer and bottom navigation.

**Steps**: Sign in as patient, open drawer, verify menu items (Dashboard, Tasks, Calendar, Health Logs, Notes, Profile, Preferences, Sign Out), navigate via drawer and bottom tabs, verify active state.

**Expected Results**: Drawer and tabs work, menu is role-appropriate.

**Edge Cases**: Navigation during load, deep stack, back button

#### 4.3 Video Call Feature

**Priority**: Medium  
**Description**: User initiates and participates in a video call.

**Steps**: Sign in, go to video call screen, verify UI and camera, start call, test mute/camera/end call.

**Expected Results**: Video UI loads, controls work, call ends correctly.

**Edge Cases**: Permission denied, network issues

#### 4.4 Messaging Thread

**Priority**: Medium  
**Description**: User sends and receives messages.

**Steps**: Sign in, open messaging, verify thread, send message, verify it appears and persistence.

**Expected Results**: Thread loads, send works, order and timestamps correct.

**Edge Cases**: Empty thread, long/special characters

### 5. Error Handling & Edge Cases

#### 5.1 Network Error Handling

**Priority**: Medium  
**Description**: App handles network errors gracefully.

**Steps**: Simulate failure (if supported), sign in, load data, verify error message and retry if present; restore network and verify data loads.

**Expected Results**: User-friendly errors, no crash, retry and recovery work.

#### 5.2 Empty States

**Priority**: Medium  
**Description**: App shows appropriate empty states (tasks, health logs, notes, notifications, patient list for caregiver).

**Expected Results**: Empty state messages and add-content actions are present.

#### 5.3 Data Validation

**Priority**: High  
**Description**: App validates input (email, password, phone, health values, required fields).

**Expected Results**: Validation errors shown clearly, invalid data not saved.

#### 5.4 Session Management

**Priority**: High  
**Description**: App handles session expiration and re-authentication.

**Steps**: Sign in, use app, simulate expiration if possible, verify re-auth prompt and state restoration.

**Expected Results**: Session expiry handled, re-auth prompted, state restored where applicable.

### 6. Accessibility & Usability

#### 6.1 Screen Reader Support

**Priority**: High  
**Description**: App is usable with screen readers (TalkBack/VoiceOver). In Maestro, use element IDs or accessibility labels where the app exposes them for stable selectors.

**Expected Results**: Interactive elements announced, labels descriptive, order logical.

#### 6.2 High Contrast Mode

**Priority**: Medium  
**Description**: App works with high contrast preferences.

**Expected Results**: Text readable, elements visible, contrast adequate.

#### 6.3 Text Scaling

**Priority**: Medium  
**Description**: App handles text scaling (largest setting in preferences).

**Expected Results**: Text scales, layout adapts, no cut-off or overlap.

## Test Execution Strategy

### Test Prioritization

1. **Critical Path (P0)**: Authentication, core patient and caregiver dashboards and sign-in
2. **High Priority (P1)**: Task management, health logs, notifications
3. **Medium Priority (P2)**: Analytics, preferences, messaging, calendar, notes, profile
4. **Low Priority (P3)**: Edge cases, error handling, accessibility edge cases

### Maestro Test Execution Commands

#### Local execution

```bash
# Run a single flow
maestro test .maestro/flows/auth/sign_in_patient.yaml

# Run all flows in a directory
maestro test .maestro/flows/auth/

# Run all flows
maestro test .maestro/flows/

# Run flows with specific tags
maestro test .maestro/flows/ --tags "P0"
maestro test .maestro/flows/ --tags "P0,P1"

# Run on specific device
maestro test .maestro/flows/auth/sign_in_patient.yaml --device "emulator-5554"

# Run with explicit app path
maestro test .maestro/flows/auth/sign_in_patient.yaml --app path/to/app-debug.apk
```

#### CI/CD

- Ensure emulator or device is available; install app or pass `--app` to `maestro test`.
- Example: `maestro test .maestro/flows/auth/ --format junit > test-results.xml` for JUnit output.

#### Maestro Cloud

```bash
maestro cloud .maestro/flows/auth/sign_in_patient.yaml
maestro cloud .maestro/flows/ --env production
```

### Test Execution Frequency

- **Pre-commit**: Run P0 (e.g. auth flows): `maestro test .maestro/flows/auth/`
- **Pre-merge**: Run P0 + P1: `maestro test .maestro/flows/ --tags "P0,P1"`
- **Nightly**: Full suite
- **Release**: Full suite plus manual smoke

### Test Data Management

- Define test data in `.maestro/helpers/test_data.yaml` or use `runScript` with a JS file for dynamic data (e.g. credentials)
- Reuse sign-in via `runFlow: ".maestro/helpers/common_flows/sign_in_patient.yaml"`
- Use Maestro `env` in flow YAML for variables (e.g. `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`)
- Keep test data in sync with app (demo credentials, mock data)

### Test Maintenance

- Update YAML flows when UI text or element IDs change
- Use element IDs or accessibility-based selectors where available for stability
- Refactor common flows into `.maestro/helpers/common_flows/`
- Use Maestro Studio for visual test creation and debugging

## Success Criteria

### Coverage Goals

- **Critical Paths**: 100% coverage
- **High Priority Features**: 90% coverage
- **Overall E2E Coverage**: 70%+ of user journeys

### Quality Metrics

- **Test Stability**: >95% pass rate on stable builds
- **Test Execution Time**: <10 minutes for full suite
- **Flakiness**: <2% flaky test rate
- **Maintenance**: Tests updated within 1 sprint of feature changes

## Dependencies & Prerequisites

### Required Setup

- **Maestro CLI**: Install via `curl -Ls "https://get.maestro.mobile.dev" | bash` (macOS/Linux) or `npm install -g @maestro/cli`; verify with `maestro --version`
- **Expo/React Native**: App must be built to an APK or IPA (Expo dev build or production). Maestro runs against the built app, not Expo Go.
- **Android** (for Android E2E):
  - Android SDK installed; ADB accessible (`adb devices`)
  - Emulator running or physical device connected
  - Build APK: e.g. from a prebuild copy run `cd android && ./gradlew assembleDebug`, or use EAS Build; then use `--app path/to/app-debug.apk` when running tests
- **Device/Emulator**: Verify with `maestro device list`

### Test Environment

- **Device/Emulator**: Android emulator or physical device; iOS simulator or device (macOS) if testing iOS
- **App**: Installed on device or passed to `maestro test --app <path>`
- **Test Data**: Same credentials as above (patient/caregiver)

### Optional

- **Maestro Studio**: Visual test creation and debugging — https://maestro.mobile.dev/studio
- **Maestro Cloud**: Cloud-based test execution — https://cloud.mobile.dev

## Future Enhancements

- **Maestro Cloud**: Run tests on cloud infrastructure, cross-platform (iOS/Android), parallel execution, test result dashboards
- **Visual regression**: Use Maestro screenshot capabilities (`takeScreenshot`) and compare across builds
- **Performance**: Measure app launch time and screen load during Maestro runs if supported
- **Reporting**: JUnit output (`--format junit`) for CI; Maestro Cloud dashboards
- **Notifications**: Slack or email on E2E failure via CI integration
- **Test data**: Centralized test data (YAML or runScript), dynamic generation, env-based config
- **Maestro Studio**: Visual test authoring, element inspector, test debugging and replay

## Notes

- This plan should be reviewed and updated as the app evolves
- Prioritize scenarios by business value and risk
- Add tests for new features as they are developed
- Balance coverage with execution time and maintainability
- Keep flows readable and stable (prefer element IDs and accessibility-based selectors where available)
