import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// Configure neon to use WebSockets
neonConfig.webSocketConstructor = ws;

// Verify database connection string exists
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool and Drizzle ORM instance
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Ensure connections are properly closed on application shutdown
process.on('SIGINT', () => {
  console.log('Closing database pool connections...');
  pool.end().then(() => {
    console.log('Database pool connections closed.');
    process.exit(0);
  });
});