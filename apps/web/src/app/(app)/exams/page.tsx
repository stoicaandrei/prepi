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
import { redirect } from "next/navigation";
import { ExamDifficultyTabs } from "./ExamDifficultyTabs";

export default async function ExamVariantsResponsive({
  searchParams,
}: {
  searchParams: { difficulty: ExamDifficulty };
}) {
  const difficulty = searchParams.difficulty || ExamDifficulty.M1;
  const exams = await listExamsByDifficultyAction(difficulty);

  console.log(exams);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-blue-500">Variante</h1>
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Caută..." className="pl-8 w-full" disabled />
          </div>
        </div>
        <ExamDifficultyTabs />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams?.map((exam) => (
            <Link key={exam.id} href={`/exams/${exam.slug}`}>
              <Button
                variant="ghost"
                className="w-full justify-start font-normal text-gray-700 hover:text-blue-500 hover:bg-blue-50 text-wrap"
              >
                {exam.title}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm text-gray-500">
        Suntem în procesul de a adăuga variante de M3, rămâi cu noi!
      </CardFooter>
    </Card>
  );
}
