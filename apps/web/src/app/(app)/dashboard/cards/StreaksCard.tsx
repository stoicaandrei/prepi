"use client";

import { MySkillsChart } from "@/components/data/MySkillsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { pluralize } from "@prepi/utils";
import {
  CheckSquare,
  MessageCircle,
  BarChart2,
  Zap,
  Book,
  ClipboardList,
} from "lucide-react";
import Head from "next/head";

export const StreaksCard = () => {
  const { data: userDetails } = trpc.user.userDetails.useQuery();

  const streak = userDetails?.currentStreak ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          <Zap className="mr-2 h-6 w-6 inline-block text-cyan-500" />
          Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          Exersează zilnic și primește bonusuri!
        </p>
        <p className="text-4xl font-bold text-center transition-all">
          {streak} {pluralize("zile", streak)}
        </p>
      </CardContent>
    </Card>
  );
};
