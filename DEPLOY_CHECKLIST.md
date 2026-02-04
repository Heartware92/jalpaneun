# 배포 전 체크리스트

실서비스 배포 전 반드시 변경/확인해야 할 항목들.

## Firebase 설정

- [ ] Google 로그인 - 프로젝트 지원 이메일을 의뢰인 회사 이메일로 변경
  - 현재: 개발자 개인 이메일 (테스트용)
  - 위치: Firebase 콘솔 → Authentication → Sign-in method → Google → 프로젝트 지원 이메일
- [ ] Google 로그인 - 프로젝트의 공개용 이름을 "잘파는사람들"로 확인
- [ ] 카카오 OIDC 프로바이더 설정 (oidc.kakao)
- [ ] 네이버 OIDC 프로바이더 설정 (oidc.naver)
- [ ] Firestore 보안 규칙 실서비스용으로 강화
- [ ] Firebase 프로젝트 Spark → Blaze 플랜 업그레이드 (필요 시)

## 테스트 데이터 정리

- [ ] Authentication에 등록된 테스트 계정 삭제
- [ ] Firestore webinar_registrations 컬렉션 테스트 데이터 삭제
- [ ] Firestore users 컬렉션 테스트 데이터 삭제

## 환경 변수 / 도메인

- [ ] Vercel 환경 변수에 프로덕션 Firebase 설정 확인
- [ ] Firebase Auth 승인된 도메인에 프로덕션 도메인 추가
- [ ] 카카오/네이버 개발자 콘솔 Redirect URI에 프로덕션 도메인 추가

## 콘텐츠 (의뢰인 제공 대기)

- [ ] 요식업 성공 공식 - 상세 콘텐츠 교체 (현재 TBU 플레이스홀더)
- [ ] 장사의 정석 - 상세 콘텐츠 교체 (현재 TBU 플레이스홀더)
- [ ] 동영상 강의 업로드 및 URL 연결
- [ ] 푸터 사업자 정보, 이용약관, 개인정보 처리방침

## 결제

- [ ] 토스페이먼츠 실서비스 키로 교체 (현재 미연동)
