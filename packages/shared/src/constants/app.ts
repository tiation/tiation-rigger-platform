// Application constants

export const APP_CONFIG = {
  NAME: 'Rigger Platform',
  VERSION: '1.0.0',
  DESCRIPTION: 'Enterprise workforce management and job marketplace for riggers and construction workers',
  COMPANY: 'Tiation',
  SUPPORT_EMAIL: 'support@tiation.com',
  API_VERSION: 'v1',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  PROFILE: '/profile',
  SAFETY: '/safety',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
  ADMIN: '/admin',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    SEARCH: '/api/users/search',
  },
  JOBS: {
    BASE: '/api/jobs',
    SEARCH: '/api/jobs/search',
    APPLICATIONS: '/api/jobs/applications',
  },
  SKILLS: {
    BASE: '/api/skills',
    CATEGORIES: '/api/skills/categories',
  },
  CERTIFICATIONS: {
    BASE: '/api/certifications',
  },
  SAFETY: {
    BASE: '/api/safety',
    RECORDS: '/api/safety/records',
    INCIDENTS: '/api/safety/incidents',
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
  },
  MESSAGES: {
    BASE: '/api/messages',
    CONVERSATIONS: '/api/messages/conversations',
  },
  UPLOADS: {
    BASE: '/api/uploads',
    AVATARS: '/api/uploads/avatars',
    DOCUMENTS: '/api/uploads/documents',
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 seconds
  UPLOAD: 60000, // 1 minute
  SOCKET_CONNECT: 10000, // 10 seconds
} as const;

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  
  // Job events
  JOB_CREATED: 'job:created',
  JOB_UPDATED: 'job:updated',
  JOB_DELETED: 'job:deleted',
  JOB_APPLICATION_RECEIVED: 'job:application:received',
  JOB_APPLICATION_STATUS_CHANGED: 'job:application:status_changed',
  
  // Message events
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_SENT: 'message:sent',
  USER_TYPING: 'user:typing',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  
  // Safety events
  SAFETY_ALERT: 'safety:alert',
  SAFETY_INCIDENT: 'safety:incident',
  
  // Notification events
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',
} as const;

export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  CERTIFICATES: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
} as const;

export const FILE_SIZES = {
  AVATAR_MAX: 5 * 1024 * 1024, // 5MB
  DOCUMENT_MAX: 10 * 1024 * 1024, // 10MB
  CERTIFICATE_MAX: 5 * 1024 * 1024, // 5MB
} as const;

export const CURRENCY = {
  DEFAULT: 'AUD',
  SYMBOLS: {
    AUD: '$',
    USD: '$',
    EUR: '€',
    GBP: '£',
  },
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
  API: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export const GEOLOCATION = {
  DEFAULT_RADIUS: 50, // km
  MAX_RADIUS: 500, // km
  DEFAULT_COORDINATES: {
    // Sydney, Australia
    latitude: -33.8688,
    longitude: 151.2093,
  },
} as const;

export const SAFETY_THRESHOLDS = {
  MINIMUM_SCORE: 85,
  WARNING_SCORE: 90,
  EXCELLENT_SCORE: 95,
} as const;

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 3,
} as const;