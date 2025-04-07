import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../db';
import { users, User } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { storage } from '../storage';

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
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
        return done(error as Error);
      }
    }
  )
);

// Serialize user to the session
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    if (user) {
      // Use as Express.User type which is more compatible with Passport
      done(null, user as Express.User);
    } else {
      done(new Error(`User with ID ${id} not found`), null);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;