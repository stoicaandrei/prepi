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
