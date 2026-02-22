"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/contexts/AuthModalContext";

export default function SignupPage() {
  const router = useRouter();
  const { openSignup } = useAuthModal();

  useEffect(() => {
    openSignup();
    router.replace("/");
  }, [openSignup, router]);

  return null;
}
