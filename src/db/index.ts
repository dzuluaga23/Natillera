import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getEnv } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  natilleraSql?: ReturnType<typeof postgres>;
  natilleraDb?: PostgresJsDatabase<typeof schema>;
};

function createClient() {
  const { DATABASE_URL } = getEnv();

  return postgres(DATABASE_URL, {
    max: process.env.NODE_ENV === "production" ? 10 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
    // Supabase recomienda prepare:false cuando se usa el pooler en transaction mode.
    prepare: false,
  });
}

const sql = globalForDb.natilleraSql ?? createClient();

export const db = globalForDb.natilleraDb ?? drizzle(sql, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDb.natilleraSql = sql;
  globalForDb.natilleraDb = db;
}
