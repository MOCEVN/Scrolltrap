import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Missing required env: DATABASE_URL');
  return url;
}

function createPool() {
  const connectionString = getDatabaseUrl();
  
  return new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false }
      : false,
    max: process.env.PG_POOL_MAX ? Number(process.env.PG_POOL_MAX) : 10,
  });
}

export function getPool() {
  if (!global.pgPool) global.pgPool = createPool();
  return global.pgPool;
}

export function getDb() {
  if (!global.drizzleDb) global.drizzleDb = drizzle(getPool());
  return global.drizzleDb;
}

export const db = getDb();