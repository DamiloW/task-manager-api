import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Instância global do Prisma Client.
 * Mantemos uma única instância para reaproveitar o pool de conexões do PostgreSQL
 * e evitar o erro de 'Too many clients' em ambiente de desenvolvimento.
 */
const prisma = new PrismaClient();

export default prisma;
