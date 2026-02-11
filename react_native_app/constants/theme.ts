import { Platform } from "react-native";

// =============================================================================
// App Colors (from flutter_app/lib/theme/app_colors.dart)
// =============================================================================
export const AppColors = {
  // Primary
  primary700: "#2E60BE",
  primary600: "#1976D2",
  primary500: "#2196F3",
  primary100: "#E3ECFC",

  // Secondary
  secondary700: "#00695C",
  secondary600: "#00796B",
  secondary500: "#26A69A",
  secondary100: "#B2DFDB",

  // Accent
  accent600: "#6A1B9A",
  accent500: "#7B1FA2",
  accent400: "#AB47BC",
  accent100: "#E1BEE7",

  // Semantic
  success700: "#006605",
  success500: "#4CAF50",
  success100: "#DDF4DD",

  warning700: "#A25100",
  warning500: "#FF9800",
  warning100: "#FDE8C9",

  error700: "#C62828",
  error500: "#FF6257",
  error100: "#FFE5E8",

  info700: "#0277BD",
  info500: "#03A9F4",
  info100: "#B3E5FC",

  // Neutrals
  gray900: "#212121",
  gray700: "#616161",
  gray500: "#9E9E9E",
  gray300: "#E0E0E0",
  gray100: "#F5F5F5",

  // Dark mode
  darkBgPrimary: "#121212",
  darkBgSecondary: "#1E1E1E",
  darkBgElevated: "#2C2C2C",
  darkTextPrimary: "#FFFFFF",
  darkTextSecondary: "#B3B3B3",
  darkBorder: "#3F3F3F",

  white: "#FFFFFF",
} as const;

// =============================================================================
// Theme Colors (light / dark defaults for RN app)
// =============================================================================
export const Colors = {
  light: {
    text: AppColors.gray900,
    tint: AppColors.primary700,
    textSecondary: AppColors.gray700,
    background: AppColors.white,
    surface: AppColors.gray100,
    border: AppColors.gray300,
    primary: AppColors.primary700,
    onPrimary: AppColors.white,
    primarySoft: AppColors.primary100,
    secondary: AppColors.secondary700,
    secondarySoft: AppColors.secondary100,
    accent: AppColors.accent600,
    accentSoft: AppColors.accent100,
    success: AppColors.success700,
    warning: AppColors.warning700,
    error: AppColors.error700,
    info: AppColors.info700,
    icon: AppColors.gray700,
    tabIconDefault: AppColors.gray500,
    tabIconSelected: AppColors.primary700,
  },
  dark: {
    text: AppColors.darkTextPrimary,
    tint: AppColors.primary500,
    textSecondary: AppColors.darkTextSecondary,
    background: AppColors.darkBgPrimary,
    surface: AppColors.darkBgSecondary,
    border: AppColors.darkBorder,
    primary: AppColors.primary500,
    onPrimary: AppColors.white,
    primarySoft: AppColors.primary700,
    secondary: AppColors.secondary500,
    secondarySoft: AppColors.secondary700,
    accent: AppColors.accent400,
    accentSoft: AppColors.accent600,
    success: AppColors.success500,
    warning: AppColors.warning500,
    error: AppColors.error500,
    info: AppColors.info500,
    icon: AppColors.darkTextSecondary,
    tabIconDefault: AppColors.darkTextSecondary,
    tabIconSelected: AppColors.darkTextPrimary,
  },

  // High contrast: maximum contrast for accessibility. Toggle via preferences (coming soon).
  highContrastLight: {
    text: "#000000",
    tint: "#000000",
    textSecondary: "#000000",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    border: "#000000",
    primary: "#000000",
    onPrimary: "#FFFFFF",
    primarySoft: "#E0E0E0",
    secondary: "#000000",
    secondarySoft: "#E0E0E0",
    accent: "#000000",
    accentSoft: "#E0E0E0",
    success: "#000000",
    warning: "#000000",
    error: "#000000",
    info: "#000000",
    icon: "#000000",
    tabIconDefault: "#000000",
    tabIconSelected: "#000000",
  },
  highContrastDark: {
    text: "#FFFFFF",
    tint: "#FFFFFF",
    textSecondary: "#FFFFFF",
    background: "#000000",
    surface: "#000000",
    border: "#FFFFFF",
    primary: "#FFFFFF",
    onPrimary: "#000000",
    primarySoft: "#333333",
    secondary: "#FFFFFF",
    secondarySoft: "#333333",
    accent: "#FFFFFF",
    accentSoft: "#333333",
    success: "#FFFFFF",
    warning: "#FFFFFF",
    error: "#FFFFFF",
    info: "#FFFFFF",
    icon: "#FFFFFF",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: "#FFFFFF",
  },
} as const;

export type ThemeKey =
  | "light"
  | "dark"
  | "highContrastLight"
  | "highContrastDark";

// =============================================================================
// Typography (from flutter_app/lib/theme/app_typography.dart & guidelines)
// =============================================================================
export const Typography = {
  h1: { fontSize: 32, fontWeight: "700", lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: "700", lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: "600", lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
  h5: { fontSize: 18, fontWeight: "600", lineHeight: 26 },
  h6: { fontSize: 16, fontWeight: "600", lineHeight: 24 },
  bodyLarge: { fontSize: 18, fontWeight: "400", lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  bodyEmphasized: { fontSize: 16, fontWeight: "600", lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  captionBold: { fontSize: 12, fontWeight: "600", lineHeight: 16 },
  buttonLarge: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  buttonMedium: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  link: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textDecorationLine: "underline",
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
