import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemScheme } from 'react-native';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeScheme = 'light' | 'dark';
type ThemePreference = ThemeScheme | 'system';

type ThemePreferenceContextValue = {
  resolvedScheme: ThemeScheme;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
};

const STORAGE_KEY = 'careconnect.theme.preference';

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(
  null
);

export function ThemePreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useSystemScheme() === 'dark' ? 'dark' : 'light';
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!isMounted || !value) return;
        if (value === 'light' || value === 'dark' || value === 'system') {
          setPreferenceState(value);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = (value: ThemePreference) => {
    setPreferenceState(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
  };

  const resolvedScheme = preference === 'system' ? systemScheme : preference;

  const contextValue = useMemo(
    () => ({
      resolvedScheme,
      preference,
      setPreference,
    }),
    [resolvedScheme, preference]
  );

  return (
    <ThemePreferenceContext.Provider value={contextValue}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    return {
      resolvedScheme: 'light' as ThemeScheme,
      preference: 'system' as ThemePreference,
      setPreference: () => {},
    };
  }
  return context;
}
