import { router, adminProcedure } from "../../trpc";
import { z } from "zod";

export const invitationCodeRouter = router({
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        sortBy: z
          .enum(["createdAt", "code", "maxUses", "usesLeft", "validUntil"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, sortBy, sortOrder } = input;
      const user = await ctx.getDbUser();

      const items = await ctx.prisma.invitationCode.findMany({
        where: {
          creatorId: user.id,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
  create: adminProcedure
    .input(
      z.object({
        code: z.string().min(1),
        description: z.string().optional(),
        maxUses: z.number().positive().optional(),
        validUntil: z.date().optional(),
        stripeCoupon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.getDbUser();

      const invitationCode = await ctx.prisma.invitationCode.create({
        data: {
          ...input,
          creatorId: user.id,
          usesLeft: input.maxUses,
        },
      });

      return invitationCode;
    }),
  getById: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.getDbUser();

    const invitationCode = await ctx.prisma.invitationCode.findFirst({
      where: {
        id: input,
        creatorId: user.id,
      },
    });

    if (!invitationCode) {
      throw new Error("Invitation code not found");
    }

    return invitationCode;
  }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().optional(),
        maxUses: z.number().positive().optional(),
        usesLeft: z.number().positive().optional(),
        validUntil: z.date().optional(),
        stripeCoupon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.getDbUser();
      const { id, ...updateData } = input;

      const updatedInvitationCode = await ctx.prisma.invitationCode.updateMany({
        where: {
          id,
          creatorId: user.id,
        },
        data: updateData,
      });

      if (updatedInvitationCode.count === 0) {
        throw new Error(
          "Invitation code not found or you do not have permission to update it",
        );
      }

      return ctx.prisma.invitationCode.findUnique({ where: { id } });
    }),
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const user = await ctx.getDbUser();

    const deletedInvitationCode = await ctx.prisma.invitationCode.deleteMany({
      where: {
        id: input,
        creatorId: user.id,
      },
    });

    if (deletedInvitationCode.count === 0) {
      throw new Error(
        "Invitation code not found or you do not have permission to delete it",
      );
    }

    return { success: true };
  }),
});
