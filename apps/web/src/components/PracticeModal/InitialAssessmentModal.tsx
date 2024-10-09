"use client";

import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { SubmissionStatus } from "./ProblemsProgress";
import { PracticeSessionResults, ProblemAnswerAttempt } from "./types";
import { PracticeView } from "./PracticeView";
import { ResultsView } from "./ResultsView";
import { Progress } from "@/components/ui/progress";
import { ProblemDisplay } from "./ProblemDisplay";
import { Button } from "../ui/button";
import { ChevronRight, CircleHelp } from "lucide-react";
import Image from "next/image";
import { ModalLoader } from "./ModalLoader";
import { checkAnswerAttempt, isReadyToSubmit } from "./utils";
import { useUserRoles } from "@/hooks/useUserRoles";

type InitialAssessmentModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InitialAssessmentModal({
  open,
  onClose,
}: InitialAssessmentModalProps) {
  const { isTester } = useUserRoles();

  const utils = trpc.useUtils();
  const { data: assessmentSession, isLoading: assessmentSessionLoading } =
    trpc.assessment.getAssessmentSession.useQuery();

  const { data: problem, isLoading: problemLoading } =
    trpc.assessment.getNextProblem.useQuery(undefined, {
      enabled: open,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    });

  const recordAssessmentQuestion =
    trpc.assessment.recordAssessmentQuestion.useMutation({
      onSuccess: () => {
        utils.practice.listSubjectsProgress.invalidate();
        utils.assessment.getAssessmentSession.invalidate();
        utils.assessment.getNextProblem.reset();
      },
    });

  const assessedQuestions = (assessmentSession?._count.questions ?? 0) + 1;
  const totalQuestions = 15;
  const progress = assessedQuestions / totalQuestions;

  const [answerAttempt, setAnswerAttempt] =
    useState<ProblemAnswerAttempt | null>(null);

  const sendAttemptRecording = (correct: boolean) => {
    if (!problem) return;

    recordAssessmentQuestion.mutate({
      problemId: problem.id,
      correct,
    });
    setAnswerAttempt(null);
  };

  const submitAnswer = () => {
    if (!problem || !answerAttempt) return;

    const isCorrect = checkAnswerAttempt(problem, answerAttempt);

    sendAttemptRecording(isCorrect);
  };

  const skipProblem = () => {
    if (!problem) return;

    sendAttemptRecording(false);
  };

  const [displayExplanation, setDisplayExplanation] = useState(false);
  useEffect(() => {
    if (assessmentSessionLoading) return;

    !assessmentSession && setDisplayExplanation(true);
  }, [assessmentSession, assessmentSessionLoading]);

  const isFinished = assessedQuestions > totalQuestions;

  const DialogWrapper = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      return (
        <Dialog open={open} onOpenChange={() => {}}>
          <DialogContent
            onClose={onClose}
            className="max-w-full w-[100%] md:w-[90%] min-h-[90vh] md:min-h-[50vh] max-h-[100vh] overflow-scroll"
          >
            <div className="p-6">{children}</div>
          </DialogContent>
        </Dialog>
      );
    },
    [open, onClose],
  );

  if (isFinished) {
    return (
      <DialogWrapper>
        <InitialAssessmentSummary onFinished={onClose} />
      </DialogWrapper>
    );
  }

  if (displayExplanation) {
    return (
      <DialogWrapper>
        <InitialAssessmentExplanation
          onReady={() => setDisplayExplanation(false)}
        />
      </DialogWrapper>
    );
  }

  let message = "";
  if (problemLoading) {
    message = "Se pregătește următoarea problemă...";
  }
  if (recordAssessmentQuestion.isLoading) {
    message = "Se înregistrează răspunsul...";
  }
  if (assessmentSessionLoading) {
    message = "Se pregătește testul...";
  }

  if (message) {
    return (
      <DialogWrapper>
        <ModalLoader message={message} />
      </DialogWrapper>
    );
  }

  return (
    <DialogWrapper>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
        <h2 className="text-2xl font-bold flex items-center">
          Test inițial
          <CircleHelp
            className="ml-2 h-6 w-6 inline-block hover:text-blue-500 cursor-pointer transition-all"
            onClick={() => setDisplayExplanation(true)}
          />
        </h2>
        <div className="flex flex-row gap-2 items-center w-full">
          <span className="flex-shrink-0">
            {assessedQuestions} / {totalQuestions}
          </span>
          <Progress
            className="shadow-prepi h-4 md:w-96"
            value={progress * 100}
          />
        </div>
      </div>

      <div className="mb-6">
        {problem && (
          <ProblemDisplay
            problem={problem}
            answerAttempt={answerAttempt}
            setAnswerAttempt={setAnswerAttempt}
            hideInput={false}
            hintCount={0}
            showExplanation={false}
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center gap-2 md:gap-2">
        <Button variant="outline" className="mr-2" onClick={skipProblem}>
          Sari peste
        </Button>

        <Button
          onClick={submitAnswer}
          disabled={!!problem && !isReadyToSubmit(problem, answerAttempt)}
        >
          Trimite <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {isTester && (
        <div className="">
          <Button variant="link" onClick={() => sendAttemptRecording(true)}>
            Click Correct Answer
          </Button>
          <Button variant="link" onClick={() => sendAttemptRecording(false)}>
            Click Wrong Answer
          </Button>
          <Button
            variant="link"
            onClick={() => navigator.clipboard.writeText(problem?.id ?? "")}
          >
            {problem?.id}
          </Button>
          <br />
          <span>Raspuns corect:</span>
          {problem?.multipleChoiceOptions.find((o) => o.isCorrect)?.text}
          {problem?.singleAnswer?.correctAnswer}
          {problem?.variables.map((v) => (
            <span>
              {v.variableName} = {v.correctAnswer}
            </span>
          ))}
        </div>
      )}
    </DialogWrapper>
  );
}

type InitialAssessmentExplanationProps = {
  onReady: () => void;
};

const InitialAssessmentExplanation = ({
  onReady,
}: InitialAssessmentExplanationProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold text-center">Testul inițial</h2>
      <Image
        src="/illustrations/girl-checklist.svg"
        alt="A girl with a checklist"
        width={329}
        height={275}
        className="self-center mt-4"
      />

      <p className="text-lg mt-4">
        👨‍🏫 Testul inițial conține un număr de 15 întrebări și durează în medie
        20-25 minute.
      </p>
      <p className="text-lg mt-4">
        📊 Rezultatele testului inițial vor fi folosite pentru a crea un plan de
        învățare personalizat.
      </p>
      <p className="text-lg mt-4">
        ❤️ Nu te stresa dacă nu știi răspunsul la toate întrebările. Scopul este
        de a afla nivelul tău de cunoștințe, iar apoi de a te ajuta să înveți
      </p>
      <p className="text-lg mt-4">
        ⚠️ Poți părăsi testul în orice moment, iar progresul tău va fi salvat.
      </p>
      <Button size="lg" className="self-center mt-4" onClick={onReady}>
        Sunt pregătit!
      </Button>
    </div>
  );
};

type InitialAssessmentSummaryProps = {
  onFinished: () => void;
};

const InitialAssessmentSummary = ({
  onFinished,
}: InitialAssessmentSummaryProps) => {
  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-8">
        Ai terminat <br className="block md:hidden" /> testul inital! 🎉
      </h2>
      <div className="flex flex-row flex-wrap items-center justify-center md:justify-between gap-4 mt-4">
        <div>
          <h3 className="text-2xl font-bold">Rezultate</h3>
          <p className="text-lg mt-4">
            🤖 Planul tău personalizat a fost creat
          </p>
          {/* TODO: Add this back */}
          {/* <p className="text-lg mt-4">
            ⭐ Ai câștigat {Math.floor(Math.random() * 100)} puncte
          </p> */}
          <Button size="lg" className="mt-8" onClick={onFinished}>
            Continuă
          </Button>
        </div>
        <img src="/illustrations/student-desk.svg" alt="" />
      </div>
    </div>
  );
};
