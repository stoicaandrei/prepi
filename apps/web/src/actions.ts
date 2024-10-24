import { ExamDifficulty, prisma } from "@prepi/db";
import {
  getLessonBySlug,
  listAllLessonsByTags,
  listExamsByDifficulty,
  getExamBySlug,
  getLessonMetadataBySlug,
} from "@prepi/api/handlers";

export const listAllLessonsByTagsAction = async () => {
  return listAllLessonsByTags(prisma);
};

export const getLessonBySlugAction = async (slug: string) => {
  return getLessonBySlug(prisma, slug);
};

export const getLessonMetadataBySlugAction = async (slug: string) => {
  return getLessonMetadataBySlug(prisma, slug);
};

export const listExamsByDifficultyAction = async (
  difficulty: ExamDifficulty,
) => {
  return listExamsByDifficulty(prisma, difficulty);
};

export const getExamBySlugAction = async (slug: string) => {
  return getExamBySlug(prisma, slug);
};
