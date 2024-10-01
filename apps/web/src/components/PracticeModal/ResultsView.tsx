import { Button } from "@/components/ui/button";
import { ProblemsProgress, SubmissionStatus } from "./ProblemsProgress";
import { PracticeSessionResults } from "./types";

type ResultsViewProps = {
  practiceResults?: PracticeSessionResults;
  submissions: SubmissionStatus[];
  onClose: () => void;
  onRepeat: () => void;
  onNext: () => void;
};

export const ResultsView = ({
  practiceResults,
  submissions,
  onClose,
  onRepeat,
  onNext,
}: ResultsViewProps) => {
  if (!practiceResults) return "...";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Felicitări!</h2>

      <h2 className="text-4xl font-bold text-center mb-8">
        Ai terminat testul!
      </h2>

      <div className="flex justify-center space-x-8 mb-8">
        {/* <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Scor</p>
          <p className="text-3xl font-bold">-%</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Performanță</p>
          <p className="text-3xl font-bold text-green-500">+-%</p>
        </div> */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Puncte</p>
          <p className="text-3xl font-bold text-blue-500">
            + {practiceResults?.pointsEarned ?? 0}
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <ProblemsProgress
          submissions={submissions}
          total={submissions.length}
          displayMode="large"
        />
      </div>

      <div className="flex justify-center space-x-8">
        <Button variant="outline" onClick={onClose}>
          Închide
        </Button>
        <Button variant="outline" onClick={onRepeat}>
          Repetă capitol
        </Button>
        {/* <Button onClick={onNext}>Următorul test: Mulțimi</Button> */}
      </div>
    </div>
  );
};
