# End-to-End Test Plan for Flutter CareConnect App

## Overview
This document outlines a comprehensive end-to-end (E2E) test plan for the Flutter CareConnect application. E2E tests verify complete user workflows from start to finish, ensuring that all components work together correctly in realistic scenarios.

## Test Scope

### In Scope
- Complete user journeys across authentication, patient workflows, and caregiver workflows
- Navigation flows between screens
- Data persistence and state management across screens
- Critical user interactions (CRUD operations)
- Cross-cutting features (notifications, preferences, accessibility)
- Error handling and edge cases

### Out of Scope (for E2E tests)
- Unit tests for individual components (already covered in `test/` directory)
- Widget-level rendering tests (covered by widget tests)
- Provider logic in isolation (covered by provider tests)
- Performance testing (separate concern)
- Visual regression testing (separate tooling)

## Test Infrastructure

### Tools & Framework
- **Framework**: Maestro (mobile UI testing framework)
- **Test Runner**: `maestro test` or `maestro cloud`
- **Test Format**: YAML files (`.yaml` or `.yml`)
- **Installation**: 
  - Install Maestro CLI: `curl -Ls "https://get.maestro.mobile.dev" | bash`
  - Or via npm: `npm install -g @maestro/cli`
  - NOTE: Already installed
- **Mocking Strategy**: 
  - Use existing mock providers (`AuthProvider`, `TaskProvider`, etc.)
  - Consider test-specific data seeding for consistent test runs
  - Maestro can interact with app state via tags and assertions
- **Test Data**: 
  - Mock credentials: `patient@careconnect.demo` / `password123` (patient role)
  - Mock credentials: `caregiver@careconnect.demo` / `password123` (caregiver role)

### Test Organization
```
flutter_app/
├── maestro/
│   ├── flows/
│   │   ├── auth/
│   │   │   ├── sign_in_patient.yaml          # Patient sign in flow
│   │   │   ├── sign_in_caregiver.yaml        # Caregiver sign in flow
│   │   │   ├── registration.yaml             # User registration flow
│   │   │   └── sign_out.yaml                 # Sign out flow
│   │   ├── patient/
│   │   │   ├── dashboard.yaml                # Patient dashboard overview
│   │   │   ├── view_complete_task.yaml       # View and complete task
│   │   │   ├── add_health_log.yaml          # Add health log entry
│   │   │   ├── view_health_timeline.yaml     # View health timeline
│   │   │   ├── create_note.yaml             # Create and view note
│   │   │   ├── view_calendar.yaml           # View calendar and tasks
│   │   │   ├── update_profile.yaml          # View and update profile
│   │   │   └── preferences.yaml             # Access preferences
│   │   ├── caregiver/
│   │   │   ├── dashboard.yaml               # Caregiver dashboard
│   │   │   ├── manage_tasks.yaml            # Manage tasks
│   │   │   ├── patient_monitoring.yaml      # View patient monitoring
│   │   │   ├── analytics.yaml               # View analytics
│   │   │   └── emergency_sos.yaml          # Respond to SOS alert
│   │   └── cross_cutting/
│   │       ├── notifications.yaml           # Notification system
│   │       ├── navigation.yaml              # Navigation and drawer
│   │       ├── video_call.yaml              # Video call feature
│   │       └── messaging.yaml                # Messaging thread
│   ├── helpers/
│   │   ├── common_flows.yaml                # Reusable flow snippets
│   │   └── test_data.yaml                    # Test data constants
│   └── config/
│       └── maestro.yaml                      # Maestro configuration
```

### Maestro Configuration
- **Platform**: Android
- **App Path**: ../build/app/outputs/apk/debug/app-debug.apk
- **Device**: Android Studio Phone emulator
- **Tags**: Use tags for test organization and filtering
- **Environments**: dev

### Maestro Test Structure Examples

#### Basic Test Example
```yaml
appId: com.careconnect.app
tags: ["P0", "auth", "patient"]
---
- launchApp
- assertVisible: "Get Started"
- tapOn: "Get Started"
- assertVisible: "Care Recipient"
- tapOn: "Care Recipient"
- inputText: "patient@careconnect.demo"
- tapOn: "Sign In"
- assertVisible: "Dashboard"
```

