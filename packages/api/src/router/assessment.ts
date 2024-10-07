import { PrismaClient, Subject } from "@prepi/db";
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
  recordAssessmentQuestion: protectedProcedure
    .input(z.object({ problemId: z.string(), correct: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const { problemId, correct } = input;

      const user = await ctx.getDbUser();
      const userId = user.id;

      let assessmentSession =
        await ctx.prisma.initialAssessmentSession.findUnique({
          where: { userId },
        });

      if (!assessmentSession) {
        assessmentSession = await ctx.prisma.initialAssessmentSession.create({
          data: {
            userId,
          },
        });
      }

      const assessmentQuestion = await ctx.prisma.assessmentQuestion.create({
        data: {
          initialAssessmentSessionId: assessmentSession.id,
          problemId,
          isCorrect: correct,
        },
      });

      const problem = await ctx.prisma.problem.findUnique({
        where: { id: problemId },
        include: {
          subjects: {
            include: {
              prerequisites: true, // Ensure we get prerequisites
            },
          },
        },
      });

      if (!problem) {
        throw new Error("Problem not found");
      }

      // Step 4: Update Mastery Levels for Subjects and Prerequisites
      const subjectsToUpdate = new Set<string>();
      for (const subject of problem.subjects) {
        subjectsToUpdate.add(subject.id);

        // Recursively get prerequisites
        await collectPrerequisites(ctx.prisma, subject, subjectsToUpdate);
      }

      // Update mastery levels
      for (const subjectId of subjectsToUpdate) {
        await ctx.prisma.userSubjectProgress.upsert({
          where: { userId_subjectId: { userId, subjectId } },
          update: { masteryLevel: INITIAL_MASTERY },
          create: {
            userId,
            subjectId,
            masteryLevel: INITIAL_MASTERY,
          },
        });
      }
    }),
});

type ExtendedSubject = Subject & { prerequisites: Subject[] };

async function collectPrerequisites(
  prisma: PrismaClient,
  subject: ExtendedSubject,
  subjectsToUpdate: Set<string>,
) {
  if (!subject.prerequisites || subject.prerequisites.length === 0) {
    return;
  }

  for (const prereq of subject.prerequisites) {
    if (!subjectsToUpdate.has(prereq.id)) {
      subjectsToUpdate.add(prereq.id);

      // Fetch prerequisites of the prerequisite
      const prereqSubject = await prisma.subject.findUnique({
        where: { id: prereq.id },
        include: { prerequisites: true },
      });

      if (prereqSubject) {
        await collectPrerequisites(prisma, prereqSubject, subjectsToUpdate);
      }
    }
  }
}
