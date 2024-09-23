import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QueryData, trpc } from "@/utils/trpc";
import { MathJax } from "better-react-mathjax";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProblemsProgress } from "./ProblemsProgress";
import { MultipleChoiceOption, Problem } from "@prepi/db";
import { ProblemAnswerAttempt } from ".";

type ExtendedProblem = Partial<Problem> & {
  multipleChoiceOptions: MultipleChoiceOption[];
};

type ProblemDisplayProps = {
  problem: ExtendedProblem;
  hideInput?: boolean;
  answerAttempt: ProblemAnswerAttempt | null;
  setAnswerAttempt: (attempt: ProblemAnswerAttempt) => void;
};

export function ProblemDisplay({
  problem,
  hideInput,
  answerAttempt,
  setAnswerAttempt,
}: ProblemDisplayProps) {
  if (hideInput) {
    return (
      <p className="text-lg mb-4">
        <MathJax>{problem?.description}</MathJax>
      </p>
    );
  }

  return (
    <>
      <p className="text-lg mb-4">
        <MathJax>{problem?.description}</MathJax>
      </p>
      {problem?.type === "MULTIPLE_CHOICE" && (
        <RadioGroup
          value={answerAttempt?.answerId ?? ""}
          onValueChange={(value) => setAnswerAttempt?.({ answerId: value })}
          className="space-y-4"
        >
          {problem.multipleChoiceOptions.map((choice) => (
            <div key={choice.id} className="flex items-center space-x-3">
              <RadioGroupItem
                value={choice.id}
                id={choice.id}
                className="h-6 w-6 border-2 border-primary text-primary focus:ring-primary"
              />
              <Label
                htmlFor={choice.id}
                className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <MathJax
                  inline
                  text={choice.text}
                  renderMode="pre"
                  typesettingOptions={{ fn: "tex2chtml" }}
                />
              </Label>
            </div>
          ))}

          {/* <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">x ∈</span>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-grow"
                placeholder="Introduceți răspunsul aici"
                autoFocus={false}
              />
            </div> */}
        </RadioGroup>
      )}
    </>
  );
}