#### Advanced Test Example with Flow Composition
```yaml
appId: com.careconnect.app
tags: ["P1", "patient", "health"]
env:
  TEST_USER_EMAIL: "patient@careconnect.demo"
  TEST_USER_PASSWORD: "password123"
---
# Sign in first using reusable flow
- runFlow: "maestro/helpers/common_flows/sign_in_patient.yaml"

# Navigate to Health tab
- tapOn: 
    id: "health_tab"  # Using element ID for more reliable selection
- assertVisible: "Health Logs"

# Add health log
- tapOn: "Add a Log"
- assertVisible: "Select Log Type"
- tapOn: "Mood"
- tapOn: "😊 Happy"
- inputText: "Feeling good today"
- tapOn: "Save Log"

# Verify log was added
- assertVisible: "Health Logs"
- assertVisible: "😊 Happy"
- assertVisible: "Feeling good today"
```

#### Test with Conditional Logic and Retries
```yaml
appId: com.careconnect.app
tags: ["P0", "caregiver", "tasks"]
---
- launchApp
- runFlow: "maestro/helpers/common_flows/sign_in_caregiver.yaml"
- assertVisible: "Dashboard"

# Handle potential loading state
- tapOn: "Manage"
- waitForAnimationToEnd
- assertVisible: "Task Management"

# Scroll to find task if needed
- scroll
- tapOn: 
    text: "Morning Medication"
    optional: true  # Don't fail if not found
- assertVisible: "Task Details"
```

#### Test with Screenshots and Error Handling
```yaml
appId: com.careconnect.app
tags: ["P0", "auth"]
---
- launchApp
- takeScreenshot: "01_welcome_screen"
- tapOn: "Get Started"
- takeScreenshot: "02_role_selection"
- tapOn: "Care Recipient"
- takeScreenshot: "03_sign_in_screen"

# Test invalid credentials
- inputText: "invalid@email.com"
- inputText: "wrongpassword"
- tapOn: "Sign In"
- assertVisible: 
    text: "Invalid credentials"
    timeout: 5000

# Test valid credentials
- clearInput
- inputText: "patient@careconnect.demo"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "Dashboard"
- takeScreenshot: "04_dashboard"
```

#### Reusable Flow Example (common_flows/sign_in_patient.yaml)
```yaml
appId: com.careconnect.app
---
- launchApp
- tapOn: "Get Started"
- tapOn: "Care Recipient"
- inputText: ${TEST_USER_EMAIL}
- inputText: ${TEST_USER_PASSWORD}
- tapOn: "Sign In"
- assertVisible: "Dashboard"
```

## Test Scenarios

### 1. Authentication & Onboarding Flows

#### 1.1 Welcome Screen → Sign In Flow
**Priority**: High  
**Description**: User starts at welcome screen and successfully signs in as a patient.

**Steps**:
1. Launch app → Verify WelcomeScreen is displayed
2. Verify "Get Started" button is visible
3. Tap "Get Started" → Verify navigation to RoleSelectionScreen
4. Select "Care Recipient" role → Verify navigation to SignInScreen
5. Enter valid patient credentials (`patient@careconnect.demo` / `password123`)
6. Tap "Sign In" button
7. Verify successful authentication
8. Verify navigation to PatientDashboardScreen
9. Verify user name is displayed correctly ("Robert Williams")

**Expected Results**:
- All screens render correctly
- Navigation transitions smoothly
- Authentication state persists
- User role is correctly set to `UserRole.patient`

**Edge Cases to Test**:
- Invalid email format
- Password too short (< 8 characters)
- Wrong credentials
- Empty fields
- Network timeout simulation (if applicable)

#### 1.2 Welcome Screen → Registration Flow
**Priority**: High  
**Description**: New user registers for an account.

**Steps**:
1. Launch app → WelcomeScreen
2. Tap "Get Started" → RoleSelectionScreen
3. Select "Care Recipient" → RegistrationScreen
4. Fill in registration form:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Phone: "555-1234"
   - Password: "password123"
5. Tap "Register" button
6. Verify registration success
7. Verify automatic sign-in
8. Verify navigation to PatientDashboardScreen

