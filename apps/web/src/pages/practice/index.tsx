"use client";

import { PracticeModal } from "@/components/practice-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";

export default function MathPracticeInteractive() {
  const subjectsByCategories = trpc.practice.listSubjectsByCategory.useQuery();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  return (
    <div className="space-y-4">
      {/* <Card className="w-full bg-gradient-to-r from-blue-400 to-teal-400 text-white">
        <CardContent className="flex justify-between items-center p-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Începe cu testul inițial!
            </h2>
            <p>Durează aproximativ 30 de minute.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Haide!
              </Button>
            </DialogTrigger>
            <PracticeModal />
          </Dialog>
        </CardContent>
      </Card> */}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-blue-500">
            <CheckSquare className="mr-2" />
            Exersează {subjectsByCategories.isLoading ? "..." : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: Remove this dumb filter */}
          {subjectsByCategories.data
            ?.filter((cat) => cat.subjects.length)
            .map((category) => (
              <Collapsible key={category.id} open>
                <CollapsibleTrigger asChild>
                  <Button
                    key={category.name}
                    variant="ghost"
                    className="w-full p-4 h-auto flex items-center justify-between hover:bg-gray-100"
                    onClick={() =>
                      console.log(`Opening ${category.name} category`)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-lg font-medium">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        Ai rezolvat 0/0 probleme
                        <span className="hidden sm:inline">
                          din această categorie
                        </span>
                      </span>
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {category.subjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant="ghost"
                      className="w-full justify-between p-2 h-auto hover:bg-gray-100"
                      onClick={() => setSelectedSubjectId(subject.id)}
                    >
                      <span>{subject.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          0/{subject._count.problems} exerciții rezolvate
                        </span>
                        <span className="text-sm text-blue-500">0%</span>
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          <PracticeModal
            open={!!selectedSubjectId}
            onClose={() => setSelectedSubjectId(null)}
            subjectId={selectedSubjectId ?? ""}
          />
        </CardContent>
      </Card>
    </div>
  );
}
