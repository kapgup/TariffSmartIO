import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import { configureAuth } from './auth';
import { setupRoutes } from './routes';
import { db, pool } from './db';
import { featureFlags } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Initialize the v2 platform's Express application
 */
async function init() {
  const app: Express = express();
  
  // Set up middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://tariffsmart.com'] 
      : ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
  }));
  
  // Set up session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'tariffsmart-v2-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  }));
  
  // Log requests in development
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[v2] ${req.method} ${req.url}`);
    }
    next();
  });
  
  // Configure authentication
  configureAuth(app);
  
  // Set up API routes under /v2/api
  await setupRoutes(app);
  
  // Serve static assets for the v2 client
  const v2ClientPath = path.resolve(__dirname, '../client');
  const v2PublicPath = path.resolve(__dirname, '../client/public');
  
  // Create a specific route for the logo that serves directly from public
  app.get('/v2/assets/logo.svg', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(v2PublicPath, 'logo.svg'));
  });
  
  // Serve static files from public directory first
  app.use('/v2/assets', express.static(v2PublicPath));
  
  // Then serve other client assets
  app.use('/v2/assets', express.static(v2ClientPath));
  
  // Handle all other v2 routes using the v2 index.html for client-side routing
  app.get("/v2*", (_req: Request, res: Response) => {
    console.log('[v2] Serving v2 index.html');
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });
  
  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[v2] Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
      error: {
        status: statusCode,
        message: message
      }
    });
  });
  
  return app;
}

/**
 * Initialize the database with default feature flags
 */
async function initializeDatabase() {
  console.log('Checking if v2 database needs initialization...');
  
  const existingFlags = await db.select().from(featureFlags).limit(1);
  
  if (existingFlags.length === 0) {
    console.log('Initializing v2 database with default feature flags...');
    
    const defaultFlags = [
      { name: 'enableLearningModules', isEnabled: true, description: 'Controls whether learning modules are accessible' },
      { name: 'enableTradeAgreements', isEnabled: true, description: 'Controls whether trade agreements section is accessible' },
      { name: 'enableDailyChallenges', isEnabled: true, description: 'Controls whether daily challenges are available' },
      { name: 'enableCertificates', isEnabled: true, description: 'Controls whether certificates can be earned and displayed' },
      { name: 'enableSocialSharing', isEnabled: true, description: 'Controls whether social sharing options are available' },
      { name: 'enableFeedback', isEnabled: true, description: 'Controls whether user feedback mechanisms are enabled' },
      { name: 'enableAdvancedSearch', isEnabled: true, description: 'Controls whether advanced search features are available' }
    ];
    
    await db.insert(featureFlags).values(defaultFlags);
    console.log('V2 database initialized successfully!');
  } else {
    console.log('V2 database already contains data, skipping initialization');
  }
}

/**
 * Start the v2 platform
 */
export async function startV2Platform() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Initialize app
    const app = await init();
    
    console.log('[v2] Platform initialized successfully');
    return app;
  } catch (error) {
    console.error('[v2] Failed to initialize platform:', error);
    throw error;
  }
}

/**
 * Shutdown the v2 platform
 */
export async function shutdownV2Platform() {
  try {
    await pool.end();
    console.log('[v2] Platform shutdown successfully');
  } catch (error) {
    console.error('[v2] Failed to shutdown platform:', error);
  }
}