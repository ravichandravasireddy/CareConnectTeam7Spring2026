import { useThemePreference } from '@/context/theme-preference';

export const useColorScheme = () => {
  const { resolvedScheme } = useThemePreference();
  return resolvedScheme;
};
