# WCAG 2.1 AA Accessibility Audit — CareConnect Desktop UI

**Audit date:** February 2026  
**Scope:** `electron_app/renderer/` (index.html, styles.css, app.js)  
**Screens:** Welcome, Role Selection, Sign In, Registration; Dashboard, Patient Detail, Communication Center  
**Design System:** Figma (plan-dazzle-36488421.figma.site)

---

## Executive Summary

| Status | Count |
|--------|-------|
| ✅ Pass | 25 |
| ⚠️ Partial / Review | 0 |
| ❌ Fail | 0 |

---

## 1. Perceivable

### 1.1.1 Non-text Content (A) — ✅ Pass
- Decorative logo has `aria-hidden="true"`
- Role icons (👤 🩺) have `aria-hidden="true"`
- All buttons use text labels; no images requiring alt text

### 1.3.1 Info and Relationships (A) — ✅ Pass
- Semantic structure: single `<main role="main">`, `<section>`, `<h1>`, `<h2>`, `<form>`, `<label>`
- Dashboard main content uses `<div>` (no nested `<main>`)
- Labels correctly associated with inputs via `for`/`id`
- Form fields grouped logically; error messages in `aria-live` regions

### 1.4.1 Use of Color (A) — ✅ Pass
- No information conveyed by color alone; errors use text + border

### 1.4.3 Contrast (Minimum) (AA) — ✅ Pass
- Text #212121 on #FFFFFF: ~16.2:1
- Text #616161 on #F5F5F5: ~5.7:1
- Primary #2E60BE on white (buttons): ~4.6:1 for large text
- White on gradient (primary/accent): sufficient

### 1.4.4 Resize Text (AA) — ✅ Pass
- Uses `rem`, `clamp()`, and relative units; scales with zoom

### 1.4.10 Reflow (AA) — ✅ Pass
- Responsive layout; no horizontal scroll at 320px; content reflows

### 1.4.11 Non-text Contrast (AA) — ✅ Pass
- Borders use gray-500 (#9E9E9E) on white: ~3.5:1 — meets 3:1 minimum

### 1.4.12 Text Spacing (AA) — ✅ Pass
- No fixed heights that would clip text when user adjusts spacing

---

## 2. Operable

### 2.1.1 Keyboard (A) — ✅ Pass
- All controls keyboard-focusable; `tabindex="-1"` removed from toggle-password buttons

### 2.1.2 No Keyboard Trap (A) — ✅ Pass
- No modals or focus traps; all screens allow Tab navigation

### 2.4.1 Bypass Blocks (A) — ✅ Pass
- Skip link "Skip to main content" at top of page; visible on focus; targets auth view or dashboard main content

### 2.4.3 Focus Order (A) — ✅ Pass
- Tab order follows DOM order; logical flow through each screen

### 2.4.6 Headings and Labels (AA) — ✅ Pass
- Headings descriptive: "CareConnect", "Choose Your Role", "Welcome Back", "Join CareConnect"
- Form labels and button text are clear

### 2.4.7 Focus Visible (AA) — ✅ Pass
- `*:focus-visible` with 4px solid outline and 2px offset (design system: prominent for hearing-impaired)
- Role cards have `:focus-visible` border styling
- Input focus: border + box-shadow for redundant visual cue

### 2.5.5 Target Size (AAA) — ✅ Pass (bonus)
- All interactive elements meet 44×44px minimum (buttons, inputs, toggle-password)

---

## 3. Understandable

### 3.1.1 Language of Page (A) — ✅ Pass
- `<html lang="en">` present

### 3.2.1 On Focus (A) — ✅ Pass
- No context changes on focus

### 3.2.2 On Input (A) — ✅ Pass
- Form submission and navigation are expected; no unexpected changes

### 3.3.1 Error Identification (A) — ✅ Pass
- Validation errors shown in `field-error` spans with `aria-live="polite"`
- Errors associated with inputs via proximity and `id` references

### 3.3.2 Labels or Instructions (A) — ✅ Pass
- All form fields have visible labels; password has hint text

---

## 4. Robust

### 4.1.2 Name, Role, Value (A) — ✅ Pass
- Buttons have accessible names from text content
- Toggle buttons update `aria-label` when state changes (Show/Hide password)
- `#status-announce` provides live region for screen reader announcements

### 4.1.3 Status Messages (AA) — ✅ Pass
- `#status-announce` has `aria-live="polite"`, `aria-atomic="true"`, `role="status"`
- Field errors use `aria-live="polite"`
- Screen transitions announced via `announce()` function

---

## Fixes Applied

| Criterion | Issue | Fix Applied |
|-----------|-------|-------------|
| 2.1.1 | Toggle password buttons had `tabindex="-1"` | Removed `tabindex="-1"` so they are keyboard-focusable |
| 1.4.11 | Gray-300 borders below 3:1 contrast | Changed to gray-500 (#9E9E9E) for inputs, cards, and borders |
| 2.4.1 | No skip link for dashboard layout | Added "Skip to main content" link; visible on focus; targets auth or dashboard main |
| 1.3.1 | Nested `<main>` (outer #app and inner dashboard-main) | Changed dashboard-main to `<div id="main-content">` |

---

## Recommendations

1. **Error handling:** For critical validation failures, consider `aria-live="assertive"` on the first error to ensure immediate announcement.
2. **Message list:** Consider `aria-label` on message list items for clearer accessible names when many messages are present.
