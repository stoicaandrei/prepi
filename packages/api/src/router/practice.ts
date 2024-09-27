import { router, publicProcedure, protectedProcedure } from "../trpc";
import { record, z } from "zod";
import { cacheable } from "../cache";

export const practiceRouter = router({
  listSubjectsByCategory: publicProcedure.query(async ({ ctx }) => {
    return cacheable(
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
  listSubjectsProgress: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.getDbUser();

    return ctx.prisma.userSubjectProgress.findMany({
      where: {
        userId: user.id,
      },
      select: {
        subjectId: true,
        _count: {
          select: { completedProblems: true },
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
          mathSymbolButtons: true,
          variables: true,
          hints: true,
          explanation: true,
        },
        take: 5,
      });
    }),
  recordPracticeSession: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
        problems: z.array(
          z.object({
            problemId: z.string(),
            correct: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.getDbUser();

      const correctProblems = input.problems.filter(
        (problem) => problem.correct
      );
      const correctProblemIds = correctProblems.map(
        (problem) => problem.problemId
      );
      const pointsEarned = correctProblems.length;

      const userSubjectProgress = await ctx.prisma.userSubjectProgress.upsert({
        where: {
          userId_subjectId: {
            userId: user.id,
            subjectId: input.subjectId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          subjectId: input.subjectId,
        },
      });

      await ctx.prisma.$transaction(
        correctProblemIds.map((problemId) =>
          ctx.prisma.completedProblem.upsert({
            where: {
              userSubjectProgressId_problemId: {
                userSubjectProgressId: userSubjectProgress.id,
                problemId,
              },
            },
            create: {
              problemId,
              userSubjectProgressId: userSubjectProgress.id,
            },
            update: {},
          })
        )
      );

      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          totalPoints: {
            increment: pointsEarned,
          },
        },
      });

      await ctx.prisma.practiceSession.create({
        data: {
          userId: user.id,
          subjectId: input.subjectId,
          score: pointsEarned,
          pointsEarned,
          problems: {
            create: input.problems.map((problem) => ({
              problemId: problem.problemId,
              isCorrect: problem.correct,
            })),
          },
        },
      });

      return { pointsEarned };
    }),
});
