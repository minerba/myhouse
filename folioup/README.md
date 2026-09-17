# FolioUp

작은 실무 태스크로 실력을 증명하고, 검증된 실적을 바탕으로 정규직 전환까지 이어지는
플랫폼입니다.

- **구직 청년 → iOS 앱** (`mobile/`, Expo / React Native): 태스크 열람, 지원, 결과물 제출,
  누적 실적(프로필) 확인
- **기업 → 웹 대시보드** (`web/`, Next.js): 태스크 등록, 지원자 검토(수락/거절), 결과물
  평가
- **공용 백엔드** (`supabase/`): 인증 + Postgres DB + Row Level Security

두 프런트엔드는 같은 Supabase 프로젝트를 공유합니다.

## 핵심 사이클

1. 기업이 작은 실무 태스크를 웹 대시보드에 등록
2. 구직자가 앱에서 태스크를 보고 지원
3. 기업이 지원자를 수락
4. 구직자가 결과물(링크)을 제출
5. 기업이 점수·피드백·정규직 전환 의향을 평가
6. 평가가 구직자의 "검증된 실적"으로 누적되어, 다른 기업도 프로필에서 확인 가능

## 계정 생성 체크리스트 (5분)

이 프로젝트를 실제로 띄우려면 아래 두 계정이 필요합니다. 코드는 이미 다 준비되어
있으니, 계정을 만들고 값 몇 개만 알려주시면 바로 연결해서 실행 가능한 상태로
만들어드릴게요.

### 1. Supabase

1. https://supabase.com → 가입 → **New Project** 생성 (region은 `Northeast Asia (Seoul)` 권장)
2. 프로젝트 생성 후 좌측 메뉴 **SQL Editor** → New query
3. 이 저장소의 `folioup/supabase/schema.sql` 내용을 그대로 붙여넣고 실행 (테이블 +
   RLS 정책이 한 번에 생성됩니다)
4. 좌측 메뉴 **Project Settings → API**에서 다음 두 값을 복사해서 알려주세요:
   - `Project URL`
   - `anon public` key

### 2. Vercel (기업용 웹 대시보드 배포)

1. https://vercel.com → GitHub 계정으로 가입/로그인
2. **Add New → Project** → 이 저장소(`minerba/myhouse`) 선택
3. **Root Directory**를 `folioup/web`으로 지정 (모노레포이므로 필수)
4. **Environment Variables**에 아래 두 개 추가 (Supabase에서 복사한 값):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### 3. Expo Go (구직자용 iOS 앱 미리보기)

계정 생성이 필요 없습니다. 로컬에서 바로 실행:

```bash
cd folioup/mobile
cp .env.example .env
# .env에 Supabase URL/anon key 입력
npm install
npx expo start
```

터미널에 뜨는 QR 코드를 아이폰의 **Expo Go** 앱(App Store에서 무료 설치)으로 스캔하면
바로 앱이 실행됩니다.

## 알려주실 것

위 체크리스트를 마치신 후 아래 값들만 알려주시면 제가 직접 연결하고, 정상 동작까지
확인해드릴게요.

- Supabase Project URL
- Supabase anon public key
- (선택) Vercel 배포 URL — 확인용
