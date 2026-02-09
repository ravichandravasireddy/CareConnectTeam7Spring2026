// DELETE ME AT MERGE - Example app hook, not used in CareConnect app
import { useEffect, useState } from 'react';
import { useThemePreference } from '@/context/theme-preference';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { resolvedScheme } = useThemePreference();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return resolvedScheme;
  }

  return 'light';
}
