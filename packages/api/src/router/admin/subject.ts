import { router, protectedProcedure } from "../../trpc";
import { z } from "zod";

export const subjectRouter = router({
  listCategoriesWithSubjects: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.subjectCategory.findMany({
      include: {
        subjects: true,
      },
    });
  }),
  updateSubjectCategory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.subjectCategory.update({
        where: {
          id: input.id,
        },
        data: {
          enabled: input.enabled,
        },
      });
    }),
  updateSubject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.subject.update({
        where: {
          id: input.id,
        },
        data: {
          enabled: input.enabled,
        },
      });
    }),
});
