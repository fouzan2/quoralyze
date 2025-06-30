import { z } from 'zod';
import { QUESTION_TYPES } from './constants';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Form schemas
export const questionOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Option label is required'),
  value: z.string().min(1, 'Option value is required'),
});

export const questionValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  customMessage: z.string().optional(),
});

export const conditionalLogicSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
  value: z.string(),
  action: z.enum(['show', 'hide', 'skip_to']),
  targetQuestionId: z.string().optional(),
});

export const questionSchema = z.object({
  id: z.string(),
  type: z.enum(Object.values(QUESTION_TYPES) as [string, ...string[]]),
  title: z.string().min(1, 'Question title is required'),
  description: z.string().optional(),
  required: z.boolean().default(false),
  order: z.number(),
  options: z.array(questionOptionSchema).optional(),
  validation: questionValidationSchema.optional(),
  conditionalLogic: z.array(conditionalLogicSchema).optional(),
});

export const formThemeSchema = z.object({
  primaryColor: z.string().default('#3b82f6'),
  backgroundColor: z.string().default('#ffffff'),
  fontFamily: z.string().default('system-ui'),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']).default('solid'),
});

export const notificationSettingsSchema = z.object({
  emailNotification: z.boolean().default(true),
  emailRecipients: z.array(z.string().email()).default([]),
  webhookUrl: z.string().url().optional(),
});

export const submissionSettingsSchema = z.object({
  allowMultiple: z.boolean().default(false),
  requireAuth: z.boolean().default(false),
  redirectUrl: z.string().url().optional(),
  successMessage: z.string().default('Thank you for your submission!'),
  autoClose: z.boolean().default(false),
  autoCloseDelay: z.number().min(1).max(60).default(5),
});

export const brandingSettingsSchema = z.object({
  showLogo: z.boolean().default(true),
  logoUrl: z.string().url().optional(),
  removeBranding: z.boolean().default(false),
});

export const formSettingsSchema = z.object({
  theme: formThemeSchema,
  notifications: notificationSettingsSchema,
  submission: submissionSettingsSchema,
  branding: brandingSettingsSchema,
});

export const createFormSchema = z.object({
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  settings: formSettingsSchema,
});

export const updateFormSchema = createFormSchema.partial();

// Profile schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Team schemas
export const inviteTeamMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member']),
});

// Response schemas
export const submitFormSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    value: z.any(),
  })),
}); 