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

## 현재 배포 상태

| 구성 요소 | 상태 | 위치 |
| --- | --- | --- |
| Supabase 프로젝트 | 생성 완료 (`folioup`, Seoul 리전), 스키마 적용 완료 | Supabase 대시보드 → 조직 `JinyoungBang` → `folioup` |
| 웹 대시보드 (기업용) | Vercel 배포 완료 | https://web-sage-one-23.vercel.app |
| GitHub 연동 | `minerba/myhouse` 저장소 연결됨, `claude/annyeong-ecxcip` 브랜치로 푸시하면 자동 재배포 | Root Directory: `folioup/web` |
| 모바일 앱 (구직자용) | 코드 준비 완료, 로컬에서 Expo Go로 실행 | 아래 참고 |

기업 계정으로 https://web-sage-one-23.vercel.app/login 에서 바로 회원가입해서 사용해보실
수 있어요.

### Expo Go로 모바일 앱 실행하기

```bash
cd folioup/mobile
npm install
npx expo start
```

`.env`는 이미 실제 Supabase 값으로 채워져 있습니다 (git에는 커밋되지 않음). 터미널에
뜨는 QR 코드를 아이폰의 **Expo Go** 앱(App Store에서 무료 설치)으로 스캔하면 바로
앱이 실행됩니다.

### 참고

- Supabase 프로젝트 생성 시 사용한 DB 비밀번호는 저장해두지 않았습니다. 필요하시면
  Supabase 대시보드 → Project Settings → Database에서 재설정하실 수 있어요.
- 무료 티어 프로젝트 2개 제한 때문에 기존 `myhouse` Supabase 프로젝트는 일시정지
  처리했습니다. 대시보드에서 언제든 다시 활성화(Restore)하실 수 있습니다.
