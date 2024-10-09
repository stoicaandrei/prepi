import { ExamDifficulty, IdealGrade, InvitationCode } from "@prepi/db";
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
  checkInvitationCode: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.prisma.invitationCode.findUnique({
        where: {
          code: input,
        },
      });

      if (!invitation) {
        return {
          success: false,
          message: "Codul nu există.",
        };
      }

      const isValid = await isInvitationCodeValid(invitation);

      if (!isValid) {
        return {
          success: false,
          message: "Codul nu este valid.",
        };
      }

      return {
        success: true,
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
        await redeemCode(ctx, invitationCode, user.id);
      }

      await clerkClient().users.updateUserMetadata(user.clerkId, {
        publicMetadata: {
          preferencesSet: true,
        },
      });
    }),
});

const isInvitationCodeValid = async (invitationCode: InvitationCode) => {
  const { usesLeft, validUntil } = invitationCode;

  if (validUntil) {
    const overdue = new Date() > validUntil;
    if (overdue) {
      return false;
    }
  }

  if (usesLeft && usesLeft <= 0) {
    return false;
  }

  return true;
};

const redeemCode = async (ctx: any, code: string, userId: string) => {
  const invitation = await ctx.prisma.invitationCode.findUnique({
    where: {
      code,
    },
  });

  if (!invitation || !isInvitationCodeValid(invitation)) {
    return;
  }

  await ctx.prisma.invitationCode.update({
    where: {
      code,
    },
    data: {
      redeemedBy: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (invitation.usesLeft) {
    await ctx.prisma.invitationCode.update({
      where: {
        code,
      },
      data: {
        usesLeft: {
          decrement: 1,
        },
      },
    });
  }
};
