import { ExamDifficulty, IdealGrade } from "@prepi/db";
import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

export const userRouter = router({
  userDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.getDbUser();

    return {
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
    };
  }),
  onboardPreferences: protectedProcedure
    .input(
      z.object({
        idealGrade: z.enum(["SIX", "EIGHT", "TEN"]),
        examDifficulty: z.enum(["M1", "M2", "M3"]),
        invitationCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { idealGrade, examDifficulty, invitationCode } = input;

      const user = await ctx.getDbUser();

      await ctx.prisma.userPreferences.create({
        data: {
          idealGrade,
          examDifficulty,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      if (invitationCode) {
        const invitation = await ctx.prisma.invitationCode.findUnique({
          where: {
            code: invitationCode,
          },
        });

        // TODO: Check if invitation is valid

        await ctx.prisma.invitationCode.update({
          where: {
            code: invitationCode,
          },
          data: {
            redeemedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      }

      await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: {
          preferencesSet: true,
        },
      });
    }),
});
