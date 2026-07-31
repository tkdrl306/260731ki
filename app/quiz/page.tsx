"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Sparkles, Trophy, ArrowRight, Play, Loader2 } from "lucide-react";

export default function QuizPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [equation, setEquation] = useState({ a: 1, b: 0, c: 1, answer: 1, str: "x = 1" });
  const [userAnswer, setUserAnswer] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // 문제 생성기 (일차방정식: ax + b = c)
  const generateEquation = () => {
    // a는 1~9
    const a = Math.floor(Math.random() * 9) + 1;
    // x는 -10~10
    const x = Math.floor(Math.random() * 21) - 10;
    // b는 -20~20
    const b = Math.floor(Math.random() * 41) - 20;
    const c = a * x + b;
    
    let bStr = "";
    if (b > 0) bStr = `+ ${b}`;
    else if (b < 0) bStr = `- ${Math.abs(b)}`;
    
    setEquation({
      a,
      b,
      c,
      answer: x,
      str: `${a === 1 ? "" : a}x ${bStr} = ${c}`
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setSubmitted(false);
    setUserAnswer("");
    generateEquation();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setGameOver(true);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying, equation]);

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userAnswer) === equation.answer) {
      setScore(score + 10);
      generateEquation();
      setUserAnswer("");
    } else {
      setUserAnswer("");
    }
  };

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("quiz_scores")
        .insert([{ player_name: playerName, score }]);
        
      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("점수 등록 실패:", error);
      alert("앗! 점수를 등록하는데 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl bg-white/90 p-8 md:p-12 rounded-[3rem] shadow-xl mt-4 md:mt-10 backdrop-blur-sm border-none">
      {!isPlaying && !gameOver && (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-pastel-lemon rounded-full flex items-center justify-center mb-6 shadow-md">
            <Sparkles className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl text-pastel-blue drop-shadow-sm mb-4">
            일차방정식 퀴즈!
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            60초 동안 최대한 많은 방정식의 <b>'x'</b> 값을 구해보세요!
          </p>
          <button 
            onClick={startGame}
            className="flex items-center gap-3 px-10 py-5 bg-pastel-mint text-slate-700 text-3xl rounded-full shadow-lg hover:scale-110 hover:bg-green-200 transition-all duration-300 group"
          >
            <Play className="w-8 h-8 text-green-600 fill-current group-hover:animate-pulse" />
            <span>도전 시작!</span>
          </button>
        </div>
      )}

      {isPlaying && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
          <div className="flex justify-between w-full mb-8 px-4">
            <div className="flex flex-col items-center bg-pastel-pink/30 px-6 py-3 rounded-3xl">
              <span className="text-slate-500 text-lg">남은 시간</span>
              <span className={`text-4xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-slate-700'}`}>
                {timeLeft}초
              </span>
            </div>
            <div className="flex flex-col items-center bg-pastel-blue/30 px-6 py-3 rounded-3xl">
              <span className="text-slate-500 text-lg">현재 점수</span>
              <span className="text-4xl font-bold text-slate-700">{score}점</span>
            </div>
          </div>

          <div className="bg-slate-50 border-4 border-pastel-lemon w-full py-12 rounded-[3rem] shadow-inner mb-8 flex justify-center">
            <h2 className="text-5xl md:text-7xl font-bold text-slate-700 tracking-wider">
              {equation.str}
            </h2>
          </div>

          <form onSubmit={handleSubmitAnswer} className="w-full max-w-sm flex flex-col gap-4">
            <div className="relative flex items-center justify-center">
              <span className="absolute left-6 text-3xl text-slate-400 font-bold">x =</span>
              <input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full text-center text-4xl py-4 pl-16 pr-6 bg-slate-100 rounded-full focus:ring-4 focus:ring-pastel-mint focus:bg-white transition-all shadow-inner outline-none border-none text-slate-700"
                placeholder="?"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {gameOver && (
        <div className="flex flex-col items-center text-center animate-in zoom-in duration-500 w-full">
          <div className="w-32 h-32 bg-pastel-pink rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl text-pastel-pink drop-shadow-sm mb-4">
            게임 종료!
          </h2>
          <p className="text-3xl text-slate-700 font-bold mb-8">
            최종 점수: <span className="text-5xl text-pastel-blue">{score}</span> 점
          </p>

          {!submitted ? (
            <form onSubmit={submitScore} className="w-full max-w-sm flex flex-col gap-4">
              <p className="text-slate-500 mb-2 text-lg">명예의 전당에 이름을 남겨보세요!</p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="이름이나 별명 입력"
                maxLength={10}
                required
                className="w-full text-center text-2xl py-4 px-6 bg-slate-100 rounded-full focus:ring-4 focus:ring-pastel-blue focus:bg-white transition-all shadow-inner outline-none border-none text-slate-700"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !playerName.trim()}
                className="flex justify-center items-center gap-2 w-full py-4 bg-pastel-blue text-white text-2xl rounded-full shadow-md hover:scale-105 hover:bg-blue-400 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-8 h-8" /> : "점수 등록하기"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <div className="px-8 py-4 bg-green-100 text-green-600 rounded-full text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" /> 점수 등록 완료!
              </div>
              <Link 
                href="/"
                className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-600 text-xl rounded-full hover:bg-slate-200 transition-colors shadow-sm"
              >
                메인으로 돌아가서 랭킹 확인 <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          )}
          
          {submitted === false && (
             <Link 
               href="/"
               className="mt-6 text-slate-400 hover:text-slate-600 underline underline-offset-4"
             >
               등록하지 않고 홈으로 가기
             </Link>
          )}
        </div>
      )}
    </div>
  );
}
