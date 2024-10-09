import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import superjson from "superjson";
import { UserRoles } from "./globals";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next();
});

const hasRole = (role: UserRoles) =>
  t.middleware(({ next, ctx }) => {
    const userRoles = ctx.auth.sessionClaims?.metadata?.roles;
    if (!userRoles?.includes(role)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
    }

    return next();
  });

const delayedProcedure = t.procedure.use(async ({ next }) => {
  if (process.env.NODE_ENV !== "development") return next();

  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
  return next();
});

export const router = t.router;
export const publicProcedure = delayedProcedure;
export const protectedProcedure = publicProcedure.use(isAuthed);
export const adminProcedure = protectedProcedure.use(hasRole("admin"));
export const testerProcedure = protectedProcedure.use(hasRole("tester"));
