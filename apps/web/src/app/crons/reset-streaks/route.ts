import type { NextRequest } from "next/server";
import { prisma } from "@prepi/db";
import dayjs from "dayjs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const intervalStart = dayjs().subtract(3, "day").startOf("day").toDate();
  const intervalEnd = dayjs().subtract(2, "day").startOf("day").toDate();

  console.log(
    `Resetting streaks for users who were last active between ${intervalStart} and ${intervalEnd}`,
  );

  await prisma.user.updateMany({
    where: {
      lastActiveDate: {
        gte: intervalStart,
        lt: intervalEnd,
      },
    },
    data: {
      currentStreak: 0,
    },
  });

  return Response.json({ success: true });
}
