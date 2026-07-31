import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    // Initialize OpenAI client inside the handler so it doesn't crash the build if env var is missing
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "placeholder",
    });

    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "질문이 필요합니다." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "너는 친절하고 귀여운 유치원 수학 선생님이야. 아이들의 눈높이에 맞춰 이모티콘을 섞어서 다정하게 대답해 줘. 짧고 이해하기 쉽게 설명해 줘.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content || "앗! 선생님이 지금 바빠서 대답을 못 하겠어요. 다시 질문해 줄래요? 😥";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
