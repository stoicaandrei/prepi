import { MathJax } from "better-react-mathjax";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MultipleChoiceOption, Problem, ProblemVariable } from "@prepi/db";
import { ExtendedProblem, ProblemAnswerAttempt } from "./types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MathInput from "../MathInput";
import { shuffleArray } from "./utils";

type ProblemDisplayProps = {
  problem: ExtendedProblem;
  hideInput?: boolean;
  answerAttempt?: ProblemAnswerAttempt | null;
  setAnswerAttempt?: Dispatch<SetStateAction<ProblemAnswerAttempt | null>>;
  hintCount?: number;
  showExplanation?: boolean;
};

export function ProblemDisplay({
  problem,
  hideInput,
  answerAttempt,
  setAnswerAttempt,
  hintCount,
  showExplanation,
}: ProblemDisplayProps) {
  const [shuffledOptions, setShuffledOptions] = useState<
    MultipleChoiceOption[]
  >([]);

  useEffect(() => {
    if (problem?.type === "MULTIPLE_CHOICE") {
      setShuffledOptions(shuffleArray(problem.multipleChoiceOptions));
    }
  }, [problem]);

  return (
    <>
      {/* Display Section */}
      <p className="text-lg mb-4">
        {/* I don't understand why the key fix worked, but don't remove it */}
        <MathJax key={problem?.description}>{problem?.description}</MathJax>
      </p>

      {/* Inputs Section */}
      {problem?.type === "MULTIPLE_CHOICE" && !hideInput && (
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

      {problem?.type === "SINGLE_ANSWER" && !hideInput && (
        <div className="w-1/2">
          <MathInput
            inputValue={answerAttempt?.singleAnswerText || ""}
            onInputChange={(latex) =>
              setAnswerAttempt?.({ singleAnswerText: latex })
            }
            mathSymbolButtons={problem.mathSymbolButtons}
            className="w-full text-lg px-4"
            autoFocus
          />
        </div>
      )}

      {problem?.type === "MULTIPLE_VARIABLES" &&
        !hideInput &&
        problem.variables && (
          <div className="space-y-6">
            {problem.variables.slice(0, 4).map((variable, index) => (
              <div key={variable.id} className="w-1/2">
                <Label className="block mb-2">
                  <MathJax inline>{variable.variableName}</MathJax>
                </Label>
                <MathInput
                  inputValue={
                    answerAttempt?.multipleVariableValues?.[variable.id] || ""
                  }
                  onInputChange={(latex) =>
                    setAnswerAttempt?.((ans) => ({
                      multipleVariableValues: {
                        ...ans?.multipleVariableValues,
                        [variable.id]: latex,
                      },
                    }))
                  }
                  mathSymbolButtons={problem.mathSymbolButtons}
                  className="w-full text-lg px-4"
                  autoFocus={index === 0}
                  tabIndex={index + 1}
                />
              </div>
            ))}
          </div>
        )}

      {/* Explanations Section */}
      {!!hintCount && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Indicații:</h3>
          <ol className="list-decimal list-outside pl-4">
            {problem?.hints.slice(0, hintCount).map((hint) => (
              <li key={hint.id} className="mb-1">
                <MathJax>{hint.content}</MathJax>
              </li>
            ))}
          </ol>
        </div>
      )}

      {showExplanation && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <MathJax key={problem?.explanation.id}>
            {problem?.explanation.content}
          </MathJax>
        </div>
      )}
    </>
  );
}