**Expected Results**:
- Form validation works correctly
- Registration completes successfully
- User is automatically authenticated
- Dashboard displays correctly

**Edge Cases to Test**:
- Duplicate email registration
- Invalid phone number format
- Password strength validation
- Missing required fields

#### 1.3 Caregiver Sign In Flow
**Priority**: High  
**Description**: Caregiver signs in and accesses caregiver dashboard.

**Steps**:
1. Launch app → WelcomeScreen
2. Navigate to SignInScreen
3. Enter caregiver credentials (`caregiver@careconnect.demo` / `password123`)
4. Tap "Sign In"
5. Verify navigation to CaregiverDashboardScreen
6. Verify caregiver-specific UI elements are displayed
7. Verify user name is displayed correctly ("Dr. Sarah Johnson")

**Expected Results**:
- Correct role assignment (`UserRole.caregiver`)
- Caregiver dashboard displays with correct stats
- Caregiver navigation bar is shown

#### 1.4 Sign Out Flow
**Priority**: Medium  
**Description**: Authenticated user signs out and returns to welcome screen.

**Steps**:
1. Sign in as patient or caregiver
2. Open drawer menu
3. Tap "Sign Out" button
4. Confirm sign out (if confirmation dialog exists)
5. Verify authentication state is cleared
6. Verify navigation to WelcomeScreen
7. Verify user cannot access protected screens without re-authentication

**Expected Results**:
- Session is cleared
- User is logged out
- Protected routes are inaccessible
- Welcome screen is displayed

### 2. Patient User Flows

#### 2.1 Patient Dashboard Overview
**Priority**: High  
**Description**: Patient views their dashboard and sees all key information.

**Steps**:
1. Sign in as patient
2. Verify PatientDashboardScreen is displayed
3. Verify greeting message with user name
4. Verify "Upcoming Tasks" section is visible
5. Verify "Today's Appointments" section is visible
6. Verify bottom navigation bar is present
7. Verify all navigation tabs are accessible (Home, Tasks, Health, Profile)

**Expected Results**:
- Dashboard loads correctly
- Task count matches actual tasks for today
- Appointments are displayed (if any)
- Navigation is functional

#### 2.2 View and Complete Task
**Priority**: High  
**Description**: Patient views task details and marks task as completed.

**Steps**:
1. Sign in as patient
2. Navigate to dashboard
3. Find a task in "Upcoming Tasks" section
4. Tap on task card
5. Verify TaskDetailsScreen is displayed
6. Verify task details are shown correctly (title, description, date, patient name)
7. Mark task as completed (if completion action exists)
8. Return to dashboard
9. Verify completed task is no longer in "Upcoming Tasks" or is marked as completed

**Expected Results**:
- Task details are accurate
- Task completion state persists
- UI updates reflect completion status
- Navigation back to dashboard works

**Edge Cases to Test**:
- Empty task list
- Task with missing data
- Multiple tasks on same day

#### 2.3 Add Health Log Entry
**Priority**: High  
**Description**: Patient records a health log entry (e.g., mood, blood pressure).

**Steps**:
1. Sign in as patient
2. Navigate to "Health" tab (bottom navigation)
3. Verify HealthLogsScreen is displayed
4. Tap "Add a Log" button
5. Verify HealthLogAddScreen is displayed
6. Select log type (e.g., "Mood")
7. Fill in log details:
   - For mood: Select mood value (e.g., "😊 Happy")
   - For blood pressure: Enter systolic/diastolic values
   - Add notes if applicable
8. Tap "Save Log"
9. Verify success message/confirmation
10. Return to HealthLogsScreen
11. Verify new log entry appears in the list
12. Verify log details are correct

**Expected Results**:
- Health log is saved successfully
- Log appears in the list with correct data
- Date/time is recorded correctly
- Log type is displayed correctly

**Edge Cases to Test**:
- Invalid blood pressure values (negative, too high)
- Invalid heart rate values
- Missing required fields
- Multiple logs on same day

#### 2.4 View Health Timeline
**Priority**: Medium  
**Description**: Patient views their health timeline with historical entries.

