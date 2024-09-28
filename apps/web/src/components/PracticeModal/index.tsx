"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { ProblemsProgress } from "./ProblemsProgress";
import { ProblemDisplay } from "./ProblemDisplay";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  MathSymbolButton,
  MultipleChoiceOption,
  Problem,
  ProblemExplanation,
  ProblemHint,
  ProblemVariable,
  SingleAnswer,
} from "@prepi/db";
import { compareEqs } from "@prepi/utils";

type PracticeModalProps = {
  open: boolean;
  onClose: () => void;
  subjectId: string;
};

export type ExtendedProblem = Partial<Problem> & {
  multipleChoiceOptions: MultipleChoiceOption[];
  singleAnswer: SingleAnswer | null;
  variables: ProblemVariable[];
  mathSymbolButtons: MathSymbolButton[];
  hints: ProblemHint[];
  explanation: ProblemExplanation;
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
  multipleVariableValues?: Record<string, string>;
};

export type PracticeSessionResults = {
  pointsEarned: number;
};

const isReadyToSubmit = (
  problem: ExtendedProblem | undefined,
  attempt: ProblemAnswerAttempt | null
) => {
  if (!problem) return false;
  if (!attempt) return false;

  if (problem.type === "MULTIPLE_CHOICE") {
    return !!attempt.answerId;
  }
  if (problem.type === "SINGLE_ANSWER") {
    return !!attempt.singleAnswerText;
  }
  if (problem.type === "MULTIPLE_VARIABLES") {
    return (
      Object.values(attempt.multipleVariableValues ?? {}).filter((val) => !!val)
        .length === problem.variables.length
    );
  }
  return false;
};

export function PracticeModal({
  open,
  onClose,
  subjectId,
}: PracticeModalProps) {
  const { isTester } = useUserRoles();

  const utils = trpc.useUtils();
  const _problems = trpc.practice.listProblemsBySubject.useQuery(subjectId, {
    enabled: !!subjectId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
  const problems = _problems.data ?? [];

  const recordPracticeSession = trpc.practice.recordPracticeSession.useMutation(
    {
      onSuccess: (results) => {
        setPracticeResults(results);
        utils.practice.listSubjectsProgress.invalidate();
      },
    }
  );
  const [practiceResults, setPracticeResults] =
    useState<PracticeSessionResults>();

  const [submissions, setSubmissions] = useState<SubmissionStatus[]>([]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const currentProblem = problems?.[currentProblemIndex];
  const currentSubmission = submissions[currentProblemIndex];
  const practiceFinished =
    problems.length && currentProblemIndex === problems.length;

  const [answerAttempt, setAnswerAttempt] =
    useState<ProblemAnswerAttempt | null>(null);
  const readyToSubmit = isReadyToSubmit(currentProblem, answerAttempt);

  const submitPracticeSession = async () => {
    const problemsToRecord = problems.map((problem, index) => ({
      problemId: problem.id,
      correct: submissions[index] === SubmissionStatus.CORRECT,
    }));

    recordPracticeSession.mutate({
      subjectId,
      problems: problemsToRecord,
    });
  };

  const setNextProblem = () => {
    setCurrentProblemIndex((prev) => prev + 1);
    setHintCount(0);
    setShowExplanation(false);
    setAnswerAttempt(null);
    setIsSolved(false);

    if (currentProblemIndex === problems.length - 1) {
      submitPracticeSession();
    }
  };

  const displayExplanation = () => {
    setShowExplanation(true);
    setHintCount(0);
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
    console.log("sechimbare");

    let isCorrect = false;
    if (currentProblem.type === "MULTIPLE_CHOICE") {
      const selectedAnswer = currentProblem.multipleChoiceOptions.find(
        (option) => option.id === answerAttempt?.answerId
      );
      isCorrect = selectedAnswer?.isCorrect ?? false;
    }
    if (currentProblem.type === "SINGLE_ANSWER") {
      isCorrect = compareEqs(
        answerAttempt?.singleAnswerText ?? "",
        currentProblem.singleAnswer?.correctAnswer ?? ""
      );
    }
    if (currentProblem.type === "MULTIPLE_VARIABLES") {
      isCorrect = Object.entries(
        answerAttempt?.multipleVariableValues ?? {}
      ).every(([variableId, value]) => {
        const variable = currentProblem.variables.find(
          (variable) => variable.id === variableId
        );
        return compareEqs(value, variable?.correctAnswer ?? "");
      });
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

  if (practiceFinished) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-full w-[90%] min-h-[90vh] md:min-h-[50vh]">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">
              Felicitări! {recordPracticeSession.isLoading && "..."}
            </h2>

            <h2 className="text-4xl font-bold text-center mb-8">
              Ai terminat testul!
            </h2>

            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">Scor</p>
                <p className="text-3xl font-bold">-%</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">
                  Performanță
                </p>
                <p className="text-3xl font-bold text-green-500">+-%</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">Puncte</p>
                <p className="text-3xl font-bold text-blue-500">
                  + {practiceResults?.pointsEarned}
                </p>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <ProblemsProgress
                submissions={submissions}
                total={problems.length}
                displayMode="large"
              />
            </div>

            <div className="flex justify-center space-x-8">
              <Button variant="outline" onClick={onClose}>
                Închide
              </Button>
              <Button variant="outline">Repetă capitol</Button>
              <Button>Următorul test: Mulțimi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
              activeIndex={currentProblemIndex}
            />
          </div>

          <div className="mb-6">
            {currentProblem && (
              <ProblemDisplay
                problem={currentProblem}
                answerAttempt={answerAttempt}
                setAnswerAttempt={setAnswerAttempt}
                hideInput={showExplanation}
                hintCount={hintCount}
                showExplanation={showExplanation}
              />
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
              <Button disabled={!readyToSubmit} onClick={() => submitAnswer()}>
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
              onClick={() => submitAnswer({ forceCorrect: false })}
            >
              Click Wrong Answer
            </Button>
            <Button
              variant="link"
              onClick={() =>
                navigator.clipboard.writeText(currentProblem?.id ?? "")
              }
            >
              {currentProblem?.id}
            </Button>
            <Button
              variant="link"
              onClick={() => {
                const getRandomSubmission = () => {
                  const randomIndex = Math.floor(Math.random() * 3);
                  return Object.values(SubmissionStatus)[
                    randomIndex
                  ] as SubmissionStatus;
                };
                setSubmissions(problems.map(() => getRandomSubmission()));
                setCurrentProblemIndex(problems.length);
              }}
            >
              finish
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
