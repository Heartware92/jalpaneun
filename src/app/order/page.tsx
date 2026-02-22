"use client";

import { useState } from "react";
import { ChevronDown, PlayCircle } from "lucide-react";
import toast from "react-hot-toast";

// TODO: 실제 상품 데이터로 교체
const COURSE = {
  id: "jangsa",
  name: "장사의 정석",
  originalPrice: 4000000,
  thumbnail: "/images/course-thumbnail.png",
};

const COUPONS = [
  { id: "none", label: "쿠폰을 선택해주세요", discount: 0 },
  { id: "launch-1", label: "🎉 1기 한정 런칭 특별가 (-51만원)", discount: 510000 },
];

type PaymentMethod = "naverpay" | "kakaopay" | "card" | "tosspay";

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "naverpay", label: "네이버페이" },
  { id: "kakaopay", label: "카카오페이" },
  { id: "card", label: "신용카드" },
  { id: "tosspay", label: "토스페이" },
];

export default function OrderPage() {
  const [selectedCoupon, setSelectedCoupon] = useState("none");
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // 약관 동의
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    thirdParty: false,
    refund: false,
  });

  const coupon = COUPONS.find((c) => c.id === selectedCoupon);
  const discount = coupon?.discount || 0;
  const totalPrice = COURSE.originalPrice - discount;
  const monthlyPrice = Math.round(totalPrice / 12);

  const allAgreed = agreements.terms && agreements.privacy && agreements.thirdParty && agreements.refund;

  const handleAllAgreement = (checked: boolean) => {
    setAgreements({
      all: checked,
      terms: checked,
      privacy: checked,
      thirdParty: checked,
      refund: checked,
    });
  };

  const handleAgreementChange = (key: keyof typeof agreements, checked: boolean) => {
    const next = { ...agreements, [key]: checked };
    next.all = next.terms && next.privacy && next.thirdParty && next.refund;
    setAgreements(next);
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      toast.error("결제수단을 선택해주세요.");
      return;
    }
    if (!allAgreed) {
      toast.error("필수 약관에 모두 동의해주세요.");
      return;
    }
    // TODO: 포트원 결제 연동
    toast.success("결제 기능은 준비 중입니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">주문/결제</h1>
        {/* ① 주문상품 */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">주문상품</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {COURSE.thumbnail ? (
                <img src={COURSE.thumbnail} alt={COURSE.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-gray-900">{COURSE.name}</p>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {COURSE.originalPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        </section>

        {/* ② 할인/쿠폰 */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">할인/쿠폰</h2>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCouponDropdown(!showCouponDropdown)}
              className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between text-left"
            >
              <span className="text-sm sm:text-base text-gray-900">
                {coupon?.id === "none" ? "쿠폰을 선택해주세요" : coupon?.label}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCouponDropdown ? "rotate-180" : ""}`} />
            </button>
            {showCouponDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {COUPONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCoupon(c.id);
                      setShowCouponDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm sm:text-base hover:bg-gray-50 transition-colors ${
                      selectedCoupon === c.id ? "bg-gray-50 font-medium" : ""
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ③ 결제수단 */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">결제수단</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`py-3 px-2 rounded-xl border text-sm sm:text-base font-medium transition-colors ${
                  selectedMethod === method.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </section>

        {/* ④ 결제금액 */}
        <section>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">결제금액</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">판매금액</span>
              <span className="text-gray-900">{COURSE.originalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">총 할인금액</span>
              <span className="text-brand-red">
                {discount > 0 ? `-${discount.toLocaleString()}원` : "0원"}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-sm sm:text-base font-semibold text-gray-900">총 결제금액</span>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 text-right mt-1">
                12개월 할부 시 월 {monthlyPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        </section>

        {/* ⑤ 약관 동의 */}
        <section>
          <label className="flex items-center gap-3 py-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={(e) => handleAllAgreement(e.target.checked)}
              className="w-5 h-5 accent-gray-900"
            />
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              강의 및 결제 정보를 확인하였으며, 이에 동의합니다 (필수)
            </span>
          </label>
          <div className="pl-8 space-y-1 mt-1">
            <AgreementItem
              label="이용약관"
              checked={agreements.terms}
              onChange={(v) => handleAgreementChange("terms", v)}
            />
            <AgreementItem
              label="개인(신용)정보 수집이용 동의"
              checked={agreements.privacy}
              onChange={(v) => handleAgreementChange("privacy", v)}
            />
            <AgreementItem
              label="개인(신용)정보 제3자 제공 동의"
              checked={agreements.thirdParty}
              onChange={(v) => handleAgreementChange("thirdParty", v)}
            />
            <AgreementItem
              label="환불 정책 동의"
              checked={agreements.refund}
              onChange={(v) => handleAgreementChange("refund", v)}
            />
          </div>
        </section>

        {/* ⑥ 결제 버튼 */}
        <button
          type="button"
          onClick={handlePayment}
          className="w-full py-4 bg-brand-red text-white font-bold text-base sm:text-lg rounded-xl hover:bg-red-700 transition-colors"
        >
          {discount > 0
            ? `${Math.round(discount / 10000)}만원 할인받고 수강하기`
            : "수강하기"}
        </button>

        {/* 하단 여백 */}
        <div className="h-8" />
      </div>
    </div>
  );
}

function AgreementItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-gray-900"
        />
        <span className="text-xs sm:text-sm text-gray-600">{label}</span>
      </label>
      <button
        type="button"
        onClick={() => toast("준비 중입니다.")}
        className="text-xs sm:text-sm text-brand-red hover:underline"
      >
        보기
      </button>
    </div>
  );
}
