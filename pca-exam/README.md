# PCA 모의고사

GCP Professional Cloud Architect 시험 대비 개인용 학습·모의고사 앱 (React + Vite + Supabase 선택 + PWA).

- 챕터 10개 × 50문항 = 500문항, 케이스 스터디 4종 × 12문항 = 48문항. 모두 오리지널 시나리오형 문제
- 연습 모드(즉시 해설) / 시험 모드(타이머, 제출 후 채점)
- 공식 도메인 비중대로 가중 랜덤 모의고사, 케이스 문제 포함 옵션
- 검색, 오답 노트, 북마크, 새로고침 후 세션 복구
- Supabase를 설정하면 Google 로그인과 진행 상황 동기화

## 실행

```bash
npm install
npm run dev          # 개발 서버
npm run validate     # 문제 은행 검증
npm run check-links  # 공식 문서 링크 확인 (네트워크 필요)
npm run build        # 검증 + 프로덕션 빌드 (dist/)
npm run preview      # 빌드 결과 미리보기
```

## Supabase 동기화 (선택)

1. Supabase 프로젝트를 만들고 `supabase/schema.sql`을 SQL Editor에서 실행한다.
2. Authentication → Providers에서 Google을 켜고, Google Cloud 콘솔의 OAuth 클라이언트 ID/시크릿을 넣는다. 배포 URL을 Redirect URL에 추가한다.
3. `.env.example`을 `.env`로 복사하고 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 채운다.

설정하지 않으면 localStorage만 쓰는 로컬 전용 모드로 동작한다.

## 설치 (PWA)

HTTPS로 배포한 뒤(예: Vercel, Netlify, Cloudflare Pages, Firebase Hosting):

- Android Chrome: 메뉴 → "앱 설치" 또는 "홈 화면에 추가"
- iOS Safari: 공유 → "홈 화면에 추가"
- 데스크톱 Chrome/Edge: 주소창의 설치 아이콘

## 문제 작성

작성 기준, 스키마, 개명된 서비스 목록은 `CLAUDE.md`를 따른다.
