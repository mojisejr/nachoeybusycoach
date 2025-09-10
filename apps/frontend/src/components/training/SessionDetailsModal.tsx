'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, Title, Text, Button, Badge, Textarea, Select, SelectItem } from '@tremor/react';
import { FaTimes, FaRunning, FaClock, FaHeart, FaLink, FaSave, FaEdit } from 'react-icons/fa';
import { TrainingSession, EffortLevel, FeelingLevel, FEELING_LABELS } from '@/types/training';
import { formatDate, formatDuration, isToday, isPast } from '@/utils/dateUtils';

interface SessionDetailsModalProps {
  session: TrainingSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (sessionId: string, data: WorkoutLogData) => Promise<void>;
  isRunner?: boolean;
  loading?: boolean;
}

interface WorkoutLogData {
  actualDistance?: number;
  actualDuration?: number;
  avgPace?: string;
  avgHeartRate?: number;
  maxHeartRate?: number;
  effort: EffortLevel;
  feeling: FeelingLevel;
  notes?: string;
  externalLinks?: { platform: string; url: string }[];
}

const EFFORT_LABELS: Record<EffortLevel, string> = {
  1: '1 - Very Easy',
  2: '2 - Easy',
  3: '3 - Light',
  4: '4 - Moderate',
  5: '5 - Somewhat Hard',
  6: '6 - Hard',
  7: '7 - Very Hard',
  8: '8 - Extremely Hard',
  9: '9 - Maximum',
  10: '10 - Absolute Maximum'
};

