import type { NextRequest } from "next/server";
import { prisma } from "@prepi/db";
import dayjs from "dayjs";

export function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  prisma.user.updateMany({
    where: {
      lastActiveDate: {
        // 2 days ago
        gte: dayjs().subtract(3, "day").startOf("day").toDate(),
        lt: dayjs().subtract(2, "day").startOf("day").toDate(),
      },
    },
    data: {
      currentStreak: 0,
    },
  });

  return Response.json({ success: true });
}
