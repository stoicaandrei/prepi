import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { withCache } from "../cache";

export const practiceRouter = router({
  listSubjectsByCategory: publicProcedure.query(async ({ ctx }) => {
    return withCache(
      () =>
        ctx.prisma.subjectCategory.findMany({
          select: {
            id: true,
            name: true,
            subjects: {
              where: {
                problems: {
                  some: {}, // This ensures that only subjects with at least one problem are included
                },
              },
              select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                  select: { problems: true },
                },
              },
            },
          },
        }),
      "listSubjectsByCategory"
    );
  }),
  listProblemsBySubject: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.problem.findMany({
        where: { subjects: { some: { id: input } } },
        select: {
          id: true,
          type: true,
          description: true,
          multipleChoiceOptions: true,
          singleAnswer: true,
          mathSymbolButtons: true,
          variables: true,
          hints: true,
          explanation: true,
        },
        take: 5,
      });
    }),
});
