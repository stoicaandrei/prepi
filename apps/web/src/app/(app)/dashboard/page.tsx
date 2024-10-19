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
import Image from "next/image";
import { Crisp } from "crisp-sdk-web";
import dayjs from "dayjs";

export default function Dashboard() {
  const { data: nextChapter } =
    trpc.practice.getRecommendedNextChapters.useQuery();
  const { data: assessmentSession } =
    trpc.assessment.getAssessmentSession.useQuery();
  const initialTestTaken =
    assessmentSession &&
    assessmentSession.totalQuestions === assessmentSession._count.questions;

  const { data: subscription } = trpc.stripe.getSubscriptionDetails.useQuery();
  const subscriptionDaysLeft = dayjs(subscription?.trialEndsAt).diff(
    dayjs(),
    "days",
  );

  const { openInitialAssessmentModal } = useAppContext();

  return (
    <div className="container mx-auto">
      <Head>
        <title>Dashboard | Prepi</title>
      </Head>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-full">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-base font-medium text-[#6e6e6e] text-center sm:text-left">
              Hei, suntem încă în Beta și îmbunătățim continuu platforma. Dacă
              ai idei sau sugestii, ne-ar plăcea să le auzim. 😊
            </p>
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => Crisp.chat.open()}
            >
              Vorbește cu noi!
            </Button>
          </div>
        </Card>

        {subscription?.status === "trialing" && (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <Image
                  src="/notification-icons/confetti.png"
                  alt="Confetti"
                  width="64"
                  height="64"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-primary">
                    Hooray
                  </h2>
                  <p className="text-md text-muted-foreground">
                    Ai {subscriptionDaysLeft} zile sa te pregatesti gratuit cu
                    Prepi!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!initialTestTaken && (
          <Card className="col-span-full relative">
            <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between pb-2">
              <CardTitle className="text-2xl font-bold flex items-center self-start">
                <CheckSquare className="mr-2 h-6 w-6 inline-block text-cyan-500" />
                Care îți este nivelul?
              </CardTitle>
              <div className="hidden sm:block">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-prepi-gradient shadow-prepi-lg hover:shadow-prepi relative m-3 sm:m-0 "
                  onClick={openInitialAssessmentModal}
                >
                  Începe!
                  <img
                    src="/elements/stopwatch.svg"
                    alt=""
                    className="h-9 w-9 absolute -bottom-12 -right-8"
                  />
                  <img
                    src="/elements/hourglass.svg"
                    alt=""
                    className="h-9 w-9 absolute -top-8 -left-12"
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">
                Începe o scurtă evaluare și descoperă un plan creat special
                pentru tine
              </p>
              <Button
                variant="default"
                className="shadow-prepi-lg hover:shadow-prepi relative mx-auto mt-5 block sm:hidden"
                onClick={openInitialAssessmentModal}
              >
                Începe!
                <img
                  src="/elements/hourglass.svg"
                  alt=""
                  className="h-9 w-9 absolute -bottom-8 -right-24"
                />
              </Button>
            </CardContent>
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
                Exersează în continuare pentru a-ți îmbunătăți competențele.
                Mergi la secțiunea de exersat pentru a continua.
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
