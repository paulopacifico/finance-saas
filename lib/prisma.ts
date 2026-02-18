import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing required env var: DATABASE_URL");
  }

  const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaPool = pool;
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, _receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client as object, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as PrismaClient;
