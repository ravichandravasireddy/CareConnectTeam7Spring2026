// =============================================================================
// PROVIDERS COMPONENT
// =============================================================================
// Centralized provider wrapper for all app-wide providers.
// This keeps _layout.tsx clean and makes it easy to add/remove providers.
// =============================================================================

import React, { ReactNode } from 'react';
import { TaskProvider } from './TaskProvider';
import { NotificationProvider } from './NotificationProvider';
import { NoteProvider } from './NoteProvider';

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
        <NoteProvider>
          {/* Add more providers here as needed */}
          {/* Example: <AuthProvider> */}
          {children}
        </NoteProvider>
      </NotificationProvider>
    </TaskProvider>
  );
}
