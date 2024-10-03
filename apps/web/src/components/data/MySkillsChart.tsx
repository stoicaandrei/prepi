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

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const MySkillsChart = () => {
  const { data: subjects, isLoading: subjectsLoading } =
    trpc.practice.listSubjectsByCategory.useQuery();
  const { data: subjectsProgress, isLoading: subjectsProgressLoading } =
    trpc.practice.listSubjectsProgress.useQuery();

  console.log(subjectsProgress);

  if (subjectsProgressLoading || subjectsLoading) {
    return <div className="w-[242px] h-[242px]">...</div>;
  }

  type CategoryProgress = {
    name: string;
    totalProblems: number;
    completedProblems: number;
    completedPercentage?: number;
  };
  const categories: CategoryProgress[] = [];

  if (subjects) {
    for (const category of subjects) {
      let totalProblems = 0;
      let completedProblems = 0;
      for (const subject of category.subjects) {
        const progress = subjectsProgress?.find(
          (p) => p.subjectId === subject.id,
        );
        totalProblems += subject._count.problems;
        completedProblems += progress?._count.completedProblems || 0;
      }
      if (completedProblems)
        categories.push({
          name: category.name,
          totalProblems,
          completedProblems,
          completedPercentage: (completedProblems / totalProblems) * 100,
        });
    }
  }

  return (
    <>
      <PolarArea
        data={{
          labels: categories.map((c) => c.name),
          datasets: [
            {
              data: categories.map((c) => c.completedPercentage),
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
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
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
    </>
  );
};
