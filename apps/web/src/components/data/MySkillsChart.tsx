"use client";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import { trpc } from "@/utils/trpc";
import { useEffect, useRef } from "react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const MySkillsChart = () => {
  const { data: subjects, isLoading: subjectsLoading } =
    trpc.practice.listSubjectsByCategory.useQuery();
  const { data: subjectsProgress, isLoading: subjectsProgressLoading } =
    trpc.practice.listSubjectsProgress.useQuery();

  type CategoryProgress = {
    name: string;
    totalProblems: number;
    completedProblems: number;
    completedPercentage?: number;
    currentMasteryLevel?: number;
  };
  const categories: CategoryProgress[] = [];

  if (subjects) {
    for (const category of subjects) {
      let totalProblems = 0;
      let completedProblems = 0;
      const possibleMastery = category.subjects.length;
      let masterySum = 0;
      for (const subject of category.subjects) {
        const progress = subjectsProgress?.find(
          (p) => p.subjectId === subject.id,
        );
        totalProblems += subject._count.problems;
        completedProblems += progress?._count.completedProblems || 0;
        masterySum += progress?.masteryLevel ?? 0;
      }
      if (masterySum > 0)
        categories.push({
          name: category.name,
          totalProblems,
          completedProblems,
          completedPercentage: (completedProblems / totalProblems) * 100,
          currentMasteryLevel: (masterySum / possibleMastery) * 100,
        });
    }
  }

  return (
    <div className="relative">
      {/* Background image with grayscale filter */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/illustrations/books-and-symbols.png)",
          filter: "grayscale(100%)",
          opacity: 0.1, // Adjust this value to control the background intensity
        }}
      ></div>

      {/* Chart content */}
      <div className="relative z-10">
        <PolarArea
          data={{
            labels: categories.map((c) => c.name),
            datasets: [
              {
                data: categories.map((c) => c.currentMasteryLevel),
                backgroundColor: [
                  "rgb(255, 99, 132)",
                  "rgb(75, 192, 192)",
                  "rgb(255, 205, 86)",
                  "rgb(201, 203, 207)",
                  "rgb(54, 162, 235)",
                ],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title: (context) => {
                    const index = context[0].dataIndex;
                    const category = categories[index];
                    const mastery = category.currentMasteryLevel?.toFixed(0);

                    return `${context[0].label} (competență ${mastery}%)`;
                  },
                  label: (context) => {
                    const index = context.dataIndex;
                    const category = categories[index];

                    return `${category.completedProblems}/${category.totalProblems} probleme`;
                  },
                },
              },
            },
            scales: {
              r: {
                ticks: {
                  stepSize: 20,
                },
                max: 100,
                min: 0,
                beginAtZero: true,
              },
            },
            animation: {
              animateRotate: true,
              animateScale: true,
            },
          }}
        />
      </div>
    </div>
  );
};
