import { useTheme } from '@/providers/ThemeProvider';

/**
 * Hook that returns the resolved color scheme (light/dark).
 * This is a convenience wrapper around useTheme() for components that only need the scheme.
 * For full theme access (colors, highContrast, etc.), use useTheme() directly.
 */
export const useColorScheme = () => {
  const { colorScheme } = useTheme();
  return colorScheme;
};
