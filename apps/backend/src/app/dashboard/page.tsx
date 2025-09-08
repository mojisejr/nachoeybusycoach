"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                NachoeyBusyCoach Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {session?.user?.image && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || "User"}
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session?.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ยินดีต้อนรับ, {session?.user?.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                คุณได้เข้าสู่ระบบ NachoeyBusyCoach เรียบร้อยแล้ว
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">ข้อมูลผู้ใช้</h3>
                <div className="space-y-2 text-left">
                  <p><strong>ชื่อ:</strong> {session?.user?.name}</p>
                  <p><strong>อีเมล:</strong> {session?.user?.email}</p>
                  <p><strong>บทบาท:</strong> {(session?.user as any)?.role || "runner"}</p>
                  <p><strong>ID:</strong> {(session?.user as any)?.id || "ยังไม่ได้กำหนด"}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  หน้านี้ใช้สำหรับทดสอบการทำงานของระบบ Authentication
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}