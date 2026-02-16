# CareConnect React Native App – Accessibility Documentation

**Purpose:** Document accessibility labels, focus/navigation order, and screen reader compatibility for TalkBack (Android) and VoiceOver (iOS).

**Instructions for your Word file:**
1. For each main screen below, add a screenshot of the screen.
2. List the focus order sequence as a numbered list (matches swipe order with TalkBack/VoiceOver).
3. Add 1–2 screenshots showing TalkBack/VoiceOver focus highlight as evidence you tested.
4. Briefly note any fixes made (reordered elements, added grouping/labels, improved modal focus).

---

## 1. Welcome Screen (index)

**Screenshot:** [Insert screenshot of Welcome screen]

**Focus order sequence:**
1. CareConnect logo (image)
2. CareConnect (header)
3. Subtitle text – "Remote health management and coordination for patients and caregivers"
4. Get Started (button)
5. Sign In (button)
6. HIPAA-compliant • Secure • Private (text)
7. Navigation Hub → (button, dev shortcut)

**TalkBack/VoiceOver evidence:** [Insert 1–2 screenshots showing focus highlight on a button and/or header]

**Fixes made:**
- Added `accessibilityRole="header"` to CareConnect title
- Added `accessibilityRole="image"` to logo
- Added `accessibilityHint` to Get Started, Sign In, and Navigation Hub buttons
- Screen reader announces "CareConnect welcome. All feedback is visual only" on container

---

## 2. Caregiver Dashboard

**Screenshot:** [Insert screenshot of Caregiver Dashboard]

**Focus order sequence:**
1. Menu (button)
2. Dashboard (header)
3. Notifications, 1 unread notification (button) – *critical alert reachable early*
4. Welcome card – "Good morning, Dr. Sarah Johnson. Here's your care overview for today."
5. Quick stats region – "X patients, Y of Z tasks, 1 alerts"
6. Patients (button)
7. Tasks (button)
8. Alerts (button) – *critical; tap to view emergency SOS*
9. Today's Tasks (header)
10. Manage (button)
11. Task cards (one per task) – "Task title, time, for Patient Name, tap to view details"
12. [If empty: "No tasks scheduled for today"]

**TalkBack/VoiceOver evidence:** [Insert 1–2 screenshots showing focus on Alerts card and/or task card]

**Fixes made:**
- Added `accessibilityRole="header"` and `accessibilityLabel` to welcome card
- Added `accessibilityRole="summary"` to quick stats region
- Alerts card has `accessibilityLabel="Alerts, 1 unread. Tap to view emergency SOS"`
- Hidden decorative divider from screen reader (`accessibilityElementsHidden`)

---

## 3. Patient Dashboard (Home)

**Screenshot:** [Insert screenshot of Patient Home]

**Focus order sequence:**
1. Menu (button)
2. Home (header)
3. Notifications, 1 unread notification (button) – *critical alert reachable early*
4. Welcome card – "Good morning, [Name]. Here's your health overview for today."
5. Quick stats – "Tasks, 3/5. Completed today" and "BP Today, 120/80, Normal"
6. Upcoming tasks (header)
7. View All (button)
8. Task cards (one per task)
9. Today's Appointments (header)
10. Virtual Appointment card – "Start video call with Dr. Johnson"
11. Log Health Data (button)
12. Send Message (button)
13. Emergency SOS (button) – *critical; "Alerts all caregivers with your current location"*

**TalkBack/VoiceOver evidence:** [Insert 1–2 screenshots showing focus on Emergency SOS and/or Notifications]

**Fixes made:**
- Added `accessibilityRole="header"` to welcome card and section headers
- Added `accessibilityRole="summary"` to quick stats region
- Emergency SOS: `accessibilityLabel="Emergency SOS button. Alerts all caregivers with your current location."`
- Video call button: `accessibilityLabel="Start video call with Dr. Johnson"`

---

## 4. Notifications Screen

**Screenshot:** [Insert screenshot of Notifications screen]

