import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@prepi/db";
import { config } from "./env";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  return { auth: getAuth(opts.req), prisma, env: config };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
