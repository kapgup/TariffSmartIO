import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  tablesFilter: "v2_*", // Only target tables that begin with 'v2_'
} satisfies Config;