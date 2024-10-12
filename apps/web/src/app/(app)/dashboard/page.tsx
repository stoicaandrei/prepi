"use client";

import { MySkillsChart } from "@/components/data/MySkillsChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import {
  CheckSquare,
  MessageCircle,
  BarChart2,
  Zap,
  Book,
  ClipboardList,
  ChartNoAxesCombined,
  PieChart,
} from "lucide-react";
import Head from "next/head";
import { StreaksCard } from "./cards/StreaksCard";
import { PracticeHistoryCard } from "./cards/PracticeHistoryCard";
import { WeeklyActivityCard } from "./cards/WeeklyActivityCard";
import { WeeklyPointsCard } from "./cards/WeeklyPointsCard";
import { useAppContext } from "../appContext";
import Link from "next/link";

export default function Dashboard() {
  const { data: nextChapter } =
    trpc.practice.getRecommendedNextChapters.useQuery();
  const { data: assessmentSession } =
    trpc.assessment.getAssessmentSession.useQuery();
  const initialTestTaken =
    assessmentSession &&
    assessmentSession.totalQuestions === assessmentSession._count.questions;

  const { openInitialAssessmentModal } = useAppContext();

  return (
    <div className="container mx-auto">
      <Head>
        <title>Dashboard | Prepi</title>
      </Head>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-full">
          <p className="text-base font-medium text-[#6e6e6e] p-10">
            Hei, suntem încă în Beta și îmbunătățim continuu platforma. Dacă ai
            idei sau sugestii, ne-ar plăcea să le auzim. 😊
          </p>
        </Card>

        {!initialTestTaken && (
          <Card className="col-span-full relative">
            <CardHeader className="flex flex-row items-center flex-wrap justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold flex items-center">
                <CheckSquare className="mr-2 h-6 w-6 inline-block text-cyan-500" />
                Care îți este nivelul?
              </CardTitle>
              <Button
                variant="default"
                className="shadow-prepi-lg hover:shadow-prepi relative"
                onClick={openInitialAssessmentModal}
              >
                Începe!
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fă testul inițial pentru a stabili planul de pregătire
                individuală.
              </p>
            </CardContent>
            <img
              src="/elements/stopwatch.svg"
              alt=""
              className="h-9 w-9 absolute bottom-0 right-0 translate-y-1/2 sm:bottom-8"
            />
            <img
              src="/elements/hourglass.svg"
              alt=""
              className="h-9 w-9 absolute top-0 left-0 -translate-y-1/2 sm:left-auto sm:right-[120px]"
            />
          </Card>
        )}

        {initialTestTaken && (
          <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center flex-wrap justify-between  pb-2">
              <CardTitle className="text-2xl font-bold flex items-center">
                <ChartNoAxesCombined className="mr-2 h-6 w-6 inline-block text-cyan-500" />
                Nu te opri din exersat!
              </CardTitle>
              <Link href="/practice">
                <Button
                  variant="default"
                  className="bg-cyan-500 hover:bg-cyan-600 flex-shrink "
                >
                  Continuă!
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dă startul pregătirii tale personale. Fă testul inițial și
                descoperă planul creat special pentru tine.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <PieChart className="mr-2 h-6 w-6 inline-block text-cyan-500" />
              Competențele mele
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MySkillsChart />
          </CardContent>
        </Card>

        <PracticeHistoryCard />

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center">
              <Book className="mr-2 h-6 w-6 inline-block text-cyan-500" />
              Lecții de exersat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Inecuații</li>
              <li>Puteri și radicali</li>
              <li>Logaritmul unui număr real pozitiv</li>
            </ul>
          </CardContent>
        </Card>

        <StreaksCard /> */}

        <WeeklyActivityCard />

        <WeeklyPointsCard />
      </div>
    </div>
  );
}
