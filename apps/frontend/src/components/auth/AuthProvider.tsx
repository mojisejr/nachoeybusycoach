'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  // Context7 SessionProvider pattern - always provide context
  // Removed basePath to prevent proxy issues, following Context7 best practices
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;