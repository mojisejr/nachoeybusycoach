'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider 
      session={session}
      // Disable automatic refetching on window focus to prevent hydration issues
      refetchOnWindowFocus={false}
      // Use the session from props to ensure server/client consistency
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;