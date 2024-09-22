import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const practiceRouter = router({
  listSubjectsByCategory: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subjectCategory.findMany({
      select: {
        id: true,
        name: true,
        subjects: {
          // TODO: remove this dumb filter
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
    });
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
          variables: true,
          hints: true,
          explanation: true,
        },
        take: 5,
      });
    }),
});
