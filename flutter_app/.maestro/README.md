# Maestro E2E Tests for Flutter CareConnect App

This directory contains end-to-end tests for the Flutter CareConnect application using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. **Install Maestro CLI**:
   ```bash
   # macOS/Linux
   curl -Ls "https://get.maestro.mobile.dev" | bash
   
   # Or via npm
   npm install -g @maestro/cli
   
   # Verify installation
   maestro --version
   ```

2. **Build the Flutter app**:
   ```bash
   cd flutter_app
   flutter build apk --debug  # For Android
   # or
   flutter build ios --debug  # For iOS (macOS only)
   ```

3. **Set up device/emulator**:
   - Android: Start emulator or connect physical device via ADB
   - iOS: Start simulator or connect physical device (macOS only)
   - Verify device is accessible: `maestro device list`

## Directory Structure

```
maestro/
├── config/
│   └── maestro.yaml          # Maestro configuration
├── helpers/
│   ├── test_data.yaml        # Test data constants
│   └── common_flows/         # Reusable test flows
│       ├── sign_in_patient.yaml
│       └── sign_in_caregiver.yaml
└── flows/
    ├── auth/                 # Authentication flows
    ├── patient/              # Patient user flows
    ├── caregiver/            # Caregiver user flows
    ├── cross_cutting/         # Cross-cutting features
    └── error_handling/       # Error handling and edge cases
```

## Running Tests

### Location
Make sure you are in the flutter_app root location before running tests.

### Run a single test
```bash
maestro test .maestro/flows/auth/sign_in_patient.yaml
```

### Run all tests in a directory
```bash
maestro test .maestro/flows/auth/
```

### Run all tests
```bash
maestro test .maestro/flows/
```

### Run tests with specific tags
```bash
maestro test .maestro/flows/ --tags "P0"
maestro test .maestro/flows/ --tags "P0,P1"
```

### Run tests on specific device
```bash
maestro test .maestro/flows/auth/sign_in_patient.yaml --device "emulator-5554"
```

### Run tests with app path
```bash
maestro test .maestro/flows/auth/sign_in_patient.yaml \
  --app flutter_app/build/app/outputs/flutter-apk/app-debug.apk
```

## Test Tags

Tests are tagged for easy filtering:

- **P0**: Critical path tests (authentication, core workflows)
- **P1**: High priority tests (task management, health logs, notifications)
- **P2**: Medium priority tests (analytics, preferences, messaging)
- **auth**: Authentication-related tests
- **patient**: Patient user flow tests
- **caregiver**: Caregiver user flow tests
- **cross-cutting**: Cross-cutting feature tests
- **error-handling**: Error handling and edge case tests

## Test Data

Test data constants are defined in `helpers/test_data.yaml` and can be referenced in tests using `${VAR_NAME}` syntax.

Default test credentials:
- Patient: `patient@careconnect.demo` / `password123`
- Caregiver: `caregiver@careconnect.demo` / `password123`

## Common Flows

Reusable flows are located in `helpers/common_flows/` and can be included in other tests using:

```yaml
- runFlow: "maestro/helpers/common_flows/sign_in_patient.yaml"
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Maestro E2E Tests
  run: |
    maestro test maestro/flows/auth/ --format junit > test-results.xml
```

### Maestro Cloud
For cloud-based test execution:
```bash
maestro cloud maestro/flows/auth/sign_in_patient.yaml
```

## Troubleshooting

### Tests fail to find elements
- Verify the app is installed and running
- Check that element text/IDs match the actual UI
- Use `optional: true` for elements that may not always be present
- Take screenshots for debugging: `maestro test --screenshot maestro/flows/...`

### App not launching
- Ensure app is built: `flutter build apk --debug`
- Verify app ID matches: `com.example.flutter_app`
- Check device connection: `adb devices` or `maestro device list`

### Flaky tests
- Add `waitForAnimationToEnd` after navigation
- Use `timeout` parameter for assertions
- Consider using element IDs instead of text when possible

## Test Maintenance

- Update tests when UI changes (text labels, element IDs)
- Keep test data in sync with app changes
- Refactor common flows into reusable helpers
- Use Maestro Studio for visual test creation and debugging

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro Studio](https://maestro.mobile.dev/studio)
- [Maestro Cloud](https://cloud.mobile.dev)
