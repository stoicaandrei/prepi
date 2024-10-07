import { prisma } from "@prepi/db";
import { getLessonBySlug, listAllLessonsByTags } from "@prepi/api/handlers";

export const listAllLessonsByTagsAction = async () => {
  return listAllLessonsByTags(prisma);
};

export const getLessonBySlugAction = async (slug: string) => {
  return getLessonBySlug(prisma, slug);
};
