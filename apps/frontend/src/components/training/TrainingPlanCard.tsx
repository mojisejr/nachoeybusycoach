'use client';

import { Card, Title, Text, Badge, Button } from '@tremor/react';
import { FaRunning, FaClock, FaRoute, FaHeart } from 'react-icons/fa';
import { TrainingSession } from '@/types/training';
import { formatDate, formatDuration } from '@/utils/dateUtils';

interface TrainingPlanCardProps {
  session: TrainingSession;
  onViewDetails?: (sessionId: string) => void;
  onMarkComplete?: (sessionId: string) => void;
  isRunner?: boolean;
}

export default function TrainingPlanCard({ 
  session, 
  onViewDetails, 
  onMarkComplete, 
  isRunner = false 
}: TrainingPlanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'in_progress':
        return 'yellow';
      case 'pending':
        return 'blue';
      case 'skipped':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'เสร็จสิ้น';
      case 'in_progress':
        return 'กำลังดำเนินการ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'skipped':
        return 'ข้าม';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity?.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'moderate':
        return 'yellow';
      case 'hard':
        return 'orange';
      case 'very_hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getIntensityText = (intensity: string) => {
    switch (intensity?.toLowerCase()) {
      case 'easy':
        return 'ง่าย';
      case 'moderate':
        return 'ปานกลาง';
      case 'hard':
        return 'หนัก';
      case 'very_hard':
        return 'หนักมาก';
      default:
        return 'ไม่ระบุ';
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Title className="text-lg font-semibold text-gray-900">
            {session.type || 'การฝึกซ้อม'}
          </Title>
          <Text className="text-sm text-gray-600 mt-1">
            {formatDate(session.date)}
          </Text>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge color={getStatusColor(session.status)} size="sm">
            {getStatusText(session.status)}
          </Badge>
          {session.intensity && (
            <Badge color={getIntensityColor(session.intensity)} size="sm">
              {getIntensityText(session.intensity)}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {session.distance && (
          <div className="flex items-center gap-2">
            <FaRoute className="text-blue-500" />
            <div>
              <Text className="text-xs text-gray-500">ระยะทาง</Text>
              <Text className="font-medium">{session.distance} กม.</Text>
            </div>
          </div>
        )}
        
        {session.duration && (
          <div className="flex items-center gap-2">
            <FaClock className="text-green-500" />
            <div>
              <Text className="text-xs text-gray-500">เวลา</Text>
              <Text className="font-medium">{formatDuration(session.duration)}</Text>
            </div>
          </div>
        )}
        
        {session.workoutLog?.avgPace && (
          <div className="flex items-center gap-2">
            <FaRunning className="text-orange-500" />
            <div>
              <Text className="text-xs text-gray-500">เพซเฉลี่ย</Text>
              <Text className="font-medium">{session.workoutLog.avgPace}</Text>
            </div>
          </div>
        )}
        
        {session.workoutLog?.avgHeartRate && (
          <div className="flex items-center gap-2">
            <FaHeart className="text-red-500" />
            <div>
              <Text className="text-xs text-gray-500">อัตราการเต้นหัวใจเฉลี่ย</Text>
              <Text className="font-medium">{session.workoutLog.avgHeartRate} bpm</Text>
            </div>
          </div>
        )}
      </div>

      {session.notes && (
        <div className="mb-4">
          <Text className="text-xs text-gray-500 mb-1">หมายเหตุ</Text>
          <Text className="text-sm bg-gray-50 p-2 rounded">{session.notes}</Text>
        </div>
      )}

      <div className="flex gap-2 justify-end">
        {onViewDetails && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewDetails(session._id)}
          >
            ดูรายละเอียด
          </Button>
        )}
        
        {isRunner && session.status === 'scheduled' && onMarkComplete && (
          <Button
            size="sm"
            onClick={() => onMarkComplete(session._id)}
          >
            ทำเสร็จแล้ว
          </Button>
        )}
      </div>
    </Card>
  );
}