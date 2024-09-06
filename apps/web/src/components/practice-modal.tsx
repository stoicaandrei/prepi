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

export function PracticeModal() {
  const [answer, setAnswer] = useState("");
  const [showHints, setShowHints] = useState(false);

  const hints = [
    "Gândiți-vă la proprietățile valorii absolute.",
    "Considerați cazurile când x este mai mare sau egal cu 3 și când x este mai mic decât 3.",
    "Rezolvați ecuația pentru fiecare caz și combinați rezultatele.",
  ];

  return (
    <DialogContent className="">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Modul de exersare</h2>
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
            Pentru ce x este adevărată relația |x − 3| = x − 3?
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg">x ∈</span>
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-grow"
              placeholder="Introduceți răspunsul aici"
              autoFocus={false}
            />
          </div>

          {showHints && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Indicații:</h3>
              <ol className="list-decimal list-inside">
                {hints.map((hint, index) => (
                  <li key={index} className="mb-1">
                    {hint}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="flex justify-end items-center">
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? "Ascunde indicații" : "Indicații"}
          </Button>
          <Button variant="outline" className="mr-2">
            Vezi rezolvare
          </Button>
          <Button>
            Trimite <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
