import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use DATABASE_URL from environment
export default {
  schema: './shared/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  out: './drizzle',
} satisfies Config;