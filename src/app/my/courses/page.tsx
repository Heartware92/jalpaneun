"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PlayCircle } from "lucide-react";

export default function MyCoursesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <Link href="/login">
          <Button>로그인</Button>
        </Link>
      </div>
    );
  }

  // TODO: Firestore에서 구매한 강의 목록 조회
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">내 강의</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center">
            <PlayCircle className="w-8 h-8 text-brand-red" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">장사의 정석 - 6주 완성 과정</h2>
            <p className="text-sm text-gray-500">진도율 0%</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
              <div className="bg-brand-red h-2 rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
          <Link href="/my/courses/jangsa">
            <Button size="sm">이어보기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
