import { cn } from "@/lib/utils";
import { CheckIcon, XIcon, HelpCircleIcon } from "lucide-react";

enum SubmissionStatus {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  HINT = "HINT",
  UNATTEMPTED = "UNATTEMPTED",
}

interface ProblemsProgressProps {
  submissions: SubmissionStatus[];
  total: number;
  displayMode?: "default" | "large";
}

function getStatusIcon(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.CORRECT:
      return <CheckIcon className="w-full h-full text-primary-foreground" />;
    case SubmissionStatus.INCORRECT:
      return <XIcon className="w-full h-full text-primary-foreground" />;
    case SubmissionStatus.HINT:
      return (
        <HelpCircleIcon className="w-full h-full text-primary-foreground" />
      );
    default:
      return null;
  }
}

export function ProblemsProgress({
  submissions,
  total,
  displayMode = "default",
}: ProblemsProgressProps) {
  const current = submissions.length;

  return (
    <div
      className={cn(
        "flex items-center",
        displayMode === "default" ? "space-x-2" : "space-x-4"
      )}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, index) => {
        const status = submissions[index] || SubmissionStatus.UNATTEMPTED;
        return (
          <div
            key={index}
            className={cn(
              "rounded-full transition-all duration-300 ease-in-out flex items-center justify-center",
              displayMode === "default"
                ? "w-5 h-5 sm:w-6 sm:h-6"
                : "w-20 h-20 sm:w-24 sm:h-24",
              status !== SubmissionStatus.UNATTEMPTED
                ? "bg-primary"
                : "bg-secondary"
            )}
          >
            {getStatusIcon(status)}
          </div>
        );
      })}
    </div>
  );
}
