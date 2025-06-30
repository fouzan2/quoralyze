export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  userId: string;
  questions: Question[];
  settings: FormSettings;
  responses: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order: number;
  options?: QuestionOption[];
  validation?: QuestionValidation;
  conditionalLogic?: ConditionalLogic[];
}

export type QuestionType = 
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'rating'
  | 'scale'
  | 'nps'
  | 'file'
  | 'date'
  | 'time'
  | 'email'
  | 'phone'
  | 'number';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface QuestionValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface ConditionalLogic {
  id: string;
  questionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
  action: 'show' | 'hide' | 'skip_to';
  targetQuestionId?: string;
}

export interface FormSettings {
  theme: FormTheme;
  notifications: NotificationSettings;
  submission: SubmissionSettings;
  branding: BrandingSettings;
}

export interface FormTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  buttonStyle: 'solid' | 'outline' | 'ghost';
}

export interface NotificationSettings {
  emailNotification: boolean;
  emailRecipients: string[];
  webhookUrl?: string;
}

export interface SubmissionSettings {
  allowMultiple: boolean;
  requireAuth: boolean;
  redirectUrl?: string;
  successMessage: string;
  autoClose: boolean;
  autoCloseDelay: number;
}

export interface BrandingSettings {
  showLogo: boolean;
  logoUrl?: string;
  removeBranding: boolean;
}

export interface FormResponse {
  id: string;
  formId: string;
  userId?: string;
  answers: Answer[];
  status: 'completed' | 'partial' | 'abandoned';
  metadata: ResponseMetadata;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Answer {
  questionId: string;
  value: any;
  files?: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ResponseMetadata {
  ip?: string;
  userAgent?: string;
  referrer?: string;
  duration?: number;
  device?: string;
  browser?: string;
  location?: {
    country?: string;
    city?: string;
  };
}

export interface Analytics {
  formId: string;
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  responsesByDate: DateValue[];
  responsesByDevice: DeviceStats;
  topReferrers: Referrer[];
  questionAnalytics: QuestionAnalytics[];
}

export interface DateValue {
  date: string;
  value: number;
}

export interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface Referrer {
  source: string;
  count: number;
}

export interface QuestionAnalytics {
  questionId: string;
  type: QuestionType;
  responses: number;
  averageScore?: number;
  distribution?: { [key: string]: number };
  sentiment?: SentimentAnalysis;
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  keywords: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: 'zapier' | 'slack' | 'discord' | 'webhook' | 'google_sheets' | 'mailchimp';
  status: 'connected' | 'disconnected';
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 