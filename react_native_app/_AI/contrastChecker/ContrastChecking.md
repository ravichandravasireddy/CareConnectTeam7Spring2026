# CareConnect React Native App – Color Contrast Analysis

This document catalogs foreground/background color combinations used in the React Native app and their WCAG 2.1 AA relevance. The app uses **ThemeProvider** (`useTheme().colors`) in most screens and **AppColors** directly in some (e.g. Welcome, Video Call, Emergency SOS, Caregiver stat icons).

## How to Use

1. Open **contrast-checker.html** in a browser to check ratios and see the full table with live calculations.
2. Use the **“Places not using app theme”** section in the HTML for screens that use hardcoded **AppColors** instead of `useTheme().colors`.
3. Apply the “Required changes” below where combinations fail WCAG AA.

## Theme Mapping (Light Mode) — from `constants/theme.ts` Colors.light

- `colors.text` → AppColors.gray900 (#212121)
- `colors.textSecondary` → AppColors.gray700 (#616161)
- `colors.background` → AppColors.white (#FFFFFF)
- `colors.surface` → AppColors.gray100 (#F5F5F5)
- `colors.border` → AppColors.gray300 (#E0E0E0)
- `colors.primary` → AppColors.primary700 (#2E60BE)
- `colors.onPrimary` → AppColors.white (#FFFFFF)
- `colors.primarySoft` → AppColors.primary100 (#E3ECFC)
- `colors.secondary` → AppColors.secondary700 (#00695C)
- `colors.accent` → AppColors.accent600 (#6A1B9A)
- `colors.accentSoft` → AppColors.accent100 (#E1BEE7)
- `colors.success` → AppColors.success700 (#006605)
- `colors.warning` → AppColors.warning700 (#A25100)
- `colors.error` → AppColors.error700 (#C62828)
- `colors.info` → AppColors.info700 (#0277BD)

AppColors (used directly in some screens): success700 #006605, success100 #DDF4DD; error500 #FF6257, error100 #FFE5E8; error700 #C62828; etc. See theme.ts for full list.

## Required Changes to Meet WCAG 2.1 AA

- **Normal text:** contrast ≥ 4.5:1.
- **Large text (18pt+ or 14pt+ bold):** contrast ≥ 3:1.
- **UI components / graphics:** contrast ≥ 3:1.

1. **Screens using AppColors only (no theme):** Consider switching to `useTheme().colors` so light/dark and high-contrast preferences apply; then re-check ratios.
2. **Low-contrast pairs:** Especially primary/secondary/accent/success/error on white or light surfaces (e.g. stat icons, links). Prefer darker variants (e.g. 700) or ensure 4.5:1 for text and 3:1 for icons.
3. **Gray text on white:** `textSecondary` (gray700) on white may be borderline; verify and darken if needed.
4. **Video Call / Emergency SOS:** These use AppColors dark and error palettes; verify white-on-dark and white-on-error ratios and any small text or icons.

Run the HTML checker for exact ratios and the in-page table for a full list.
