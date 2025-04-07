import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';
import { db } from '../db';
import { users, User } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { storage } from '../storage';

// Configure Google OAuth strategy
// Log available OAuth credentials for debugging (without revealing secrets)
console.log('Google OAuth Configuration:', { 
  hasClientId: Boolean(process.env.GOOGLE_CLIENT_ID), 
  hasClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
  callbackURL: '/auth/google/callback'
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
      proxy: true,
      // These settings help with Replit's environment
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      // Passing request parameter allows us to use a dynamic callbackURL
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Log authentication process for debugging
        console.log('Google authentication in progress for profile:', {
          id: profile.id,
          displayName: profile.displayName,
          hasEmails: Boolean(profile.emails && profile.emails.length)
        });
        // Check if user already exists
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.googleId, profile.id));

        if (existingUser) {
          // Update last login time
          const [updatedUser] = await db
            .update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, existingUser.id))
            .returning();
            
          // Use as Express.User type which is more compatible with Passport
          return done(null, updatedUser as Express.User);
        }

        // Create a new user if one doesn't exist
        const username = profile.emails && profile.emails[0] ? 
          profile.emails[0].value.split('@')[0] : 
          `user_${profile.id.substring(0, 8)}`;
        
        // Check if username already exists and append a random number if needed
        const [existingUsername] = await db
          .select()
          .from(users)
          .where(eq(users.username, username));
          
        const finalUsername = existingUsername ? 
          `${username}_${Math.floor(Math.random() * 10000)}` : 
          username;

        // Create a new user
        const newUser = await storage.createUser({
          username: finalUsername,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
          googleId: profile.id,
          displayName: profile.displayName || finalUsername,
          profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          role: 'user', // Default role for new users
        });

        // Use as Express.User type which is more compatible with Passport
        return done(null, newUser as Express.User);
      } catch (error) {
        console.error('Error in Google authentication process:', error);
        return done(error as Error);
      }
    }
  )
);

// Serialize user to the session
passport.serializeUser((user: Express.User, done) => {
  console.log('Serializing user to session:', user.id);
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    console.log('Deserializing user from session ID:', id);
    const user = await storage.getUser(id);
    if (user) {
      console.log('User found in database:', { id: user.id, username: user.username, role: user.role });
      // Use as Express.User type which is more compatible with Passport
      done(null, user as Express.User);
    } else {
      console.error(`User deserialization failed: ID ${id} not found in database`);
      done(new Error(`User with ID ${id} not found`), null);
    }
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

export default passport;