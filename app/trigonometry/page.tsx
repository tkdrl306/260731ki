"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import katex from "katex";
import "katex/dist/katex.min.css";
import { ArrowLeft, RefreshCcw, Home, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

// 퀴즈 문제 뱅크 (동일)
const quizBank = [
  // 60 points (Basic)
  { q: "\\sin 30^\\circ", a: "\\frac{1}{2}", choices: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "1"], score: 60 },
  { q: "\\cos 45^\\circ", a: "\\frac{\\sqrt{2}}{2}", choices: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "1"], score: 60 },
  { q: "\\tan 60^\\circ", a: "\\sqrt{3}", choices: ["\\frac{\\sqrt{3}}{3}", "1", "\\sqrt{3}", "0"], score: 60 },
  { q: "\\sin 90^\\circ", a: "1", choices: ["0", "\\frac{1}{2}", "1", "\\sqrt{2}"], score: 60 },
  { q: "\\cos 0^\\circ", a: "1", choices: ["0", "\\frac{1}{2}", "1", "\\frac{\\sqrt{3}}{2}"], score: 60 },
  { q: "\\tan 45^\\circ", a: "1", choices: ["0", "\\frac{\\sqrt{3}}{3}", "1", "\\sqrt{3}"], score: 60 },
  { q: "\\sin 60^\\circ", a: "\\frac{\\sqrt{3}}{2}", choices: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "1"], score: 60 },
  { q: "\\cos 30^\\circ", a: "\\frac{\\sqrt{3}}{2}", choices: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "1"], score: 60 },
  { q: "\\sin 0^\\circ", a: "0", choices: ["0", "1", "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}"], score: 60 },
  { q: "\\cos 90^\\circ", a: "0", choices: ["0", "1", "\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"], score: 60 },
  
  // 80 points (Intermediate)
  { q: "\\sin 30^\\circ + \\cos 60^\\circ", a: "1", choices: ["0", "\\frac{1}{2}", "1", "\\sqrt{2}"], score: 80 },
  { q: "\\sin 45^\\circ + \\cos 45^\\circ", a: "\\sqrt{2}", choices: ["1", "\\sqrt{2}", "\\frac{\\sqrt{2}}{2}", "2"], score: 80 },
  { q: "\\cos 0^\\circ - \\sin 90^\\circ", a: "0", choices: ["0", "1", "-1", "\\frac{1}{2}"], score: 80 },
  { q: "\\sin 60^\\circ + \\cos 30^\\circ", a: "\\sqrt{3}", choices: ["1", "\\sqrt{2}", "\\sqrt{3}", "2"], score: 80 },
  { q: "\\tan 45^\\circ \\times \\sin 90^\\circ", a: "1", choices: ["0", "\\frac{1}{2}", "1", "\\sqrt{3}"], score: 80 },
  
  // 100 points (Advanced)
  { q: "\\tan 60^\\circ - \\tan 30^\\circ", a: "\\frac{2\\sqrt{3}}{3}", choices: ["\\frac{\\sqrt{3}}{3}", "\\frac{2\\sqrt{3}}{3}", "\\sqrt{3}", "0"], score: 100 },
  { q: "\\sin^2 45^\\circ + \\cos^2 45^\\circ", a: "1", choices: ["0", "\\frac{1}{2}", "1", "2"], score: 100 },
  { q: "\\tan 30^\\circ \\times \\tan 60^\\circ", a: "1", choices: ["0", "\\frac{1}{3}", "1", "\\sqrt{3}"], score: 100 },
  { q: "\\sin 60^\\circ \\times \\cos 30^\\circ", a: "\\frac{3}{4}", choices: ["\\frac{1}{4}", "\\frac{1}{2}", "\\frac{3}{4}", "1"], score: 100 },
  { q: "2\\sin 30^\\circ + \\sqrt{2}\\cos 45^\\circ", a: "2", choices: ["1", "2", "\\sqrt{2}", "3"], score: 100 },
];

function TrigGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerName = searchParams.get("name") || "익명";

  const [gameState, setGameState] = useState<"playing" | "result" | "review">("playing");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<any[]>([]);
  const [effect, setEffect] = useState<{ text: string, type: "good" | "bad", id: number } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // 초기 문제 세팅
  useEffect(() => {
    if (gameState === "playing") {
      nextQuestion();
    }
  }, [gameState]);

  // 타이머 로직
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const nextQuestion = () => {
    const q = quizBank[Math.floor(Math.random() * quizBank.length)];
    setCurrentQuestion(q);
    setShuffledChoices([...q.choices].sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (choice: string) => {
    if (choice === currentQuestion.a) {
      setScore(prev => prev + (currentQuestion.score || 100));
      setCorrectCount(prev => prev + 1);
      setTimeLeft(prev => prev + 10);
      triggerEffect("+10s", "good");
    } else {
      triggerEffect("틀렸습니다", "bad");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      setWrongQuestions(prev => [...prev, { q: currentQuestion.q, a: currentQuestion.a, userA: choice }]);
    }

    if (timeLeft > 0) {
      nextQuestion();
    }
  };

  const triggerEffect = (text: string, type: "good" | "bad") => {
    setEffect({ text, type, id: Date.now() });
    setTimeout(() => setEffect(null), 1000);
  };

  const endGame = () => {
    setGameState("result");
    const newScore = { name: playerName, score, date: new Date().toLocaleDateString() };
    
    // 로컬 스토리지에 랭킹 저장 (현재 점수를 스냅샷으로 사용하므로 이전 score를 사용해야 할 수도 있지만, 
    // 리액트 상태 업데이트 비동기성 때문에 클로저 문제 방지를 위해 함수형 업데이트 내부나 로컬변수 참조 권장)
    // 여기선 동기적으로 처리
    const saved = JSON.parse(localStorage.getItem('trigScores') || "[]");
    saved.push(newScore);
    saved.sort((a: any, b: any) => b.score - a.score);
    const top10 = saved.slice(0, 10);
    localStorage.setItem('trigScores', JSON.stringify(top10));
    setLeaderboard(top10);
  };

  // 수식 렌더링 헬퍼
  const renderMath = (math: string) => {
    return { __html: katex.renderToString(math, { throwOnError: false }) };
  };

  if (gameState === "review") {
    return (
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border-none my-10 flex flex-col items-center">
        <h2 className="text-3xl text-pastel-pink font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-8 h-8" /> 오답 노트
        </h2>
        
        <div className="w-full space-y-4 max-h-[60vh] overflow-y-auto px-2">
          {wrongQuestions.length === 0 ? (
            <p className="text-center text-slate-500 py-10 text-xl">틀린 문제가 없습니다! 완벽해요! 🎉</p>
          ) : (
            wrongQuestions.map((wq, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center flex flex-col gap-4">
                <div className="text-2xl text-slate-700" dangerouslySetInnerHTML={renderMath(wq.q)} />
                <div className="flex justify-around items-center bg-white p-4 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 mb-1">내 선택</span>
                    <span className="text-red-400 line-through text-lg" dangerouslySetInnerHTML={renderMath(wq.userA)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-400 mb-1">정답</span>
                    <span className="text-pastel-blue font-bold text-lg" dangerouslySetInnerHTML={renderMath(wq.a)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={() => setGameState("result")}
          className="mt-8 px-8 py-4 bg-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-300 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> 결과로 돌아가기
        </button>
      </div>
    );
  }

  if (gameState === "result") {
    return (
      <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border-none my-10 flex flex-col items-center">
        <h2 className="text-4xl text-pastel-blue font-bold mb-6">게임 종료!</h2>
        
        <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center mb-8">
          <p className="text-xl text-slate-600 mb-2 font-bold">{playerName}님의 성적</p>
          <p className="text-5xl font-bold text-yellow-500 mb-4">{score} 점</p>
          <p className="text-lg text-slate-500">맞힌 문제: <span className="font-bold text-slate-700">{correctCount}</span>개</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center w-full mb-10">
          <button 
            onClick={() => setGameState("review")}
            className="flex-1 min-w-[140px] py-4 bg-pastel-pink text-white font-bold rounded-2xl hover:bg-pink-400 shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5" /> 오답 노트
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex-1 min-w-[140px] py-4 bg-pastel-blue text-white font-bold rounded-2xl hover:bg-blue-400 shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" /> 다시하기
          </button>
          <Link 
            href="/"
            className="flex-1 min-w-[140px] py-4 bg-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-300 shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> 메인으로
          </Link>
        </div>

        <div className="w-full bg-slate-50 p-6 rounded-2xl border-2 border-yellow-200">
          <h3 className="text-2xl text-slate-700 font-bold mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" /> 명예의 전당 (Top 10)
          </h3>
          <ul className="space-y-2">
            {leaderboard.map((s, idx) => (
              <li key={idx} className={`flex justify-between items-center p-3 rounded-xl ${idx === 0 ? 'bg-yellow-100 border border-yellow-300 font-bold text-lg' : 'bg-white'}`}>
                <span className={idx === 0 ? 'text-yellow-700' : 'text-slate-600'}>{idx + 1}. {s.name}</span>
                <span className={idx === 0 ? 'text-yellow-600' : 'text-pastel-blue font-bold'}>{s.score}점</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Playing State
  return (
    <div className={`w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg border-none my-10 flex flex-col relative ${isShaking ? 'animate-shake' : ''}`}>
      
      {/* 플로팅 이펙트 */}
      {effect && (
        <div key={effect.id} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black z-50 pointer-events-none animate-float ${effect.type === 'good' ? 'text-green-500 drop-shadow-sm' : 'text-red-500 drop-shadow-sm'}`}>
          {effect.text}
        </div>
      )}

      {/* 상태바 */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-full">{playerName}</div>
        <div className="text-2xl font-black text-pastel-pink bg-pink-50 px-6 py-2 rounded-full shadow-inner border border-pink-100">
          {score} <span className="text-sm font-bold text-pink-400">점</span>
        </div>
      </div>
      
      {/* 타이머 바 */}
      <div className="w-full bg-slate-100 rounded-full h-8 mb-10 relative overflow-hidden shadow-inner border border-slate-200">
        <div 
          className={`h-8 rounded-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-400' : 'bg-pastel-lemon'}`}
          style={{ width: `${Math.min(100, (timeLeft / 30) * 100)}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-black text-slate-700 drop-shadow-sm">
          {timeLeft}초
        </div>
      </div>

      {/* 문제 영역 */}
      {currentQuestion && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-10 py-4">
          <div className="text-5xl md:text-6xl text-slate-700 p-8 w-full text-center min-h-[160px] flex items-center justify-center font-serif"
               dangerouslySetInnerHTML={renderMath(currentQuestion.q)} />
          
          <div className="grid grid-cols-2 gap-4 w-full">
            {shuffledChoices.map((choice, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(choice)}
                className="py-6 text-2xl md:text-3xl bg-slate-50 hover:bg-pastel-blue hover:text-white rounded-2xl border-2 border-slate-200 hover:border-transparent transition-all shadow-sm active:scale-95 text-slate-700 font-serif"
                dangerouslySetInnerHTML={renderMath(choice)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrigonometryGame() {
  return (
    <Suspense fallback={<div className="p-10 text-xl text-slate-500">게임 불러오는 중...</div>}>
      <TrigGameContent />
    </Suspense>
  );
}
