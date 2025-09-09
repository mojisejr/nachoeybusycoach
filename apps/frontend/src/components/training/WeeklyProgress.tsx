'use client';

import { Card, Title, Text, AreaChart, BarChart, DonutChart, Metric, Badge, Grid, Col } from '@tremor/react';
import { FaRunning, FaClock, FaHeart, FaTrophy, FaCalendarWeek } from 'react-icons/fa';
import { TrainingSession, WorkoutLog } from '@/types/training';
import { formatDuration, formatDateShort } from '@/utils/dateUtils';

interface WeeklyProgressProps {
  sessions: TrainingSession[];
  weekStart: string;
  weekEnd: string;
  loading?: boolean;
}

interface WeeklyStats {
  totalDistance: number;
  totalDuration: number;
  completedSessions: number;
  totalSessions: number;
  averagePace?: string;
  averageHeartRate?: number;
}

interface ChartData {
  date: string;
  distance: number;
  duration: number;
  pace?: number;
  heartRate?: number;
}

export default function WeeklyProgress({ 
  sessions, 
  weekStart, 
  weekEnd, 
  loading = false 
}: WeeklyProgressProps) {
  // Calculate weekly statistics
  const calculateWeeklyStats = (): WeeklyStats => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalDistance = completedSessions.reduce((sum, session) => {
      return sum + (session.workoutLog?.actualDistance || session.distance || 0);
    }, 0);
    
    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (session.workoutLog?.actualDuration || session.duration || 0);
    }, 0);

    const paces = completedSessions
      .map(s => s.workoutLog?.avgPace)
      .filter(pace => pace !== undefined) as string[];
    
    const heartRates = completedSessions
      .map(s => s.workoutLog?.avgHeartRate)
      .filter(hr => hr !== undefined) as number[];

    return {
      totalDistance,
      totalDuration,
      completedSessions: completedSessions.length,
      totalSessions: sessions.length,
      averagePace: paces.length > 0 ? paces[0] : undefined,
      averageHeartRate: heartRates.length > 0 ? heartRates.reduce((a, b) => a + b, 0) / heartRates.length : undefined
    };
  };

  // Prepare chart data
  const prepareChartData = (): ChartData[] => {
    const chartData: ChartData[] = [];
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = session.date.split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    }, {} as Record<string, TrainingSession[]>);

    // Generate data for each day in the week
    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const daySessions = sessionsByDate[dateStr] || [];
      const completedSessions = daySessions.filter(s => s.status === 'completed');
      
      const dayDistance = completedSessions.reduce((sum, session) => {
        return sum + (session.workoutLog?.actualDistance || session.distance || 0);
      }, 0);
      
      const dayDuration = completedSessions.reduce((sum, session) => {
        return sum + (session.workoutLog?.actualDuration || session.duration || 0);
      }, 0);

      const paces = completedSessions
        .map(s => s.workoutLog?.avgPace)
        .filter(pace => pace !== undefined) as string[];
      
      const heartRates = completedSessions
        .map(s => s.workoutLog?.avgHeartRate)
        .filter(hr => hr !== undefined) as number[];

      chartData.push({
        date: formatDateShort(dateStr),
        distance: dayDistance,
        duration: dayDuration / 60, // Convert to minutes
        pace: paces.length > 0 ? parseFloat(paces[0].replace(':', '.')) : undefined, // Convert "5:30" to 5.5
        heartRate: heartRates.length > 0 ? heartRates.reduce((a, b) => a + b, 0) / heartRates.length : undefined
      });
    }

    return chartData;
  };

  // Prepare completion rate data
  const prepareCompletionData = () => {
    const stats = calculateWeeklyStats();
    return [
      {
        name: 'เสร็จสิ้น',
        value: stats.completedSessions,
        color: 'emerald'
      },
      {
        name: 'ยังไม่เสร็จ',
        value: stats.totalSessions - stats.completedSessions,
        color: 'red'
      }
    ];
  };

  const stats = calculateWeeklyStats();
  const chartData = prepareChartData();
  const completionData = prepareCompletionData();
  const completionRate = stats.totalSessions > 0 ? (stats.completedSessions / stats.totalSessions) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <FaCalendarWeek className="text-blue-500" />
          <Title>สรุปผลการฝึกซ้อมประจำสัปดาห์</Title>
        </div>
        <Text className="text-gray-600">
          {formatDateShort(weekStart)} - {formatDateShort(weekEnd)}
        </Text>
      </Card>

      {/* Key Metrics */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaRunning className="text-blue-600 text-xl" />
            </div>
            <div>
              <Text className="text-sm text-gray-600">ระยะทางรวม</Text>
              <Metric className="text-2xl">{stats.totalDistance.toFixed(1)} กม.</Metric>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaClock className="text-green-600 text-xl" />
            </div>
            <div>
              <Text className="text-sm text-gray-600">เวลารวม</Text>
              <Metric className="text-2xl">{formatDuration(stats.totalDuration)}</Metric>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaHeart className="text-purple-600 text-xl" />
            </div>
            <div>
              <Text className="text-sm text-gray-600">อัตราการเต้นเฉลี่ย</Text>
              <Metric className="text-2xl">
                {stats.averageHeartRate ? `${Math.round(stats.averageHeartRate)} bpm` : 'N/A'}
              </Metric>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaTrophy className="text-yellow-600 text-xl" />
            </div>
            <div>
              <Text className="text-sm text-gray-600">อัตราความสำเร็จ</Text>
              <div className="flex items-center gap-2">
                <Metric className="text-2xl">{completionRate.toFixed(0)}%</Metric>
                <Badge 
                  color={completionRate >= 80 ? 'emerald' : completionRate >= 60 ? 'yellow' : 'red'}
                  size="sm"
                >
                  {stats.completedSessions}/{stats.totalSessions}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        {/* Daily Distance Chart */}
        <Card className="p-6">
          <Title className="mb-4">ระยะทางรายวัน</Title>
          <AreaChart
            className="h-72"
            data={chartData}
            index="date"
            categories={['distance']}
            colors={['blue']}
            valueFormatter={(value) => `${value.toFixed(1)} กม.`}
            yAxisWidth={60}
            showAnimation={true}
          />
        </Card>

        {/* Daily Duration Chart */}
        <Card className="p-6">
          <Title className="mb-4">เวลารายวัน</Title>
          <BarChart
            className="h-72"
            data={chartData}
            index="date"
            categories={['duration']}
            colors={['emerald']}
            valueFormatter={(value) => `${value.toFixed(0)} นาที`}
            yAxisWidth={60}
            showAnimation={true}
          />
        </Card>
      </Grid>

      {/* Completion Rate and Pace */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        {/* Completion Rate Donut */}
        <Card className="p-6">
          <Title className="mb-4">อัตราการเสร็จสิ้น</Title>
          <DonutChart
            className="h-60"
            data={completionData}
            category="value"
            index="name"
            colors={['emerald', 'red']}
            valueFormatter={(value) => `${value} เซสชัน`}
            showAnimation={true}
          />
          <div className="mt-4 text-center">
            <Text className="text-lg font-semibold">
              {completionRate.toFixed(1)}% เสร็จสิ้น
            </Text>
          </div>
        </Card>

        {/* Average Pace Chart */}
        <Card className="p-6">
          <Title className="mb-4">เพซเฉลี่ยรายวัน</Title>
          {chartData.some(d => d.pace !== undefined) ? (
            <AreaChart
              className="h-60"
              data={chartData.filter(d => d.pace !== undefined)}
              index="date"
              categories={['pace']}
              colors={['orange']}
              valueFormatter={(value) => `${value.toFixed(2)} นาที/กม.`}
              yAxisWidth={80}
              showAnimation={true}
            />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              <Text>ไม่มีข้อมูลเพซ</Text>
            </div>
          )}
        </Card>
      </Grid>
    </div>
  );
}