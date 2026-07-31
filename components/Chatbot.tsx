"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "안녕! 나는 친절한 수학 선생님이야 🧸 궁금한 수학 문제가 있으면 언제든 물어봐줘!",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // 유저 메시지 추가
    const newUserMsg: Message = { id: Date.now().toString(), sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // API 라우트로 질문 전송
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "오류가 발생했습니다.");
      }

      const botMessage = data.answer;

      // 봇 메시지 추가
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: botMessage }
      ]);

      // Supabase에 저장
      await supabase.from("chat_logs").insert([
        { question: userMessage, answer: botMessage }
      ]);

    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: "앗! 지금은 대답하기 어려워요. 조금 이따가 다시 물어봐 줄래요? 😥" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-pastel-pink text-white rounded-full shadow-lg hover:scale-110 hover:bg-pink-300 transition-all duration-300 z-50 ${isOpen ? "hidden" : "flex"} items-center justify-center`}
        aria-label="챗봇 열기"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
      </button>

      {/* 채팅창 팝업 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[32rem] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300 border-4 border-pastel-pink/30">
          {/* 헤더 */}
          <div className="bg-pastel-pink p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <span className="font-bold text-lg">수학 선생님 챗봇 🧸</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-slate-200 transition-colors bg-white/20 p-1 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 대화창 */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-pastel-blue text-white" : "bg-pastel-lemon text-yellow-600"}`}>
                  {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div 
                  className={`p-3 rounded-2xl text-sm md:text-base shadow-sm whitespace-pre-wrap leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-pastel-blue text-white rounded-tr-sm" 
                      : "bg-white border-2 border-pastel-lemon/50 text-slate-700 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] self-start">
                 <div className="w-8 h-8 rounded-full bg-pastel-lemon text-yellow-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-pastel-lemon/50 text-slate-700 rounded-tl-sm flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin text-pastel-pink" />
                  <span className="ml-2 text-sm text-slate-400">생각 중...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t-2 border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="질문을 입력하세요..."
              className="flex-1 px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-pink text-slate-700"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-pastel-pink text-white rounded-full hover:bg-pink-400 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
