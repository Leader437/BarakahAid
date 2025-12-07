// Application-wide constants

export const ROLES = {
  DONOR: 'donor',
  RECIPIENT: 'recipient',
  VOLUNTEER: 'volunteer',
  NGO: 'ngo',
  ADMIN: 'admin',
};

export const DONATION_CATEGORIES = {
  EDUCATION: 'education',
  HEALTHCARE: 'healthcare',
  FOOD: 'food',
  SHELTER: 'shelter',
  DISASTER_RELIEF: 'disaster_relief',
  ORPHAN_CARE: 'orphan_care',
  CLEAN_WATER: 'clean_water',
  CLOTHING: 'clothing',
  LIVELIHOOD: 'livelihood',
  OTHER: 'other',
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  ACTIVE: 'active',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
};

export const DONATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const VOLUNTEER_EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_MONEY: 'mobile_money',
  CRYPTO: 'crypto',
};

export const NOTIFICATION_TYPES = {
  DONATION_RECEIVED: 'donation_received',
  REQUEST_APPROVED: 'request_approved',
  REQUEST_REJECTED: 'request_rejected',
  VERIFICATION_PENDING: 'verification_pending',
  VERIFICATION_APPROVED: 'verification_approved',
  EVENT_REMINDER: 'event_reminder',
  CAMPAIGN_UPDATE: 'campaign_update',
};

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const CURRENCY = 'USD';

export const ITEMS_PER_PAGE = 12;

export const MAP_DEFAULT_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'hh:mm A';
export const DATETIME_FORMAT = 'MMM DD, YYYY hh:mm A';
