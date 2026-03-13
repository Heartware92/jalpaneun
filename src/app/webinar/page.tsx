"use client";

import { useState, useEffect, useRef } from "react";
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
  const [birthDate, setBirthDate] = useState(["", "", "", "", "", ""]);
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const birthInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (user) {
      if (user.displayName) setName(user.displayName);
    }
  }, [user]);

  const handleBirthDateChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newBirthDate = [...birthDate];
    newBirthDate[index] = value.slice(-1);
    setBirthDate(newBirthDate);

    // 자동으로 다음 칸으로 이동
    if (value && index < 5) {
      birthInputRefs.current[index + 1]?.focus();
    }
  };

  const handleBirthDateKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !birthDate[index] && index > 0) {
      birthInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendVerification = () => {
    if (!phone || phone.length < 10) {
      toast.error("연락처를 정확히 입력해주세요.");
      return;
    }
    // TODO: 실제 SMS 발송 로직
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setShowVerification(true);
    toast.success(`인증번호: ${code} (개발모드)`);
  };

  const handleVerifyCode = (inputCode: string) => {
    if (inputCode === verificationCode) {
      setPhoneVerified(true);
      toast.success("인증되었습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    if (!phoneVerified) {
      toast.error("연락처 인증을 완료해주세요.");
      return;
    }

    const birthDateStr = birthDate.join("");
    if (birthDateStr.length !== 6) {
      toast.error("생년월일을 정확히 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 중복 신청 방지 (연락처 기준)
      const q = query(
        collection(db, "webinar_registrations"),
        where("phone", "==", phone)
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.error("이미 신청된 연락처입니다.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "webinar_registrations"), {
        name,
        birthDate: birthDateStr,
        phone,
        userId: user?.uid || null,
        createdAt: new Date(),
      });
      setSubmitted(true);
      toast.success("신청이 완료되었습니다!");
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
              무료 라이브 신청
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 이름 */}
              <Input
                label="이름"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* 생년월일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일 (예시 : 830101)
                </label>
                <div className="flex gap-2">
                  {birthDate.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { birthInputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleBirthDateChange(index, e.target.value)}
                      onKeyDown={(e) => handleBirthDateKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처
                </label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="안내 받을 번호 (- 제외)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={phoneVerified}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant={phoneVerified ? "ghost" : "outline"}
                    onClick={handleSendVerification}
                    disabled={phoneVerified}
                    className="shrink-0"
                  >
                    {phoneVerified ? "인증완료" : "인증"}
                  </Button>
                </div>
                {showVerification && !phoneVerified && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      placeholder="인증번호 6자리"
                      maxLength={6}
                      onChange={(e) => handleVerifyCode(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* 개인정보 동의 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">개인정보 수집 및 이용 동의</span>
                <button
                  type="button"
                  className="text-sm text-gray-400 hover:text-gray-600"
                  onClick={() => toast("개인정보 수집 및 이용 동의 내용", { icon: "📋" })}
                >
                  v
                </button>
                <label className="flex items-center gap-1 ml-auto cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-900">네, 동의합니다.</span>
                </label>
              </div>

              {/* 신청 버튼 */}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "신청 중..." : "신청하기"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
