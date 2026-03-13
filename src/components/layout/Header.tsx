"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";

export default function Header() {
  const { session, loading } = useAuth();
  const { openLogin } = useAuthModal();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 좌측: 로고 → 홈 이동 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-red">잘파는사람들</span>
          </Link>

          {/* 우측: 로그인/마이페이지 버튼 하나 */}
          {!loading && (
            session ? (
              <Link href="/my">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-1" />
                  마이페이지
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={openLogin}>
                로그인
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
