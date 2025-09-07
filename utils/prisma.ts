import { PrismaClient } from "../prisma/client/index";

/** @type {PrismaClient} */
let prisma: PrismaClient;

declare global {
  var __globalPrisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  if (!global.__globalPrisma) {
    global.__globalPrisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }
  prisma = global.__globalPrisma;
}

// Initialize connection immediately
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (e) {
    console.error('❌ Failed to connect to database:', e.message);
    // Don't throw here, let individual queries handle connection errors
  }
})();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
