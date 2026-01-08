import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';

declare global {
  var pgPool: Pool | undefined;
  var drizzleDb: NodePgDatabase | undefined;
}

export {};

declare module '*.css';
declare module '*.scss';
declare module '*.sass';
