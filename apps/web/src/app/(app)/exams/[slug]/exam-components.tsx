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
import { trpc } from "@/utils/trpc";
import { MathJax } from "better-react-mathjax";
import { getExamBySlugAction } from "@/actions";
import { ExamProblemOfficialSolutionStep } from "@prisma/client";

const parseLatex = (text?: string) => text?.replace(/\$([^$]+)\$/g, "\\($1\\)");

export const ExplanationSection = ({
  explanation,
}: {
  explanation?: ExamProblemOfficialSolutionStep[];
}) => {
  return (
    <Collapsible open>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left mb-2"
        >
          <ChevronRight className="mr-2 h-4 w-4" />
          Barem
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-white p-4 rounded-md border border-gray-200">
        {explanation?.map((step, index) => (
          <div key={index} className="mb-4 flex align-middle">
            <div className="mr-4">{step.points}p</div>
            <MathJax inline>{parseLatex(step.content)}</MathJax>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const ExamProblemDescription = ({
  description,
}: {
  description: string;
}) => {
  return (
    <MathJax className="mb-4 text-gray-700">{parseLatex(description)}</MathJax>
  );
};

export const ExamSubsectionDescription = ({
  description,
}: {
  description?: string;
}) => {
  return <MathJax inline>{parseLatex(description)}</MathJax>;
};
