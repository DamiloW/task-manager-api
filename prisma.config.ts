import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma ORM centralized configuration
// Ensures Prisma maps the correct paths for schemas and migrations, especially inside Docker environments
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});