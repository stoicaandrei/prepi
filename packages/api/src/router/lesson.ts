import { cacheable } from "../cache";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const lessonRouter = router({
  listByTags: publicProcedure.query(async ({ ctx }) => {
    return cacheable(
      () =>
        ctx.prisma.subjectCategory.findMany({
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
        }),
      "listByTags",
    );
  }),
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return cacheable(
      () =>
        ctx.prisma.lesson.findFirst({
          where: {
            slug: input,
          },
          include: {
            legacyContent: {
              select: {
                html: true,
              },
            },
          },
        }),
      `getBySlug:${input}`,
    );
  }),
  getAdjacentLessons: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return cacheable(async () => {
        const currentLesson = await ctx.prisma.lesson.findUnique({
          where: { slug: input },
          include: {
            subjectCategory: true,
          },
        });

        if (!currentLesson) {
          throw new Error("Lesson not found");
        }

        // Get the previous lesson in the same category
        const previousLesson = await ctx.prisma.lesson.findFirst({
          where: {
            subjectCategoryId: currentLesson.subjectCategoryId,
            order: { lt: currentLesson.order },
          },
          orderBy: { order: "desc" },
        });

        // Get the next lesson in the same category
        const nextLesson = await ctx.prisma.lesson.findFirst({
          where: {
            subjectCategoryId: currentLesson.subjectCategoryId,
            order: { gt: currentLesson.order },
          },
          orderBy: { order: "asc" },
        });

        // If there's no previous lesson in the category, look for the last lesson in the previous category
        const previousCategoryLesson = !previousLesson
          ? await ctx.prisma.lesson.findFirst({
              where: {
                subjectCategory: {
                  order: { lt: currentLesson.subjectCategory.order },
                },
              },
              orderBy: [
                { subjectCategory: { order: "desc" } },
                { order: "desc" },
              ],
            })
          : null;

        // If there's no next lesson in the category, look for the first lesson in the next category
        const nextCategoryLesson = !nextLesson
          ? await ctx.prisma.lesson.findFirst({
              where: {
                subjectCategory: {
                  order: { gt: currentLesson.subjectCategory.order },
                },
              },
              orderBy: [
                { subjectCategory: { order: "asc" } },
                { order: "asc" },
              ],
            })
          : null;

        return {
          previous: previousLesson || previousCategoryLesson,
          next: nextLesson || nextCategoryLesson,
        };
      }, `getAdjacentLessons:${input}`);
    }),
});
