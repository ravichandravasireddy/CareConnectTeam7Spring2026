// =============================================================================
// PROVIDERS COMPONENT
// =============================================================================
// Centralized provider wrapper for all app-wide providers.
// This keeps _layout.tsx clean and makes it easy to add/remove providers.
// =============================================================================

import React, { ReactNode } from 'react';
import { TaskProvider } from './TaskProvider';
import { NotificationProvider } from './NotificationProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Wraps the app with all necessary providers.
 * Add new providers here instead of nesting them in _layout.tsx
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <TaskProvider>
      <NotificationProvider>
        {/* Add more providers here as needed */}
        {/* Example: <AuthProvider> */}
        {children}
      </NotificationProvider>
    </TaskProvider>
  );
}
