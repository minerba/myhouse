// 케이스 스터디 문제: knightmotives — 오리지널 문제 (스키마: pca-exam/CLAUDE.md)
export default [
  {
    id: 'knightmotives-01',
    caseId: 'knightmotives',
    domain: 3,
    topic: 'EU 데이터 보호',
    question:
      'KnightMotives에게 EU 데이터 보호 규정 준수는 특히 새로 등장하는 자율주행 플랫폼에서 매우 중요하다. 유럽 운전자의 주행·위치 데이터를 처리하는 새 플랫폼을 설계할 때 가장 적절한 조치는? (2개 선택)',
    options: [
      'EU 운전자 데이터는 EU 리전에만 저장·처리하도록 리소스 위치 조직 정책을 적용하고, 필요하면 Assured Workloads의 EU 데이터 경계 통제를 사용한다.',
      '분석 목적에 필요 없는 식별 정보는 수집 단계에서 제거하거나 가명 처리(Sensitive Data Protection)하고, 목적별 보존 기간을 정해 자동 삭제한다.',
      '모든 운전자 데이터를 가장 저렴한 리전 하나에 모은다.',
      '규정 준수는 법무팀 일이므로 아키텍처에서는 고려하지 않는다.',
      '위치 데이터를 공개 데이터 세트로 공유해 투명성을 높인다.',
    ],
    answer: [0, 1],
    explanations: [
      '위치 정책과 데이터 경계 통제는 EU 데이터가 허용된 지역에서만 저장·처리되도록 기술적으로 강제한다.',
      '데이터 최소화·가명 처리·보존 기간 관리는 개인정보 보호 원칙을 아키텍처에 내장한다.',
      '비용만 보고 리전을 고르면 데이터 상주 요구를 위반할 수 있다.',
      '규제 요구는 아키텍처의 핵심 비기능 요구사항이다.',
      '개인 위치 데이터 공개는 명백한 위반이다.',
    ],
    principle:
      '개인정보 규정 준수 = 위치 통제 + 데이터 최소화·가명 처리 + 보존·삭제 자동화.',
    refs: [
      { title: '리소스 위치 제한', url: 'https://docs.cloud.google.com/organization-policy/restrict-locations' },
      { title: 'Assured Workloads EU 데이터 경계', url: 'https://docs.cloud.google.com/assured-workloads/docs/control-packages/eu-data-boundary-access-justifications' },
    ],
  },
  {
    id: 'knightmotives-02',
    caseId: 'knightmotives',
    domain: 3,
    topic: '보안 프레임워크와 사고 대응',
    question:
      'KnightMotives는 과거 데이터 유출 때문에 보안을 최우선으로 삼고, 기술 요구사항에 “사이버 위협·데이터 유출을 막는 종합 보안 프레임워크, 사고 대응 계획, 직원 보안 인식 교육”을 포함했다. 클라우드 도입 초기에 우선할 조치로 가장 적절한 것은?',
    options: [
      '방화벽 규칙만 강화한다.',
      '조직 정책·최소 권한 IAM·VPC 서비스 제어 같은 예방 통제와 Security Command Center 기반 탐지를 조직 전체에 적용하고, 사고 대응 플레이북과 탁상 훈련, 역할별 보안 교육을 함께 운영한다.',
      '보안 도구를 도입하면 교육은 필요 없다.',
      '사고가 발생하면 그때 대응 계획을 세운다.',
    ],
    answer: [1],
    explanations: [
      '방화벽만으로는 ID·데이터·구성 위험을 다루지 못한다.',
      '예방(조직 정책·IAM·경계), 탐지(SCC), 대응(플레이북·훈련), 사람(교육)을 함께 갖춰야 케이스가 요구하는 종합 보안 프레임워크가 된다.',
      '사람은 보안의 핵심 요소이며 교육은 명시적 요구사항이다.',
      '사후 계획은 피해를 키운다.',
    ],
    principle:
      '보안 프레임워크는 예방·탐지·대응·사람의 네 축을 함께 설계한다.',
    refs: [
      { title: 'Security Command Center 개요', url: 'https://docs.cloud.google.com/security-command-center/docs/security-command-center-overview' },
      { title: 'Well-Architected Framework: 보안', url: 'https://docs.cloud.google.com/architecture/framework/security' },
    ],
  },
  {
    id: 'knightmotives-03',
    caseId: 'knightmotives',
    domain: 1,
    topic: '데이터 수익화와 프라이버시',
    question:
      'KnightMotives는 기술 투자 재원을 마련하기 위해 사일로화된 기업 데이터를 수익화하려 한다. 보험사·도시 교통 기관 같은 파트너가 도로 상황·주행 패턴을 분석하고 싶어 하지만, 개별 운전자 원시 데이터는 제공할 수 없다. 가장 적절한 설계는?',
    options: [
      '원시 주행 데이터 전체를 파트너에게 CSV로 판매한다.',
      '데이터를 BigQuery로 통합·정제하고, BigQuery 데이터 클린룸이나 BigQuery sharing으로 파트너가 원시 데이터를 직접 보지 않고 합의된 집계·분석만 수행하게 하며, 식별 정보는 비식별화한다.',
      '데이터 수익화를 포기한다.',
      '파트너에게 운영 DB 읽기 권한을 준다.',
    ],
    answer: [1],
    explanations: [
      '원시 데이터 판매는 개인정보 규정과 보안 우선순위를 위반한다.',
      '데이터 클린룸은 여러 당사자가 원시 데이터를 노출하지 않고 합의된 방식으로 분석하게 하며, 공유 기능과 비식별화를 결합하면 수익화와 프라이버시를 함께 달성할 수 있다.',
      '포기는 비즈니스 요구와 반대다.',
      '운영 DB 직접 접근은 보안·성능 위험이 크다.',
    ],
    principle:
      '데이터 수익화는 “통합된 데이터 플랫폼 + 프라이버시 보호 공유(클린룸·집계·비식별화)”로 설계한다.',
    refs: [
      { title: 'BigQuery 데이터 클린룸', url: 'https://docs.cloud.google.com/bigquery/docs/data-clean-rooms' },
      { title: 'BigQuery sharing 소개', url: 'https://docs.cloud.google.com/bigquery/docs/analytics-hub-introduction' },
    ],
  },
  {
    id: 'knightmotives-04',
    caseId: 'knightmotives',
    domain: 1,
    topic: '자율주행 학습·시뮬레이션 인프라',
    question:
      'KnightMotives의 기존 AI 인프라는 노후화되었고, 자율주행 개발을 위해 대규모 모델 학습과 견고한 시뮬레이션 환경이 필요하다. 센서 데이터는 PB 규모이며, 학습 일정은 분기 단위로 계획된다. 가장 적절한 인프라 설계는?',
    options: [
      '사내 서버실의 노후 GPU 서버를 계속 사용한다.',
      '계획된 대규모 학습에는 GPU·TPU 용량을 예약으로 확보하고, 학습 데이터는 Cloud Storage와 고성능 파일 시스템(Managed Lustre 등)으로 처리량을 확보하며, 재시도 가능한 대량 시뮬레이션은 Batch·GKE에서 Spot VM으로 비용을 낮춘다.',
      '모든 작업을 단일 GPU VM에서 순차 실행한다.',
      '시뮬레이션을 생략하고 실제 도로 테스트만 한다.',
    ],
    answer: [1],
    explanations: [
      '노후 인프라는 케이스가 교체 필요성을 명시한 대상이다.',
      '계획된 핵심 학습은 용량 보장, 스토리지 처리량 확보로 가속기 활용을 높이고, 재시도 가능한 대량 시뮬레이션은 Spot으로 비용을 줄이는 것이 성능·비용의 균형이다.',
      '단일 VM 순차 실행은 규모 요구를 충족하지 못한다.',
      '시뮬레이션 생략은 기술 요구사항과 안전 목표에 반한다.',
    ],
    principle:
      'AI 인프라는 워크로드별로 용량 보장(예약)·처리량(스토리지)·비용(Spot)을 조합해 설계한다.',
    refs: [
      { title: 'Compute Engine 예약', url: 'https://docs.cloud.google.com/compute/docs/instances/reservations-overview' },
      { title: 'Managed Lustre 개요', url: 'https://docs.cloud.google.com/managed-lustre/docs/overview' },
    ],
  },
  {
    id: 'knightmotives-05',
    caseId: 'knightmotives',
    domain: 2,
    topic: '공장·본사 네트워크 개선',
    question:
      'KnightMotives는 공장과 본사 간 연결이 취약하고, 늘어나는 데이터 트래픽을 감당할 네트워크 업그레이드가 필요하다. 여러 공장이 Google Cloud에 각각 연결되면, 공장 간·공장-본사 간 데이터도 Google 네트워크를 통해 주고받고 싶다. 가장 적절한 구성은?',
    options: [
      '공장마다 인터넷 VPN으로 서로 메시 연결을 만든다.',
      '각 공장과 본사를 Interconnect(또는 HA VPN)로 Google Cloud에 연결하고, Network Connectivity Center 허브의 스포크로 등록해 사이트 간 데이터 전송을 사용한다.',
      '모든 공장 데이터를 USB로 본사에 보낸다.',
      '공장 네트워크를 인터넷에 직접 노출한다.',
    ],
    answer: [1],
    explanations: [
      '전체 메시 VPN은 사이트가 늘수록 관리가 어려워지고 성능이 불안정하다.',
      '각 사이트를 Google Cloud에 연결하고 NCC 허브에 스포크로 등록하면 Google 네트워크를 WAN으로 활용해 사이트 간 연결을 단순화할 수 있다.',
      '물리 매체 전송은 실시간 요구와 맞지 않는다.',
      '공장 네트워크 노출은 보안 위험이 크다.',
    ],
    principle:
      '다수 사이트 연결은 “각 사이트 → 클라우드 연결 + 허브-스포크(NCC)”로 단순화한다.',
    refs: [
      { title: 'NCC 사이트 간 데이터 전송 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/data-transfer' },
    ],
  },
  {
    id: 'knightmotives-06',
    caseId: 'knightmotives',
    domain: 1,
    topic: '레거시 메인프레임·ERP 점진 현대화',
    question:
      'KnightMotives의 공급망은 노후 메인프레임에서, ERP도 노후 시스템에서 실행되어 새 프로모션과 딜러 할인 적용이 어렵다. 요구사항은 하이브리드 클라우드 전략으로 레거시를 “점진적으로” 현대화하는 것이다. 가장 적절한 첫 단계는?',
    options: [
      '메인프레임과 ERP를 한 번에 새 시스템으로 교체한다.',
      '레거시 시스템의 핵심 기능을 API로 노출(Apigee 등)하고 변경 데이터를 클라우드 분석 계층으로 복제해, 새 프로모션·딜러 기능은 클라우드에서 구현하며 레거시 기능을 단계적으로 대체한다.',
      '레거시 시스템을 그대로 두고 아무 변경도 하지 않는다.',
      '메인프레임 데이터를 매주 수동으로 엑셀로 내보낸다.',
    ],
    answer: [1],
    explanations: [
      '일괄 교체는 위험과 비용이 매우 크다.',
      'API 계층과 데이터 복제로 레거시를 감싸면 새 기능을 클라우드에서 빠르게 만들 수 있고, 레거시는 스트랭글러 방식으로 점진 대체된다.',
      '변경하지 않으면 비즈니스 문제가 계속된다.',
      '수동 내보내기는 오류와 지연을 만든다.',
    ],
    principle:
      '레거시 현대화는 “감싸기(API·데이터 복제) → 새 기능은 클라우드에서 → 점진 대체” 순서로 위험을 줄인다.',
    refs: [
      { title: 'Apigee 개요', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/get-started/what-apigee' },
      { title: 'Datastream 개요', url: 'https://docs.cloud.google.com/datastream/docs/overview' },
    ],
  },
  {
    id: 'knightmotives-07',
    caseId: 'knightmotives',
    domain: 2,
    topic: '장비 예산 없는 딜러용 도구',
    question:
      'KnightMotives는 딜러의 판매·서비스·재고 관리를 돕는 현대적 도구를 제공해야 하지만, 딜러에게는 새 장비를 살 예산이 없다. 딜러는 기존 PC와 태블릿의 브라우저만 쓸 수 있다. 가장 적절한 제공 방식은?',
    options: [
      '딜러마다 서버를 설치해 온프레미스 애플리케이션을 배포한다.',
      '딜러 도구를 브라우저 기반 웹 애플리케이션으로 만들어 Cloud Run 같은 관리형 플랫폼에서 운영하고, 전역 부하 분산기와 CDN으로 제공하며, 딜러 사용자 접근은 ID 기반(IAP·Chrome Enterprise Premium 등)으로 통제한다.',
      '딜러에게 전용 태블릿을 새로 구매하도록 요구한다.',
      '딜러 도구를 제공하지 않는다.',
    ],
    answer: [1],
    explanations: [
      '딜러 현장 서버는 장비·운영 부담이 크다.',
      '브라우저 기반 웹 앱은 기존 기기에서 바로 쓸 수 있고, 관리형 플랫폼과 전역 배포로 신뢰성과 성능을 확보하며, ID 기반 접근 제어로 VPN 없이 보안을 유지한다.',
      '예산이 없다는 제약에 어긋난다.',
      '딜러 도구 제공이라는 비즈니스 요구 자체를 충족하지 못하므로 요구사항을 무시하는 선택이다.',
    ],
    principle:
      '현장 장비 제약이 있으면 “브라우저 + 클라우드 관리형 + ID 기반 접근”으로 제공한다.',
    refs: [
      { title: 'Cloud Run 개요', url: 'https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run' },
      { title: 'Identity-Aware Proxy 개요', url: 'https://docs.cloud.google.com/iap/docs/concepts-overview' },
    ],
  },
  {
    id: 'knightmotives-08',
    caseId: 'knightmotives',
    domain: 6,
    topic: '주문 시스템 신뢰성',
    question:
      'KnightMotives의 온라인 build-to-order 주문 시스템은 불안정해 딜러가 필요한 데이터와 신뢰성을 얻지 못한다. 주문 제출 중 백엔드(레거시 ERP 연동)가 느려지면 주문이 유실되거나 중복 생성된다. 신뢰성을 높이는 가장 적절한 개선은?',
    options: [
      '주문 버튼을 여러 번 누르도록 안내한다.',
      '주문 요청을 즉시 접수해 큐(Pub/Sub)에 저장하고 멱등 키로 중복을 막으며, 백엔드 연동은 재시도·데드 레터로 처리하고, 주문 성공률·처리 지연을 SLO로 정의해 모니터링한다.',
      'ERP 서버를 더 큰 하드웨어로 바꾼다.',
      '주문 시스템을 딜러 영업 시간에만 연다.',
    ],
    answer: [1],
    explanations: [
      '재클릭 안내는 중복 주문을 늘린다.',
      '접수와 처리를 분리하고 멱등성·재시도·격리를 적용하면 느린 백엔드가 주문 유실·중복으로 이어지지 않는다. SLO로 신뢰성을 측정하고 개선한다.',
      '하드웨어 교체만으로는 구조적 결합 문제를 해결하지 못한다.',
      '운영 시간 제한은 고객 경험을 해친다.',
    ],
    principle:
      '신뢰성은 “분리(큐) + 멱등성 + 재시도·격리 + SLO 측정”으로 설계하고 운영한다.',
    refs: [
      { title: 'Pub/Sub 데드 레터 주제', url: 'https://docs.cloud.google.com/pubsub/docs/dead-letter-topics' },
      { title: 'AIP-155: 요청 식별', url: 'https://google.aip.dev/155' },
    ],
  },
  {
    id: 'knightmotives-09',
    caseId: 'knightmotives',
    domain: 4,
    topic: 'CRM 도입 결정',
    question:
      'KnightMotives는 고객 상호작용을 추적하고 경험을 개인화하는 종합 CRM이 필요하다. 사내 개발 인력은 차량 소프트웨어와 자율주행에 집중해야 한다. CRM 확보 방식에 대한 가장 적절한 의사결정은?',
    options: [
      'CRM을 처음부터 자체 개발한다.',
      '요구사항을 충족하는 SaaS CRM을 도입(Buy)하고, 차량·주문·딜러 시스템과는 Application Integration 같은 관리형 통합으로 연결하며, 차별화 역량(차량 경험·AI)에 개발 인력을 집중한다.',
      'CRM 없이 스프레드시트로 관리한다.',
      '딜러마다 서로 다른 CRM을 쓰게 한다.',
    ],
    answer: [1],
    explanations: [
      '차별화되지 않는 CRM을 자체 개발하면 핵심 역량에서 인력을 빼앗는다.',
      '범용 기능은 구매하고 통합으로 연결하며, 차별화 영역에 투자를 집중하는 것이 합리적인 Build/Buy 결정이다.',
      '스프레드시트는 요구사항(추적·개인화)을 충족하지 못한다.',
      '딜러별 CRM은 “일관된 경험” 목표와 반대다.',
    ],
    principle:
      '차별화 영역은 Build, 범용 영역은 Buy + 통합으로 인력과 투자를 배분한다.',
    refs: [
      { title: 'Application Integration 개요', url: 'https://docs.cloud.google.com/application-integration/docs/overview' },
    ],
  },
  {
    id: 'knightmotives-10',
    caseId: 'knightmotives',
    domain: 4,
    topic: '인력 역량과 조직 소통',
    question:
      'KnightMotives의 비즈니스 요구에는 직원 역량 강화, 우수 인재 확보, 비즈니스·기술 팀 간 소통 개선이 포함된다. 대규모 클라우드·AI 전환을 앞두고 조직 측면에서 가장 효과적인 조치는?',
    options: [
      '모든 작업을 외부 업체에 맡긴다.',
      '클라우드 CoE를 구성해 표준과 모범 사례를 제공하고, 역할별 교육·인증 경로를 운영하며, 비즈니스와 기술 팀이 공동 목표(OKR)와 정기 검토를 공유하는 거버넌스를 만든다.',
      '기술팀만 교육하고 비즈니스 팀은 제외한다.',
      '전환이 끝날 때까지 교육을 미룬다.',
    ],
    answer: [1],
    explanations: [
      '전면 외주는 내부 역량을 키우지 못한다.',
      'CoE와 체계적 교육은 역량을 조직에 축적하고, 공동 목표와 정기 검토는 비즈니스·기술 간 소통과 정렬을 강화한다.',
      '한쪽만 교육하면 소통 격차가 남는다.',
      '교육 지연은 전환 위험을 키운다.',
    ],
    principle:
      '기술 전환의 성패는 사람과 조직에 달려 있다: 역량 개발 + 공동 목표 + 거버넌스.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  {
    id: 'knightmotives-11',
    caseId: 'knightmotives',
    domain: 5,
    topic: '차량 소프트웨어 배포 파이프라인',
    question:
      'KnightMotives는 차종별로 코드베이스가 파편화되어 있고, 레거시 모델의 소프트웨어를 업데이트해 새 UX와 AI 기능을 지원해야 한다. 차량 소프트웨어 빌드의 신뢰성과 출처를 보장하고, 문제 발생 시 영향 범위를 제한하고 싶다. 가장 적절한 구현 방식은?',
    options: [
      '각 차종 팀이 로컬에서 빌드해 파일 서버에 올린다.',
      '공통 CI 파이프라인(Cloud Build)으로 빌드·테스트하고 서명된 빌드 출처와 함께 Artifact Registry에 저장하며, 차량 그룹(코호트) 단위로 점진 배포하면서 텔레메트리로 문제를 감지해 확대 또는 중단한다.',
      '모든 차량에 동시에 업데이트를 배포한다.',
      '업데이트를 하지 않는다.',
    ],
    answer: [1],
    explanations: [
      '로컬 빌드는 재현성·출처 보장이 없다.',
      '표준 CI와 서명된 출처는 산출물의 신뢰성을 보장하고, 코호트 단위 점진 배포와 텔레메트리 모니터링은 문제의 영향 범위를 제한한다.',
      '동시 배포는 결함 시 전 차량에 영향을 준다.',
      '업데이트 중단은 비즈니스 목표와 반대다.',
    ],
    principle:
      '대규모 배포는 신뢰할 수 있는 빌드(출처) + 점진적 롤아웃(코호트) + 관측 기반 중단 기준으로 관리한다.',
    refs: [
      { title: '빌드 출처 생성 및 검증', url: 'https://docs.cloud.google.com/build/docs/securing-builds/generate-validate-build-provenance' },
    ],
  },
  {
    id: 'knightmotives-12',
    caseId: 'knightmotives',
    domain: 1,
    topic: '차량 데이터 수집(연결성 불안정)',
    question:
      'KnightMotives는 실시간 AI 기능과 데이터 전송을 위해 차량 데이터를 수집해야 하지만, 시골 지역에서는 차량 연결이 자주 끊긴다. 수백만 대 차량의 이벤트가 몰려도 수집이 안정적이어야 하고, 분석은 거의 실시간이어야 한다. 가장 적절한 설계는?',
    options: [
      '차량이 연결될 때마다 운영 DB에 직접 쓰게 한다.',
      '차량에서 데이터를 로컬 버퍼링했다가 연결 시 전송하고, 수집 계층은 Pub/Sub로 급증을 흡수하며, Dataflow로 늦게 도착한 이벤트를 이벤트 시간 기준으로 처리해 Bigtable(저지연 조회)·BigQuery(분석)에 적재한다.',
      '연결이 끊긴 동안의 데이터는 버린다.',
      '모든 차량 데이터를 매일 밤 한 번에 업로드하게 한다.',
    ],
    answer: [1],
    explanations: [
      '운영 DB 직접 쓰기는 대량 동시 쓰기에 취약하고 결합도가 높다.',
      '로컬 버퍼링은 연결 단절을 견디고, Pub/Sub는 급증을 흡수하며, Dataflow의 이벤트 시간 처리는 늦게 도착한 데이터를 올바르게 집계한다. 조회·분석 목적별 저장소로 나눠 적재한다.',
      '데이터 폐기는 안전·분석 가치를 잃는다.',
      '야간 일괄 업로드는 실시간 요구를 충족하지 못한다.',
    ],
    principle:
      '불안정한 엣지 연결에는 “엣지 버퍼링 + 큐 수집 + 이벤트 시간 스트림 처리 + 목적별 저장소”로 설계한다.',
    refs: [
      { title: 'Dataflow 스트리밍 파이프라인', url: 'https://docs.cloud.google.com/dataflow/docs/concepts/streaming-pipelines' },
      { title: 'Bigtable 시계열 스키마 설계', url: 'https://docs.cloud.google.com/bigtable/docs/schema-design-time-series' },
    ],
  },
  // @@END
]
