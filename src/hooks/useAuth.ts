"use client";

import { useSession, signIn, signOut as nextAuthSignOut } from "next-auth/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { User } from "@/types";

export function useAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.id) {
        try {
          const userDoc = await getDoc(doc(db, "users", session.user.id));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            setUser({
              uid: session.user.id,
              email: session.user.email || "",
              displayName: session.user.name || "",
              photoURL: session.user.image || undefined,
              provider: session.user.provider as User["provider"],
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    if (status !== "loading") {
      fetchUser();
    }
  }, [session, status]);

  // 이메일/비밀번호 회원가입
  const signUp = async (email: string, password: string, name: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);

    const userData: User = {
      uid: credential.user.uid,
      email,
      displayName: name,
      provider: "email",
      emailVerified: false,
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
    setUser(null);
  };

  return {
    user,
    session,
    loading: status === "loading" || loading,
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
