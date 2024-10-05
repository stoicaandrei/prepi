import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { cacheable } from "../cache";
import {
  MathSymbolButton,
  MultipleChoiceOption,
  Problem,
  ProblemExplanation,
  ProblemHint,
  ProblemVariable,
  SingleAnswer,
  User,
  PrismaClient,
} from "@prepi/db";
import dayjs from "dayjs";

export const practiceRouter = router({
  listSubjectsByCategory: protectedProcedure.query(async ({ ctx }) => {
    return cacheable(
      () =>
        ctx.prisma.subjectCategory.findMany({
          orderBy: {
            order: "asc",
          },
          where: {
            enabled: true,
          },
          select: {
            id: true,
            name: true,
            subjects: {
              orderBy: {
                order: "asc",
              },
              where: {
                enabled: true,
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
      "listSubjectsByCategory",
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
        masteryLevel: true,
      },
    });
  }),
  getProblemById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.problem.findFirst({
        where: {
          id: input,
        },
        select: {
          id: true,
          type: true,
          description: true,
          multipleChoiceOptions: true,
          singleAnswer: true,
          mathSymbolButtons: true,
          variables: true,
          hints: {
            orderBy: {
              order: "asc",
            },
          },
          explanation: true,
        },
      });
    }),
  // Turns out fetching random object from postgres is not as easy as it seems
  // This is some complicated code that fetches 5 random problems from a subject
  // Should be refactored to be more readable later
  listProblemsBySubject: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const PROBLEMS_PER_SUBJECT = 5;

      const user = await ctx.getDbUser();
      const subjectProgress = await ctx.prisma.userSubjectProgress.findFirst({
        where: {
          userId: user.id,
          subjectId: input,
        },
      });

      type ExtendedProblem = Omit<
        Problem,
        | "legacyId"
        | "createdAt"
        | "updatedAt"
        | "source"
        | "difficulty"
        | "problemExplanationId"
      > & {
        multipleChoiceOptions: MultipleChoiceOption[];
        singleAnswer: SingleAnswer | null;
        mathSymbolButtons: MathSymbolButton[];
        variables: ProblemVariable[];
        hints: ProblemHint[];
        explanation: ProblemExplanation;
      };

      const incompleteProblemsCount = await ctx.prisma.problem.count({
        where: {
          subjects: { some: { id: input } },
          NOT: {
            CompletedProblem: {
              some: {
                userSubjectProgressId: subjectProgress?.id,
              },
            },
          },
        },
      });

      const problems: ExtendedProblem[] = [];

      const incompleteSkips: number[] = [];
      for (let i = 0; i < PROBLEMS_PER_SUBJECT; i += 1) {
        if (incompleteProblemsCount === incompleteSkips.length) {
          break;
        }

        let skip = Math.floor(Math.random() * incompleteProblemsCount);
        while (incompleteSkips.includes(skip)) {
          skip = Math.floor(Math.random() * incompleteProblemsCount);
        }
        incompleteSkips.push(skip);

        const problem = await ctx.prisma.problem.findFirst({
          where: {
            subjects: { some: { id: input } },
            NOT: {
              CompletedProblem: {
                some: {
                  userSubjectProgressId: subjectProgress?.id,
                },
              },
            },
          },
          select: {
            id: true,
            type: true,
            description: true,
            multipleChoiceOptions: true,
            singleAnswer: true,
            mathSymbolButtons: true,
            variables: true,
            hints: {
              orderBy: {
                order: "asc",
              },
            },
            explanation: true,
          },
          skip,
          take: 1,
        });
        if (problem) {
          problems.push(problem);
        }
      }

      if (problems.length === PROBLEMS_PER_SUBJECT) {
        return problems;
      }

      const completedProblemsCount = await ctx.prisma.problem.count({
        where: {
          subjects: { some: { id: input } },
          CompletedProblem: {
            some: {
              userSubjectProgressId: subjectProgress?.id,
            },
          },
        },
      });

      const completedSkips: number[] = [];
      for (let i = 0; i < PROBLEMS_PER_SUBJECT - problems.length; i++) {
        if (completedProblemsCount === completedSkips.length) {
          break;
        }

        let skip = Math.floor(Math.random() * completedProblemsCount);
        while (completedSkips.includes(skip)) {
          skip = Math.floor(Math.random() * completedProblemsCount);
        }
        completedSkips.push(skip);

        const problem = await ctx.prisma.problem.findFirst({
          where: {
            subjects: { some: { id: input } },
            CompletedProblem: {
              some: {
                userSubjectProgressId: subjectProgress?.id,
              },
            },
          },
          select: {
            id: true,
            type: true,
            description: true,
            multipleChoiceOptions: true,
            singleAnswer: true,
            mathSymbolButtons: true,
            variables: true,
            hints: {
              orderBy: {
                order: "asc",
              },
            },
            explanation: true,
          },
          skip,
          take: 1,
        });
        if (problem) {
          problems.push(problem);
        }
      }

      return problems;
    }),
  recordPracticeSession: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
        problems: z.array(
          z.object({
            problemId: z.string(),
            correct: z.boolean(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.getDbUser();

      if (!user) return;

      const correctProblems = input.problems.filter(
        (problem) => problem.correct,
      );
      const correctProblemIds = correctProblems.map(
        (problem) => problem.problemId,
      );
      const pointsEarned = calculatePoints(
        correctProblems.length,
        user.currentStreak,
      );

      const correctCount = correctProblems.length;
      const totalCount = input.problems.length;

      const performanceScore = totalCount > 0 ? correctCount / totalCount : 0;

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

      const LEARNING_RATE = 0.2;
      const MINIMUM_MASTERY = 0.1;
      const MAXIMUM_MASTERY = 1;

      const previousMastery = userSubjectProgress.masteryLevel;
      const newMastery =
        previousMastery + LEARNING_RATE * (performanceScore - previousMastery);

      const updatedMasteryLevel = Math.max(
        MINIMUM_MASTERY,
        Math.min(newMastery, MAXIMUM_MASTERY),
      );

      await ctx.prisma.userSubjectProgress.update({
        where: { id: userSubjectProgress.id },
        data: { masteryLevel: updatedMasteryLevel },
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
          }),
        ),
      );

      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          totalPoints: {
            increment: pointsEarned,
          },
        },
      });

      await updateUserStreak(ctx.prisma, user);

      await ctx.prisma.practiceSession.create({
        data: {
          userId: user.id,
          subjectId: input.subjectId,
          score: pointsEarned,
          pointsEarned,
          performanceScore,
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
  listPracticeHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          startDate: z.date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.getDbUser();

      return ctx.prisma.practiceSession.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: input?.startDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input?.limit,
        select: {
          id: true,
          subject: {
            select: {
              name: true,
            },
          },
          score: true,
          problems: true,
          createdAt: true,
        },
      });
    }),
});

const updateUserStreak = async (prisma: PrismaClient, user: User) => {
  if (!user.lastActiveDate || user.lastActiveDate < new Date()) {
    const daysDiff = dayjs().diff(user.lastActiveDate, "days");

    if (daysDiff < 1) return;

    let currentStreak = user.currentStreak;
    let longestStreak = user.longestStreak;

    if (dayjs().diff(user.lastActiveDate, "days") === 1) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        currentStreak,
        longestStreak,
        lastActiveDate: new Date(),
      },
    });
  }
};

const calculatePoints = (basePoints: number, currentStreak: number) => {
  const streakMultiplier = 1; // 10% increase per streak day
  const maxStreakBonus = 10; // Maximum 200% bonus

  const streakBonus = Math.min(
    streakMultiplier * currentStreak,
    maxStreakBonus,
  );
  const points = Math.round(basePoints * (1 + streakBonus));

  return points;
};
