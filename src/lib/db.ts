// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Extend global object to store Prisma instance
declare global {

  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Logs all queries to console (optional)
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
