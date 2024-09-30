"use client";

import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function ExamVariantsResponsive() {
  const variants = [
    "Subiect și rezolvare M1 2017 (Varianta 4)",
    "Model și rezolvare M1 2015",
    "Subiect și rezolvare M1 2015 (Varianta 8)",
    "Subiect și rezolvare M1 2017 (Varianta 9)",
    "Subiect și rezolvare M1 2015 (Varianta 3)",
    "Subiect și rezolvare M1 2016 (Varianta 9)",
    "Model și rezolvare M1 2018",
    "Subiect și rezolvare M1 2016 (Varianta 1)",
    "Subiect și rezolvare M1 2017 (Varianta 2)",
    "Model și rezolvare M1 2016",
    "Model și rezolvare M1 2017",
    "Model și rezolvare M1 2019",
    "Subiect și rezolvare M1 2018 (Varianta 3)",
    "Subiect și rezolvare M1 2018 (Varianta 3)",
    "Simulare și rezolvare M1 2016",
    "Simulare și rezolvare M1 2017",
    "Simulare și rezolvare M1 2018",
    "Subiect și rezolvare M1 2016 (Varianta 2)",
    "Subiect și rezolvare M1 2016 (Varianta 8)",
    "Subiect și rezolvare M1 2018 (Varianta 2)",
    "Subiect și rezolvare M1 2017 (Varianta 10)",
    "Subiect și rezolvare M1 august 2018 (Varianta 9)",
    "Simulare și rezolvare M1 2015",
    "Subiect și rezolvare M1 2015 (Varianta 1)",
    "Subiect și rezolvare M1 2016 (Varianta 5)",
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-blue-500">Variante</h1>
          </div>
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Caută..." className="pl-8 w-full" />
          </div>
        </div>
        <Tabs defaultValue="m1" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger value="m1" className="font-semibold">
              M1 (MATE-INFO)
            </TabsTrigger>
            <TabsTrigger value="m2" className="font-semibold">
              M2 (ȘTIINȚELE-NATURII)
            </TabsTrigger>
            <TabsTrigger value="m3" className="font-semibold">
              M3 (PEDAGOGIC)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variants.map((variant, index) => (
            <Link key={index} href="/exams/yes">
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start font-normal text-gray-700 hover:text-blue-500 hover:bg-blue-50"
              >
                {variant}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm text-gray-500">
        Suntem în procesul de a adăuga variante de M3, rămâi cu noi!
      </CardFooter>
    </Card>
  );
}
