"use client";

import { PracticeModal } from "@/components/PracticeModal";
import { ProblemPreviewModal } from "@/components/PracticeModal/ProblemPreviewModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useUserRoles } from "@/hooks/useUserRoles";
import { trpc } from "@/utils/trpc";
import { CheckSquare } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MathPracticeInteractive({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const openSubjectSlug = searchParams["open"];

  const { isTester } = useUserRoles();
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const subjectsByCategories = trpc.practice.listSubjectsByCategory.useQuery();

  const subjectsProgress = trpc.practice.listSubjectsProgress.useQuery();

  const { data: nextChapters, isLoading: nextChaptersLoading } =
    trpc.practice.getRecommendedNextChapters.useQuery();
  const nextChapter = nextChapters?.[0];
  const nextChapterProgress = subjectsProgress.data?.find(
    (sp) => sp.subjectId === nextChapter?.id,
  );
  const nextChapterDetails = subjectsByCategories.data
    ?.flatMap((c) => c.subjects.find((s) => s.id === nextChapter?.id))
    .find((s) => s?.id === nextChapter?.id);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (openSubjectSlug) {
      const subject = subjectsByCategories.data
        ?.flatMap((c) => c.subjects)
        .find((s) => s.slug === openSubjectSlug);

      if (subject) {
        setSelectedSubjectId(subject.id);
      }
    }
  }, [subjectsByCategories.data]);

  return (
    <div className="space-y-4">
      {/* <Card className="w-full bg-gradient-to-r from-blue-400 to-teal-400 text-white">
        <CardContent className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Începe cu testul inițial!
            </h2>
            <p>Durează aproximativ 30 de minute.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Haide!
              </Button>
            </DialogTrigger>
            <PracticeModal />
          </Dialog>
        </CardContent>
      </Card> */}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl text-blue-500">
            <div className="flex items-center">
              <CheckSquare className="mr-2" />
              Exersează {subjectsByCategories.isLoading ? "..." : ""}
            </div>
            {isTester && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setPreviewModalOpen(true)}
                >
                  Preview Problem
                </Button>
                <ProblemPreviewModal
                  open={previewModalOpen}
                  onClose={() => setPreviewModalOpen(false)}
                />
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Bazat pe activitatea ta, îți recomandăm să lucrezi la următorul
            subiect:
          </p>
          {/* TODO: Display all recommened chapters here */}
          <Button
            variant="ghost"
            className="w-full p-2 sm:p-4 h-auto flex flex-col items-start justify-between hover:bg-gray-100 shadow-md overflow-hidden"
            onClick={() => nextChapter && setSelectedSubjectId(nextChapter.id)}
          >
            {nextChaptersLoading && (
              <Image
                src="/effects/load.gif"
                alt="loading bars"
                width={220}
                height={10}
              />
            )}
            {!!nextChapter && (
              <div className="w-full flex flex-col items-start gap-2">
                <span className="text-base sm:text-lg font-medium truncate">
                  {nextChapter?.name ?? "..."}
                </span>
                <Progress
                  className="shadow-prepi w-full"
                  value={(nextChapterProgress?.masteryLevel ?? 0) * 100}
                />
                <p className="text-xs sm:text-sm text-gray-600 break-words hyphens-auto">
                  {"Ai rezolvat "}
                  <span className="font-medium">
                    {nextChapterProgress?._count.completedProblems ?? 0}
                    {" / "}
                    {nextChapterDetails?._count.problems}
                  </span>
                  {" probleme din această categorie"}
                </p>
              </div>
            )}
          </Button>
          <p>Mai multe subiecte:</p>
          {subjectsByCategories.data?.map((category) => (
            <Collapsible key={category.id}>
              <CollapsibleTrigger asChild>
                <Button
                  key={category.name}
                  variant="ghost"
                  className="w-full p-4 h-auto flex items-center justify-between hover:bg-gray-100"
                  onClick={() =>
                    console.log(`Opening ${category.name} category`)
                  }
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-lg font-medium">{category.name}</span>
                  </div>
                  {/* <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        Ai rezolvat 0/0 probleme
                        <span className="hidden sm:inline">
                          {" "}
                          din această categorie
                        </span>
                      </span>
                      <ChevronRight className="w-6 h-6" />
                    </div> */}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {category.subjects.map((subject) => {
                  const subjectProgress = subjectsProgress.data?.find(
                    (sp) => sp.subjectId === subject.id,
                  );

                  const problemsDone =
                    subjectProgress?._count.completedProblems ?? 0;
                  const totalProblems = subject._count.problems;

                  const progress = Math.round(
                    (problemsDone / totalProblems) * 100,
                  );

                  return (
                    <Button
                      key={subject.id}
                      variant="ghost"
                      className="w-full justify-between p-2 h-auto hover:bg-gray-100"
                      onClick={() => setSelectedSubjectId(subject.id)}
                    >
                      <span>{subject.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {problemsDone}/{totalProblems} exerciții{" "}
                          <span className="hidden md:inline-block">
                            rezolvate
                          </span>
                        </span>
                        <span className="text-sm text-blue-500 w-9">
                          {progress}%
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          ))}
          {!!selectedSubjectId && (
            <PracticeModal
              open={!!selectedSubjectId}
              onClose={() => setSelectedSubjectId(null)}
              subjectId={selectedSubjectId ?? ""}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
