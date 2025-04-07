import { Router } from 'express';
import passport from './passport';
import { isAuthenticated } from './middleware';
import { storage } from '../storage';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';

// Extend Express types in the same way as passport.ts
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role: string;
      [key: string]: any;
    }
  }
}

// Initialize Google OAuth client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // Callback URL can be configured dynamically on the frontend
  'postmessage' // Special value for client-side workflows
);

const router = Router();

// Get Google OAuth URL
router.get('/google/url', (req, res) => {
  const isRegistration = req.query.register === 'true';
  
  try {
    // Generate a state parameter to prevent CSRF
    const state = Buffer.from(JSON.stringify({
      isRegistration,
      csrf: Math.random().toString(36).substring(2)
    })).toString('base64');
    
    // Set the oauth2Client redirect_uri to our custom callback URL
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/callback`;
    
    // Generate the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      redirect_uri: redirectUri,
      state
    });
    
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    res.status(500).json({ message: 'Error generating authentication URL' });
  }
});

// Process Google OAuth token
router.post('/google/token', async (req, res) => {
  const schema = z.object({
    code: z.string()
  });
  
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Invalid input', errors: result.error.errors });
  }
  
  const { code } = result.data;
  
  try {
    // Exchange the authorization code for tokens
    const redirectUri = `${req.protocol}://${req.get('host')}/auth/callback`;
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: redirectUri
    });
    
    // Set credentials for the client
    oauth2Client.setCredentials(tokens);
    
    // Get user info with the access token
    const userInfoClient = new OAuth2Client();
    userInfoClient.setCredentials({ access_token: tokens.access_token });
    
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`
        }
      }
    );
    
    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info from Google');
    }
    
    const userInfo = await userInfoResponse.json();
    
    // Look up user by Google ID
    let user = await storage.getUserByGoogleId(userInfo.sub);
    
    if (!user) {
      // Create new user if not found
      const newUser = {
        username: userInfo.email.split('@')[0], // Simple username derived from email
        googleId: userInfo.sub,
        email: userInfo.email,
        displayName: userInfo.name,
        profilePicture: userInfo.picture,
        role: 'user', // Default role for new users
      };
      
      user = await storage.createUser(newUser);
    }
    
    // Log in the user - cast to any to avoid TypeScript issues with req.login
    req.login(user as any, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging in user', error: err.message });
      }
      
      return res.json({ success: true, user });
    });
  } catch (error) {
    console.error('Google OAuth token exchange error:', error);
    res.status(500).json({ message: 'Authentication failed', error: (error as Error).message });
  }
});

// Check if user can access premium features
router.get('/can-access-premium', isAuthenticated, (req, res) => {
  const user = req.user as any;
  const canAccessPremium = user.role === 'premium' || user.role === 'admin';
  
  res.json({ canAccessPremium });
});

export default router;