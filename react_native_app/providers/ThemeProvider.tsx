// =============================================================================
// THEME PROVIDER
// =============================================================================
// Unified theme management: user preference (light/dark/system) + high contrast.
// Persists preferences to AsyncStorage. Resolves colors from system scheme + preferences.
// =============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme as useSystemScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/theme";
import type { ThemeKey } from "@/constants/theme";

type ThemeScheme = "light" | "dark";
type ThemePreference = ThemeScheme | "system";

type ThemeColors = (typeof Colors)[ThemeKey];

interface ThemeContextType {
  /** Resolved color scheme (light/dark) based on preference and system. */
  colorScheme: ThemeScheme;
  /** User preference: 'light', 'dark', or 'system' (follows system). */
  preference: ThemePreference;
  /** Set user preference. Persists to AsyncStorage. */
  setPreference: (value: ThemePreference) => void;
  /** Whether high contrast mode is on. */
  highContrast: boolean;
  /** Toggle high contrast. Persists to AsyncStorage. */
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
  /** Initial preference. Default 'system'. */
  initialPreference?: ThemePreference;
  /** Initial high contrast. Default false. */
  initialHighContrast?: boolean;
}

const PREFERENCE_STORAGE_KEY = "careconnect.theme.preference";
const HIGH_CONTRAST_STORAGE_KEY = "careconnect.theme.highContrast";

function resolveThemeKey(
  colorScheme: ThemeScheme,
  highContrast: boolean
): ThemeKey {
  if (highContrast) {
    return colorScheme === "dark" ? "highContrastDark" : "highContrastLight";
  }
  return colorScheme;
}

export function ThemeProvider({
  children,
  initialPreference = "system",
  initialHighContrast = false,
}: ThemeProviderProps) {
  const systemScheme = useSystemScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(
    initialPreference
  );
  const [highContrast, setHighContrastState] = useState(initialHighContrast);

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;

    const loadPreferences = async () => {
      try {
        const [prefValue, highContrastValue] = await Promise.all([
          AsyncStorage.getItem(PREFERENCE_STORAGE_KEY),
          AsyncStorage.getItem(HIGH_CONTRAST_STORAGE_KEY),
        ]);

        if (!isMounted) return;

        if (prefValue === "light" || prefValue === "dark" || prefValue === "system") {
          setPreferenceState(prefValue);
        }

        if (highContrastValue === "true") {
          setHighContrastState(true);
        }
      } catch (error) {
        // Silently fail - use defaults
      }
    };

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  // Resolve colorScheme from preference and system
  const colorScheme = useMemo<ThemeScheme>(() => {
    if (preference === "system") {
      return systemScheme === "dark" ? "dark" : "light";
    }
    return preference;
  }, [preference, systemScheme]);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    AsyncStorage.setItem(PREFERENCE_STORAGE_KEY, value).catch(() => {});
  }, []);

  const setHighContrast = useCallback((value: boolean) => {
    setHighContrastState(value);
    AsyncStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, value.toString()).catch(
      () => {}
    );
  }, []);

  const themeKey = useMemo(
    () => resolveThemeKey(colorScheme, highContrast),
    [colorScheme, highContrast]
  );

  const colors = useMemo(() => Colors[themeKey], [themeKey]);

  const value = useMemo<ThemeContextType>(
    () => ({
      colorScheme,
      preference,
      setPreference,
      highContrast,
      setHighContrast,
      colors,
      themeKey,
    }),
    [colorScheme, preference, setPreference, highContrast, setHighContrast, colors, themeKey]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
