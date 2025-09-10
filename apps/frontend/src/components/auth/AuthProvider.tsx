'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by only rendering SessionProvider on client
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;