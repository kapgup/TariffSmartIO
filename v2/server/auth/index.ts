import { Express } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Configure authentication for the v2 platform
 * @param app Express application
 */
export function configureAuth(app: Express) {
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  // Set up local strategy (username/password)
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // In a real implementation, we would hash the password and compare it
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));
        
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        
        // For demonstration purposes, we're not implementing real password checking yet
        // In production, we would use bcrypt to compare hashed passwords
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  // Set up Google OAuth strategy if client ID and secret are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/v2/auth/google/callback'
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Check if user exists with this Google ID
          let [user] = await db
            .select()
            .from(users)
            .where(eq(users.googleId, profile.id));
          
          if (!user) {
            // Create a new user if none exists
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            const displayName = profile.displayName || '';
            const profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
            
            // Insert new user (simplified for demonstration)
            // In a real implementation, we would need to handle the case where the email already exists
            // and also properly handle the role and other fields
            const [newUser] = await db
              .insert(users)
              .values({
                email,
                username: email,
                displayName,
                profilePicture,
                googleId: profile.id,
                role: 'user'
              })
              .returning();
            
            user = newUser;
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    ));
  }
  
  console.log('[v2] Authentication configured');
}