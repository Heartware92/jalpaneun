"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

const PAGE_TITLES: Record<string, string> = {
  "/login": "로그인",
  "/signup": "회원가입",
  "/my": "마이페이지",
  "/my/courses": "내 강의",
  "/order": "주문/결제",
  "/webinar": "웨비나",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, session, loading, signOut } = useAuth();
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* 좌측: 로고 (PC/MO 공통) */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand-red">잘파는사람들</span>
          </Link>

          {/* 중앙: 페이지 타이틀 */}
          {pageTitle && (
            <span className="absolute left-1/2 -translate-x-1/2 text-base sm:text-lg font-bold text-gray-900">
              {pageTitle}
            </span>
          )}

          {/* PC 우측: 로그인/회원가입 */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? null : session ? (
              <div className="flex items-center gap-3">
                <Link href="/my">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-1" />
                    마이페이지
                  </Button>
                </Link>
                <Link href="/my/courses">
                  <Button variant="ghost" size="sm">
                    내 강의
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">로그인</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">회원가입</Button>
                </Link>
              </>
            )}
          </div>

          {/* MO 우측: 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MO 메뉴 드로어 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link
              href="/"
              className="text-base font-medium text-gray-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              홈
            </Link>
            <Link
              href="/courses/jangsa"
              className="text-base font-medium text-gray-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              강의
            </Link>
            <Link
              href="/webinar"
              className="text-base font-medium text-gray-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              웨비나
            </Link>
            <hr className="my-2" />
            {loading ? null : session ? (
              <>
                <Link
                  href="/my"
                  className="text-base font-medium text-gray-700 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  마이페이지
                </Link>
                <Link
                  href="/my/courses"
                  className="text-base font-medium text-gray-700 py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  내 강의
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="text-left text-base text-gray-500 py-2"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">로그인</Button>
                </Link>
                <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">회원가입</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
