import { PrismaClient } from '@prisma/client'

// Use a global variable to save the Prisma instance across hot-reloads
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // This helps you see what's happening in the terminal
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Re-export everything from Prisma Client so your other apps 
// can import types like 'User' or 'Trip' directly from @matche/db
export * from '@prisma/client'