"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ChevronDown, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signIn } from "next-auth/react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PREFIXES = ["010", "011", "016", "017"];

function validatePassword(pw: string): boolean {
  if (pw.length < 8 || pw.length > 32) return false;
  let types = 0;
  if (/[a-zA-Z]/.test(pw)) types++;
  if (/[0-9]/.test(pw)) types++;
  if (/[^a-zA-Z0-9]/.test(pw)) types++;
  return types >= 2;
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  // Refs for scroll-to-error
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const passwordConfirmRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  // Email
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);

  // Password
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Password Confirm
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmTouched, setPasswordConfirmTouched] = useState(false);

  // Phone
  const [phonePrefix, setPhonePrefix] = useState("010");
  const [phoneMid, setPhoneMid] = useState("");
  const [phoneLast, setPhoneLast] = useState("");
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);

  // Phone verification
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneDuplicate, setPhoneDuplicate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Agreements
  const [agreements, setAgreements] = useState({
    age14: false,
    terms: false,
    privacy: false,
    dataCollection: false,
    marketing: false,
    marketingEmail: false,
    marketingSms: false,
  });

  const [loading, setLoading] = useState(false);

  // Derived
  const emailFormatValid = EMAIL_REGEX.test(email);
  const passwordValid = validatePassword(password);
  const passwordsMatch =
    password === passwordConfirm && passwordConfirm.length > 0;
  const allAgreed =
    agreements.age14 &&
    agreements.terms &&
    agreements.privacy &&
    agreements.dataCollection &&
    agreements.marketing &&
    agreements.marketingEmail &&
    agreements.marketingSms;

  // Timer
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer]);

  // Close prefix dropdown on outside click
  useEffect(() => {
    if (!showPrefixDropdown) return;
    const handleClick = () => setShowPrefixDropdown(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showPrefixDropdown]);

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Email
  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (emailChecked) {
      setEmailChecked(false);
      setEmailAvailable(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!emailFormatValid) return;
    setEmailCheckLoading(true);
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      setEmailChecked(true);
      setEmailAvailable(snap.empty);
      if (snap.empty) toast.success("사용 가능한 이메일입니다.");
    } catch {
      toast.error("이메일 확인 중 오류가 발생했습니다.");
    } finally {
      setEmailCheckLoading(false);
    }
  };

  // Phone verification
  const handleSendCode = async () => {
    if (phoneMid.length < 4 || phoneLast.length < 4) {
      toast.error("연락처를 재확인해주세요.");
      return;
    }
    try {
      const res = await fetch("/api/auth/phone/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `${phonePrefix}-${phoneMid}-${phoneLast}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationSent(true);
        setTimer(180);
        setPhoneError("");
        setPhoneDuplicate(false);
        if (data.devCode) {
          toast(`[개발용] 인증번호: ${data.devCode}`, { duration: 10000 });
        } else {
          toast.success("인증번호가 발송되었습니다.");
        }
      } else {
        toast.error(data.error || "인증번호 발송에 실패했습니다.");
      }
    } catch {
      toast.error("인증번호 발송에 실패했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error("인증번호를 입력해주세요.");
      return;
    }
    try {
      const res = await fetch("/api/auth/phone/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `${phonePrefix}-${phoneMid}-${phoneLast}`,
          code: verificationCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneVerified(true);
        setPhoneError("");
        if (timerRef.current) clearTimeout(timerRef.current);
        setTimer(0);
        toast.success("휴대폰 인증이 완료되었습니다.");
      } else if (data.duplicate) {
        setPhoneDuplicate(true);
        setPhoneError(
          "이미 가입된 연락처가 있습니다. 기존 계정으로 로그인해주세요."
        );
      } else if (data.expired) {
        setPhoneError("인증번호가 만료되었습니다. 다시 요청해주세요.");
      } else {
        setPhoneError("인증번호를 다시 확인해주세요.");
      }
    } catch {
      toast.error("인증 확인에 실패했습니다.");
    }
  };

  // Agreements
  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      age14: checked,
      terms: checked,
      privacy: checked,
      dataCollection: checked,
      marketing: checked,
      marketingEmail: checked,
      marketingSms: checked,
    });
  };

  const handleAgreementChange = (
    key: keyof typeof agreements,
    checked: boolean
  ) => {
    const next = { ...agreements, [key]: checked };
    if (key === "marketing" && !checked) {
      next.marketingEmail = false;
      next.marketingSms = false;
    }
    if ((key === "marketingEmail" || key === "marketingSms") && checked) {
      next.marketing = true;
    }
    setAgreements(next);
  };

  // Submit
  const handleSubmit = async () => {
    // 순차 유효성 검증 + 실패 항목으로 스크롤
    if (!email) {
      toast.error("이메일을 입력해주세요.");
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!emailFormatValid) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!emailChecked) {
      toast.error("이메일 중복확인을 진행해주세요.");
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!emailAvailable) {
      toast.error("이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.");
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!password) {
      toast.error("비밀번호를 입력해주세요.");
      passwordRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!passwordValid) {
      toast.error(
        "영문/숫자/특수문자 중 2가지를 포함하여 8자 이상 입력해주세요."
      );
      passwordRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!passwordConfirm) {
      toast.error("비밀번호를 한번 더 입력해주세요.");
      passwordConfirmRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!passwordsMatch) {
      toast.error("비밀번호가 일치하지 않습니다.");
      passwordConfirmRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!phoneMid || !phoneLast) {
      toast.error("휴대폰 번호를 입력해주세요.");
      phoneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (phoneMid.length < 4 || phoneLast.length < 4) {
      toast.error("휴대폰 번호를 정확히 입력해주세요.");
      phoneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (phoneDuplicate) {
      toast.error(
        "이미 가입된 연락처가 있습니다. 기존 계정으로 로그인해주세요."
      );
      phoneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!phoneVerified) {
      toast.error("휴대폰 인증을 완료해주세요.");
      phoneRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!agreements.age14) {
      toast.error("만 14세 이상만 가입할 수 있습니다.");
      agreementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (
      !agreements.terms ||
      !agreements.privacy ||
      !agreements.dataCollection
    ) {
      toast.error("필수 약관에 동의해주세요.");
      agreementRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setLoading(true);
    try {
      const phone = `${phonePrefix}-${phoneMid}-${phoneLast}`;
      await signUp(email, password, email.split("@")[0], phone);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/login");
      } else {
        toast.success("회원가입이 완료되었습니다!");
        router.push("/");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use"))
        toast.error("이미 가입된 이메일입니다.");
      else toast.error("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Email message - 입력 중이면 검증 완료 전까지 빨간 테두리
  const emailHasError =
    email.length > 0 && !(emailChecked && emailAvailable);
  const emailMessage =
    email.length > 0 && !emailFormatValid
      ? "올바른 이메일 형식이 아닙니다"
      : emailChecked && !emailAvailable
        ? "이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요."
        : emailFormatValid && !emailChecked
          ? "중복확인을 진행해주세요."
          : null;

  // Password message
  const showPasswordError =
    passwordTouched && password.length > 0 && !passwordValid;
  const showPasswordConfirmError =
    passwordConfirmTouched && passwordConfirm.length > 0 && !passwordsMatch;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 pt-20 pb-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-5 sm:p-8 relative overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-8 relative">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <button
            onClick={() => router.push("/")}
            className="absolute right-0 top-0 p-1"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* ① 이메일 */}
        <div ref={emailRef} className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            이메일
          </label>
          <div className="flex gap-1.5">
            <input
              type="email"
              placeholder="example@google.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={cn(
                "flex-1 min-w-0 h-11 rounded-lg border px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2",
                emailHasError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-300"
              )}
            />
            <button
              type="button"
              onClick={handleCheckEmail}
              disabled={!emailFormatValid || emailCheckLoading}
              className="shrink-0 h-11 px-3 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {emailCheckLoading ? "확인중..." : "중복확인"}
            </button>
          </div>
          {emailMessage && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">{emailMessage}</p>
          )}
        </div>

        {/* ② 비밀번호 */}
        <div ref={passwordRef} className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordTouched(true);
            }}
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg border px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2",
              showPasswordError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-300"
            )}
          />
          {showPasswordError ? (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              영문/숫자/특수문자 중 2가지를 포함하여 8자 이상 입력해주세요.
            </p>
          ) : (
            <p className="mt-1.5 text-xs sm:text-sm text-gray-400">
              영문/숫자/특수문자 중 2가지 이상 조합, 8자~32자
            </p>
          )}
        </div>

        {/* ③ 비밀번호 확인 */}
        <div ref={passwordConfirmRef} className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
              setPasswordConfirmTouched(true);
            }}
            className={cn(
              "w-full h-11 sm:h-12 rounded-lg border px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2",
              showPasswordConfirmError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-gray-300"
            )}
          />
          {showPasswordConfirmError && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* ④ 휴대폰 번호 */}
        <div ref={phoneRef} className="mb-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            휴대폰 번호
          </label>
          <div className="flex gap-1.5 items-center">
            {/* 국번 셀렉트 */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPrefixDropdown(!showPrefixDropdown);
                }}
                disabled={phoneVerified}
                className="h-10 px-2 rounded-lg border border-gray-300 flex items-center gap-0.5 text-sm bg-white disabled:opacity-50"
              >
                {phonePrefix}
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showPrefixDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                  {PHONE_PREFIXES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPhonePrefix(p);
                        setShowPrefixDropdown(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left"
                    >
                      {p === phonePrefix ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="w-4" />
                      )}
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={phoneMid}
              onChange={(e) =>
                setPhoneMid(e.target.value.replace(/\D/g, ""))
              }
              disabled={phoneVerified}
              className="flex-1 min-w-0 h-10 rounded-lg border border-gray-300 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:bg-gray-50"
            />
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={phoneLast}
              onChange={(e) =>
                setPhoneLast(e.target.value.replace(/\D/g, ""))
              }
              disabled={phoneVerified}
              className="flex-1 min-w-0 h-10 rounded-lg border border-gray-300 px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={phoneVerified}
              className="shrink-0 h-10 px-3 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              인증요청
            </button>
          </div>

          {/* 인증번호 입력 */}
          {verificationSent && !phoneVerified && (
            <div className="mt-3">
              <div className="flex gap-1.5">
                <div className="flex-1 min-w-0 relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="인증번호를 입력하세요."
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 pr-14 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  {timer > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-red font-medium">
                      {formatTimer(timer)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="shrink-0 h-10 px-3 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 whitespace-nowrap"
                >
                  인증확인
                </button>
              </div>
            </div>
          )}

          {phoneVerified && (
            <p className="mt-1.5 text-xs sm:text-sm text-green-600">
              휴대폰 인증이 완료되었습니다.
            </p>
          )}
          {phoneError && (
            <p className="mt-1.5 text-xs sm:text-sm text-red-500">{phoneError}</p>
          )}
        </div>

        {/* ⑤ 약관 동의 */}
        <div ref={agreementRef} className="mb-6">
          <label className="flex items-center gap-3 py-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={(e) => handleAllAgreement(e.target.checked)}
              className="w-5 h-5 accent-brand-red"
            />
            <span className="text-sm sm:text-base font-bold text-gray-900">
              전체 동의
            </span>
          </label>
          <div className="border-t border-gray-200 mt-1 pt-2 space-y-0.5">
            <AgreementRow
              label="만 14세 이상입니다"
              checked={agreements.age14}
              onChange={(v) => handleAgreementChange("age14", v)}
            />
            <AgreementRow
              label="이용약관 동의(필수)"
              checked={agreements.terms}
              onChange={(v) => handleAgreementChange("terms", v)}
              showLink
            />
            <AgreementRow
              label="개인정보처리방침 동의(필수)"
              checked={agreements.privacy}
              onChange={(v) => handleAgreementChange("privacy", v)}
              showLink
            />
            <AgreementRow
              label="개인정보 수집 및 이용 동의(필수)"
              checked={agreements.dataCollection}
              onChange={(v) => handleAgreementChange("dataCollection", v)}
              showLink
            />
            <AgreementRow
              label="광고성 정보 수신 동의(선택)"
              checked={agreements.marketing}
              onChange={(v) => handleAgreementChange("marketing", v)}
              showLink
            />
            <div className="pl-8 flex gap-4 py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.marketingEmail}
                  onChange={(e) =>
                    handleAgreementChange("marketingEmail", e.target.checked)
                  }
                  className="w-4 h-4 accent-brand-red"
                />
                <span className="text-xs sm:text-sm text-gray-600">이메일</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.marketingSms}
                  onChange={(e) =>
                    handleAgreementChange("marketingSms", e.target.checked)
                  }
                  className="w-4 h-4 accent-brand-red"
                />
                <span className="text-xs sm:text-sm text-gray-600">SMS</span>
              </label>
            </div>
          </div>
        </div>

        {/* ⑥ 회원가입 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-11 sm:h-12 bg-brand-red text-white rounded-lg font-bold text-sm sm:text-base hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-brand-red font-medium hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

function AgreementRow({
  label,
  checked,
  onChange,
  showLink,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  showLink?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 accent-brand-red"
        />
        <span className="text-xs sm:text-sm text-gray-700">{label}</span>
      </label>
      {showLink && (
        <button
          type="button"
          onClick={() => toast("준비 중입니다.")}
          className="text-xs sm:text-sm text-gray-400 hover:text-gray-600 hover:underline"
        >
          보기
        </button>
      )}
    </div>
  );
}
