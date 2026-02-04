"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function OAuthButtons() {
  const { signInWithKakao, signInWithNaver, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleKakao = async () => {
    try {
      await signInWithKakao();
      toast.success("로그인 성공!");
      router.push("/");
    } catch {
      toast.error("카카오 로그인에 실패했습니다.");
    }
  };

  const handleNaver = async () => {
    try {
      await signInWithNaver();
      toast.success("로그인 성공!");
      router.push("/");
    } catch {
      toast.error("네이버 로그인에 실패했습니다.");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success("로그인 성공!");
      router.push("/");
    } catch {
      toast.error("구글 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* 카카오 */}
      <button
        type="button"
        onClick={handleKakao}
        className="w-12 h-12 rounded-full bg-[#FEE500] flex items-center justify-center hover:brightness-95 transition-all shadow-sm"
        aria-label="카카오 로그인"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.38 6.24l-1.12 4.16c-.1.36.3.65.62.45l4.97-3.28c.37.04.75.06 1.15.06 5.52 0 10-3.36 10-7.63C22 6.36 17.52 3 12 3z"
            fill="#191919"
          />
        </svg>
      </button>

      {/* 네이버 */}
      <button
        type="button"
        onClick={handleNaver}
        className="w-12 h-12 rounded-full bg-[#03C75A] flex items-center justify-center hover:brightness-95 transition-all shadow-sm"
        aria-label="네이버 로그인"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13.56 10.7 6.17 0H0v20h6.44V9.3L13.83 20H20V0h-6.44v10.7z" fill="white" />
        </svg>
      </button>

      {/* 구글 */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
        aria-label="구글 로그인"
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
      </button>
    </div>
  );
}
