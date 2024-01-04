import { type Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/database/schema.ts",
  out: "./migrations",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  verbose: true,
} satisfies Config;
