"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AuthModalMode = "login" | "signup";

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  openLogin: () => void;
  openSignup: () => void;
  close: () => void;
  switchMode: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");

  const openLogin = useCallback(() => {
    setMode("login");
    setIsOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setMode("signup");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const switchMode = useCallback(() => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openLogin, openSignup, close, switchMode }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
