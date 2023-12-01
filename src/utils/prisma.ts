import { PrismaClient } from "@prisma/client";

console.log("new prisma client created");
export const prisma = new PrismaClient();
