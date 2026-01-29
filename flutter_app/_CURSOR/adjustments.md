# Accessibility adjustments (proposed)

**Purpose:** List changes to current files so the app meets the requirements in `AccessiblityNotes.txt`.  
**Status:** Proposed only — implement after sign-off on which items to apply.

---

## 1. `lib/main.dart` (theme)

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 1.1 | Focus indicators: visible 2px ring, ≥4.5:1 contrast | Set `ThemeData.focusColor` and/or `focusIndicatorTheme` (e.g. 2px outline, primary or high-contrast color) for both light and dark themes. |
| 1.2 | Text scaling to 200% | Ensure `textTheme` and `primaryTextTheme` use relative scaling where possible; avoid `textScaleFactor` overrides that cap scaling. |
| 1.3 | Dark mode contrast | Confirm `darkTheme` `ColorScheme` and `textTheme` meet 4.5:1 (normal text) and 3:1 (large text / UI). |

---

## 2. `lib/screens/welcome_screen.dart`

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 2.1 | Screen reader: buttons | Wrap "Get Started" and "Sign In" in `Semantics` with `label` matching intent (e.g. "Get Started, button", "Sign In, button"). |
| 2.2 | Touch targets | Ensure both buttons have minimum height 48px (already 56px — OK). Confirm tap target is at least 48×48. |
| 2.3 | Focus | Ensure `ElevatedButton`/`OutlinedButton` show focus ring when focused (theme from 1.1). |
| 2.4 | Reading order | Verify order: title → description → Get Started → Sign In → HIPAA text. No semantic reordering needed if layout matches. |

---

## 3. `lib/screens/role_selection_screen.dart`

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 3.1 | Screen reader: cards | Add `Semantics` to each `RoleCard`: e.g. "Care Recipient, I'm managing my own health and tasks, button" and "Caregiver, I'm caring for one or more people, button" (or use `semanticsLabel` on the tappable widget). |
| 3.2 | Touch targets | Ensure each card’s `InkWell` has minimum 48dp height tap area; entire card can be tappable (list-item style). |
| 3.3 | Focus | Visible focus on cards and back button when using keyboard. |

---

## 4. `lib/screens/create_account_screen.dart`

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 4.1 | Form fields: labels | Ensure every `TextFormField` has an associated label for screen readers (`Semantics` with `label` or ensure `InputDecoration` label is exposed). |
| 4.2 | Error messages | Ensure validation errors are announced (e.g. `Semantics` with `value` or `hint` when error is shown). |
| 4.3 | Checkbox | "Terms of Service" checkbox: minimum 48×48 tap target; semantics e.g. "I agree to the Terms of Service and Privacy Policy, checkbox, unchecked/checked". |
| 4.4 | Buttons | "Create Account" and "Sign In" link: semantics + 48px min height; focus visible. |
| 4.5 | Error prevention | If not already present, add confirmation step for account creation (e.g. "You are about to create an account…") if required by product. |

---

## 5. `lib/screens/notification_screen.dart`

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 5.1 | Screen reader: list | Wrap notification list in `Semantics` with appropriate role (e.g. `list`) and section labels ("Today", "Yesterday") as headers/regions. |
| 5.2 | Notification cards | Each card: `Semantics` with `label` combining title + summary + time, e.g. "Medication Reminder, Time to take your Lisinopril 10mg, 15 minutes ago, button" and hint "Tap to mark as read". |
| 5.3 | "Mark all as read" | `Semantics` with `label` e.g. "Mark all as read, button". Already ≥48×48 — confirm. |
| 5.4 | Touch targets | Each notification row and the Mark all as read button: minimum 48×48 (or full-width row with min height 48). |
| 5.5 | Focus | Focus order: back → Mark all as read → then each notification. |

---

## 6. `lib/screens/calendar_screen.dart`

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 6.1 | Screen reader: calendar | Month header: semantics "January 2026". Calendar grid: expose as table or list; each date cell with label e.g. "26, today, has tasks" or "26, 3 tasks" and "5, has tasks". |
| 6.2 | Date cells | Each cell: `Semantics` with `button` role, label = date + "today" if applicable + "has tasks" if applicable; hint "Tap to select". |
| 6.3 | Touch targets | Date cells and prev/next month buttons: minimum 48×48. If cell is smaller, add padding or use `minimalTapTargetSize` so effective tap area ≥48×48. |
| 6.4 | Task list | "Tasks for [date]" as region; each task card with semantics (title + time + type). |
| 6.5 | Focus | Order: back → prev month → next month → date cells (row by row) → task list. |

---

## 7. Global / future

| # | Requirement | Proposed change |
|---|-------------|-----------------|
| 7.1 | Skip link | If the app grows (e.g. bottom nav, multiple regions), add a "Skip to main content" or "Skip to [primary region]" link at the top of key screens for keyboard/screen reader users. |
| 7.2 | SOS / critical actions | When Emergency SOS or similar is added: semantics "Emergency SOS button. Alerts all caregivers with your current location."; confirmation dialog before sending; touch target ≥56px height. |
| 7.3 | Reduced motion | Where non-essential animations are used (e.g. `AnimatedCrossFade`, page transitions), check `MediaQuery.disableAnimations` and use shorter or no animation when true. |
| 7.4 | Voice Control | Ensure all interactive widgets have a concise, accurate `semanticsLabel` that matches visible text so voice control works. |

---

## Summary table (for sign-off)

| File | Item IDs | Sign-off (Y/N/partial) |
|------|----------|-------------------------|
| main.dart | 1.1, 1.2, 1.3 | |
| welcome_screen.dart | 2.1–2.4 | |
| role_selection_screen.dart | 3.1–3.3 | |
| create_account_screen.dart | 4.1–4.5 | |
| notification_screen.dart | 5.1–5.5 | |
| calendar_screen.dart | 6.1–6.5 | |
| Global / future | 7.1–7.4 | |

After sign-off, implement only the approved items and remove or archive this file as needed.
