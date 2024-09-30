import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";

export default function TestPage() {
  const utils = trpc.useUtils();
  const { data: categoriesWithSubjects, isLoading: dataLoading } =
    trpc.admin.subject.listCategoriesWithSubjects.useQuery();

  const updateSubjectCategory =
    trpc.admin.subject.updateSubjectCategory.useMutation({
      onMutate: (input) => {
        utils.admin.subject.listCategoriesWithSubjects.setData(
          undefined,
          (prev) => {
            if (!prev) return prev;
            return prev.map((category) => {
              if (category.id === input.id) {
                return {
                  ...category,
                  enabled: input.enabled,
                };
              }
              return category;
            });
          },
        );
      },
    });
  const updateSubject = trpc.admin.subject.updateSubject.useMutation({
    onMutate: (input) => {
      utils.admin.subject.listCategoriesWithSubjects.setData(
        undefined,
        (prev) => {
          if (!prev) return prev;
          return prev.map((category) => {
            return {
              ...category,
              subjects: category.subjects.map((subject) => {
                if (subject.id === input.id) {
                  return {
                    ...subject,
                    enabled: input.enabled,
                  };
                }
                return subject;
              }),
            };
          });
        },
      );
    },
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        Subject Categories {dataLoading && "..."}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {categoriesWithSubjects?.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{category.name}</span>
                <Checkbox
                  checked={category.enabled}
                  onCheckedChange={() => {
                    updateSubjectCategory.mutate({
                      id: category.id,
                      enabled: !category.enabled,
                    });
                  }}
                  aria-label={`Toggle ${category.name} category`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4 space-y-2">
                {category.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between"
                  >
                    <Label htmlFor={`toggle-${subject.id}`} className="text-sm">
                      {subject.name}
                    </Label>
                    <Checkbox
                      id={`toggle-${subject.id}`}
                      checked={subject.enabled}
                      onCheckedChange={() => {
                        updateSubject.mutate({
                          id: subject.id,
                          enabled: !subject.enabled,
                        });
                      }}
                      disabled={!category.enabled}
                      aria-label={`Toggle ${subject.name} subject`}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
