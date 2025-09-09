'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'runner' | 'coach';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(fallbackPath);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard if role doesn't match
      const userRole = user?.role || 'runner';
      router.push(`/dashboard/${userRole}`);
      return;
    }
  }, [isAuthenticated, isLoading, user?.role, requiredRole, router, fallbackPath]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">กำลังตรวจสอบการเข้าสู่ระบบ...</span>
      </div>
    );
  }

  // Don't render children if not authenticated or wrong role
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;