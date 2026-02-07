"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative bg-brand-navy overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-block bg-red-900/30 text-red-400 text-base font-semibold px-4 py-1.5 rounded-full mb-4">
            장사의 정석 - 6주 완성
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            잘 될 수밖에 없는<br />
            <span className="text-brand-red">구조를 만드세요</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            잘 파는 사람들의 공통점을 6주 만에 내 것으로.<br />
            실전 사례 중심, 바로 적용 가능한 장사 전략.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/courses/jangsa" className="block">
              <Button size="xl" className="w-full sm:min-w-[200px]">강의 살펴보기</Button>
            </Link>
            <Link href="/webinar" className="block">
              <Button variant="outline" size="xl" className="w-full sm:min-w-[200px]">
                무료 웨비나 신청
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
