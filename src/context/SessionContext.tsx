'use client';

import React, { createContext, useContext, ReactNode } from "react";
import { InsertSession } from "@/db/schema";
import { UserProfile } from "@/lib/auth/user";

interface SessionContextType {
  session: InsertSession | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  value: {
    session: InsertSession | null;
    user: UserProfile | null;
  };
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ value, children }) => {
  const isLoggedIn = !!value.session && !!value.user;

  return (
    <SessionContext.Provider value={{ session: value.session, user: value.user, isLoggedIn }}>
      {children}
    </SessionContext.Provider>
  );
}; 