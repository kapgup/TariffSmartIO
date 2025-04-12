import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { MemoryStore } from 'memorystore';
import cors from 'cors';
import passport from 'passport';
import { Server } from 'http';
import { registerRoutes } from './routes';
import { db } from './db';
import { storage } from './storage';
import './auth/passport-config';

const MemoryStoreInstance = MemoryStore(session);

/**
 * Initialize the v2 platform's Express application
 */
async function init() {
  const app: Express = express();
  let server: Server | null = null;
  
  // Initialize middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://tariff-calculator.replit.app'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Configure session middleware
  app.use(session({
    store: new MemoryStoreInstance({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'v2-tariff-platform-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Add request logger
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[v2-platform] ${new Date().toISOString()} ${req.method} ${req.url}`);
    // Add user info to request for easier access
    if (req.session && req.user) {
      req.session.userId = (req.user as any).id;
      req.session.userRole = (req.user as any).role;
    }
    next();
  });
  
  // Register API routes
  await registerRoutes(app);
  
  // SPA fallback for client-side routing
  app.get("/v2/*", (_req: Request, res: Response) => {
    res.sendFile('index.html', { root: './dist' });
  });
  
  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[v2-platform] Error:', err);
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'An unexpected error occurred',
        status: err.status || 500
      }
    });
  });
  
  // Start the server
  const port = process.env.PORT || 3000;
  server = app.listen(port, () => {
    console.log(`[v2-platform] Server is running on port ${port}`);
  });
  
  return { app, server };
}

/**
 * Initialize the database with default feature flags
 */
async function initializeDatabase() {
  try {
    console.log('[v2-platform] Initializing database...');
    await storage.initializeData();
    console.log('[v2-platform] Database initialization complete');
  } catch (error) {
    console.error('[v2-platform] Error initializing database:', error);
  }
}

/**
 * Start the v2 platform
 */
export default async function startV2Platform() {
  try {
    // Initialize database with default data
    await initializeDatabase();
    
    // Initialize and start the Express application
    const { app, server } = await init();
    
    console.log('[v2-platform] V2 Platform started successfully');
    return { app, server };
  } catch (error) {
    console.error('[v2-platform] Error starting V2 Platform:', error);
    throw error;
  }
}

/**
 * Shutdown the v2 platform
 */
export async function shutdownV2Platform() {
  try {
    // Close database connection
    console.log('[v2-platform] Closing database connection...');
    await db.$pool.end();
    console.log('[v2-platform] Database connection closed');
    
    console.log('[v2-platform] V2 Platform shutdown complete');
  } catch (error) {
    console.error('[v2-platform] Error during V2 Platform shutdown:', error);
  }
}