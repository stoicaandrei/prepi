import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { getExamBySlug, listExamsByDifficulty } from "./exam.handlers";

export const examRouter = router({
  listExams: protectedProcedure
    .input(z.object({ difficulty: z.enum(["M1", "M2", "M3"]) }))
    .query(async ({ ctx, input }) => {
      return cacheable(
        () => listExamsByDifficulty(ctx.prisma, input.difficulty),
        `exam.listExams:${input.difficulty}`,
      );
    }),
  getExamBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return cacheable(
        () => getExamBySlug(ctx.prisma, input),
        `exam.getExamBySlug:${input}`,
      );
    }),
});
