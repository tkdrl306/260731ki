import { createClient } from "@supabase/supabase-js";

// Vercel 환경 변수에서 Supabase URL과 Key를 가져옵니다.
// Vercel 대시보드에서 꼭 설정해 주셔야 합니다!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
