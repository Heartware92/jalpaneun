"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import OAuthButtons from "@/components/auth/OAuthButtons";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const { signIn, resendVerification } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("로그인 성공!");
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("email-not-verified")) {
        setNeedsVerification(true);
      } else {
        toast.error("이메일 또는 비밀번호를 확인해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email, password);
      toast.success("인증 메일을 재발송했습니다.");
    } catch {
      toast.error("인증 메일 발송에 실패했습니다.");
    } finally {
      setResending(false);
    }
  };

  // 이메일 미인증 안내 화면
  if (needsVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center">
          <Mail className="w-16 h-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">이메일 인증이 필요합니다</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium text-gray-900">{email}</span>으로
          </p>
          <p className="text-gray-600 mb-6">
            발송된 인증 메일을 확인해주세요.<br />
            인증 완료 후 다시 로그인해주세요.
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "발송 중..." : "인증 메일 재발송"}
            </Button>
            <Button
              className="w-full"
              onClick={() => setNeedsVerification(false)}
            >
              로그인으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
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
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="text-brand-red font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
