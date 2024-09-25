import { cn } from "@/lib/utils";
import {
  HelpCircleIcon,
  XCircleIcon,
  CheckCircle2Icon,
  CircleDotIcon,
} from "lucide-react";

export enum SubmissionStatus {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  HINT = "HINT",
  UNATTEMPTED = "UNATTEMPTED",
  ACTIVE = "ACTIVE",
}

interface ProblemsProgressProps {
  submissions: SubmissionStatus[];
  total: number;
  activeIndex?: number;
  displayMode?: "default" | "large";
}

function getStatusIcon(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.CORRECT:
      return <CheckCircle2Icon className="w-full h-full" />;
    case SubmissionStatus.INCORRECT:
      return <XCircleIcon className="w-full h-full" />;
    case SubmissionStatus.HINT:
      return <HelpCircleIcon className="w-full h-full" />;
    case SubmissionStatus.ACTIVE:
      return <CircleDotIcon className="w-full h-full" />;
    default:
      return null;
  }
}

function getStatusColor(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.CORRECT:
      return "bg-primary text-white";
    case SubmissionStatus.INCORRECT:
      return "bg-destructive text-white";
    case SubmissionStatus.HINT:
      return "bg-warning text-white";
    case SubmissionStatus.ACTIVE:
      return "bg-primary text-white";
    default:
      return "bg-secondary text-white";
  }
}

export function ProblemsProgress({
  submissions,
  total,
  activeIndex,
  displayMode = "default",
}: ProblemsProgressProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        displayMode === "default" ? "space-x-2" : "space-x-4"
      )}
      role="progressbar"
      aria-valuenow={activeIndex}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, index) => {
        let status = submissions[index] || SubmissionStatus.UNATTEMPTED;
        if (status === SubmissionStatus.UNATTEMPTED && index === activeIndex) {
          status = SubmissionStatus.ACTIVE;
        }

        return (
          <div
            key={index}
            className={cn(
              "rounded-full transition-all duration-300 ease-in-out flex items-center justify-center",
              displayMode === "default"
                ? "w-5 h-5 sm:w-6 sm:h-6"
                : "w-20 h-20 sm:w-24 sm:h-24",
              getStatusColor(status)
            )}
          >
            {getStatusIcon(status)}
          </div>
        );
      })}
    </div>
  );
}
