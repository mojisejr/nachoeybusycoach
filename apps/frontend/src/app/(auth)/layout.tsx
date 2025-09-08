'use client';

import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeStore } = useAuthStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10`}>
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-focus items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              นาเชยไม่เคยมีโค้ชว่าง
            </h1>
            <p className="text-xl opacity-90 mb-8">
              แพลตฟอร์มเชื่อมโยงนักวิ่งกับโค้ชส่วนตัว
            </p>
            <div className="space-y-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>สื่อสารกับโค้ชแบบเรียลไทม์</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>ติดตามแผนการฝึกซ้อม</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>บันทึกผลการฝึกซ้อม</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>วิเคราะห์ความก้าวหน้า</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-2xl font-bold text-primary mb-2">
                นาเชยไม่เคยมีโค้ชว่าง
              </h1>
              <p className="text-base-content/70">
                แพลตฟอร์มเชื่อมโยงนักวิ่งกับโค้ชส่วนตัว
              </p>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}