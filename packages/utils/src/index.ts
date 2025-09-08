/**
 * Utility functions for NachoeyBusyCoach
 */

// Date utilities
export {
  formatDateThai,
  formatDateShort,
  getDayOfWeekThai,
  getStartOfWeek,
  getEndOfWeek,
  getWeekDates,
  isSameDay,
  isToday,
  isPastDate,
  formatDuration
} from './date';

// Training utilities
export {
  getSessionStatusText,
  getSessionStatusColor,
  getIntensityText,
  getIntensityColor,
  getFeelingText,
  getFeelingEmoji,
  formatDistance,
  formatPace,
  calculatePace,
  formatTime,
  isValidStravaUrl,
  isValidGarminUrl,
  isValidActivityUrl
} from './training';

// Validation utilities
export {
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isInRange,
  isPositiveNumber,
  isValidUrl,
  sanitizeHtml,
  isValidThaiName,
  isValidEnglishName,
  isValidAge,
  isValidWeight,
  isValidHeight,
  createValidationError
} from './validation';

// Common utility functions
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};