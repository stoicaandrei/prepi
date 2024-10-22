"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ExamProblemOfficialSolutionStep } from "@prisma/client";
import { MathRender } from "@/components/MathRender";

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
            <MathRender content={step.content} />
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
  return <MathRender className="mb-4 text-gray-700" content={description} />;
};

export const ExamSubsectionDescription = ({
  description,
}: {
  description?: string;
}) => {
  return <MathRender content={description ?? ""} />;
};
