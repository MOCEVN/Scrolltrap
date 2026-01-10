import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

const withUrl = databaseUrl && databaseUrl.trim().length > 0;

export default defineConfig({
	schema: "./lib/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: withUrl
		? { url: databaseUrl }
		: {
				host: process.env.POSTGRES_HOST ?? "127.0.0.1",
				port: Number.parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
				user: process.env.POSTGRES_USER ?? "postgres",
				password: process.env.POSTGRES_PASSWORD ?? "",
				database: process.env.POSTGRES_DB ?? "scrolltrap",
			},
});
