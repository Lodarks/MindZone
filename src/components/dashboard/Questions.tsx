import React from "react";
import { Progress } from "../ui/progress";
import Link from "next/link";
import { questionProgressList } from "@/assets/mockdata/progresses/questionProgress";

const Questions = () => {
  return (
    <section className="bg-white dark:bg-zinc-900 shadow p-4 text-center space-y-3 rounded-md">
      <h1 className="font-semibold text-xl">Anketler</h1>
      <ul className="flex flex-col sm:flex-row gap-3">
        {questionProgressList.map((question, index) => (
          <Link
            href={`/question/${index + 1}`}
            className="bg-white dark:bg-zinc-900 shadow p-4 rounded-md flex-1 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out"
            key={`question${index}`}
          >
            <div>Anket {index + 1}</div>
            <div className="flex items-center gap-4">
              <div>{question.progress === 100 ? "✅" : question.locked ? "🔒" : "🔵"}</div>
              <div className="flex flex-col flex-1">
                <Progress value={question.progress} />
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </section>
  );
};

export default Questions;
