'use client';

import { useState } from 'react';
import { Card, Title, Text, Flex, Badge, Button, Select, SelectItem, Grid, Metric } from '@tremor/react';
import { FaUsers, FaCalendarCheck, FaExclamationTriangle, FaClock, FaRunning, FaEye, FaPlus } from 'react-icons/fa';
import { TrainingSession } from '@/types/training';
import { formatDate, isToday, isPast } from '@/utils/dateUtils';

interface Runner {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  totalSessions: number;
  completedSessions: number;
  weeklyDistance: number;
  lastActivity?: string;
  status: 'active' | 'inactive' | 'new';
}

interface CoachDashboardProps {
  runners: Runner[];
  sessions: TrainingSession[];
  loading?: boolean;
  onViewRunner?: (runnerId: string) => void;
  onCreatePlan?: (runnerId: string) => void;
}

interface DashboardStats {
  totalRunners: number;
  activeRunners: number;
  todaySessions: number;
  completedToday: number;
  pendingReviews: number;
  overdueSessions: number;
}

export default function CoachDashboard({
  runners,
  sessions,
  loading = false,
  onViewRunner,
  onCreatePlan
}: CoachDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const calculateStats = (): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });

    const completedToday = todaySessions.filter(s => s.status === 'completed').length;
    
    const pendingReviews = sessions.filter(s => 
      s.status === 'completed' && 
      s.workoutLog && 
      !s.workoutLog.coachFeedback
    ).length;

    const overdueSessions = sessions.filter(s => 
      s.status === 'scheduled' && 
      isPast(s.date) && 
      !isToday(s.date)
    ).length;

    const activeRunners = runners.filter(r => r.status === 'active').length;

    return {
      totalRunners: runners.length,
      activeRunners,
      todaySessions: todaySessions.length,
      completedToday,
      pendingReviews,
      overdueSessions
    };
  };

  const getFilteredRunners = () => {
    let filtered = runners;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(runner => runner.status === selectedStatus);
    }

    return filtered.sort((a, b) => {
      // Sort by status priority: new > active > inactive
      const statusPriority = { new: 3, active: 2, inactive: 1 };
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[b.status] - statusPriority[a.status];
      }
      // Then by completion rate
      const aRate = a.totalSessions > 0 ? a.completedSessions / a.totalSessions : 0;
      const bRate = b.totalSessions > 0 ? b.completedSessions / b.totalSessions : 0;
      return bRate - aRate;
    });
  };

  // Create a mapping from planId to runnerId for demo purposes
  const planToRunnerMap: Record<string, string> = {
    'plan-1': '1',
    'plan-2': '2',
    'plan-3': '3'
  };

  const getRunnerSessions = (runnerId: string) => {
    return sessions.filter(session => planToRunnerMap[session.planId] === runnerId);
  };

  const getRunnerTodaySessions = (runnerId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return planToRunnerMap[session.planId] === runnerId && sessionDate.getTime() === today.getTime();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'emerald';
      case 'new': return 'blue';
      case 'inactive': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'ใช้งานอยู่';
      case 'new': return 'ใหม่';
      case 'inactive': return 'ไม่ใช้งาน';
      default: return status;
    }
  };

  const stats = calculateStats();
  const filteredRunners = getFilteredRunners();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">นักวิ่งทั้งหมด</Text>
              <Metric className="text-2xl font-bold text-blue-600">
                {stats.totalRunners}
              </Metric>
              <Text className="text-xs text-gray-500">
                ใช้งานอยู่ {stats.activeRunners} คน
              </Text>
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCalendarCheck className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">เซสชันวันนี้</Text>
              <Metric className="text-2xl font-bold text-green-600">
                {stats.completedToday}/{stats.todaySessions}
              </Metric>
              <Text className="text-xs text-gray-500">เซสชันที่เสร็จแล้ว</Text>
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaClock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">รอตรวจสอบ</Text>
              <Metric className="text-2xl font-bold text-orange-600">
                {stats.pendingReviews}
              </Metric>
              <Text className="text-xs text-gray-500">เซสชันที่ส่งมาแล้ว</Text>
            </div>
          </Flex>
        </Card>

        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">เซสชันค้างคาว</Text>
              <Metric className="text-2xl font-bold text-red-600">
                {stats.overdueSessions}
              </Metric>
              <Text className="text-xs text-gray-500">เลยกำหนดแล้ว</Text>
            </div>
          </Flex>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <Flex className="space-x-4">
          <div className="flex-1">
            <Text className="text-sm font-medium mb-2">สถานะนักวิ่ง</Text>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="active">ใช้งานอยู่</SelectItem>
              <SelectItem value="new">ใหม่</SelectItem>
              <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
            </Select>
          </div>
          <div className="flex-1">
            <Text className="text-sm font-medium mb-2">ช่วงเวลา</Text>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectItem value="week">สัปดาห์นี้</SelectItem>
              <SelectItem value="month">เดือนนี้</SelectItem>
              <SelectItem value="quarter">ไตรมาสนี้</SelectItem>
            </Select>
          </div>
        </Flex>
      </Card>

      {/* Runners List */}
      <Card>
        <div className="p-4 border-b">
          <Title>นักวิ่งของคุณ</Title>
          <Text className="text-gray-600">จัดการและติดตามความก้าวหน้าของนักวิ่ง</Text>
        </div>
        
        <div className="divide-y">
          {filteredRunners.length === 0 ? (
            <div className="p-8 text-center">
              <Text className="text-gray-500">ไม่พบนักวิ่งในเงื่อนไขที่เลือก</Text>
            </div>
          ) : (
            filteredRunners.map((runner) => {
              const runnerSessions = getRunnerSessions(runner._id);
              const todaySessions = getRunnerTodaySessions(runner._id);
              const completionRate = runner.totalSessions > 0 
                ? Math.round((runner.completedSessions / runner.totalSessions) * 100)
                : 0;
              
              const pendingReviews = runnerSessions.filter(s => 
                s.status === 'completed' && 
                s.workoutLog && 
                !s.workoutLog.coachFeedback
              ).length;

              return (
                <div key={runner._id} className="p-4 hover:bg-gray-50">
                  <Flex className="space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {runner.avatar ? (
                        <img 
                          src={runner.avatar} 
                          alt={runner.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Text className="text-blue-600 font-semibold text-lg">
                            {runner.name.charAt(0).toUpperCase()}
                          </Text>
                        </div>
                      )}
                    </div>

                    {/* Runner Info */}
                    <div className="flex-1 min-w-0">
                      <Flex alignItems="start" justifyContent="between">
                        <div>
                          <Flex alignItems="center" className="space-x-2 mb-1">
                            <Text className="font-semibold text-gray-900">{runner.name}</Text>
                            <Badge color={getStatusColor(runner.status)} size="sm">
                              {getStatusLabel(runner.status)}
                            </Badge>
                            {pendingReviews > 0 && (
                              <Badge color="orange" size="sm">
                                รอตรวจ {pendingReviews}
                              </Badge>
                            )}
                          </Flex>
                          <Text className="text-sm text-gray-600 mb-2">{runner.email}</Text>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <Text className="text-gray-500">อัตราสำเร็จ</Text>
                              <Text className="font-medium">
                                {completionRate}% ({runner.completedSessions}/{runner.totalSessions})
                              </Text>
                            </div>
                            <div>
                              <Text className="text-gray-500">ระยะทางสัปดาห์</Text>
                              <Text className="font-medium">{runner.weeklyDistance} กม.</Text>
                            </div>
                            <div>
                              <Text className="text-gray-500">วันนี้</Text>
                              <Text className="font-medium">
                                {todaySessions.filter(s => s.status === 'completed').length}/{todaySessions.length} เซสชัน
                              </Text>
                            </div>
                            <div>
                              <Text className="text-gray-500">กิจกรรมล่าสุด</Text>
                              <Text className="font-medium">
                                {runner.lastActivity ? formatDate(runner.lastActivity) : 'ไม่มีข้อมูล'}
                              </Text>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => onViewRunner?.(runner._id)}
                          >
                            <FaEye className="mr-1" />
                            ดู
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => onCreatePlan?.(runner._id)}
                          >
                            <FaPlus className="mr-1" />
                            แผน
                          </Button>
                        </div>
                      </Flex>
                    </div>
                  </Flex>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      {stats.pendingReviews > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <Flex alignItems="center" justifyContent="between">
            <div>
              <Text className="font-semibold text-orange-800">มีเซสชันรอตรวจสอบ</Text>
              <Text className="text-orange-600">
                มี {stats.pendingReviews} เซสชันที่นักวิ่งส่งมาแล้ว รอการตรวจสอบและให้คำแนะนำ
              </Text>
            </div>
            <Button color="orange">
              ตรวจสอบทั้งหมด
            </Button>
          </Flex>
        </Card>
      )}
    </div>
  );
}