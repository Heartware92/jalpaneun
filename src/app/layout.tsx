import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import { AuthModalProvider } from "@/contexts/AuthModalContext";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "(주)잘파는사람들 - 장사의 정석",
  description: "잘 파는 사람들의 공통점을 배우는 실전 강의 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <AuthProvider>
          <AuthModalProvider>
            <Toaster position="top-center" />
            <Header />
            <AuthModal />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
