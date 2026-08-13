"use client";

import { useState, useEffect } from "react";
import { Sparkles, Trophy, Play, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

interface Score {
  id: string;
  player_name: string;
  score: number;
}

export default function Home() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");

  const startTrigGame = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    router.push(`/trigonometry?name=${encodeURIComponent(nickname.trim())}`);
  };

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
    <div className="flex flex-col items-center justify-center w-full max-w-2xl gap-10">
      
      {/* 삼각비 마스터 배너 (새로운 게임) */}
      <section className="bg-gradient-to-br from-pastel-pink to-pastel-lemon p-8 rounded-[3rem] shadow-lg w-full text-center border-none mt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-4 drop-shadow-sm flex items-center justify-center gap-2">
          <Sparkles className="text-yellow-600 w-8 h-8" />
          삼각비 마스터에 도전하세요!
          <Sparkles className="text-yellow-600 w-8 h-8" />
        </h2>
        <p className="text-lg text-slate-600 mb-6 font-medium">중3 수학 특수각의 삼각비 (0°, 30°, 45°, 60°, 90°)</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="닉네임을 입력하세요" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="px-6 py-4 rounded-full w-full sm:w-auto flex-1 text-center text-lg outline-none shadow-inner border-2 border-transparent focus:border-white/50 bg-white/80 placeholder:text-slate-400"
            maxLength={10}
            onKeyDown={(e) => e.key === 'Enter' && startTrigGame()}
          />
          <button 
            onClick={startTrigGame}
            className="px-8 py-4 bg-white text-pastel-pink font-bold rounded-full text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            <Gamepad2 className="w-6 h-6" />
            시작하기
          </button>
        </div>
      </section>

      {/* 기본도형 마스터 배너 */}
      <section className="bg-gradient-to-bl from-indigo-100 to-purple-200 p-8 rounded-[3rem] shadow-lg w-full text-center border-none">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4 drop-shadow-sm flex items-center justify-center gap-2">
          <Gamepad2 className="text-purple-600 w-8 h-8" />
          기본도형 마스터!
          <Gamepad2 className="text-purple-600 w-8 h-8" />
        </h2>
        <p className="text-lg text-indigo-800 mb-6 font-medium">직선, 반직선, 선분 기호를 맞춰보세요</p>
        
        <Link 
          href="/basic-geometry"
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-full text-lg shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-indigo-50 transition-all duration-200"
        >
          <Play className="w-6 h-6 fill-current" />
          게임 시작하기
        </Link>
      </section>

      {/* 일차방정식 게임 섹션 */}
      <div className="flex flex-col items-center justify-center w-full bg-white p-10 rounded-[3rem] shadow-lg border-none gap-10">
        <h1 className="text-4xl md:text-5xl text-pastel-blue drop-shadow-sm text-center">
          재미있는 일차방정식 퀴즈!
        </h1>
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
    </div>
  );
}