**Steps**:
1. Sign in as patient
2. Navigate to Health tab
3. Verify HealthLogsScreen
4. Tap on "View Timeline" or navigate to HealthTimelineScreen
5. Verify timeline is displayed
6. Verify entries are sorted chronologically (newest first or oldest first)
7. Verify different log types are displayed with correct icons/colors
8. Tap on a timeline entry
9. Verify entry details are shown (if detail view exists)

**Expected Results**:
- Timeline loads correctly
- Entries are displayed in correct order
- Visual indicators (colors, icons) match log types
- Navigation works correctly

#### 2.5 Create and View Note
**Priority**: Medium  
**Description**: Patient creates a note and views it in the notes list.

**Steps**:
1. Sign in as patient
2. Navigate to Notes screen (via drawer or navigation)
3. Verify NotesScreen is displayed
4. Tap "Add New Note" button
5. Verify NotesAddScreen is displayed
6. Enter note title: "Medication Side Effects"
7. Enter note content: "Experienced mild dizziness after morning dose"
8. Select a category (if applicable)
9. Tap "Save" button
10. Verify success message
11. Return to NotesScreen
12. Verify new note appears in the list
13. Tap on the note
14. Verify NotesDetailScreen displays correct content

**Expected Results**:
- Note is saved successfully
- Note appears in list with correct title
- Note detail view shows full content
- Date/time is recorded

**Edge Cases to Test**:
- Empty note (title/content)
- Very long note content
- Special characters in note
- Delete note functionality

#### 2.6 View Calendar and Tasks
**Priority**: Medium  
**Description**: Patient views calendar and sees tasks scheduled for specific dates.

**Steps**:
1. Sign in as patient
2. Navigate to Calendar screen (via drawer or navigation)
3. Verify CalendarScreen is displayed
4. Verify current month is shown
5. Verify dates with tasks are marked/highlighted
6. Tap on a date with tasks
7. Verify tasks for that date are displayed
8. Navigate to different month
9. Verify tasks for that month are displayed correctly

**Expected Results**:
- Calendar renders correctly
- Task indicators are accurate
- Date selection works
- Task list updates based on selected date

#### 2.7 View and Update Profile
**Priority**: Medium  
**Description**: Patient views profile and updates information.

**Steps**:
1. Sign in as patient
2. Navigate to Profile tab (bottom navigation)
3. Verify PatientProfileScreen is displayed
4. Verify user information is displayed correctly
5. Tap "Edit Profile" button
6. Update profile information (name, email, phone, etc.)
7. Tap "Save" button
8. Verify changes are saved
9. Verify updated information is displayed

**Expected Results**:
- Profile loads with correct data
- Edit mode works correctly
- Changes persist
- Validation works for invalid inputs

#### 2.8 Access Preferences and Accessibility Settings
**Priority**: Medium  
**Description**: Patient accesses and modifies accessibility preferences.

**Steps**:
1. Sign in as patient
2. Open drawer menu
3. Tap "Preferences" or navigate to PreferencesAccessibilityScreen
4. Verify preferences screen is displayed
5. Modify text size setting
6. Modify language preference (if applicable)
7. Toggle bold text (if applicable)
8. Modify date/time format preferences
9. Tap "Save Preferences"
10. Verify preferences are saved
11. Navigate to another screen
12. Verify preferences are applied (e.g., text size changes)

**Expected Results**:
- Preferences screen loads correctly
- Settings can be modified
- Changes persist across app sessions
- UI reflects preference changes

### 3. Caregiver User Flows

#### 3.1 Caregiver Dashboard Overview
**Priority**: High  
**Description**: Caregiver views dashboard with patient stats and tasks.

**Steps**:
1. Sign in as caregiver
2. Verify CaregiverDashboardScreen is displayed
3. Verify greeting with caregiver name ("Dr. Sarah Johnson")
4. Verify quick stats section:
   - Patient count
   - Tasks completed/total
   - Alerts count
5. Verify "Today's Tasks" section is displayed
6. Verify task cards show patient names
7. Verify "Manage" button is present

**Expected Results**:
- Dashboard loads correctly
- Stats are accurate
- Tasks are displayed with patient information
- Navigation elements are present

