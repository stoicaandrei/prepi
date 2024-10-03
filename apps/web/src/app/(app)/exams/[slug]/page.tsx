"use client";

import { ArrowLeft, ChevronRight, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { MathJax } from "better-react-mathjax";

export default function ExamCard() {
  const { slug } = useParams();

  const { data: exam } = trpc.exam.getExamBySlug.useQuery(slug as string);

  return (
    <div>
      <Link href="/exams">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la variante
        </Button>
      </Link>

      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Files className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-semibold text-blue-500">
                {exam?.title ?? "Varianta..."}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h2>Subiectul 1</h2>
          {exam?.sub1Problems.map((problem, index) => (
            <div>
              <h3>Problema {index + 1}.</h3>
              <MathJax>{problem.description}</MathJax>
              <ExplanationSection explanation={problem.explanation} />
            </div>
          ))}
          <h2>Subiectul 2</h2>
          {exam?.sub2Problems.map((problem, index) => (
            <div>
              <h3>Problema {index + 1}.</h3>
              <MathJax>{problem.description}</MathJax>
              <div>
                <h4>
                  a. <MathJax inline>{problem.subA?.description}</MathJax>
                </h4>
                <ExplanationSection explanation={problem.subA?.explanation} />
              </div>
              <div>
                <h4>
                  b. <MathJax inline>{problem.subB?.description}</MathJax>
                </h4>
                <ExplanationSection explanation={problem.subB?.explanation} />
              </div>
              <div>
                <h4>
                  c. <MathJax inline>{problem.subC?.description}</MathJax>
                </h4>
                <ExplanationSection explanation={problem.subC?.explanation} />
              </div>
            </div>
          ))}
          <h2>Subiectul 3</h2>
          {exam?.sub3Problems.map((problem, index) => (
            <div>
              <h3>Problema {index + 1}.</h3>
              <MathJax>{problem.description}</MathJax>
              <div>
                <h4>
                  a. <MathJax inline>{problem.subA?.description}</MathJax>
                </h4>
                <ExplanationSection explanation={problem.subA?.explanation} />
              </div>
              <div>
                <h4>
                  b. <MathJax inline>{problem.subB?.description}</MathJax>
                </h4>
                <ExplanationSection explanation={problem.subB?.explanation} />
              </div>
              <div>
                <h4>
                  c. <MathJax inline>{problem.subC?.description}</MathJax>
                </h4>
                <ExplanationSection explanation={problem.subC?.explanation} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-6">
        <Link href="/exams">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la variante
          </Button>
        </Link>
      </div>
    </div>
  );
}

const ExplanationSection = ({
  explanation,
}: {
  explanation?: string | null;
}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger>
        <Button variant="ghost">
          <ChevronRight className="mr-2 h-4 w-4" />
          Rezolvare
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <MathJax>{explanation}</MathJax>
      </CollapsibleContent>
    </Collapsible>
  );
};
