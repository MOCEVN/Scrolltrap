import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Missing required env: DATABASE_URL');
  return url;
}

function createPool() {
  return new Pool({
    connectionString: getDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
    max: 10,
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
