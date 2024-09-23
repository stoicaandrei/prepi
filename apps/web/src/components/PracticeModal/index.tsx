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
import { ProblemDisplay } from "./ProblemDisplay";
import { useUserRoles } from "@/utils/useUserRoles";

type PracticeModalProps = {
  open: boolean;
  onClose: () => void;
  subjectId: string;
};

export enum SubmissionStatus {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  HINT = "HINT",
  UNATTEMPTED = "UNATTEMPTED",
}

export type ProblemAnswerAttempt = {
  answerId?: string;
  singleAnswerText?: string;
};

export function PracticeModal({
  open,
  onClose,
  subjectId,
}: PracticeModalProps) {
  const { isTester } = useUserRoles();

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
  const currentProblem = problems?.[currentProblemIndex];
  const currentSubmission = submissions[currentProblemIndex];

  const [answerAttempt, setAnswerAttempt] =
    useState<ProblemAnswerAttempt | null>(null);

  const setNextProblem = () => {
    setCurrentProblemIndex((prev) => prev + 1);
    setHintCount(0);
    setShowExplanation(false);
    setAnswerAttempt(null);
    setIsSolved(false);
  };

  const displayExplanation = () => {
    setShowExplanation(true);
    setIsSolved(true);
    if (!currentSubmission) {
      setSubmissions((prev) => [...prev, SubmissionStatus.HINT]);
    }
  };

  type SubmitAnswerOptions = {
    forceCorrect?: boolean;
  };
  const submitAnswer = (options?: SubmitAnswerOptions) => {
    if (!currentProblem) return;

    let isCorrect = false;
    if (currentProblem.type === "MULTIPLE_CHOICE") {
      const selectedAnswer = currentProblem.multipleChoiceOptions.find(
        (option) => option.id === answerAttempt?.answerId
      );
      isCorrect = selectedAnswer?.isCorrect ?? false;
    }
    if (currentProblem.type === "SINGLE_ANSWER") {
      // TODO: Make this comparison math sensitive
      isCorrect =
        answerAttempt?.singleAnswerText ===
        currentProblem.singleAnswer?.correctAnswer;
    }

    if (typeof options?.forceCorrect === "boolean") {
      isCorrect = options.forceCorrect;
    }

    if (isCorrect) {
      setIsSolved(true);
    } else {
      setAnswerAttempt(null);
    }

    let status = isCorrect
      ? SubmissionStatus.CORRECT
      : SubmissionStatus.INCORRECT;
    if (hintCount || showExplanation) {
      status = SubmissionStatus.HINT;
    }

    if (!currentSubmission) {
      setSubmissions((prev) => [...prev, status]);
    }
  };

  const [hintCount, setHintCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

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
            {currentProblem && (
              <ProblemDisplay
                problem={currentProblem}
                answerAttempt={answerAttempt}
                setAnswerAttempt={setAnswerAttempt}
                hideInput={showExplanation}
              />
            )}

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
                {!isSolved && (
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setHintCount((prev) => prev + 1)}
                    disabled={hintCount === currentProblem?.hints.length}
                  >
                    {hintCount ? "Următorul pas" : "Indicații"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={displayExplanation}
                >
                  Vezi rezolvare
                </Button>
              </>
            )}

            {currentSubmission === SubmissionStatus.INCORRECT && !isSolved && (
              <Button
                variant="outline"
                className="mr-2"
                onClick={setNextProblem}
              >
                Sari peste
              </Button>
            )}
            {!isSolved && (
              <Button disabled={!answerAttempt} onClick={() => submitAnswer()}>
                Trimite <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {isSolved && <Button onClick={setNextProblem}>Următorul</Button>}
          </div>
        </div>
        {isTester && (
          <div className="">
            <Button
              variant="link"
              onClick={() => submitAnswer({ forceCorrect: true })}
            >
              Click Correct Answer
            </Button>
            <Button
              variant="link"
              onClick={() => submitAnswer({ forceCorrect: true })}
            >
              Click Correct Answer
            </Button>
            <Button
              variant="link"
              onClick={() =>
                navigator.clipboard.writeText(currentProblem?.id ?? "")
              }
            >
              {currentProblem?.id}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
