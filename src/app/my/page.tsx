"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, Shield } from "lucide-react";
import Link from "next/link";

export default function MyPage() {
  const { user, session, loading, signOut } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="프로필"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {session.user.name || user?.displayName || "회원"}
              </h2>
              <p className="text-base text-gray-500 mt-1">
                {user?.provider === "naver" && "네이버"}
                {user?.provider === "google" && "구글"}
                {user?.provider === "kakao" && "카카오"}
                {user?.provider === "email" && "이메일"}
                {" "}계정으로 로그인
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이름 (별명)</p>
                <p className="text-base font-medium text-gray-900">
                  {session.user.name || user?.displayName || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="text-base font-medium text-gray-900">
                  {session.user.email || user?.email || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">연락처</p>
                <p className="text-base font-medium text-gray-900">
                  {user?.phone || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">로그인 방식</p>
                <p className="text-base font-medium text-gray-900">
                  {user?.provider || session.user.provider || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 내 강의 바로가기 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">내 강의</h3>
          <Link href="/my/courses">
            <Button variant="outline" className="w-full">내 강의 보러가기</Button>
          </Link>
        </div>

        {/* 로그아웃 */}
        <Button variant="ghost" className="w-full text-gray-500" onClick={signOut}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}
