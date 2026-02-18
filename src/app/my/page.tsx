"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { User, PlayCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

// TODO: Firestore에서 실제 데이터 조회로 교체
const mockCourses: {
  id: string;
  title: string;
  progress: number;
  thumbnail?: string;
  monthlyMinutes: number;
  goalMinutes: number;
}[] = [];

const mockPayments: {
  id: string;
  status: "결제완료" | "환불완료";
  courseName: string;
  amount: number;
  date: string;
  thumbnail?: string;
}[] = [];

type Tab = "courses" | "payments";
type PaymentFilter = "전체" | "결제완료" | "환불완료";

export default function MyPage() {
  const { user, session, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("전체");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
          <Link href="/login">
            <Button>로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredPayments =
    paymentFilter === "전체"
      ? mockPayments
      : mockPayments.filter((p) => p.status === paymentFilter);

  const displayName = session.user.name || user?.displayName || "회원";
  const email = session.user.email || user?.email || "";
  const provider = user?.provider || session.user.provider || "";
  const providerLabel =
    provider === "naver" ? "네이버"
    : provider === "google" ? "구글"
    : provider === "kakao" ? "카카오"
    : provider === "email" ? "이메일"
    : "";

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* ① 프로필 영역 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-4">
          <div className="flex flex-col items-center">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="프로필"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                <User className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <button
              type="button"
              onClick={() => {/* TODO: 프로필 상세 페이지 이동 */}}
              className="mt-4 flex items-center gap-1 text-lg font-bold text-gray-900"
            >
              {displayName} 님
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            {providerLabel && (
              <p className="text-xs text-gray-400 mt-1">{providerLabel} 계정으로 로그인</p>
            )}
            {email && (
              <p className="text-sm text-gray-400 mt-0.5">{email}</p>
            )}
          </div>
        </div>

        {/* ② 탭 영역 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("courses")}
              className={`flex-1 py-4 text-center text-sm sm:text-base font-semibold transition-colors relative ${
                activeTab === "courses"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              내 강의
              {activeTab === "courses" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("payments")}
              className={`flex-1 py-4 text-center text-sm sm:text-base font-semibold transition-colors relative ${
                activeTab === "payments"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              결제 내역
              {activeTab === "payments" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
              )}
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="p-5 sm:p-6">
            {activeTab === "courses" && (
              <>
                {mockCourses.length === 0 ? (
                  /* 내 강의 - 빈 상태 */
                  <div className="flex flex-col items-center py-12">
                    <div className="w-24 h-24 rounded-2xl border-2 border-gray-200 flex items-center justify-center mb-6">
                      <PlayCircle className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-base text-gray-500 mb-6">
                      아직 수강 중인 강의가 없어요.
                    </p>
                    <Link href="/">
                      <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                        강의 보러가기
                      </button>
                    </Link>
                  </div>
                ) : (
                  /* 내 강의 - 수강 중 */
                  <div className="space-y-5">
                    {mockCourses.map((course) => {
                      const remainMinutes = course.goalMinutes - course.monthlyMinutes;
                      return (
                        <div key={course.id}>
                          {/* 학습 시간 */}
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-900">
                              <span className="mr-1">📌</span>
                              이번달 학습 시간 : {Math.floor(course.monthlyMinutes / 60)}시간 {course.monthlyMinutes % 60}분
                            </p>
                            {remainMinutes > 0 && (
                              <p className="text-xs text-gray-500">
                                <span className="mr-1">🔥</span>
                                목표까지 {remainMinutes}분 남음
                              </p>
                            )}
                          </div>

                          {/* 썸네일 */}
                          <div className="w-full aspect-video bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                            {course.thumbnail ? (
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <PlayCircle className="w-12 h-12 text-gray-300" />
                            )}
                          </div>

                          {/* 진행률 바 */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className="bg-brand-red h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>

                          {/* 강의명 + 진행률 */}
                          <p className="text-sm sm:text-base font-medium text-gray-900 mb-4">
                            {course.title} (진행률 {course.progress}%)
                          </p>

                          {/* 이어보기 */}
                          <Link href={`/my/courses/${course.id}`} className="block">
                            <button className="w-full py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                              이어보기
                            </button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === "payments" && (
              <>
                {mockPayments.length === 0 ? (
                  /* 결제 내역 - 빈 상태 */
                  <div className="flex flex-col items-center py-12">
                    <p className="text-base text-gray-500 mb-6">
                      아직 구매하신 강의가 없어요.
                    </p>
                    <Link href="/">
                      <button className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                        강의 보러가기
                      </button>
                    </Link>
                  </div>
                ) : (
                  /* 결제 내역 - 목록 */
                  <div>
                    {/* 필터 탭 */}
                    <div className="flex gap-2 mb-4">
                      {(["전체", "결제완료", "환불완료"] as PaymentFilter[]).map(
                        (filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setPaymentFilter(filter)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                              paymentFilter === filter
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {filter}
                          </button>
                        )
                      )}
                    </div>

                    {/* 결제 카드 목록 */}
                    <div className="space-y-3">
                      {filteredPayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl"
                        >
                          {/* 썸네일 */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                            {payment.thumbnail ? (
                              <img src={payment.thumbnail} alt={payment.courseName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <PlayCircle className="w-6 h-6 text-gray-300" />
                            )}
                          </div>

                          {/* 정보 */}
                          <div className="flex-1 min-w-0">
                            <span
                              className={`inline-block text-xs font-bold mb-1 ${
                                payment.status === "결제완료"
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {payment.status}
                            </span>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {payment.courseName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {payment.amount.toLocaleString()}원 | {payment.date} 결제
                            </p>
                          </div>

                          {/* 영수증 */}
                          <button
                            type="button"
                            onClick={() => {/* TODO: 영수증 조회 */}}
                            className="shrink-0 px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50"
                          >
                            영수증
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          type="button"
          onClick={signOut}
          className="w-full mt-4 py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
