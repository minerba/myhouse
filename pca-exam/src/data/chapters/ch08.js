// Chapter 8 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (12) ─────────
  {
    id: 'c08-01',
    chapter: 8,
    domain: 1,
    topic: '계층형 하이브리드 패턴',
    question:
      '은행은 규제와 기술 부채 때문에 계정계 핵심 시스템(메인프레임)을 당분간 온프레미스에 유지해야 한다. 반면 고객용 웹·모바일 프런트엔드는 트래픽 변동이 크고 빠른 기능 출시가 필요하다. 두 계층은 API로 통신한다. 가장 적합한 하이브리드 아키텍처 패턴은?',
    options: [
      '모든 시스템을 즉시 클라우드로 옮긴다.',
      '프런트엔드 계층은 Google Cloud에서 탄력적으로 운영하고, 백엔드 핵심 시스템은 온프레미스에 두어 전용 하이브리드 연결로 API를 호출하는 계층형 하이브리드 패턴을 적용한다.',
      '프런트엔드와 백엔드를 모두 온프레미스에 유지한다.',
      '같은 애플리케이션을 두 환경에 중복 배포해 사용자가 선택하게 한다.',
    ],
    answer: [1],
    explanations: [
      '규제·기술 부채 제약으로 핵심 시스템의 즉시 이전은 불가능하다.',
      '계층형 하이브리드 패턴은 변동성이 크고 자주 바뀌는 프런트엔드는 클라우드에서, 안정적이지만 이전이 어려운 백엔드는 기존 환경에서 운영한다. 하이브리드 연결의 지연·대역폭과 API 설계를 함께 고려한다.',
      '모두 온프레미스에 두면 확장성과 출시 속도 요구를 충족하지 못한다.',
      '중복 배포는 데이터 일관성과 운영 부담 문제를 만든다.',
    ],
    principle:
      '하이브리드 패턴은 계층별 변경 속도·제약에 맞춰 배치한다. 계층 간 호출은 지연을 고려해 굵은 단위 API로 설계한다.',
    refs: [
      { title: '계층형 하이브리드 패턴', url: 'https://docs.cloud.google.com/architecture/hybrid-multicloud-patterns-and-practices/tiered-hybrid-pattern' },
    ],
  },
  {
    id: 'c08-02',
    chapter: 8,
    domain: 1,
    topic: '온프레미스 엣지 컴퓨팅',
    question:
      '자동차 공장이 생산 라인 카메라 영상으로 불량을 실시간 판정하는 AI 추론을 한다. 판정은 수십 밀리초 안에 끝나야 하고, 공장의 인터넷 연결이 가끔 불안정해도 라인은 멈추면 안 된다. 운영팀은 클라우드와 같은 Kubernetes 운영 방식으로 중앙 관리하고 싶다. 가장 적합한 방법은?',
    options: [
      '모든 영상을 클라우드 리전으로 보내 추론한다.',
      'Google Distributed Cloud(연결형)로 공장에 GKE 기반 하드웨어를 설치해 현장에서 추론하고, 관리는 Google Cloud에서 중앙으로 한다.',
      '각 라인 PC에 수동으로 모델을 설치해 관리한다.',
      '연결이 불안정할 때는 라인을 멈춘다.',
    ],
    answer: [1],
    explanations: [
      '원거리 클라우드 추론은 지연과 연결 불안정 문제로 실시간 판정 요구를 충족하기 어렵다.',
      'Google Distributed Cloud 연결형은 고객 현장에 설치되는 인증 하드웨어에서 GKE 클러스터를 실행하고 Google Cloud에서 중앙 관리하므로, 낮은 지연의 현장 처리와 일관된 운영을 함께 제공한다.',
      '수동 관리는 확장되지 않고 버전 불일치를 만든다.',
      '라인 정지는 생산 손실을 일으킨다.',
    ],
    principle:
      '지연·연결성·데이터 위치 제약으로 현장 처리가 필요하면 엣지(분산 클라우드)에 워크로드를 두고, 관리 체계는 클라우드와 일원화한다.',
    refs: [
      { title: 'Google Distributed Cloud 연결형 개요', url: 'https://docs.cloud.google.com/distributed-cloud/connected/latest/docs/overview' },
    ],
  },
  {
    id: 'c08-03',
    chapter: 8,
    domain: 1,
    topic: '세션 상태 외부화',
    question:
      '레거시 쇼핑몰 웹 앱은 로그인 세션과 장바구니를 각 VM의 메모리에 저장한다. 그래서 부하 분산기에 세션 어피니티를 켜 두었고, 자동 축소나 VM 교체 때마다 사용자가 로그아웃되고 장바구니가 사라진다. 수평 확장과 자동 복구를 문제없이 쓰려면?',
    options: [
      '세션 어피니티 유지 시간을 늘린다.',
      '세션과 장바구니 상태를 Memorystore 같은 외부 저장소로 옮겨 애플리케이션 인스턴스를 스테이트리스로 만든다.',
      '자동 확장을 끄고 VM을 고정한다.',
      '모든 사용자를 하나의 큰 VM으로 보낸다.',
    ],
    answer: [1],
    explanations: [
      '어피니티 시간을 늘려도 인스턴스가 사라지면 상태가 함께 사라진다.',
      '상태를 외부 저장소로 옮기면 어떤 인스턴스가 요청을 처리해도 같은 세션을 사용할 수 있어, 자동 확장·축소와 자동 복구가 사용자 경험을 해치지 않는다.',
      '자동 확장을 끄면 탄력성과 비용 효율을 잃는다.',
      '단일 VM은 확장성과 가용성 모두 나쁘다.',
    ],
    principle:
      '수평 확장의 전제는 스테이트리스 인스턴스다. 세션·캐시 같은 상태는 외부 관리형 저장소에 둔다.',
    refs: [
      { title: 'Memorystore for Redis 개요', url: 'https://docs.cloud.google.com/memorystore/docs/redis/memorystore-for-redis-overview' },
    ],
  },
  {
    id: 'c08-04',
    chapter: 8,
    domain: 1,
    topic: '디스크 비동기 복제(리전 간 DR)',
    question:
      '제조사의 자체 관리 애플리케이션은 Compute Engine VM의 영구 디스크에 데이터를 저장하며, 애플리케이션 수준 복제 기능이 없다. 리전 장애 시 다른 리전에서 짧은 RPO로 데이터를 복구해 서비스를 재개해야 한다. 스냅샷 주기로는 RPO가 너무 길다. 가장 적합한 방법은?',
    options: [
      '매일 스냅샷을 다른 리전에 저장한다.',
      '디스크 비동기 복제를 구성해 보조 리전으로 블록 수준 복제를 하고, 리전 장애 시 보조 디스크로 장애 조치해 VM을 시작한다.',
      '리전 영구 디스크를 사용한다.',
      '데이터를 Local SSD로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '일일 스냅샷은 RPO가 최대 하루라 요구를 충족하지 못한다.',
      '비동기 복제는 두 리전 간 블록 스토리지를 비동기로 복제해 낮은 RPO·RTO의 액티브-패시브 리전 DR을 제공한다. 애플리케이션 수정 없이 적용할 수 있다.',
      '리전 영구 디스크는 같은 리전의 두 영역 간 복제로, 리전 장애는 대비하지 못한다.',
      'Local SSD는 임시 스토리지로 DR에 부적합하다.',
    ],
    principle:
      '디스크 보호 범위: 영역 장애 = 리전(HA) 디스크, 리전 장애 = 비동기 복제, 논리 오류 = 스냅샷·백업.',
    refs: [
      { title: '비동기 복제 정보', url: 'https://docs.cloud.google.com/compute/docs/disks/async-pd/about' },
    ],
  },
  {
    id: 'c08-05',
    chapter: 8,
    domain: 1,
    topic: 'Arm 기반 VM(가격 대비 성능)',
    question:
      '콘텐츠 플랫폼의 Go 기반 스테이트리스 API 서버 수백 대가 범용 x86 VM에서 실행된다. 코드는 멀티 아키텍처 컨테이너로 빌드할 수 있고, 네이티브 x86 전용 라이브러리 의존성은 없다. 동일 성능 대비 비용과 전력 효율을 개선하고 싶다. 우선 검토할 선택지는?',
    options: [
      '메모리 최적화 M 시리즈로 전환한다.',
      'Google Axion 프로세서(Arm) 기반 C4A 머신 계열에서 멀티 아키텍처 이미지를 벤치마크한 뒤 전환을 검토한다.',
      '공유 코어 머신으로 전환한다.',
      'GPU 머신으로 전환한다.',
    ],
    answer: [1],
    explanations: [
      '메모리 최적화 계열은 대용량 메모리 워크로드용으로 이 API 서버와 맞지 않는다.',
      'Arm 기반 C4A는 Axion 프로세서를 사용하는 범용 계열로, 아키텍처 호환성이 확보된 스케일 아웃 워크로드에서 가격 대비 성능과 효율을 개선할 수 있다. 전환 전 실제 워크로드로 벤치마크한다.',
      '공유 코어는 지속적인 고부하 API에 부적합하다.',
      'GPU는 이 워크로드에 필요하지 않다.',
    ],
    principle:
      '머신 선택은 벤치마크로 검증한다. 호환성이 확보되면 Arm 기반 계열도 가격 대비 성능 옵션으로 검토한다.',
    refs: [
      { title: '범용 머신 계열', url: 'https://docs.cloud.google.com/compute/docs/general-purpose-machines' },
    ],
  },
  {
    id: 'c08-06',
    chapter: 8,
    domain: 1,
    topic: 'Google API용 Private Service Connect',
    question:
      '보안팀은 VPC 안의 워크로드가 Google API에 접근할 때, VPC 내부의 지정된 IP 주소(엔드포인트)를 통해서만 접근하게 하고, 그 엔드포인트가 VPC 서비스 제어가 적용되는 API 묶음만 허용하길 원한다. 또한 온프레미스에서도 같은 내부 IP로 접근하고 싶다. 가장 적합한 방법은?',
    options: [
      'Cloud NAT로 googleapis.com 공개 주소에 접근한다.',
      'Google API용 Private Service Connect 엔드포인트를 만들어 내부 IP로 API에 접근하고(예: vpc-sc 번들), DNS를 이 엔드포인트로 구성한다.',
      '각 VM에 외부 IP를 부여한다.',
      'VPC 피어링으로 Google API에 연결한다.',
    ],
    answer: [1],
    explanations: [
      'NAT 경유 공개 주소 접근은 인터넷 경로를 쓰며 요구와 맞지 않는다.',
      'Google API용 Private Service Connect 엔드포인트는 사용자가 선택한 VPC 내부 IP로 Google API에 접근하게 하며, 허용 API 묶음을 선택할 수 있고 하이브리드 연결을 통해 온프레미스에서도 사용할 수 있다.',
      '외부 IP 부여는 노출을 늘린다.',
      'Google API는 VPC 피어링 대상이 아니다.',
    ],
    principle:
      'Google API 사설 접근: 간단히는 비공개 Google 액세스(기본 VIP), 내부 IP 지정·세밀한 제어가 필요하면 Private Service Connect 엔드포인트.',
    refs: [
      { title: 'Google API용 Private Service Connect 엔드포인트 구성', url: 'https://docs.cloud.google.com/vpc/docs/configure-private-service-connect-apis' },
    ],
  },
  {
    id: 'c08-07',
    chapter: 8,
    domain: 1,
    topic: '아웃바운드 고정 IP(허용 목록)',
    question:
      '핀테크 회사의 백엔드는 외부 IP가 없는 GKE 노드에서 실행된다. 협력 은행 API는 사전에 등록한 고정 출발지 IP에서 오는 요청만 허용한다. 노드가 자동 확장되어도 출발지 IP가 바뀌지 않아야 한다. 가장 적절한 구성은?',
    options: [
      '노드마다 임시 외부 IP를 부여하고 매번 은행에 알린다.',
      'Cloud NAT 게이트웨이에 수동으로 예약한 고정 외부 IP 주소를 할당해, 아웃바운드 트래픽이 항상 그 IP로 나가게 한다.',
      '은행에 모든 Google IP 범위를 허용해 달라고 요청한다.',
      '내부 부하 분산기를 사용한다.',
    ],
    answer: [1],
    explanations: [
      '노드 IP는 확장·교체 시 바뀌어 허용 목록 관리가 불가능하다.',
      'Cloud NAT에 수동 할당한 고정 외부 IP를 쓰면 사설 노드의 아웃바운드 트래픽이 정해진 IP로 나가므로, 확장과 무관하게 상대방 허용 목록을 유지할 수 있다.',
      '광범위한 IP 허용은 보안 통제를 무의미하게 만든다.',
      '내부 부하 분산기는 인바운드 트래픽용이다.',
    ],
    principle:
      '외부 허용 목록 요구가 있으면 Cloud NAT의 수동 NAT IP로 출발지 IP를 고정한다.',
    refs: [
      { title: 'Cloud NAT 포트와 주소', url: 'https://docs.cloud.google.com/nat/docs/ports-and-addresses' },
    ],
  },
  {
    id: 'c08-08',
    chapter: 8,
    domain: 1,
    topic: '통신이 잦은 구성 요소의 이전 순서',
    question:
      '주문 애플리케이션은 요청 하나당 DB에 수십 번의 작은 쿼리를 보낸다. 팀은 먼저 애플리케이션 서버만 Google Cloud로 옮기고 DB는 온프레미스에 두려 한다. 온프레미스와의 왕복 지연은 약 20ms다. 예상되는 문제와 권장안으로 가장 적절한 것은?',
    options: [
      '문제없다. Interconnect가 있으면 지연은 무시해도 된다.',
      '요청당 왕복 지연이 수십 배로 누적되어 응답 시간이 크게 늘어나므로, 앱과 DB를 같은 웨이브에서 함께 옮기거나 쿼리 횟수를 줄이도록 설계를 바꾼다.',
      'DB를 먼저 옮기고 앱은 나중에 옮기면 문제가 없다.',
      '앱 서버 수를 늘리면 해결된다.',
    ],
    answer: [1],
    explanations: [
      '전용 연결도 물리적 거리에 따른 지연은 줄이지 못한다.',
      '대화가 잦은(chatty) 구성 요소를 환경 간에 나누면 요청당 수십 번의 왕복 지연이 누적된다. 함께 이전하거나 호출 패턴을 개선해야 한다.',
      '반대로 나눠도 같은 지연 문제가 생긴다.',
      '서버를 늘려도 요청 하나의 지연은 줄지 않는다.',
    ],
    principle:
      '의존성 분석에서 통신 빈도와 지연 민감도를 확인하고, 대화가 잦은 구성 요소는 같은 웨이브로 묶는다.',
    refs: [
      { title: 'Migration Center 그룹 만들기', url: 'https://docs.cloud.google.com/migration-center/docs/create-groups' },
    ],
  },
  {
    id: 'c08-09',
    chapter: 8,
    domain: 1,
    topic: '생성형 AI 안전 필터',
    question:
      '교육 플랫폼이 청소년 대상 학습 도우미 챗봇을 Gemini로 만든다. 폭력·성적 콘텐츠 같은 유해한 응답이 나오지 않도록 엄격하게 제어하고, 차단된 응답은 앱에서 안전한 안내 문구로 대체하고 싶다. 모델 자체 안전 기능을 활용하려면 어떻게 해야 하는가?',
    options: [
      '안전 기능을 끄고 응답을 사후 검토한다.',
      '콘텐츠 안전 필터의 차단 임계값을 요구 수준에 맞게 엄격하게 설정하고, 차단된 응답(안전 사유)을 애플리케이션에서 처리하며, 필요하면 Model Armor 같은 추가 계층을 둔다.',
      'temperature를 높여 다양한 응답을 유도한다.',
      '청소년 사용자를 차단한다.',
    ],
    answer: [1],
    explanations: [
      '사후 검토는 유해 응답이 이미 사용자에게 전달된 뒤다.',
      'Gemini의 안전 필터는 유해 범주별 차단 임계값을 설정할 수 있고, 차단 시 응답에 안전 관련 정보가 포함되어 앱이 대체 문구를 보여 줄 수 있다. 사용자층에 맞춰 엄격하게 설정하고 다층 방어를 더한다.',
      'temperature를 높이면 예측 불가능성이 커진다.',
      '사용자 차단은 서비스 목적과 반대다.',
    ],
    principle:
      '책임 있는 AI는 모델 안전 설정 + 애플리케이션 처리 + 추가 보안 계층의 조합으로 사용자층 위험에 맞춘다.',
    refs: [
      { title: '안전 필터 구성', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/configure-safety-filters' },
    ],
  },
  {
    id: 'c08-10',
    chapter: 8,
    domain: 1,
    topic: '대시보드 쿼리 가속(BI Engine)',
    question:
      '영업 대시보드가 BigQuery의 수십 GB 집계 테이블을 조회하며, 수백 명이 동시에 필터를 바꿀 때마다 몇 초씩 지연된다. 사용자는 1초 이내 반응을 원한다. 데이터를 다른 DB로 옮기지 않고 개선하려면?',
    options: [
      '데이터를 Cloud SQL로 복제한다.',
      'BigQuery BI Engine 예약을 추가해 자주 쓰는 데이터를 메모리에서 가속한다.',
      '대시보드 새로고침을 하루 한 번으로 줄인다.',
      '모든 쿼리에 LIMIT을 붙인다.',
    ],
    answer: [1],
    explanations: [
      '별도 DB 복제는 파이프라인과 일관성 관리 부담을 만든다.',
      'BI Engine은 BigQuery 앞단의 인메모리 분석 서비스로, 대시보드 같은 반복적이고 대화형인 쿼리를 가속해 지연을 크게 줄인다. 데이터 이동이 필요 없다.',
      '새로고침을 줄이면 대화형 분석이라는 목적이 사라진다.',
      'LIMIT은 집계 쿼리 성능을 개선하지 않는 경우가 많다.',
    ],
    principle:
      '대화형 BI 지연은 캐싱·가속 계층(BI Engine, 구체화된 뷰)으로 해결하고, 데이터 복제는 마지막 수단으로 둔다.',
    refs: [
      { title: 'BI Engine 소개', url: 'https://docs.cloud.google.com/bigquery/docs/bi-engine-intro' },
    ],
  },
  {
    id: 'c08-11',
    chapter: 8,
    domain: 1,
    topic: '멀티테넌트 SaaS 데이터 격리',
    question:
      'B2B SaaS 스타트업이 고객사(테넌트)별 데이터 격리 방식을 정하려 한다. 고객 대부분은 중소기업이지만, 일부 대형 금융 고객은 “다른 고객과 물리적으로 분리된 DB와 고객 전용 암호화 키”를 계약 조건으로 요구한다. 비용과 운영 효율도 중요하다. 가장 적절한 설계는?',
    options: [
      '모든 고객에게 전용 DB 인스턴스와 프로젝트를 만든다.',
      '일반 고객은 공유 DB에서 테넌트 ID 기반 논리 격리(접근 통제 포함)를 적용하고, 요구가 있는 대형 고객은 전용 인스턴스·전용 CMEK 키로 분리하는 계층형 테넌시 모델을 설계한다.',
      '모든 고객 데이터를 하나의 테이블에 섞고 앱 코드로만 필터링한다.',
      '대형 고객의 요구를 거절한다.',
    ],
    answer: [1],
    explanations: [
      '모든 고객에게 전용 인프라를 주면 비용과 운영 부담이 고객 수에 비례해 커진다.',
      '계층형 테넌시는 대다수 고객에게는 효율적인 공유 모델을, 엄격한 요구가 있는 고객에게는 전용 리소스와 키를 제공해 비용과 격리 요구의 균형을 맞춘다.',
      '앱 코드에만 의존한 필터링은 버그 한 번으로 데이터가 노출될 수 있다. 논리 격리에도 DB·IAM 수준 통제가 필요하다.',
      '핵심 고객 요구를 거절하면 사업 기회를 잃는다.',
    ],
    principle:
      '멀티테넌시는 공유(효율)와 전용(격리) 사이의 스펙트럼이다. 고객 등급별로 격리 수준을 달리하는 설계를 검토한다.',
    refs: [
      { title: 'Well-Architected Framework: 보안', url: 'https://docs.cloud.google.com/architecture/framework/security' },
    ],
  },
  {
    id: 'c08-12',
    chapter: 8,
    domain: 1,
    topic: '관리형 DB와 자체 운영 DB',
    question:
      '분석 스타트업의 핵심 기능은 특정 PostgreSQL 확장 기능과 비표준 커널 파라미터 튜닝에 의존한다. 검토 결과 이 확장 기능은 Cloud SQL과 AlloyDB의 지원 확장 목록에 없다. 팀에는 DB 운영 경험이 있는 엔지니어가 있다. 가장 합리적인 결정은?',
    options: [
      '확장 기능 없이 Cloud SQL로 옮기고 기능은 포기한다.',
      '요구 기능이 관리형 서비스에서 지원되지 않으므로 Compute Engine에 PostgreSQL을 자체 운영하되, 백업·HA·패치 운영 부담을 계획에 반영하고, 관리형 서비스 지원 여부를 주기적으로 재검토한다.',
      '관리형 서비스가 항상 옳으므로 요구사항을 무시한다.',
      '데이터를 Bigtable로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '핵심 기능을 포기하는 것은 비즈니스 요구를 무시하는 것이다.',
      '관리형 서비스를 우선 검토하되, 필수 요구를 충족하지 못하면 자체 운영이 정당화된다. 이때 운영 책임(백업·HA·패치)을 명확히 계획하고, 관리형 지원이 생기면 이전을 재검토한다.',
      '요구사항을 무시한 선택은 잘못된 아키텍처다.',
      'Bigtable은 관계형 PostgreSQL 기능을 대체하지 못한다.',
    ],
    principle:
      '“관리형 우선”은 기본값이지 절대 규칙이 아니다. 필수 요구를 충족하지 못하면 운영 비용을 감수한 대안을 선택하고 근거를 기록한다.',
    refs: [
      { title: 'Cloud SQL for PostgreSQL 지원 확장', url: 'https://docs.cloud.google.com/sql/docs/postgres/extensions' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (9) ─────────
  {
    id: 'c08-13',
    chapter: 8,
    domain: 2,
    topic: 'VPC 흐름 로그',
    question:
      '보안팀이 특정 서브넷의 VM들이 예상하지 못한 외부 IP와 통신하는지 조사하려 한다. 또한 네트워크팀은 어떤 서비스 간 트래픽이 많은지 파악해 비용을 분석하고 싶다. 패킷 전체 내용은 필요 없고 연결 메타데이터면 충분하다. 가장 적합한 기능은?',
    options: [
      '각 VM에 tcpdump를 설치해 상시 캡처한다.',
      '해당 서브넷에 VPC 흐름 로그를 사용 설정하고(필요하면 샘플링 비율 조정), 로그를 BigQuery나 Log Analytics로 분석한다.',
      'Cloud Armor 로그를 확인한다.',
      '방화벽 규칙을 모두 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '상시 패킷 캡처는 성능·저장 부담이 크고 관리가 어렵다.',
      'VPC 흐름 로그는 VM 네트워크 연결의 메타데이터(출발지·목적지·포트·바이트 등)를 샘플링해 기록한다. 보안 조사와 트래픽 분석에 적합하며 샘플링으로 비용을 조절할 수 있다.',
      'Cloud Armor 로그는 외부 부하 분산기로 들어오는 요청에 대한 것이다.',
      '규칙 삭제는 보안을 무너뜨린다.',
    ],
    principle:
      '네트워크 가시성: 연결 메타데이터 = VPC 흐름 로그, 규칙 적중 = 방화벽 규칙 로깅, 전체 패킷 = 패킷 미러링.',
    refs: [
      { title: 'VPC 흐름 로그', url: 'https://docs.cloud.google.com/vpc/docs/flow-logs' },
    ],
  },
  {
    id: 'c08-14',
    chapter: 8,
    domain: 2,
    topic: 'GKE 네트워크 정책(Dataplane V2)',
    question:
      'GKE 클러스터의 모든 파드가 서로 자유롭게 통신할 수 있다. 보안팀은 결제 네임스페이스의 파드에는 API 게이트웨이 파드만 접근하도록 제한하고, 허용·거부된 연결을 기록해 감사하고 싶다. 가장 적절한 구성은?',
    options: [
      'VPC 방화벽 규칙만으로 파드 간 트래픽을 제어한다.',
      'GKE Dataplane V2를 사용하는 클러스터에서 Kubernetes NetworkPolicy로 허용 규칙을 정의하고, 네트워크 정책 로깅을 사용 설정한다.',
      '결제 파드를 별도 프로젝트로 옮긴다.',
      '모든 파드에 외부 IP를 부여한다.',
    ],
    answer: [1],
    explanations: [
      'VPC 방화벽은 노드·IP 수준 통제라 동적으로 바뀌는 파드 단위 정책에 적합하지 않다.',
      'NetworkPolicy는 라벨·네임스페이스 기반으로 파드 간 트래픽을 제어하고, Dataplane V2는 이를 적용하며 네트워크 정책 로깅으로 허용·거부된 연결을 기록할 수 있다.',
      '프로젝트 분리는 과도하며 파드 수준 통제를 제공하지 않는다.',
      '외부 IP 부여는 노출만 늘린다.',
    ],
    principle:
      '쿠버네티스 내부 세분화는 NetworkPolicy(기본 거부 + 필요한 허용)로 하고, 가시성을 위해 정책 로깅을 켠다.',
    refs: [
      { title: 'GKE Dataplane V2', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/dataplane-v2' },
    ],
  },
  {
    id: 'c08-15',
    chapter: 8,
    domain: 2,
    topic: '컨테이너 이미지 스트리밍',
    question:
      'GKE에서 수 GB 크기의 ML 추론 컨테이너 이미지를 사용하는데, 트래픽 급증으로 새 노드·파드가 뜰 때 이미지 전체를 내려받느라 시작에 몇 분이 걸린다. 이미지 크기를 당장 줄이기 어렵다. 파드 시작 시간을 줄이려면?',
    options: [
      '이미지를 Docker Hub로 옮긴다.',
      'Artifact Registry의 이미지와 함께 GKE 이미지 스트리밍을 사용 설정해, 필요한 데이터부터 원격으로 읽으며 컨테이너를 먼저 시작하게 한다.',
      '노드 풀의 디스크를 표준 PD로 바꾼다.',
      '파드의 준비 상태 프로브를 제거한다.',
    ],
    answer: [1],
    explanations: [
      '레지스트리를 바꾸는 것은 전체 다운로드 시간 문제를 해결하지 않는다.',
      '이미지 스트리밍은 전체 이미지를 다 받기 전에 필요한 부분을 원격으로 읽어 컨테이너를 시작하게 해, 큰 이미지의 시작 시간을 크게 줄인다.',
      '느린 디스크는 오히려 시작을 늦춘다.',
      '프로브 제거는 준비되지 않은 파드로 트래픽을 보내 오류를 늘린다.',
    ],
    principle:
      '확장 속도는 “새 용량이 준비되는 시간”에 좌우된다. 이미지 크기·스트리밍·사전 준비로 시작 시간을 줄인다.',
    refs: [
      { title: 'GKE 이미지 스트리밍', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/how-to/image-streaming' },
    ],
  },
  {
    id: 'c08-16',
    chapter: 8,
    domain: 2,
    topic: 'MIG 인스턴스 유연성',
    question:
      '대규모 렌더링 MIG가 특정 머신 유형 하나만 사용하도록 구성되어 있어, 해당 유형의 영역 용량이 부족할 때 VM 생성이 자주 실패한다. 워크로드는 비슷한 vCPU·메모리를 가진 여러 머신 유형에서 모두 잘 동작한다. 용량 확보 가능성을 높이려면?',
    options: [
      '실패할 때마다 수동으로 다른 영역에 VM을 만든다.',
      'MIG의 인스턴스 유연성 설정으로 사용할 수 있는 여러 머신 유형을 지정해, 가용 용량이 있는 유형으로 VM을 만들게 한다.',
      '더 큰 단일 머신 유형으로 고정한다.',
      '자동 확장을 끈다.',
    ],
    answer: [1],
    explanations: [
      '수동 조치는 느리고 확장되지 않는다.',
      '인스턴스 유연성은 MIG가 여러 머신 유형 중에서 가용한 용량으로 VM을 만들게 해, 특정 유형 부족으로 인한 생성 실패를 줄인다(특히 Spot VM에서 효과가 크다).',
      '단일 유형 고정은 같은 문제를 반복한다.',
      '자동 확장을 끄면 수요 대응 능력을 잃는다.',
    ],
    principle:
      '용량 확보 가능성은 선택지를 넓힐수록 높아진다: 여러 영역, 여러 머신 유형(인스턴스 유연성), 필요 시 예약.',
    refs: [
      { title: 'MIG 인스턴스 유연성 정보', url: 'https://docs.cloud.google.com/compute/docs/instance-groups/about-instance-flexibility' },
    ],
  },
  {
    id: 'c08-17',
    chapter: 8,
    domain: 2,
    topic: 'Cloud SQL 보안 연결',
    question:
      '애플리케이션이 Cloud SQL for MySQL에 공인 IP와 DB 사용자 비밀번호로 연결한다. 보안팀은 (1) 연결 암호화와 인가를 자동화하고 승인된 네트워크 IP 관리를 없애며, (2) DB 비밀번호 대신 IAM으로 DB 사용자를 인증하길 원한다. 가장 적절한 방법은?',
    options: [
      '비밀번호를 더 길게 바꾸고 승인된 네트워크에 0.0.0.0/0을 추가한다.',
      'Cloud SQL 언어 커넥터(또는 Cloud SQL 인증 프록시)로 연결하고, IAM 데이터베이스 인증을 사용 설정해 서비스 계정으로 DB에 로그인한다.',
      'DB를 Compute Engine으로 옮긴다.',
      'SSL을 끄고 속도를 높인다.',
    ],
    answer: [1],
    explanations: [
      '전체 IP 허용은 보안을 크게 약화시킨다.',
      'Cloud SQL 커넥터·인증 프록시는 IAM 기반 인가와 자동 TLS 암호화 연결을 제공해 승인된 네트워크 관리가 필요 없다. IAM DB 인증을 쓰면 비밀번호 대신 IAM 주 구성원으로 로그인할 수 있다.',
      '자체 운영은 문제를 해결하지 않고 운영 부담만 늘린다.',
      '암호화 해제는 보안 요구와 반대다.',
    ],
    principle:
      'Cloud SQL 연결은 커넥터(IAM 인가 + 자동 암호화)와 IAM DB 인증으로 네트워크·비밀번호 관리 부담을 줄인다.',
    refs: [
      { title: 'Cloud SQL 언어 커넥터로 연결', url: 'https://docs.cloud.google.com/sql/docs/mysql/connect-connectors' },
      { title: 'IAM 데이터베이스 인증', url: 'https://docs.cloud.google.com/sql/docs/mysql/iam-authentication' },
    ],
  },
  {
    id: 'c08-18',
    chapter: 8,
    domain: 2,
    topic: 'Bigtable 자동 확장',
    question:
      'IoT 플랫폼의 Bigtable 클러스터는 낮에는 부하가 높고 밤에는 낮다. 운영팀은 피크에 맞춰 노드를 고정해 두어 비용이 크고, 가끔 예상보다 큰 피크에서는 지연이 늘어난다. 운영 부담 없이 부하에 맞춰 용량을 조절하려면?',
    options: [
      '매일 아침과 저녁에 수동으로 노드 수를 바꾼다.',
      'Bigtable 자동 확장을 사용 설정해 CPU 사용률·스토리지 목표에 맞춰 최소·최대 노드 범위 안에서 자동으로 노드 수를 조정한다.',
      '노드 수를 최소로 고정하고 지연을 감수한다.',
      '데이터를 Cloud SQL로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '수동 조정은 예외적인 피크에 대응하지 못하고 운영 부담이 크다.',
      'Bigtable 자동 확장은 목표 사용률과 스토리지 기준에 따라 노드를 자동으로 추가·제거해, 비용과 성능을 함께 관리한다.',
      '최소 고정은 성능 요구를 무시한다.',
      'Cloud SQL은 이 규모의 IoT 쓰기에 적합하지 않다.',
    ],
    principle:
      '관리형 데이터 서비스의 자동 확장(Bigtable, Spanner 등)을 활용해 고정 용량 과잉을 없앤다.',
    refs: [
      { title: 'Bigtable 자동 확장', url: 'https://docs.cloud.google.com/bigtable/docs/autoscaling' },
    ],
  },
  {
    id: 'c08-19',
    chapter: 8,
    domain: 2,
    topic: 'Memorystore 고가용성',
    question:
      '세션 저장소로 쓰는 Memorystore for Redis 인스턴스가 기본(Basic) 등급이라, 유지보수나 영역 장애 때 캐시가 비고 모든 사용자가 로그아웃되었다. 영역 장애에도 자동 장애 조치로 서비스를 유지하려면?',
    options: [
      '인스턴스 메모리 크기를 늘린다.',
      '복제본이 있는 Standard 등급(고가용성) 인스턴스로 구성해, 기본 노드 장애 시 다른 영역의 복제본으로 자동 장애 조치되게 한다.',
      '세션을 각 VM 로컬 메모리로 되돌린다.',
      '매시간 캐시를 파일로 내보낸다.',
    ],
    answer: [1],
    explanations: [
      '메모리 크기는 가용성과 무관하다.',
      'Standard 등급은 다른 영역의 복제본과 자동 장애 조치를 제공해 영역 장애나 유지보수 중에도 서비스를 유지한다.',
      '로컬 메모리는 수평 확장과 자동 복구 문제를 되살린다.',
      '파일 내보내기는 실시간 장애 조치를 제공하지 않는다.',
    ],
    principle:
      '캐시라도 서비스 핵심 경로에 있으면 HA 구성(복제본·자동 장애 조치)을 선택한다.',
    refs: [
      { title: 'Memorystore for Redis 고가용성', url: 'https://docs.cloud.google.com/memorystore/docs/redis/high-availability-for-memorystore-for-redis' },
    ],
  },
  {
    id: 'c08-20',
    chapter: 8,
    domain: 2,
    topic: '생성형 AI 용량 보장',
    question:
      '항공사의 고객 상담 챗봇은 연중무휴 운영되는 핵심 서비스이며, 트래픽이 꾸준하다. 종량제(PayGo)로 사용하는 동안 사용량이 몰리는 시간대에 가끔 429(리소스 소진) 오류가 발생했다. 안정적인 처리량 보장이 필요하다. 가장 적절한 소비 방식은?',
    options: [
      '오류가 나면 클라이언트가 즉시 무한 재시도하게 한다.',
      '필요한 처리량만큼 Provisioned Throughput을 약정해 핵심 트래픽의 처리량을 보장받고, 초과분은 종량제로 처리한다.',
      '모델을 더 작은 모델로 바꾸고 품질 저하를 감수한다.',
      '챗봇 운영 시간을 줄인다.',
    ],
    answer: [1],
    explanations: [
      '무한 재시도는 부하를 키우고 사용자 대기를 늘린다.',
      'Provisioned Throughput은 약정 기간 동안 보장된 처리량을 제공해, 꾸준하고 중요한 워크로드의 용량 부족 오류를 줄인다. 종량제와 함께 써 급증에 대응할 수 있다.',
      '모델 변경은 요구 품질을 해칠 수 있고 용량 보장 문제를 근본적으로 해결하지 않는다.',
      '운영 시간 축소는 서비스 요구와 반대다.',
    ],
    principle:
      '생성형 AI 소비 방식: 변동·실험 = 종량제, 핵심·꾸준한 트래픽 = 약정 처리량, 대량 비실시간 = 배치.',
    refs: [
      { title: '소비 옵션', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/deploy/consumption-options' },
    ],
  },
  {
    id: 'c08-21',
    chapter: 8,
    domain: 2,
    topic: '음성 합성 API',
    question:
      '통신사의 IVR 안내 멘트는 성우 녹음으로 제작해 요금제가 바뀔 때마다 재녹음 비용과 시간이 든다. 회사는 텍스트를 바꾸면 자연스러운 음성 안내가 자동으로 생성되길 원하며, 여러 언어도 지원해야 한다. 가장 적합한 서비스는?',
    options: [
      'Speech-to-Text',
      'Text-to-Speech',
      'Translation API만 사용',
      'Video Intelligence API',
    ],
    answer: [1],
    explanations: [
      'Speech-to-Text는 음성을 텍스트로 바꾸는 반대 방향 서비스다.',
      'Text-to-Speech는 텍스트를 여러 언어·음성으로 자연스러운 오디오로 합성해, 멘트 변경 시 텍스트만 수정하면 된다.',
      'Translation은 텍스트 번역만 하며 음성을 생성하지 않는다(필요 시 조합해 사용).',
      'Video Intelligence는 영상 분석용이다.',
    ],
    principle:
      '입출력 방향을 먼저 확인한다: 음성→텍스트(Speech-to-Text), 텍스트→음성(Text-to-Speech).',
    refs: [
      { title: 'Text-to-Speech 기본 사항', url: 'https://docs.cloud.google.com/text-to-speech/docs/basics' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (9) ─────────
  {
    id: 'c08-22',
    chapter: 8,
    domain: 3,
    topic: 'CMEK 사용 강제',
    question:
      '규제 대상 폴더의 모든 프로젝트에서 BigQuery·Cloud Storage·Compute Engine 디스크 등 새로 만드는 리소스는 반드시 CMEK로 보호되어야 하며, 승인된 키 프로젝트의 키만 사용해야 한다. 이를 예방적으로 강제하려면?',
    options: [
      '분기마다 암호화 설정을 점검한다.',
      'CMEK 조직 정책(CMEK를 요구하는 서비스 지정 제약과 사용 가능한 키 프로젝트 제한 제약)을 폴더에 적용한다.',
      'Google 기본 암호화로 충분하다고 문서화한다.',
      '개발자에게 CMEK를 사용하라고 안내한다.',
    ],
    answer: [1],
    explanations: [
      '사후 점검은 위반 리소스 생성을 막지 못한다.',
      'CMEK 조직 정책은 지정한 서비스에서 CMEK 없이 리소스를 만드는 것을 거부하고, 사용할 수 있는 키가 있는 프로젝트를 제한해 승인된 키만 쓰게 한다.',
      '규제 요구를 문서로 대체할 수 없다.',
      '안내는 강제력이 없어 실수로 CMEK 없이 만든 리소스를 막지 못한다.',
    ],
    principle:
      '암호화 정책도 조직 정책으로 예방적으로 강제한다(CMEK 필수 + 허용 키 프로젝트).',
    refs: [
      { title: 'CMEK 조직 정책', url: 'https://docs.cloud.google.com/kms/docs/cmek-org-policy' },
    ],
  },
  {
    id: 'c08-23',
    chapter: 8,
    domain: 3,
    topic: 'Cloud KMS Autokey',
    question:
      '플랫폼 팀은 개발팀들이 CMEK를 써야 하는 리소스를 만들 때마다 키링·키를 수동으로 만들고 IAM을 설정해 주느라 병목이 생긴다. 키는 권장 방식(리소스 위치에 맞는 키, 적절한 보호 수준, 직무 분리)에 따라 일관되게 만들어져야 한다. 가장 적절한 방법은?',
    options: [
      '모든 리소스에 하나의 키를 공유한다.',
      'Cloud KMS Autokey를 사용 설정해, 리소스 생성 시 권장 구성의 키가 필요에 따라 자동으로 프로비저닝·할당되게 한다.',
      'CMEK 요구를 없앤다.',
      '개발팀에 Cloud KMS 관리자 권한을 부여한다.',
    ],
    answer: [1],
    explanations: [
      '단일 키 공유는 키 손상 시 피해 범위가 크고 위치 요구와도 맞지 않을 수 있다.',
      'Autokey는 CMEK가 필요한 리소스를 만들 때 권장 사항에 맞는 키를 자동으로 만들고 할당해, 수동 병목 없이 일관된 키 관리를 가능하게 한다.',
      '규제 요구를 없앨 수는 없다.',
      '키 관리 권한을 넓게 주면 직무 분리가 무너진다.',
    ],
    principle:
      '보안 모범 사례를 자동화(Autokey 등)하면 속도와 일관성을 함께 얻는다.',
    refs: [
      { title: 'Cloud KMS Autokey 개요', url: 'https://docs.cloud.google.com/kms/docs/autokey-overview' },
    ],
  },
  {
    id: 'c08-24',
    chapter: 8,
    domain: 3,
    topic: '과도한 권한 줄이기(역할 권장사항)',
    question:
      '감사 결과 많은 사용자와 서비스 계정이 편집자 같은 넓은 역할을 갖고 있지만, 실제로는 그중 일부 권한만 사용하는 것으로 보인다. 보안팀은 서비스 중단 위험 없이 데이터에 근거해 권한을 줄이고 싶다. 가장 적절한 방법은?',
    options: [
      '모든 사용자의 역할을 일괄 뷰어로 바꾼다.',
      'IAM 역할 권장사항을 검토해 실제 권한 사용 기록에 근거한 더 좁은 역할로 단계적으로 교체한다.',
      '권한 문제를 무시한다.',
      '모든 사용자에게 소유자 역할을 줘서 오류를 없앤다.',
    ],
    answer: [1],
    explanations: [
      '일괄 축소는 필요한 권한까지 빼앗아 장애를 일으킬 수 있다.',
      '역할 권장사항은 과거 권한 사용을 분석해 사용되지 않는 권한을 제거한 더 좁은 역할을 제안한다. 근거 있는 단계적 축소로 최소 권한에 가까워진다.',
      '과도한 권한은 탈취 시 피해를 키운다.',
      '권한 확대는 정반대 조치다.',
    ],
    principle:
      '최소 권한은 한 번에 맞추기 어렵다. 사용 데이터 기반 권장사항으로 지속적으로 권한을 줄인다.',
    refs: [
      { title: '역할 권장사항 개요', url: 'https://docs.cloud.google.com/policy-intelligence/docs/role-recommendations-overview' },
    ],
  },
  {
    id: 'c08-25',
    chapter: 8,
    domain: 3,
    topic: '접근 권한 분석(Policy Analyzer)',
    question:
      '감사인이 “고객 데이터가 있는 BigQuery 데이터 세트에 읽기 권한을 가진 모든 사용자와 서비스 계정 목록(상속·그룹 멤버십 포함)”을 요구했다. IAM 정책이 조직·폴더·프로젝트에 흩어져 있고 그룹도 중첩되어 있다. 가장 효율적인 방법은?',
    options: [
      '각 프로젝트의 IAM 페이지를 캡처해 수작업으로 합친다.',
      'Policy Analyzer로 해당 리소스에 특정 권한을 가진 주 구성원을 상속과 그룹 확장을 포함해 조회한다.',
      '모든 직원에게 설문 조사를 한다.',
      '데이터 세트를 삭제하고 다시 만든다.',
    ],
    answer: [1],
    explanations: [
      '수작업은 상속과 중첩 그룹을 누락하기 쉽다.',
      'Policy Analyzer는 리소스 계층 전반의 IAM 정책을 분석해 “누가 무엇에 어떤 접근 권한을 가지는가”를 상속과 그룹 멤버십까지 확장해 답한다.',
      '설문은 부정확하고 감사 증거가 되지 않는다.',
      '데이터 세트 재생성은 접근 권한 목록을 알려 주지 않으며 질문과 무관하다.',
    ],
    principle:
      '접근 권한 질문(누가 무엇에 접근 가능한가)은 Policy Analyzer로, 특정 요청이 왜 거부됐는지는 Policy Troubleshooter로 답한다.',
    refs: [
      { title: 'Policy Analyzer 개요', url: 'https://docs.cloud.google.com/policy-intelligence/docs/policy-analyzer-overview' },
    ],
  },
  {
    id: 'c08-26',
    chapter: 8,
    domain: 3,
    topic: '로그 데이터 상주',
    question:
      '독일 공공기관 고객을 위한 서비스는 애플리케이션 데이터뿐 아니라 로그(요청 로그에 개인정보가 일부 포함)도 EU 안에 저장해야 한다. 현재 로그는 기본 설정의 로그 버킷에 저장된다. 가장 적절한 조치는?',
    options: [
      '로그에 개인정보가 있으므로 로그 수집을 완전히 중단한다.',
      'EU 리전에 로그 버킷을 만들고 싱크로 로그를 라우팅하며, 조직·프로젝트의 기본 로그 저장 위치 설정도 EU로 지정한다.',
      '로그를 매일 내려받아 독일 사무실 서버에 보관한다.',
      '애플리케이션 데이터만 EU에 두면 충분하다.',
    ],
    answer: [1],
    explanations: [
      '로그 수집 중단은 운영·보안·감사 요구를 충족하지 못한다.',
      '로그 버킷은 위치를 지정해 만들 수 있고, 싱크로 로그를 해당 버킷에 라우팅하며, 기본 저장 위치 설정으로 새 버킷도 지정한 지역에 만들어지게 할 수 있다.',
      '수동 다운로드는 누락과 보안 문제를 만든다.',
      '로그에 개인정보가 있다면 로그도 데이터 상주 요구의 대상이다.',
    ],
    principle:
      '데이터 상주 요구는 주 데이터뿐 아니라 로그·백업·캐시 같은 파생 데이터에도 적용해야 한다.',
    refs: [
      { title: '로그 지역화', url: 'https://docs.cloud.google.com/logging/docs/regionalized-logs' },
    ],
  },
  {
    id: 'c08-27',
    chapter: 8,
    domain: 3,
    topic: '빌드 출처 증명(SLSA)',
    question:
      '보안팀은 운영에 배포되는 컨테이너 이미지가 “어떤 소스 커밋에서, 어떤 빌드 시스템으로, 어떤 절차를 거쳐” 만들어졌는지 위조 불가능한 증거로 확인하고 싶다. 소프트웨어 공급망 보안 프레임워크(SLSA) 수준 향상이 목표다. 가장 적절한 방법은?',
    options: [
      '이미지 태그에 커밋 해시를 넣는다.',
      'Cloud Build로 빌드해 서명된 빌드 출처(provenance) 메타데이터를 생성하고, 배포 전에 출처를 검증한다.',
      '빌드 로그를 이메일로 보관한다.',
      '개발자가 로컬에서 빌드한 이미지를 수동 검토 후 업로드한다.',
    ],
    answer: [1],
    explanations: [
      '태그는 누구나 바꿀 수 있어 위조 불가능한 증거가 아니다.',
      'Cloud Build는 빌드 입력(소스)과 절차, 산출물을 담은 서명된 출처 정보를 생성할 수 있고, 이를 검증해 신뢰할 수 있는 빌드에서 나온 산출물만 배포하도록 할 수 있다.',
      '이메일 보관은 검증 가능한 증거가 아니다.',
      '로컬 빌드는 출처 보장이 가장 약하다.',
    ],
    principle:
      '공급망 보안은 “신뢰할 수 있는 빌드 + 서명된 출처 + 배포 시 검증”으로 산출물의 이력을 증명한다.',
    refs: [
      { title: '빌드 출처 생성 및 검증', url: 'https://docs.cloud.google.com/build/docs/securing-builds/generate-validate-build-provenance' },
    ],
  },
  {
    id: 'c08-28',
    chapter: 8,
    domain: 3,
    topic: '유출된 서비스 계정 키 대응',
    question:
      '개발자가 서비스 계정 키 파일을 실수로 공개 Git 저장소에 커밋한 사실이 2시간 뒤 발견되었다. 이 서비스 계정은 운영 데이터 세트에 쓰기 권한이 있다. 가장 먼저 해야 할 조치로 적절한 것은? (2개 선택)',
    options: [
      '노출된 키를 즉시 비활성화·삭제하고, 필요한 경우 새 키 대신 키 없는 인증 방식으로 전환한다.',
      '감사 로그에서 해당 키로 수행된 작업을 조사해 무단 접근·변경 여부와 범위를 확인한다.',
      'Git 커밋만 삭제하면 충분하므로 다른 조치는 필요 없다.',
      '서비스 계정에 더 많은 권한을 부여해 문제를 확인한다.',
      '발견 사실을 팀 밖에 알리지 않는다.',
    ],
    answer: [0, 1],
    explanations: [
      '키를 즉시 무효화하는 것이 추가 피해를 막는 첫 조치다. 장기적으로는 키 없는 인증으로 재발 가능성을 없앤다.',
      '감사 로그 분석으로 노출 기간 동안의 사용 여부와 영향을 파악해 복구·보고 범위를 정한다.',
      '공개 저장소의 내용은 이미 복제·수집되었을 수 있어 커밋 삭제만으로는 부족하다.',
      '권한 확대는 위험을 키운다.',
      '사고 은폐는 대응을 늦추고 규정 위반이 될 수 있다. 사고 대응 절차에 따라 보고한다.',
    ],
    principle:
      '자격 증명 유출 대응: 즉시 무효화 → 영향 조사(감사 로그) → 복구·보고 → 재발 방지(키 없는 인증, 키 생성 금지 정책).',
    refs: [
      { title: '서비스 계정 키 관리 권장사항', url: 'https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys' },
    ],
  },
  {
    id: 'c08-29',
    chapter: 8,
    domain: 3,
    topic: '공동 책임 모델',
    question:
      '감사팀이 “운영체제 보안 패치는 누구 책임인가”를 서비스별로 물었다. 회사는 Compute Engine VM과 Cloud Run을 함께 사용한다. 올바른 설명은?',
    options: [
      '두 서비스 모두 Google이 게스트 OS와 애플리케이션 의존성까지 전부 패치한다.',
      'Compute Engine에서는 게스트 OS 패치가 고객 책임이고, Cloud Run에서는 기반 인프라와 실행 환경은 Google이 관리하지만 컨테이너 이미지 안의 애플리케이션과 의존성 패치는 고객 책임이다.',
      '두 서비스 모두 모든 패치가 고객 책임이다.',
      '클라우드에서는 패치가 필요 없다.',
    ],
    answer: [1],
    explanations: [
      'Google은 IaaS에서 게스트 OS를 관리하지 않으며, 어느 서비스든 고객 코드·의존성은 고객 책임이다.',
      '공동 책임 모델에서 추상화 수준이 높아질수록 Google의 책임 범위가 넓어진다. IaaS(Compute Engine)는 게스트 OS부터 고객 책임이고, 서버리스(Cloud Run)는 인프라와 런타임 환경을 Google이 관리하지만 컨테이너 내용물은 고객이 관리한다.',
      '서버리스 인프라까지 고객이 패치하지는 않는다.',
      '클라우드에서도 취약점은 계속 발견되므로 패치는 여전히 필요하다.',
    ],
    principle:
      '서비스 모델(IaaS·PaaS·서버리스)에 따라 책임 경계가 달라진다. 고객 코드·데이터·IAM 구성은 항상 고객 책임이다.',
    refs: [
      { title: '공동 책임과 공동 운명', url: 'https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate' },
    ],
  },
  {
    id: 'c08-30',
    chapter: 8,
    domain: 3,
    topic: '비밀 데이터의 위치 통제',
    question:
      '규정상 한 국가 고객의 암호화 키 자료와 API 비밀(Secret Manager에 저장)은 해당 국가의 지정 리전 밖에 저장되면 안 된다. 현재 비밀은 기본 자동 복제 정책으로 생성되어 있다. 가장 적절한 조치는?',
    options: [
      '비밀 값을 Base64로 인코딩한다.',
      '비밀을 사용자 관리 복제(지정 리전) 또는 리전 비밀로 다시 만들어 저장 위치를 통제하고, 리소스 위치 조직 정책도 함께 적용한다.',
      '비밀을 애플리케이션 설정 파일로 옮긴다.',
      '자동 복제를 그대로 두고 문서에 예외로 기록한다.',
    ],
    answer: [1],
    explanations: [
      '인코딩은 위치 통제와 무관하며 보안 효과도 없다.',
      'Secret Manager는 자동 복제 외에 사용자가 복제 리전을 지정하는 방식과 리전 비밀을 제공해 비밀 데이터의 저장 위치를 통제할 수 있다. 조직 정책으로 위반 생성을 막는다.',
      '설정 파일은 비밀 관리 기능과 통제를 잃는다.',
      '규정 위반을 문서로 정당화할 수 없다.',
    ],
    principle:
      '데이터 상주 요구는 비밀·키 같은 보안 자산에도 적용된다. 복제·위치 옵션을 명시적으로 선택한다.',
    refs: [
      { title: '비밀 복제 정책 선택', url: 'https://docs.cloud.google.com/secret-manager/docs/choosing-replication' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (7) ─────────
  {
    id: 'c08-31',
    chapter: 8,
    domain: 4,
    topic: '비운영 환경 테스트 데이터',
    question:
      'QA팀이 현실적인 테스트를 위해 운영 DB 사본을 스테이징에 그대로 복사해 사용한다. 스테이징은 접근 통제가 느슨해 개인정보 노출 위험이 지적되었다. 테스트 품질을 유지하면서 위험을 줄이려면?',
    options: [
      '스테이징 테스트를 중단한다.',
      '운영 데이터를 복사할 때 Sensitive Data Protection의 비식별화 템플릿으로 개인정보를 마스킹·토큰화한 데이터를 만들고(또는 합성 데이터 사용), 이를 테스트에 사용한다.',
      '운영 사본을 그대로 쓰고 QA팀에 주의를 당부한다.',
      '스테이징 접근 권한을 모든 직원에게 연다.',
    ],
    answer: [1],
    explanations: [
      '테스트 중단은 품질을 떨어뜨린다.',
      '비식별화 템플릿으로 일관되게 변환한 데이터는 형식·분포를 유지해 테스트에 쓸 수 있으면서 개인정보 노출 위험을 줄인다. 재사용 가능한 템플릿으로 파이프라인을 자동화할 수 있다.',
      '주의 당부는 통제가 아니다.',
      '접근 확대는 위험을 키운다.',
    ],
    principle:
      '비운영 환경에는 원본 개인정보를 두지 않는다. 비식별화·합성 데이터를 테스트 데이터 관리 프로세스로 만든다.',
    refs: [
      { title: 'Sensitive Data Protection 템플릿', url: 'https://docs.cloud.google.com/sensitive-data-protection/docs/concepts-templates' },
    ],
  },
  {
    id: 'c08-32',
    chapter: 8,
    domain: 4,
    topic: 'BigQuery 리전 간 DR',
    question:
      '금융사의 규제 보고용 BigQuery 데이터 세트는 한 리전에 있다. 새 요구사항은 해당 리전이 장기간 사용 불가할 때 다른 리전에서 보고서 작업을 계속하는 것이다. 매일 전체를 내보내고 다시 적재하는 스크립트는 운영 부담이 크다. 가장 적절한 방법은?',
    options: [
      '데이터를 CSV로 매일 다른 리전 버킷에 내보낸다.',
      'BigQuery 교차 리전 데이터 세트 복제를 구성해 보조 리전에 자동 복제본을 유지하고, 장애 시 보조 리전으로 전환하는 절차를 준비한다.',
      '데이터 세트를 삭제하고 필요할 때 다시 만든다.',
      '리전 장애는 발생하지 않는다고 가정한다.',
    ],
    answer: [1],
    explanations: [
      '수동 내보내기는 운영 부담과 복구 시간이 크다.',
      '교차 리전 데이터 세트 복제는 두 리전 간에 데이터 세트를 자동 복제해, 주 리전 장애 시 보조 리전에서 작업을 이어 갈 수 있게 한다. 전환 절차를 런북으로 준비한다.',
      '데이터 세트를 삭제하면 규제 보고 데이터를 잃게 되어 DR과 정반대다.',
      '리전 장애 가능성을 무시하는 것은 DR 요구를 충족하지 못한다.',
    ],
    principle:
      '분석 데이터도 DR 대상이다. 서비스 기본 복제 기능을 먼저 활용하고 전환 절차를 테스트한다.',
    refs: [
      { title: 'BigQuery 교차 리전 데이터 세트 복제', url: 'https://docs.cloud.google.com/bigquery/docs/data-replication' },
    ],
  },
  {
    id: 'c08-33',
    chapter: 8,
    domain: 4,
    topic: '고객 온보딩 프로세스 최적화',
    question:
      'B2B 헬스케어 SaaS는 새 고객사 한 곳을 온보딩하는 데 평균 6주가 걸린다. 그중 대부분이 환경 설정·연동 테스트·권한 구성 같은 수작업이다. 경영진은 “신규 고객 온보딩 속도”를 핵심 목표로 정했다. 가장 효과적인 접근은?',
    options: [
      '온보딩 담당 인력을 두 배로 늘린다.',
      '온보딩 소요 시간을 KPI로 측정하고, 고객별 환경 프로비저닝·연동 설정·권한 구성을 IaC와 템플릿으로 자동화해 반복 작업을 줄인다.',
      '온보딩 요구사항을 고객이 알아서 처리하게 한다.',
      '신규 고객 수를 제한한다.',
    ],
    answer: [1],
    explanations: [
      '인력 증가는 비용이 크고, 반복 수작업 구조는 그대로다.',
      '핵심 목표를 측정 가능한 KPI로 만들고, 반복되는 설정을 자동화하면 온보딩 시간을 줄이고 일관성과 품질도 높일 수 있다.',
      '고객에게 떠넘기면 고객 경험이 나빠진다.',
      '고객 수 제한은 비즈니스 성장 목표와 반대다.',
    ],
    principle:
      '비즈니스 목표 → 측정 지표(KPI) → 병목 자동화로 프로세스를 개선한다.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  {
    id: 'c08-34',
    chapter: 8,
    domain: 4,
    topic: '규정 준수 이해관계자 조기 참여',
    question:
      '핀테크 회사의 신규 서비스 설계가 거의 끝난 시점에 법무·컴플라이언스팀이 처음 검토하면서 데이터 보관 위치와 보존 기간 요건 때문에 대규모 재설계가 필요해졌다. 앞으로 이런 일을 막으려면?',
    options: [
      '법무 검토를 출시 직후로 미룬다.',
      '설계 초기(요구사항 정의 단계)부터 법무·컴플라이언스·보안 이해관계자를 참여시켜 규제 요구를 비기능 요구사항으로 명시하고, 설계 검토 체크포인트에 포함한다.',
      '규제 요구를 개발팀이 추측해 반영한다.',
      '컴플라이언스팀의 의견을 참고 사항으로만 둔다.',
    ],
    answer: [1],
    explanations: [
      '출시 후 검토는 위반 위험과 더 큰 재작업을 부른다.',
      '규제 요구는 아키텍처를 크게 좌우하는 비기능 요구사항이므로 초기부터 명시하고, 설계 단계별 검토에 해당 이해관계자를 포함해야 재설계를 피할 수 있다.',
      '추측은 오류와 위반 위험을 키운다.',
      '규제 요구는 선택 사항이 아니다.',
    ],
    principle:
      '비기능 요구사항(규제·보안·가용성)은 설계 초기에 확정한다. 늦게 발견될수록 변경 비용이 커진다.',
    refs: [
      { title: 'Well-Architected Framework: 보안', url: 'https://docs.cloud.google.com/architecture/framework/security' },
    ],
  },
  {
    id: 'c08-35',
    chapter: 8,
    domain: 4,
    topic: '결정의 가역성 판단',
    question:
      '팀이 모든 기술 결정마다 수주간 검토 회의를 열어 속도가 느리다. 예를 들어 사내 도구의 로깅 라이브러리 선택과, 핵심 고객 데이터의 저장 위치(리전) 결정에 똑같은 절차를 적용하고 있다. 의사결정 프로세스를 어떻게 개선해야 하는가?',
    options: [
      '모든 결정을 한 사람이 즉시 내린다.',
      '되돌리기 쉬운 결정(가역적)은 빠르게 팀 단위로 내리고, 되돌리기 어렵거나 영향이 큰 결정(비가역적)에만 심층 검토와 이해관계자 승인을 적용한다.',
      '모든 결정에 더 긴 검토를 적용한다.',
      '결정을 계속 미룬다.',
    ],
    answer: [1],
    explanations: [
      '독단적 결정은 중요한 결정의 품질을 떨어뜨린다.',
      '결정의 가역성과 영향도에 따라 검토 수준을 차등화하면 대부분의 결정은 빠르게 내리고, 데이터 위치처럼 되돌리기 어려운 결정에는 충분한 분석을 집중할 수 있다.',
      '일률적 장기 검토는 속도를 더 떨어뜨린다.',
      '미루기는 기회 비용을 키운다.',
    ],
    principle:
      '의사결정 비용은 결정의 가역성과 영향에 비례해야 한다.',
    refs: [
      { title: '아키텍처 의사결정 기록 개요', url: 'https://docs.cloud.google.com/architecture/architecture-decision-records' },
    ],
  },
  {
    id: 'c08-36',
    chapter: 8,
    domain: 4,
    topic: '운영비(OpEx) 예측',
    question:
      '데이터센터에서 클라우드로 이전한 뒤 재무팀은 매달 청구액이 변동해 예산 계획이 어렵다고 불평한다. 이전에는 수년 단위 자본 지출(CapEx)로 예측이 쉬웠다. 재무 예측 가능성을 높이는 방법으로 가장 적절한 것은?',
    options: [
      '클라우드 사용을 고정 규모로 묶고 자동 확장을 끈다.',
      '과거 결제 데이터로 사용량 추세를 분석해 예산과 예측을 세우고, 안정적인 기준 사용량은 약정 할인으로 고정 비용화하며, 예산 알림과 비용 할당으로 변동분을 관리한다.',
      '매달 가장 높은 달의 금액으로 예산을 잡는다.',
      '온프레미스로 되돌린다.',
    ],
    answer: [1],
    explanations: [
      '자동 확장을 끄면 탄력성과 비용 효율을 모두 잃는다.',
      '운영비 모델에서는 사용량 추세 기반 예측, 약정으로 기준 비용 고정, 예산 알림·비용 할당으로 변동 관리를 결합해 예측 가능성을 높인다.',
      '최고치 기준 예산은 자원 배분을 왜곡한다.',
      '온프레미스 복귀는 근거 없는 결정이다.',
    ],
    principle:
      'CapEx에서 OpEx로의 전환에는 재무 프로세스(예측·약정·예산·할당)의 변화가 함께 필요하다.',
    refs: [
      { title: '예산 및 예산 알림', url: 'https://docs.cloud.google.com/billing/docs/how-to/budgets' },
    ],
  },
  {
    id: 'c08-37',
    chapter: 8,
    domain: 4,
    topic: 'CI 러너 비용 최적화',
    question:
      '회사의 자체 호스팅 CI 러너 VM 50대가 24시간 켜져 있지만, 빌드는 업무 시간에 몰리고 각 빌드 작업은 실패해도 재시도하면 된다. CI 인프라 비용을 줄이는 가장 효과적인 조합은?',
    options: [
      '러너를 모두 메모리 최적화 VM으로 바꾼다.',
      '러너를 대기 작업량에 따라 자동 확장되는 MIG로 구성하고, 재시도 가능한 빌드 작업에는 Spot VM을 사용한다(또는 관리형 Cloud Build로 이전).',
      '러너 수를 100대로 늘려 빌드 대기를 없앤다.',
      '3년 약정으로 50대를 고정한다.',
    ],
    answer: [1],
    explanations: [
      '머신 유형 변경은 유휴 시간 문제를 해결하지 않는다.',
      '대기 작업량 기반 자동 확장은 유휴 러너를 없애고, 재시도 가능한 빌드에는 Spot VM의 할인을 활용할 수 있다. 관리형 Cloud Build는 러너 운영 자체를 없앤다.',
      '러너를 늘리면 유휴 비용이 더 커진다.',
      '변동이 큰 워크로드에 전체 고정 약정은 낭비다.',
    ],
    principle:
      '재시도 가능하고 변동이 큰 작업은 자동 확장 + Spot으로, 운영 부담이 문제면 관리형 서비스로 옮긴다.',
    refs: [
      { title: 'Spot VM', url: 'https://docs.cloud.google.com/compute/docs/instances/spot' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (7) ─────────
  {
    id: 'c08-38',
    chapter: 8,
    domain: 5,
    topic: '다중 대상 병렬 배포',
    question:
      '서비스가 3개 리전의 Cloud Run(또는 GKE) 대상에 배포된다. 지금은 리전마다 파이프라인을 따로 실행해 버전이 어긋나는 일이 있다. 운영 승격 시 세 리전에 같은 릴리스를 동시에 배포하고 하나의 롤아웃으로 추적하고 싶다. Cloud Deploy에서 가장 적절한 방법은?',
    options: [
      '리전별로 별도의 배포 파이프라인을 계속 유지한다.',
      '세 리전 대상을 하위 대상으로 묶은 다중 대상(multi-target)을 정의해 병렬 배포한다.',
      '한 리전에만 배포하고 나머지는 수동으로 복사한다.',
      'DNS로 한 리전만 사용한다.',
    ],
    answer: [1],
    explanations: [
      '별도 파이프라인은 버전 불일치와 추적 어려움을 그대로 둔다.',
      '다중 대상은 여러 대상을 하나의 대상처럼 다뤄 같은 릴리스를 병렬로 배포하고, 하나의 롤아웃으로 상태를 추적하게 한다.',
      '수동 복사는 오류와 지연을 만든다.',
      '한 리전만 쓰면 멀티 리전 가용성이 사라진다.',
    ],
    principle:
      '멀티 리전 배포는 하나의 릴리스를 여러 대상에 일관되게 배포하는 구조(병렬 배포)로 관리한다.',
    refs: [
      { title: 'Cloud Deploy 병렬 배포', url: 'https://docs.cloud.google.com/deploy/docs/deploy-app-parallel' },
    ],
  },
  {
    id: 'c08-39',
    chapter: 8,
    domain: 5,
    topic: 'Apigee 형식 변환(중재)',
    question:
      '보험사의 레거시 계약 조회 시스템은 XML(SOAP)로만 응답한다. 새 모바일 앱과 파트너는 JSON REST API를 원한다. 레거시 시스템은 수정할 수 없다. Apigee로 어떻게 제공하는 것이 가장 적절한가?',
    options: [
      '레거시 시스템을 재작성한다.',
      'Apigee API 프록시에서 REST 요청을 받아 백엔드로 전달하고, 응답에 XMLToJSON 정책을 적용해 JSON으로 변환해 반환한다.',
      '모바일 앱이 XML을 직접 파싱하게 한다.',
      '레거시 시스템을 인터넷에 직접 공개한다.',
    ],
    answer: [1],
    explanations: [
      '레거시 수정 불가라는 제약에 어긋난다.',
      'Apigee는 API 프록시에서 메시지 형식 변환(XML↔JSON) 같은 중재 정책을 제공해, 백엔드를 바꾸지 않고 현대적인 API로 노출할 수 있다.',
      '모든 클라이언트에 변환 부담을 넘기면 중복과 불일치가 생긴다.',
      '레거시 직접 공개는 보안 위험이 크다.',
    ],
    principle:
      'API 관리 계층은 보안·트래픽 제어뿐 아니라 레거시 백엔드의 형식·프로토콜을 중재해 현대화의 완충 지대가 된다.',
    refs: [
      { title: 'Apigee XMLToJSON 정책', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/reference/policies/xml-json-policy' },
    ],
  },
  {
    id: 'c08-40',
    chapter: 8,
    domain: 5,
    topic: '타 클라우드 VM 이전',
    question:
      '회사가 AWS EC2에서 실행 중인 VM 80대를 Compute Engine으로 옮기려 한다. 전환 전 테스트 클론으로 검증하고, 전환 시 다운타임을 최소화하고 싶다. 이미 VMware 온프레미스 이전에 사용해 본 도구를 재사용하길 원한다. 가장 적합한 도구는?',
    options: [
      'Transfer Appliance',
      'Migrate to Virtual Machines(AWS 소스 구성)',
      'Storage Transfer Service',
      'Database Migration Service',
    ],
    answer: [1],
    explanations: [
      'Transfer Appliance는 대용량 데이터 오프라인 전송용이다.',
      'Migrate to Virtual Machines는 vSphere뿐 아니라 AWS·Azure 등 다른 클라우드의 VM도 소스로 지원해, 복제·테스트 클론·전환 흐름을 같은 방식으로 수행할 수 있다.',
      'Storage Transfer Service는 객체·파일 데이터 전송용이다.',
      'Database Migration Service는 데이터베이스 이전용이다.',
    ],
    principle:
      '이전 대상(VM·DB·객체·파일·웨어하우스)에 맞는 전용 도구를 선택한다. VM은 소스와 무관하게 Migrate to Virtual Machines가 기본이다.',
    refs: [
      { title: 'Migrate to Virtual Machines로 VM 이전', url: 'https://docs.cloud.google.com/migrate/virtual-machines/docs/5.0/migrate/migrating-vms' },
    ],
  },
  {
    id: 'c08-41',
    chapter: 8,
    domain: 5,
    topic: 'gsutil에서 gcloud storage로',
    question:
      '운영팀의 백업·배포 스크립트 수십 개가 오래전 작성된 gsutil 명령을 사용한다. 새로 도입하는 자동화 표준을 정하면서 Cloud Storage CLI를 어떻게 다룰지 결정해야 한다. 가장 적절한 방침은?',
    options: [
      '앞으로도 gsutil만 사용한다.',
      '공식 권장 CLI인 gcloud storage 명령으로 새 스크립트를 작성하고, 기존 gsutil 스크립트도 단계적으로 전환한다.',
      '모든 스크립트를 콘솔 수작업으로 대체한다.',
      'Cloud Storage 사용을 중단한다.',
    ],
    answer: [1],
    explanations: [
      'gsutil은 권장 CLI가 아니며 향후 배포 방식도 변경될 예정이라 새 표준으로 삼기에 부적합하다.',
      'Cloud Storage 문서는 gcloud storage 명령 사용을 권장하며 gsutil에서의 전환을 안내한다. 새 스크립트는 gcloud storage로 작성하고 기존 스크립트를 계획적으로 전환한다.',
      '수작업은 자동화 목표와 반대다.',
      '서비스 사용 중단은 근거가 없다.',
    ],
    principle:
      '도구 표준은 공식 권장 경로를 따른다. 레거시 도구는 전환 계획을 세워 기술 부채로 관리한다.',
    refs: [
      { title: 'gsutil 도구(gcloud storage 권장)', url: 'https://docs.cloud.google.com/storage/docs/gsutil' },
    ],
  },
  {
    id: 'c08-42',
    chapter: 8,
    domain: 5,
    topic: '대량 목록 API 설계',
    question:
      '주문 조회 API가 고객의 전체 주문(수만 건)을 한 번에 반환해 응답이 느리고 메모리 부족 오류가 난다. 모바일 앱은 보통 최근 20건과 몇 개 필드만 표시한다. API 설계 모범 사례에 따른 개선으로 가장 적절한 것은?',
    options: [
      '응답 타임아웃을 늘린다.',
      '페이지 크기와 다음 페이지 토큰을 사용하는 페이지 나누기(pagination)를 적용하고, 필요한 필드만 요청하는 부분 응답(필드 마스크)을 지원한다.',
      '서버 메모리를 늘린다.',
      '전체 목록을 압축 파일로 이메일 발송한다.',
    ],
    answer: [1],
    explanations: [
      '타임아웃 연장은 근본 원인(과도한 응답 크기)을 해결하지 않는다.',
      '페이지 나누기는 한 번에 반환하는 양을 제한하고 토큰으로 다음 페이지를 이어서 가져오게 한다. 필드 마스크는 필요한 필드만 반환해 전송량을 줄인다. Google API 설계 가이드의 표준 패턴이다.',
      '메모리 증설은 데이터가 늘면 다시 한계에 부딪힌다.',
      '이메일은 API 사용 방식이 아니다.',
    ],
    principle:
      '목록 API는 처음부터 페이지 나누기를 지원해야 한다. 나중에 추가하면 호환성을 깨기 쉽다.',
    refs: [
      { title: 'AIP-158: 페이지 나누기', url: 'https://google.aip.dev/158' },
      { title: 'AIP-157: 부분 응답', url: 'https://google.aip.dev/157' },
    ],
  },
  {
    id: 'c08-43',
    chapter: 8,
    domain: 5,
    topic: '장기 실행 작업(LRO) 처리',
    question:
      '자동화 스크립트가 Cloud SQL 인스턴스 생성·백업 복원 같은 API를 호출한 뒤, 응답이 즉시 “작업(operation)” 객체로 반환되자 작업이 끝난 것으로 간주하고 다음 단계로 진행해 오류가 난다. 올바른 처리 방법은?',
    options: [
      'API 호출 후 고정으로 10초만 기다린다.',
      '반환된 장기 실행 작업의 이름으로 상태를 조회(폴링)하거나 클라이언트 라이브러리의 작업 완료 대기 기능을 사용해, 작업이 완료되고 성공한 것을 확인한 뒤 다음 단계를 진행한다.',
      '오류가 나면 전체 스크립트를 처음부터 다시 실행한다.',
      '작업 객체를 무시한다.',
    ],
    answer: [1],
    explanations: [
      '고정 대기는 작업 시간이 달라지면 실패한다.',
      '오래 걸리는 API는 장기 실행 작업(LRO)을 반환하므로, 작업 상태를 확인해 완료·성공 여부를 판단해야 한다. 클라이언트 라이브러리는 대기 헬퍼를 제공한다.',
      '전체 재실행은 비효율적이고 중복 생성 위험이 있다.',
      '작업 객체를 무시하면 동일한 오류가 반복된다.',
    ],
    principle:
      '비동기 API는 “요청 수락 ≠ 작업 완료”다. LRO 상태를 확인하고 멱등하게 재시도한다.',
    refs: [
      { title: 'AIP-151: 장기 실행 작업', url: 'https://google.aip.dev/151' },
    ],
  },
  {
    id: 'c08-44',
    chapter: 8,
    domain: 5,
    topic: 'Bigtable 에뮬레이터',
    question:
      '팀은 Bigtable을 사용하는 시계열 수집 서비스의 행 키 설계와 읽기·쓰기 로직을 CI에서 자동 테스트하고 싶다. 테스트마다 실제 Bigtable 인스턴스를 만들면 시간과 비용이 든다. 가장 적절한 방법은?',
    options: [
      '운영 Bigtable 인스턴스에 테스트 데이터를 쓴다.',
      'gcloud로 Bigtable 에뮬레이터를 실행하고 클라이언트가 BIGTABLE_EMULATOR_HOST 환경 변수로 연결해 테스트한다. 성능 특성은 별도로 실제 인스턴스에서 검증한다.',
      'Bigtable 대신 로컬 SQLite로 테스트한다.',
      '테스트를 생략한다.',
    ],
    answer: [1],
    explanations: [
      '운영 인스턴스 사용은 데이터 오염 위험이 크다.',
      'Bigtable 에뮬레이터는 로컬 메모리에서 Bigtable API를 흉내 내 비용 없이 빠르게 기능 테스트를 할 수 있다. 성능·확장 특성은 에뮬레이터가 재현하지 못하므로 별도로 검증한다.',
      '다른 DB로는 Bigtable 데이터 모델과 API를 검증할 수 없다.',
      '테스트 생략은 결함을 운영으로 넘긴다.',
    ],
    principle:
      '에뮬레이터는 기능 정확성 검증용이고, 성능·확장성 검증은 실제 서비스에서 한다.',
    refs: [
      { title: 'Bigtable 에뮬레이터로 테스트', url: 'https://docs.cloud.google.com/bigtable/docs/emulator' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c08-45',
    chapter: 8,
    domain: 6,
    topic: '부하 분산기 로그 샘플링',
    question:
      '초당 수만 건의 요청을 처리하는 외부 애플리케이션 부하 분산기의 요청 로그를 100% 수집하느라 로깅 비용이 크다. 운영팀은 트래픽 추세 분석과 오류 조사에 충분한 가시성은 유지하고 싶다. 가장 적절한 조치는?',
    options: [
      '부하 분산기 로깅을 완전히 끈다.',
      '백엔드 서비스의 로깅 샘플링 비율을 낮춰 일부 요청만 기록하고, 오류율·지연 같은 지표는 Cloud Monitoring 지표로 전체를 관찰한다.',
      '로그 보존 기간을 늘린다.',
      '로그를 모두 BigQuery로 보내 비용을 비교한다.',
    ],
    answer: [1],
    explanations: [
      '로깅을 끄면 요청 단위 조사가 불가능해진다.',
      '샘플링 비율을 조정하면 로그 비용을 줄이면서 통계적으로 충분한 요청 로그를 얻을 수 있다. 전체 트래픽 지표는 로그와 별개로 모니터링 지표로 확인한다.',
      '보존 기간 연장은 비용을 늘린다.',
      '목적지 변경은 수집량 자체를 줄이지 않는다.',
    ],
    principle:
      '대량 트래픽의 관측성은 “지표는 전수, 로그·트레이스는 샘플링”으로 비용과 가시성을 균형 있게 설계한다.',
    refs: [
      { title: '외부 애플리케이션 부하 분산기 로깅·모니터링', url: 'https://docs.cloud.google.com/load-balancing/docs/https/https-logging-monitoring' },
    ],
  },
  {
    id: 'c08-46',
    chapter: 8,
    domain: 6,
    topic: '영역 장애 대비 훈련',
    question:
      '서비스는 리전 MIG와 Cloud SQL HA로 “영역 장애에 견딘다”고 설계되었지만 실제로 검증된 적은 없다. 운영팀은 계획된 훈련으로 이를 확인하려 한다. 가장 적절한 방법은?',
    options: [
      '설계 문서를 다시 검토하는 것으로 충분하다.',
      '스테이징(또는 통제된 운영 환경)에서 한 영역의 인스턴스를 중지하거나 트래픽을 차단하는 게임 데이를 계획해 자동 복구·용량·알림·런북을 관찰하고, 결과를 개선에 반영한다.',
      '예고 없이 운영 환경 전체를 중단시킨다.',
      '실제 영역 장애가 날 때까지 기다린다.',
    ],
    answer: [1],
    explanations: [
      '문서 검토는 실제 동작(자동 복구·용량 여유)을 증명하지 못한다.',
      '계획된 장애 훈련은 영향 범위를 통제하면서 설계 가정(용량 N+1, 자동 복구, 장애 조치, 알림)을 실제로 검증하고 약점을 찾아 개선하게 한다.',
      '무계획 전면 중단은 실제 장애를 일으킨다.',
      '실제 장애 때 처음 확인하는 것은 위험하다.',
    ],
    principle:
      '신뢰성은 주장이 아니라 검증이다. 통제된 장애 훈련(게임 데이)으로 설계 가정을 정기적으로 확인한다.',
    refs: [
      { title: '장애 복구 테스트 수행', url: 'https://docs.cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-failures' },
    ],
  },
  {
    id: 'c08-47',
    chapter: 8,
    domain: 6,
    topic: '기능 킬 스위치',
    question:
      '새 추천 알고리즘을 적용한 뒤 DB 부하가 급증했다. 롤백하려면 전체 앱을 재배포해야 해 20분이 걸린다. 앞으로 새 기능이 문제를 일으킬 때 몇 초 안에 해당 기능만 끄고 싶다. 가장 적절한 릴리스 관리 관행은?',
    options: [
      '새 기능은 한 번에 모두 배포한다.',
      '새 기능을 기능 플래그로 감싸 런타임에 켜고 끌 수 있게 하고(킬 스위치), 장애 대응 런북에 플래그 끄기 절차를 포함한다.',
      '롤백 시간을 줄이기 위해 테스트를 생략한다.',
      '문제가 생기면 DB를 수동으로 재시작한다.',
    ],
    answer: [1],
    explanations: [
      '일괄 배포는 문제 발생 시 영향이 크고 빠른 차단이 어렵다.',
      '기능 플래그는 재배포 없이 특정 기능을 즉시 비활성화할 수 있게 해 완화 시간을 크게 줄인다. 대응 절차에 포함해야 실제 장애 때 활용된다.',
      '테스트 생략은 문제를 더 자주 만든다.',
      'DB 재시작은 원인을 해결하지 않고 추가 장애를 일으킬 수 있다.',
    ],
    principle:
      '완화 속도가 핵심이다: 재배포 롤백보다 빠른 킬 스위치·트래픽 전환 수단을 미리 준비한다.',
    refs: [
      { title: 'DORA 역량: 트렁크 기반 개발(기능 플래그)', url: 'https://dora.dev/capabilities/trunk-based-development/' },
    ],
  },
  {
    id: 'c08-48',
    chapter: 8,
    domain: 6,
    topic: '런북 자동화',
    question:
      '온콜 엔지니어는 매주 여러 번 “디스크 사용률 90% 초과 알림 → 오래된 임시 파일 정리 → 서비스 재시작”을 같은 순서로 수작업한다. 절차는 안정적이고 위험이 낮다. 운영 우수성 관점에서 가장 적절한 개선은?',
    options: [
      '알림 임계값을 99%로 올린다.',
      '검증된 런북 단계를 자동화(예: 알림을 트리거로 Cloud Run 작업·Workflows 실행)하고 실행 결과를 기록하며, 반복 원인(임시 파일 정리 누락)도 근본적으로 해결한다.',
      '온콜 인원을 늘린다.',
      '디스크를 무한대로 늘린다.',
    ],
    answer: [1],
    explanations: [
      '임계값 상향은 문제를 늦게 발견하게 할 뿐이다.',
      '반복적이고 안정적인 수작업 대응은 자동화해 toil을 줄이고 대응 시간을 단축한다. 동시에 원인을 제거하면 알림 자체가 줄어든다.',
      '인원 증가는 toil을 줄이지 못한다.',
      '무제한 확장은 비용과 근본 원인 문제를 남긴다.',
    ],
    principle:
      '런북은 자동화의 설계도다. 반복되는 안정적 절차는 자동화하고, 근본 원인도 함께 제거한다.',
    refs: [
      { title: 'SRE 책: toil 제거', url: 'https://sre.google/sre-book/eliminating-toil/' },
    ],
  },
  {
    id: 'c08-49',
    chapter: 8,
    domain: 6,
    topic: '지속 가능한 온콜',
    question:
      'SRE 팀의 온콜 담당자는 교대당 수십 건의 호출을 받고, 그중 상당수는 조치가 필요 없는 알림이다. 번아웃으로 이직이 늘고 있다. 온콜 운영을 개선하는 가장 적절한 방법은?',
    options: [
      '온콜 수당만 올린다.',
      '교대당 호출 건수·조치 필요 비율 같은 온콜 부하 지표를 측정하고, 조치 불필요 알림을 제거하거나 티켓으로 전환하며, 반복 원인을 개선 과제로 추적한다.',
      '알림을 모두 이메일로 바꾼다.',
      '온콜을 한 사람에게 고정한다.',
    ],
    answer: [1],
    explanations: [
      '보상만으로는 과도한 부하와 번아웃을 해결하지 못한다.',
      '온콜 부하를 측정하고, 모든 호출이 조치 가능하도록 알림을 정리하며, 반복 원인을 제거하면 지속 가능한 온콜이 된다.',
      '이메일 전환은 중요한 알림까지 놓치게 한다.',
      '한 사람에게 고정하면 번아웃이 더 심해진다.',
    ],
    principle:
      '모든 호출은 긴급하고 조치 가능해야 한다. 온콜 부하는 측정·관리하는 운영 지표다.',
    refs: [
      { title: 'SRE 워크북: 온콜', url: 'https://sre.google/workbook/on-call/' },
    ],
  },
  {
    id: 'c08-50',
    chapter: 8,
    domain: 6,
    topic: '의존성과 SLO 목표',
    question:
      '제품팀은 새 서비스의 가용성 SLO를 99.99%로 정하려 한다. 그런데 이 서비스는 핵심 경로에서 가용성 99.9% 수준의 외부 결제 API와 단일 리전 DB에 직렬로 의존한다. 아키텍트의 조언으로 가장 적절한 것은?',
    options: [
      '의존성과 무관하게 99.99%를 약속한다.',
      '직렬 의존성의 가용성이 서비스 가용성의 상한이 되므로, 의존성을 고려해 달성 가능한 SLO를 정하거나, 99.99%가 필요하면 의존성 이중화·비동기화·우아한 성능 저하 같은 설계 변경을 함께 계획한다.',
      'SLO를 정하지 않는다.',
      '모니터링에서 의존성 오류를 제외해 지표를 높인다.',
    ],
    answer: [1],
    explanations: [
      '직렬 의존성이 목표보다 낮은 가용성을 가지면 목표 달성이 구조적으로 불가능하다.',
      '핵심 경로의 직렬 의존성 가용성은 곱해져 전체 가용성을 제한한다. SLO는 의존성을 반영해 현실적으로 정하고, 더 높은 목표가 필요하면 설계로 의존성 영향을 줄여야 한다.',
      'SLO 없이는 신뢰성 목표와 오류 예산을 관리할 수 없다.',
      '지표 조작은 사용자 경험을 숨길 뿐이다.',
    ],
    principle:
      '서비스 가용성은 핵심 경로 의존성의 가용성을 넘을 수 없다. 목표를 높이려면 의존성 구조를 바꿔야 한다.',
    refs: [
      { title: 'SRE 책: 가용성 표(의존성 계산)', url: 'https://sre.google/sre-book/availability-table/' },
    ],
  },
  // @@END
]
