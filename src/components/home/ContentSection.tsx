"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react";

const contents = [
  {
    icon: TrendingUp,
    title: "월 매출 정체되는 진짜 이유",
    description: "대부분의 사장님들이 놓치는 핵심 포인트. 메뉴가 아니라 '구조'의 문제입니다.",
  },
  {
    icon: Users,
    title: "잘 파는 사람들의 공통점",
    description: "매출 상위 1% 사장님들의 운영 패턴을 분석한 실전 인사이트.",
  },
  {
    icon: Target,
    title: "실전 사례 요약",
    description: "이론이 아닌 실제 매장에서 검증된 전략과 결과를 공유합니다.",
  },
  {
    icon: BarChart3,
    title: "6주 커리큘럼 미리보기",
    description: "주차별 학습 내용과 기대 효과를 한눈에 확인하세요.",
  },
];

export default function ContentSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            왜 잘 파는 사람들은 다를까?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            장사의 본질을 꿰뚫는 실전 콘텐츠
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contents.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-brand-red" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
