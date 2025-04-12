import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import { registerRoutes } from "./routes";
import { storage } from "./storage";
import { createServer, Server } from "http";
import { db } from "./db";
import { featureFlags } from "../shared/schema";
import { eq } from "drizzle-orm";

/**
 * Initialize the v2 platform's Express application
 */
async function init() {
  const app: Express = express();
  
  // Enable CORS
  app.use(cors());
  
  // Parse JSON request bodies
  app.use(express.json());
  
  // Configure sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "local-dev-secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    })
  );
  
  // Initialize database with defaults if needed
  await initializeDatabase();
  
  // Register all v2 routes
  const server = await registerRoutes(app);
  
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  });
  
  return server;
}

/**
 * Initialize the database with default feature flags
 */
async function initializeDatabase() {
  try {
    // Check if default feature flags exist
    const existingFlags = await db.select().from(featureFlags);
    
    if (existingFlags.length === 0) {
      console.log("Initializing v2 database with default feature flags...");
      
      // Insert default feature flags
      await db.insert(featureFlags).values([
        {
          name: "enable_dictionary",
          description: "Enable the Trade Dictionary feature",
          isEnabled: true,
        },
        {
          name: "enable_modules",
          description: "Enable the Learning Modules feature",
          isEnabled: true,
        },
        {
          name: "enable_quizzes",
          description: "Enable the Quizzes feature",
          isEnabled: true,
        },
        {
          name: "enable_agreements",
          description: "Enable the Trade Agreements Database feature",
          isEnabled: false, // Disabled initially
        },
        {
          name: "enable_challenges",
          description: "Enable the Daily Challenges feature",
          isEnabled: false, // Disabled initially
        },
        {
          name: "enable_badges",
          description: "Enable the Badges & Achievements feature",
          isEnabled: false, // Disabled initially
        },
        {
          name: "enable_certificates",
          description: "Enable the Certificates feature",
          isEnabled: false, // Disabled initially
        },
        {
          name: "enable_user_progress",
          description: "Enable user progress tracking",
          isEnabled: true,
        },
      ]);
      
      console.log("Default feature flags initialized successfully.");
    }
  } catch (error) {
    console.error("Error initializing v2 database:", error);
  }
}

export default init;