#### 3.2 Manage Tasks (Caregiver)
**Priority**: High  
**Description**: Caregiver views and manages tasks for all patients.

**Steps**:
1. Sign in as caregiver
2. Navigate to dashboard
3. Tap "Manage" button in "Today's Tasks" section
4. Verify CaregiverTaskManagementScreen is displayed
5. Verify task list shows tasks for all patients
6. Verify tasks are grouped by patient (if applicable)
7. Tap on a task
8. Verify TaskDetailsScreen is displayed
9. Verify task details include patient name
10. Complete or update task status (if applicable)
11. Return to task management screen
12. Verify task status is updated

**Expected Results**:
- Task management screen loads correctly
- All patient tasks are visible
- Task details are accurate
- Task status updates persist

**Edge Cases to Test**:
- Empty task list
- Tasks for multiple patients
- Overdue tasks
- Completed tasks filtering

#### 3.3 View Patient Monitoring
**Priority**: High  
**Description**: Caregiver monitors patient health data and status.

**Steps**:
1. Sign in as caregiver
2. Navigate to "Monitor" tab or CaregiverPatientMonitoringScreen
3. Verify patient list is displayed
4. Verify patient cards show key information (name, status, last update)
5. Tap on a patient card
6. Verify patient details are shown (if detail view exists)
7. Verify health metrics are displayed (if applicable)
8. Verify recent health logs are visible

**Expected Results**:
- Patient list loads correctly
- Patient information is accurate
- Health data is displayed correctly
- Navigation works

#### 3.4 View Analytics
**Priority**: Medium  
**Description**: Caregiver views analytics and reports.

**Steps**:
1. Sign in as caregiver
2. Navigate to Analytics screen (via navigation or drawer)
3. Verify CaregiverAnalyticsScreen is displayed
4. Verify analytics charts/graphs are displayed (if implemented)
5. Verify date range selection works (if applicable)
6. Verify data filters work (if applicable)
7. Verify export functionality (if implemented)

**Expected Results**:
- Analytics screen loads correctly
- Data visualizations render correctly
- Filters work as expected
- Data is accurate

#### 3.5 Respond to Emergency SOS Alert
**Priority**: Critical  
**Description**: Caregiver receives and acknowledges an emergency alert.

**Steps**:
1. Sign in as caregiver
2. Trigger emergency SOS alert (via test data or simulation)
3. Verify EmergencySOSAlertScreen is displayed (or notification appears)
4. Verify alert details are shown (patient name, location, time)
5. Verify "Acknowledge Alert" button is present
6. Tap "Acknowledge Alert"
7. Verify alert is marked as acknowledged
8. Verify alert disappears or is marked as handled

**Expected Results**:
- Alert is displayed immediately
- Alert information is accurate
- Acknowledgment works correctly
- Alert state persists

**Edge Cases to Test**:
- Multiple simultaneous alerts
- Alert timeout/expiration
- Alert cancellation

### 4. Cross-Cutting Features

#### 4.1 Notification System
**Priority**: High  
**Description**: User receives and interacts with notifications.

**Steps**:
1. Sign in as patient or caregiver
2. Verify notification badge appears on app bar (if unread notifications exist)
3. Tap notification icon
4. Verify NotificationScreen is displayed
5. Verify notification list shows all notifications
6. Verify unread notifications are marked
7. Tap on a notification
8. Verify notification detail is shown (if applicable)
9. Mark notification as read
10. Verify notification badge updates
11. Mark all notifications as read
12. Verify all notifications are marked as read

**Expected Results**:
- Notifications are displayed correctly
- Read/unread status is accurate
- Notification badge updates correctly
- Navigation from notifications works

**Edge Cases to Test**:
- Empty notification list
- Very long notification text
- Notification with missing data
- Notification expiration

#### 4.2 Navigation and Drawer Menu
**Priority**: High  
**Description**: User navigates using drawer menu and bottom navigation.

**Steps**:
1. Sign in as patient
2. Tap drawer menu icon
3. Verify AppDrawer is displayed
4. Verify menu items are correct for patient role:
   - Dashboard
   - Tasks
   - Calendar
   - Health Logs
   - Notes
   - Profile
   - Preferences
   - Sign Out
