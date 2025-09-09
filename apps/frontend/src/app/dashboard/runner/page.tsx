'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { FaRunning, FaCalendarAlt, FaChartLine, FaUser, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { Card, Title, Text, Metric, Badge, ProgressBar } from '@tremor/react';

function RunnerDashboardContent() {
  const { user, userProfile, userRole, profileLoading, roleLoading, logout } = useAuth();

  // Mock data - will be replaced with real API calls
  const weeklyProgress = {
    completed: 4,
    total: 6,
    percentage: 67
  };

  const upcomingSessions = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Easy Run',
      distance: '5 km',
      time: '30 นาที',
      status: 'pending'
    },
    {
      id: 2,
      date: '2024-01-17',
      type: 'Interval Training',
      distance: '8 km',
      time: '45 นาที',
      status: 'pending'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      date: '2024-01-13',
      type: 'Long Run',
      distance: '12 km',
      time: '1:15:30',
      status: 'completed',
      feedback: 'ดีมาก! ความเร็วสม่ำเสมอ'
    },
    {
      id: 2,
      date: '2024-01-11',
      type: 'Tempo Run',
      distance: '6 km',
      time: '28:45',
      status: 'completed',
      feedback: 'พัฒนาการดี ครั้งหน้าลองเพิ่มความเร็ว'
    }
  ];

  // Show loading state while fetching profile data
  if (profileLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
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
                สวัสดี, {userProfile?.name || user?.name || 'นักวิ่ง'}
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
            แดชบอร์ดนักวิ่ง
          </h2>
          <p className="text-gray-600">
            ติดตามความก้าวหน้าและแผนการฝึกซ้อมของคุณ
          </p>
          {userProfile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-blue-600" />
                <Text className="font-semibold">ข้อมูลโปรไฟล์</Text>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 text-xl mr-3" />
              <div>
                <Text>การซ้อมสัปดาห์นี้</Text>
                <Metric>{weeklyProgress.completed}/{weeklyProgress.total}</Metric>
              </div>
            </div>
            <ProgressBar 
              value={weeklyProgress.percentage} 
              className="mt-3"
              color="blue"
            />
          </Card>

          <Card>
            <div className="flex items-center">
              <FaChartLine className="text-green-500 text-xl mr-3" />
              <div>
                <Text>ระยะทางรวมเดือนนี้</Text>
                <Metric>127 km</Metric>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <FaUser className="text-purple-500 text-xl mr-3" />
              <div>
                <Text>โค้ชของคุณ</Text>
                <Metric className="text-base">โค้ชนาเชย</Metric>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <Card>
            <Title>การซ้อมที่กำลังจะมาถึง</Title>
            <div className="mt-4 space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{session.type}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString('th-TH', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge color="yellow">รอดำเนินการ</Badge>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>📏 {session.distance}</span>
                    <span>⏱️ {session.time}</span>
                  </div>
                  <button className="mt-3 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                    ดูรายละเอียด
                  </button>
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
                      <h4 className="font-medium text-gray-900">{activity.type}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.date).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <Badge color="green">เสร็จสิ้น</Badge>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600 mb-2">
                    <span>📏 {activity.distance}</span>
                    <span>⏱️ {activity.time}</span>
                  </div>
                  {activity.feedback && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                      <p className="text-sm text-blue-800">
                        <strong>ความคิดเห็นจากโค้ช:</strong> {activity.feedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <Title>การดำเนินการด่วน</Title>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
              บันทึกการซ้อมใหม่
            </button>
            <button className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
              ดูแผนการซ้อม
            </button>
            <button className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors">
              ติดต่อโค้ช
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default function RunnerDashboard() {
  return (
    <ProtectedRoute requiredRole="runner">
      <RunnerDashboardContent />
    </ProtectedRoute>
  );
}