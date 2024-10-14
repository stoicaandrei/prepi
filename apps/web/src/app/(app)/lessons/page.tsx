import { Suspense } from "react";
import { BookOpen, ChevronDown, LucideLoader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { listAllLessonsByTagsAction } from "@/actions";

function LessonsSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <div className="pl-4 space-y-1">
            {[...Array(3)].map((_, lessonIndex) => (
              <Skeleton key={lessonIndex} className="h-8 w-11/12" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

async function LessonsList() {
  const lessonsByTags = await listAllLessonsByTagsAction();

  const firstBatch = lessonsByTags?.slice(0, lessonsByTags.length / 2 + 1);
  const secondBatch = lessonsByTags?.slice(lessonsByTags.length / 2 + 1);

  const renderTag = (tag: NonNullable<typeof lessonsByTags>[number]) => (
    <Collapsible key={tag.id}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between font-semibold text-blue-500"
        >
          {tag.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-1">
        {tag.lessons.map((lesson) => (
          <Link key={lesson.slug} href={`/lessons/${lesson.slug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal text-gray-600 hover:text-blue-500"
            >
              {lesson.title}
            </Button>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <div className="space-y-2">{firstBatch?.map(renderTag)}</div>
      <div className="space-y-2">{secondBatch?.map(renderTag)}</div>
    </div>
  );
}

export default function MathPlatformCardExpanded() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-2xl font-semibold text-blue-500">
              Lectii
            </span>
          </div>
          <div className="w-full max-w-40 md:max-w-xs">
            <Input type="search" placeholder="Caută..." className="w-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <LessonsSkeleton />
              <LessonsSkeleton />
            </div>
          }
        >
          <LessonsList />
        </Suspense>
      </CardContent>
    </Card>
  );
}
