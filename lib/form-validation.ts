/**
 * Form validation utilities with debouncing support
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validate name field
 * Rules: min 2 chars, no numbers
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  if (/\d/.test(name)) {
    return { isValid: false, message: 'Name cannot contain numbers' };
  }
  return { isValid: true, message: 'Valid name' };
};

/**
 * Validate email field
 * Rules: RFC 5322 format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, message: 'Email is required' };
  }

  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  return { isValid: true, message: 'Valid email' };
};

/**
 * Validate phone field
 * Rules: min 10 digits, starts with +
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, message: 'Phone number is required' };
  }

  if (!phone.startsWith('+')) {
    return { isValid: false, message: 'Phone must start with country code (+)' };
  }

  // Remove all non-digit characters except +
  const digitsOnly = phone.replace(/[^\d]/g, '');
  if (digitsOnly.length < 10) {
    return { isValid: false, message: 'Phone must have at least 10 digits' };
  }

  return { isValid: true, message: 'Valid phone number' };
};

/**
 * Format phone number as user types
 * Example: +966501234567 -> +966 50 123 4567
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Ensure it starts with +
  if (!phone.startsWith('+')) {
    phone = '+' + phone;
  }

  // Remove all non-digit characters except +
  const digits = phone.substring(1).replace(/[^\d]/g, '');

  // Format based on length
  if (digits.length <= 3) {
    return '+' + digits;
  } else if (digits.length <= 5) {
    return '+' + digits.substring(0, 3) + ' ' + digits.substring(3);
  } else if (digits.length <= 8) {
    return '+' + digits.substring(0, 3) + ' ' + digits.substring(3, 5) + ' ' + digits.substring(5);
  } else {
    return '+' + digits.substring(0, 3) + ' ' + digits.substring(3, 5) + ' ' + digits.substring(5, 8) + ' ' + digits.substring(8);
  }
};

/**
 * Validate street address
 * Rules: min 5 chars
 */
export const validateStreet = (street: string): ValidationResult => {
  if (!street || street.trim().length < 5) {
    return { isValid: false, message: 'Street address must be at least 5 characters' };
  }
  return { isValid: true, message: 'Valid street address' };
};

/**
 * Validate city
 * Rules: min 2 chars, letters only
 */
export const validateCity = (city: string): ValidationResult => {
  if (!city || city.trim().length < 2) {
    return { isValid: false, message: 'City must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s-]+$/.test(city)) {
    return { isValid: false, message: 'City can only contain letters, spaces, and hyphens' };
  }
  return { isValid: true, message: 'Valid city' };
};

/**
 * Validate zip code
 * Rules: min 4 chars
 */
export const validateZipCode = (zipCode: string): ValidationResult => {
  if (!zipCode || zipCode.trim().length < 4) {
    return { isValid: false, message: 'Zip code must be at least 4 characters' };
  }
  return { isValid: true, message: 'Valid zip code' };
};

/**
 * Validate birthday
 * Rules: past date, age 13+
 */
export const validateBirthday = (birthday: string): ValidationResult => {
  if (!birthday || birthday.trim().length === 0) {
    return { isValid: false, message: 'Birthday is required' };
  }

  const birthDate = new Date(birthday);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }

  if (birthDate >= today) {
    return { isValid: false, message: 'Birthday must be in the past' };
  }

  // Calculate age
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (actualAge < 13) {
    return { isValid: false, message: 'You must be at least 13 years old' };
  }

  return { isValid: true, message: 'Valid birthday' };
};

/**
 * Calculate age from birthday
 */
export const calculateAge = (birthday: string): number => {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

/**
 * KSA cities for autocomplete
 */
export const KSA_CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Khobar',
  'Dhahran',
  'Tabuk',
  'Buraidah',
  'Khamis Mushait',
  'Hail',
  'Najran',
  'Jazan',
  'Abha',
  'Yanbu',
  'Al Jubail',
  'Arar',
  'Sakaka',
  'Al Qatif',
  'Al Hufuf',
];

/**
 * Debounce function for validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
