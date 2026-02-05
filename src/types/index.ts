export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  provider: "email" | "kakao" | "naver" | "google";
  emailVerified?: boolean;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  instructorName: string;
  curriculum: Week[];
  createdAt: Date;
}

export interface Week {
  weekNumber: number;
  title: string;
  openDate: Date;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // minutes
  videoUrl: string;
  description?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  paymentId: string;
  amount: number;
  status: "paid" | "refunded";
  createdAt: Date;
}

export interface Progress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  watchedSeconds: number;
  updatedAt: Date;
}

export interface WebinarRegistration {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}
