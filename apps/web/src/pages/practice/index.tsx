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
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

export default function MathPracticeInteractive() {
  return (
    <div className="space-y-4">
      <Card className="w-full bg-gradient-to-r from-blue-400 to-teal-400 text-white">
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
            {/* <DialogContent>
              <DialogHeader>
                <DialogTitle>Hello there</DialogTitle>
                <DialogDescription>hmm</DialogDescription>
              </DialogHeader>
              <div>main content is here</div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent> */}
          </Dialog>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-blue-500">
            <CheckSquare className="mr-2" />
            Exersează
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Este recomandat să începi cu testul inițial, pentru a-i arăta
            Asistentului Prepi cum stai la fiecare capitol din materia pentru
            BAC.
          </p>

          {[
            { name: "Mulțimi", progress: 0, total: 75 },
            { name: "Radicali", progress: 0, total: 63 },
            { name: "Logaritmi", progress: 0, total: 13 },
          ].map((topic) => (
            <Button
              key={topic.name}
              variant="ghost"
              className="w-full p-4 h-auto flex items-center justify-between hover:bg-gray-100"
              onClick={() => console.log(`Opening ${topic.name} category`)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-lg font-medium">{topic.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  Ai rezolvat {topic.progress}/{topic.total} probleme
                  <span className="hidden sm:inline">
                    din această categorie
                  </span>
                </span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <PlayCircle className="text-blue-500 w-6 h-6" />
                </div>
              </div>
            </Button>
          ))}

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
              >
                <span className="text-lg font-medium">
                  Ecuații și inecuații
                </span>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {[
                { name: "Mulțimi", total: 75 },
                { name: "Radicali", total: 63 },
                { name: "Logaritmi", total: 13 },
                { name: "Exponențiale", total: 14 },
                { name: "Numere complexe", total: 64 },
              ].map((subtopic) => (
                <Button
                  key={subtopic.name}
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto hover:bg-gray-100"
                  onClick={() => console.log(`Opening ${subtopic.name} page`)}
                >
                  <span>{subtopic.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      0/{subtopic.total} exerciții rezolvate
                    </span>
                    <span className="text-sm text-blue-500">0%</span>
                  </div>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {["Progresii", "Funcții"].map((topic) => (
            <Button
              key={topic}
              variant="ghost"
              className="w-full justify-between p-4 h-auto"
              onClick={() => console.log(`Opening ${topic} category`)}
            >
              <span className="text-lg font-medium">{topic}</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
