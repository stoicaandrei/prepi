import {
  MathSymbolButton,
  MultipleChoiceOption,
  Problem,
  ProblemExplanation,
  ProblemHint,
  ProblemVariable,
  SingleAnswer,
} from "@prepi/db";

export type ExtendedProblem = Partial<Problem> & {
  multipleChoiceOptions: MultipleChoiceOption[];
  singleAnswer: SingleAnswer | null;
  variables: ProblemVariable[];
  mathSymbolButtons: MathSymbolButton[];
  hints: ProblemHint[];
  explanation: ProblemExplanation;
};

export enum SubmissionStatus {
  CORRECT = "CORRECT",
  INCORRECT = "INCORRECT",
  HINT = "HINT",
  UNATTEMPTED = "UNATTEMPTED",
}

export type ProblemAnswerAttempt = {
  answerId?: string;
  singleAnswerText?: string;
  multipleVariableValues?: Record<string, string>;
};

export type PracticeSessionResults = {
  pointsEarned: number;
};
