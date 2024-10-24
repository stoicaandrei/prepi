import { PrismaClient, Subject } from "@prepi/db";
import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

const MAX_QUESTIONS = 15;
const INITIAL_MASTERY = 0.5; // Starting mastery level

export const assessmentRouter = router({
  getAssessmentSession: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.getDbUser();
    const userId = user.id;

    const assessmentSession =
      await ctx.prisma.initialAssessmentSession.findUnique({
        where: { userId },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

    return assessmentSession;
  }),
  getNextProblem: protectedProcedure.query(async ({ ctx }) => {
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

    const questionsCount = await ctx.prisma.assessmentQuestion.count({
      where: { initialAssessmentSessionId: assessmentSession?.id },
    });

    if (questionsCount >= MAX_QUESTIONS) {
      // Assessment is complete
      return null;
    }

    // Step 1: Fetch unassessed subjects
    let subjectsPool = await ctx.prisma.subject.findMany({
      where: {
        enabled: true,
        usersProgress: {
          none: {
            userId: userId,
          },
        },
        problems: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (subjectsPool.length === 0) {
      // All subjects have been assessed
      subjectsPool = await ctx.prisma.subject.findMany({
        where: {
          enabled: true,
          problems: {
            some: {},
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    }

    // Step 2: Randomly select one of the unassessed subjects
    const randomSubjectIndex = Math.floor(Math.random() * subjectsPool.length);
    const selectedSubject = subjectsPool[randomSubjectIndex];

    // Step 3: Fetch problems from the selected subject
    let problems = await ctx.prisma.problem.findMany({
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
      },
    });

    // In case something happened with the subject selected problem
    if (problems.length === 0) {
      const problemsCount = await ctx.prisma.problem.count();
      const randomProblemId = Math.floor(Math.random() * problemsCount);
      const randomProblem = await ctx.prisma.problem.findFirst({
        skip: randomProblemId,
        select: {
          id: true,
          description: true,
          type: true,
        },
      });

      if (randomProblem) problems = [randomProblem];
    }

    // Step 4: Randomly select a problem from the selected subject
    const randomProblemIndex = Math.floor(Math.random() * problems.length);
    let selectedProblem = problems[randomProblemIndex];

    if (!selectedProblem) {
      // Get a random problem from database

      throw new Error("No problems found");
    }

    const completeProblem = ctx.prisma.problem.findUnique({
      where: { id: selectedProblem.id },
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

    ctx.posthog.capture({
      distinctId: userId,
      event: "initial_assessment_next_problem",
      properties: {
        problemId: selectedProblem.id,
        problemCount: questionsCount + 1,
      },
    });

    await ctx.posthog.shutdown();

    // Return the selected problem and subject information
    return completeProblem;
  }),
  recordAssessmentQuestion: protectedProcedure
    .input(z.object({ problemId: z.string(), correct: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
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

      const masterySign = correct ? 1 : -1;
      const masteryToAdd = (INITIAL_MASTERY / 2) * masterySign;
      const initialMastery = correct ? INITIAL_MASTERY : 0;

      // Update mastery levels
      for (const subjectId of subjectsToUpdate) {
        const progress = await ctx.prisma.userSubjectProgress.upsert({
          where: { userId_subjectId: { userId, subjectId } },
          update: { masteryLevel: { increment: masteryToAdd } },
          create: {
            userId,
            subjectId,
            masteryLevel: initialMastery,
          },
        });

        if (progress.masteryLevel > 1) {
          // Fix mastery level
          await ctx.prisma.userSubjectProgress.update({
            where: { userId_subjectId: { userId, subjectId } },
            data: { masteryLevel: 1 },
          });
        }
      }

      // TODO: Give user points

      ctx.posthog.capture({
        distinctId: userId,
        event: "initial_assessment_question_answered",
        properties: {
          correct,
          problemId,
        },
      });

      await ctx.posthog.shutdown();
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
