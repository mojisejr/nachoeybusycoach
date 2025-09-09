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

  // Show loading state while fetching profile data
  if (profileLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <Text>กำลังโหลดข้อมูลโปรไฟล์...</Text>
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
            <div className="flex items-center">
              <FaRunning className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                นาเชยไม่เคยมีโค้ชว่าง
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                สวัสดี, โค้ช{userProfile?.name || user?.name || 'นาเชย'}
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaSignOutAlt className="mr-1" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            แดชบอร์ดโค้ช
          </h2>
          <p className="text-gray-600">
            จัดการและติดตามความก้าวหน้าของนักวิ่งทั้งหมด
          </p>
          {userProfile && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-green-600" />
                <Text className="font-semibold">ข้อมูลโปรไฟล์โค้ช</Text>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Text className="text-gray-500">อีเมล:</Text>
                  <Text>{userProfile.email}</Text>
                </div>
                <div>
                  <Text className="text-gray-500">บทบาท:</Text>
                  <Text className="capitalize">{userRole?.role || 'ไม่ระบุ'}</Text>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <FaUsers className="text-blue-500 text-xl mr-3" />
              <div>
                <Text>นักวิ่งทั้งหมด</Text>
                <Metric>{stats.totalRunners}</Metric>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <FaUser className="text-green-500 text-xl mr-3" />
              <div>
                <Text>นักวิ่งที่ใช้งานอยู่</Text>
                <Metric>{stats.activeRunners}</Metric>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <FaChartLine className="text-purple-500 text-xl mr-3" />
              <div>
                <Text>เซสชันที่เสร็จสิ้น</Text>
                <Metric>{stats.completedSessions}</Metric>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <FaCalendarAlt className="text-orange-500 text-xl mr-3" />
              <div>
                <Text>รอการตรวจสอบ</Text>
                <Metric>{stats.pendingReviews}</Metric>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weekly Overview Chart */}
          <Card className="lg:col-span-2">
            <Title>ภาพรวมการซ้อมรายสัปดาห์</Title>
            <BarChart
              className="mt-6"
              data={weeklyData}
              index="name"
              categories={['เสร็จสิ้น', 'รอดำเนินการ']}
              colors={['green', 'yellow']}
              yAxisWidth={48}
            />
          </Card>

          {/* Quick Actions */}
          <Card>
            <Title>การดำเนินการด่วน</Title>
            <div className="mt-4 space-y-3">
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                <FaPlus className="mr-2" />
                เพิ่มนักวิ่งใหม่
              </button>
              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center">
                <FaCalendarAlt className="mr-2" />
                สร้างแผนการซ้อม
              </button>
              <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center">
                <FaEye className="mr-2" />
                ตรวจสอบการซ้อม
              </button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Runners List */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Title>นักวิ่งของคุณ</Title>
              <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                ดูทั้งหมด
              </button>
            </div>
            <div className="space-y-4">
              {runners.map((runner) => (
                <div key={runner.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{runner.name}</h4>
                      <p className="text-sm text-gray-600">{runner.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge color={runner.status === 'active' ? 'green' : 'gray'}>
                        {runner.status === 'active' ? 'ใช้งานอยู่' : 'ไม่ใช้งาน'}
                      </Badge>
                      {runner.pendingReviews > 0 && (
                        <Badge color="orange">
                          รอตรวจ {runner.pendingReviews}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>ความก้าวหน้าสัปดาห์นี้</span>
                      <span>{runner.weeklyProgress}%</span>
                    </div>
                    <ProgressBar 
                      value={runner.weeklyProgress} 
                      color={runner.weeklyProgress >= 80 ? 'green' : runner.weeklyProgress >= 60 ? 'yellow' : 'red'}
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>กิจกรรมล่าสุด: {new Date(runner.lastActivity).toLocaleDateString('th-TH')}</span>
                    <button className="text-blue-500 hover:text-blue-700 font-medium">
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card>
            <Title>กิจกรรมล่าสุด</Title>
            <div className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.runnerName}</h4>
                      <p className="text-sm text-gray-600">{activity.activity}</p>
                    </div>
                    <Badge color={activity.status === 'pending_review' ? 'yellow' : 'green'}>
                      {activity.status === 'pending_review' ? 'รอตรวจสอบ' : 'ตรวจสอบแล้ว'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{activity.time}</span>
                    {activity.status === 'pending_review' && (
                      <button className="text-blue-500 hover:text-blue-700 font-medium">
                        ตรวจสอบ
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
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