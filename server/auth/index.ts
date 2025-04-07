import passport from './passport';
import authRoutes from './routes';
import * as middleware from './middleware';
import session from 'express-session';
import { Express } from 'express';
import ConnectPgSimple from 'connect-pg-simple';
import { pool } from '../db';

// Export middleware
export const {
  isAuthenticated,
  hasRole,
  isPremium,
  isAdmin,
  isEditor,
  isUser,
  getCurrentUser,
  attachUserRole
} = middleware;

// Configure auth for express app
export function configureAuth(app: Express) {
  // Create session store
  const PgSession = ConnectPgSimple(session);
  const sessionStore = new PgSession({
    pool,
    tableName: 'session' // Default session table name
  });

  // Configure session middleware
  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || 'tariff-tracker-secret',
      resave: false,
      saveUninitialized: false,
      proxy: true, // Trust the reverse proxy
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // IMPORTANT: On Replit, setting secure:true causes issues with cookies
        // Setting secure:false allows cookies to work in Replit's environment
        secure: false, // Force to false for Replit environment
        httpOnly: true,
        sameSite: 'lax',
        // Explicitly set the path to ensure the cookie is available throughout the app
        path: '/'
      }
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Attach user role to response
  app.use(attachUserRole);

  // Mount auth routes
  console.log('Mounting auth routes at: /api/auth');
  app.use('/api/auth', authRoutes);
}

export { passport };