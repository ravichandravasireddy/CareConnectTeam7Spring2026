# CareConnect Team7 Spring2026 React Native Mobile Application

## Description

**CareConnect** is a HIPAA-compliant mobile, desktop, and web application that connects patients (care recipients) and their caregivers for remote health management and coordination. The app supports shared flows, such as welcome, login, registration, and role selection, as well as role-specific experiences such as patient dashboard, profile, preferences, and health tools. Additionally, there are the caregiver dashboard, emergency SOS, patient monitoring, task management, and analytics screens. Shared features include messaging, calendar, task details, notifications, notes, health logs, health timeline, and video call, so both sides can coordinate care securely from one place.

The project specifically targets **hearing-impaired caregivers**. The Flutter UI is built with accessibility and clear visual feedback in mind, so caregivers who are deaf or hard of hearing can manage tasks, monitor patients, respond to alerts, and stay in touch without relying on audio. CareConnect aims to make remote care coordination inclusive and secure for everyone involved.

## Team Members
- Dominique Rattray(Team Lead)
- Ravichandra Vasireddy
- Jordene Downer

## TeamCharter
Link: [Team Charter](https://docs.google.com/document/d/1xMF6upCBABr3dtR3aLjk2lLUWFN1IEbwB-vC6tYJCB8/edit?usp=sharing)

## Setup and Run Instructions

1. Before beginning, you must clone the repository into your local environment

```bash
git clone < Repository link >
```

2. Get Dependencies
  
```bash
cd react_native_app
npm i
```
  
3. Connect a device or start up an emulator like Android Studio emulators

4. Run the app

```bash
npm run android
```

or

```bash
npm run ios
```

## How to run tests

From the root directory:

```bash
cd react_native_app
npm test
```

To generate a coverage report:

```bash
npm run test:coverage
```

The html version is automatically generated and is located at `coverage/index.html`.

## Link to test coverage report - TODO

[Test Coverage Screenshot](_images/03%20Code%20Coverage.jpg)

## Screen Images - TODO

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

## Accessibility (Deaf & Hard of Hearing)

This app targets **hearing-impaired caregivers**. All feedback is **visual only**—no audio alerts or notifications. Key design rules:

- **No audio dependency**: Alerts, confirmations, and notifications use text, icons, and color
- **Visual alternatives**: Emergency SOS uses red background, large text, and clear icons
- **Text-based content**: Patient names, vitals, and task details are always displayed as text
- **Touch targets**: Minimum 48×48px for interactive elements
- **Color contrast**: WCAG AA compliant (see `_AI/GUIDELINES.md`)

## Known issues or limitations

- **Note categories**: The note categories are limited to only three kinds right now (Medication, Exercise, and Appointments).
- **Note Editing**: The notes are not editable
- **Call logs and transcripts**: Call logs and transcript screens are not available yet, so video call history is not shown in-app.
- **Analytics depth**: The Analytics page is still basic and does not provide deeper trends, comparisons, or exportable insights.

## Future Improvements

- **Notes**: Assign note authors dynamically based on the signed-in user, and add support for more categories (including user-defined ones).
- **Patient monitoring navigation**: Add clear controls to switch between patients and highlight the active patient context.
- **Analytics enhancements**: Expand analytics with trend charts, filters, and export options for caregiver reporting.
- **Call history features**: Add call logs, transcripts, and searchable history for video call follow-ups.
- **Further ASL Support**: Add futher ASL support in the form of educational video content utilizing ASL.
- **Functional Preferences**: Make the options in the Preferences and Accessibility page functional, making changes to the toggles actually able to update the UI. 
- **Note Editing**: The notes can be made editable with authorization implemented

## Team member contributions this week

**Dominique Rattray (Team Lead):**

- Calendar screen, along with associated providers, models, and tests
- Health log screen and add log screen, along with associated providers, models, and tests
- Notes screen, add notes screen, and Notes detail screen, along with associated providers, models, and tests
- Notification screen, along with associated providers, models, and tests
- Video call screen, along with associated tests
- Health timeline screen, along with associated hooks and tests
- Welcome screen, along with associated tests
- App branch mergining and integration

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

## AI usage summary

- **Layout:** Inital drafts of screens, including layouts and functions.
- **Theme/typography:** Creating a centralized app typography and colors in theme for usage across screens.
- **Testing:** Test suites and test adjustments.
- **Models:** Claude Sonnet 4.5, ChatGPT 5.2 Codex, and Cursor mixed models (Claude 3.5/3.7 Sonnet, ChatGPT-4o, and Gemini)