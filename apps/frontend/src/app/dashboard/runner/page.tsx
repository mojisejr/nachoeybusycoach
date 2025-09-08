'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores';

interface TrainingSession {
  id: string;
  date: string;
  type: string;
  distance?: number;
  duration?: string;
  intensity: 'easy' | 'moderate' | 'hard';
  status: 'pending' | 'completed' | 'dnf' | 'undone';
  notes?: string;
  coachFeedback?: string;
}

interface WeeklyPlan {
  weekOf: string;
  sessions: TrainingSession[];
}

export default function RunnerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user, setLoading } = useAuthStore();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (session?.user?.role === 'coach') {
      router.push('/dashboard/coach');
      return;
    }

    setLoading(false);
    loadWeeklyPlan();
  }, [session, status, setLoading, router]);

  const loadWeeklyPlan = async () => {
    try {
      setIsLoadingPlan(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/training/weekly-plan');
      // const data = await response.json();
      
      // Mock data for now
      const mockPlan: WeeklyPlan = {
        weekOf: '2024-01-08',
        sessions: [
          {
            id: '1',
            date: '2024-01-08',
            type: 'Easy Run',
            distance: 5,
            duration: '30-35 นาที',
            intensity: 'easy',
            status: 'completed',
            notes: 'รู้สึกดี วิ่งได้ตามแผน',
            coachFeedback: 'ดีมาก! รักษาจังหวะนี้ไว้'
          },
          {
            id: '2',
            date: '2024-01-09',
            type: 'Interval Training',
            distance: 8,
            duration: '45 นาที',
            intensity: 'hard',
            status: 'pending',
          },
          {
            id: '3',
            date: '2024-01-10',
            type: 'Recovery Run',
            distance: 3,
            duration: '20 นาที',
            intensity: 'easy',
            status: 'pending',
          },
          {
            id: '4',
            date: '2024-01-11',
            type: 'Tempo Run',
            distance: 6,
            duration: '35 นาที',
            intensity: 'moderate',
            status: 'pending',
          },
          {
            id: '5',
            date: '2024-01-12',
            type: 'Long Run',
            distance: 12,
            duration: '75-80 นาที',
            intensity: 'easy',
            status: 'pending',
          },
        ],
      };
      
      setWeeklyPlan(mockPlan);
    } catch (error) {
      console.error('Error loading weekly plan:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const getStatusBadge = (status: TrainingSession['status']) => {
    const badges = {
      pending: 'badge-warning',
      completed: 'badge-success',
      dnf: 'badge-error',
      undone: 'badge-ghost',
    };
    
    const labels = {
      pending: 'รอดำเนินการ',
      completed: 'เสร็จสิ้น',
      dnf: 'ไม่เสร็จ',
      undone: 'ไม่ได้ทำ',
    };
    
    return (
      <span className={`badge ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getIntensityColor = (intensity: TrainingSession['intensity']) => {
    const colors = {
      easy: 'text-success',
      moderate: 'text-warning',
      hard: 'text-error',
    };
    return colors[intensity];
  };

  if (status === 'loading' || isLoadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <h2 className="text-xl font-semibold text-base-content mb-2">
            กำลังโหลดแผนการฝึกซ้อม...
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
                สวัสดี, {user?.name || session?.user?.name}! 🏃‍♂️
              </h1>
              <p className="text-base-content/70 mt-1">
                แผนการฝึกซ้อมประจำสัปดาห์ของคุณ
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline btn-sm">
                ประวัติการฝึกซ้อม
              </button>
              <button className="btn btn-primary btn-sm">
                ติดต่อโค้ช
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Week Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-base-content">
              สัปดาห์ที่ {weeklyPlan?.weekOf}
            </h2>
            <div className="flex items-center space-x-2">
              <button className="btn btn-ghost btn-sm">
                ← สัปดาห์ก่อน
              </button>
              <button className="btn btn-ghost btn-sm">
                สัปดาห์หน้า →
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">เซสชันทั้งหมด</div>
              <div className="stat-value text-primary">
                {weeklyPlan?.sessions.length || 0}
              </div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">เสร็จสิ้นแล้ว</div>
              <div className="stat-value text-success">
                {weeklyPlan?.sessions.filter(s => s.status === 'completed').length || 0}
              </div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">ระยะทางรวม</div>
              <div className="stat-value text-info">
                {weeklyPlan?.sessions.reduce((total, session) => total + (session.distance || 0), 0) || 0} กม.
              </div>
            </div>
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-title">ความคืบหน้า</div>
              <div className="stat-value text-warning">
                {weeklyPlan ? Math.round((weeklyPlan.sessions.filter(s => s.status === 'completed').length / weeklyPlan.sessions.length) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Training Sessions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-base-content mb-4">
            แผนการฝึกซ้อม
          </h3>
          
          {weeklyPlan?.sessions.map((session) => (
            <div key={session.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-base-content">
                        {session.type}
                      </h4>
                      {getStatusBadge(session.status)}
                      <span className={`text-sm font-medium ${getIntensityColor(session.intensity)}`}>
                        {session.intensity === 'easy' ? 'ง่าย' : 
                         session.intensity === 'moderate' ? 'ปานกลาง' : 'หนัก'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-base-content/70 mb-3">
                      <span>📅 {new Date(session.date).toLocaleDateString('th-TH')}</span>
                      {session.distance && (
                        <span>📏 {session.distance} กม.</span>
                      )}
                      {session.duration && (
                        <span>⏱️ {session.duration}</span>
                      )}
                    </div>

                    {session.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-base-content/80">
                          <strong>บันทึก:</strong> {session.notes}
                        </p>
                      </div>
                    )}

                    {session.coachFeedback && (
                      <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <h4 className="font-bold">ความเห็นจากโค้ช</h4>
                          <div className="text-xs">{session.coachFeedback}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {session.status === 'pending' && (
                      <button className="btn btn-primary btn-sm">
                        บันทึกผล
                      </button>
                    )}
                    {session.status === 'completed' && (
                      <button className="btn btn-ghost btn-sm">
                        ดูรายละเอียด
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm">
                      แก้ไข
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">การดำเนินการด่วน</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn btn-outline">
                  📊 ดูสถิติการฝึกซ้อม
                </button>
                <button className="btn btn-outline">
                  💬 ส่งข้อความหาโค้ช
                </button>
                <button className="btn btn-outline">
                  📝 บันทึกความรู้สึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}