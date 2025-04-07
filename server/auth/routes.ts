import { Router } from 'express';
import passport from './passport';
import { isAuthenticated } from './middleware';

const router = Router();

// Google OAuth login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  (req, res, next) => {
    // Custom passport authenticate with error handling
    passport.authenticate('google', (err: any, user: Express.User | false | null, info: any) => {
      if (err) {
        console.error('Google OAuth Error:', err);
        return res.redirect('/auth?error=authentication_failed');
      }
      
      if (!user) {
        console.error('Authentication failed - no user returned');
        return res.redirect('/auth?error=authentication_failed');
      }
      
      // Log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return res.redirect('/auth?error=login_failed');
        }
        
        // Success - redirect to home
        return res.redirect('/');
      });
    })(req, res, next);
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