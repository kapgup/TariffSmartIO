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
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login?error=authentication_failed'
  })
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