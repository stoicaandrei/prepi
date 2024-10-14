import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProblemsProgress, SubmissionStatus } from "./ProblemsProgress";
import { ProblemDisplay } from "./ProblemDisplay";
import { useUserRoles } from "@/hooks/useUserRoles";
import { compareEqs } from "@prepi/utils";
import { ExtendedProblem, ProblemAnswerAttempt } from "./types";
import { checkAnswerAttempt, isReadyToSubmit } from "./utils";
import { useToast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";

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
  const { toast } = useToast();
  const { play: playCorrect } = useSound("/audio/correct.wav");
  const { play: playWrong } = useSound("/audio/wrong.wav");
  const { play: playHint } = useSound("/audio/beep.wav");

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
    if (!currentProblem || !answerAttempt) return;

    let isCorrect = checkAnswerAttempt(currentProblem, answerAttempt);

    if (typeof options?.forceCorrect === "boolean") {
      isCorrect = options.forceCorrect;
    }

    if (isCorrect) {
      setIsSolved(true);
    } else {
      setAnswerAttempt(null);
    }

    const hintsUsed = hintCount || showExplanation;

    let status = isCorrect
      ? SubmissionStatus.CORRECT
      : SubmissionStatus.INCORRECT;
    if (isCorrect && hintsUsed) {
      status = SubmissionStatus.HINT;
    }

    if (status === SubmissionStatus.CORRECT) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "✅ Corect!",
        description: "Felicitări! Răspunsul tău este corect.",
        variant: "default",
      });
      playCorrect();
    }

    if (status === SubmissionStatus.INCORRECT) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "❌ Greșit!",
        description: "Răspunsul tău nu este corect. Încearcă din nou.",
        variant: "destructive",
      });
      playWrong();
    }

    if (status === SubmissionStatus.HINT) {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        title: "🔍 Indicații",
        description: "Ai cerut indicații pentru rezolvare.",
        variant: "default",
      });
      playHint();
    }

    if (!currentSubmission) {
      setSubmissions([...submissions, status]);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
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

        <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center gap-2 md:gap-2">
          {!showExplanation && (
            <>
              {!isSolved && (
                <Button
                  variant="outline"
                  className=""
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
