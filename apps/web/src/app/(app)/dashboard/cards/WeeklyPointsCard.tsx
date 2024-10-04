"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { Star } from "lucide-react";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  BarElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
);

const days = ["LU", "MA", "MI", "JO", "VI", "SA", "DU"];
const fullDays = {
  LU: "Luni",
  MA: "Marți",
  MI: "Miercuri",
  JO: "Joi",
  VI: "Vineri",
  SA: "Sâmbătă",
  DU: "Duminică",
};

export const WeeklyPointsCard = () => {
  const aWeekAgo = dayjs().subtract(7, "day").startOf("day").toDate();
  const { data: practiceHistory, isLoading: practiceHistoryLoading } =
    trpc.practice.listPracticeHistory.useQuery({
      startDate: aWeekAgo,
    });

  const labels: string[] = [];
  const today = new Date().getDay();
  for (let i = 0; i < 7; i++) {
    labels[i] = days[(i + today) % 7];
  }

  const data = practiceHistory?.reduce((acc, practice) => {
    const date = dayjs(practice.createdAt).toDate();
    const day = date.getDay();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, new Array(7).fill(0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Star className="mr-2 h-6 w-6 inline-block text-cyan-500" />
          Puncte {practiceHistoryLoading && "..."}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Bar
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: "#6badee",
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: Math.ceil(Math.max(...(data ?? [0])) * 1.5) || 1,
                ticks: {
                  stepSize: 1,
                  maxTicksLimit: 5,
                  callback: function (value, index, values) {
                    return Math.round(Number(value)).toString();
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title(tooltipItems) {
                    const index = tooltipItems[0].dataIndex;
                    const label = labels[index];
                    const fullDay = fullDays[label as keyof typeof fullDays];
                    return fullDay;
                  },
                  label: (context) => {
                    return `${context.raw} teste`;
                  },
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
