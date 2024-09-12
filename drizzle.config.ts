import { env } from "@/infra/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infra/database/drizzle/schemas",
  out: "./.drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
