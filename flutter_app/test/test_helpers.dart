import 'package:flutter/material.dart';
import 'package:flutter_app/theme/app_colors.dart';

ThemeData buildTestTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: const ColorScheme(
      brightness: Brightness.light,
      primary: AppColors.primary600,
      onPrimary: AppColors.white,
      primaryContainer: AppColors.primary700,
      onPrimaryContainer: AppColors.white,
      secondary: AppColors.secondary700,
      onSecondary: AppColors.white,
      secondaryContainer: AppColors.secondary700,
      onSecondaryContainer: AppColors.white,
      tertiary: AppColors.accent500,
      onTertiary: AppColors.white,
      tertiaryContainer: AppColors.accent600,
      onTertiaryContainer: AppColors.white,
      error: AppColors.error700,
      onError: AppColors.white,
      errorContainer: AppColors.error700,
      onErrorContainer: AppColors.white,
      surface: AppColors.white,
      onSurface: AppColors.gray900,
      surfaceContainer: AppColors.gray100,
      onSurfaceVariant: AppColors.gray700,
      outline: AppColors.gray300,
      shadow: Colors.black,
      inverseSurface: AppColors.gray900,
      onInverseSurface: AppColors.white,
      inversePrimary: AppColors.primary100,
    ),
    scaffoldBackgroundColor: AppColors.gray100,
    textTheme: ThemeData.light().textTheme.apply(
          bodyColor: AppColors.gray900,
          displayColor: AppColors.gray900,
        ),
  );
}

Widget buildTestApp(Widget child) {
  return MaterialApp(
    theme: buildTestTheme(),
    home: child,
  );
}
