import express, { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { createServer } from "http";
import { initializeDatabase } from "./db";
import { registerV2Routes } from "./routes";
import passport from "passport";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString();
  console.log(`${time} [${source}] ${message}`);
}

// Set up Express with integrated Vite for development
async function setupServer() {
  // Set up Express
  const app = express();
  const server = createServer(app);
  const port = process.env.PORT || 5000;

  // Session setup for authentication
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "tariffsmart-v2-development-secret",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Initialize passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Parse JSON bodies and URL-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize the database
  await initializeDatabase();

  // Register v2 API routes
  registerV2Routes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: {
        message: err.message || "An unexpected error occurred",
        status: err.status || 500,
      },
    });
  });

  // Start the server
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });

  return { app, server };
}

// Only run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupServer();
}

export default setupServer;