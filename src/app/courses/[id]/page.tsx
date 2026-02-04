"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, PlayCircle, CheckCircle, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const courseData = {
  id: "jangsa",
  title: "장사의 정석 - 6주 완성 과정",
  description:
    "수백 개 매장 데이터에서 추출한 성공 패턴을 6주 만에 내 것으로 만드는 실전 강의입니다. 이론이 아닌 검증된 전략을 바로 적용할 수 있습니다.",
  price: 390000,
  instructorName: "잘파는사람들",
  weeks: [
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
        { id: "5-3", title: "네이버 플레이스 공략", duration: 25 },
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
  ],
};

export default function CourseDetailPage() {
  const { user } = useAuth();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const totalLessons = courseData.weeks.reduce((sum, w) => sum + w.lessons.length, 0);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    // TODO: 토스페이먼츠 결제 연동
    toast("결제 기능 준비 중입니다.");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-brand-red text-sm font-semibold px-3 py-1 rounded-full mb-4">
            6주 완성
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{courseData.title}</h1>
          <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
            {courseData.description}
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <PlayCircle className="w-4 h-4" />
              총 {totalLessons}개 영상
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />6주 과정
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Curriculum */}
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-gray-900 mb-4">커리큘럼</h2>
            {courseData.weeks.map((w) => (
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

          {/* Purchase Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-32 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatPrice(courseData.price)}
              </div>
              <p className="text-sm text-gray-500 mb-6">6주 전체 과정</p>
              <Button
                size="lg"
                className="w-full mb-3"
                onClick={handlePurchase}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                수강 신청하기
              </Button>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  결제 후 즉시 수강 가능
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  6개월 무제한 반복 시청
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  주차별 순차 오픈
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
