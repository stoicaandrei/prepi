import * as trpc from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@prepi/db";
import { config } from "./env";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = auth();
  return {
    auth: session,
    prisma,
    env: config,
    getCurrentUser: () => currentUser,
    getDbUser: async () => {
      if (!session.userId) {
        throw new Error(
          "User is not authenticated, this should only be called for authenticated users",
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          clerkId: session.userId,
        },
      });

      if (existingUser) {
        return existingUser;
      }

      const newUser = await prisma.user.create({
        data: {
          clerkId: session.userId,
        },
      });

      return newUser;
    },
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
