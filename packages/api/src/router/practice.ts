import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const practiceRouter = router({
  listSubjectsByCategory: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.subjectCategory.findMany({
      select: {
        id: true,
        name: true,
        subjects: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }),
});
