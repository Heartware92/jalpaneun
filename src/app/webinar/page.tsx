"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar, CheckCircle } from "lucide-react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function WebinarPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 중복 신청 방지 (이메일 기준)
      const q = query(
        collection(db, "webinar_registrations"),
        where("email", "==", email)
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.error("이미 신청된 이메일입니다.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "webinar_registrations"), {
        name,
        email,
        phone,
        userId: user?.uid || null,
        createdAt: new Date(),
      });
      setSubmitted(true);
      toast.success("웨비나 신청이 완료되었습니다!");
    } catch {
      toast.error("신청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">신청 완료!</h1>
          <p className="text-gray-600 mb-4">
            웨비나 시작 전 알림을 보내드리겠습니다.<br />
            입력하신 이메일과 연락처를 확인해주세요.
          </p>
          <p className="text-sm text-gray-400">
            알림은 웨비나 시작 1일 전, 1시간 전에 발송됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              <Calendar className="w-4 h-4" />
              무료 웨비나
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              장사의 정석<br />
              핵심 30분 요약
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              6주 과정의 핵심을 30분으로 압축했습니다.<br />
              신청만 하면 무료로 참여할 수 있습니다.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red" />
                월 매출 정체의 진짜 원인
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red" />
                잘 되는 매장의 3가지 공통점
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-red" />
                바로 적용 가능한 실전 팁
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              무료 웨비나 신청
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="이름"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="이메일"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="연락처"
                type="tel"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "신청 중..." : "무료 신청하기"}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                신청 시 사전 알림을 위해 연락처가 사용됩니다.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
