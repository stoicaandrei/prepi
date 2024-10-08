import { compareEqs } from "@prepi/utils";
import { ExtendedProblem, ProblemAnswerAttempt } from "./types";

export const isReadyToSubmit = (
  problem: ExtendedProblem | undefined,
  attempt: ProblemAnswerAttempt | null,
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

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const checkAnswerAttempt = (
  problem: ExtendedProblem,
  attempt: ProblemAnswerAttempt,
) => {
  if (problem.type === "MULTIPLE_CHOICE") {
    const selectedAnswer = problem.multipleChoiceOptions.find(
      (option) => option.id === attempt?.answerId,
    );
    return selectedAnswer?.isCorrect ?? false;
  }
  if (problem.type === "SINGLE_ANSWER") {
    return compareEqs(
      attempt?.singleAnswerText ?? "",
      problem.singleAnswer?.correctAnswer ?? "",
    );
  }
  if (problem.type === "MULTIPLE_VARIABLES") {
    return Object.entries(attempt?.multipleVariableValues ?? {}).every(
      ([variableId, value]) => {
        const variable = problem.variables.find(
          (variable) => variable.id === variableId,
        );
        return compareEqs(value, variable?.correctAnswer ?? "");
      },
    );
  }
};
