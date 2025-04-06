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
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
      }
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Attach user role to response
  app.use(attachUserRole);

  // Mount auth routes
  app.use('/auth', authRoutes);
}

export { passport };