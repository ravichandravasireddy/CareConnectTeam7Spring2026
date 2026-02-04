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
  success700: "#388E3C",
  success500: "#4CAF50",
  success100: "#C8E6C9",

  warning700: "#EF6C00",
  warning500: "#FF9800",
  warning100: "#FFE0B2",

  error700: "#C62828",
  error500: "#F44336",
  error100: "#FFCDD2",

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
    textSecondary: AppColors.gray700,
    background: AppColors.white,
    surface: AppColors.gray100,
    border: AppColors.gray300,
    primary: AppColors.primary600,
    primarySoft: AppColors.primary100,
    secondary: AppColors.secondary600,
    secondarySoft: AppColors.secondary100,
    accent: AppColors.accent500,
    accentSoft: AppColors.accent100,
    success: AppColors.success500,
    warning: AppColors.warning500,
    error: AppColors.error500,
    info: AppColors.info500,
    icon: AppColors.gray700,
    tabIconDefault: AppColors.gray500,
    tabIconSelected: AppColors.primary600,
  },
  dark: {
    text: AppColors.darkTextPrimary,
    textSecondary: AppColors.darkTextSecondary,
    background: AppColors.darkBgPrimary,
    surface: AppColors.darkBgSecondary,
    border: AppColors.darkBorder,
    primary: AppColors.primary500,
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
} as const;

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
