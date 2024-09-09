import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const lessonRouter = router({
  listByTags: publicProcedure.query(({ ctx }) => {
    // TODO: Add sorting by tag order and lesson order
    return ctx.prisma.tag.findMany({
      where: {
        parentId: null // This ensures we only get top-level tags
      },
      select: {
        id: true,
        name: true,
        lessons: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.lesson.findFirst({
      where: {
        slug: input
      }
    })
  })
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
