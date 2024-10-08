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
});
