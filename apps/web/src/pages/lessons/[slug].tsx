"use client";

import { ArrowLeft, ArrowRight, BookOpen, LucideLoader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";

export default function LessonCard() {
  const router = useRouter();
  const { slug } = router.query;

  const { data: lesson, isLoading: lessonLoading } =
    trpc.lesson.getBySlug.useQuery(slug as string);

  return (
    <div>
      <Link href="/lessons">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lecții
        </Button>
      </Link>

      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-semibold text-blue-500">
                {lesson?.title || "Lecție.."}
              </span>
              {lessonLoading && (
                <LucideLoader className="h-6 w-6 ml-2 text-blue-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            dangerouslySetInnerHTML={{
              __html: lesson?.legacyContent?.html ?? "",
            }}
          />
        </CardContent>
      </Card>

      <NavigationButtons slug={slug as string} />
    </div>
  );
}

const NavigationButtons = ({ slug }: { slug: string }) => {
  const { data, isLoading } = trpc.lesson.getAdjacentLessons.useQuery(slug);

  const prev = data?.previous;
  const next = data?.next;

  return (
    <div className="flex justify-between mt-6">
      <Link href={prev ? `/lessons/${prev.slug}` : "#"}>
        <Button variant="outline" disabled={isLoading || !prev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Lecția anterioară {isLoading && <LucideLoader />}
        </Button>
      </Link>
      <Link href={next ? `/lessons/${next.slug}` : "#"}>
        <Button disabled={isLoading || !next}>
          Lecția următoare {isLoading && <LucideLoader />}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};
