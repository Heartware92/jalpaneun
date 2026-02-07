import { NextRequest, NextResponse } from "next/server";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "전화번호와 인증번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const verDoc = await getDoc(doc(db, "phone_verifications", phone));

    if (!verDoc.exists()) {
      return NextResponse.json({
        success: false,
        error: "인증번호를 먼저 요청해주세요.",
      });
    }

    const data = verDoc.data();

    // 만료 확인
    const expiresAt = data.expiresAt?.toDate
      ? data.expiresAt.toDate()
      : new Date(data.expiresAt);
    if (new Date() > expiresAt) {
      return NextResponse.json({ success: false, expired: true });
    }

    // 인증번호 확인
    if (data.code !== code) {
      return NextResponse.json({ success: false, invalid: true });
    }

    // 휴대폰 중복 확인
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json({ success: false, duplicate: true });
    }

    // 인증 완료 - 임시 데이터 삭제
    await deleteDoc(doc(db, "phone_verifications", phone));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { success: false, error: "인증 확인에 실패했습니다." },
      { status: 500 }
    );
  }
}
