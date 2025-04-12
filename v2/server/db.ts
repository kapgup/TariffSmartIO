import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

// Enable WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

// Check if database URL is set
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Create database connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Drizzle ORM instance with the schema
export const db = drizzle(pool, { schema });

// Function to initialize the database with tables
export async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    // This function could be expanded to handle migrations or seeding initial data
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}