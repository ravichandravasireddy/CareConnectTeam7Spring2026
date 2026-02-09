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
  userName: string | null;
  userEmail: string | null;
  setUserRole: (role: UserRole) => void;
  setUserInfo: (name: string | null, email: string | null) => void;
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
  /** Initial user name. */
  initialUserName?: string | null;
  /** Initial user email. */
  initialUserEmail?: string | null;
}

export function UserProvider({
  children,
  initialRole = "caregiver",
  initialUserName = null,
  initialUserEmail = null,
}: UserProviderProps) {
  const [userRole, setUserRoleState] = useState<UserRole>(initialRole);
  const [userName, setUserNameState] = useState<string | null>(initialUserName);
  const [userEmail, setUserEmailState] = useState<string | null>(initialUserEmail);
  
  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
  }, []);

  const setUserInfo = useCallback((name: string | null, email: string | null) => {
    setUserNameState(name);
    setUserEmailState(email);
  }, []);

  const value: UserContextType = {
    userRole,
    isPatient: userRole === "patient",
    userName,
    userEmail,
    setUserRole,
    setUserInfo,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
