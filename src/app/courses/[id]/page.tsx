"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, PlayCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/contexts/AuthModalContext";

// 가격 데이터 (order 페이지와 통일)
const COURSE = {
  id: "jangsa",
  name: "장사의 정석",
  originalPrice: 4_000_000,
  discount: 510_000,
  thumbnail: "/images/course-thumbnail.png",
};

const finalPrice = COURSE.originalPrice - COURSE.discount;
const monthlyPrice = Math.round(finalPrice / 12);

// 특별가 마감일
const DEADLINE = new Date("2026-03-31T23:59:59");

// 커리큘럼 데이터
const weeks = [
  {
    week: 1,
    title: "장사의 기본기",
    lessons: [
      { id: "1-1", title: "매장 운영의 핵심 구조", duration: 25 },
      { id: "1-2", title: "매출 공식 이해하기", duration: 20 },
      { id: "1-3", title: "원가 구조와 수익률", duration: 30 },
      { id: "1-4", title: "실전 체크리스트", duration: 20 },
    ],
  },
  {
    week: 2,
    title: "고객을 끌어오는 법",
    lessons: [
      { id: "2-1", title: "신규 고객 유입 전략", duration: 25 },
      { id: "2-2", title: "온라인 마케팅 기초", duration: 30 },
      { id: "2-3", title: "지역 타겟팅 실전", duration: 25 },
    ],
  },
  {
    week: 3,
    title: "재방문율 높이기",
    lessons: [
      { id: "3-1", title: "고객 경험 설계", duration: 20 },
      { id: "3-2", title: "단골 만드는 시스템", duration: 25 },
      { id: "3-3", title: "리뷰 관리 전략", duration: 20 },
      { id: "3-4", title: "멤버십/쿠폰 활용법", duration: 25 },
    ],
  },
  {
    week: 4,
    title: "매출 구조 만들기",
    lessons: [
      { id: "4-1", title: "메뉴 엔지니어링", duration: 30 },
      { id: "4-2", title: "객단가 올리는 법", duration: 25 },
      { id: "4-3", title: "시간대별 매출 전략", duration: 20 },
    ],
  },
  {
    week: 5,
    title: "마케팅 실전",
    lessons: [
      { id: "5-1", title: "SNS 마케팅 실전", duration: 25 },
      { id: "5-2", title: "배달앱 최적화", duration: 30 },
      { id: "5-3", title: "지역 마케팅 전략", duration: 25 },
      { id: "5-4", title: "광고비 효율화", duration: 20 },
    ],
  },
  {
    week: 6,
    title: "성장 전략",
    lessons: [
      { id: "6-1", title: "매장 확장 타이밍", duration: 25 },
      { id: "6-2", title: "직원 관리와 시스템화", duration: 30 },
      { id: "6-3", title: "지속 성장을 위한 로드맵", duration: 20 },
    ],
  },
];

type Tab = "intro" | "curriculum" | "refund";

function useCountdown(deadline: Date) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calc = () => {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("마감되었습니다");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      const hh = String(hours).padStart(2, "0");
      const mm = String(mins).padStart(2, "0");
      const ss = String(secs).padStart(2, "0");
      setTimeLeft(`${days}일 ${hh}:${mm}:${ss} 남음`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
}

export default function CourseDetailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const timeLeft = useCountdown(DEADLINE);

  const handleCTA = () => {
    if (!user) {
      openLogin();
      return;
    }
    router.push("/order");
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* ① 상품 정보 */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 썸네일 */}
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            {COURSE.thumbnail ? (
              <img
                src={COURSE.thumbnail}
                alt={COURSE.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>

          {/* 정보 */}
          <div>
            <span className="inline-block bg-red-100 text-brand-red text-sm font-bold px-3 py-1 rounded-full mb-3">
              1기 런칭 특가
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {COURSE.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-1">
              실제 수강생 기준 월 매출 상승 평균 <strong>420만원</strong>🔥
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              수강료 1개월만에 회수 전략 설계
            </p>

            {/* 할부 가격 */}
            <p className="text-sm text-gray-500 mb-4">
              (12개월 할부시){" "}
              <span className="text-xl sm:text-2xl font-bold text-brand-red">
                월 {monthlyPrice.toLocaleString()}원
              </span>
            </p>

            {/* 가격 테이블 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">결제금액</span>
                <span className="text-sm font-semibold text-gray-900">
                  {finalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">판매금액</span>
                <span className="text-sm text-gray-900">
                  {COURSE.originalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-sm text-gray-600">할인금액</span>
                <span className="text-sm font-semibold text-brand-red">
                  {COURSE.discount.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 카운트다운 */}
            <div className="flex items-center gap-1.5 text-sm text-brand-red mb-4">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}</span>
            </div>

            {/* CTA 버튼 */}
            <button
              type="button"
              onClick={handleCTA}
              className="w-full py-4 bg-brand-red text-white font-bold text-base sm:text-lg rounded-xl hover:bg-red-700 transition-colors"
            >
              1기 특별가로 시작하기
            </button>
          </div>
        </div>
      </div>

      {/* ② 탭 */}
      <div className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {([
              { key: "intro" as Tab, label: "강의 소개" },
              { key: "curriculum" as Tab, label: "커리큘럼" },
              { key: "refund" as Tab, label: "환불정책" },
            ]).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-center text-sm sm:text-base font-semibold transition-colors relative ${
                  activeTab === tab.key
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ③ 탭 콘텐츠 */}
      <div className="bg-gray-50 min-h-[400px]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* 강의 소개 */}
          {activeTab === "intro" && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-base">강의 소개 콘텐츠 준비 중</p>
            </div>
          )}

          {/* 커리큘럼 */}
          {activeTab === "curriculum" && (
            <div className="space-y-3">
              {weeks.map((w) => (
                <div key={w.week} className="bg-white rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() =>
                      setExpandedWeek(expandedWeek === w.week ? null : w.week)
                    }
                  >
                    <span className="font-semibold text-gray-900">
                      {w.week}주차 - {w.title}
                    </span>
                    <span className="text-sm text-gray-400">
                      {w.lessons.length}개 강의
                    </span>
                  </button>
                  {expandedWeek === w.week && (
                    <div className="border-t border-gray-100 px-4 pb-4">
                      {w.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between py-3 text-sm"
                        >
                          <span className="flex items-center gap-2 text-gray-700">
                            <PlayCircle className="w-4 h-4 text-gray-400" />
                            {lesson.title}
                          </span>
                          <span className="text-gray-400">{lesson.duration}분</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 환불정책 */}
          {activeTab === "refund" && (
            <div className="bg-white rounded-xl p-6 space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">환불 안내</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>수강 시작 전(결제 후 7일 이내, 미수강): 전액 환불</li>
                <li>수강 시작 후: 잔여 기간에 비례하여 환불 (위약금 10% 공제)</li>
                <li>수강 기간의 1/2 경과 후: 환불 불가</li>
                <li>결제일로부터 7일 이내 & 수강 진도율 0%: 전액 환불 보장</li>
              </ul>
              <p className="text-gray-500 text-xs sm:text-sm">
                환불 관련 자세한 문의는 고객센터로 연락 부탁드립니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ④ 하단 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 py-4 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <button
            type="button"
            onClick={handleCTA}
            className="w-full py-4 bg-brand-red text-white font-bold text-base sm:text-lg rounded-xl hover:bg-red-700 transition-colors"
          >
            1기 특별가로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
