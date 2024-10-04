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
} from "lucide-react";
import Head from "next/head";
import { StreaksCard } from "./cards/StreaksCard";
import { PracticeHistoryCard } from "./cards/PracticeHistoryCard";
import { WeeklyActivityCard } from "./cards/WeeklyActivityCard";
import { WeeklyPointsCard } from "./cards/WeeklyPointsCard";

export default function Dashboard() {
  return (
    <div className="container mx-auto">
      <Head>
        <title>Dashboard | Prepi</title>
      </Head>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-full">
          <p className="text-base font-medium text-[#6e6e6e] p-10">
            Amintește-ți că suntem în Beta și încă lucrăm la platformă. Fii
            răbdător și nu ezita să ne scrii dacă ai o propunere!
          </p>
        </Card>

        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <CheckSquare className="mr-2 h-6 w-6 inline-block text-cyan-500" />
              Stabilește-ți nivelul
            </CardTitle>
            <Button variant="default" className="bg-cyan-500 hover:bg-cyan-600">
              Deschide
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fă testul inițial pentru a stabili planul de pregătire
              individuală.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center flex-wrap justify-between  pb-2">
            <CardTitle className="text-2xl font-bold flex items-center">
              <MessageCircle className="mr-2 h-6 w-6 inline-block text-cyan-500" />
              Recomandarea Asistentului Prepi
            </CardTitle>
            <Button
              variant="default"
              className="bg-cyan-500 hover:bg-cyan-600 flex-shrink "
            >
              Începe acum!
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Astăzi îți recomand să dai testul inițial la{" "}
              <span className="text-blue-500">matematică</span>!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              <BarChart2 className="mr-2 h-6 w-6 inline-block text-cyan-500" />
              Cunoștințele mele
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MySkillsChart />
          </CardContent>
        </Card>

        <PracticeHistoryCard />

        <Card>
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

        <StreaksCard />

        <WeeklyActivityCard />

        <WeeklyPointsCard />
      </div>
    </div>
  );
}
