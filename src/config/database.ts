import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// We add the prisma instance to the Node.js global object
// This ensures type safety for the globalThis.prisma variable
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Global Prisma Client instance.
 * We implement the Singleton pattern using globalThis to reuse the PostgreSQL 
 * connection pool and prevent "Too many clients" errors during dev hot-reloading.
 */
const prisma = globalThis.prismaGlobal ?? new PrismaClient();

// In development, we attach the instance to the global object so it survives hot reloads.
// In production, we don't need this because the server doesn't hot reload.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;