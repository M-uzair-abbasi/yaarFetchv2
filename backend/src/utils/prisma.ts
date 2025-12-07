import { PrismaClient } from '@prisma/client';

// Lazy initialization - only create PrismaClient when actually used
// This prevents connection attempts when DATABASE_URL is missing
let prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (!prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Please configure it in Vercel environment variables.');
    }
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
}

// Export a proxy that lazily initializes Prisma
// This maintains backward compatibility with existing imports
const prismaProxy = new Proxy({} as PrismaClient, {
  get(target, prop) {
    return getPrisma()[prop as keyof PrismaClient];
  }
});

export default prismaProxy;
