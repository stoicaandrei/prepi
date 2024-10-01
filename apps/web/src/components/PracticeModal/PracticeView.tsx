import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProblemsProgress, SubmissionStatus } from "./ProblemsProgress";
import { ProblemDisplay } from "./ProblemDisplay";
import { useUserRoles } from "@/hooks/useUserRoles";
import { compareEqs } from "@prepi/utils";
import { ExtendedProblem, ProblemAnswerAttempt } from "./types";
import { isReadyToSubmit } from "./utils";

type PracticeViewProps = {
  currentProblemIndex: number;
  setCurrentProblemIndex: (index: number) => void;
  problems: ExtendedProblem[];
  submissions: SubmissionStatus[];
  setSubmissions: (submissions: SubmissionStatus[]) => void;
};

export const PracticeView = ({
  currentProblemIndex,
  setCurrentProblemIndex,
  problems,
  submissions,
  setSubmissions,
}: PracticeViewProps) => {
  const { isTester } = useUserRoles();

  const currentProblem = problems[currentProblemIndex];
  const currentSubmission = submissions[currentProblemIndex];

  const [answerAttempt, setAnswerAttempt] =
    useState<ProblemAnswerAttempt | null>(null);
  const readyToSubmit = isReadyToSubmit(currentProblem, answerAttempt);

  const [hintCount, setHintCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const setNextProblem = () => {
    setCurrentProblemIndex(currentProblemIndex + 1);
    setHintCount(0);
    setShowExplanation(false);
    setAnswerAttempt(null);
    setIsSolved(false);
  };

  const displayExplanation = () => {
    setShowExplanation(true);
    setHintCount(0);
    setIsSolved(true);
    if (!currentSubmission) {
      setSubmissions([...submissions, SubmissionStatus.HINT]);
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
        (option) => option.id === answerAttempt?.answerId,
      );
      isCorrect = selectedAnswer?.isCorrect ?? false;
    }
    if (currentProblem.type === "SINGLE_ANSWER") {
      isCorrect = compareEqs(
        answerAttempt?.singleAnswerText ?? "",
        currentProblem.singleAnswer?.correctAnswer ?? "",
      );
    }
    if (currentProblem.type === "MULTIPLE_VARIABLES") {
      isCorrect = Object.entries(
        answerAttempt?.multipleVariableValues ?? {},
      ).every(([variableId, value]) => {
        const variable = currentProblem.variables.find(
          (variable) => variable.id === variableId,
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
      setSubmissions([...submissions, status]);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Modul de exersare {!problems.length && "..."}
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
            <Button variant="outline" className="mr-2" onClick={setNextProblem}>
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
    </>
  );
};
