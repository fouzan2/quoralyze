import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_URL, AUTH_COOKIE_NAME } from './constants';
import type { AuthResponse, User, Form, OverviewStats } from '@/types/api';

// Development mode flag - set to true when no backend is available
const DEV_MODE = true;

// Mock responses for development
const mockResponses = {
  login: {
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    token: 'mock-jwt-token'
  },
  overview: {
    totalForms: 5,
    totalResponses: 142,
    averageResponseRate: 78,
    totalViews: 1250
  }
};

// Mock API function
function mockApiCall<T>(data: T, delay = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await api.post('/auth/refresh');
        const { token } = response as any;
        
        // Update token in cookies
        setCookie(AUTH_COOKIE_NAME, token);
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message = (error.response?.data as any)?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Helper functions for cookies
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days = 7): void {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// API methods
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (DEV_MODE) {
      setCookie(AUTH_COOKIE_NAME, 'mock-jwt-token');
      return mockApiCall(mockResponses.login);
    }
    return api.post('/auth/login', { email, password });
  },
    
  signup: (data: { email: string; password: string; name: string }): Promise<{ message: string }> =>
    DEV_MODE 
      ? mockApiCall({ message: 'Account created successfully' })
      : api.post('/auth/signup', data),
    
  logout: async (): Promise<{ message: string }> => {
    if (DEV_MODE) {
      setCookie(AUTH_COOKIE_NAME, '', -1);
      return mockApiCall({ message: 'Logged out' });
    }
    return api.post('/auth/logout');
  },
  
  forgotPassword: (email: string): Promise<{ message: string }> =>
    DEV_MODE 
      ? mockApiCall({ message: 'Reset email sent' })
      : api.post('/auth/forgot-password', { email }),
    
  resetPassword: (token: string, password: string): Promise<{ message: string }> =>
    DEV_MODE 
      ? mockApiCall({ message: 'Password reset successful' })
      : api.post('/auth/reset-password', { token, password }),
    
  verifyEmail: (token: string): Promise<{ message: string }> =>
    DEV_MODE 
      ? mockApiCall({ message: 'Email verified' })
      : api.post('/auth/verify-email', { token }),
    
  me: (): Promise<User> => 
    DEV_MODE 
      ? mockApiCall(mockResponses.login.user)
      : api.get('/auth/me'),
};

export const formsApi = {
  list: (params?: { page?: number; limit?: number; status?: string }): Promise<Form[]> =>
    DEV_MODE 
      ? mockApiCall([
          {
            id: '1',
            title: 'Customer Satisfaction Survey',
            description: 'Collect feedback about our product and service quality',
            status: 'published' as const,
            responses: 24,
            createdAt: new Date('2024-12-01'),
            updatedAt: new Date('2024-12-15'),
          },
          {
            id: '2',
            title: 'Product Feature Feedback',
            description: 'Help us improve our product features based on your experience',
            status: 'draft' as const,
            responses: 8,
            createdAt: new Date('2024-12-10'),
            updatedAt: new Date('2024-12-20'),
          },
          {
            id: '3',
            title: 'Event Feedback Form',
            description: 'Share your thoughts about our recent webinar',
            status: 'published' as const,
            responses: 42,
            createdAt: new Date('2024-11-25'),
            updatedAt: new Date('2024-12-05'),
          }
        ])
      : api.get('/forms', { params }),
    
  get: (id: string) => api.get(`/forms/${id}`),
  
  create: (data: any): Promise<Form> => 
    DEV_MODE 
      ? mockApiCall({ 
          id: Date.now().toString(), 
          ...data, 
          status: 'draft' as const,
          responses: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      : api.post('/forms', data),
  
  update: (id: string, data: any) => api.put(`/forms/${id}`, data),
  
  delete: (id: string) => api.delete(`/forms/${id}`),
  
  publish: (id: string) => api.post(`/forms/${id}/publish`),
  
  unpublish: (id: string) => api.post(`/forms/${id}/unpublish`),
  
  duplicate: (id: string) => api.post(`/forms/${id}/duplicate`),
  
  getResponses: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/forms/${id}/responses`, { params }),
    
  getAnalytics: (id: string) => api.get(`/forms/${id}/analytics`),
};

export const responsesApi = {
  submit: (formId: string, data: any) =>
    api.post(`/forms/${formId}/submit`, data),
    
  get: (id: string) => api.get(`/responses/${id}`),
  
  update: (id: string, data: any) => api.put(`/responses/${id}`, data),
  
  delete: (id: string) => api.delete(`/responses/${id}`),
};

export const analyticsApi = {
  overview: (): Promise<OverviewStats> => 
    DEV_MODE 
      ? mockApiCall(mockResponses.overview)
      : api.get('/analytics/overview'),
  
  forms: (params?: { startDate?: string; endDate?: string }) =>
    DEV_MODE 
      ? mockApiCall({ totalResponses: 142, activeForms: 5, averageCompletionRate: 78, totalViews: 1250 })
      : api.get('/analytics/forms', { params }),
    
  responses: (params?: { startDate?: string; endDate?: string }) =>
    DEV_MODE 
      ? mockApiCall([])
      : api.get('/analytics/responses', { params }),
};

export const settingsApi = {
  getProfile: (): Promise<User> => 
    DEV_MODE 
      ? mockApiCall(mockResponses.login.user)
      : api.get('/settings/profile'),
  
  updateProfile: (data: any): Promise<User> => 
    DEV_MODE 
      ? mockApiCall({ ...mockResponses.login.user, ...data })
      : api.put('/settings/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    DEV_MODE 
      ? mockApiCall({ message: 'Password changed successfully' })
      : api.post('/settings/change-password', data),
    
  getTeam: () => 
    DEV_MODE 
      ? mockApiCall([])
      : api.get('/settings/team'),
  
  inviteTeamMember: (data: { email: string; role: string }) =>
    DEV_MODE 
      ? mockApiCall({ message: 'Invitation sent successfully' })
      : api.post('/settings/team/invite', data),
    
  removeTeamMember: (userId: string) =>
    DEV_MODE 
      ? mockApiCall({ message: 'Team member removed' })
      : api.delete(`/settings/team/members/${userId}`),
    
  getBilling: () => 
    DEV_MODE 
      ? mockApiCall({ 
          plan: 'starter', 
          price: 29, 
          usage: 142, 
          limit: 1000,
          nextBilling: '2025-01-15' 
        })
      : api.get('/settings/billing'),
  
  updateBilling: (data: any) => 
    DEV_MODE 
      ? mockApiCall({ message: 'Billing updated' })
      : api.put('/settings/billing', data),
  
  getIntegrations: () => 
    DEV_MODE 
      ? mockApiCall([])
      : api.get('/settings/integrations'),
  
  connectIntegration: (type: string, data: any) =>
    DEV_MODE 
      ? mockApiCall({ message: 'Integration connected' })
      : api.post(`/settings/integrations/${type}/connect`, data),
    
  disconnectIntegration: (id: string) =>
    DEV_MODE 
      ? mockApiCall({ message: 'Integration disconnected' })
      : api.delete(`/settings/integrations/${id}`),
};