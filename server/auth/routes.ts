import { Router } from 'express';
import passport from './passport';
import { isAuthenticated } from './middleware';

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
    console.log('Effective callback URL will be:', req.protocol + '://' + req.get('host') + '/api/auth/google/callback');
    
    return passport.authenticate('google', { 
      scope: ['profile', 'email']
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
    // Custom passport authenticate with error handling
    passport.authenticate('google', (err: any, user: Express.User | false | null, info: any) => {
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
      
      // Log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          console.error('Login error details:', JSON.stringify(loginErr, null, 2));
          // Send client-side redirect script that preserves the stored redirect
          return res.send(`
            <html>
            <head>
              <title>Login Failed</title>
              <script>
                // Get the stored redirect to pass along
                const redirectPath = sessionStorage.getItem('auth_redirect');
                const redirectParam = redirectPath ? '&from=' + encodeURIComponent(redirectPath) : '';
                // Redirect with error and preserved 'from' param
                window.location.href = '/auth?error=login_failed' + redirectParam;
              </script>
            </head>
            <body>
              <p>Login failed. Redirecting...</p>
            </body>
            </html>
          `);
        }
        
        // Send client-side redirect script that checks for stored redirect path
        return res.send(`
          <html>
          <head>
            <title>Authentication Successful</title>
            <script>
              // Check if we have a stored redirect location
              const redirectPath = sessionStorage.getItem('auth_redirect');
              // Clear stored redirect
              sessionStorage.removeItem('auth_redirect');
              // Redirect to stored path or home if none
              window.location.href = redirectPath || '/';
            </script>
          </head>
          <body>
            <p>Authentication successful. Redirecting...</p>
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