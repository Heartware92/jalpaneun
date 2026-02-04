"use client";

import { useState } from "react";
import { PlayCircle, CheckCircle, Lock } from "lucide-react";

const curriculum = [
  {
    week: 1,
    title: "장사의 기본기",
    open: true,
    lessons: [
      { id: "1-1", title: "매장 운영의 핵심 구조", duration: 25, videoUrl: "" },
      { id: "1-2", title: "매출 공식 이해하기", duration: 20, videoUrl: "" },
      { id: "1-3", title: "원가 구조와 수익률", duration: 30, videoUrl: "" },
      { id: "1-4", title: "실전 체크리스트", duration: 20, videoUrl: "" },
    ],
  },
  {
    week: 2,
    title: "고객을 끌어오는 법",
    open: false,
    lessons: [
      { id: "2-1", title: "신규 고객 유입 전략", duration: 25, videoUrl: "" },
      { id: "2-2", title: "온라인 마케팅 기초", duration: 30, videoUrl: "" },
      { id: "2-3", title: "지역 타겟팅 실전", duration: 25, videoUrl: "" },
    ],
  },
  {
    week: 3,
    title: "재방문율 높이기",
    open: false,
    lessons: [
      { id: "3-1", title: "고객 경험 설계", duration: 20, videoUrl: "" },
      { id: "3-2", title: "단골 만드는 시스템", duration: 25, videoUrl: "" },
      { id: "3-3", title: "리뷰 관리 전략", duration: 20, videoUrl: "" },
      { id: "3-4", title: "멤버십/쿠폰 활용법", duration: 25, videoUrl: "" },
    ],
  },
  {
    week: 4,
    title: "매출 구조 만들기",
    open: false,
    lessons: [
      { id: "4-1", title: "메뉴 엔지니어링", duration: 30, videoUrl: "" },
      { id: "4-2", title: "객단가 올리는 법", duration: 25, videoUrl: "" },
      { id: "4-3", title: "시간대별 매출 전략", duration: 20, videoUrl: "" },
    ],
  },
  {
    week: 5,
    title: "마케팅 실전",
    open: false,
    lessons: [
      { id: "5-1", title: "SNS 마케팅 실전", duration: 25, videoUrl: "" },
      { id: "5-2", title: "배달앱 최적화", duration: 30, videoUrl: "" },
      { id: "5-3", title: "네이버 플레이스 공략", duration: 25, videoUrl: "" },
      { id: "5-4", title: "광고비 효율화", duration: 20, videoUrl: "" },
    ],
  },
  {
    week: 6,
    title: "성장 전략",
    open: false,
    lessons: [
      { id: "6-1", title: "매장 확장 타이밍", duration: 25, videoUrl: "" },
      { id: "6-2", title: "직원 관리와 시스템화", duration: 30, videoUrl: "" },
      { id: "6-3", title: "지속 성장을 위한 로드맵", duration: 20, videoUrl: "" },
    ],
  },
];

export default function CoursePlayerPage() {
  const [currentLesson, setCurrentLesson] = useState(curriculum[0].lessons[0]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black flex items-center justify-center">
              {currentLesson.videoUrl ? (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <PlayCircle className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>동영상 준비 중</p>
                </div>
              )}
            </div>
            <div className="p-6">
              <h1 className="text-xl font-bold text-white mb-2">
                {currentLesson.title}
              </h1>
              <p className="text-gray-400 text-sm">{currentLesson.duration}분</p>
            </div>
          </div>

          {/* Sidebar - Curriculum */}
          <div className="bg-gray-800 lg:h-screen lg:overflow-y-auto">
            <div className="p-4">
              <h2 className="text-white font-semibold mb-4">커리큘럼</h2>
              {curriculum.map((week) => (
                <div key={week.week} className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    {week.open ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>
                      {week.week}주차 - {week.title}
                    </span>
                  </div>
                  {week.open &&
                    week.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                          currentLesson.id === lesson.id
                            ? "bg-red-600/20 text-red-400"
                            : "text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{lesson.title}</span>
                          <span className="text-xs text-gray-500">
                            {lesson.duration}분
                          </span>
                        </div>
                      </button>
                    ))}
                  {!week.open && (
                    <p className="px-3 text-xs text-gray-600">
                      아직 오픈되지 않은 주차입니다.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