**Focus order sequence:**
1. Go back (button)
2. Notifications (header)
3. **Alert banner** (when unread) – "You have X unread notification(s). Mark all as read or tap a notification to view." – *critical; reachable early*
4. Mark all as read (button)
5. Section header – "Today" / "Yesterday" / date
6. Notification cards (one per notification) – "Title, summary, time, tap to mark as read"

**TalkBack/VoiceOver evidence:** [Insert 1–2 screenshots showing focus on alert banner and notification card]

**Fixes made:**
- Added alert banner at top when unread count > 0 with `accessibilityRole="alert"`
- Alert banner announces unread count and actions
- Mark all as read and notification cards have clear labels and hints

---

## 5. Emergency SOS Alert Screen

**Screenshot:** [Insert screenshot of Emergency SOS screen]

**Focus order sequence:**
1. **Alert container** – "Emergency alert from Robert Williams. Patient ID RW-2847. Location 742 Evergreen Terrace, Springfield. Tap Acknowledge Alert to confirm." – *entire screen announced as alert*
2. EMERGENCY ALERT (header)
3. From card – "From: Robert Williams, Patient ID: #RW-2847"
4. Timestamp – "2 minutes ago"
5. Patient detail card – patient name, conditions, location
6. Acknowledge Alert (button)

**TalkBack/VoiceOver evidence:** [Insert 1–2 screenshots showing focus on alert and Acknowledge button]

**Fixes made:**
- Container has `accessibilityRole="alert"` so screen reader announces immediately
- Full context (patient, location) in container label
- Acknowledge button: `accessibilityHint="Confirms you have seen the alert. Screen will close in 3 seconds."`
- Decorative alert icon hidden from screen reader (redundant with container label)

---

## 6. Task Details Screen

**Screenshot:** [Insert screenshot of Task Details]

**Focus order sequence:**
1. Go back (button)
2. Task Details (header)
3. Task card – "Task title, time, for Patient Name"
4. RECURRING (pill)
5. Date row
6. Patient row (if applicable)
7. Mark as Complete (button) – or "Task completed" (status) if done
8. Snooze (button)
9. Skip Today (button)

**TalkBack/VoiceOver evidence:** [Insert 1–2 screenshots showing focus on Mark as Complete and action buttons]

**Fixes made:**
- Added `accessibilityHint` to Mark as Complete, Snooze, Skip Today
- Completed banner has `accessibilityRole="status"` and `accessibilityLabel="Task completed"`
- Action buttons follow clear sequence: primary action first, then secondary

---

## 7. App Menu (Modal)

**Focus order sequence:**
1. Close menu, tap outside to dismiss (overlay)
2. Menu (header)
3. Menu items (Home, Tasks, Messages, etc.) – in list order
4. Sign Out
5. Cancel – "Closes the menu"

**Fixes made:**
- Modal has `accessibilityViewIsModal={true}` so focus stays within menu
- Overlay has clear "Close menu" label
- Cancel has `accessibilityHint="Closes the menu"`

---

## Bottom Navigation Bar

**Focus order:** Home → Tasks → [Analytics/Messages] → [Monitor/Health] → Profile (caregiver/patient variants)

**Announcements:**
- Selected tab: "[Label], selected" (e.g., "Home, selected")
- Unselected: "[Label]" with hint "Go to [Label]"

---

## Summary of Accessibility Improvements

| Area | Change |
|------|--------|
| **Critical alerts early** | Notifications badge in app bar; alert banner on Notifications screen; Emergency SOS container as `alert` |
| **Focus order** | Top-to-bottom, left-to-right; headers and regions before interactive elements |
| **Labels** | All buttons, cards, and regions have `accessibilityLabel` and `accessibilityHint` where helpful |
| **Modals** | App menu uses `accessibilityViewIsModal` for proper focus trapping |
| **Decorative elements** | Divider and redundant icons hidden with `accessibilityElementsHidden` |
| **Screen reader roles** | `header`, `summary`, `alert`, `status`, `button` used appropriately |
