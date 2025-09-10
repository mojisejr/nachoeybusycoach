'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authService, type UserProfile, type UserRole } from '@/services/api';

interface AuthUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileLoading: boolean;
  roleLoading: boolean;
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
  redirectToDashboard: () => void;
  refreshProfile: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  let session = null;
  let status = 'loading';
  
  try {
    const sessionData = useSession();
    session = sessionData.data;
    status = sessionData.status;
  } catch {
    // Fallback if useSession is called outside SessionProvider
    console.warn('useSession called outside SessionProvider, using fallback values');
    session = null;
    status = 'unauthenticated';
  }
  
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  const user = session?.user as AuthUser;
  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  // Fetch user profile
  const fetchProfile = async () => {
    if (!isAuthenticated || profileLoading) return;
    
    setProfileLoading(true);
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUserProfile(response.data);
      } else {
        console.error('Failed to fetch user profile:', response.error);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user role and permissions
  const fetchRole = async () => {
    if (!isAuthenticated || roleLoading) return;
    
    setRoleLoading(true);
    try {
      const response = await authService.getUserRole();
      if (response.success && response.data) {
        setUserRole(response.data);
      } else {
        console.error('Failed to fetch user role:', response.error);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setRoleLoading(false);
    }
  };

  // Fetch profile and role when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchProfile();
      fetchRole();
    } else if (!isAuthenticated) {
      setUserProfile(null);
      setUserRole(null);
    }
  }, [isAuthenticated, isLoading]);

  const login = async (provider?: string) => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear local state
      setUserProfile(null);
      setUserRole(null);
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const redirectToDashboard = () => {
    const role = userRole?.role || user?.role;
    if (role === 'coach') {
      router.push('/dashboard/coach');
    } else {
      router.push('/dashboard/runner');
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const refreshRole = async () => {
    await fetchRole();
  };

  return {
    user,
    userProfile,
    userRole,
    isLoading,
    isAuthenticated,
    profileLoading,
    roleLoading,
    login,
    logout,
    redirectToDashboard,
    refreshProfile,
    refreshRole,
  };
}