5. Tap on "Calendar" menu item
6. Verify navigation to CalendarScreen
7. Use bottom navigation bar to switch tabs
8. Verify each tab navigates correctly
9. Verify active tab is highlighted

**Expected Results**:
- Drawer opens/closes correctly
- Menu items are role-appropriate
- Navigation works from both drawer and bottom nav
- Active state is indicated correctly

**Edge Cases to Test**:
- Navigation while data is loading
- Deep navigation stack
- Back button behavior

#### 4.3 Video Call Feature
**Priority**: Medium  
**Description**: User initiates and participates in a video call.

**Steps**:
1. Sign in as patient or caregiver
2. Navigate to VideoCallScreen (via navigation or direct route)
3. Verify video call interface is displayed
4. Verify camera preview is shown
5. Tap "Start call" button
6. Verify call is initiated
7. Verify call controls are displayed (mute, camera toggle, end call)
8. Test mute/unmute functionality
9. Test camera on/off toggle
10. Tap "End call" button
11. Verify call is terminated
12. Verify return to previous screen

**Expected Results**:
- Video call interface loads correctly
- Camera permissions are requested (if needed)
- Call controls work correctly
- Call termination works

**Edge Cases to Test**:
- Camera permission denied
- Network connectivity issues
- Call timeout
- Multiple simultaneous calls (if applicable)

#### 4.4 Messaging Thread
**Priority**: Medium  
**Description**: User sends and receives messages.

**Steps**:
1. Sign in as patient or caregiver
2. Navigate to MessagingThreadScreen
3. Verify message thread is displayed
4. Verify previous messages are shown
5. Type a new message in the input field
6. Tap send button
7. Verify message appears in thread
8. Verify message timestamp is correct
9. Verify sent/received indicators (if applicable)
10. Test message input validation (empty message, max length)

**Expected Results**:
- Message thread loads correctly
- Messages are displayed in correct order
- Sending messages works
- Message persistence works

**Edge Cases to Test**:
- Empty message thread
- Very long messages
- Special characters in messages
- Message delivery failure

### 5. Error Handling & Edge Cases

#### 5.1 Network Error Handling
**Priority**: Medium  
**Description**: App handles network errors gracefully.

**Steps**:
1. Simulate network failure (via test configuration)
2. Sign in as user
3. Attempt to load data (tasks, health logs, etc.)
4. Verify error message is displayed
5. Verify retry mechanism works (if implemented)
6. Restore network connection
7. Verify data loads correctly after retry

**Expected Results**:
- Error messages are user-friendly
- App doesn't crash
- Retry functionality works
- Data syncs when connection is restored

#### 5.2 Empty States
**Priority**: Medium  
**Description**: App displays appropriate empty states.

**Test Scenarios**:
- Empty task list
- Empty health logs
- Empty notes list
- Empty notifications
- Empty patient list (caregiver)

**Expected Results**:
- Empty state messages are displayed
- Empty state UI is user-friendly
- Actions to add content are available

#### 5.3 Data Validation
**Priority**: High  
**Description**: App validates user input correctly.

**Test Scenarios**:
- Invalid email format in registration/sign in
- Password too short
- Invalid phone number format
- Invalid date/time entries
- Invalid health log values (negative BP, etc.)
- Missing required fields

**Expected Results**:
- Validation errors are displayed clearly
- Invalid data is not saved
- User can correct errors easily

#### 5.4 Session Management
**Priority**: High  
**Description**: App handles session expiration and restoration.

**Steps**:
1. Sign in as user
2. Use app normally
3. Simulate session expiration (if applicable)
4. Attempt to perform an action
5. Verify user is prompted to sign in again
6. Sign in again
7. Verify app state is restored correctly (if applicable)

**Expected Results**:
- Session expiration is handled gracefully
- User is prompted to re-authenticate
- App state is preserved or restored correctly

### 6. Accessibility & Usability

#### 6.1 Screen Reader Support
**Priority**: High  
**Description**: App is usable with screen readers.

**Steps**:
1. Enable screen reader (TalkBack/VoiceOver simulation in tests)
2. Navigate through app screens
3. Verify all interactive elements are announced
4. Verify semantic labels are correct
5. Verify navigation order is logical

