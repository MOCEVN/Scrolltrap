import 'dotenv/config';
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DEFAULT_PORT = 3306;
const DEFAULT_CONNECTION_LIMIT = 10;

type BaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: { rejectUnauthorized: boolean };
};

function parseDatabaseUrl(raw: string): BaseConfig {
  const url = new URL(raw);
  const db = url.pathname?.slice(1);
  if (!db) throw new Error("DATABASE_URL must include a database name (e.g. mysql://user:pass@host:3306/dbname)");
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : DEFAULT_PORT,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: db,
  };
}

function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function buildConfig(): BaseConfig {
  if (process.env.DATABASE_URL) return parseDatabaseUrl(process.env.DATABASE_URL);
  const host = envOrThrow("MYSQL_HOST");
  const user = envOrThrow("MYSQL_USER");
  const database = envOrThrow("MYSQL_DATABASE");
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : DEFAULT_PORT;
  const password = process.env.MYSQL_PASSWORD || "";
  const ssl = process.env.MYSQL_SSL === "1" ? { rejectUnauthorized: false } : undefined;
  return { host, port, user, password, database, ssl };
}

function createPool() {
  const cfg = buildConfig();
  return mysql.createPool({
    ...cfg,
    waitForConnections: true,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT ? Number(process.env.MYSQL_CONNECTION_LIMIT) : DEFAULT_CONNECTION_LIMIT,
    queueLimit: 0,
    namedPlaceholders: true,
  });
}

export function getPool() {
  if (!global.mysqlPool) global.mysqlPool = createPool();
  return global.mysqlPool;
}

export function getDb() {
  if (!global.drizzleDb) global.drizzleDb = drizzle(getPool());
  return global.drizzleDb;
}

export type Database = MySql2Database;
