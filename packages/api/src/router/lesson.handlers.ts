import { PrismaClient } from "@prepi/db";

export const listAllLessonsByTags = async (prisma: PrismaClient) => {
  return prisma.subjectCategory.findMany({
    orderBy: {
      order: "asc",
    },
    where: {
      enabled: true,
    },
    select: {
      id: true,
      name: true,
      lessons: {
        orderBy: {
          order: "asc",
        },
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });
};

export const getLessonBySlug = async (prisma: PrismaClient, slug: string) => {
  return prisma.lesson.findFirst({
    where: {
      slug,
    },
    include: {
      legacyContent: {
        select: {
          html: true,
        },
      },
    },
  });
};

export const getLessonMetadataBySlug = async (
  prisma: PrismaClient,
  slug: string,
) => {
  return prisma.lesson.findFirst({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
    },
  });
};
