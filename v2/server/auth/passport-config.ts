import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import { storage } from '../storage';
import { User } from '../../shared/schema';

// Configure LocalStrategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await storage.getUserByEmail(email);
        
        // User not found
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        // Password not set (e.g., for OAuth users)
        if (!user.password) {
          return done(null, false, { message: 'Invalid login method' });
        }
        
        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        
        // Authentication successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configure Google OAuth strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === 'production'
          ? 'https://tariff-calculator.replit.app/v2/api/auth/google/callback'
          : 'http://localhost:3000/v2/api/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists by Google ID
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (!user) {
            // Extract profile data
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            const displayName = profile.displayName || '';
            const profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
            
            // Check if user exists with the same email
            if (email) {
              const existingUser = await storage.getUserByEmail(email);
              
              if (existingUser) {
                // Update existing user with Google ID
                user = await storage.updateUser(existingUser.id, {
                  googleId: profile.id,
                  profilePicture: profilePicture || existingUser.profilePicture,
                });
              } else {
                // Create a new user
                user = await storage.createUser({
                  email,
                  username: email.split('@')[0],
                  displayName,
                  googleId: profile.id,
                  profilePicture,
                  role: 'basic',
                });
              }
            } else {
              // Cannot create user without email
              return done(null, false, { message: 'Email not provided by Google' });
            }
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});