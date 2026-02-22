"use client";

import { useSession, signIn, signOut as nextAuthSignOut } from "next-auth/react";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useMemo } from "react";
import type { User } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();

  // 세션에서 바로 유저 정보 생성 (Firestore 재조회 없음)
  const user = useMemo<User | null>(() => {
    if (!session?.user?.id) return null;
    return {
      uid: session.user.id,
      email: session.user.email || "",
      displayName: session.user.displayName || session.user.name || "",
      photoURL: session.user.image || undefined,
      phone: session.user.phone || "",
      provider: (session.user.provider || "unknown") as User["provider"],
      createdAt: new Date(),
    };
  }, [session]);

  // 이메일/비밀번호 회원가입
  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    const userData: User = {
      uid: credential.user.uid,
      email,
      displayName: name || email.split("@")[0],
      phone: phone || "",
      provider: "email",
      phoneVerified: !!phone,
      createdAt: new Date(),
    };
    await setDoc(doc(db, "users", credential.user.uid), userData);
  };

  // 이메일/비밀번호 로그인
  const signInWithEmail = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return result;
  };

  // 인증 메일 재발송
  const resendVerification = async (email: string, password: string) => {
    const { signInWithEmailAndPassword, sendEmailVerification, signOut } = await import("firebase/auth");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);
    await signOut(auth);
  };

  // 소셜 로그인
  const signInWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const signInWithNaver = async () => {
    await signIn("naver", { callbackUrl: "/" });
  };

  const signInWithKakao = async () => {
    await signIn("kakao", { callbackUrl: "/" });
  };

  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: "/" });
  };

  return {
    user,
    session,
    loading: status === "loading",
    isAuthenticated: !!session,
    signUp,
    signIn: signInWithEmail,
    signInWithGoogle,
    signInWithNaver,
    signInWithKakao,
    signOut,
    resendVerification,
  };
}
