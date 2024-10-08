"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

export default function TesterDashboardPage() {
  const resetInitialAssessmentSession =
    trpc.tester.resetInitialAssessmentSession.useMutation();
  const resetSubjectProgress = trpc.tester.resetSubjectProgress.useMutation();
  const randomizeSubjectProgress =
    trpc.tester.randomizeSubjectProgress.useMutation();

  return (
    <div>
      <h1>Tester Dashboard</h1>
      <Button onClick={() => resetInitialAssessmentSession.mutate()}>
        Reset Initial Test {resetInitialAssessmentSession.isLoading ?? "..."}
      </Button>
      <Button onClick={() => resetSubjectProgress.mutate()}>
        Reset Skills {resetSubjectProgress.isLoading ?? "..."}
      </Button>{" "}
      <Button onClick={() => randomizeSubjectProgress.mutate()}>
        randomizeSubjectProgress {randomizeSubjectProgress.isLoading ?? "..."}
      </Button>
    </div>
  );
}
