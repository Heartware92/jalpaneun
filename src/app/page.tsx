"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import CoursePreviewSection from "@/components/home/CoursePreviewSection";
import FAQSection from "@/components/home/FAQSection";
import StickyCtaBar from "@/components/home/StickyCtaBar";

const tabs = [
  { id: "success-formula", label: "요식업 성공 공식" },
  { id: "course", label: "장사의 정석" },
  { id: "faq", label: "FAQ" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("success-formula");

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.scrollY + 140;
      const faqSection = document.getElementById("faq");
      const courseSection = document.getElementById("course");

      if (faqSection && threshold >= faqSection.offsetTop) {
        setActiveTab("faq");
      } else if (courseSection && threshold >= courseSection.offsetTop) {
        setActiveTab("course");
      } else {
        setActiveTab("success-formula");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // header(64) + tab(48) + gap
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 앵커 탭 네비게이션 - 헤더 바로 아래 고정 */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`flex-1 py-4 text-base font-medium border-b-2 text-center transition-colors ${
                  activeTab === tab.id
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <HeroSection />

      {/* 상세 콘텐츠: 요식업 성공 공식 (페이지 진입 시 최초 노출) */}
      <div id="success-formula">
        <SuccessFormulaDetail />
      </div>

      {/* 상세 콘텐츠: 장사의 정석 */}
      <div id="course">
        <CourseDetail />
      </div>

      {/* FAQ */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* 스크롤 고정 CTA바 - 장사의 정석 섹션 진입 시 노출 */}
      <StickyCtaBar />
    </>
  );
}

/* ──────────────────────────────────────────────
   요식업 성공 공식 - 상세 콘텐츠 (TBU)
   실제 콘텐츠는 의뢰인 제공 후 교체 예정
   ────────────────────────────────────────────── */
function SuccessFormulaDetail() {
  return (
    <section className="py-20 bg-white min-h-[60vh]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* 메인 타이틀 */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 text-base font-semibold px-4 py-1.5 rounded-full mb-4">
            요식업 성공 공식
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            잘 될 수밖에 없는 구조
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            콘텐츠 상세 영역 (TBU - 의뢰인 콘텐츠 제공 후 교체)
          </p>
        </div>

        {/* 플레이스홀더 콘텐츠 블록 */}
        <div className="space-y-12">
          <ContentBlock
            label="공감형 콘텐츠"
            title="월 매출 정체되는 진짜 이유"
            description="대부분의 사장님들이 놓치는 핵심 포인트. 메뉴가 아니라 '구조'의 문제입니다. 상세 콘텐츠는 추후 업데이트 예정입니다."
          />
          <ContentBlock
            label="공감형 콘텐츠"
            title="잘 파는 사람들의 공통점"
            description="매출 상위 1% 사장님들의 운영 패턴을 분석한 실전 인사이트. 상세 콘텐츠는 추후 업데이트 예정입니다."
          />
          <ContentBlock
            label="정보형 콘텐츠"
            title="실전 사례 요약"
            description="이론이 아닌 실제 매장에서 검증된 전략과 결과를 공유합니다. 상세 콘텐츠는 추후 업데이트 예정입니다."
          />
        </div>
      </div>
    </section>
  );
}

function ContentBlock({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
      <span className="text-sm font-medium text-brand-red uppercase tracking-wider">
        {label}
      </span>
      <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{title}</h3>
      <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-6 h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-base">
        이미지 / 영상 콘텐츠 영역 (TBU)
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   장사의 정석 - 상세 콘텐츠 (TBU)
   실제 콘텐츠는 의뢰인 제공 후 교체 예정
   ────────────────────────────────────────────── */
function CourseDetail() {
  return (
    <section className="py-20 bg-gray-50 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 text-base font-semibold px-4 py-1.5 rounded-full mb-4">
            6주 완성
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            장사의 정석
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            콘텐츠 상세 영역 (TBU - 의뢰인 콘텐츠 제공 후 교체)
          </p>
        </div>

        <CoursePreviewSection />
      </div>
    </section>
  );
}
