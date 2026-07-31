"use client";

import { useState, useEffect } from "react";
import { Sparkles, Trophy, Play } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

interface Score {
  id: string;
  player_name: string;
  score: number;
}

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from("quiz_scores")
          .select("*")
          .order("score", { ascending: false })
          .limit(10);
          
        if (error) throw error;
        setLeaderboard(data || []);
      } catch (error) {
        console.error("랭킹을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl bg-white p-10 rounded-[3rem] shadow-lg border-none mt-10">
      <h1 className="text-4xl md:text-5xl text-pastel-blue drop-shadow-sm mb-6 text-center">
        재미있는 일차방정식 퀴즈!
      </h1>
      <p className="text-xl text-slate-600 text-center mb-10 text-balance">
        60초 동안 최대한 많은 문제를 풀고 명예의 전당에 이름을 올려보세요! 🧸✨
      </p>
      
      <Link 
        href="/quiz"
        className="flex items-center gap-3 px-10 py-5 bg-pastel-lemon text-slate-700 text-3xl rounded-full shadow-md hover:scale-110 hover:bg-yellow-200 transition-all duration-300 border-none outline-none group mb-12"
      >
        <Play className="w-8 h-8 text-yellow-600 group-hover:animate-ping fill-current" />
        <span>게임 시작하기</span>
      </Link>

      {/* 명예의 전당 (Leaderboard) */}
      <div className="w-full bg-slate-50 p-6 md:p-8 rounded-3xl shadow-inner border-2 border-pastel-pink/30">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl text-slate-700 font-bold">명예의 전당 (Top 10)</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Sparkles className="w-10 h-10 text-pastel-blue animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-slate-500 py-8 text-lg">
            아직 등록된 점수가 없어요. 첫 번째 챔피언이 되어보세요!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {leaderboard.map((item, index) => (
              <li 
                key={item.id} 
                className={`flex justify-between items-center p-4 rounded-2xl ${
                  index === 0 ? "bg-yellow-100 border-2 border-yellow-300 transform scale-105 my-2 shadow-md" :
                  index === 1 ? "bg-slate-200 border-2 border-slate-300" :
                  index === 2 ? "bg-orange-100 border-2 border-orange-200" :
                  "bg-white border border-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-2xl ${index < 3 ? "text-yellow-600" : "text-slate-400"}`}>
                    {index + 1}
                  </span>
                  <span className="text-xl text-slate-700 font-semibold">{item.player_name}</span>
                </div>
                <span className="text-xl text-pastel-blue font-bold">{item.score} 점</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
