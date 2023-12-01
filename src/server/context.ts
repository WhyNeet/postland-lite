import { prisma } from "@/utils/prisma";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerSession(req, res, authOptions);

  return { session, prisma };
};
