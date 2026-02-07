"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 장사의 정석 섹션에 진입하면 CTA바 노출
      const courseSection = document.getElementById("course");
      if (!courseSection) return;

      const rect = courseSection.getBoundingClientRect();
      // 화면 하단에서 섹션 상단이 보이기 시작하면 노출
      setVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#3b3b7a] shadow-[0_-4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* PC: 가로 배치 */}
        <div className="hidden sm:flex items-center justify-end gap-6">
          <p className="text-sm md:text-base text-white/90 text-right leading-snug">
            잘되는 구조, 우리 가게에도 맞을까?
            <br />
            기본부터 다시 점검해 보세요
          </p>
          <Link
            href="/webinar"
            className="shrink-0 px-6 py-3 bg-brand-red text-white font-bold text-sm md:text-base rounded-lg hover:bg-red-700 transition-colors"
          >
            무료 라이브 신청하기
          </Link>
        </div>
        {/* MO: 세로 스택 */}
        <div className="sm:hidden flex flex-col items-center gap-3">
          <p className="text-sm text-white/90 text-center leading-snug">
            잘되는 구조, 우리 가게에도 맞을까?
            <br />
            기본부터 다시 점검해 보세요
          </p>
          <Link
            href="/webinar"
            className="px-6 py-3 bg-brand-red text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            무료 라이브 신청하기
          </Link>
        </div>
      </div>
    </div>
  );
}