**Expected Results**:
- All elements are accessible
- Labels are descriptive
- Navigation is logical

#### 6.2 High Contrast Mode
**Priority**: Medium  
**Description**: App works correctly with high contrast preferences.

**Steps**:
1. Enable high contrast mode in preferences
2. Navigate through app
3. Verify all text is readable
4. Verify buttons and interactive elements are visible
5. Verify color contrast meets WCAG AA standards

**Expected Results**:
- UI adapts to high contrast mode
- All elements remain visible
- Contrast ratios meet standards

#### 6.3 Text Scaling
**Priority**: Medium  
**Description**: App handles text scaling correctly.

**Steps**:
1. Set text size to largest setting in preferences
2. Navigate through app screens
3. Verify text is readable and not cut off
4. Verify UI elements don't overlap
5. Verify scrolling works correctly

**Expected Results**:
- Text scales correctly
- Layout adapts to larger text
- No text is cut off or overlapping

## Test Execution Strategy

### Test Prioritization
1. **Critical Path Tests** (P0): Authentication, core patient/caregiver workflows
2. **High Priority Tests** (P1): Task management, health logs, notifications
3. **Medium Priority Tests** (P2): Analytics, preferences, messaging
4. **Low Priority Tests** (P3): Edge cases, error handling, accessibility edge cases

### Maestro Test Execution Commands

#### Local Execution
```bash
# Run a single test flow
maestro test maestro/flows/auth/sign_in_patient.yaml

# Run all tests in a directory
maestro test maestro/flows/auth/

# Run all tests
maestro test maestro/flows/

# Run tests with specific tags
maestro test maestro/flows/ --tags "P0"

# Run tests on specific device/emulator
maestro test maestro/flows/auth/sign_in_patient.yaml --device "emulator-5554"

# Run tests with app path
maestro test maestro/flows/auth/sign_in_patient.yaml \
  --app flutter_app/build/app/outputs/flutter-apk/app-debug.apk
```

#### Cloud Execution (Maestro Cloud)
```bash
# Upload and run tests on Maestro Cloud
maestro cloud maestro/flows/auth/sign_in_patient.yaml

# Run tests on multiple devices/platforms
maestro cloud maestro/flows/ --env production
```

#### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Run Maestro E2E Tests
  run: |
    maestro test maestro/flows/auth/ --format junit > test-results.xml
