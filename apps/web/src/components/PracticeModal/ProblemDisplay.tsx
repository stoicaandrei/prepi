import { MathJax } from "better-react-mathjax";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MultipleChoiceOption, Problem } from "@prepi/db";
import { ProblemAnswerAttempt } from ".";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type ExtendedProblem = Partial<Problem> & {
  multipleChoiceOptions: MultipleChoiceOption[];
};

type ProblemDisplayProps = {
  problem: ExtendedProblem;
  hideInput?: boolean;
  answerAttempt: ProblemAnswerAttempt | null;
  setAnswerAttempt: (attempt: ProblemAnswerAttempt) => void;
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function ProblemDisplay({
  problem,
  hideInput,
  answerAttempt,
  setAnswerAttempt,
}: ProblemDisplayProps) {
  const [shuffledOptions, setShuffledOptions] = useState<
    MultipleChoiceOption[]
  >([]);

  useEffect(() => {
    if (problem?.type === "MULTIPLE_CHOICE") {
      setShuffledOptions(shuffleArray(problem.multipleChoiceOptions));
    }
  }, [problem]);

  if (hideInput) {
    return (
      <p className="text-lg mb-4">
        <MathJax>{problem?.description}</MathJax>
      </p>
    );
  }

  return (
    <>
      <p className="text-lg mb-4">
        <MathJax>{problem?.description}</MathJax>
      </p>
      {problem?.type === "MULTIPLE_CHOICE" && (
        <RadioGroup
          value={answerAttempt?.answerId ?? ""}
          onValueChange={(value) => setAnswerAttempt?.({ answerId: value })}
          className="space-y-4"
        >
          {shuffledOptions.map((choice) => (
            <div key={choice.id} className="flex items-center space-x-3">
              <RadioGroupItem
                value={choice.id}
                id={choice.id}
                className="h-6 w-6 border-2 border-primary text-primary focus:ring-primary"
              />
              <Label
                htmlFor={choice.id}
                className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <MathJax
                  inline
                  text={choice.text}
                  renderMode="pre"
                  typesettingOptions={{ fn: "tex2chtml" }}
                />
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {problem?.type === "SINGLE_ANSWER" && (
        <div className="w-1/2">
          <Input
            type="text"
            value={answerAttempt?.singleAnswerText}
            onChange={(e) =>
              setAnswerAttempt({ singleAnswerText: e.target.value })
            }
            className="w-full text-lg py-3 px-4"
            placeholder="Introduceți răspunsul aici"
            autoFocus
          />
        </div>
      )}
    </>
  );
}
