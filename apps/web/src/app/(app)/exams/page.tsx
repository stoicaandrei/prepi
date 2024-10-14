import { Suspense } from "react";
import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Exam, ExamDifficulty } from "@prisma/client";
import { listExamsByDifficultyAction } from "@/actions";
import { ExamDifficultyTabs } from "./ExamDifficultyTabs";

function ExamSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

async function ExamList({ difficulty }: { difficulty: ExamDifficulty }) {
  const exams = await listExamsByDifficultyAction(difficulty);

  return (
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
  );
}

export default function ExamVariantsResponsive({
  searchParams,
}: {
  searchParams: { difficulty: ExamDifficulty };
}) {
  const difficulty = searchParams.difficulty || ExamDifficulty.M1;

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
        <Suspense fallback={<ExamSkeleton />}>
          <ExamList difficulty={difficulty} />
        </Suspense>
      </CardContent>
      <CardFooter className="justify-center text-sm text-gray-500">
        Suntem în procesul de a adăuga variante de M3, rămâi cu noi!
      </CardFooter>
    </Card>
  );
}
