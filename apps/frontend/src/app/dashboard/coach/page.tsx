'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';

interface Runner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  lastActivity: string;
  weeklyProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  status: 'active' | 'inactive' | 'injured';
}

interface RecentActivity {
  id: string;
  runnerId: string;
  runnerName: string;
  type: 'session_completed' | 'feedback_requested' | 'plan_updated';
  message: string;
  timestamp: string;
  needsAttention: boolean;
}

export default function CoachDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, setLoading } = useAuthStore();
  const [runners, setRunners] = useState<Runner[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (session?.user?.role === 'runner') {
      router.push('/dashboard/runner');
      return;
    }

    setLoading(false);
    loadDashboardData();
  }, [session, status, setLoading, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoadingData(true);
      // TODO: Replace with actual API calls
      // const [runnersResponse, activitiesResponse] = await Promise.all([
      //   fetch('/api/coach/runners'),
      //   fetch('/api/coach/recent-activities')
      // ]);
      
      // Mock data for now
      const mockRunners: Runner[] = [
        {
          id: '1',
          name: 'สมชาย วิ่งเก่ง',
          email: 'somchai@example.com',
          avatar: undefined,
          joinedAt: '2024-01-01',
          lastActivity: '2024-01-08',
          weeklyProgress: {
            completed: 4,
            total: 5,
            percentage: 80
          },
          status: 'active'
        },
        {
          id: '2',
          name: 'สมหญิง รันนิ่ง',
          email: 'somying@example.com',
          avatar: undefined,
          joinedAt: '2023-12-15',
          lastActivity: '2024-01-07',
          weeklyProgress: {
            completed: 3,
            total: 4,
            percentage: 75
          },
          status: 'active'
        },
        {
          id: '3',
          name: 'วิชัย มาราธอน',
          email: 'wichai@example.com',
          avatar: undefined,
          joinedAt: '2023-11-20',
          lastActivity: '2024-01-05',
          weeklyProgress: {
            completed: 2,
            total: 6,
            percentage: 33
          },
          status: 'injured'
        }
      ];

      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          runnerId: '1',
          runnerName: 'สมชาย วิ่งเก่ง',
          type: 'session_completed',
          message: 'เสร็จสิ้น Easy Run 5km ใน 30 นาที',
          timestamp: '2024-01-08T10:30:00Z',
          needsAttention: false
        },
        {
          id: '2',
          runnerId: '2',
          runnerName: 'สมหญิง รันนิ่ง',
          type: 'feedback_requested',
          message: 'ขอคำแนะนำเกี่ยวกับ Interval Training',
          timestamp: '2024-01-08T09:15:00Z',
          needsAttention: true
        },
        {
          id: '3',
          runnerId: '3',
          runnerName: 'วิชัย มาราธอน',
          type: 'plan_updated',
          message: 'อัปเดตสถานะเป็น "บาดเจ็บ" - ต้องปรับแผน',
          timestamp: '2024-01-07T16:45:00Z',
          needsAttention: true
        }
      ];
      
      setRunners(mockRunners);
      setRecentActivities(mockActivities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getStatusBadge = (status: Runner['status']) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-warning',
      injured: 'badge-error',
    };
    
    const labels = {
      active: 'ใช้งานอยู่',
      inactive: 'ไม่ใช้งาน',
      injured: 'บาดเจ็บ',
    };
    
    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      session_completed: '✅',
      feedback_requested: '💬',
      plan_updated: '📝',
    };
    return icons[type];
  };

  if (status === 'loading' || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h2 className="text-xl font-semibold text-base-content mb-2">
            กำลังโหลดข้อมูล...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                สวัสดี, โค้ช {user?.name || session?.user?.name}! 🏃‍♂️
              </h1>
              <p className="text-base-content/70 mt-1">
                ภาพรวมนักวิ่งและกิจกรรมล่าสุด
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline btn-sm">
                เพิ่มนักวิ่งใหม่
              </button>
              <button className="btn btn-primary btn-sm">
                สร้างแผนฝึกซ้อม
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">นักวิ่งทั้งหมด</div>
            <div className="stat-value text-primary">{runners.length}</div>
            <div className="stat-desc">
              {runners.filter(r => r.status === 'active').length} คนใช้งานอยู่
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">ต้องให้ความสนใจ</div>
            <div className="stat-value text-warning">
              {recentActivities.filter(a => a.needsAttention).length}
            </div>
            <div className="stat-desc">รายการที่รอการตอบกลับ</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">ความคืบหน้าเฉลี่ย</div>
            <div className="stat-value text-success">
              {Math.round(runners.reduce((acc, r) => acc + r.weeklyProgress.percentage, 0) / runners.length || 0)}%
            </div>
            <div className="stat-desc">สัปดาห์นี้</div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-title">นักวิ่งบาดเจ็บ</div>
            <div className="stat-value text-error">
              {runners.filter(r => r.status === 'injured').length}
            </div>
            <div className="stat-desc">ต้องปรับแผนการฝึกซ้อม</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Runners List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-base-content">
                นักวิ่งของคุณ
              </h2>
              <button className="btn btn-ghost btn-sm">
                ดูทั้งหมด →
              </button>
            </div>
            
            <div className="space-y-4">
              {runners.map((runner) => (
                <div key={runner.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                            <span className="text-lg">
                              {runner.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-base-content">
                            {runner.name}
                          </h3>
                          <p className="text-sm text-base-content/70">
                            {runner.email}
                          </p>
                          <p className="text-xs text-base-content/50">
                            เข้าร่วมเมื่อ {new Date(runner.joinedAt).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(runner.status)}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-base-content/70">
                          ความคืบหน้าสัปดาห์นี้
                        </span>
                        <span className="text-sm font-medium">
                          {runner.weeklyProgress.completed}/{runner.weeklyProgress.total}
                        </span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${runner.weeklyProgress.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs text-base-content/70">
                          {runner.weeklyProgress.percentage}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-ghost btn-sm">
                        ดูรายละเอียด
                      </button>
                      <button className="btn btn-primary btn-sm">
                        จัดการแผน
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-base-content">
                กิจกรรมล่าสุด
              </h2>
              <button className="btn btn-ghost btn-sm">
                ดูทั้งหมด →
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`card bg-base-100 shadow ${
                    activity.needsAttention ? 'border-l-4 border-warning' : ''
                  }`}
                >
                  <div className="card-body py-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">
                        {getActivityIcon(activity.type)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-base-content">
                            {activity.runnerName}
                          </h4>
                          <span className="text-xs text-base-content/50">
                            {new Date(activity.timestamp).toLocaleString('th-TH')}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/80">
                          {activity.message}
                        </p>
                        {activity.needsAttention && (
                          <div className="mt-2">
                            <button className="btn btn-warning btn-xs">
                              ตอบกลับ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">การดำเนินการด่วน</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="btn btn-outline">
                  📊 ดูรายงานสรุป
                </button>
                <button className="btn btn-outline">
                  📝 สร้างแผนใหม่
                </button>
                <button className="btn btn-outline">
                  👥 จัดการนักวิ่ง
                </button>
                <button className="btn btn-outline">
                  ⚙️ ตั้งค่า
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}