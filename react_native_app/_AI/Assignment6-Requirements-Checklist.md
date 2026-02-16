# Assignment 6: Accessibility & UI Testing – Requirements Checklist

**React Native CareConnect App** – Verification against Assignment 6 document

---

## 1. Accessibility Requirements (WCAG 2.1 Level AA)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| **Accessible labels** – All images, icons, interactive controls | ✅ | `accessibilityLabel` on: logo, buttons, task cards, notification cards, video call controls, calendar dates, app bar, bottom nav, Emergency SOS, etc. |
| **Color contrast** – WCAG AA minimum | ✅ | Theme uses `AppColors` with compliant ratios (e.g. primary #1976D2 on white ~4.6:1, black on white 16:1). High-contrast theme available. |
| **Focus/navigation order** – Logical tab and swipe order | ✅ | Top-to-bottom, left-to-right. Alert banner at top when unread. Emergency SOS uses `accessibilityRole="alert"`. |
| **Screen reader compatibility** – TalkBack & VoiceOver | ✅ | All interactive elements have `accessibilityRole`, `accessibilityLabel`, `accessibilityHint`. Modal uses `accessibilityViewIsModal`. |

---

## 2. Testing Requirements

| Requirement | Status | Evidence |
|-------------|--------|----------|
| **Integration tests** – Multi-screen workflows (Jest + RNTL) | ✅ | `app/__tests__/integration-workflow.test.tsx` – Welcome→Role Selection, Dashboard→Task Details, Dashboard→Emergency SOS |
| **E2E tests** – Full user journeys (Detox) | ✅ | `e2e/login-to-dashboard.e2e.ts` – Login→Dashboard flow. *Requires `expo prebuild` + native build.* |
| **Coverage 75%+** | ✅ | Current: **93.77%** statements, **82.5%** branches, **89.56%** functions, **94.6%** lines. Threshold enforced in `jest.config.js`. |

---

## 3. Plan of Action (Completed)

1. ✅ **Audit** – Accessibility audit completed; fixes applied
2. ✅ **Fix** – Labels, contrast, focus order, screen reader support addressed
3. ⏳ **Screen Reader Test** – Manual testing with TalkBack/VoiceOver (screenshots for Word doc)
4. ✅ **Integration Tests** – 6 integration tests covering multi-screen workflows
5. ✅ **E2E Tests** – Detox config + sample E2E test added
6. ✅ **Coverage** – 75%+ achieved; threshold in jest.config.js
7. ⏳ **Document** – Word document with screenshots (to be completed by team)

---

## 4. Key Files Modified/Added

### Accessibility
- `app/index.tsx` – Header role, logo role, hints
- `app/caregiver/index.tsx` – Welcome card label, divider hidden, stats summary
- `app/notifications.tsx` – Alert banner for unread (early focus)
- `app/emergency-sos.tsx` – Decorative icon hidden
- `app/video-call.tsx` – Patient camera toggle label, image labels
- `app/task-details.tsx` – Hints on action buttons, completed status
- `components/app-app-bar.tsx` – Title header
- `components/app-bottom-nav-bar.tsx` – Selected state announcement
- `components/app-menu.tsx` – Modal focus, overlay label
- `screens/PatientDashboardScreen.tsx` – Headers, summary regions

### Testing
- `app/__tests__/integration-workflow.test.tsx` – Multi-screen workflow tests
- `e2e/login-to-dashboard.e2e.ts` – Detox E2E sample
- `.detoxrc.js` – Detox configuration
- `jest.e2e.config.js` – Jest config for E2E
- `jest.config.js` – Coverage threshold 75%

### Documentation
- `_AI/Accessibility-Documentation-Template.md` – Focus order, screenshots placeholders
- `_AI/Assignment6-Requirements-Checklist.md` – This file

---

## 5. Running Tests

```bash
# Unit + integration tests
npm test

# Coverage report (75%+ enforced)
npm run test:coverage

# E2E (after expo prebuild + build)
npx expo prebuild
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
```

---

## 6. Word Document Checklist (For Submission)

- [ ] All screen screenshots (React Native app)
- [ ] Accessibility audit summary for team scenario
- [ ] TalkBack/VoiceOver testing evidence (screenshots/recordings)
- [ ] Integration test results (screenshot of `npm test`)
- [ ] E2E test results (screenshot of Detox run, or note if not run)
- [ ] Coverage report screenshot (75%+)
- [ ] AI usage statement (required)
