/**
 * Validation utility functions for NachoeyBusyCoach
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Thai format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Thai phone number
  // Mobile: 08x-xxx-xxxx or 09x-xxx-xxxx (10 digits)
  // Landline: 0x-xxx-xxxx (9 digits)
  return /^0[689]\d{8}$/.test(cleanPhone) || /^0[2-7]\d{7}$/.test(cleanPhone);
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    // Mobile format: 08x-xxx-xxxx
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 9) {
    // Landline format: 0x-xxx-xxxx
    return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 5)}-${cleanPhone.slice(5)}`;
  }
  
  return phone; // Return original if not valid format
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

/**
 * Validate maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

/**
 * Validate number range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize HTML content (basic)
 */
export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate Thai name (allows Thai characters, spaces, and basic punctuation)
 */
export const isValidThaiName = (name: string): boolean => {
  const thaiNameRegex = /^[ก-๙\s.-]+$/;
  return thaiNameRegex.test(name.trim());
};

/**
 * Validate English name (allows English characters, spaces, and basic punctuation)
 */
export const isValidEnglishName = (name: string): boolean => {
  const englishNameRegex = /^[a-zA-Z\s.-]+$/;
  return englishNameRegex.test(name.trim());
};

/**
 * Validate age (reasonable range for runners)
 */
export const isValidAge = (age: number): boolean => {
  return isInRange(age, 10, 100);
};

/**
 * Validate weight (in kg)
 */
export const isValidWeight = (weight: number): boolean => {
  return isInRange(weight, 20, 300);
};

/**
 * Validate height (in cm)
 */
export const isValidHeight = (height: number): boolean => {
  return isInRange(height, 100, 250);
};

/**
 * Create validation error message
 */
export const createValidationError = (field: string, rule: string): string => {
  const errorMessages: Record<string, string> = {
    required: `${field} จำเป็นต้องกรอก`,
    email: `${field} รูปแบบอีเมลไม่ถูกต้อง`,
    phone: `${field} รูปแบบเบอร์โทรไม่ถูกต้อง`,
    minLength: `${field} ต้องมีความยาวอย่างน้อย`,
    maxLength: `${field} ความยาวเกินกำหนด`,
    url: `${field} รูปแบบ URL ไม่ถูกต้อง`,
    thaiName: `${field} ต้องเป็นชื่อภาษาไทยเท่านั้น`,
    englishName: `${field} ต้องเป็นชื่อภาษาอังกฤษเท่านั้น`,
    age: `${field} อายุต้องอยู่ระหว่าง 10-100 ปี`,
    weight: `${field} น้ำหนักต้องอยู่ระหว่าง 20-300 กก.`,
    height: `${field} ส่วนสูงต้องอยู่ระหว่าง 100-250 ซม.`,
    positiveNumber: `${field} ต้องเป็นตัวเลขที่มากกว่า 0`
  };
  
  return errorMessages[rule] || `${field} ข้อมูลไม่ถูกต้อง`;
};