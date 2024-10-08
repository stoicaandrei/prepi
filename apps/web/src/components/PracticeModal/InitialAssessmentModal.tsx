"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { SubmissionStatus } from "./ProblemsProgress";
import { PracticeSessionResults, ProblemAnswerAttempt } from "./types";
import { PracticeView } from "./PracticeView";
import { ResultsView } from "./ResultsView";
import { Progress } from "@/components/ui/progress";
import { ProblemDisplay } from "./ProblemDisplay";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { ModalLoader } from "./ModalLoader";

type InitialAssessmentModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InitialAssessmentModal({
  open,
  onClose,
}: InitialAssessmentModalProps) {
  const utils = trpc.useUtils();
  const { data: assessmentSession } =
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
        utils.assessment.getAssessmentSession.invalidate();
      },
    });

  const assessedQuestions = (assessmentSession?._count.questions ?? 0) + 1;
  const totalQuestions = 15;
  const progress = assessedQuestions / totalQuestions;

  if (problemLoading) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          onClose={onClose}
          className="max-w-full w-[90%] min-h-[90vh] md:min-h-[50vh] overflow-scroll"
        >
          <div className="p-6">
            <ModalLoader message="Se pregătește următoarea problemă..." />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        onClose={onClose}
        className="max-w-full w-[90%] min-h-[90vh] md:min-h-[50vh] overflow-scroll"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
            <h2 className="text-2xl font-bold">Test inițial</h2>
            <div className="flex flex-row gap-2 items-center">
              <span>
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
                answerAttempt={null}
                setAnswerAttempt={() => {}}
                hideInput={false}
                hintCount={0}
                showExplanation={false}
              />
            )}
          </div>

          <div className="flex flex-col md:flex-row md:justify-end items-start md:items-center gap-2 md:gap-2">
            <Button variant="outline" className="mr-2" onClick={() => {}}>
              Sari peste
            </Button>

            <Button onClick={() => {}}>
              Trimite <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
