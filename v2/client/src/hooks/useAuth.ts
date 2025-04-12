import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { apiRequest, invalidateQuery } from '../lib/queryClient';
import type { User, AuthResponse } from '../lib/types';

interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  displayName?: string;
  email?: string;
  bio?: string;
  password?: string;
  currentPassword?: string;
}

/**
 * Custom hook for authentication functionality
 */
export function useAuth() {
  // Get the current authenticated user
  const { 
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['auth/me'],
    retry: false, // Don't retry on 401 unauthorized
  });

  // Extract user from response
  const user = data?.user as User | undefined;
  const isAuthenticated = !!user;

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => 
      apiRequest<RegisterData, AuthResponse>('auth/register', 'POST', userData),
    onSuccess: () => {
      invalidateQuery(['auth/me']);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginData) => 
      apiRequest<LoginData, AuthResponse>('auth/login', 'POST', credentials),
    onSuccess: () => {
      invalidateQuery(['auth/me']);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('auth/logout', 'POST'),
    onSuccess: () => {
      invalidateQuery(['auth/me']);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileData) => 
      apiRequest<UpdateProfileData, AuthResponse>('auth/profile', 'PATCH', profileData),
    onSuccess: () => {
      invalidateQuery(['auth/me']);
    },
  });

  // Helper to check if user has a specific role
  const hasRole = useCallback((role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }, [user]);

  // Check if user is a premium subscriber
  const isPremium = useCallback(() => {
    if (!user) return false;
    
    // Check role
    if (user.role === 'premium' || user.role === 'admin') {
      return true;
    }
    
    // Check subscription
    if (user.subscriptionTier === 'premium' && user.subscriptionExpiresAt) {
      const expiryDate = new Date(user.subscriptionExpiresAt);
      return expiryDate > new Date();
    }
    
    return false;
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isError,
    error,
    refetch,
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,
    hasRole,
    isPremium,
  };
}