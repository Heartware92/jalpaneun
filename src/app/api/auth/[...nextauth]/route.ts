import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const firebaseUser = userCredential.user;

          // 이메일 인증 확인
          if (!firebaseUser.emailVerified) {
            throw new Error("email-not-verified");
          }

          // Firestore에서 유저 정보 가져오기
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data();

          return {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: userData?.displayName || firebaseUser.displayName || "",
            image: userData?.photoURL || firebaseUser.photoURL || null,
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "";
          if (errorMessage === "email-not-verified") {
            throw new Error("email-not-verified");
          }
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Credentials는 authorize에서 이미 처리됨
      if (account?.provider === "credentials") {
        return true;
      }

      // 소셜 로그인: Firestore에 유저 저장
      if (!user.email) return false;

      try {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: user.id,
            email: user.email,
            displayName: user.name || "",
            photoURL: user.image || null,
            provider: account?.provider || "unknown",
            createdAt: new Date(),
          });
        }
        return true;
      } catch (error) {
        console.error("Error saving user to Firestore:", error);
        return true;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;
      }
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
