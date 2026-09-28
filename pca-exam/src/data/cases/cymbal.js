// 케이스 스터디 문제: cymbal — 오리지널 문제 (스키마: pca-exam/CLAUDE.md)
export default [
  {
    id: 'cymbal-01',
    caseId: 'cymbal',
    domain: 1,
    topic: '상품 속성 자동 생성',
    question:
      'Cymbal Retail은 공급사가 보낸 상품 제목·설명·이미지에서 카탈로그 구조와 카테고리에 맞는 상품 속성(소재·색상·사이즈 체계 등)을 자동으로 도출하려 한다. 결과는 기존 카탈로그 스키마에 그대로 적재할 수 있어야 한다. 가장 적절한 접근은?',
    options: [
      '정규식 규칙을 카테고리마다 수작업으로 작성한다.',
      'Gemini 멀티모달 모델에 텍스트와 이미지를 함께 입력하고, 카테고리별 허용 속성·값을 담은 응답 스키마(구조화된 출력)로 결과를 JSON으로 생성하게 한 뒤 검증·검토 단계를 거친다.',
      '공급사 설명을 그대로 카탈로그에 복사한다.',
      '이미지만 Vision API로 라벨링하고 텍스트는 무시한다.',
    ],
    answer: [1],
    explanations: [
      '수작업 규칙은 수많은 하위 업종과 공급사 형식을 감당하지 못한다.',
      '멀티모달 모델은 텍스트와 이미지를 함께 이해해 속성을 도출하고, 응답 스키마로 출력 형식을 제어하면 카탈로그 구조에 맞는 일관된 데이터를 얻을 수 있다. 품질 보장을 위해 검증과 사람 검토를 거친다.',
      '원문 복사는 속성 정규화·일관성 요구를 충족하지 못한다.',
      '텍스트를 무시하면 이미지에 드러나지 않는 속성을 놓친다.',
    ],
    principle:
      '생성형 AI를 시스템에 연결할 때는 구조화된 출력(스키마)으로 형식을 통제하고, 검증·사람 검토로 품질을 보장한다.',
    refs: [
      { title: '생성된 출력 제어(구조화된 출력)', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/control-generated-output' },
    ],
  },
  {
    id: 'cymbal-02',
    caseId: 'cymbal',
    domain: 1,
    topic: 'Human-in-the-Loop 검토 흐름',
    question:
      'Cymbal Retail의 기술 요구사항은 “생성형 AI가 만든 콘텐츠를 직원이 검토해 승인·거절·수정한 뒤에만 카탈로그를 갱신하는 UI”다. 하루 수만 건의 제안이 생성된다. 가장 적절한 아키텍처는?',
    options: [
      'AI가 생성한 내용을 즉시 운영 카탈로그에 덮어쓴다.',
      'AI 제안을 “검토 대기” 상태로 별도 저장소에 저장하고, Cloud Run 기반 검토 UI에서 직원이 승인·수정하면 이벤트(Pub/Sub 등)로 카탈로그 갱신을 트리거하며, 결정 이력과 수정 내용을 기록해 품질 개선에 활용한다.',
      '직원이 스프레드시트로 제안을 내려받아 검토한 뒤 이메일로 회신한다.',
      '검토 없이 AI 신뢰도가 50% 이상이면 모두 반영한다.',
    ],
    answer: [1],
    explanations: [
      '즉시 덮어쓰기는 HITL 요구를 위반하고 오류가 고객에게 노출된다.',
      '제안과 운영 데이터를 분리하고, 검토 UI·승인 이벤트·이력 기록을 갖춘 흐름은 요구사항을 충족하면서 대량 처리에 확장된다. 승인·수정 데이터는 이후 프롬프트·모델 개선의 근거가 된다.',
      '스프레드시트·이메일은 확장·추적이 불가능하다.',
      '임의 임계값 자동 반영은 요구사항의 “검토 후 갱신”과 맞지 않는다.',
    ],
    principle:
      'HITL은 “제안 저장 → 검토 → 승인 이벤트 → 반영 → 피드백 기록”의 상태 기반 워크플로로 설계한다.',
    refs: [
      { title: 'Cloud Run 개요', url: 'https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run' },
      { title: 'Pub/Sub 기본 개념', url: 'https://docs.cloud.google.com/pubsub/docs/pubsub-basics' },
    ],
  },
  {
    id: 'cymbal-03',
    caseId: 'cymbal',
    domain: 2,
    topic: '상품 이미지 생성·편집',
    question:
      'Cymbal Retail은 기본 상품 이미지 한 장으로 여러 색상 변형 이미지를 만들고, 배경 교체와 텍스트 오버레이도 자동화하려 한다. 결과물은 직원 검토 후 게시된다. 가장 적절한 방법은?',
    options: [
      '모든 변형 이미지를 사진 촬영으로 새로 만든다.',
      'Agent Platform에서 Gemini(이미지 생성·편집) 기능으로 기본 이미지를 바탕으로 색상 변형·배경 변경을 생성하고, 텍스트 오버레이는 템플릿 처리와 결합하며, 결과는 HITL 검토 흐름에 넣는다.',
      'Vision API의 라벨 감지로 이미지를 변형한다.',
      'Speech-to-Text로 이미지 설명을 만든다.',
    ],
    answer: [1],
    explanations: [
      '재촬영은 비용과 시간이 크다.',
      '이미지 생성·편집 기능은 기존 이미지를 바탕으로 변형·배경 변경 같은 편집을 수행할 수 있어 카탈로그 이미지 제작을 자동화한다. 브랜드 품질을 위해 검토 단계를 둔다.',
      'Vision API는 이미지 분석용으로 편집·생성을 하지 않는다.',
      'Speech-to-Text는 음성 인식용이다.',
    ],
    principle:
      '생성형 이미지 기능은 제작 자동화 수단이다. 브랜드·정확성 검토(HITL)를 거쳐 게시한다.',
    refs: [
      { title: 'Gemini로 이미지 편집', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/gemini-edit-images' },
      { title: 'Gemini로 이미지 생성', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/image-generation' },
    ],
  },
  {
    id: 'cymbal-04',
    caseId: 'cymbal',
    domain: 1,
    topic: '자연어 상품 검색',
    question:
      'Cymbal Retail의 현재 웹 카탈로그는 관계형 DB에서 상품명과 카테고리를 문자열로 조회한다. 고객이 “비 오는 날 신기 좋은 가벼운 방수 운동화”처럼 자연어로 검색해도 관련 상품을 찾게 하고, 개인화 추천까지 제공하려 한다. 가장 적합한 선택은?',
    options: [
      'SQL LIKE 조건을 더 많이 추가한다.',
      'AI Commerce Search(구 Vertex AI Search for commerce)로 카탈로그와 사용자 이벤트를 연동해 자연어 검색과 개인화 추천을 제공한다.',
      '모든 상품 설명을 키워드 사전으로 수동 관리한다.',
      'BigQuery에서 고객이 직접 SQL을 작성하게 한다.',
    ],
    answer: [1],
    explanations: [
      '문자열 매칭은 의미 기반 검색을 제공하지 못한다.',
      'AI Commerce Search는 리테일 카탈로그와 사용자 이벤트를 바탕으로 ML 기반 검색과 추천을 제공해, 자연어 질의의 관련성과 개인화를 높인다.',
      '수동 키워드 사전은 대규모 카탈로그에 확장되지 않는다.',
      '고객에게 SQL을 요구하는 것은 비현실적이다.',
    ],
    principle:
      '리테일 검색·추천은 도메인 특화 관리형 서비스(AI Commerce Search)를 먼저 검토하고, 사용자 이벤트로 지속 개선한다.',
    refs: [
      { title: 'AI Commerce Search 문서', url: 'https://docs.cloud.google.com/retail/docs' },
    ],
  },
  {
    id: 'cymbal-05',
    caseId: 'cymbal',
    domain: 1,
    topic: '대화형 커머스 가상 에이전트',
    question:
      'Cymbal Retail은 웹·앱에 가상 에이전트를 넣어 고객과 자연어로 대화하며 상품을 추천하고, 주문 상태 조회까지 처리하게 하려 한다. 복잡한 문의는 상담원에게 넘겨야 하며, 개발팀의 코딩 역량은 제한적이다. 가장 적절한 선택은?',
    options: [
      '규칙 기반 IVR 시나리오를 웹에 그대로 옮긴다.',
      'CX Agent Studio(Dialogflow CX의 발전형)로 최소 코드 대화형 에이전트를 구축해 상품 검색·주문 조회 도구와 연동하고, 상담원 전환 흐름을 설계한다.',
      '범용 LLM에 사내 시스템 접근 권한 없이 대화만 맡긴다.',
      '에이전트 없이 FAQ 페이지만 확장한다.',
    ],
    answer: [1],
    explanations: [
      '규칙 기반 시나리오는 자연어 상호작용과 개인화 요구를 충족하지 못한다.',
      'CX Agent Studio는 고객 경험용 대화형 에이전트를 최소 코드로 구축하도록 지원하며, 도구 연동과 대화 흐름 제어, 사람 전환 같은 엔터프라이즈 요구를 반영할 수 있다.',
      '시스템 연동 없는 LLM은 주문 조회 같은 작업을 처리할 수 없고 환각 위험이 있다.',
      'FAQ만으로는 대화형 커머스 목표를 달성하지 못한다.',
    ],
    principle:
      '고객용 대화형 에이전트는 “의도 이해 + 도구 연동 + 대화 통제 + 사람 전환”을 갖춘 CX 전용 도구로 빠르게 구축한다.',
    refs: [
      { title: 'CX Agent Studio', url: 'https://docs.cloud.google.com/gemini-enterprise-cx/cx-agent-studio' },
    ],
  },
  {
    id: 'cymbal-06',
    caseId: 'cymbal',
    domain: 3,
    topic: '가상 에이전트 대화 데이터 보호',
    question:
      'Cymbal Retail의 기술 요구사항은 “상품 정보와 가상 에이전트와의 상호작용을 포함한 모든 고객 데이터를 안전하게 처리하고 규정을 준수”하는 것이다. 고객이 대화 중 카드 번호·주소를 입력하기도 한다. 가장 적절한 조치는? (2개 선택)',
    options: [
      '대화 기록을 저장·분석하기 전에 Sensitive Data Protection으로 카드 번호 등 민감 정보를 탐지해 마스킹·토큰화한다.',
      '모델 입력·출력에 Model Armor 같은 보호 계층을 두어 프롬프트 삽입과 민감 정보 노출을 막고, 대화 로그에는 보존 기간과 최소 권한 접근을 적용한다.',
      '분석을 위해 원본 대화 기록을 공개 버킷에 저장한다.',
      '결제 정보도 챗봇이 직접 저장하게 한다.',
      '보안은 출시 후에 검토한다.',
    ],
    answer: [0, 1],
    explanations: [
      '저장·분석 전에 민감 정보를 비식별화하면 노출 위험과 규정 범위를 줄인다.',
      '모델 보호 계층과 로그 보존·접근 통제는 대화 채널 특유의 위험(프롬프트 삽입, 민감 정보 노출)을 다룬다.',
      '공개 버킷 저장은 명백한 유출이다.',
      '챗봇이 결제 정보를 직접 저장하면 PCI 범위가 크게 늘어난다. 결제는 전용 결제 흐름으로 분리한다.',
      '출시 후 검토는 위반 위험을 키운다.',
    ],
    principle:
      '대화형 AI의 데이터 보호는 입력 단계 비식별화 + 모델 보호 계층 + 로그 거버넌스 + 결제 흐름 분리로 설계한다.',
    refs: [
      { title: 'Sensitive Data Protection 비식별화', url: 'https://docs.cloud.google.com/sensitive-data-protection/docs/deidentify-sensitive-data' },
      { title: 'Model Armor 개요', url: 'https://docs.cloud.google.com/model-armor/overview' },
    ],
  },
  {
    id: 'cymbal-07',
    caseId: 'cymbal',
    domain: 5,
    topic: '관계형 DB 이전 도구',
    question:
      'Cymbal Retail은 온프레미스 MySQL과 Microsoft SQL Server의 카탈로그·고객 데이터를 관리형 서비스로 옮겨 데이터센터 호스팅 비용을 줄이려 한다. 서비스 중단은 최소화해야 하며, 엔진은 그대로 유지하고 싶다. 가장 적절한 이전 방식은?',
    options: [
      '두 DB 모두 CSV로 내보내 주말 동안 수동으로 적재한다.',
      'Database Migration Service로 MySQL은 Cloud SQL for MySQL로, SQL Server는 Cloud SQL for SQL Server로 이전해 초기 로드 후 변경을 복제하고 짧은 전환으로 마무리한다.',
      '두 DB를 모두 Bigtable로 바꾼다.',
      'DB는 온프레미스에 두고 애플리케이션만 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '수동 CSV 적재는 다운타임과 오류 위험이 크다.',
      'Database Migration Service는 동종 엔진 간 관리형 이전과 지속 복제를 지원해, 엔진을 유지하면서 짧은 전환으로 관리형 Cloud SQL로 옮길 수 있다.',
      '엔진 변경은 요구사항에 어긋나고 재작성 부담이 크다.',
      'DB를 온프레미스에 두면 호스팅 비용 절감과 하이브리드 지연 문제가 남는다.',
    ],
    principle:
      '동종 DB 이전은 “엔진 유지 + 관리형 대상 + 지속 복제 + 짧은 전환”이 기본 패턴이다.',
    refs: [
      { title: 'SQL Server 마이그레이션 개요', url: 'https://docs.cloud.google.com/database-migration/docs/sqlserver/scenario-overview' },
      { title: 'MySQL 마이그레이션 소스와 대상', url: 'https://docs.cloud.google.com/database-migration/docs/mysql/migration-src-and-dest' },
    ],
  },
  {
    id: 'cymbal-08',
    caseId: 'cymbal',
    domain: 2,
    topic: 'NoSQL·캐시 이전 대상',
    question:
      'Cymbal Retail은 Redis(세션·장바구니 캐시)와 MongoDB(상품 상세 문서)도 관리형으로 옮겨 운영 부담을 줄이려 한다. 애플리케이션 코드 변경은 최소화하고 싶다. 각 구성 요소의 이전 대상으로 가장 적절한 조합은? (2개 선택)',
    options: [
      'Redis → Memorystore(Redis 호환)',
      'MongoDB → Firestore with MongoDB compatibility',
      'Redis → BigQuery',
      'MongoDB → Cloud Storage 객체로 저장',
      'Redis → Cloud SQL for MySQL',
    ],
    answer: [0, 1],
    explanations: [
      'Memorystore는 Redis 호환 관리형 인메모리 서비스로 캐시 워크로드를 코드 변경 없이 옮기기에 적합하다.',
      'Firestore with MongoDB compatibility는 기존 MongoDB 드라이버와 코드를 활용하면서 서버리스 관리형 문서 DB를 제공한다.',
      'BigQuery는 분석 웨어하우스로 저지연 캐시가 아니다.',
      '객체 스토리지는 문서 DB의 쿼리·인덱스 기능을 제공하지 않는다.',
      '관계형 DB는 인메모리 캐시를 대체하지 못한다.',
    ],
    principle:
      '이전 대상은 “같은 인터페이스를 제공하는 관리형 서비스”를 먼저 찾아 코드 변경을 최소화한다.',
    refs: [
      { title: 'Memorystore for Redis 개요', url: 'https://docs.cloud.google.com/memorystore/docs/redis/memorystore-for-redis-overview' },
      { title: 'Firestore with MongoDB compatibility 개요', url: 'https://docs.cloud.google.com/firestore/mongodb-compatibility/docs/overview' },
    ],
  },
  {
    id: 'cymbal-09',
    caseId: 'cymbal',
    domain: 4,
    topic: '비즈니스 성과 지표',
    question:
      'Cymbal Retail 경영진은 생성형 AI 투자로 “콜센터 인력 비용 절감, 전환율 향상, 반품 감소”를 기대한다. 아키텍트가 프로젝트 성공을 측정하기 위해 제안할 지표로 가장 적절한 것은? (2개 선택)',
    options: [
      '가상 에이전트가 상담원 연결 없이 해결한 문의 비율(자동 해결률)과 상담원 처리 건수 변화',
      '대화형 검색·추천을 사용한 세션의 구매 전환율과 해당 주문의 반품률을 대조군과 비교',
      '생성형 AI API 호출 횟수',
      '개발팀이 작성한 프롬프트 개수',
      '클라우드 콘솔 로그인 횟수',
    ],
    answer: [0, 1],
    explanations: [
      '자동 해결률과 상담원 처리량 변화는 콜센터 비용 절감 목표와 직접 연결된다.',
      '대조군과 비교한 전환율·반품률은 “전환율 향상·반품 감소”라는 비즈니스 결과를 측정한다.',
      'API 호출 수는 사용량일 뿐 비즈니스 성과가 아니다.',
      '프롬프트 수는 개발 활동 지표다.',
      '콘솔 로그인은 목표와 무관하다.',
    ],
    principle:
      'AI 프로젝트의 성공은 모델 지표가 아니라 비즈니스 결과 지표(비용·전환·만족)로 측정한다.',
    refs: [
      { title: 'Well-Architected Framework: AI 및 ML 관점', url: 'https://docs.cloud.google.com/architecture/framework/perspectives/ai-ml' },
    ],
  },
  {
    id: 'cymbal-10',
    caseId: 'cymbal',
    domain: 5,
    topic: '레거시 파일 연동 현대화',
    question:
      'Cymbal Retail은 온프레미스 시스템과 SFTP 파일 전송·야간 ETL 배치로 연동하며, 수작업 오류 처리 비용이 크다. 단기적으로 파일 기반 연동은 유지하되, 전송 자동화·재시도·모니터링을 개선하고 파일 도착 즉시 처리하고 싶다. 가장 적절한 방법은?',
    options: [
      '담당자가 매일 파일을 수동으로 업로드한다.',
      'Storage Transfer Service(에이전트 기반)로 온프레미스 파일을 Cloud Storage로 일정·증분 전송하고, 객체 생성 이벤트로 Cloud Run 처리 작업을 트리거하며, 실패는 데드 레터·알림으로 관리한다.',
      '야간 ETL 배치 주기를 늘린다.',
      '모든 파트너에게 API 연동을 즉시 강제한다.',
    ],
    answer: [1],
    explanations: [
      '수동 업로드는 현재 문제(수작업 오류)를 그대로 둔다.',
      '관리형 전송은 재시도·모니터링을 제공하고, 이벤트 기반 처리는 파일 도착 즉시 작업을 시작해 배치 지연을 없앤다. 실패 격리와 알림으로 오류 처리 비용을 줄인다.',
      '배치 주기 변경은 지연과 오류 처리 문제를 해결하지 못한다.',
      '즉시 API 전환 강제는 파트너 준비 상황을 무시한 비현실적 요구다.',
    ],
    principle:
      '레거시 통합은 “당장 형식은 유지하되 전송·처리를 관리형·이벤트 기반으로” 현대화하고, API 전환은 점진적으로 한다.',
    refs: [
      { title: '파일 시스템 전송(에이전트 기반)', url: 'https://docs.cloud.google.com/storage-transfer/docs/managing-on-prem-agents' },
      { title: 'Eventarc 개요', url: 'https://docs.cloud.google.com/eventarc/docs/overview' },
    ],
  },
  {
    id: 'cymbal-11',
    caseId: 'cymbal',
    domain: 6,
    topic: '모니터링 도구 통합',
    question:
      'Cymbal Retail은 Grafana, Nagios, Elastic 같은 오픈 소스 도구를 각각 운영하며, 사전 대응형 모니터링을 원한다. 운영 인력을 줄이면서 팀이 익숙한 Grafana 대시보드는 계속 쓰고 싶다. 가장 적절한 방안은?',
    options: [
      '각 도구를 계속 따로 운영하고 담당자를 늘린다.',
      'Cloud Monitoring·Cloud Logging으로 지표·로그 수집을 중앙화하고(Kubernetes 지표는 Managed Service for Prometheus), Grafana는 이를 데이터 소스로 사용하며, SLO 기반 알림을 설정한다.',
      '모니터링을 모두 끄고 고객 불만으로 장애를 파악한다.',
      '모든 로그를 로컬 디스크에 저장한다.',
    ],
    answer: [1],
    explanations: [
      '도구 분산 운영은 인력 부담과 사일로 문제를 키운다.',
      '관리형 관측성 서비스로 수집을 통합하면 운영 부담이 줄고, Grafana는 PromQL·Cloud Monitoring 데이터 소스로 계속 활용할 수 있다. SLO 기반 알림으로 사전 대응을 강화한다.',
      '고객 불만 기반 대응은 사후 대응이다.',
      '로컬 저장은 중앙 분석과 보존을 불가능하게 한다.',
    ],
    principle:
      '관측성 현대화는 “수집·저장은 관리형으로, 시각화 도구는 익숙한 것을 유지”로 전환 부담을 줄인다.',
    refs: [
      { title: 'Managed Service for Prometheus', url: 'https://docs.cloud.google.com/stackdriver/docs/managed-prometheus' },
    ],
  },
  {
    id: 'cymbal-12',
    caseId: 'cymbal',
    domain: 6,
    topic: '생성형 콘텐츠 품질 관리',
    question:
      'Cymbal Retail의 카탈로그 보강 기능이 운영에 들어갔다. 경영진은 “정확성과 일관성 향상”을 기대하지만, 직원 검토 단계의 부담이 예상보다 크다. 품질을 지속적으로 측정·개선하려면 어떤 운영 방식을 도입하는 것이 가장 적절한가?',
    options: [
      '검토 단계를 없애 부담을 줄인다.',
      'HITL 검토 결과(승인·수정·거절 비율, 수정 유형)를 카테고리별 품질 지표로 추적하고, 거절이 많은 카테고리의 프롬프트·스키마·예시를 개선한 뒤 평가 데이터 세트로 회귀를 확인한다.',
      '모델을 매주 무작위로 바꿔 본다.',
      '품질 지표 없이 직원 의견만 듣는다.',
    ],
    answer: [1],
    explanations: [
      '검토 제거는 요구사항 위반이며 오류가 고객에게 노출된다.',
      'HITL 결과는 곧 품질 데이터다. 카테고리별 지표로 문제 영역을 찾고 개선한 뒤 평가로 확인하는 반복 루프가 검토 부담을 점진적으로 줄인다.',
      '무작위 모델 교체는 원인 분석 없이 위험만 키운다.',
      '정량 지표 없이 개선 효과를 판단할 수 없다.',
    ],
    principle:
      '생성형 AI 운영은 사람의 피드백을 품질 지표로 만들고, 평가 기반 반복 개선 루프를 돌리는 것이다.',
    refs: [
      { title: '생성형 AI 평가 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-overview' },
    ],
  },
  // @@END
]
