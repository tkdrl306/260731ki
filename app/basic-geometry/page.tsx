"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GeometrySymbol, GeometryType } from '../../components/GeometrySymbols';

type GameState = 'intro' | 'playing' | 'gameOver';

interface LeaderboardEntry {
  nickname: string;
  score: number;
  date: string;
}

const CONCEPTS: { type: GeometryType; label: string }[] = [
  { type: 'line', label: '직선' },
  { type: 'ray', label: '반직선' },
  { type: 'segment', label: '선분' },
];

const POSITIVE_FEEDBACKS = ['정답이에요! +3초', '훌륭해요! +3초', '정확해요! +3초', '아주 잘했어요! +3초'];
const ENCOURAGING_FEEDBACKS = ['아쉽네요!', '조금 더 생각해볼까요?', '다시 한 번 집중해봐요!', '할 수 있어요!'];

export default function BasicGeometryGame() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [nickname, setNickname] = useState('');
  
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [totalTime, setTotalTime] = useState(0);
  const [targetConcept, setTargetConcept] = useState<{ type: GeometryType; label: string }>(CONCEPTS[0]);
  const [options, setOptions] = useState<GeometryType[]>([]);
  
  // UI state
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Leaderboard
  useEffect(() => {
    const saved = localStorage.getItem('geometryLeaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const startGame = () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    setGameState('playing');
    setScore(0);
    setTimeLeft(10);
    setTotalTime(0);
    generateQuestion();
  };

  const generateQuestion = () => {
    const target = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
    setTargetConcept(target);
    
    // Shuffle options
    const shuffled = [...CONCEPTS].sort(() => Math.random() - 0.5).map(c => c.type);
    setOptions(shuffled);
  };

  const handleAnswer = (selectedType: GeometryType) => {
    if (selectedType === targetConcept.type) {
      // Correct answer
      setScore(s => s + 1);
      setTimeLeft(t => t + 3);
      setFeedbackType('success');
      setFeedbackMsg(POSITIVE_FEEDBACKS[Math.floor(Math.random() * POSITIVE_FEEDBACKS.length)]);
    } else {
      // Wrong answer
      setFeedbackType('error');
      setFeedbackMsg(ENCOURAGING_FEEDBACKS[Math.floor(Math.random() * ENCOURAGING_FEEDBACKS.length)]);
    }

    setTimeout(() => {
      setFeedbackType(null);
    }, 1000);

    generateQuestion();
  };

  const endGame = () => {
    setGameState('gameOver');
    if (timerRef.current) clearInterval(timerRef.current);
    
    const newEntry: LeaderboardEntry = {
      nickname: nickname.trim(),
      score,
      date: new Date().toLocaleDateString()
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // top 5
      
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('geometryLeaderboard', JSON.stringify(updatedLeaderboard));
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
        
        setTotalTime((prev) => {
          if (prev >= 180) { // 3 minutes max
            endGame();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4 font-sans text-gray-800">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/40">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
            기본도형 마스터
          </h1>
          <p className="text-sm text-gray-500">직선, 반직선, 선분 기호를 맞춰보세요!</p>
        </div>

        {/* Intro Screen */}
        {gameState === 'intro' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-sm font-semibold text-gray-700 ml-1">
                닉네임
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGame()}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/50 transition-all text-lg"
                autoComplete="off"
              />
            </div>
            <button
              onClick={startGame}
              className="mt-2 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 transform transition hover:-translate-y-1 active:translate-y-0 text-lg"
            >
              게임 시작하기
            </button>
            
            {leaderboard.length > 0 && (
              <div className="mt-8 bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <h3 className="text-center font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                  🏆 명예의 전당
                </h3>
                <ul className="space-y-2">
                  {leaderboard.map((entry, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-white py-2 px-4 rounded-lg shadow-sm text-sm">
                      <span className="font-semibold text-gray-600">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`} {entry.nickname}
                      </span>
                      <span className="font-bold text-purple-600">{entry.score}점</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Playing Screen */}
        {gameState === 'playing' && (
          <div className="flex flex-col gap-6 animate-fade-in relative">
            
            {/* Top Bar: Timer & Score */}
            <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">시간</span>
                <span className={`text-2xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-purple-600'}`}>
                  {timeLeft}초
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">점수</span>
                <span className="text-2xl font-black text-pink-500">{score}점</span>
              </div>
            </div>

            {/* Total Time Warning */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-purple-500 h-1.5 transition-all duration-1000 ease-linear" 
                style={{ width: \`\${(totalTime / 180) * 100}%\` }}
              ></div>
            </div>

            {/* Question */}
            <div className="text-center mt-4">
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                다음 중 <span className="font-extrabold text-purple-700 text-2xl">{targetConcept.label} AB</span>를<br/>나타내는 기호는?
              </h2>
            </div>

            {/* Feedback Message */}
            <div className="h-8 flex justify-center items-center">
              {feedbackType && (
                <div className={`px-4 py-1 rounded-full font-bold text-sm animate-bounce ${
                  feedbackType === 'success' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {feedbackMsg}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
              {options.map((optType, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(optType)}
                  className="group relative w-full bg-white border-2 border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-300 transition-all active:scale-[0.98] flex items-center justify-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <GeometrySymbol type={optType} className="text-gray-800 z-10 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-4xl mb-4">⏰</h2>
              <h2 className="text-2xl font-black text-gray-800 mb-2">게임 종료!</h2>
              <p className="text-gray-500 mb-1">수고하셨습니다, <span className="font-bold text-purple-600">{nickname}</span>님!</p>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 my-6">
                {score}점
              </div>
            </div>

            <div className="w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
              <h3 className="text-center font-bold text-gray-700 mb-4 flex items-center justify-center gap-2">
                🏆 명예의 전당 (Top 5)
              </h3>
              <ul className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <li key={idx} className={`flex justify-between items-center py-3 px-4 rounded-xl shadow-sm text-sm ${
                    entry.nickname === nickname && entry.score === score 
                    ? 'bg-purple-100 border border-purple-200' 
                    : 'bg-white'
                  }`}>
                    <span className="font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-6 text-center">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : \`\${idx + 1}.\`}</span>
                      {entry.nickname}
                    </span>
                    <span className="font-black text-purple-600">{entry.score}점</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setGameState('intro')}
              className="mt-4 w-full py-4 rounded-xl font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors text-lg"
            >
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
