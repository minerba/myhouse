# PCA 모의고사 앱 — 작업 가이드

GCP Professional Cloud Architect(PCA) 시험 대비 개인용 학습·모의고사 앱. React + Vite(JS) + Supabase(선택) + PWA.
모든 사용자 대상 텍스트와 문서는 **한국어**로 작성한다.

## 폴더 구조

```
pca-exam/
  src/
    questions.js              # 챕터 문제 집계 (QUESTIONS, CHAPTERS, questionById)
    caseStudies.js            # 케이스 스터디 4종 요약 + 케이스 문제 집계 (CASE_STUDIES, CASE_QUESTIONS)
    data/domains.js           # 공식 도메인·비중, 챕터별 도메인 문항 계획(CHAPTER_PLAN)
    data/chapters/chNN.js     # 챕터별 문제 50개 (export default [...])
    data/cases/<caseId>.js    # 케이스 스터디 문제
    lib/                      # 세션·저장소·출제 로직·Supabase 동기화
    components/               # 화면 컴포넌트
  scripts/validate.mjs        # 문제 은행 검증 (npm run validate, build 전에 자동 실행)
  scripts/check-links.mjs     # 공식 문서 링크 HTTP 200 확인 (npm run check-links, 네트워크 필요)
  supabase/schema.sql         # 진행 상황 동기화 테이블 + RLS
  public/                     # manifest, service worker, 아이콘
```

## 문제 스키마

```js
{
  id: 'c01-07',            // 챕터 문제: cNN-NN / 케이스 문제: <caseId>-NN
  chapter: 1,              // 챕터 문제만 (1~10)
  caseId: 'ehr',           // 케이스 문제만
  domain: 2,               // 1~6 (data/domains.js)
  topic: '하이브리드 연결',  // 검색·통계용 짧은 주제
  question: '시나리오 …? (2개 선택)',
  options: ['…', '…', '…', '…'],        // 4~6개. 출제 시 순서가 섞인다
  answer: [0, 3],                        // 0부터 시작하는 정답 인덱스. 2개 이상이면 복수 정답
  explanations: ['…', '…', '…', '…'],   // options와 같은 순서·같은 개수. 모든 보기별 정답/오답 이유
  principle: '핵심 원리 한두 문장',
  refs: [{ title: '문서 제목', url: 'https://docs.cloud.google.com/…' }],
}
```

## 작성 기준

1. **오리지널 문제만.** ExamTopics 등 실제 기출·덤프를 복제하거나 문장만 바꿔 쓰지 않는다. 실제 시험 응시 내용 재현도 금지(응시 계약 위반).
2. **시나리오형.** 회사·워크로드 상황 + 요구사항(비용, 가용성, 지연, 운영 부담, 규정 준수 등) + 제약을 주고, 요구사항 간 **트레이드오프**로 정답이 갈리게 한다. 단순 암기형 정의 문제는 피한다.
3. **모든 보기별 해설.** 정답은 왜 요구사항을 만족하는지, 오답은 어떤 요구사항을 어기는지 구체적으로 쓴다.
4. **핵심 원리**(principle)에 일반화 가능한 판단 기준을 한두 문장으로 쓴다.
5. **공식 문서 링크** 1개 이상 (docs.cloud.google.com / cloud.google.com 등). `npm run check-links`로 확인.
6. **복수 정답**은 본문 끝에 `(2개 선택)`처럼 개수를 표기한다. 단일 정답에는 표기하지 않는다.
7. 보기 순서가 섞이므로 해설·본문에 **"A번", "보기 B", "첫 번째 보기" 같은 글자·위치 참조 금지**. "위의 모두" 류 보기도 금지. 해설에서 다른 보기를 가리킬 땐 내용으로 지칭한다.
8. 서비스 한도·리전별 기능·신규/개명 서비스처럼 **바뀔 수 있는 사실은 공식 문서로 확인**하고, 불확실하면 쓰지 않는다. 구체적 수치(한도, SLA %)는 꼭 필요할 때만 쓴다.
9. **개명된 서비스는 새 이름 + (구 이름)으로 병기**한다. 확인된 개명:
   - Vertex AI → **Gemini Enterprise Agent Platform** (2026-04, 예: Vertex AI Pipelines → Agent Platform Pipelines, Vertex AI Search → Agent Search). 대응표: https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes
   - Dataproc(클러스터·Serverless for Apache Spark) → **Managed Service for Apache Spark** (문서 경로 `/managed-spark/`)
   - Cloud Composer → **Managed Service for Apache Airflow**, Dataplex → **Knowledge Catalog**
   - 문서 URL 기본 도메인은 `docs.cloud.google.com`. `check-links`가 리디렉션을 보고하면 제품명 변경 여부를 확인한다.
10. 도메인 분포는 공식 가이드 비중(25 / 17.5 / 17.5 / 15 / 12.5 / 12.5%)을 따른다. 챕터별 계획은 `CHAPTER_PLAN`.

## 검증 스니펫

문제를 한 묶음 추가할 때마다 실행한다.

```bash
cd pca-exam
npm run validate        # 스키마·복수정답 표기·글자참조·중복/유사 문제·챕터×도메인 분포 검사
npm run check-links     # (선택, 네트워크 필요) 공식 문서 링크가 200인지 확인
npm run build           # validate 후 프로덕션 빌드
```

`validate`는 오류가 있으면 exit 1(빌드도 실패), 유사도 55% 이상 문제 쌍은 경고로 출력한다. 경고는 직접 읽고 실제 중복이면 고친다.

## 앱 기능

- 챕터(10×50문항) 풀이, 케이스 스터디 트랙(케이스 선택 → 요약 확인 → 문제), 도메인별 연습
- 모드: 연습(즉시 채점·해설) / 시험(타이머, 제출 후 채점)
- 도메인 비중 가중 랜덤 모의고사(공식 비중대로 문항 배분, 케이스 문제 포함 옵션)
- 문제 검색(본문·보기·해설·주제·ID), 오답 노트, 북마크, 기록
- 진행 중 세션을 localStorage에 저장 → 새로고침·앱 재시작 후 복구 (타이머는 마감 시각 기준)
- Supabase 설정 시 Google 로그인 + 진행 상황 동기화 (미설정 시 로컬 전용으로 동작)
- PWA: 설치 가능, 오프라인 캐시

## 현재 상태

- (작업 중) 앱 뼈대, 검증 스크립트, 케이스 스터디 요약 작성 완료. 문제 작성 진행 중.

## 남은 작업

- 챕터 1~10 문제 작성 (각 50문항)
- 케이스 스터디 문제 작성
- 앱 UI, 세션 복구, 검색, 가중 출제
- 빌드 확인
