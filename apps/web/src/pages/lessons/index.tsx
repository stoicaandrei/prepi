"use client";

import { BookOpen, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MathPlatformCardExpanded() {
  return (
    <div>
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-semibold text-blue-500">
                Lectii
              </span>
            </div>
            <div className="w-full max-w-xs">
              <Input type="search" placeholder="Caută..." className="w-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Collapsible defaultOpen>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-semibold text-blue-500"
                  >
                    Ecuații și inecuații
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1">
                  {[
                    "Modulul unui număr real",
                    "Ecuația de gradul al II-lea cu coeficienți reali",
                    "Inecuații",
                    "Puteri și radicali",
                    "Logaritmul unui număr real pozitiv",
                    "Numere complexe",
                    "Elemente de trigonometrie",
                    "Ecuații",
                    "Exponentul unui număr real pozitiv",
                    "Partea întreagă și partea fracționară a unui număr real",
                  ].map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-normal text-gray-600 hover:text-blue-500"
                    >
                      {item}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              {[
                "Progresii",
                "Șiruri",
                "Funcții",
                "Limite",
                "Derivate",
                "Primitive",
                "Integrale",
              ].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="w-full justify-between text-gray-600 hover:text-blue-500"
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              {[
                "Matrice",
                "Grupuri",
                "Inele și corpuri",
                "Sisteme de ecuații",
                "Geometrie",
                "Combinatorică",
                "Permutări",
              ].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="w-full justify-between text-gray-600 hover:text-blue-500"
                >
                  {item}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
