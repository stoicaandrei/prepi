import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const exams = [
  {
    id: "1",
    year: "2024",
    session: "Toamna",
    title: "Matematica",
    difficulty: "M1",
  },
  {
    id: "2",
    year: "2024",
    session: "Vara",
    title: "Matematica",
    difficulty: "M1",
  },
  {
    id: "3",
    year: "2024",
    session: "Speciala",
    title: "Matematica",
    difficulty: "M1",
  },
  {
    id: "4",
    year: "2009",
    title: "Variant 1",
    difficulty: "M1",
  },
];

const difficulties = ["M1", "M2", "M3", "M4"];

const ExamsPage = () => {
  const [difficulty, setDifficulty] = useState("M1");

  return (
    <div className="py-8">
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <h1 className="text-base font-semibold leading-7 text-gray-900">
          Subiecte Bac
        </h1>
        <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
          {difficulties.map((diff) => (
            <a
              href="#"
              onClick={() => setDifficulty(diff)}
              className={`text-${difficulty === diff ? "indigo" : "gray"}-700`}
            >
              {diff}
            </a>
          ))}
        </div>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {exams.map((exam) => (
          <li
            key={exam.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap"
          >
            <div>
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={"#"} className="hover:underline">
                  {exam.year} - {exam.session ?? exam.title}
                </a>
              </p>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p>
                  <a href={"#"} className="hover:underline">
                    {exam.difficulty}
                  </a>
                </p>
                {/* <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p>
                  <time dateTime={discussion.dateTime}>{discussion.date}</time>
                </p> */}
              </div>
            </div>
            <dl className="flex w-full flex-none justify-between gap-x-8 sm:w-auto">
              <div className="flex w-16 gap-x-2.5">
                <dt>
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-gray-400"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">{100}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamsPage;
