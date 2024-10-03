"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Files,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function ExamCard() {
  return (
    <div>
      <Link href="/exams">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la variante
        </Button>
      </Link>

      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Files className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-2xl font-semibold text-blue-500">
                Varianta 1
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam
            porro nisi harum vel, velit numquam incidunt mollitia deserunt nobis
            laborum.
          </p>
          <p>
            Vel quae dolore corrupti vitae optio dignissimos dolores, accusamus
            mollitia assumenda quam incidunt totam suscipit, fugit reiciendis
            sint excepturi temporibus.
          </p>
          <p>
            Necessitatibus quaerat autem facilis ab similique enim suscipit
            mollitia expedita repellendus, aspernatur, asperiores sunt nemo ad
            exercitationem sint officia quo.
          </p>
          <p>
            Iure aliquid quis harum fugit autem? Vel dicta rem, dolor qui
            officiis cupiditate aut quae quisquam minima quasi earum nostrum!
          </p>
          <p>
            Delectus recusandae sapiente dolorum, minima quo ducimus
            perspiciatis consequatur fugit tenetur doloremque quae nihil
            aspernatur impedit, blanditiis consectetur, at eligendi!
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-6">
        <Link href="/exams">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la variante
          </Button>
        </Link>
      </div>
    </div>
  );
}
