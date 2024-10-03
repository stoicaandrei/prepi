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
    <div className="container  mx-auto px-4 py-8">
      <Link href="/exams">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la variante
        </Button>
      </Link>

      <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-md">
        <CardHeader className="space-y-4 bg-prepi-gradient text-white rounded-t-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Files className="h-8 w-8" />
              <span className="ml-2 text-2xl font-semibold">
                {exam?.title ?? "Varianta..."}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Subiectul 1
            </h2>
            {exam?.sub1Problems.map((problem, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Problema {index + 1}.
                </h3>
                <MathJax className="mb-4 text-gray-700">
                  {problem.description}
                </MathJax>
                <ExplanationSection explanation={problem.explanation} />
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Subiectul 2
            </h2>
            {exam?.sub2Problems.map((problem, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Problema {index + 1}.
                </h3>
                <MathJax className="mb-4 text-gray-700">
                  {problem.description}
                </MathJax>

                <div className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    A. <MathJax inline>{problem.subA?.description}</MathJax>
                  </h4>
                  <ExplanationSection explanation={problem.subA?.explanation} />
                </div>

                <div className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    B. <MathJax inline>{problem.subB?.description}</MathJax>
                  </h4>
                  <ExplanationSection explanation={problem.subB?.explanation} />
                </div>

                <div className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    C. <MathJax inline>{problem.subC?.description}</MathJax>
                  </h4>
                  <ExplanationSection explanation={problem.subC?.explanation} />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Subiectul 3
            </h2>
            {exam?.sub3Problems.map((problem, index) => (
              <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Problema {index + 1}.
                </h3>
                <MathJax className="mb-4 text-gray-700">
                  {problem.description}
                </MathJax>

                <div className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    A. <MathJax inline>{problem.subA?.description}</MathJax>
                  </h4>
                  <ExplanationSection explanation={problem.subA?.explanation} />
                </div>

                <div className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    B. <MathJax inline>{problem.subB?.description}</MathJax>
                  </h4>
                  <ExplanationSection explanation={problem.subB?.explanation} />
                </div>

                <div className="ml-4 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">
                    C. <MathJax inline>{problem.subC?.description}</MathJax>
                  </h4>
                  <ExplanationSection explanation={problem.subC?.explanation} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
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

const ExplanationSection = ({
  explanation,
}: {
  explanation?: string | null;
}) => {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left mb-2"
        >
          <ChevronRight className="mr-2 h-4 w-4" />
          Rezolvare
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-white p-4 rounded-md border border-gray-200">
        <MathJax>{explanation}</MathJax>
      </CollapsibleContent>
    </Collapsible>
  );
};
