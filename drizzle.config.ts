import "dotenv";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: `${process.env.DATABASE_URL}`,
  },
  verbose: true,
  strict: true,
});