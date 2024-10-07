"use client";

import { ArrowLeft, ArrowRight, LucideLoader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trpc } from "@/utils/trpc";

export const LessonNavigationButtons = ({ slug }: { slug: string }) => {
  const { data, isLoading } = trpc.lesson.getAdjacentLessons.useQuery(slug);

  const prev = data?.previous;
  const next = data?.next;

  return (
    <div className="flex justify-between mt-6 flex-wrap-reverse gap-3">
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
