// =============================================================================
// USER PROVIDER
// =============================================================================
// Holds current user role for bottom bar and role-based UI.
// Set to caregiver by default; wire to auth later (sign-in, role selection).
// =============================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "caregiver" | "patient";

interface UserContextType {
  userRole: UserRole;
  isPatient: boolean;
  setUserRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
  /** Initial role. Default "caregiver". */
  initialRole?: UserRole;
}

export function UserProvider({
  children,
  initialRole = "caregiver",
}: UserProviderProps) {
  const [userRole, setUserRoleState] = useState<UserRole>(initialRole);
  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
  }, []);

  const value: UserContextType = {
    userRole,
    isPatient: userRole === "patient",
    setUserRole,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
