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
import { HealthLogProvider } from './HealthLogProvider';
import { UserProvider } from './UserProvider';
import { ThemeProvider } from './ThemeProvider';
import { ThemePreferenceProvider } from "@/context/theme-preference";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Wraps the app with all necessary providers.
 * ThemeProvider: high-contrast preference (toggle from preferences screen, coming soon).
 * UserProvider: role (caregiver/patient) for bottom bar and role-based UI; default caregiver.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ThemePreferenceProvider>
        <UserProvider initialRole="caregiver">
          <TaskProvider>
            <NotificationProvider>
              <NoteProvider>
                <HealthLogProvider>
                  {children}
                </HealthLogProvider>
              </NoteProvider>
            </NotificationProvider>
          </TaskProvider>
        </UserProvider>
      </ThemePreferenceProvider>
    </ThemeProvider>
  );
}
