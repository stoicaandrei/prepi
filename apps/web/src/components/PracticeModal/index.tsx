"use client";

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
import { trpc } from "@/utils/trpc";
import { MathJax } from "better-react-mathjax";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ProblemsProgress } from "./ProblemsProgress";

type PracticeModalProps = {
  open: boolean;
  onClose: () => void;
  subjectId: string;
};

enum SubmissionStatus {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  HINT = "HINT",
}

export function PracticeModal({
  open,
  onClose,
  subjectId,
}: PracticeModalProps) {
  const _problems = trpc.practice.listProblemsBySubject.useQuery(subjectId, {
    enabled: !!subjectId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  const problems = _problems.data ?? [];

  const [submissions, setSubmissions] = useState<SubmissionStatus[]>([]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems?.[0];

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const submitAnswer = () => {
    if (currentProblem?.type === "MULTIPLE_CHOICE") {
      const isCorrect = currentProblem.multipleChoiceOptions.find(
        (option) => option.id === selectedAnswer
      )?.isCorrect;
      setSubmissions((prev) => [
        ...prev,
        isCorrect ? SubmissionStatus.CORRECT : SubmissionStatus.INCORRECT,
      ]);
    }
  };

  const [hintCount, setHintCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  console.log(currentProblem);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-[90%] min-h-[90vh] md:min-h-[50vh]">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Modul de exersare {_problems.isLoading ? "..." : ""}
            </h2>
            <ProblemsProgress
              total={problems.length}
              submissions={submissions}
            />
          </div>

          <div className="mb-6">
            <p className="text-lg mb-4">
              <MathJax>{currentProblem?.description}</MathJax>
            </p>
            {currentProblem?.type === "MULTIPLE_CHOICE" && !showExplanation && (
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-4"
              >
                {currentProblem.multipleChoiceOptions.map((choice) => (
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
              </RadioGroup>
            )}

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

            {!!hintCount && !showExplanation && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Indicații:</h3>
                <ol className="list-decimal list-outside pl-4">
                  {currentProblem?.hints.slice(0, hintCount).map((hint) => (
                    <li key={hint.id} className="mb-1">
                      <MathJax>{hint.content}</MathJax>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {showExplanation && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <MathJax>{currentProblem?.explanation.content}</MathJax>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center">
            {!showExplanation && (
              <>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setHintCount((prev) => prev + 1)}
                  disabled={hintCount === currentProblem?.hints.length}
                >
                  {hintCount ? "Următorul pas" : "Indicații"}
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setShowExplanation(true)}
                >
                  Vezi rezolvare
                </Button>
                <Button disabled={!selectedAnswer} onClick={submitAnswer}>
                  Trimite <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {showExplanation && (
              <Button onClick={submitAnswer}>Următorul</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
