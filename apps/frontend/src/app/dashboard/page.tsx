'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (session?.user) {
      // Update user in store if needed
      if (!user || user.id !== session.user.id) {
        setUser({
          id: session.user.id,
          name: session.user.name || '',
          email: session.user.email || '',
          role: session.user.role as 'runner' | 'coach',
          avatar: session.user.image || undefined,
          createdAt: session.user.createdAt || new Date().toISOString(),
          updatedAt: session.user.updatedAt || new Date().toISOString(),
        });
      }

      // Redirect based on user role
      const userRole = session.user.role || user?.role;
      if (userRole === 'coach') {
        router.push('/dashboard/coach');
      } else if (userRole === 'runner') {
        router.push('/dashboard/runner');
      } else {
        // Default to runner if role is not set
        router.push('/dashboard/runner');
      }
    }

    setLoading(false);
  }, [session, status, user, setUser, setLoading, router]);

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <h2 className="text-xl font-semibold text-base-content mb-2">
          กำลังโหลด...
        </h2>
        <p className="text-base-content/70">
          กำลังตรวจสอบข้อมูลผู้ใช้และเปลี่ยนเส้นทาง
        </p>
      </div>
    </div>
  );
}