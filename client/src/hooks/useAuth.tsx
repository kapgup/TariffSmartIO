import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

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
  isLoading: false,
  error: null,
  logout: async () => {},
  checkRole: () => false,
  isPremium: () => false,
  refetchUser: async () => {},
});

// Role hierarchy for authorization checks
const roleHierarchy: Record<string, number> = {
  'anonymous': 0,
  'user': 1,
  'premium': 2,
  'editor': 3,
  'admin': 4
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch current user data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: true, // Always fetch on mount
  });

  // Update user state when data changes
  useEffect(() => {
    if (data && typeof data === 'object' && 'user' in data && data.user) {
      setUser(data.user as User);
    } else {
      setUser(null);
    }
  }, [data]);

  // Logout function
  const logout = async () => {
    try {
      await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear user from state
      setUser(null);
      
      // Invalidate user data in cache
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      
      // Reload page to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Check if user has required role
  const checkRole = (requiredRole: string): boolean => {
    if (!user) return false;
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };
  
  // Check if user has premium access
  const isPremium = (): boolean => {
    return checkRole('premium');
  };
  
  // Refetch user data
  const refetchUser = async (): Promise<void> => {
    await refetch();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error: error as Error | null, 
        logout,
        checkRole,
        isPremium,
        refetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);