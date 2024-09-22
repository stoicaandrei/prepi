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
}: ProblemsProgressProps) {
  const current = submissions.length;

  return (
    <div
      className="flex items-center space-x-2"
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
              "w-6 h-6 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center",
              "sm:w-8 sm:h-8",
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
