'use client';

import { Card, Metric, Text, Flex, Badge, ProgressBar } from '@tremor/react';
import { FaRunning, FaClock, FaFire, FaHeart, FaTrophy, FaCalendarCheck } from 'react-icons/fa';
import { TrainingSession } from '@/types/training';
import { formatDuration } from '@/utils/dateUtils';

interface RunnerStatsProps {
  sessions: TrainingSession[];
  timeframe?: 'week' | 'month' | 'year';
  loading?: boolean;
}

interface StatsData {
  totalDistance: number;
  totalDuration: number;
  completedSessions: number;
  totalSessions: number;
  avgPace: string;
  avgHeartRate: number;
  weeklyGoal: number;
  currentWeekDistance: number;
}

export default function RunnerStats({ 
  sessions, 
  timeframe = 'week',
  loading = false 
}: RunnerStatsProps) {
  const calculateStats = (): StatsData => {
    const now = new Date();
    let filteredSessions = sessions;

    // Filter sessions based on timeframe
    if (timeframe === 'week') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      filteredSessions = sessions.filter(session => 
        new Date(session.date) >= weekStart
      );
    } else if (timeframe === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredSessions = sessions.filter(session => 
        new Date(session.date) >= monthStart
      );
    } else if (timeframe === 'year') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      filteredSessions = sessions.filter(session => 
        new Date(session.date) >= yearStart
      );
    }

    const completedSessions = filteredSessions.filter(s => s.status === 'completed');
    const totalDistance = completedSessions.reduce((sum, session) => 
      sum + (session.workoutLog?.actualDistance || session.distance || 0), 0
    );
    const totalDuration = completedSessions.reduce((sum, session) => 
      sum + (session.workoutLog?.actualDuration || session.duration || 0), 0
    );

    // Calculate average pace
    const paces = completedSessions
      .map(s => s.workoutLog?.avgPace)
      .filter(pace => pace && pace.includes(':'))
      .map(pace => {
        const [minutes, seconds] = pace!.split(':').map(Number);
        return minutes + seconds / 60;
      });
    
    const avgPaceMinutes = paces.length > 0 
      ? paces.reduce((sum, pace) => sum + pace, 0) / paces.length
      : 0;
    
    const avgPace = avgPaceMinutes > 0 
      ? `${Math.floor(avgPaceMinutes)}:${Math.round((avgPaceMinutes % 1) * 60).toString().padStart(2, '0')}`
      : '--:--';

    // Calculate average heart rate
    const heartRates = completedSessions
      .map(s => s.workoutLog?.avgHeartRate)
      .filter(hr => hr && hr > 0) as number[];
    
    const avgHeartRate = heartRates.length > 0
      ? Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length)
      : 0;

    // Weekly goal calculation (for current week)
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    
    const currentWeekSessions = sessions.filter(session => 
      new Date(session.date) >= currentWeekStart
    );
    
    const currentWeekDistance = currentWeekSessions
      .filter(s => s.status === 'completed')
      .reduce((sum, session) => 
        sum + (session.workoutLog?.actualDistance || session.distance || 0), 0
      );
    
    const weeklyGoal = currentWeekSessions
      .reduce((sum, session) => sum + (session.distance || 0), 0);

    return {
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalDuration,
      completedSessions: completedSessions.length,
      totalSessions: filteredSessions.length,
      avgPace,
      avgHeartRate,
      weeklyGoal: Math.round(weeklyGoal * 10) / 10,
      currentWeekDistance: Math.round(currentWeekDistance * 10) / 10
    };
  };

  const stats = calculateStats();
  const completionRate = stats.totalSessions > 0 
    ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
    : 0;
  
  const weeklyProgress = stats.weeklyGoal > 0 
    ? Math.round((stats.currentWeekDistance / stats.weeklyGoal) * 100)
    : 0;

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'week': return 'สัปดาห์นี้';
      case 'month': return 'เดือนนี้';
      case 'year': return 'ปีนี้';
      default: return 'สัปดาห์นี้';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Distance */}
        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaRunning className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">ระยะทางรวม</Text>
              <Metric className="text-2xl font-bold text-blue-600">
                {stats.totalDistance}
              </Metric>
              <Text className="text-xs text-gray-500">กิโลเมตร ({getTimeframeLabel()})</Text>
            </div>
          </Flex>
        </Card>

        {/* Total Duration */}
        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaClock className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">เวลารวม</Text>
              <Metric className="text-2xl font-bold text-green-600">
                {formatDuration(stats.totalDuration)}
              </Metric>
              <Text className="text-xs text-gray-500">({getTimeframeLabel()})</Text>
            </div>
          </Flex>
        </Card>

        {/* Average Pace */}
        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaFire className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">เพซเฉลี่ย</Text>
              <Metric className="text-2xl font-bold text-orange-600">
                {stats.avgPace}
              </Metric>
              <Text className="text-xs text-gray-500">นาที/กม. ({getTimeframeLabel()})</Text>
            </div>
          </Flex>
        </Card>

        {/* Average Heart Rate */}
        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaHeart className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">อัตราการเต้นเฉลี่ย</Text>
              <Metric className="text-2xl font-bold text-red-600">
                {stats.avgHeartRate || '--'}
              </Metric>
              <Text className="text-xs text-gray-500">bpm ({getTimeframeLabel()})</Text>
            </div>
          </Flex>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Session Completion Rate */}
        <Card className="p-4">
          <Flex alignItems="start" className="space-x-2 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaCalendarCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <Text className="text-sm text-gray-600">อัตราการทำเซสชันสำเร็จ</Text>
              <Metric className="text-xl font-bold text-purple-600">
                {completionRate}%
              </Metric>
              <Text className="text-xs text-gray-500">
                {stats.completedSessions}/{stats.totalSessions} เซสชัน ({getTimeframeLabel()})
              </Text>
            </div>
          </Flex>
          <ProgressBar 
            value={completionRate} 
            color={completionRate >= 80 ? 'emerald' : completionRate >= 60 ? 'yellow' : 'red'}
            className="mt-2"
          />
        </Card>

        {/* Weekly Goal Progress */}
        {timeframe === 'week' && (
          <Card className="p-4">
            <Flex alignItems="start" className="space-x-2 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FaTrophy className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <Text className="text-sm text-gray-600">เป้าหมายสัปดาห์นี้</Text>
                <Metric className="text-xl font-bold text-emerald-600">
                  {weeklyProgress}%
                </Metric>
                <Text className="text-xs text-gray-500">
                  {stats.currentWeekDistance}/{stats.weeklyGoal} กม.
                </Text>
              </div>
            </Flex>
            <ProgressBar 
              value={Math.min(weeklyProgress, 100)} 
              color={weeklyProgress >= 100 ? 'emerald' : weeklyProgress >= 75 ? 'blue' : 'orange'}
              className="mt-2"
            />
            {weeklyProgress >= 100 && (
              <div className="mt-2">
                <Badge color="emerald" size="sm">
                  🎉 เป้าหมายสำเร็จแล้ว!
                </Badge>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Quick Insights */}
      {stats.completedSessions > 0 && (
        <Card className="p-4">
          <Text className="font-semibold mb-3">สรุปผลงาน{getTimeframeLabel()}</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded">
              <Text className="text-blue-600 font-medium">ระยะทางเฉลี่ยต่อเซสชัน</Text>
              <Text className="text-lg font-bold text-blue-700">
                {stats.completedSessions > 0 
                  ? Math.round((stats.totalDistance / stats.completedSessions) * 10) / 10
                  : 0
                } กม.
              </Text>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <Text className="text-green-600 font-medium">เวลาเฉลี่ยต่อเซสชัน</Text>
              <Text className="text-lg font-bold text-green-700">
                {stats.completedSessions > 0 
                  ? formatDuration(Math.round(stats.totalDuration / stats.completedSessions))
                  : '--:--'
                }
              </Text>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <Text className="text-purple-600 font-medium">ความสม่ำเสมอ</Text>
              <Text className="text-lg font-bold text-purple-700">
                {completionRate >= 90 ? 'ยอดเยี่ยม' :
                 completionRate >= 75 ? 'ดีมาก' :
                 completionRate >= 60 ? 'ดี' :
                 completionRate >= 40 ? 'ปานกลาง' : 'ต้องปรับปรุง'
                }
              </Text>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}