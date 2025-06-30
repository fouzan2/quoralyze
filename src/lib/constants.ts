export const APP_NAME = 'Quoralyze';
export const APP_DESCRIPTION = 'Modern customer feedback collection and analysis platform';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const AUTH_COOKIE_NAME = 'quoralyze-auth-token';
export const THEME_COOKIE_NAME = 'quoralyze-theme';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  FORMS: '/dashboard/forms',
  FORM_BUILDER: '/dashboard/forms/builder',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  PROFILE: '/dashboard/settings/profile',
  TEAM: '/dashboard/settings/team',
  BILLING: '/dashboard/settings/billing',
  INTEGRATIONS: '/dashboard/settings/integrations',
} as const;

export const QUESTION_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
  RATING: 'rating',
  SCALE: 'scale',
  NPS: 'nps',
  FILE: 'file',
  DATE: 'date',
  TIME: 'time',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
} as const;

export const PRICING_PLANS = {
  STARTER: {
    name: 'Starter',
    price: 29,
    features: [
      'Up to 1,000 responses/month',
      '5 active forms',
      'Basic analytics',
      'Email support',
      'Form templates',
      'CSV export',
    ],
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 79,
    features: [
      'Up to 10,000 responses/month',
      'Unlimited forms',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'API access',
      'Team collaboration',
      'Advanced export options',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null,
    features: [
      'Unlimited responses',
      'Unlimited forms',
      'AI-powered insights',
      'Dedicated support',
      'White-label options',
      'Custom integrations',
      'SSO/SAML',
      'SLA guarantee',
    ],
  },
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const FORM_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const RESPONSE_STATUS = {
  COMPLETED: 'completed',
  PARTIAL: 'partial',
  ABANDONED: 'abandoned',
} as const; 