"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import OAuthButtons from "@/components/auth/OAuthButtons";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

const PASSWORD_RULES = [
  { label: "8자 이상", test: (v: string) => v.length >= 8 },
  { label: "영문 포함", test: (v: string) => /[a-zA-Z]/.test(v) },
  { label: "숫자 포함", test: (v: string) => /[0-9]/.test(v) },
  { label: "특수문자 포함", test: (v: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const emailValid = EMAIL_REGEX.test(email);
  const allPasswordRulesPass = PASSWORD_RULES.every((r) => r.test(password));
  const passwordsMatch = password === passwordConfirm && passwordConfirm.length > 0;
  const formValid = name.trim().length > 0 && emailValid && allPasswordRulesPass && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValid) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (!allPasswordRulesPass) {
      toast.error("비밀번호 조건을 모두 충족해주세요.");
      return;
    }
    if (!passwordsMatch) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("email-already-in-use")) {
        toast.error("이미 가입된 이메일입니다.");
      } else {
        toast.error("회원가입에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증 안내 화면
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">인증 메일을 확인해주세요</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium text-gray-900">{email}</span>으로
          </p>
          <p className="text-gray-600 mb-6">인증 메일을 보냈습니다. 메일함을 확인해주세요.</p>
          <p className="text-sm text-gray-400 mb-6">
            스팸함도 확인해주세요.
          </p>
          <Button onClick={() => router.push("/login")} className="w-full">
            로그인 페이지로 이동
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="이름"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div>
            <Input
              label="이메일"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email.length > 0 && !emailValid ? "올바른 이메일 형식을 입력해주세요." : undefined}
              required
            />
          </div>
          <div>
            <Input
              label="비밀번호"
              type="password"
              placeholder="영문 + 숫자 + 특수문자, 8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule) => {
                  const pass = rule.test(password);
                  return (
                    <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                      {pass ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-gray-300" />
                      )}
                      <span className={pass ? "text-green-600" : "text-gray-400"}>
                        {rule.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={
              passwordConfirm.length > 0 && !passwordsMatch
                ? "비밀번호가 일치하지 않습니다."
                : undefined
            }
            required
          />
          <Button type="submit" className="w-full" disabled={loading || !formValid}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">또는</span>
          </div>
        </div>

        <OAuthButtons />

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-brand-red font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
