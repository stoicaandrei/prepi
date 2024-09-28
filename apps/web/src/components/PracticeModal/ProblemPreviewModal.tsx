import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { isCuid } from "@prepi/utils";
import { useState } from "react";
import { Label } from "../ui/label";
import { ProblemDisplay } from "./ProblemDisplay";
import { Button } from "../ui/button";

type ProblemPreviewModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ProblemPreviewModal = ({
  open,
  onClose,
}: ProblemPreviewModalProps) => {
  const [problemId, setProblemId] = useState("");

  const getProblemById = trpc.practice.getProblemById.useQuery(problemId, {
    enabled: isCuid(problemId),
  });
  const problem = getProblemById.data;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-[90%] min-h-[90vh] md:min-h-[50vh]">
        <div className="space-y-4">
          <div className="text-xl">Preview Problem</div>
          <div>
            <Label htmlFor="problemId">Problem ID</Label>
            <Input
              value={problemId}
              onChange={(e) => setProblemId(e.target.value)}
            />
            <Button onClick={() => getProblemById.refetch()}>Refetch</Button>
          </div>
          {getProblemById.isFetching && <p>Loading...</p>}
          {getProblemById.error && (
            <p style={{ color: "red" }}>{getProblemById.error.message}</p>
          )}
          {problem && (
            <ProblemDisplay
              problem={problem}
              hintCount={problem.hints.length}
              showExplanation
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
