import 'package:flutter/material.dart';

// =============================================================================
// APP COLORS (THEME)
// =============================================================================
// Single source of truth for CareConnect colors. Referenced by main.dart
// [ThemeData.colorScheme], providers (typeColors, categoryColors), and screens.
// Add new semantic or dark-mode tokens here; avoid hardcoding hex in UI.
// =============================================================================

/// Central color palette for the CareConnect app.
/// Values align with the design system; use these instead of raw [Color] values.
class AppColors {
  // --- Primary (CTAs, links, key actions) ---
  static const primary700 = Color(0xFF2E60BE);
  static const primary600 = Color(0xFF1976D2);
  static const primary500 = Color(0xFF2196F3);
  static const primary100 = Color(0xFFE3ECFC);

  // --- Secondary (supporting UI, exercise/category chips) ---
  static const secondary700 = Color(0xFF00695C);
  static const secondary600 = Color(0xFF00796B);
  static const secondary500 = Color(0xFF26A69A);
  static const secondary100 = Color(0xFFB2DFDB);

  // --- Accent (sleep, timeline, gradients) ---
  static const accent600 = Color(0xFF6A1B9A);
  static const accent500 = Color(0xFF7B1FA2);
  static const accent400 = Color(0xFFAB47BC);
  static const accent100 = Color(0xFFE1BEE7);

  // --- Semantic: Success (mood, positive states) ---
  static const success700 = Color(0xFF388E3C);
  static const success500 = Color(0xFF4CAF50);
  static const success100 = Color(0xFFC8E6C9);

  // --- Semantic: Warning (meals, caution) ---
  static const warning700 = Color(0xFFEF6C00);
  static const warning500 = Color(0xFFFF9800);
  static const warning100 = Color(0xFFFFE0B2);

  // --- Semantic: Error (symptoms, danger, mic/video off) ---
  static const error700 = Color(0xFFC62828);
  static const error500 = Color(0xFFF44336);
  static const error100 = Color(0xFFFFCDD2);

  // --- Semantic: Info (water, appointments) ---
  static const info700 = Color(0xFF0277BD);
  static const info500 = Color(0xFF03A9F4);
  static const info100 = Color(0xFFB3E5FC);

  // --- Neutral (light mode text, borders, surfaces) ---
  static const gray900 = Color(0xFF212121);
  static const gray700 = Color(0xFF616161);
  static const gray500 = Color(0xFF9E9E9E);
  static const gray300 = Color(0xFFE0E0E0);
  static const gray100 = Color(0xFFF5F5F5);

  // --- Dark mode (video call, full-screen dark UIs) ---
  static const darkBgPrimary = Color(0xFF121212);
  static const darkBgSecondary = Color(0xFF1E1E1E);
  static const darkBgElevated = Color(0xFF2C2C2C);
  static const darkTextPrimary = Color(0xFFFFFFFF);
  static const darkTextSecondary = Color(0xFFB3B3B3);
  static const darkBorder = Color(0xFF3F3F3F);

  static const white = Color(0xFFFFFFFF);
}

