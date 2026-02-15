"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Clock, PlayCircle } from "lucide-react";

const weeks = [
  { week: 1, title: "장사의 기본기", lessons: 4, desc: "매장 운영의 핵심 구조를 이해합니다." },
  { week: 2, title: "고객을 끌어오는 법", lessons: 3, desc: "신규 고객 유입 전략을 배웁니다." },
  { week: 3, title: "재방문율 높이기", lessons: 4, desc: "고객이 다시 오게 만드는 시스템." },
  { week: 4, title: "매출 구조 만들기", lessons: 3, desc: "안정적인 매출 구조를 설계합니다." },
  { week: 5, title: "마케팅 실전", lessons: 4, desc: "적은 비용으로 최대 효과를 내는 마케팅." },
  { week: 6, title: "성장 전략", lessons: 3, desc: "지속 가능한 성장을 위한 전략." },
];

export default function CoursePreviewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-red-100 text-red-600 text-base font-semibold px-4 py-1.5 rounded-full mb-4">
            6주 완성
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            장사의 정석 커리큘럼
          </h2>
          <p className="text-lg text-gray-600">
            매주 3~4개 영상 (20~30분), 총 6주 과정
          </p>
        </motion.div>

        <div className="space-y-4">
          {weeks.map((w, i) => (
            <motion.div
              key={w.week}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 sm:gap-4 bg-gray-50 rounded-xl p-4 sm:p-5 hover:bg-red-50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-brand-red text-white rounded-xl flex items-center justify-center font-bold text-sm sm:text-base">
                {w.week}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{w.title}</h3>
                    <p className="text-xs sm:text-base text-gray-500">{w.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-base text-gray-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {w.lessons}개
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ~90분
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/courses/jangsa">
            <Button size="lg">수강 신청하기</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
