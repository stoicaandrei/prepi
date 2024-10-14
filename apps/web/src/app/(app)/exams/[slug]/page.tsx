import { Suspense } from "react";
import { ArrowLeft, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getExamBySlugAction } from "@/actions";
import {
  ExplanationSection,
  ExamProblemDescription,
  ExamSubsectionDescription,
} from "./exam-components";

function ExamSkeleton() {
  return (
    <div className="space-y-8 p-6">
      <Skeleton className="h-8 w-3/4" />
      {[1, 2, 3].map((subject) => (
        <div key={subject} className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          {[1, 2, 3].map((problem) => (
            <div key={problem} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

async function ExamContent({ slug }: { slug: string }) {
  const exam = await getExamBySlugAction(slug);

  if (!exam) {
    return <div>Exam not found</div>;
  }

  return (
    <>
      <CardHeader className="space-y-4 bg-prepi-gradient text-white rounded-t-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Files className="h-8 w-8" />
            <span className="ml-2 text-2xl font-semibold">{exam.title}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Subiectul 1</h2>
          {exam.sub1Problems.map((problem, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Problema {index + 1}.
              </h3>
              <ExamProblemDescription description={problem.description} />
              <ExplanationSection explanation={problem.explanation} />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Subiectul 2</h2>
          {exam.sub2Problems.map((problem, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Problema {index + 1}.
              </h3>
              <ExamProblemDescription description={problem.description} />

              {["A", "B", "C"].map((subSection) => (
                <div key={subSection} className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {subSection}.{" "}
                    <ExamSubsectionDescription
                      description={problem[`sub${subSection}`]?.description}
                    />
                  </h4>
                  <ExplanationSection
                    explanation={problem[`sub${subSection}`]?.explanation}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Subiectul 3</h2>
          {exam.sub3Problems.map((problem, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Problema {index + 1}.
              </h3>
              <ExamProblemDescription description={problem.description} />

              {["A", "B", "C"].map((subSection) => (
                <div key={subSection} className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    {subSection}.{" "}
                    <ExamSubsectionDescription
                      description={problem[`sub${subSection}`]?.description}
                    />
                  </h4>
                  <ExplanationSection
                    explanation={problem[`sub${subSection}`]?.explanation}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}

export default function ExamCard({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/exams">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la variante
        </Button>
      </Link>

      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-md">
        <Suspense fallback={<ExamSkeleton />}>
          <ExamContent slug={slug} />
        </Suspense>
      </Card>

      <div className="flex justify-center mt-8">
        <Link href="/exams">
          <Button className="bg-prepi-gradient text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la variante
          </Button>
        </Link>
      </div>
    </div>
  );
}
