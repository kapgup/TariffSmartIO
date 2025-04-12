import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

// Configure Neon to use WebSocket for connection
neonConfig.webSocketConstructor = ws;

// Check for database connection string
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle with our schema
export const db = drizzle(pool, { schema });

// Close the pool when the process exits
process.on('exit', () => {
  pool.end();
});