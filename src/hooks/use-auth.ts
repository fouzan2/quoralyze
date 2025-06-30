import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
import { authApi } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { User } from '@/types';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout: logoutFromStore } = useAuthStore();

  // Rehydrate the auth store on mount
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  // Query to get current user
  const { data: userData, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me as any,
    enabled: !user && !isLoading,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update auth state when user data is fetched
  useEffect(() => {
    if (userData) {
      setUser(userData as User);
    } else if (error) {
      setUser(null);
    }
  }, [userData, error, setUser]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login as any,
    onSuccess: (data: any) => {
      setUser(data.user);
      queryClient.setQueryData(['auth', 'me'], data.user);
      toast.success('Welcome back!');
      router.push(ROUTES.DASHBOARD);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup as any,
    onSuccess: () => {
      toast.success('Account created successfully! Please check your email to verify your account.');
      router.push(ROUTES.LOGIN);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signup failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout as any,
    onSuccess: () => {
      logoutFromStore();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push(ROUTES.HOME);
    },
    onError: () => {
      // Even if the API call fails, we should still logout locally
      logoutFromStore();
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword as any,
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword as any,
    onSuccess: () => {
      toast.success('Password reset successfully!');
      router.push(ROUTES.LOGIN);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
    
    // Actions
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    
    // Mutation states
    isLoginPending: loginMutation.isPending,
    isSignupPending: signupMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    isResetPasswordPending: resetPasswordMutation.isPending,
  };
} 