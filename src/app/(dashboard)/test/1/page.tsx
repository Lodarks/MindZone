"use client";
import FinishScreen from "@/components/game/FinishScreen";
import React, { useEffect, useState } from "react";
import IntroductionsTestTwo from "./_introductions";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  InitPerformanceData,
  PerformanceData,
} from "@/lib/api/performanceTasks";
import { useSendPerformanceTaskData } from "@/hooks/useSendData";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "O",
  "P",
  "R",
  "S",
  "T",
  "U",
  "V",
  "Y",
  "Z",
];

const TOTAL_ROUNDS = 400;

const DURATION = 1300;

const CHANCE_OF_LETTER = 0.4;

const PerformanceTestPageTwo = () => {
  const [round, setRound] = React.useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);

  const [correct, setCorrect] = useState<number>(0);

  const [isBreakActive, setIsBreakActive] = useState<boolean>(true);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [current, setCurrent] = useState<string | null>(null);

  const [history, setHistory] = useState<string[]>([]);

  const [roundStartTime, setRoundStartTime] = useState<Date>(new Date());

  const [timer, setTimer] = useState<number>(0);
  const [timeout, setMyTimeout] = useState<NodeJS.Timeout | null>(null);
  const [stats, setStats] = useState<PerformanceData>(InitPerformanceData);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      location.reload();
    }
  };

  useEffect(() => {
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
        false
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { send, isSending } = useSendPerformanceTaskData();

  useEffect(() => {
    if (round === 0 || isFinished || (correct === 1 && isBreakActive)) {
      return;
    }

    const timeout = setTimeout(
      () => {
        if (history[history.length - 3] === current) {
          setStats((prev) => ({
            ...prev,
            missing: prev.missing + 1,
          }));
        }

        nextRound();
      },
      current ? DURATION : 500
    );

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    console.log(stats.missing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (!isFinished) {
      return;
    }

    send({
      stats,
      step: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const nextRound = () => {
    if (round >= TOTAL_ROUNDS) {
      setStats((prev) => ({
        ...prev,
        reactionTime: timer,
      }));
      setIsFinished(true);
      return;
    }

    if (correct === 1 && isBreakActive) {
      return;
    }

    setRound((prev) => prev + 1);

    if (current) {
      setCurrent(null);
      return;
    }

    const percentage = (round * 100) / TOTAL_ROUNDS;

    // 10% of the time, select from the first third of the letters
    const letter =
      Math.random() > CHANCE_OF_LETTER
        ? LETTERS[
            Math.floor(
              Math.random() *
                (percentage < 33
                  ? LETTERS.length / 3
                  : percentage < 66
                  ? (LETTERS.length / 3) * 2
                  : LETTERS.length)
            )
          ]
        : history[history.length - 2] || "A";
    setCurrent(letter);

    setRoundStartTime(new Date());

    if (history.length < 4) setHistory((prev) => [...prev, letter]);
    else {
      setHistory((prev) => [...prev.slice(1, 5), letter]);
    }
    if (!timeout) {
      setMyTimeout(
        setInterval(() => {
          setTimer((prev) => prev + 10);
        }, 10)
      );
    }
  };

  const handleAnswer = () => {
    if (!current || history.length < 3) return;

    const diffTime = new Date().getTime() - roundStartTime.getTime();

    if (history[history.length - 3] === current) {
      setIsCorrect(true);
      setCorrect((prev) => prev + 1);
      setStats((prev) => ({
        ...prev,
        totalAccuracy: prev.totalAccuracy + 1,
        accuracyReactionTime: prev.accuracyReactionTime + diffTime,
        missing: prev.missing - 1,
      }));
    } else {
      setIsCorrect(false);
      setStats((prev) => ({
        ...prev,
        totalWrongs: prev.totalWrongs + 1,
        errorReactionTime: prev.errorReactionTime + diffTime,
      }));
    }

    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);
  };

  const finishBreak = () => {
    setCorrect(0);
    setStats(InitPerformanceData);
    setRound(1);
    setHistory([]);
    setIsBreakActive(false);
  };

  return (
    <div className='flex flex-col items-center py-10'>
      {isFinished ? (
        <FinishScreen isSending={isSending} url='/test/2' />
      ) : round === 0 ? (
        <div className='flex flex-col'>
          <IntroductionsTestTwo />
          <Separator className='my-5' />

          <div className='flex justify-center my-5'>
            <Button onClick={nextRound}>Başla</Button>
          </div>
        </div>
      ) : correct === 1 && isBreakActive ? (
        <div className='flex flex-col items-center gap-4'>
          <div>
            <span className='text-green-500'>Tebrikler! Doğru bildin.</span>{" "}
            Deneme bitti hadi oyuna geçelim
          </div>
          <Button onClick={finishBreak}>Devam Et</Button>
        </div>
      ) : (
        <div className='flex flex-col gap-7 justify-center items-center w-full'>
          {correct < 1 && isBreakActive ? (
            <div className='flex gap-2'>
              {history.map((letter, index) => (
                <span
                  key={letter + index}
                  className={cn(
                    "text-3xl font-bold min-h-20 min-w20 bg-yellow-600 rounded-sm p-5 aspect-square flex justify-center items-center",
                    {
                      "opacity-60": index !== 3,
                    }
                  )}
                >
                  {letter}
                </span>
              ))}
            </div>
          ) : (
            <span className='text-3xl font-bold min-h-20 min-w20 bg-yellow-600 rounded-sm p-5 aspect-square flex justify-center items-center'>
              {current}
            </span>
          )}

          <Button
            onClick={handleAnswer}
            variant='outline'
            className={cn("flex justify-center px-16 py-4", {
              "bg-green-500 text-white hover:bg-green-500": isCorrect === true,
              "bg-red-500 text-white hover:bg-red-500": isCorrect === false,
            })}
          >
            <EyeIcon size={36} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PerformanceTestPageTwo;
