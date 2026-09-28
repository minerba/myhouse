// 공식 케이스 스터디(현재 시험 가이드 기준 4종)와 케이스 기반 문제 트랙.
// 요약은 공식 PDF를 한국어로 요약한 것이며, 원문은 pdf 링크에서 확인한다.
import altostrat from './data/cases/altostrat.js'
import cymbal from './data/cases/cymbal.js'
import ehr from './data/cases/ehr.js'
import knightmotives from './data/cases/knightmotives.js'

export const CASE_STUDIES = [
  {
    id: 'altostrat',
    name: 'Altostrat Media',
    industry: '미디어',
    pdf: 'https://services.google.com/fh/files/misc/v6.1_pca_altostrat_media_case_study_english.pdf',
    overview:
      '팟캐스트·인터뷰·뉴스·다큐멘터리 등 방대한 오디오/비디오 콘텐츠를 보유한 미디어 기업. 생성형 AI로 콘텐츠 관리와 사용자 참여(개인화 추천, 자연어 상호작용, 셀프서비스 지원)를 혁신하고, 동적 가격·타깃 마케팅으로 매출을 늘리려 한다.',
    environment: [
      '콘텐츠 관리·전송 플랫폼은 GKE에서 운영',
      '미디어 라이브러리(문서·오디오·비디오)는 Cloud Storage에 저장',
      '사용자 행동·시청 패턴 분석은 BigQuery가 주 데이터 웨어하우스',
      '트랜스코딩·메타데이터 추출·추천 같은 이벤트 기반 작업은 Cloud Run functions',
      '콘텐츠 수집·아카이빙용 레거시 온프레미스 시스템이 남아 있으며 곧 이전 예정',
      '인증은 Google ID와 서드파티 IdP 혼용',
      '모니터링은 Cloud Monitoring + Prometheus 혼용, 알림은 주로 이메일',
    ],
    business: [
      'Google Cloud와 온프레미스 전체에서 운영 워크플로의 속도·신뢰성 향상',
      '빠른 배포를 위한 인프라 관리 단순화',
      '고가용성·확장성을 유지하면서 스토리지 비용 최적화',
      '24/7 자연어 기반 사용자 지원',
      '미디어 자동 요약, NLP·비전 기반 메타데이터 추출',
      '부적절한 콘텐츠 탐지·필터링',
      '콘텐츠 트렌드 분석과 데이터 기반 의사결정',
    ],
    technical: [
      '중앙 관리형 플랫폼으로 컨테이너 CI/CD 현대화',
      '데이터 수집을 위한 안전한 고성능 하이브리드 연결',
      '온프레미스와 클라우드 양쪽의 확장 가능한 Kubernetes 환경',
      '증가하는 미디어 용량에 대한 스토리지 비용 최적화',
      'AI 기반 유해 콘텐츠 탐지',
      'AI 시스템의 감사 가능성·설명 가능성',
      'LLM·대화형 AI로 개인화 경험과 고급 챗봇 구현, 다양한 미디어 자동 요약',
    ],
    executive: '생성형 AI로 콘텐츠 발견·개인화·상호작용을 강화하되, 신뢰성과 비용 관리가 최우선 과제라고 강조한다.',
  },
  {
    id: 'cymbal',
    name: 'Cymbal Retail',
    industry: '온라인 리테일',
    pdf: 'https://services.google.com/fh/files/misc/v6.1_pca_cymbal_retail_case_study_english.pdf',
    overview:
      '여러 하위 업종에 걸친 방대한 상품을 파는 급성장 온라인 리테일러. 생성형 AI로 (1) 카탈로그·콘텐츠 보강(속성·설명·이미지 생성), (2) Discovery AI를 활용한 대화형 커머스·상품 발견, (3) 기술 스택 현대화를 추진한다.',
    environment: [
      '온프레미스와 클라우드 혼합',
      'MySQL, Microsoft SQL Server, Redis, MongoDB로 카탈로그·고객 데이터 관리',
      '컨테이너 앱은 Kubernetes 클러스터에서 실행',
      'SFTP 파일 전송·ETL 배치 등 레거시 파일 기반 연동',
      '관계형 DB를 이름·카테고리로 조회하는 자체 웹 카탈로그',
      'IVR로 전화 응대 후 상담원이 주문을 수동 입력',
      'Grafana, Nagios, Elastic 등 오픈소스 모니터링',
      '수작업이 많고 데이터 사일로로 고객 여정 통합 뷰가 없음',
    ],
    business: [
      '카탈로그 보강 자동화(수작업·오류 감소, 일관성)',
      '검색 관련성 향상으로 상품 발견성 개선',
      '개인화된 상호작용으로 고객 참여 증대(반품 감소 기대)',
      '구매 전환율 향상',
      '콜센터 인력 비용과 데이터센터 호스팅 비용 절감',
    ],
    technical: [
      '공급사 데이터(제목·설명·이미지)에서 카탈로그 구조에 맞는 속성 도출',
      '기본 이미지에서 색상 변형·배경 변경·텍스트 오버레이 이미지 생성',
      '자연어 요청을 처리해 관련 상품을 반환하는 상품 발견 자동화',
      '대규모 카탈로그와 성장을 감당하는 확장성·성능',
      '생성 결과를 승인·거절·수정하는 Human-in-the-Loop 검토 UI',
      '고객 데이터·가상 에이전트 대화의 보안과 규정 준수',
    ],
    executive: '카탈로그 관리 자동화로 비용을 줄이고, 대화형 커머스와 발견성 향상으로 전환율과 매출을 높이는 것이 목표다.',
  },
  {
    id: 'ehr',
    name: 'EHR Healthcare',
    industry: '헬스케어 SaaS',
    pdf: 'https://services.google.com/fh/files/misc/v6.1_pca_ehr_healthcare_case_study_english.pdf',
    overview:
      '의료기관·병원·보험사에 전자 건강 기록(EHR) 소프트웨어를 SaaS로 제공하는 기업. 사업이 기하급수적으로 성장해 확장성, 재해 복구 계획 개선, 빠른 지속적 배포가 필요하며 코로케이션 시설을 Google Cloud로 대체하기로 했다.',
    environment: [
      '여러 코로케이션 데이터센터에서 운영, 그중 한 곳의 임대 만료 임박',
      '고객용 웹 앱 상당수가 컨테이너화되어 여러 Kubernetes 클러스터에서 실행',
      'MySQL, MS SQL Server, Redis, MongoDB 혼용',
      '보험사와의 레거시 파일·API 연동은 온프레미스에 유지(당분간 이전 계획 없음)',
      '사용자는 Microsoft Active Directory로 관리',
      '오픈소스 모니터링, 이메일 알림이 자주 무시됨',
    ],
    business: [
      '신규 보험사를 최대한 빠르게 온보딩',
      '고객용 시스템 최소 99.9% 가용성',
      '시스템 성능·사용량에 대한 중앙 가시성과 선제 대응',
      '헬스케어 트렌드 인사이트, 공급자 데이터 기반 예측·리포트',
      '모든 고객에 대한 지연 시간 감소',
      '규정 준수 유지, 인프라 관리 비용 절감',
    ],
    technical: [
      '온프레미스와 클라우드 양쪽에 연결된 레거시 보험사 인터페이스 유지',
      '컨테이너 기반 고객용 앱을 일관되게 관리',
      '온프레미스와 Google Cloud 간 안전한 고성능 연결',
      '일관된 로깅·로그 보존·모니터링·알림',
      '여러 컨테이너 환경의 유지·관리, 동적 확장과 환경 프로비저닝',
      '신규 공급자 데이터 수집·처리 인터페이스',
    ],
    executive: '잘못된 구성, 트래픽 급증 대응 부족, 일관성 없는 모니터링으로 장애가 잦았다. 여러 환경을 아우르는 확장 가능하고 복원력 있는 플랫폼을 원한다.',
  },
  {
    id: 'knightmotives',
    name: 'KnightMotives Automotive',
    industry: '자동차 제조',
    pdf: 'https://services.google.com/fh/files/misc/v6.1_pca_knightmotives_automotive_case_study_english.pdf',
    overview:
      '자율주행차(BEV·하이브리드·내연기관)를 만드는 제조사. BEV 외 차종의 차량 내 경험이 뒤처져 판매·만족도가 하락했다. 5년 내 전 차종의 경험을 AI로 현대화하고, 불안정한 온라인 주문(build-to-order) 시스템과 딜러 도구를 개선하며, 데이터 수익화를 추진한다.',
    environment: [
      '대부분 온프레미스, 일부 앱은 주요 퍼블릭 클라우드',
      '공급망은 노후 메인프레임, ERP도 노후화',
      '딜러는 신규 장비 예산이 없음',
      '차량별 코드베이스 파편화와 하위 호환성으로 인한 기술 부채',
      '공장 네트워크 연결과 시골 지역 차량 연결성이 취약',
    ],
    business: [
      '운전자와의 개인화된 관계, 전 차종 일관된 경험',
      'build-to-order 개선으로 재고 기간 단축, 딜러·고객 투명성',
      '사일로화된 기업 데이터를 수익화해 기술 투자 재원 확보',
      '과거 데이터 유출로 보안이 최우선, EU 데이터 보호 규정 준수',
      '규제가 우호적인 지역부터 완전 자율주행 도입',
      '직원 역량 강화, 인재 확보, 비즈니스·기술 팀 간 소통 개선',
    ],
    technical: [
      '전 차종에 AI 기능을 통합한 일관된 UX, 레거시 차량 HW/SW 업데이트, 시골 지역 연결성 확보',
      '공장·본사 간 연결 개선을 위한 네트워크 업그레이드',
      '하이브리드 클라우드 전략과 레거시 시스템의 점진적 현대화',
      '자율주행 개발을 위한 최신 AI/ML, 시뮬레이션 환경, 규제 준수',
      '데이터 수익화를 위한 데이터 관리 플랫폼, 엄격한 보안·프라이버시, 확장 가능한 AI/ML 인프라',
      '종합 보안 프레임워크, 사고 대응 계획, 보안 인식 교육',
      'build-to-order 시스템·딜러 도구·CRM 개선',
    ],
    executive: '주행·도로·행동·충돌 데이터를 활용해 안전을 높이고, 모든 차종에서 일관된 KnightMotives 경험을 제공하겠다는 비전이다.',
  },
]

export const CASE_QUESTIONS = [...altostrat, ...cymbal, ...ehr, ...knightmotives]
export const caseById = Object.fromEntries(CASE_STUDIES.map((c) => [c.id, c]))
