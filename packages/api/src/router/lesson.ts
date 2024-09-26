import { withCache } from "../cache";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const lessonRouter = router({
  listByTags: publicProcedure.query(async ({ ctx }) => {
    return withCache(
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
      "listByTags"
    );
  }),
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return withCache(
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
      `getBySlug:${input}`
    );
  }),
  // all: publicProcedure.query(({ ctx }) => {
  //   return []
  // }),
  // byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
  //   return ctx.prisma.post.findFirst({ where: { id: input } });
  // }),
  // create: protectedProcedure
  //   .input(z.object({ title: z.string(), content: z.string() }))
  //   .mutation(({ ctx, input }) => {
  //     return ctx.prisma.post.create({ data: input });
  //   }),
});
