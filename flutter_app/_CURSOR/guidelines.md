# CareConnect Mobile App – Implementation Guidelines (internal)

Source design doc: `https://polo-icy-51720607.figma.site` (“Design System for Mobile App V2”).

**Reference for every prompt:** Use **app theme colors** only — see “Color policy” below and `lib/theme/app_colors.dart`. Do not use raw hex or `Colors.*` for UI.

## Color policy (important)

- **Do not use raw hex colors or `Colors.*` for app styling.**
- **All colors must come from** `flutter_app/lib/theme/app_colors.dart` (and via `Theme.of(context).colorScheme` where possible).
- When translating the design doc’s color names (Primary/Secondary/Accent/Semantic/Neutral/Dark Mode), **map them to the closest `AppColors.*` token**.
  - Example mapping intent:
    - **Primary actions** → `AppColors.primary600/700`
    - **Primary light backgrounds** → `AppColors.primary100`
    - **Secondary actions** → `AppColors.secondary600/700`
    - **Accent** → `AppColors.accent500/600` (+ `accent100` for backgrounds)
    - **Semantic** → `success*`, `warning*`, `error*`, `info*`
    - **Neutrals** → `gray*`, `white`, and dark-mode tokens `dark*`

## Typography (System UI)

### Font families

- **Primary font**: System UI (SF / Roboto stack)
  - Use for **all UI text, headings, body copy**
- **Monospace**: System monospace stack
  - Use for **medication codes, timestamps, technical data**

### Heading styles (H1–H6)

- **H1**: 32px, weight 700, line-height 40px (1.25), letter-spacing -0.5px  
  Usage: page titles, main screen headers
- **H2**: 28px, weight 700, line-height 36px (1.29), letter-spacing -0.3px  
  Usage: section headers, modal titles
- **H3**: 24px, weight 600, line-height 32px (1.33)  
  Usage: card titles, subsection headers
- **H4**: 20px, weight 600, line-height 28px (1.4)  
  Usage: list section headers
- **H5**: 18px, weight 600, line-height 26px (1.44)  
  Usage: component headers, small titles
- **H6**: 16px, weight 600, line-height 24px (1.5)  
  Usage: list item titles, labels

### Body / caption styles

- **Body Large**: 18px, weight 400, line-height 28px (1.56)  
  Usage: important body text, introductions
- **Body Regular**: 16px, weight 400, line-height 24px (1.5)  
  Usage: standard body text, descriptions, content
- **Body Emphasized**: 16px, weight 600, line-height 24px (1.5)  
  Usage: emphasized text, strong statements
- **Body Small**: 14px, weight 400, line-height 20px (1.43)  
  Usage: supporting text, metadata, timestamps
- **Caption**: 12px, weight 400, line-height 16px (1.33)  
  Usage: helper text, labels, fine print
- **Caption Bold**: 12px, weight 600, line-height 16px (1.33)  
  Usage: badge labels, status indicators

### Buttons / links typography

- **Button Large**: 16px, weight 600, line-height 24px, letter-spacing 0.5px
- **Button Medium**: 14px, weight 600, line-height 20px, letter-spacing 0.3px
- **Button Small**: 12px, weight 600, line-height 16px, letter-spacing 0.3px
- **Link**: 16px, weight 400, line-height 24px, **underline**

## Accessibility & readability rules

- **Minimum body text size**: 16px.
- **Body line-height**: at least 1.5× (e.g., 24px for 16px).
- **Line length**: aim for 60–70 characters per line.
- **Text scaling**: all screens must support up to **200%** zoom without breaking layout.
- **System fonts**: preferred for performance and platform-native accessibility.

## Implementation notes (Flutter)

- Prefer **theme-driven** styling:
  - `Theme.of(context).colorScheme.*` for surfaces, outlines, primary/secondary/tertiary, etc.
  - `AppColors.*` for named tokens when the semantic intent is clearer (e.g., `AppColors.error500`).
- Avoid creating one-off `TextStyle(...)` everywhere; prefer:
  - Define/extend `ThemeData.textTheme` centrally (then use `Text(theme.textTheme...)`).
  - Use `copyWith(...)` sparingly for local overrides.
- Ensure dark mode works:
  - Use `colorScheme.surface`, `onSurface`, `background`, `onBackground`, `outline`, etc., not hardcoded neutrals.

## Accessibility requirements (reference)

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

### Error prevention & forms

- **Confirmation dialogs** for critical/destructive actions (e.g. SOS, delete account).
- **Clear error messages** with recovery suggestions.
- **Form validation** with inline, accessible feedback (associated with fields via semantics/labels).