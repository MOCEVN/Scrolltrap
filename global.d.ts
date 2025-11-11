import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Pool } from "mysql2/promise";

declare global {
  var mysqlPool: Pool | undefined;
  var drizzleDb: MySql2Database | undefined;
}

export { };

declare module "*.css";
declare module "*.scss";
declare module "*.sass";
