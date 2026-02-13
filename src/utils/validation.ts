import { DrawFrequency } from '../types/client';

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  return null;
};

// Mobile number validation
export const validateMobileNumber = (mobile: string): string | null => {
  if (!mobile || !mobile.trim()) {
    return 'Mobile number is required';
  }

  const mobileRegex = /^\+?[0-9]{10,15}$/;
  if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
    return 'Mobile number must be 10-15 digits with optional + prefix';
  }

  return null;
};

// Organization name validation
export const validateOrganizationName = (name: string): string | null => {
  if (!name || !name.trim()) {
    return 'Organization name is required';
  }

  if (name.length < 2) {
    return 'Organization name must be at least 2 characters';
  }

  if (name.length > 200) {
    return 'Organization name must not exceed 200 characters';
  }

  return null;
};

// Brand color validation
export const validateBrandColor = (color: string): string | null => {
  if (!color || !color.trim()) {
    return null; // Optional field
  }

  const colorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!colorRegex.test(color)) {
    return 'Brand color must be in hexadecimal format (#RRGGBB)';
  }

  return null;
};

// Draw frequency validation
export const validateDrawFrequency = (frequency: string): string | null => {
  if (!frequency || !frequency.trim()) {
    return null; // Optional field
  }

  const validFrequencies: DrawFrequency[] = [
    'weekly',
    'monthly',
    'campaign_based',
    'custom',
  ];

  if (!validFrequencies.includes(frequency as DrawFrequency)) {
    return 'Invalid draw frequency';
  }

  return null;
};

// Time zone validation (IANA time zone identifiers)
export const validateTimeZone = (timeZone: string): string | null => {
  if (!timeZone || !timeZone.trim()) {
    return null; // Optional field
  }

  try {
    // Check if it's a valid IANA time zone
    Intl.DateTimeFormat(undefined, { timeZone });
    return null;
  } catch (error) {
    return 'Invalid time zone identifier';
  }
};

// Logo file validation
export const validateLogoFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only PNG, JPG, and JPEG files are allowed';
  }

  // Check file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }

  return null;
};

// Validate logo dimensions (async)
export const validateLogoDimensions = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width < 512 || img.height < 512) {
        resolve('Image dimensions must be at least 512x512 pixels');
      } else {
        resolve(null);
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve('Failed to load image');
    };
    img.src = URL.createObjectURL(file);
  });
};

// Required field validation
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Validate all client form data
export interface ValidationErrors {
  [key: string]: string;
}

export const validateClientForm = async (
  data: any
): Promise<ValidationErrors> => {
  const errors: ValidationErrors = {};

  // Required fields
  const orgNameError = validateOrganizationName(data.organizationName);
  if (orgNameError) errors.organizationName = orgNameError;

  const adminNameError = validateRequired(
    data.tenantAdminFullName,
    'Tenant admin full name'
  );
  if (adminNameError) errors.tenantAdminFullName = adminNameError;

  const emailError = validateEmail(data.tenantAdminEmail);
  if (emailError) errors.tenantAdminEmail = emailError;

  const mobileError = validateMobileNumber(data.tenantAdminMobile);
  if (mobileError) errors.tenantAdminMobile = mobileError;

  const categoryError = validateRequired(data.businessCategory, 'Business category');
  if (categoryError) errors.businessCategory = categoryError;

  // Optional fields
  if (data.brandColor) {
    const colorError = validateBrandColor(data.brandColor);
    if (colorError) errors.brandColor = colorError;
  }

  if (data.drawFrequency) {
    const frequencyError = validateDrawFrequency(data.drawFrequency);
    if (frequencyError) errors.drawFrequency = frequencyError;
  }

  if (data.defaultTimeZone) {
    const timeZoneError = validateTimeZone(data.defaultTimeZone);
    if (timeZoneError) errors.defaultTimeZone = timeZoneError;
  }

  if (data.supportContactEmail) {
    const supportEmailError = validateEmail(data.supportContactEmail);
    if (supportEmailError) errors.supportContactEmail = supportEmailError;
  }

  if (data.escalationContact) {
    const escalationEmailError = validateEmail(data.escalationContact);
    if (escalationEmailError) errors.escalationContact = escalationEmailError;
  }

  // Logo validation (if file is provided)
  if (data.organizationLogo instanceof File) {
    const fileError = validateLogoFile(data.organizationLogo);
    if (fileError) {
      errors.organizationLogo = fileError;
    } else {
      const dimensionsError = await validateLogoDimensions(data.organizationLogo);
      if (dimensionsError) errors.organizationLogo = dimensionsError;
    }
  }

  return errors;
};
