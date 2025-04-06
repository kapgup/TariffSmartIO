import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Define role hierarchy for role-based access control
const roleHierarchy: Record<string, number> = {
  'anonymous': 0,
  'user': 1,
  'premium': 2,
  'editor': 3,
  'admin': 4
};

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: string;
      email?: string;
      displayName?: string;
      profilePicture?: string;
      subscriptionTier?: string;
    }
  }
}

// Check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: 'Unauthorized' });
};

// Check if user has required role
export const hasRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userRole = req.user?.role || 'anonymous';
    
    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      return next();
    }
    
    res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  };
};

// Check if user is premium
export const isPremium = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const user = req.user as User;
  
  if (user.role === 'premium' || user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ message: 'Forbidden: Premium subscription required' });
};

// Role check helpers
export const isAdmin = hasRole('admin');
export const isEditor = hasRole('editor');
export const isUser = hasRole('user');

// Get current user
export const getCurrentUser = (req: Request) => {
  if (!req.isAuthenticated()) {
    return null;
  }
  
  return req.user;
};

// Attach user role to response
export const attachUserRole = (req: Request, res: Response, next: NextFunction) => {
  res.locals.userRole = req.isAuthenticated() ? req.user?.role : 'anonymous';
  next();
};