"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { SubmissionStatus } from "./ProblemsProgress";
import { PracticeSessionResults, ProblemAnswerAttempt } from "./types";
import { PracticeView } from "./PracticeView";
import { ResultsView } from "./ResultsView";

type PracticeModalProps = {
  open: boolean;
  onClose: () => void;
  subjectId: string;
};

export function PracticeModal({
  open,
  onClose,
  subjectId,
}: PracticeModalProps) {
  const utils = trpc.useUtils();
  const { data: problems } = trpc.practice.listProblemsBySubject.useQuery(
    subjectId,
    {
      enabled: !!subjectId,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    },
  );

  const recordPracticeSession = trpc.practice.recordPracticeSession.useMutation(
    {
      onSuccess: (results) => {
        setPracticeResults(results);
        utils.practice.listSubjectsProgress.invalidate();
      },
    },
  );
  const [practiceResults, setPracticeResults] =
    useState<PracticeSessionResults>();

  const repeatPractice = () => {
    setCurrentProblemIndex(0);
    setSubmissions([]);
    setPracticeResults(undefined);

    utils.practice.listProblemsBySubject.reset(subjectId);
  };

  const [submissions, setSubmissions] = useState<SubmissionStatus[]>([]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  const practiceFinished =
    !!problems?.length && currentProblemIndex === problems.length;

  useEffect(() => {
    if (practiceFinished) {
      const problemsToRecord = problems?.map((problem, index) => ({
        problemId: problem.id,
        correct: submissions[index] === SubmissionStatus.CORRECT,
      }));

      recordPracticeSession.mutate({
        subjectId,
        problems: problemsToRecord,
      });
    }
  }, [practiceFinished]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        onClose={onClose}
        className="max-w-full w-[90%] min-h-[90vh] md:min-h-[50vh] overflow-scroll"
      >
        {practiceFinished && (
          <ResultsView
            practiceResults={practiceResults}
            submissions={submissions}
            onClose={onClose}
            onRepeat={repeatPractice}
            onNext={repeatPractice}
          />
        )}
        {!practiceFinished && (
          <PracticeView
            currentProblemIndex={currentProblemIndex}
            problems={problems ?? []}
            setCurrentProblemIndex={setCurrentProblemIndex}
            setSubmissions={setSubmissions}
            submissions={submissions}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
