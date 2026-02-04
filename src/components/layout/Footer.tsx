import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 사업자 정보 */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">잘파는사람들</h3>
            <ul className="space-y-1 text-sm">
              <li>상호명: (주)잘파는사람들</li>
              <li>대표: -</li>
              <li>사업자등록번호: -</li>
              <li>통신판매업신고: -</li>
              <li>주소: -</li>
            </ul>
          </div>

          {/* 고객센터 / FAQ */}
          <div>
            <h4 className="text-white font-semibold mb-4">고객센터</h4>
            <ul className="space-y-2 text-sm">
              <li>이메일: support@jalpaneun.com</li>
              <li>운영시간: 평일 10:00 - 18:00</li>
            </ul>
            <div className="mt-4">
              <Link href="/support" className="text-sm hover:text-white transition-colors">
                자주 묻는 질문 (FAQ)
              </Link>
            </div>
          </div>

          {/* 법적 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">약관 및 정책</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보 처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} (주)잘파는사람들. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
