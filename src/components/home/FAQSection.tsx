"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "강의는 어떻게 수강하나요?",
    a: "결제 완료 후 '내 강의' 페이지에서 바로 시청할 수 있습니다. 주차별로 영상이 순차 오픈됩니다.",
  },
  {
    q: "수강 기간 제한이 있나요?",
    a: "결제 후 6개월간 무제한 반복 시청이 가능합니다.",
  },
  {
    q: "환불은 가능한가요?",
    a: "결제 후 7일 이내, 강의 진행률 30% 미만일 경우 전액 환불 가능합니다.",
  },
  {
    q: "웨비나는 정말 무료인가요?",
    a: "네, 무료 웨비나는 별도의 비용 없이 참여 가능합니다. 신청만 해주세요.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-600 text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
