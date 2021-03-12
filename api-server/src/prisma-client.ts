import { PrismaClient } from '@prisma/client';

/**
 * Importing prisma from this file will always return 
 * the same instance. The first time this file is imported
 * the value of prisma will be cached, so subsequents imports
 * will have the same prisma instace. In case of hot reload, 
 * like those that happen in development mode, a prisma instance is
 * set to a global variable to avoid generate a new instance.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient
    }
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error', 'warn']
    });
    console.info('An instance of Prisma Client was generated.');
  }

  prisma = global.prisma;
}

export default prisma;