import type { Metadata } from "next";
import { Jua } from "next/font/google";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";
import "./globals.css";

const jua = Jua({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "나만의 교육용 웹앱",
  description: "귀여운 유아용 교육 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${jua.className} bg-pastel-mint min-h-screen text-slate-700 flex flex-col`}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-md rounded-b-3xl shadow-sm mb-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
              +
            </div>
            <span className="text-2xl text-pastel-pink drop-shadow-sm">재미있는 수학</span>
          </div>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link href="/" className="px-4 py-2 bg-pastel-blue text-white rounded-full hover:scale-105 transition-transform duration-200 shadow-sm block">홈</Link>
              </li>
              <li>
                <Link href="/quiz" className="px-4 py-2 bg-white text-slate-600 rounded-full hover:scale-105 transition-transform duration-200 shadow-sm block">놀이</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center px-4 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-slate-500 mt-10">
          <p>© 2024 귀여운 수학 앱. All rights reserved.</p>
        </footer>

        {/* Chatbot */}
        <Chatbot />
      </body>
    </html>
  );
}
