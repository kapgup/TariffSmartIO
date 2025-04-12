import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import { registerRoutes } from './routes';
import { storage } from './storage';
import pgSession from 'connect-pg-simple';
import { pool } from './db';

/**
 * Initialize the v2 platform's Express application
 */
async function init() {
  const app: Express = express();

  // Setup middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Configure CORS for API requests
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://tariffsmart.replit.app'] 
      : ['http://localhost:3000', 'http://localhost:5173', 'https://tariffsmart.replit.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  }));

  // Set up session store with PostgreSQL
  const PgStore = pgSession(session);
  app.use(session({
    store: new PgStore({
      pool,
      tableName: 'user_sessions'
    }),
    secret: process.env.SESSION_SECRET || 'development_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  }));

  // Register all API routes
  await registerRoutes(app);

  // Serve the v2 client application for all v2/* routes
  app.get("/v2/*", (_req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>TariffSmart v2 - International Trade Education Platform</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/v2/client/src/main.tsx"></script>
        </body>
      </html>
    `);
  });
  
  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
    });
  });

  // Initialize database with default data
  await initializeDatabase();

  return app;
}

/**
 * Initialize the database with default feature flags
 */
async function initializeDatabase() {
  try {
    await storage.initializeData();
    console.log('Database initialized with default data');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export default init;