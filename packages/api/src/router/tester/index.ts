import { router, testerProcedure } from "../../trpc";
import { z } from "zod";

export const testerRouter = router({
  resetInitialAssessmentSession: testerProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.getDbUser();

    await ctx.prisma.assessmentQuestion.deleteMany({
      where: {
        initialAssessmentSession: {
          userId: user.id,
        },
      },
    });

    await ctx.prisma.initialAssessmentSession.delete({
      where: {
        userId: user.id,
      },
    });
  }),
  resetSubjectProgress: testerProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.getDbUser();

    await ctx.prisma.completedProblem.deleteMany({
      where: {
        userSubjectProgress: {
          userId: user.id,
        },
      },
    });

    await ctx.prisma.userSubjectProgress.deleteMany({
      where: {
        userId: user.id,
      },
    });
  }),
  randomizeSubjectProgress: testerProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.getDbUser();

    const userSubjectProgress = await ctx.prisma.userSubjectProgress.findMany({
      where: {
        userId: user.id,
      },
    });

    for (const progress of userSubjectProgress) {
      await ctx.prisma.completedProblem.deleteMany({
        where: {
          userSubjectProgressId: progress.id,
        },
      });
    }

    await ctx.prisma.userSubjectProgress.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const subjects = await ctx.prisma.subject.findMany({
      where: {
        enabled: true,
      },
    });

    console.log("Randomizing subject progress for user", user.id);
    console.log("Subjects", subjects);

    for (const subject of subjects) {
      await ctx.prisma.userSubjectProgress.create({
        data: {
          userId: user.id,
          subjectId: subject.id,
          masteryLevel: Math.random(),
        },
      });
    }
  }),
});
