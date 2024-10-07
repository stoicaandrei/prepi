"use client";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { Exam, ExamDifficulty } from "@prisma/client";
import { listExamsByDifficultyAction } from "@/actions";
import { redirect, useRouter, useSearchParams } from "next/navigation";

export const ExamDifficultyTabs = () => {
  const difficulty =
    (useSearchParams().get("difficulty") as string) || ExamDifficulty.M1;
  const router = useRouter();

  return (
    <Tabs value={difficulty} className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
        <TabsTrigger
          value={ExamDifficulty.M1}
          onClick={() => router.push(`/exams?difficulty=${ExamDifficulty.M1}`)}
          className="font-semibold"
        >
          M1 (MATE-INFO)
        </TabsTrigger>
        <TabsTrigger
          value={ExamDifficulty.M2}
          onClick={() => router.push(`/exams?difficulty=${ExamDifficulty.M2}`)}
          className="font-semibold"
        >
          M2 (ȘTIINȚELE-NATURII)
        </TabsTrigger>
        <TabsTrigger
          value={ExamDifficulty.M3}
          onClick={() => router.push(`/exams?difficulty=${ExamDifficulty.M3}`)}
          className="font-semibold"
        >
          M3 (PEDAGOGIC)
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
