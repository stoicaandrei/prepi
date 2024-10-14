import { Suspense } from "react";
import { ArrowLeft, BookOpen, LucideLoader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import parse from "html-react-parser";
import {
  getLessonBySlugAction,
  getLessonMetadataBySlugAction,
} from "@/actions";
import { LessonNavigationButtons } from "./LessonNavigationButtons";
import { Metadata } from "next";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const lesson = await getLessonMetadataBySlugAction(slug);

  const title = lesson?.title ?? "Lecție...";

  return {
    title: `${title} | Prepi`,
  };
}

function LessonSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-3/4 mb-6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

const extractBodyContent = (html: string) => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
};

const extractHeadContent = (html: string) => {
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i);
  return headMatch ? headMatch[1] : "";
};

const LessonContent = ({ content }: { content: string }) => {
  const body = extractBodyContent(content);
  const head = extractHeadContent(content);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: head }} />
      <div className="prose prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base">
        {parse(body, {
          replace(domNode) {
            if (domNode.type === "tag" && domNode.name === "a") {
              const href = domNode.attribs.href;
              const slug = href?.split("=")[1];

              if (!slug) return;

              const text = (domNode.children[0] as any).data;

              return (
                <Link href={`/practice?open=${slug}`}>
                  <Button>{text}</Button>
                </Link>
              );
            }
          },
        })}
      </div>
    </>
  );
};

async function LessonCardContent({ slug }: { slug: string }) {
  const lesson = await getLessonBySlugAction(slug);

  return (
    <>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <span className="ml-2 text-2xl font-semibold text-blue-500">
              {lesson?.title || "Lecție.."}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LessonContent content={lesson?.legacyContent?.html ?? ""} />
      </CardContent>
    </>
  );
}

export default function LessonCard({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <div>
      <Link href="/lessons">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lecții
        </Button>
      </Link>

      <Card className="w-full max-w-4xl">
        <Suspense fallback={<LessonSkeleton />}>
          <LessonCardContent slug={slug} />
        </Suspense>
      </Card>

      <Suspense fallback={<div className="h-16" />}>
        <LessonNavigationButtons slug={slug} />
      </Suspense>
    </div>
  );
}
