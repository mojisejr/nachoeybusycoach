'use client';

import { useState } from 'react';
import { Card, Title, Text, Badge, Button, Select, SelectItem } from '@tremor/react';
import { FaFilter, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { TrainingSession, SessionStatus, SessionType, IntensityLevel } from '@/types/training';
import { STATUS_LABELS, SESSION_TYPE_LABELS, INTENSITY_LABELS } from '@/types/training';
import TrainingPlanCard from './TrainingPlanCard';
import { formatDateShort, getWeekStart, getWeekEnd } from '@/utils/dateUtils';

interface TrainingPlanListProps {
  sessions: TrainingSession[];
  loading?: boolean;
  error?: string;
  onViewDetails?: (sessionId: string) => void;
  onMarkComplete?: (sessionId: string) => void;
  isRunner?: boolean;
  showFilters?: boolean;
}

interface Filters {
  status?: SessionStatus | 'all';
  type?: SessionType | 'all';
  intensity?: IntensityLevel | 'all';
  week?: string;
}

export default function TrainingPlanList({
  sessions,
  loading = false,
  error,
  onViewDetails,
  onMarkComplete,
  isRunner = false,
  showFilters = true
}: TrainingPlanListProps) {
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    type: 'all',
    intensity: 'all',
    week: 'current'
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Get current week dates
  const getCurrentWeek = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      start: getWeekStart(today),
      end: getWeekEnd(today)
    };
  };

  // Filter sessions based on current filters
  const filteredSessions = sessions.filter(session => {
    // Status filter
    if (filters.status !== 'all' && session.status !== filters.status) {
      return false;
    }

    // Type filter
    if (filters.type !== 'all' && session.type !== filters.type) {
      return false;
    }

    // Intensity filter
    if (filters.intensity !== 'all' && session.intensity !== filters.intensity) {
      return false;
    }

    // Week filter
    if (filters.week === 'current') {
      const currentWeek = getCurrentWeek();
      const sessionDate = session.date.split('T')[0];
      if (sessionDate < currentWeek.start || sessionDate > currentWeek.end) {
        return false;
      }
    }

    return true;
  });

  // Group sessions by date
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = session.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, TrainingSession[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedSessions).sort();

  const resetFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      intensity: 'all',
      week: 'current'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.intensity !== 'all') count++;
    if (filters.week !== 'current') count++;
    return count;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
        <Text className="ml-2">กำลังโหลดแผนการฝึกซ้อม...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Text className="text-red-600 mb-4">{error}</Text>
          <Button onClick={() => window.location.reload()}>ลองใหม่</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Title>แผนการฝึกซ้อม</Title>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="relative"
              >
                <FaFilter className="mr-2" />
                ตัวกรอง
                {getActiveFilterCount() > 0 && (
                  <Badge className="ml-2" color="blue" size="sm">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Text className="text-sm font-medium mb-2">สถานะ</Text>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as SessionStatus | 'all' }))}
                >
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Text className="text-sm font-medium mb-2">ประเภท</Text>
                <Select
                  value={filters.type}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as SessionType | 'all' }))}
                >
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {Object.entries(SESSION_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Text className="text-sm font-medium mb-2">ความเข้มข้น</Text>
                <Select
                  value={filters.intensity}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, intensity: value as IntensityLevel | 'all' }))}
                >
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  {Object.entries(INTENSITY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Text className="text-sm font-medium mb-2">สัปดาห์</Text>
                <Select
                  value={filters.week}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, week: value }))}
                >
                  <SelectItem value="current">สัปดาห์นี้</SelectItem>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                </Select>
              </div>

              <div className="md:col-span-4 flex justify-end">
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  ล้างตัวกรอง
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <Title className="text-gray-600 mb-2">ไม่พบแผนการฝึกซ้อม</Title>
            <Text className="text-gray-500">
              {sessions.length === 0 
                ? 'ยังไม่มีแผนการฝึกซ้อมในระบบ'
                : 'ไม่พบแผนการฝึกซ้อมที่ตรงกับเงื่อนไขที่เลือก'
              }
            </Text>
            {getActiveFilterCount() > 0 && (
              <Button className="mt-4" variant="secondary" onClick={resetFilters}>
                ล้างตัวกรอง
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <FaCalendarAlt className="text-blue-500" />
                <Title className="text-lg">{formatDateShort(date)}</Title>
                <Badge color="gray" size="sm">
                  {groupedSessions[date].length} เซสชัน
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSessions[date].map(session => (
                  <TrainingPlanCard
                    key={session._id}
                    session={session}
                    onViewDetails={onViewDetails}
                    onMarkComplete={onMarkComplete}
                    isRunner={isRunner}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}