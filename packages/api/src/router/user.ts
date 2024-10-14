import {
  ExamDifficulty,
  IdealGrade,
  InvitationCode,
  PrismaClient,
} from "@prepi/db";
import { cacheable } from "../cache";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { PostHog } from "posthog-node";

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

      await ctx.prisma.userPreferences.upsert({
        where: {
          userId: user.id,
        },
        update: {
          idealGrade,
          examDifficulty,
        },
        create: {
          userId: user.id,
          idealGrade,
          examDifficulty,
        },
      });

      if (invitationCode) {
        await redeemCode(ctx.prisma, ctx.posthog, invitationCode, user.id);
      }

      ctx.posthog.capture({
        distinctId: user.id,
        event: "user_onboarded_preferences",
        properties: {
          idealGrade,
          examDifficulty,
          $set: {
            idealGrade,
            examDifficulty,
          },
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

const redeemCode = async (
  prisma: PrismaClient,
  posthog: PostHog,
  code: string,
  userId: string,
) => {
  // Remove the last code used by the user
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      redeemedCodes: {
        set: [],
      },
    },
  });

  const invitation = await prisma.invitationCode.findUnique({
    where: {
      code,
    },
  });

  if (!invitation || !isInvitationCodeValid(invitation)) {
    return;
  }

  await prisma.invitationCode.update({
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
    await prisma.invitationCode.update({
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

  posthog.capture({
    distinctId: userId,
    event: "invitation_code_redeemed",
    properties: {
      code,
    },
  });

  if (invitation.isReferral) {
    posthog.capture({
      distinctId: userId,
      event: "user_referred",
      properties: {
        code,
        referredBy: invitation.creatorId,
      },
    });
  }
};
