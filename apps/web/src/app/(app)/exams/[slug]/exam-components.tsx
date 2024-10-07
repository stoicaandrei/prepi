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

export const ExplanationSection = ({
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

export const ExamProblemDescription = ({
  description,
}: {
  description: string;
}) => {
  return <MathJax className="mb-4 text-gray-700">{description}</MathJax>;
};

export const ExamSubsectionDescription = ({
  description,
}: {
  description?: string;
}) => {
  return <MathJax inline>{description}</MathJax>;
};
