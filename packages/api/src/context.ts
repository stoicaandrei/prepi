import * as trpc from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@prepi/db";
import { config } from "./env";
import Stripe from "stripe";
import { PostHog } from "posthog-node";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = auth();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: "https://eu.i.posthog.com",
  });

  return {
    auth: session,
    prisma,
    env: config,
    currentUser,
    stripe,
    posthog,
    getDbUser: async () => {
      if (!session.userId) {
        throw new Error(
          "User is not authenticated, this should only be called for authenticated users",
        );
      }

      const clerkId = session.userId;

      const existingUser = await prisma.user.findUnique({
        where: {
          clerkId,
        },
      });

      if (existingUser) {
        return existingUser;
      }

      const newUser = await prisma.user.create({
        data: {
          clerkId,
        },
      });

      posthog.capture({
        distinctId: newUser.id,
        event: "user_created",
      });

      posthog.alias({
        distinctId: newUser.id,
        alias: clerkId,
      });

      return newUser;
    },
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
