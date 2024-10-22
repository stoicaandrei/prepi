import { ExamDifficulty, PrismaClient } from "@prepi/db";

export const listExamsByDifficulty = async (
  prisma: PrismaClient,
  difficulty: ExamDifficulty,
) => {
  return prisma.exam.findMany({
    where: {
      difficulty,
    },
    orderBy: {
      slug: "asc",
    },
  });
};

export const getExamBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.exam.findFirst({
    where: {
      slug,
    },
    include: {
      problems: {
        include: {
          officialSolutionSteps: true,
        },
      },
    },
  });
};
