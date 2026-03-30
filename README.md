# Project Name
CareConnect Team7 Spring2026

## Description

**CareConnect** is a HIPAA-compliant mobile, desktop, and web application that connects patients (care recipients) and their caregivers for remote health management and coordination. The app supports shared flows, such as welcome, login, registration, and role selection, as well as role-specific experiences such as patient dashboard, profile, preferences, and health tools. Additionally, there are the caregiver dashboard, emergency SOS, patient monitoring, task management, and analytics screens. Shared features include messaging, calendar, task details, notifications, notes, health logs, health timeline, and video call, so both sides can coordinate care securely from one place.

The project specifically targets **hearing-impaired caregivers**. The Flutter UI is built with accessibility and clear visual feedback in mind, so caregivers who are deaf or hard of hearing can manage tasks, monitor patients, respond to alerts, and stay in touch without relying on audio. CareConnect aims to make remote care coordination inclusive and secure for everyone involved.

## Team Members
- Dominique Rattray(Team Lead)
- Ravichandra Vasireddy
- Jordene Downer (1st half)
- Zechariah Hillman (2nd half)

## TeamCharter
Link: [Team Charter](https://docs.google.com/document/d/1xMF6upCBABr3dtR3aLjk2lLUWFN1IEbwB-vC6tYJCB8/edit?usp=sharing)

## Apps in this repo

### Mobile Apps

#### Flutter Mobile App
Flutter mobile app for HIPAA-compliant patient/caregiver remote care coordination. It includes shared onboarding (welcome/login/registration/role selection) and role-specific experiences like patient dashboards, caregiver dashboards, messaging, tasks, monitoring, notifications, notes, and video call. Designed specifically for hearing-impaired caregivers with accessibility-focused UI feedback.

Platforms: Mobile (Android/iOS via Flutter)
Readme: [flutter_app/README.md](./flutter_app/README.md)

#### React Native Mobile App
React Native mobile app (Expo) for HIPAA-compliant remote care coordination. It supports shared onboarding (welcome/login/registration/role selection) plus role-specific caregiver/patient experiences, including monitoring, tasks, analytics, and messaging. The app targets hearing-impaired caregivers with visual-only feedback (no audio dependency).

Platforms: Mobile (Android and iOS via React Native/Expo)
Readme: [react_native_app/README.md](./react_native_app/README.md)

### Electron App for Windows OS
Electron desktop app for HIPAA-compliant remote health management. It mirrors core mobile flows (welcome, role selection, sign in, registration) and provides a caregiver dashboard with patient overview/details and communication center, with accessibility support (e.g., keyboard navigation and screen reader support).

Platforms: Desktop (Windows/macOS/Linux via Electron)
Readme: [electron_app/README.md](./electron_app/README.md)

### React Web App
React web app (Vite) that provides browser-based patient/caregiver screens with React Router routing (e.g., dashboard, patient details, messages, and login). Useful for quickly accessing the experience from a web browser without installing a native app.

Platforms: Web (any modern browser)
Readme: [react_web_app/README.md](./react_web_app/README.md)

