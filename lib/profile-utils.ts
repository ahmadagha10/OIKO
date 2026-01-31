/**
 * Profile utility functions for calculating completion and managing profile data
 */

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  birthday: string;
  profilePhoto?: {
    url: string;
    publicId: string;
  };
}

/**
 * Calculate profile completion percentage based on required fields
 * @param profile User profile object
 * @returns Completion percentage (0-100)
 */
export const calculateCompletion = (profile: Partial<UserProfile>): number => {
  const requiredFields: (keyof UserProfile)[] = [
    'name',
    'email',
    'phone',
    'street',
    'city',
    'zipCode',
    'country',
    'birthday',
  ];

  const filledFields = requiredFields.filter((field) => {
    const value = profile[field];
    return value && typeof value === 'string' && value.trim() !== '';
  }).length;

  return Math.round((filledFields / requiredFields.length) * 100);
};

/**
 * Get list of incomplete profile fields
 * @param profile User profile object
 * @returns Array of field names that are incomplete
 */
export const getIncompleteFields = (profile: Partial<UserProfile>): string[] => {
  const requiredFields: (keyof UserProfile)[] = [
    'name',
    'email',
    'phone',
    'street',
    'city',
    'zipCode',
    'country',
    'birthday',
  ];

  return requiredFields.filter((field) => {
    const value = profile[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  });
};

/**
 * Get field display names for UI
 */
export const getFieldDisplayName = (field: string): string => {
  const displayNames: Record<string, string> = {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    street: 'Street Address',
    city: 'City',
    zipCode: 'Zip Code',
    country: 'Country',
    birthday: 'Birthday',
  };

  return displayNames[field] || field;
};

/**
 * Check if profile is complete (all required fields filled)
 */
export const isProfileComplete = (profile: Partial<UserProfile>): boolean => {
  return calculateCompletion(profile) === 100;
};

/**
 * Get user initials from name for avatar fallback
 */
export const getUserInitials = (name: string): string => {
  if (!name || name.trim() === '') return 'U';

  const nameParts = name.trim().split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};
