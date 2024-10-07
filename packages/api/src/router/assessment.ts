import { PrismaClient } from "@prepi/db";
import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

const MAX_QUESTIONS = 15;
const INITIAL_MASTERY = 0.5; // Starting mastery level

export const assessmentRouter = router({
  getNextProblem: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.getDbUser();
    const userId = user.id;

    const unassessedSubjects = await ctx.prisma.subject.findMany({
      where: {
        enabled: true,
        usersProgress: {
          none: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (unassessedSubjects.length === 0) {
      // All subjects have been assessed
      return null;
    }

    // Step 2: Randomly select one of the unassessed subjects
    const randomSubjectIndex = Math.floor(
      Math.random() * unassessedSubjects.length,
    );
    const selectedSubject = unassessedSubjects[randomSubjectIndex];

    // Step 3: Fetch problems from the selected subject
    const problems = await ctx.prisma.problem.findMany({
      where: {
        subjects: {
          some: {
            id: selectedSubject.id,
          },
        },
      },
      select: {
        id: true,
        description: true,
        type: true,
        // Include other necessary fields
      },
    });

    if (problems.length === 0) {
      // No problems in the selected subject
      // Optionally, you can remove this subject from the unassessedSubjects list and retry
      return null;
    }

    // Step 4: Randomly select a problem from the selected subject
    const randomProblemIndex = Math.floor(Math.random() * problems.length);
    const selectedProblem = problems[randomProblemIndex];

    // Return the selected problem and subject information
    return {
      subject: selectedSubject,
      problem: selectedProblem,
    };
  }),
});
