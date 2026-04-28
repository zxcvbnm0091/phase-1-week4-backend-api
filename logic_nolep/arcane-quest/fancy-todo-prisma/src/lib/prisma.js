import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const connectionString = `${process.env.DATABASE_URL}`;
// 1. Create the pg pool first
const pool = new pg.Pool({ connectionString });
// 2. Pass the pool into the adapter
const adapter = new PrismaPg(pool);

const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

const connectDB = async () => {
  try {
    // Note: $connect is technically optional as Prisma connects lazily,
    // but it's good for checking connectivity on startup.
    await prisma.$connect();
    console.log("🟢 DB Connected Via Prisma");
  } catch (error) {
    console.error("🔴 Database connection error: ", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
