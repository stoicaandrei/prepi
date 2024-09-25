import { useCache } from "../cache";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const lessonRouter = router({
  listByTags: publicProcedure.query(async ({ ctx }) => {
    const { getCache, setCache } = useCache("listByTags");

    type Resp = {
      id: string;
      name: string;
      lessons: {
        title: string;
        slug: string;
      }[];
    }[];

    const cachedData = await getCache();
    if (cachedData) {
      return cachedData as Resp;
    }

    const data: Resp = await ctx.prisma.subjectCategory.findMany({
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

    await setCache(data);

    return data;
  }),
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { getCache, setCache } = useCache(`lesson:${input}`);

    type Resp = {
      id: string;
      title: string;
      slug: string;
      legacyContent: {
        html: string;
      } | null;
    } | null;

    const cachedData = await getCache();
    if (cachedData) {
      return cachedData as Resp;
    }

    const data: Resp = await ctx.prisma.lesson.findFirst({
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
    });

    await setCache(data);

    return data;
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
