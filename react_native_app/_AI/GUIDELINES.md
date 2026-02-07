# GUIDELINES DOC

## Copilot and Cusor AI intsructions for every prompt
- Read this section in the guidelines before every prompt
- Use the app theme colors and typography located in [theme.ts](../constants/theme.ts) at all times for all components.
- Keep the accessibility constraint of **hearing-impaired / deaf caregivers** for all component implementations. If specifics are needed, refer to accessibility section below
- Components in the `react_native_app` should have feature parity with the components in the `flutter_app` two folders up 
- Put all providers in the provider component
- Use proper icon components and not emojis for icons
- If a file is marked "DELETE ME AT MERGE," but I am using it now, remove this label



## Accessibility requirements reference

**When creating or editing any UI code, follow the requirements in `_CURSOR/AccessiblityNotes.txt`.** Use this section as a checklist.

### Screen reader & semantics

- Provide **semantic labels** that match the intended announcements (e.g. "Notifications, 1 unread notification", "Emergency SOS button. Alerts all caregivers with your current location.").
- Use Flutter **`Semantics`** (and `semanticsLabel`, `label`, `hint`, `value`) so that:
  - Buttons/controls announce their purpose and state (e.g. "Enable notifications, switch, currently on").
  - Lists/regions have appropriate roles and labels (e.g. "Upcoming tasks", "Patient list").
- **Reading order** must follow visual order (top to bottom, left to right). Use `Semantics` order or `MergeSemantics`/`ExcludeSemantics` only when necessary to avoid duplicate or wrong order.

### Touch targets

- **Minimum size**: 44×44 logical pixels (iOS 44pt, Android 48dp, WCAG AAA 44×44px).
- **Primary buttons**: height ≥48px, 8px spacing between buttons.
- **Icon buttons**: 48×48px, 12px between icons.
- **Text inputs**: height ≥48px, 16px vertical spacing.
- **Checkbox/radio**: 48×48px tap target (24px icon + 12px padding), 8px between items.
- **List items**: height ≥64px (increase to ≥96px at 200% text scale).
- **Bottom nav items**: 56×56px, evenly distributed.
- Use `MaterialTapTargetSize.shrinkWrap` only when the visible hit area is still ≥44×44; otherwise prefer `MaterialTapTargetSize.padded` or explicit `minWidth`/`minHeight`.

### Keyboard & focus

- **Focus order**: Tab / Shift+Tab move through interactive elements in logical order.
- **Activation**: Enter/Space activate buttons and toggles; Arrow keys for lists/radio groups; Esc closes modals/dialogs.
- **Focus indicators**: All interactive elements must have a **visible 2px focus ring** with at least **4.5:1 contrast** (e.g. blue ring on white). Do not hide or remove focus.
- **Shortcuts** (when applicable): Cmd/Ctrl+H (Home), Cmd/Ctrl+M (Messages), Cmd/Ctrl+S (Search).
- Use `Focus`, `FocusTraversalGroup`, and theme `focusColor` / `focusIndicatorTheme` as needed.

### Color contrast (WCAG AA)

- **Normal text** (e.g. 16px): minimum **4.5:1** contrast ratio.
- **Large text** (e.g. 24px+): minimum **3:1** contrast ratio.
- **Interactive elements**: minimum **3:1** contrast ratio.
- Prefer theme/`AppColors` combinations that already meet or exceed these (e.g. primary on white, black on white). Verify in both light and dark mode.

### Text scaling (200%)

- All text must scale with system/text scale (relative units; avoid fixed small sizes for body text).
- Layouts must **reflow**; no horizontal scrolling or clipping of text at 200%.
- **Touch targets** must remain at least 44×44 logical px even when text is scaled (e.g. list row height increases).
- Cards, forms, and modals should stack or scroll as needed; navigation must stay accessible.

### Reduced motion

- Respect **`MediaQuery.disableAnimations`** (and platform “reduce motion” where exposed).
- Reduce or remove non-essential animations for users who prefer reduced motion; keep critical feedback (e.g. success/error) visible without relying on motion alone.

### Dark mode

- **Contrast ratios** must be maintained in dark theme.
- Use **`Theme.of(context).colorScheme`** (and `AppColors` dark tokens) for all UI; no hardcoded light-only colors.

### Deaf & hard of hearing users (primary target)

- **No audio dependency**: All feedback must be visual. Never rely on sound alone for alerts, confirmations, or notifications.
- **Visual alternatives**: Use text labels, icons, color, and layout to convey meaning. Alerts (e.g. Emergency SOS) must be highly visible (contrast, size, placement).
- **Text-based content**: Critical information (patient names, vitals, task details) must be displayed as text, not conveyed only via audio.
- **Notification badges**: Use visible badges (e.g. red dot) for unread state; do not rely on notification sounds.
- **Video/call features**: When implemented, support captions/subtitles and visual call indicators (no audio-only ringtone).
- **Haptic feedback**: Optional tactile feedback (e.g. tab press) is acceptable as a supplement to visual feedback.

### Error prevention & forms

- **Confirmation dialogs** for critical/destructive actions (e.g. SOS, delete account).
- **Clear error messages** with recovery suggestions.
- **Form validation** with inline, accessible feedback (associated with fields via semantics/labels).