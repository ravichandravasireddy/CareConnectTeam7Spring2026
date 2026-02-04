# CareConnect Team7 Spring2026 Flutter Mobile Application

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

[Test Coverage Screenshot](_images/03%20Code%20Coverage.jpg)

## Screen Images

[01 Welcome](_images/screenshots/01%20Welcome.jpg)  
[02 Sign in](_images/screenshots/02%20Sign%20in.jpg)  
[03 Role Selection](_images/screenshots/03%20Role%20Selection.jpg)  
[04 Registration](_images/screenshots/04%20Registration.jpg)  
[05 Patient Dashboard](_images/screenshots/05%20Patient%20Dashboard.jpg)  
[06 Patient tasks](_images/screenshots/06%20Patient%20tasks.jpg)  
[07 Messages](_images/screenshots/07%20Messages.jpg)  
[08 Health Logs](_images/screenshots/08%20Health%20Logs.jpg)  
[09 Profile](_images/screenshots/09%20Profile.jpg)  
[10 Health timeline](_images/screenshots/10%20Health%20timeline.jpg)  
[11 Notes](_images/screenshots/11%20Notes.jpg)  
[12 Preferences](_images/screenshots/12%20Preferences.jpg)  
[13 Notifications](_images/screenshots/13%20Notifications.jpg)  
[14 Video](_images/screenshots/14%20Video.jpg)  
[15 Emergency Alert](_images/screenshots/15%20Emergency%20Alert.jpg)  
[16 Caregiver dashboard](_images/screenshots/16%20Caregiver%20dashboard.jpg)  
[17 Caregiver task management](_images/screenshots/17%20Caregiver%20task%20management.jpg)  
[18 Analytics](_images/screenshots/18%20Analytics.jpg)  
[19 Patient Monitoring](_images/screenshots/19%20Patient%20Monitoring.jpg)  
[20 Navigation Hub](_images/screenshots/20%20Navigation%20Hub.jpg)  

## Known issues or limitations

- **Note categories**: The note categories are limited to only three kinds right now (Medication, Exercise, and Appointments).
- **Call logs and transcripts**: Call logs and transcript screens are not available yet, so video call history is not shown in-app.
- **Analytics depth**: The Analytics page is still basic and does not provide deeper trends, comparisons, or exportable insights.
- **Role-specific messaging**: The messages page is not customized by user role, so patient and caregiver views are currently the same.
- **High-contrast mode**: High-contrast mode has not been implemented yet for users who need stronger visual separation.
- **Dark mode**: Dark mode has not been implemented yet and the UI is optimized for light mode only.
- **App bar consistency**: Some screens use the native app bar while others use a custom app bar, which creates visual inconsistency.

## Future Improvements

- **Notes**: Assign note authors dynamically based on the signed-in user, and add support for more categories (including user-defined ones).
- **Patient monitoring navigation**: Add clear controls to switch between patients and highlight the active patient context.
- **Analytics enhancements**: Expand analytics with trend charts, filters, and export options for caregiver reporting.
- **Messaging personalization**: Tailor message threads and shortcuts based on whether the user is a patient or caregiver.
- **Accessibility modes**: Implement high-contrast mode and refine focus/keyboard support for accessibility parity.
- **Dark mode support**: Add a full dark theme that matches the design system tokens and passes contrast checks.
- **Call history features**: Add call logs, transcripts, and searchable history for video call follow-ups.
- **Further ASL Support**: Add futher ASL support in the form of educational video content utilizing ASL.
- **Functional Preferences**: Make the options in the Preferences and Accessibility page functional, making changes to the toggles actually able to update the UI. 
- **Patient Profile**: Add more medical details about the patient to the patient profile and patient details (for caregiver), including blood type (e.g. A+).

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