export default function SessionDetailsModal({
  session,
  isOpen,
  onClose,
  onSave,
  isRunner = false,
  loading = false
}: SessionDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<WorkoutLogData>({
    effort: 5,
    feeling: 'okay'
  });
  const [saving, setSaving] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkPlatform, setNewLinkPlatform] = useState('strava');

  if (!session) return null;

  const canEdit = isRunner && (session.status === 'scheduled' || session.status === 'completed') && 
                  (isToday(session.date) || isPast(session.date));
  const hasWorkoutLog = !!session.workoutLog;

  // Initialize form data when editing starts
  const startEditing = () => {
    if (session.workoutLog) {
      setFormData({
        actualDistance: session.workoutLog.actualDistance,
        actualDuration: session.workoutLog.actualDuration,
        avgPace: session.workoutLog.avgPace,
        avgHeartRate: session.workoutLog.avgHeartRate,
        maxHeartRate: session.workoutLog.maxHeartRate,
        effort: session.workoutLog.effort,
        feeling: session.workoutLog.feeling,
        notes: session.workoutLog.notes,
        externalLinks: session.workoutLog.externalLinks || []
      });
    } else {
      setFormData({
        actualDistance: session.distance,
        actualDuration: session.duration,
        effort: 5,
        feeling: 'okay',
        externalLinks: []
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setSaving(true);
    try {
      await onSave(session._id, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving workout log:', error);
    } finally {
      setSaving(false);
    }
  };

  const addExternalLink = () => {
    if (!newLinkUrl.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      externalLinks: [
        ...(prev.externalLinks || []),
        { platform: newLinkPlatform, url: newLinkUrl }
      ]
    }));
    setNewLinkUrl('');
  };

  const removeExternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      externalLinks: prev.externalLinks?.filter((_, i) => i !== index) || []
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'emerald';
      case 'scheduled': return 'blue';
      case 'dnf': return 'yellow';
      case 'skipped': return 'gray';
      case 'missed': return 'red';
      default: return 'gray';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'very_easy': return 'green';
      case 'easy': return 'blue';
      case 'moderate': return 'yellow';
      case 'hard': return 'orange';
      case 'very_hard': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} static={true}>
      <DialogPanel className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title className="text-xl">{session.title}</Title>
            <Text className="text-gray-600">{formatDate(session.date)}</Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge color={getStatusColor(session.status)} size="sm">
              {session.status.toUpperCase()}
            </Badge>
            <Button variant="light" onClick={onClose}>
              <FaTimes />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Details */}
          <div className="space-y-4">
            <div>
              <Text className="font-semibold mb-2">รายละเอียดเซสชัน</Text>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text className="text-gray-600">ประเภท:</Text>
                  <Text>{session.type.replace('_', ' ').toUpperCase()}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">ความเข้มข้น:</Text>
                  <Badge color={getIntensityColor(session.intensity)} size="sm">
                    {session.intensity.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {session.distance && (
                  <div className="flex justify-between">
                    <Text className="text-gray-600">ระยะทางที่วางแผน:</Text>
                    <Text>{session.distance} กม.</Text>
                  </div>
                )}
                {session.duration && (
                  <div className="flex justify-between">
                    <Text className="text-gray-600">เวลาที่วางแผน:</Text>
                    <Text>{formatDuration(session.duration)}</Text>
                  </div>
                )}
              </div>
            </div>

            {session.description && (
              <div>
                <Text className="font-semibold mb-2">คำอธิบาย</Text>
                <Text className="text-gray-700 bg-gray-50 p-3 rounded">
                  {session.description}
                </Text>
              </div>
            )}

            {session.notes && (
              <div>
                <Text className="font-semibold mb-2">หมายเหตุจากโค้ช</Text>
                <Text className="text-gray-700 bg-blue-50 p-3 rounded">
                  {session.notes}
                </Text>
              </div>
            )}
          </div>

          {/* Workout Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text className="font-semibold">บันทึกการฝึกซ้อม</Text>
              {canEdit && !isEditing && (
                <Button size="sm" onClick={startEditing}>
                  <FaEdit className="mr-2" />
                  {hasWorkoutLog ? 'แก้ไข' : 'บันทึก'}
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium mb-1">ระยะทางจริง (กม.)</Text>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.actualDistance || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        actualDistance: parseFloat(e.target.value) || undefined 
                      }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium mb-1">เวลาจริง (นาที)</Text>
                    <input
                      type="number"
                      value={formData.actualDuration || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        actualDuration: parseInt(e.target.value) || undefined 
                      }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium mb-1">เพซเฉลี่ย (นาที:วินาที/กม.)</Text>
                    <input
                      type="text"
                      placeholder="5:30"
                      value={formData.avgPace || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, avgPace: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <Text className="text-sm font-medium mb-1">อัตราการเต้นเฉลี่ย</Text>
                    <input
                      type="number"
                      value={formData.avgHeartRate || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        avgHeartRate: parseInt(e.target.value) || undefined 
                      }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-sm font-medium mb-1">ความหนัก (RPE)</Text>
                    <Select
                      value={formData.effort.toString()}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        effort: parseInt(value) as EffortLevel 
                      }))}
                    >
                      {Object.entries(EFFORT_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Text className="text-sm font-medium mb-1">ความรู้สึก</Text>
                    <Select
                      value={formData.feeling}
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        feeling: value as FeelingLevel 
                      }))}
                    >
                      {Object.entries(FEELING_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Text className="text-sm font-medium mb-1">หมายเหตุ</Text>
                  <Textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="บันทึกเพิ่มเติมเกี่ยวกับการฝึกซ้อม..."
                    rows={3}
                  />
                </div>

                <div>
                  <Text className="text-sm font-medium mb-2">ลิงก์ภายนอก</Text>
                  <div className="flex gap-2 mb-2">
                    <Select
                      value={newLinkPlatform}
                      onValueChange={setNewLinkPlatform}
                    >
                      <SelectItem value="strava">Strava</SelectItem>
                      <SelectItem value="garmin">Garmin</SelectItem>
                      <SelectItem value="polar">Polar</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </Select>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <Button size="sm" onClick={addExternalLink}>
                      <FaLink />
                    </Button>
                  </div>
                  {formData.externalLinks && formData.externalLinks.length > 0 && (
                    <div className="space-y-1">
                      {formData.externalLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <Badge size="sm">{link.platform}</Badge>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm truncate"
                            >
                              {link.url}
                            </a>
                          </div>
                          <Button 
                            size="sm" 
                            variant="light" 
                            onClick={() => removeExternalLink(index)}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} loading={saving}>
                    <FaSave className="mr-2" />
                    บันทึก
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    ยกเลิก
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {hasWorkoutLog ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {session.workoutLog!.actualDistance && (
                        <div className="flex items-center gap-2">
                          <FaRunning className="text-blue-500" />
                          <div>
                            <Text className="text-sm text-gray-600">ระยะทางจริง</Text>
                            <Text className="font-medium">{session.workoutLog!.actualDistance} กม.</Text>
                          </div>
                        </div>
                      )}
                      {session.workoutLog!.actualDuration && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-green-500" />
                          <div>
                            <Text className="text-sm text-gray-600">เวลาจริง</Text>
                            <Text className="font-medium">{formatDuration(session.workoutLog!.actualDuration)}</Text>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {session.workoutLog!.avgPace && (
                        <div>
                          <Text className="text-sm text-gray-600">เพซเฉลี่ย</Text>
                          <Text className="font-medium">{session.workoutLog!.avgPace} นาที/กม.</Text>
                        </div>
                      )}
                      {session.workoutLog!.avgHeartRate && (
                        <div className="flex items-center gap-2">
                          <FaHeart className="text-red-500" />
                          <div>
                            <Text className="text-sm text-gray-600">อัตราการเต้นเฉลี่ย</Text>
                            <Text className="font-medium">{session.workoutLog!.avgHeartRate} bpm</Text>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Text className="text-sm text-gray-600">ความหนัก (RPE)</Text>
                        <Badge color="blue" size="sm">
                          {EFFORT_LABELS[session.workoutLog!.effort]}
                        </Badge>
                      </div>
                      <div>
                        <Text className="text-sm text-gray-600">ความรู้สึก</Text>
                        <Text className="font-medium">
                          {FEELING_LABELS[session.workoutLog!.feeling]}
                        </Text>
                      </div>
                    </div>

                    {session.workoutLog!.notes && (
                      <div>
                        <Text className="text-sm text-gray-600 mb-1">หมายเหตุ</Text>
                        <Text className="bg-gray-50 p-3 rounded">{session.workoutLog!.notes}</Text>
                      </div>
                    )}

                    {session.workoutLog!.externalLinks && session.workoutLog!.externalLinks.length > 0 && (
                      <div>
                        <Text className="text-sm text-gray-600 mb-2">ลิงก์ภายนอก</Text>
                        <div className="space-y-1">
                          {session.workoutLog!.externalLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Badge size="sm">{link.platform}</Badge>
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                ดูกิจกรรม
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Text className="text-gray-500 mb-4">ยังไม่มีบันทึกการฝึกซ้อม</Text>
                    {canEdit && (
                      <Button onClick={startEditing}>
                        <FaEdit className="mr-2" />
                        เริ่มบันทึก
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Coach Feedback Section */}
        {session.workoutLog?.coachFeedback && (
          <div className="mt-6 pt-6 border-t">
            <Text className="font-semibold mb-2">ความคิดเห็นจากโค้ช</Text>
            <div className="bg-blue-50 p-4 rounded">
              <Text>{session.workoutLog.coachFeedback.message}</Text>
              {session.workoutLog.coachFeedback.rating && (
                <div className="mt-2">
                  <Text className="text-sm text-gray-600">คะแนน: </Text>
                  <Badge color="yellow" size="sm">
                    {session.workoutLog.coachFeedback.rating}/5 ⭐
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
}