import { router, publicProcedure, protectedProcedure } from "../trpc";
import { kv } from "@vercel/kv";
import { z } from "zod";
import { useCache } from "../cache";

const CACHE_TTL = 3600; // 1 hour in seconds

export const practiceRouter = router({
  listSubjectsByCategory: publicProcedure.query(async ({ ctx }) => {
    const { getCache, setCache } = useCache("listSubjectsByCategory");

    const cachedData = await getCache();
    if (cachedData) {
      return cachedData;
    }

    const data = await ctx.prisma.subjectCategory.findMany({
      select: {
        id: true,
        name: true,
        subjects: {
          where: {
            problems: {
              some: {}, // This ensures that only subjects with at least one problem are included
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: { problems: true },
            },
          },
        },
      },
    });

    await setCache(data);
    console.log("Data stored in cache");

    return data;
  }),
  listProblemsBySubject: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.problem.findMany({
        where: { subjects: { some: { id: input } } },
        select: {
          id: true,
          type: true,
          description: true,
          multipleChoiceOptions: true,
          singleAnswer: true,
          variables: true,
          hints: true,
          explanation: true,
        },
        take: 5,
      });
    }),
});
