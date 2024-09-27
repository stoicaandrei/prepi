import { cacheable } from "../cache";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  userDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.getDbUser();

    return {
      totalPoints: user.totalPoints,
    };
  }),
});
