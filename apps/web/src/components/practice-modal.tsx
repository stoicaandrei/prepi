"use client";

import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/utils/trpc";
import { MathJax } from "better-react-mathjax";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

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
  const problems = trpc.practice.listProblemsBySubject.useQuery(subjectId, {
    enabled: !!subjectId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const currentProblem = problems.data?.[0];

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answer, setAnswer] = useState("");

  const [hintCount, setHintCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-[90%] h-[90vh] md:h-[50vh]">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Modul de exersare {problems.isLoading ? "..." : ""}
            </h2>
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === 0 ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg mb-4">
              <MathJax>{currentProblem?.description}</MathJax>
            </p>
            {currentProblem?.type === "MULTIPLE_CHOICE" && !showExplanation && (
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-2"
              >
                {currentProblem.multipleChoiceOptions.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice.id} id={choice.id} />
                    <Label htmlFor={choice.id}>{choice.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg">x ∈</span>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-grow"
                placeholder="Introduceți răspunsul aici"
                autoFocus={false}
              />
            </div> */}

            {!!hintCount && !showExplanation && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Indicații:</h3>
                <ol className="list-decimal list-outside pl-4">
                  {currentProblem?.hints.slice(0, hintCount).map((hint) => (
                    <li key={hint.id} className="mb-1">
                      <MathJax>{hint.content}</MathJax>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {showExplanation && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <MathJax>{currentProblem?.explanation.content}</MathJax>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center">
            {!showExplanation && (
              <>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setHintCount((prev) => prev + 1)}
                  disabled={hintCount === currentProblem?.hints.length}
                >
                  {hintCount ? "Următorul pas" : "Indicații"}
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setShowExplanation(true)}
                >
                  Vezi rezolvare
                </Button>
                <Button disabled={!selectedAnswer}>
                  Trimite <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {showExplanation && <Button onClick={() => {}}>Următorul</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
