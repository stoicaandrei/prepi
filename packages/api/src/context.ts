import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@prepi/db";
import { config } from "./env";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const auth = getAuth(opts.req);
  return {
    auth,
    prisma,
    env: config,
    getDbUser: async () => {
      if (!auth.userId) {
        throw new Error(
          "User is not authenticated, this should only be called for authenticated users"
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          clerkId: auth.userId,
        },
      });

      if (existingUser) {
        return existingUser;
      }

      const newUser = await prisma.user.create({
        data: {
          clerkId: auth.userId,
        },
      });

      return newUser;
    },
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
