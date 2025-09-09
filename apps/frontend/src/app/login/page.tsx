'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginButtons } from '@/components/auth/LoginButton';
import { FaRunning } from 'react-icons/fa';

export default function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard if already logged in
      const userRole = user.role || 'runner';
      router.push(`/dashboard/${userRole}`);
    }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-white p-4 rounded-full">
              <FaRunning className="text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            นาเชยไม่เคยมีโค้ชว่าง
          </h1>
          <p className="text-gray-600">
            แพลตฟอร์มเชื่อมโยงนักวิ่งกับโค้ชส่วนตัว
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              เข้าสู่ระบบ
            </h2>
            <p className="text-gray-600">
              เลือกวิธีการเข้าสู่ระบบที่คุณต้องการ
            </p>
          </div>

          {/* OAuth Login Buttons */}
          <LoginButtons className="mb-6" />

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>
              การเข้าสู่ระบบแสดงว่าคุณยอมรับ
              <br />
              <a href="#" className="text-primary hover:underline">
                เงื่อนไขการใช้งาน
              </a>
              {' และ '}
              <a href="#" className="text-primary hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              สำหรับนักวิ่งและโค้ช
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <div className="font-medium">นักวิ่ง</div>
                <div>ติดตามแผนการฝึกซ้อม</div>
                <div>บันทึกผลการซ้อม</div>
              </div>
              <div>
                <div className="font-medium">โค้ช</div>
                <div>จัดการแผนการฝึกซ้อม</div>
                <div>ติดตามความก้าวหน้า</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}