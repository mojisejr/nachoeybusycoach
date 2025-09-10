'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During SSR and initial hydration, render a basic wrapper
  if (!hasMounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  // After hydration, render with SessionProvider
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      // Ensure consistent behavior during hydration
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;