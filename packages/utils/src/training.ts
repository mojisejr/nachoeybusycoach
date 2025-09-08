/**
 * Training utility functions for NachoeyBusyCoach
 */

import type { SessionStatus, IntensityLevel, FeelingLevel } from '@nachoeybusycoach/types';

/**
 * Get session status display text in Thai
 */
export const getSessionStatusText = (status: SessionStatus): string => {
  const statusMap: Record<SessionStatus, string> = {
    pending: 'รอการฝึกซ้อม',
    completed: 'เสร็จสิ้น',
    dnf: 'ไม่เสร็จ (DNF)',
    undone: 'ไม่ได้ฝึกซ้อม',
    reviewed: 'ตรวจสอบแล้ว'
  };
  return statusMap[status];
};

/**
 * Get session status color class for UI
 */
export const getSessionStatusColor = (status: SessionStatus): string => {
  const colorMap: Record<SessionStatus, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    completed: 'text-green-600 bg-green-50',
    dnf: 'text-orange-600 bg-orange-50',
    undone: 'text-red-600 bg-red-50',
    reviewed: 'text-blue-600 bg-blue-50'
  };
  return colorMap[status];
};

/**
 * Get intensity level display text in Thai
 */
export const getIntensityText = (intensity: IntensityLevel): string => {
  const intensityMap: Record<IntensityLevel, string> = {
    easy: 'ง่าย',
    moderate: 'ปานกลาง',
    hard: 'หนัก',
    very_hard: 'หนักมาก'
  };
  return intensityMap[intensity];
};

/**
 * Get intensity level color class for UI
 */
export const getIntensityColor = (intensity: IntensityLevel): string => {
  const colorMap: Record<IntensityLevel, string> = {
    easy: 'text-green-600 bg-green-50',
    moderate: 'text-yellow-600 bg-yellow-50',
    hard: 'text-orange-600 bg-orange-50',
    very_hard: 'text-red-600 bg-red-50'
  };
  return colorMap[intensity];
};

/**
 * Get feeling level display text in Thai
 */
export const getFeelingText = (feeling: FeelingLevel): string => {
  const feelingMap: Record<FeelingLevel, string> = {
    very_bad: 'แย่มาก',
    bad: 'แย่',
    okay: 'ปกติ',
    good: 'ดี',
    very_good: 'ดีมาก'
  };
  return feelingMap[feeling];
};

/**
 * Get feeling level emoji
 */
export const getFeelingEmoji = (feeling: FeelingLevel): string => {
  const emojiMap: Record<FeelingLevel, string> = {
    very_bad: '😫',
    bad: '😞',
    okay: '😐',
    good: '😊',
    very_good: '😄'
  };
  return emojiMap[feeling];
};

/**
 * Format distance with appropriate unit
 */
export const formatDistance = (distance: number): string => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} กม.`;
  }
  return `${distance} ม.`;
};

/**
 * Format pace (minutes per kilometer)
 */
export const formatPace = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} /กม.`;
};

/**
 * Calculate pace from distance and time
 */
export const calculatePace = (distanceKm: number, timeMinutes: number): number => {
  if (distanceKm === 0) return 0;
  return timeMinutes / distanceKm;
};

/**
 * Format time in HH:MM:SS format
 */
export const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.round((totalMinutes % 1) * 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Validate Strava URL
 */
export const isValidStravaUrl = (url: string): boolean => {
  const stravaPattern = /^https:\/\/(www\.)?strava\.com\/activities\/\d+/;
  return stravaPattern.test(url);
};

/**
 * Validate Garmin URL
 */
export const isValidGarminUrl = (url: string): boolean => {
  const garminPattern = /^https:\/\/(connect\.)?garmin\.com\/modern\/activity\/\d+/;
  return garminPattern.test(url);
};

/**
 * Check if URL is a valid activity link
 */
export const isValidActivityUrl = (url: string): boolean => {
  return isValidStravaUrl(url) || isValidGarminUrl(url);
};