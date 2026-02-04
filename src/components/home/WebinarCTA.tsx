"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Play, Calendar } from "lucide-react";

export default function WebinarCTA() {
  return (
    <section className="py-20 bg-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
            <Play className="w-4 h-4" />
            <span className="text-base font-medium">무료 웨비나</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            먼저 무료로 경험해보세요
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            장사의 정석 핵심 내용을 30분으로 압축한 무료 웨비나.<br />
            신청만 하면 사전 알림을 보내드립니다.
          </p>
          <Link href="/webinar">
            <Button
              size="xl"
              className="bg-white text-brand-red hover:bg-gray-100"
            >
              <Calendar className="w-5 h-5 mr-2" />
              무료 웨비나 신청하기
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
