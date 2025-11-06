import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

const withUrl = databaseUrl && databaseUrl.trim().length > 0;

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./migrations",
  dialect: "mysql",
  dbCredentials: withUrl
    ? { url: databaseUrl }
    : {
      host: process.env.MYSQL_HOST ?? "127.0.0.1",
      port: Number.parseInt(process.env.MYSQL_PORT ?? "3306", 10),
      user: process.env.MYSQL_USER ?? "root",
      password: process.env.MYSQL_PASSWORD ?? "",
      database: process.env.MYSQL_DATABASE ?? "scrolltrap",
    },
});
