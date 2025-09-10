'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  // Always provide SessionProvider context to prevent useSession hook errors
  // Remove conditional rendering that breaks context availability
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      // Use basePath to proxy authentication to backend
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;