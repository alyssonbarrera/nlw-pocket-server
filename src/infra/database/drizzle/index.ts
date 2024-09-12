import postgres from "postgres";
import { env } from "@/infra/env";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schemas from "./schemas";

export const drizzleClient = postgres(env.DATABASE_URL);
export const drizzleDb = drizzle(drizzleClient, {
  schema: schemas,
  logger: true,
});
