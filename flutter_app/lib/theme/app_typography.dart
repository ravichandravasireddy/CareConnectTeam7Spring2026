import 'package:flutter/material.dart';

// =============================================================================
// APP TYPOGRAPHY (from Guidelines.md)
// =============================================================================
// System UI typography: H1–H6, body, caption, button, link. Use in ThemeData
// via [appTextTheme] so screens use theme.textTheme instead of one-off TextStyle.
// =============================================================================

/// Typography for CareConnect per Guidelines.md (System UI).
/// Apply to ThemeData: textTheme: appTextTheme(base, color).
TextTheme appTextTheme(TextTheme base, Color bodyColor) {
  return base.copyWith(
    // Display / H1: 32, w700, height 40, letterSpacing -0.5
    displayLarge: base.displayLarge?.copyWith(
      fontSize: 32,
      fontWeight: FontWeight.w700,
      height: 40 / 32,
      letterSpacing: -0.5,
      color: bodyColor,
    ),
    // H2: 28, w700, height 36, letterSpacing -0.3
    displayMedium: base.displayMedium?.copyWith(
      fontSize: 28,
      fontWeight: FontWeight.w700,
      height: 36 / 28,
      letterSpacing: -0.3,
      color: bodyColor,
    ),
    // H3: 24, w600, height 32
    displaySmall: base.displaySmall?.copyWith(
      fontSize: 24,
      fontWeight: FontWeight.w600,
      height: 32 / 24,
      color: bodyColor,
    ),
    // H4: 20, w600, height 28
    headlineLarge: base.headlineLarge?.copyWith(
      fontSize: 20,
      fontWeight: FontWeight.w600,
      height: 28 / 20,
      color: bodyColor,
    ),
    // H5: 18, w600, height 26
    headlineMedium: base.headlineMedium?.copyWith(
      fontSize: 18,
      fontWeight: FontWeight.w600,
      height: 26 / 18,
      color: bodyColor,
    ),
    // H6: 16, w600, height 24
    headlineSmall: base.headlineSmall?.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      height: 24 / 16,
      color: bodyColor,
    ),
    // Body Large: 18, w400, height 28 (Guidelines)
    titleLarge: base.titleLarge?.copyWith(
      fontSize: 18,
      fontWeight: FontWeight.w400,
      height: 28 / 18,
      color: bodyColor,
    ),
    // Body Emphasized: 16, w600, height 24 (Guidelines)
    titleMedium: base.titleMedium?.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      height: 24 / 16,
      color: bodyColor,
    ),
    titleSmall: base.titleSmall?.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      height: 24 / 16,
      color: bodyColor,
    ),
    // Body Regular: 16, w400, height 24 (Guidelines)
    bodyLarge: base.bodyLarge?.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      height: 24 / 16,
      color: bodyColor,
    ),
    // Body Regular (alternative slot)
    bodyMedium: base.bodyMedium?.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w400,
      height: 24 / 16,
      color: bodyColor,
    ),
    // Body Small: 14, w400
    bodySmall: base.bodySmall?.copyWith(
      fontSize: 14,
      fontWeight: FontWeight.w400,
      height: 20 / 14,
      color: bodyColor,
    ),
    // Caption: 12, w400; Button Large: 16, w600
    labelLarge: base.labelLarge?.copyWith(
      fontSize: 16,
      fontWeight: FontWeight.w600,
      height: 24 / 16,
      letterSpacing: 0.5,
      color: bodyColor,
    ),
    // Button Medium: 14, w600
    labelMedium: base.labelMedium?.copyWith(
      fontSize: 14,
      fontWeight: FontWeight.w600,
      height: 20 / 14,
      letterSpacing: 0.3,
      color: bodyColor,
    ),
    // Caption / Button Small: 12, w600
    labelSmall: base.labelSmall?.copyWith(
      fontSize: 12,
      fontWeight: FontWeight.w600,
      height: 16 / 12,
      letterSpacing: 0.3,
      color: bodyColor,
    ),
  );
}
