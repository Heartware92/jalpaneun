"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* PC */}
        <div className="hidden sm:block">
          <p className="text-base font-semibold text-gray-900">장사의 정석 - 6주 완성</p>
          <p className="text-xl font-bold text-brand-red">{formatPrice(390000)}</p>
        </div>
        {/* MO */}
        <div className="sm:hidden flex-1 mr-3">
          <p className="text-sm font-semibold text-gray-900">장사의 정석</p>
          <p className="text-lg font-bold text-brand-red">{formatPrice(390000)}</p>
        </div>
        <Link href="/courses/jangsa">
          <Button size="lg" className="whitespace-nowrap">수강 신청하기</Button>
        </Link>
      </div>
    </div>
  );
}
