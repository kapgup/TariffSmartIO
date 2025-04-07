import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  role: string;
  email?: string;
  displayName?: string;
  profilePicture?: string;
  subscriptionTier?: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  checkRole: (requiredRole: string) => boolean;
  isPremium: () => boolean;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  logout: async () => {},
  checkRole: () => false,
  isPremium: () => false,
  refetchUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    data: user, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<User>({
    queryKey: ['/api/auth/session'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      await refetch();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [refetch]);

  const checkRole = useCallback((requiredRole: string) => {
    if (!user) return false;
    return user.role === requiredRole || user.role === 'admin';
  }, [user]);

  const isPremium = useCallback(() => {
    if (!user) return false;
    return user.subscriptionTier === 'premium';
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      isLoading, 
      error: error as Error | null,
      logout,
      checkRole,
      isPremium,
      refetchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);