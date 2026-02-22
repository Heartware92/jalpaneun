"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthModal() {
  const { isOpen, mode, close, switchMode, openLogin, openSignup } = useAuthModal();

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 딤 레이어 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
      />

      {/* 모달 카드 - 외부: 둥근 모서리 클리핑, 내부: 스크롤 */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 p-1 z-10"
          aria-label="닫기"
        >
          <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
        </button>

        {/* 스크롤 영역 */}
        <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-8">
          {mode === "login" ? (
            <LoginForm
              onSwitchToSignup={openSignup}
              onSuccess={close}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={openLogin}
              onSuccess={close}
            />
          )}
        </div>
      </div>
    </div>
  );
}
