import { NextRequest, NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.replace(/-/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "올바른 전화번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await setDoc(doc(db, "phone_verifications", phone), {
      code,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      createdAt: new Date(),
    });

    // TODO: 실제 SMS 발송 서비스 연동 (NHN Cloud, Twilio 등)
    console.log(`[DEV] 인증번호: ${phone} → ${code}`);

    return NextResponse.json({
      success: true,
      ...(process.env.NODE_ENV === "development" && { devCode: code }),
    });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json(
      { success: false, error: "인증번호 발송에 실패했습니다." },
      { status: 500 }
    );
  }
}
