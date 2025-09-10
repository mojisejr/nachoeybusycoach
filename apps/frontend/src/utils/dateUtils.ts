/**
 * Date utility functions for formatting dates and durations
 */

/**
 * Format an ISO date string to a readable Thai format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Format a duration in minutes to a readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} นาที`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ชั่วโมง`;
  }
  
  return `${hours} ชั่วโมง ${remainingMinutes} นาที`;
}

/**
 * Format a date to a short format (DD/MM/YYYY)
 * @param dateString - ISO date string
 * @returns Short formatted date string
 */
export function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Get relative time from now (e.g., "2 days ago", "in 3 days")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'วันนี้';
    } else if (diffInDays === 1) {
      return 'พรุ่งนี้';
    } else if (diffInDays === -1) {
      return 'เมื่อวาน';
    } else if (diffInDays > 0) {
      return `อีก ${diffInDays} วัน`;
    } else {
      return `${Math.abs(diffInDays)} วันที่แล้ว`;
    }
  } catch (error) {
    return dateString;
  }
}

/**
 * Check if a date is today
 * @param dateString - ISO date string
 * @returns True if the date is today
 */
export function isToday(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns True if the date is in the past
 */
export function isPast(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch (error) {
    return false;
  }
}

/**
 * Get the start of the week for a given date
 * @param dateString - ISO date string
 * @returns ISO date string for the start of the week (Monday)
 */
export function getWeekStart(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(date.setDate(diff));
    return monday.toISOString().split('T')[0];
  } catch (error) {
    return dateString;
  }
}

/**
 * Get the end of the week for a given date
 * @param dateString - ISO date string
 * @returns ISO date string for the end of the week (Sunday)
 */
export function getWeekEnd(dateString: string): string {
  try {
    const weekStart = getWeekStart(dateString);
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
    return endDate.toISOString().split('T')[0];
  } catch (error) {
    return dateString;
  }
}