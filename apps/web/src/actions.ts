import { prisma } from "@prepi/db";
import { listAllLessonsByTags } from "@prepi/api/handlers";

export const listAllLessonsByTagsAction = async () => {
  return listAllLessonsByTags(prisma);
};
