import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL or SUPABASE_DB_URL must be set.",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