```

### Test Execution Frequency
- **Pre-commit**: Run P0 tests locally (`maestro test maestro/flows/auth/`)
- **Pre-merge**: Run P0 + P1 tests (`maestro test maestro/flows/ --tags "P0,P1"`)
- **Nightly**: Run all tests via CI/CD pipeline
- **Release**: Full test suite on Maestro Cloud + manual smoke tests

### Test Data Management
- Use consistent test data across test runs
- Define test data constants in `maestro/helpers/test_data.yaml`
- Use Maestro's `setState` or environment variables for dynamic data
- Seed test data via app initialization or test setup flows
- Clean up test data after tests complete (via cleanup flows)
- Use YAML anchors and references for reusable test data

### Maestro-Specific Features
- **Tags**: Organize tests by priority, feature, or platform
  ```yaml
  tags: ["P0", "auth", "patient"]
  ```
- **Flow Composition**: Reuse flows via `runFlow` command
  ```yaml
  - runFlow: "maestro/helpers/common_flows/sign_in_patient.yaml"
  ```
- **Assertions**: Use Maestro's assertion commands
  ```yaml
  - assertVisible: "Dashboard"
  - assertNotVisible: "Loading"
  - assertTrue: "${someCondition}"
  ```
- **Screenshots**: Automatic screenshots on failure
- **Video Recording**: Record test execution videos
- **Retry Logic**: Built-in retry for flaky tests
- **Environment Variables**: Use env vars for configuration
  ```yaml
  env:
    TEST_USER_EMAIL: "patient@careconnect.demo"
    TEST_USER_PASSWORD: "password123"
  ```

### Test Maintenance
- Update YAML files when UI changes (text labels, element IDs)
- Refactor common flows into reusable helper files
- Use Maestro's `runFlow` for flow composition
- Keep test data in sync with app changes
- Document Maestro-specific setup requirements
- Use Maestro Studio for visual test creation and debugging
- Leverage Maestro's element hierarchy for robust selectors

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
- **Maestro CLI**: Install Maestro CLI
  ```bash
  # macOS/Linux
  curl -Ls "https://get.maestro.mobile.dev" | bash
  
  # Or via npm
  npm install -g @maestro/cli
  
  # Verify installation
  maestro --version
  ```
- **Flutter SDK**: Flutter SDK installed and configured
- **App Build**: Debug or release APK/IPA built and available
  ```bash
  # Build APK for Android
  flutter build apk --debug
  
  # Build IPA for iOS (requires macOS)
  flutter build ios --debug
  ```
- **Android Setup** (for Android testing):
  - Android SDK installed
  - Android emulator configured OR physical device connected via ADB
  - ADB accessible: `adb devices`
- **iOS Setup** (for iOS testing, macOS only):
  - Xcode installed
  - iOS Simulator configured OR physical device connected
  - iOS device UDID available (for physical devices)

### Test Environment
- **Device/Emulator**: 
  - Android: Emulator running or physical device connected
  - iOS: Simulator running or physical device connected
  - Verify device is accessible: `maestro device list`
- **App Installation**: App installed on test device
  ```bash
  # Install app via Maestro
  maestro test maestro/flows/auth/sign_in_patient.yaml \
    --app path/to/app.apk
  
  # Or install manually
  adb install app.apk  # Android
  ```
- **Mock Backend Services**: If applicable, ensure mock services are running
- **Test Data**: Consistent test data available (credentials, test users, etc.)
- **Network Configuration**: 
  - Network simulation capabilities (if testing offline scenarios)
  - API endpoints accessible or mocked

### Maestro Configuration File
Create `maestro/config/maestro.yaml`:
```yaml
appId: com.careconnect.app  # Your app's bundle ID
includeTags: []             # Tags to include (empty = all)
excludeTags: []             # Tags to exclude
env:
  TEST_USER_EMAIL: "patient@careconnect.demo"
  TEST_USER_PASSWORD: "password123"
  TEST_CAREGIVER_EMAIL: "caregiver@careconnect.demo"
```

### Optional Tools
- **Maestro Studio**: Visual test creation and debugging tool
  - Download from: https://maestro.mobile.dev/studio
  - Helps create and debug tests visually
- **Maestro Cloud**: For cloud-based test execution
  - Sign up at: https://cloud.mobile.dev
  - Useful for CI/CD and cross-platform testing

## Future Enhancements

### Potential Additions
- **Maestro Cloud Integration**: 
  - Run tests on cloud infrastructure
  - Cross-platform testing (iOS/Android) on real devices
  - Parallel test execution
  - Test result dashboards and analytics
- **Visual Regression Testing**: 
  - Use Maestro's screenshot capabilities
  - Compare screenshots across builds
  - Integrate with visual diff tools
- **Performance Benchmarking**: 
  - Measure app launch time
  - Track screen load times
  - Monitor memory usage during tests
- **Test Reporting Dashboard**: 
  - Maestro Cloud provides built-in dashboards
  - Custom reporting via Maestro's test results
  - Integration with CI/CD tools (JUnit XML, etc.)
- **Automated Test Result Notifications**: 
  - Slack/email notifications on test failures
  - Integration with issue tracking systems
  - Test result summaries
- **Test Data Management Tools**: 
  - Centralized test data repository
  - Dynamic test data generation
  - Test data versioning
- **Maestro Studio Integration**: 
  - Visual test authoring
  - Test debugging and replay
  - Element inspector for better selectors
- **Advanced Maestro Features**: 
  - Custom commands and extensions
  - Integration with app-specific APIs
  - State management and data persistence testing
  - Biometric authentication testing
  - Push notification simulation

## Notes

- This plan should be reviewed and updated as the app evolves
- Test scenarios should be prioritized based on business value and risk
- Consider adding tests for new features as they are developed
- Maintain balance between test coverage and execution time
- Keep tests maintainable and readable
