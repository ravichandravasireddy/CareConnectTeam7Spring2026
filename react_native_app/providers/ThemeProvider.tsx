// =============================================================================
// THEME PROVIDER
// =============================================================================
// Holds high-contrast preference; resolves colors from system scheme + preference.
// Preferences screen (coming soon) will call setHighContrast to toggle.
// =============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import type { ThemeKey } from "@/constants/theme";

type ThemeColors = (typeof Colors)["light"];

interface ThemeContextType {
  /** System color scheme (light/dark). */
  colorScheme: "light" | "dark";
  /** Whether high contrast mode is on. Toggle from preferences (coming soon). */
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  /** Resolved palette: highContrastLight/Dark when highContrast, else light/dark. */
  colors: ThemeColors;
  /** Resolved key for navigation theme etc. */
  themeKey: ThemeKey;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  /** Initial high contrast. Default false. */
  initialHighContrast?: boolean;
}

function resolveThemeKey(
  colorScheme: "light" | "dark" | null | undefined,
  highContrast: boolean
): ThemeKey {
  const base = colorScheme === "dark" ? "dark" : "light";
  if (highContrast) {
    return base === "dark" ? "highContrastDark" : "highContrastLight";
  }
  return base;
}

export function ThemeProvider({
  children,
  initialHighContrast = false,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const colorScheme = systemScheme === "dark" ? "dark" : "light";
  const [highContrast, setHighContrastState] = useState(initialHighContrast);

  const setHighContrast = useCallback((value: boolean) => {
    setHighContrastState(value);
    // TODO: When preferences screen exists, persist to AsyncStorage and call setHighContrast(enabled).
  }, []);

  const themeKey = useMemo(
    () => resolveThemeKey(colorScheme, highContrast),
    [colorScheme, highContrast]
  );

  const colors = useMemo(() => Colors[themeKey], [themeKey]);

  const value = useMemo<ThemeContextType>(
    () => ({
      colorScheme,
      highContrast,
      setHighContrast,
      colors,
      themeKey,
    }),
    [colorScheme, highContrast, setHighContrast, colors, themeKey]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
