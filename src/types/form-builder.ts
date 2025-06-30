export type QuestionType = 
  | 'short-text'
  | 'long-text'
  | 'multiple-choice'
  | 'checkboxes'
  | 'dropdown'
  | 'rating'
  | 'nps'
  | 'file-upload'
  | 'date'
  | 'email'
  | 'phone'
  | 'website'
  | 'number'
  | 'section';

export interface FormQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  settings?: Record<string, any>;
  logic?: QuestionLogic[];
}

export interface QuestionLogic {
  id: string;
  condition: {
    field: string;
    operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
    value: string | number;
  };
  action: {
    type: 'show' | 'hide' | 'require' | 'jump-to';
    target?: string; // question ID for jump-to
  };
}

export interface FormBuilderState {
  questions: FormQuestion[];
  selectedQuestionId: string | null;
  isDragging: boolean;
  activeId: string | number | null;
  showPreview: boolean;
  showSettings: boolean;
}

export interface FormSettings {
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    buttonStyle: 'solid' | 'outline' | 'ghost';
  };
  notifications: {
    emailNotification: boolean;
    emailRecipients: string[];
  };
  submission: {
    allowMultiple: boolean;
    requireAuth: boolean;
    successMessage: string;
    autoClose: boolean;
    autoCloseDelay: number;
  };
  branding: {
    showLogo: boolean;
    removeBranding: boolean;
  };
}

export interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  description: string;
  icon: string;
  category: 'basic' | 'choice' | 'rating' | 'advanced' | 'layout';
  hasOptions: boolean;
  hasSettings: boolean;
  defaultSettings?: Record<string, any>;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: Omit<FormQuestion, 'id'>[];
  settings: Partial<FormSettings>;
}

export interface AIQuestionSuggestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: string[];
  confidence: number;
  reasoning: string;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
}

export interface ConditionalLogic {
  id: string;
  sourceQuestionId: string;
  targetQuestionId: string;
  condition: {
    operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'is-empty' | 'is-not-empty';
    value?: any;
  };
  action: {
    type: 'show' | 'hide' | 'require' | 'skip-to';
    target?: string;
  };
}

export interface FormAnalytics {
  totalViews: number;
  totalSubmissions: number;
  completionRate: number;
  averageTime: number;
  dropOffPoints: Array<{
    questionId: string;
    dropOffRate: number;
  }>;
  questionAnalytics: Array<{
    questionId: string;
    views: number;
    responses: number;
    averageTime: number;
  }>;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: Date;
  userAgent?: string;
  ipAddress?: string;
  completionTime?: number;
}

export interface ShareSettings {
  isPublic: boolean;
  requirePassword: boolean;
  password?: string;
  allowAnonymous: boolean;
  collectEmails: boolean;
  limitResponses: boolean;
  maxResponses?: number;
  closeAfter?: Date;
  embedCode: string;
  publicUrl: string;
} 