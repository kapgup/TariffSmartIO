import { Router, Request } from 'express';
import passport from './passport';
import { isAuthenticated } from './middleware';
import session from 'express-session';

// Add module augmentation for the Express session
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: number;
    }
  }
}

const router = Router();

// Google OAuth login route
router.get(
  '/google',
  (req, res, next) => {
    console.log('Google OAuth login route hit with headers:', {
      host: req.headers.host,
      referer: req.headers.referer,
      origin: req.headers.origin
    });
    console.log('Full request URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log('Effective callback URL will be: https://tariff-smart-kapilgupta15.replit.app/api/auth/google/callback');
    
    // Use more options to ensure we get a fresh OAuth flow
    return passport.authenticate('google', { 
      scope: ['profile', 'email'],
      // Always request fresh consent
      prompt: 'consent',
      // Include the email hint if available to make login smoother
      // Force approval to avoid caching issues
      accessType: 'online'
    })(req, res, next);
  }
);

// Google OAuth callback route
router.get(
  '/google/callback',
  (req, res, next) => {
    console.log('Google callback route hit - processing authentication');
    console.log('Callback URL query params:', req.query);
    console.log('Full callback URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log('Request headers:', req.headers);
    // Additional debugging for environment
    console.log('Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      REPL_SLUG: process.env.REPL_SLUG,
      REPL_OWNER: process.env.REPL_OWNER,
      HOSTNAME: process.env.HOSTNAME
    });
    
    // Check if we received an error from Google
    if (req.query.error) {
      console.error('Google returned an error:', req.query.error);
      // Handle the error with a redirect
      return res.redirect('/auth?error=authentication_failed');
    }
    
    // Custom passport authenticate with error handling
    passport.authenticate('google', { failureRedirect: '/auth?error=authentication_failed' }, (err: any, user: Express.User | false | null, info: any) => {
      if (err) {
        console.error('Google OAuth Error:', err);
        console.error('Google OAuth Error details:', JSON.stringify(err, null, 2));
        // Send client-side redirect script that preserves the stored redirect
        return res.send(`
          <html>
          <head>
            <title>Authentication Failed</title>
            <script>
              // Get the stored redirect to pass along
              const redirectPath = sessionStorage.getItem('auth_redirect');
              const redirectParam = redirectPath ? '&from=' + encodeURIComponent(redirectPath) : '';
              // Redirect with error and preserved 'from' param
              window.location.href = '/auth?error=authentication_failed' + redirectParam;
            </script>
          </head>
          <body>
            <p>Authentication failed. Redirecting...</p>
          </body>
          </html>
        `);
      }
      
      if (!user) {
        console.error('Authentication failed - no user returned');
        console.error('Authentication info:', JSON.stringify(info, null, 2));
        // Send client-side redirect script that preserves the stored redirect
        return res.send(`
          <html>
          <head>
            <title>Authentication Failed</title>
            <script>
              // Get the stored redirect to pass along
              const redirectPath = sessionStorage.getItem('auth_redirect');
              const redirectParam = redirectPath ? '&from=' + encodeURIComponent(redirectPath) : '';
              // Redirect with error and preserved 'from' param
              window.location.href = '/auth?error=authentication_failed' + redirectParam;
            </script>
          </head>
          <body>
            <p>Authentication failed. Redirecting...</p>
          </body>
          </html>
        `);
      }
      
      console.log('Authentication successful, user:', JSON.stringify({
        id: user.id,
        username: (user as any).username,
        email: (user as any).email,
        role: (user as any).role
      }, null, 2));
      
      // Use traditional callback-based login for consistency
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          // Redirect with error
          return res.redirect('/auth?error=login_failed');
        }
        
        console.log('Login successful, session:', req.sessionID);
        
        // Send client-side redirect script that checks for stored redirect path
        return res.send(`
          <html>
          <head>
            <title>Authentication Successful</title>
            <script>
              try {
                // Attempt to get the stored redirect path - wrap in try/catch for cross-origin issues
                const redirectPath = sessionStorage.getItem('auth_redirect');
                console.log('Retrieved redirect path:', redirectPath);
                
                // Clear stored redirect
                sessionStorage.removeItem('auth_redirect');
                
                // Force a reload to ensure the authentication state is refreshed
                setTimeout(() => {
                  // Redirect to stored path or home if none
                  window.location.href = redirectPath || '/';
                }, 500);
              } catch (err) {
                console.error('Error during redirect:', err);
                // Default fallback if anything goes wrong
                window.location.href = '/';
              }
            </script>
          </head>
          <body>
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
              <div style="text-align: center;">
                <h2 style="color: #555;">Authentication Successful!</h2>
                <p>You are now signed in. Redirecting...</p>
                <div style="margin: 20px; width: 40px; height: 40px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; display: inline-block;"></div>
              </div>
            </div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </body>
          </html>
        `);
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
  console.log('Logout route hit, user was:', req.user ? JSON.stringify({
    id: (req.user as any).id,
    username: (req.user as any).username,
    role: (req.user as any).role
  }, null, 2) : 'Not authenticated');
  
  // Destroy the session
  req.session.destroy((sessionErr) => {
    if (sessionErr) {
      console.error('Error destroying session:', sessionErr);
    }
    
    // Also call logout to clear passport data
    req.logout((logoutErr) => {
      if (logoutErr) {
        console.error('Error during logout:', logoutErr);
        return next(logoutErr);
      }
      
      // Set cookie expiration to clean up client state
      res.clearCookie('connect.sid');
      
      // Return success response
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

// Check if user can access premium features
router.get('/can-access-premium', isAuthenticated, (req, res) => {
  const user = req.user as any;
  const canAccessPremium = user.role === 'premium' || user.role === 'admin';
  
  res.json({ canAccessPremium });
});

export default router;