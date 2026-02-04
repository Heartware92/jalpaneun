"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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
    setUser(userData);
  };

  const signIn = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!credential.user.emailVerified) {
      await firebaseSignOut(auth);
      throw new Error("email-not-verified");
    }
  };

  const resendVerification = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  };

  const signInWithKakao = async () => {
    const provider = new OAuthProvider("oidc.kakao");
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email || "",
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || undefined,
        provider: "kakao",
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", result.user.uid), userData);
    }
  };

  const signInWithNaver = async () => {
    const provider = new OAuthProvider("oidc.naver");
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email || "",
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || undefined,
        provider: "naver",
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", result.user.uid), userData);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, "users", result.user.uid));
    if (!userDoc.exists()) {
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email || "",
        displayName: result.user.displayName || "",
        photoURL: result.user.photoURL || undefined,
        provider: "google",
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", result.user.uid), userData);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return {
    user,
    firebaseUser,
    loading,
    signUp,
    signIn,
    signInWithKakao,
    signInWithNaver,
    signInWithGoogle,
    signOut,
    resendVerification,
  };
}
