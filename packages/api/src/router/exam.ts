import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const examRouter = router({
  listExams: protectedProcedure
    .input(z.object({ difficulty: z.enum(["M1", "M2", "M3"]) }))
    .query(async ({ ctx, input }) => {
      return cacheable(
        () =>
          ctx.prisma.exam.findMany({
            where: {
              difficulty: input.difficulty,
            },
            orderBy: {
              slug: "asc",
            },
          }),
        `listExams:${input.difficulty}`,
      );
    }),
  getExamBySlug: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return cacheable(
        () =>
          ctx.prisma.exam.findFirst({
            where: {
              slug: input,
            },
            include: {
              sub1Problems: {
                orderBy: {
                  order: "asc",
                },
              },
              sub2Problems: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  subA: true,
                  subB: true,
                  subC: true,
                },
              },
              sub3Problems: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  subA: true,
                  subB: true,
                  subC: true,
                },
              },
            },
          }),
        `getExamBySlug:${input}`,
      );
    }),
});
