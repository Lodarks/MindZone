"use client";
import FinishScreen from "@/components/game/FinishScreen";
import React, { use, useEffect, useState } from "react";
import WeekFourGameFourIntroductions from "./_introductions";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import {
  questions,
  questions2,
  questions3,
} from "@/assets/mockdata/weekGames/week4game4data";
import { sendWeekData, WeekData } from "@/lib/api/week";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { getUser, updateUser } from "@/lib/api/user";
import { ZodUser } from "@/lib/validators/user";

const WeekFourGameFourPage = () => {
  const [isFinished, setIsFinished] = useState(false);
  const [round, setRound] = useState(0);
  const [gameMode, setGameMode] = useState(0);
  const [isGameThreeInfo, setIsGameThreeInfo] = useState(false);

  const session = useSession();

  const [timer, setTimer] = useState<number>(0);
  const [timeout, setMyTimeout] = useState<NodeJS.Timeout | null>(null);
  const [stats, setStats] = useState<WeekData>({
    totalErrorCount: 0,
    totalAccuracy: 0,
    reactionTime: 0,
    step: 19,
    group: "W1",
  });

  const [temp, setTemp] = useState<NodeJS.Timeout | null>(null);
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      if (timeout) {
        setTemp(timeout);
        clearInterval(timeout);
        setMyTimeout(null);
      }
    } else {
      if (!timeout && temp !== null) {
        setMyTimeout(
          setInterval(() => {
            setTimer((prev) => prev + 10);
          }, 10)
        );
      }
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

  const { mutate } = useMutation({
    mutationFn: async (data: WeekData) => {
      if (!session.data) {
        return;
      }

      let user: ZodUser;
      try {
        user = await getUser({
          accessToken: session.data.user.accessToken,
          userId: session.data.user.id,
        });
      } catch (e) {
        return;
      }
      await sendWeekData(data, session.data.user.accessToken);

      await updateUser({
        accessToken: session.data.user.accessToken,
        user: {
          ...user,
          userDetails: {
            ...user.userDetails,
            WeeklyStatus: parseInt(user.userDetails.WeeklyStatus) + 1 + "",
          },
        },
      });
    },
  });

  const handleCheck = (answer: string) => {
    if (answer === questions2[round - questions.length].correct) {
      setStats((prev) => ({
        ...prev,
        totalAccuracy: prev.totalAccuracy + 1,
      }));
      handleNext();
    } else {
      setStats((prev) => ({
        ...prev,
        totalErrorCount: prev.totalErrorCount + 1,
      }));
      handleNext();
    }
  };

  useEffect(() => {
    if (round === questions.length && gameMode === 0) {
      setGameMode(1);
    }
    if (round === questions2.length + questions.length && gameMode === 1) {
      setGameMode(2);
      setIsGameThreeInfo(true);
    }
  }, [round, gameMode]);

  const handleNext = () => {
    if (
      round ===
      questions.length + questions2.length + questions3.length - 1
    ) {
      mutate({ ...stats, reactionTime: timer });
      setIsFinished(true);
      return;
    }

    if (!timeout) {
      setMyTimeout(
        setInterval(() => {
          setTimer((prev) => prev + 10);
        }, 10)
      );
    }
    setRound((prev) => prev + 1);
  };

  return (
    <div>
      {isFinished ? (
        <div className='flex justify-center items-center'>
          <FinishScreen url='/week/4/affective-empathy' />
        </div>
      ) : round === 0 ? (
        <div>
          <WeekFourGameFourIntroductions />
          <Separator className='my-5' />

          <div className='flex justify-center my-5'>
            <Button onClick={handleNext}>Başla</Button>
          </div>
        </div>
      ) : gameMode === 0 ? (
        <>
          {questions.map((question, index) => {
            if (index === round) {
              return (
                <div
                  className='flex flex-col justify-center items-center'
                  key={index}
                >
                  <h2 className='font-bold my-5'>{question.title}</h2>
                  <p className='my-3'>{question.information}</p>
                  <p>{question.question}</p>
                  <p className='my-10'>
                    Lütfen {question.title}&apos;yi ne sıklıkta kullandığınızı
                    işaretleyiniz.
                  </p>
                </div>
              );
            }
          })}
          <Separator className=' my-10' />
          <div className='flex justify-center my-5'>
            {Array.from({ length: 7 }, (_, index) => (
              <Button
                className='mx-2'
                key={index}
                onClick={handleNext}
                variant={"outline"}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </>
      ) : gameMode === 1 ? (
        <>
          {questions2.map((question, index) => {
            if (index === round - questions.length) {
              return (
                <div
                  className='flex flex-col justify-center items-center'
                  key={index}
                >
                  <h2 className='font-bold my-5'>{question.title}</h2>
                  <div className='flex flex-row my-2'>
                    {question.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => {
                          handleCheck(option);
                        }}
                        className='mx-2'
                        variant='outline'
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            }
          })}
        </>
      ) : (
        <>
          {isGameThreeInfo ? (
            <div>
              <p>Gerçekler mi Görüşler mi?</p>
              <p>
                Bazen düşünce özellikleri neyin sadece bir fikir neyin gerçek
                olduğunu ayırt etmeyi zorlaştırabilir. Görüşler özneldir -
                onları kanıtlamanın veya çürütmenin bir yolu yoktur, sadece bir
                tercihi veya bir şeye ilişkin bir bakış açısını yansıtırlar.
              </p>
              <p>
                Öte yandan, gerçekler kanıtlanabilir veya çürütülebilir.
                Gerçekler doğrudur ya da yanlıştır, kim düşünürse düşünsün ya da
                söylerse söylesin. İnsanlar bazen bir şey öyle “hissettiriyor”
                diye onun doğru olduğuna inanabilirler.{" "}
              </p>
              <p>
                Kendinizi gerçekler ve görüşler arasında ne kadar iyi ayrım
                yapabildiğiniz konusunda test edin.
              </p>
              <Separator className='my-5' />
              <div className='flex justify-center my-5'>
                <Button onClick={() => setIsGameThreeInfo(false)}>
                  Hadi Başlayalım
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {questions3[round - questions.length - questions2.length]}
              <div className='flex flex-row gap-5 my-10 justify-center items-center'>
                <Button variant={"outline"} onClick={handleNext}>
                  Doğru
                </Button>
                <Button variant={"outline"} onClick={handleNext}>
                  Yanlış
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeekFourGameFourPage;
