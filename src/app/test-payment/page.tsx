'use client';

import { useState } from 'react';
import * as PortOne from '@portone/browser-sdk/v2';

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handlePayment = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const paymentId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId,
        orderName: '테스트 강의 결제',
        totalAmount: 1000,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
        customer: {
          fullName: '테스트 구매자',
          email: 'test@test.com',
          phoneNumber: '01012345678',
        },
      });

      if (response?.code) {
        // 결제 실패 또는 취소
        setResult(`결제 실패/취소: ${response.code} - ${response.message}`);
      } else {
        // 결제 성공
        setResult(`결제 성공! Payment ID: ${paymentId}`);
      }
    } catch (error) {
      setResult(`에러 발생: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">포트원 결제 테스트</h1>

        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">테스트 결제 정보</p>
          <p className="font-medium">상품명: 테스트 강의 결제</p>
          <p className="font-medium">금액: 1,000원</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full bg-brand-red text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
        >
          {isLoading ? '결제 진행 중...' : '1,000원 테스트 결제하기'}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-lg text-sm ${
            result.includes('성공') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {result}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-400 text-center">
          <p>테스트 카드번호: 4242-4242-4242-4242</p>
          <p>유효기간: 아무거나 / CVC: 아무거나</p>
        </div>
      </div>
    </div>
  );
}
