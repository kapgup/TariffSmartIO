import { Router } from 'express';
import passport from './passport';
import { isAuthenticated } from './middleware';

// Extend Express Session interface to include our custom properties
declare module 'express-session' {
  interface SessionData {
    returnTo?: string;
  }
}

const router = Router();

// Add logging middleware to track auth requests
router.use((req, res, next) => {
  console.log(`Auth request: ${req.method} ${req.path}`);
  next();
});

// Google OAuth login route
router.get(
  '/google',
  (req, res, next) => {
    console.log('Starting Google OAuth flow from:', req.headers.host);
    // Set the redirect URL in session for callback to use
    if (req.session) {
      req.session.returnTo = req.query.returnTo as string || '/';
    }
    next();
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Received callback from Google OAuth');
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/auth?error=authentication_failed'
  }),
  (req, res) => {
    // Get the returnTo path from session or default to home
    const returnTo = (req.session && req.session.returnTo) || '/';
    delete req.session.returnTo;
    
    console.log('Authentication successful, redirecting to:', returnTo);
    res.redirect(returnTo);
  }
);

// Current user route - returns current user info or null
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ user: null });
  }
  
  // Don't send sensitive information
  const { id, username, role, email, displayName, profilePicture, subscriptionTier } = req.user as any;
  
  res.json({
    user: {
      id,
      username,
      role,
      email,
      displayName,
      profilePicture,
      subscriptionTier,
      isAuthenticated: true
    }
  });
});

// Logout route
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ success: true });
  });
});

// Check if user can access premium features
router.get('/can-access-premium', isAuthenticated, (req, res) => {
  const user = req.user as any;
  const canAccessPremium = user.role === 'premium' || user.role === 'admin';
  
  res.json({ canAccessPremium });
});

export default router;