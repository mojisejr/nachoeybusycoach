'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { FaRunning, FaUsers, FaCalendarAlt, FaChartLine, FaUser, FaSignOutAlt, FaPlus, FaEye, FaSpinner } from 'react-icons/fa';
import { Card, Title, Text, Metric, Badge, ProgressBar, BarChart } from '@tremor/react';

function CoachDashboardContent() {
  const { user, userProfile, userRole, profileLoading, roleLoading, logout } = useAuth();

  // Mock data - will be replaced with real API calls
  const stats = {
    totalRunners: 12,
    activeRunners: 10,
    completedSessions: 45,
    pendingReviews: 8
  };

  const runners = [
    {
      id: 1,
      name: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      weeklyProgress: 85,
      lastActivity: '2024-01-14',
      status: 'active',
      pendingReviews: 2
    },
    {
      id: 2,
      name: 'สมหญิง รักวิ่ง',
      email: 'somying@example.com',
      weeklyProgress: 60,
      lastActivity: '2024-01-13',
      status: 'active',
      pendingReviews: 1
    },
    {
      id: 3,
      name: 'วิชัย มาราธอน',
      email: 'wichai@example.com',
      weeklyProgress: 100,
      lastActivity: '2024-01-14',
      status: 'active',
      pendingReviews: 0
    }
  ];

  const weeklyData = [
    { name: 'จันทร์', 'เสร็จสิ้น': 8, 'รอดำเนินการ': 2 },
    { name: 'อังคาร', 'เสร็จสิ้น': 6, 'รอดำเนินการ': 4 },
    { name: 'พุธ', 'เสร็จสิ้น': 9, 'รอดำเนินการ': 1 },
    { name: 'พฤหัสบดี', 'เสร็จสิ้น': 7, 'รอดำเนินการ': 3 },
    { name: 'ศุกร์', 'เสร็จสิ้น': 8, 'รอดำเนินการ': 2 },
    { name: 'เสาร์', 'เสร็จสิ้น': 5, 'รอดำเนินการ': 5 },
    { name: 'อาทิตย์', 'เสร็จสิ้น': 4, 'รอดำเนินการ': 6 }
  ];

  const recentActivities = [
    {
      id: 1,
      runnerName: 'สมชาย ใจดี',
      activity: 'Long Run - 15 km',
      time: '2 ชั่วโมงที่แล้ว',
      status: 'pending_review',
      type: 'session_completed'
    },
    {
      id: 2,
      runnerName: 'สมหญิง รักวิ่ง',
      activity: 'Interval Training - 8 km',
      time: '4 ชั่วโมงที่แล้ว',
      status: 'reviewed',
      type: 'session_completed'
    },
    {
      id: 3,
      runnerName: 'วิชัย มาราธอน',
      activity: 'Recovery Run - 5 km',
      time: '6 ชั่วโมงที่แล้ว',
      status: 'pending_review',
      type: 'session_completed'
    }
  ];

  if (profileLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
              <p className="text-sm text-gray-600">ยินดีต้อนรับ, {userProfile?.name || user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CoachDashboard
          runners={runners}
          sessions={sessions}
          loading={loading}
          onViewRunner={handleViewRunner}
          onCreatePlan={handleCreatePlan}
        />
      </main>
    </div>
  );
}

export default function CoachDashboard() {
  return (
    <ProtectedRoute requiredRole="coach">
      <CoachDashboardContent />
    </ProtectedRoute>
  );
}