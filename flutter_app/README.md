# CareConnect Team7 Spring2026 Flutter Application

## Description

**CareConnect** is a HIPAA-compliant mobile application that connects patients (care recipients) and their caregivers for remote health management and coordination. The app supports shared flows, such as welcome, login, registration, and role selection, as well as role-specific experiences such as patient dashboard, profile, preferences, and health tools. Additionally, there are the caregiver dashboard, emergency SOS, patient monitoring, task management, and analytics screens. Shared features include messaging, calendar, task details, notifications, notes, health logs, health timeline, and video call, so both sides can coordinate care securely from one place.

The project specifically targets **hearing-impaired caregivers**. The Flutter UI is built with accessibility and clear visual feedback in mind, so caregivers who are deaf or hard of hearing can manage tasks, monitor patients, respond to alerts, and stay in touch without relying on audio. CareConnect aims to make remote care coordination inclusive and secure for everyone involved.

## Team Members
- Dominique Rattray (Team Lead)
- Ravichandra Vasireddy
- Jordene Downer

## TeamCharter
Link: [Team Charter](https://docs.google.com/document/d/1xMF6upCBABr3dtR3aLjk2lLUWFN1IEbwB-vC6tYJCB8/edit?usp=sharing)

## Setup and Run Instructions

Before beginning, you must clone the repository into your local environment
  ```bash
  git clone < Repository link >
  ```

### Flutter App
1. get Dependencies
  ```bash
  flutter pub get
  ```
2. Connect a device or start up an emulator like Android Studio emulators
3. Run the app
  ```bash
  flutter run
  ```

## How to run tests
From the `flutter_app` directory:
```bash
cd flutter_app
flutter test
```
To generate a coverage report:
```bash
flutter test --coverage
```

To generate html version:
- Coverage output is written to `flutter_app/coverage/lcov.info`. Use a viewer (e.g. VS Code "Coverage Gutters" or `genhtml`) to inspect it.
- Genhtml version
```
genhtml coverage/lcov.info -o coverage/html
```

## Link to test coverage report
[Test Coverage Screenshot](https://drive.google.com/file/d/1oL4Jz_L_8lv0hmiqcmNKoL51T1a_Q7NP/view?usp=sharing)

## Known issues or limitations
- **Note categories** are limited; More may be added.
- **Call logs** and **transcript screens** can be implemented in future iterations.
- No backend or real auth; app is UI/flow-focused.

## Team member contributions this week
**Dominique Rattray (Team Lead):** 
  - Calendar screen, along with associated providers, models, and tests
  - Health log screen and add log screen, along with associated providers, models, and tests
  - Notes screen, add notes screen, and Notes detail screen, along with associated providers, models, and tests
  - Notification screen, along with associated providers, models, and tests
  - Video call screen, along with associated tests
  - Health timeline screen, along with associated tests
  - App colors
  - App typography
  - App branch integration

**Ravichandra Vasireddy:** 
  - Caregiver analytics screen, along with associated tests
  - Caregiver dashboard screen, along with associated tests
  - Caregiver patient monitoring screen, along with associated tests
  - Caregiver task management screen, along with associated providers and tests
  - Emergecy SOS alert screen, along with associated tests
  - Task details screen, along with associated tests
  - Navigation hub screen for demos
  
**Jordene Downer:**
  - Message thread screen, along with associated tests
  - Patient dashboard screen, along with associated tests
  - Patient profile screen, along with associated tests
  - Preferences and accessibility screen, along with associated tests
  - Registration screen, along with associated tests
  - Role selection screen, along with associated tests
  - Sign in screen, along with associated tests
  - Welcome screen, along with associated tests

## AI usage summary
- **Layout:** Inital drafts of screens. Responsive layouts (calendar screen width constraints, welcome and role-selection screens in landscape), quick log button max size and grid behavior on Health Logs screen.
- **Theme/typography:** Centralized app typography and app colors in theme, replaced inline text style usages across screens with theme-based styles.
- **Testing:** Test suites; temporary testing hub screen for navigation; test fixes. 
- **Docs:** README description paragraphs and section structure. README project description and new sections (how to run tests, coverage link, known issues, contributions, AI summary) drafted with placeholders for team details.
- **Models:** Claude Sonnet 4.5, Cursor mixed models (Claude 3.5/3.7 Sonnet, ChatGPT-4o, and Gemini)
