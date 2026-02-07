"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithKakao, signInWithNaver, signInWithGoogle } =
    useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (!password) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("로그인 성공!");
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-not-verified")) {
        toast.error("이메일 인증이 필요합니다. 메일함을 확인해주세요.");
      } else {
        toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 pt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-5 sm:p-8 relative overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8 relative">
          <h1 className="text-2xl font-bold">잘파는사람들</h1>
          <button
            onClick={() => router.push("/")}
            className="absolute right-0 top-0 p-1"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* ① 카카오 1초 로그인/회원가입 */}
        <button
          type="button"
          onClick={() => signInWithKakao()}
          className="w-full h-12 rounded-lg bg-[#FEE500] text-[#191919] font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:brightness-95 transition-all mb-6 cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.38 6.24l-1.12 4.16c-.1.36.3.65.62.45l4.97-3.28c.37.04.75.06 1.15.06 5.52 0 10-3.36 10-7.63C22 6.36 17.52 3 12 3z"
              fill="#191919"
            />
          </svg>
          카카오 1초 로그인/회원가입
        </button>

        <div className="border-t border-gray-200 mb-6" />

        {/* ② 이메일/비밀번호 로그인 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 sm:h-12 rounded-lg border border-gray-300 px-3 sm:px-4 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 sm:h-12 rounded-lg border border-gray-300 px-3 sm:px-4 text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-lg bg-brand-red text-white font-bold text-sm sm:text-base hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* 또는 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-400">또는</span>
          </div>
        </div>

        {/* 네이버 + 구글 아이콘 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => signInWithNaver()}
            className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center hover:brightness-95 transition-all shadow-sm cursor-pointer"
            aria-label="네이버 로그인"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M13.56 10.7 6.17 0H0v20h6.44V9.3L13.83 20H20V0h-6.44v10.7z"
                fill="white"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
            aria-label="구글 로그인"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          </button>
        </div>

        {/* ③ 회원가입 링크 */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mb-3">
          아직 잘파는사람들 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-bold text-gray-900 hover:underline"
          >
            회원가입
          </Link>
        </p>

        {/* ④ 아이디 찾기 | 비밀번호 찾기 */}
        <p className="text-center text-xs sm:text-sm text-gray-400">
          <button
            type="button"
            onClick={() => toast("준비 중입니다.")}
            className="hover:text-gray-600 hover:underline cursor-pointer"
          >
            아이디 찾기
          </button>
          <span className="mx-2">|</span>
          <button
            type="button"
            onClick={() => toast("준비 중입니다.")}
            className="hover:text-gray-600 hover:underline cursor-pointer"
          >
            비밀번호 찾기
          </button>
        </p>
      </div>
    </div>
  );
}
