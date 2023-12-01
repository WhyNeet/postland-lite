import { PrismaClient } from "@prisma/client";

console.trace("new prisma client created");
export const prisma = new PrismaClient();
