// Chapter 3 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (13) ─────────
  {
    id: 'c03-01',
    chapter: 3,
    domain: 1,
    topic: 'Cloud Storage 위치 유형과 복제',
    question:
      '방송사가 뉴스 원본 영상을 Cloud Storage에 저장한다. 한 리전이 전체 중단되어도 두 리전 중 다른 쪽에서 즉시 읽을 수 있어야 하고, 새로 업로드된 영상이 두 리전에 복제되기까지의 목표 시간(RPO)이 15분 이내여야 한다. 데이터는 미국 안의 정해진 두 리전에만 저장해야 한다. 어떤 구성이 적합한가?',
    options: [
      '단일 리전 버킷에 객체 버전 관리를 사용 설정한다.',
      '지정한 두 리전으로 구성된 이중 리전 버킷을 만들고 터보 복제를 사용 설정한다.',
      '멀티 리전(US) 버킷을 기본 복제 설정으로 사용한다.',
      '두 리전에 각각 버킷을 만들고 매일 밤 gcloud storage rsync로 동기화한다.',
    ],
    answer: [1],
    explanations: [
      '단일 리전 버킷은 해당 리전 장애 시 접근할 수 없고, 버전 관리는 지리적 복제가 아니다.',
      '이중 리전 버킷은 사용자가 고른 두 리전에 데이터를 저장하며, 터보 복제를 켜면 새로 쓴 객체를 15분 RPO 목표 내에 두 리전으로 복제하도록 설계되어 있다. 위치 제약과 RPO를 모두 충족한다.',
      '멀티 리전은 저장 리전을 사용자가 정확히 지정할 수 없고, 기본 복제는 터보 복제보다 RPO 목표가 길다.',
      '야간 동기화는 최대 하루치 데이터 손실이 가능하고 운영 부담도 있다.',
    ],
    principle:
      '버킷 위치 유형은 가용성·위치 통제·RPO의 트레이드오프다: 리전 < 이중 리전(위치 지정, 터보 복제로 RPO 단축) / 멀티 리전(넓은 지역, 위치 비지정).',
    refs: [
      { title: 'Cloud Storage 가용성·내구성과 복제', url: 'https://docs.cloud.google.com/storage/docs/availability-durability' },
      { title: '터보 복제 관리', url: 'https://docs.cloud.google.com/storage/docs/managing-turbo-replication' },
    ],
  },
  {
    id: 'c03-02',
    chapter: 3,
    domain: 1,
    topic: 'BigQuery 테이블 설계',
    question:
      '리테일 회사의 BigQuery 판매 테이블은 5년치 수십 TB이며, 대부분의 쿼리는 “최근 30일 + 특정 매장 ID” 조건으로 실행된다. 주문형 요금제에서 쿼리 비용이 계속 늘고 있다. 쿼리 결과를 바꾸지 않고 스캔 비용을 줄이는 가장 효과적인 방법은?',
    options: [
      '테이블을 판매일 기준으로 파티셔닝하고 매장 ID로 클러스터링한다.',
      '쿼리에 LIMIT 절을 추가한다.',
      '테이블을 매장별로 수천 개의 개별 테이블로 나눈다.',
      '모든 데이터를 Cloud SQL로 옮긴다.',
    ],
    answer: [0],
    explanations: [
      '날짜 파티셔닝은 최근 30일 조건일 때 해당 파티션만 읽게 하고(파티션 프루닝), 매장 ID 클러스터링은 파티션 안에서 필요한 블록만 읽게 해 스캔 바이트를 크게 줄인다.',
      'LIMIT은 반환 행 수만 줄일 뿐 일반적으로 스캔량을 줄이지 않는다.',
      '테이블을 수천 개로 쪼개면 관리가 복잡해지고, 파티셔닝·클러스터링보다 성능·비용 이점도 없다.',
      'Cloud SQL은 수십 TB 분석 쿼리에 적합하지 않다.',
    ],
    principle:
      'BigQuery 비용·성능 최적화의 기본은 필터에 자주 쓰는 날짜 열로 파티셔닝, 선택도 높은 조건 열로 클러스터링하는 것이다.',
    refs: [
      { title: '파티션을 나눈 테이블', url: 'https://docs.cloud.google.com/bigquery/docs/partitioned-tables' },
      { title: '클러스터링된 테이블', url: 'https://docs.cloud.google.com/bigquery/docs/clustered-tables' },
    ],
  },
  {
    id: 'c03-03',
    chapter: 3,
    domain: 1,
    topic: '이벤트 기반 비동기 아키텍처',
    question:
      '주문 서비스가 주문을 받으면 재고 차감, 알림 발송, 포인트 적립, 분석 적재를 모두 동기 호출로 처리한다. 알림 서비스가 느려지면 주문 응답도 느려지고, 새 소비 서비스를 추가할 때마다 주문 서비스 코드를 고쳐야 한다. 결합도를 낮추고 확장성을 높이려면?',
    options: [
      '주문 서비스가 각 서비스를 호출할 때 타임아웃을 늘린다.',
      '주문 서비스는 “주문 생성” 이벤트를 Pub/Sub 주제에 게시하고, 각 소비 서비스가 자기 구독으로 독립적으로 처리하게 한다.',
      '모든 서비스를 하나의 모놀리식 애플리케이션으로 합친다.',
      '주문 서비스가 공유 데이터베이스 테이블에 기록하고 다른 서비스가 1초마다 폴링하게 한다.',
    ],
    answer: [1],
    explanations: [
      '타임아웃을 늘리면 느린 서비스의 영향이 더 커지고 결합도는 그대로다.',
      '게시-구독 방식은 생산자가 소비자를 몰라도 되게 해 결합도를 낮춘다. 소비자는 각자의 구독으로 자기 속도에 맞게 처리하고, 새 소비자는 구독만 추가하면 된다. 느린 소비자가 주문 응답에 영향을 주지 않는다.',
      '모놀리스로 합치면 독립 배포·확장이 불가능해진다.',
      '공유 DB 폴링은 강한 결합과 불필요한 부하를 만들고 실시간성도 떨어진다.',
    ],
    principle:
      '하나의 사건을 여러 소비자가 독립적으로 처리해야 하면 Pub/Sub 팬아웃(주제 1개 + 소비자별 구독)으로 비동기화한다.',
    refs: [
      { title: 'Pub/Sub 기본 개념', url: 'https://docs.cloud.google.com/pubsub/docs/pubsub-basics' },
    ],
  },
  {
    id: 'c03-04',
    chapter: 3,
    domain: 1,
    topic: 'Cloud Tasks와 Pub/Sub 선택',
    question:
      '예약 플랫폼이 외부 항공사 API를 호출해 좌석을 확정한다. 항공사는 초당 호출 수를 엄격히 제한하며, 각 요청은 특정 시각 이후에 실행되도록 예약할 수 있어야 하고, 실패하면 정해진 정책으로 재시도해야 한다. 요청을 보내는 쪽이 어떤 엔드포인트를 호출할지 명시적으로 지정한다. 가장 적합한 서비스는?',
    options: [
      'Pub/Sub 푸시 구독',
      'Cloud Tasks 큐(전송 속도 제한·예약 시각·재시도 설정)',
      'Cloud Scheduler cron 작업 하나',
      'BigQuery 예약 쿼리',
    ],
    answer: [1],
    explanations: [
      'Pub/Sub는 게시자와 구독자를 분리하는 암시적 호출 방식이며, 개별 메시지의 실행 시각 예약이나 대상 엔드포인트에 대한 세밀한 전송 속도 제어에는 Cloud Tasks가 더 적합하다.',
      'Cloud Tasks는 생산자가 실행 대상을 명시하는 작업 큐로, 큐 단위 전송 속도·동시성 제한, 작업별 예약 시각, 재시도 정책을 제공해 외부 API 호출 한도를 지키기에 적합하다.',
      'Cloud Scheduler는 정해진 주기의 작업 실행용이며, 요청마다 다른 예약 시각과 개별 재시도를 관리하지 못한다.',
      'BigQuery 예약 쿼리는 데이터 분석용으로 외부 API 호출과 무관하다.',
    ],
    principle:
      '명시적 대상 호출 + 속도 제한 + 작업별 예약·재시도 = Cloud Tasks, 생산자-소비자 분리와 팬아웃 = Pub/Sub.',
    refs: [
      { title: 'Pub/Sub와 Cloud Tasks 선택', url: 'https://docs.cloud.google.com/pubsub/docs/choosing-pubsub-or-cloud-tasks' },
    ],
  },
  {
    id: 'c03-05',
    chapter: 3,
    domain: 1,
    topic: '서비스 오케스트레이션(Workflows)',
    question:
      '보험 청구 처리는 (1) 서류 검증 서비스 호출, (2) 사기 탐지 API 호출, (3) 결과에 따라 승인 또는 수동 검토 대기열 등록, (4) 실패 단계는 재시도 후 보상 처리의 순서로 진행된다. 각 단계는 이미 Cloud Run 서비스로 구현되어 있다. 단계 순서·분기·재시도·상태를 서버 관리 없이 명시적으로 정의하고 싶다. 가장 적합한 도구는?',
    options: [
      '각 서비스가 다음 서비스를 직접 호출하도록 코드를 연결한다.',
      'Workflows로 단계, 조건 분기, 재시도·예외 처리를 정의해 서비스를 오케스트레이션한다.',
      'Compute Engine VM에 cron 스크립트를 두고 순서대로 호출한다.',
      'Managed Service for Apache Airflow(구 Cloud Composer)로 초 단위 트랜잭션 처리를 구현한다.',
    ],
    answer: [1],
    explanations: [
      '서비스 간 직접 연결은 흐름이 코드 곳곳에 흩어져 변경·추적이 어렵고, 재시도·보상 로직이 중복된다.',
      'Workflows는 서버리스 오케스트레이션 서비스로, HTTP 기반 서비스 호출 순서와 분기, 재시도, 예외 처리를 선언적으로 정의하고 실행 상태를 추적한다.',
      'VM cron은 서버 관리가 필요하고 요청 단위 처리·상태 추적에 맞지 않는다.',
      'Airflow는 배치 데이터 파이프라인 오케스트레이션에 강점이 있으며, 요청마다 실행되는 트랜잭션 흐름에는 과하고 지연이 크다.',
    ],
    principle:
      '요청 단위 서비스 오케스트레이션은 Workflows, 일정 기반 데이터 파이프라인 오케스트레이션은 Managed Service for Apache Airflow를 쓴다.',
    refs: [
      { title: 'Workflows 개요', url: 'https://docs.cloud.google.com/workflows/docs/overview' },
    ],
  },
  {
    id: 'c03-06',
    chapter: 3,
    domain: 1,
    topic: '하이브리드 DNS',
    question:
      '회사는 Cloud Interconnect로 온프레미스와 VPC를 연결했다. 요구사항은 (1) Google Cloud VM이 온프레미스 도메인(corp.example.com)의 이름을 해석하고, (2) 온프레미스 서버가 Cloud DNS 비공개 영역(gcp.example.com)의 이름을 해석하는 것이다. 어떻게 구성해야 하는가?',
    options: [
      '모든 호스트의 /etc/hosts 파일을 양쪽에서 수동으로 동기화한다.',
      'Cloud DNS에 corp.example.com 전달 영역을 만들어 온프레미스 DNS로 전달하고, 인바운드 서버 정책을 만들어 온프레미스 DNS가 gcp.example.com 질의를 VPC의 인바운드 전달 주소로 보내게 한다.',
      '두 도메인을 모두 공개 DNS 영역으로 만든다.',
      'VPC 피어링으로 온프레미스 DNS 서버와 연결한다.',
    ],
    answer: [1],
    explanations: [
      '수동 hosts 파일 동기화는 확장되지 않고 오류가 잦다.',
      '아웃바운드 방향(클라우드→온프레미스)은 Cloud DNS 전달 영역으로, 인바운드 방향(온프레미스→클라우드)은 인바운드 서버 정책의 전달 주소로 처리하는 것이 하이브리드 DNS의 표준 구성이다.',
      '내부 이름을 공개 DNS에 올리면 내부 구조가 노출되는 보안 문제가 있다.',
      'VPC 피어링은 VPC끼리 연결하는 기능으로 온프레미스 DNS 연결 방법이 아니다.',
    ],
    principle:
      '하이브리드 DNS: 클라우드→온프레미스는 전달 영역, 온프레미스→클라우드는 인바운드 서버 정책. 권한 있는 이름 공간은 한쪽에만 둔다.',
    refs: [
      { title: 'DNS 서버 정책', url: 'https://docs.cloud.google.com/dns/docs/server-policies-overview' },
      { title: 'Cloud DNS 권장사항', url: 'https://docs.cloud.google.com/dns/docs/best-practices' },
    ],
  },
  {
    id: 'c03-07',
    chapter: 3,
    domain: 1,
    topic: '내부 부하 분산기 선택',
    question:
      '게임 회사의 매치메이킹 서버는 VPC 내부에서만 접근되며, UDP 기반 프로토콜을 사용하고, 백엔드는 클라이언트의 원래 IP 주소를 봐야 한다. 백엔드는 한 리전의 MIG로 운영된다. 어떤 부하 분산기를 선택해야 하는가?',
    options: [
      '내부 애플리케이션 부하 분산기',
      '내부 패스스루 네트워크 부하 분산기',
      '전역 외부 애플리케이션 부하 분산기',
      '외부 프록시 네트워크 부하 분산기',
    ],
    answer: [1],
    explanations: [
      '내부 애플리케이션 부하 분산기는 HTTP(S) 기반 프록시로 UDP를 처리하지 않고, 프록시이므로 백엔드가 보는 소스 IP가 바뀐다.',
      '내부 패스스루 네트워크 부하 분산기는 TCP·UDP 트래픽을 프록시 없이 백엔드로 전달해 클라이언트 원래 IP를 유지하며, VPC 내부 전용이다.',
      '외부 부하 분산기는 인터넷 노출용이며 HTTP(S)만 처리한다.',
      '프록시 네트워크 부하 분산기는 외부용 TCP 프록시로 UDP와 소스 IP 보존 요구에 맞지 않는다.',
    ],
    principle:
      '부하 분산기 선택 기준: 외부/내부, HTTP(S)/TCP·UDP, 프록시/패스스루(클라이언트 IP 보존), 전역/리전.',
    refs: [
      { title: '부하 분산기 선택', url: 'https://docs.cloud.google.com/load-balancing/docs/choosing-load-balancer' },
      { title: '내부 패스스루 네트워크 부하 분산기', url: 'https://docs.cloud.google.com/load-balancing/docs/internal' },
    ],
  },
  {
    id: 'c03-08',
    chapter: 3,
    domain: 1,
    topic: 'GKE 멀티 클러스터 인그레스',
    question:
      '글로벌 SaaS가 us-central1과 europe-west1에 GKE 클러스터를 하나씩 운영한다. 사용자는 단일 도메인으로 접속해 가까운 클러스터로 라우팅되어야 하고, 한 클러스터가 비정상이면 다른 클러스터로 자동 전환되어야 한다. Kubernetes 방식으로 선언적으로 관리하고 싶다. 가장 적합한 방법은?',
    options: [
      '각 클러스터에 LoadBalancer 유형 Service를 만들고 DNS에 두 IP를 등록한다.',
      '두 클러스터를 플릿에 등록하고 멀티 클러스터 게이트웨이(Gateway API)로 전역 외부 애플리케이션 부하 분산기를 구성한다.',
      '한 클러스터에서 다른 클러스터로 VPN을 연결해 트래픽을 프록시한다.',
      '두 클러스터를 하나의 대형 영역 클러스터로 합친다.',
    ],
    answer: [1],
    explanations: [
      'DNS 두 IP 방식은 상태 기반 자동 전환과 근접 라우팅을 보장하지 못한다.',
      '멀티 클러스터 게이트웨이는 여러 클러스터의 서비스를 하나의 전역 부하 분산기 백엔드로 묶어, 단일 애니캐스트 IP로 가까운 정상 클러스터에 라우팅하고 장애 시 자동 전환한다. Gateway API로 선언적으로 관리한다.',
      'VPN 프록시는 지연과 단일 장애 지점을 만든다.',
      '단일 영역 클러스터는 리전·영역 장애에 취약하고 근접 라우팅이 불가능하다.',
    ],
    principle:
      '여러 리전의 GKE 클러스터를 하나의 전역 진입점으로 묶으려면 플릿 + 멀티 클러스터 게이트웨이(또는 멀티 클러스터 인그레스)를 사용한다.',
    refs: [
      { title: '멀티 클러스터 게이트웨이', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/multi-cluster-gateways' },
    ],
  },
  {
    id: 'c03-09',
    chapter: 3,
    domain: 1,
    topic: '모놀리스 분해(스트랭글러 패턴)',
    question:
      '10년 된 모놀리식 전자상거래 애플리케이션을 마이크로서비스로 전환하려 한다. 비즈니스는 전환 중에도 기능 출시를 멈출 수 없고, 한 번에 전면 교체(빅뱅)하는 위험은 감수할 수 없다. 가장 적절한 전환 전략은?',
    options: [
      '새 시스템을 별도로 모두 개발한 뒤 하루 만에 전환한다.',
      '앞단에 라우팅 계층을 두고 기능 단위로 새 서비스를 만들어 해당 경로의 트래픽을 점진적으로 옮기며 모놀리스 기능을 하나씩 걷어낸다(스트랭글러 패턴).',
      '모놀리스를 그대로 여러 VM에 복제해 마이크로서비스라고 부른다.',
      '데이터베이스부터 서비스별로 쪼갠 뒤 애플리케이션을 나중에 고친다.',
    ],
    answer: [1],
    explanations: [
      '빅뱅 전환은 위험이 가장 크고, 개발 기간 동안 두 시스템을 따로 유지해야 한다.',
      '스트랭글러 패턴은 기존 시스템을 유지하면서 경계가 명확한 기능부터 새 서비스로 옮기고, 라우팅으로 점진 전환한다. 전환 중에도 가치를 계속 제공하고 위험을 작게 나눈다.',
      '복제는 확장일 뿐 아키텍처 분해가 아니다.',
      '애플리케이션 경계를 정하기 전에 데이터를 먼저 쪼개면 일관성 문제와 대규모 장애 위험이 크다.',
    ],
    principle:
      '레거시 현대화는 빅뱅보다 점진적 전환(스트랭글러 패턴)으로 위험을 나누고 지속적으로 가치를 제공한다.',
    refs: [
      { title: '마이크로서비스 아키텍처란?', url: 'https://cloud.google.com/learn/what-is-microservices-architecture' },
    ],
  },
  {
    id: 'c03-10',
    chapter: 3,
    domain: 1,
    topic: '변경 데이터 캡처(CDC)',
    question:
      '운영 PostgreSQL DB(Cloud SQL)의 주문 데이터를 BigQuery에서 거의 실시간으로 분석하려 한다. 현재는 매일 밤 전체 테이블을 덤프해 적재하므로 데이터가 하루 늦고 운영 DB에 부하가 크다. 운영 DB 부하를 줄이고 변경분만 지속 반영하려면 어떤 서비스가 가장 적합한가?',
    options: [
      'Datastream으로 변경 데이터 캡처(CDC)를 구성해 BigQuery로 지속 복제한다.',
      '매시간 전체 테이블을 CSV로 내보낸다.',
      '애플리케이션이 BigQuery에도 동시에 쓰도록 코드를 수정한다.',
      'Storage Transfer Service로 DB 파일을 복사한다.',
    ],
    answer: [0],
    explanations: [
      'Datastream은 데이터베이스 로그 기반으로 변경분을 캡처해 BigQuery 등으로 서버리스 방식으로 지속 복제한다. 전체 덤프가 필요 없어 운영 DB 부하가 적고 지연도 짧다.',
      '매시간 전체 내보내기는 부하가 더 커지고 여전히 실시간이 아니다.',
      '이중 쓰기는 애플리케이션 복잡도와 불일치 위험을 높인다.',
      'DB 파일 복사는 일관된 분석 데이터를 만들지 못하며 변경 캡처와 무관하다.',
    ],
    principle:
      '운영 DB → 분석 시스템의 저지연·저부하 동기화는 로그 기반 CDC(Datastream)를 사용한다.',
    refs: [
      { title: 'Datastream 개요', url: 'https://docs.cloud.google.com/datastream/docs/overview' },
    ],
  },
  {
    id: 'c03-11',
    chapter: 3,
    domain: 1,
    topic: '커스텀 머신 유형',
    question:
      '분석 소프트웨어가 vCPU 수 기준으로 라이선스 비용을 받는다. 워크로드는 vCPU 6개와 메모리 80GB가 필요한데, 사전 정의된 머신 유형 중 메모리 80GB 이상을 주는 것은 vCPU가 훨씬 많아 라이선스 비용이 크게 늘어난다. 어떻게 해야 하는가?',
    options: [
      '메모리가 충분한 가장 가까운 사전 정의 머신 유형을 사용한다.',
      '필요한 vCPU와 메모리를 지정한 커스텀 머신 유형(필요하면 확장 메모리 포함)을 사용한다.',
      'vCPU 2개짜리 VM 세 대로 나누어 실행한다.',
      'Spot VM을 사용해 라이선스 비용을 상쇄한다.',
    ],
    answer: [1],
    explanations: [
      '사전 정의 유형은 vCPU가 과도해 vCPU 기준 라이선스 비용이 불필요하게 늘어난다.',
      '커스텀 머신 유형은 vCPU와 메모리를 워크로드에 맞게 지정할 수 있고, vCPU당 메모리 한도를 넘는 경우 확장 메모리 옵션을 쓸 수 있어 라이선스 비용과 자원 낭비를 함께 줄인다.',
      '소프트웨어가 분산 실행을 지원한다는 근거가 없고, 인스턴스별 라이선스 문제도 생길 수 있다.',
      'Spot VM은 라이선스 비용을 줄이지 못하며 선점 위험이 있다.',
    ],
    principle:
      '표준 비율에 맞지 않는 자원 요구(특히 vCPU 기준 라이선스)는 커스텀 머신 유형으로 맞춘다.',
    refs: [
      { title: '커스텀 머신 유형 VM 만들기', url: 'https://docs.cloud.google.com/compute/docs/instances/creating-instance-with-custom-machine-type' },
    ],
  },
  {
    id: 'c03-12',
    chapter: 3,
    domain: 1,
    topic: '지속 가능성(리전 선택)',
    question:
      '기업의 ESG 목표에 따라 클라우드 탄소 배출을 줄여야 한다. 매일 밤 실행되는 대규모 배치 분석은 지연 시간 제약이 없고, 데이터 위치에 관한 규제도 없다. 아키텍처 관점에서 가장 효과적인 조치는?',
    options: [
      '배치 작업을 가장 가까운 리전에서 실행한다.',
      '탄소 무배출 에너지(CFE) 비율이 높은 리전을 선택해 배치 작업과 데이터를 배치하고, 유휴 자원을 줄인다.',
      '배치 작업을 온프레미스로 되돌린다.',
      '모든 VM을 가장 큰 머신 유형으로 바꿔 작업 시간을 줄인다.',
    ],
    answer: [1],
    explanations: [
      '지연 제약이 없는 작업에서 가까운 리전 선택은 탄소 목표와 무관하다.',
      'Google은 리전별 탄소 무배출 에너지 비율 정보를 제공한다. 위치 제약이 없는 작업을 CFE 비율이 높은 리전에서 실행하고 유휴 자원을 줄이면 배출량을 효과적으로 낮출 수 있다.',
      '온프레미스 복귀는 일반적으로 효율이 낮아지고 근거가 없다.',
      '과도하게 큰 머신은 자원 낭비로 이어질 수 있어 지속 가능성 목표와 맞지 않는다.',
    ],
    principle:
      '지속 가능성 최적화: 위치 유연한 워크로드는 저탄소 리전으로, 자원은 적정 규모로, 유휴 자원은 제거한다.',
    refs: [
      { title: 'Google Cloud 리전의 탄소 무배출 에너지', url: 'https://cloud.google.com/sustainability/region-carbon' },
      { title: 'Well-Architected Framework: 지속 가능성', url: 'https://docs.cloud.google.com/architecture/framework/sustainability' },
    ],
  },
  {
    id: 'c03-13',
    chapter: 3,
    domain: 1,
    topic: '대규모 모델 학습 가속기 선택',
    question:
      'AI 연구소가 JAX로 작성된 대규모 트랜스포머 모델을 수주간 학습한다. 행렬 연산이 대부분이고, 수백 개 가속기로 확장해야 하며, 학습 비용 대비 처리량을 최대화하고 싶다. 특수한 CUDA 커스텀 커널은 사용하지 않는다. 어떤 가속기가 가장 적합한가?',
    options: [
      '범용 CPU 머신 수백 대',
      'Cloud TPU 슬라이스',
      '단일 GPU VM 한 대',
      'Memorystore 클러스터',
    ],
    answer: [1],
    explanations: [
      'CPU는 대규모 행렬 연산 학습에서 가속기보다 처리량 대비 비용이 크게 불리하다.',
      'Cloud TPU는 대규모 행렬 연산과 JAX·TensorFlow·PyTorch/XLA 기반 학습에 최적화되어 있고, 고속 상호 연결로 많은 칩까지 확장할 수 있어 대규모 트랜스포머 학습에 적합하다.',
      '단일 GPU로는 수백 개 가속기 규모의 학습을 감당할 수 없다.',
      'Memorystore는 인메모리 캐시로 모델 학습과 무관하다.',
    ],
    principle:
      '대규모 행렬 중심 학습(JAX/XLA)은 TPU가 강점, CUDA 전용 라이브러리·커널 의존이 크면 GPU를 선택한다.',
    refs: [
      { title: 'Cloud TPU 소개', url: 'https://docs.cloud.google.com/tpu/docs/intro-to-tpu' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (9) ─────────
  {
    id: 'c03-14',
    chapter: 3,
    domain: 2,
    topic: '부하 분산기 상태 확인 방화벽',
    question:
      '새로 만든 외부 애플리케이션 부하 분산기의 백엔드 VM들이 모두 “비정상(UNHEALTHY)”으로 표시되어 트래픽이 전달되지 않는다. VM 안에서 curl로 확인하면 애플리케이션은 정상 응답한다. VPC에는 기본 거부 외에 내부 트래픽 허용 규칙만 있다. 가장 가능성 높은 원인과 해결책은?',
    options: [
      '백엔드 VM에 외부 IP가 없기 때문이므로 외부 IP를 부여한다.',
      'Google 상태 확인 프로브의 소스 IP 대역에서 백엔드 포트로 들어오는 트래픽을 허용하는 방화벽 규칙이 없으므로 해당 규칙을 추가한다.',
      'Cloud NAT가 없기 때문이므로 Cloud NAT를 구성한다.',
      '인스턴스 템플릿의 머신 유형이 작기 때문이므로 크기를 늘린다.',
    ],
    answer: [1],
    explanations: [
      '프록시 기반 부하 분산기의 백엔드는 외부 IP가 없어도 된다.',
      '상태 확인 프로브는 Google이 문서로 공개한 전용 IP 대역에서 들어온다. 이 대역을 허용하는 인그레스 규칙이 없으면 모든 백엔드가 비정상으로 판정된다.',
      'Cloud NAT는 아웃바운드 연결용으로 인바운드 상태 확인과 무관하다.',
      '애플리케이션이 VM 안에서 정상 응답하므로 용량 문제가 아니다.',
    ],
    principle:
      '부하 분산기 백엔드가 모두 비정상이면 먼저 상태 확인 프로브 대역에 대한 방화벽 허용 규칙을 확인한다.',
    refs: [
      { title: '상태 확인 개념(프로브 IP 범위)', url: 'https://docs.cloud.google.com/load-balancing/docs/health-check-concepts' },
    ],
  },
  {
    id: 'c03-15',
    chapter: 3,
    domain: 2,
    topic: 'Cloud Storage Autoclass',
    question:
      '데이터 과학 팀의 공유 버킷에는 수백만 개의 객체가 있으며, 어떤 파일이 언제 다시 쓰일지 예측할 수 없다. 오래된 파일도 갑자기 대량으로 다시 읽히는 경우가 있다. 팀은 수명 주기 규칙을 설계·관리하고 싶지 않고, 접근 패턴에 맞춰 스토리지 비용이 자동으로 최적화되길 원한다. 가장 적합한 설정은?',
    options: [
      '모든 객체를 Archive 클래스로 설정한다.',
      '버킷에 Autoclass를 사용 설정한다.',
      '30일 후 Coldline으로 옮기는 수명 주기 규칙을 만든다.',
      '객체 버전 관리를 사용 설정한다.',
    ],
    answer: [1],
    explanations: [
      'Archive는 검색 비용과 최소 보관 기간이 있어, 예측 불가하게 다시 읽히는 데이터에는 비용이 오히려 커질 수 있다.',
      'Autoclass는 객체별 접근 패턴에 따라 스토리지 클래스를 자동으로 전환하고, 다시 접근된 객체는 Standard로 되돌린다. 접근 패턴을 예측하기 어렵고 규칙 관리를 원치 않는 경우에 적합하다.',
      '고정 규칙은 오래된 파일이 대량으로 다시 읽힐 때 검색 비용이 크게 발생할 수 있다.',
      '버전 관리는 비용 최적화 기능이 아니며 저장 비용을 늘릴 수 있다.',
    ],
    principle:
      '접근 패턴이 예측 가능하면 수명 주기 규칙, 예측 불가능하면 Autoclass로 스토리지 클래스를 관리한다.',
    refs: [
      { title: 'Autoclass', url: 'https://docs.cloud.google.com/storage/docs/autoclass' },
    ],
  },
  {
    id: 'c03-16',
    chapter: 3,
    domain: 2,
    topic: 'Cloud SQL 유지보수 창',
    question:
      '온라인 쇼핑몰은 매주 화요일 새벽 3~4시가 트래픽이 가장 적고, 11월 말 블랙프라이데이 기간에는 어떠한 계획된 중단도 없어야 한다. Cloud SQL 인스턴스의 계획된 유지보수로 인한 영향을 최소화하려면 어떻게 설정해야 하는가?',
    options: [
      '유지보수는 자동이므로 설정할 방법이 없다.',
      '유지보수 창을 화요일 03시로 지정하고, 블랙프라이데이 기간을 유지보수 거부 기간으로 설정한다.',
      '매주 인스턴스를 수동으로 재시작해 유지보수를 대신한다.',
      '읽기 복제본을 추가하면 유지보수가 발생하지 않는다.',
    ],
    answer: [1],
    explanations: [
      'Cloud SQL은 유지보수 시점을 제어하는 설정을 제공한다.',
      '유지보수 창으로 선호 요일·시간을 지정하고, 유지보수 거부 기간으로 중요한 사업 기간에 계획된 유지보수를 피할 수 있다.',
      '수동 재시작은 불필요한 중단만 추가할 뿐 Google의 계획된 유지보수를 대체하지 않는다.',
      '읽기 복제본은 읽기 확장·DR용이며 기본 인스턴스의 유지보수를 없애지 않는다.',
    ],
    principle:
      '관리형 서비스도 계획된 유지보수가 있다. 유지보수 창과 거부 기간으로 비즈니스 일정에 맞춘다.',
    refs: [
      { title: 'Cloud SQL 유지보수 개요', url: 'https://docs.cloud.google.com/sql/docs/mysql/maintenance' },
    ],
  },
  {
    id: 'c03-17',
    chapter: 3,
    domain: 2,
    topic: 'GKE 클러스터 자동 확장',
    question:
      'GKE Standard 클러스터의 API 배포에 HPA가 설정되어 있다. 트래픽 급증 시 HPA가 파드 수를 늘렸지만 새 파드 다수가 Pending 상태로 남고, 이벤트에는 “Insufficient cpu”가 표시된다. 가장 적절한 조치는?',
    options: [
      'HPA의 최대 레플리카 수를 줄인다.',
      '해당 노드 풀에 클러스터 자동 확장을 사용 설정하고 적절한 최소·최대 노드 수를 설정한다.',
      '파드의 CPU 요청(request)을 0으로 설정한다.',
      '배포를 삭제하고 다시 만든다.',
    ],
    answer: [1],
    explanations: [
      '최대 레플리카를 줄이면 트래픽을 처리할 파드가 부족해진다.',
      'HPA는 파드 수만 조절하고, 노드 자원이 부족해 스케줄되지 못한 파드는 클러스터 자동 확장이 노드를 추가해야 해소된다. 두 계층의 자동 확장이 함께 동작해야 한다.',
      '요청을 0으로 두면 스케줄러가 자원을 고려하지 못해 노드 과밀과 성능 저하가 생긴다.',
      '재생성은 자원 부족을 해결하지 못한다.',
    ],
    principle:
      'GKE 확장은 두 계층이다: 파드 수(HPA/VPA)와 노드 수(클러스터 자동 확장·노드 자동 프로비저닝). Pending 파드는 노드 계층 문제다.',
    refs: [
      { title: '클러스터 자동 확장 처리', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler' },
    ],
  },
  {
    id: 'c03-18',
    chapter: 3,
    domain: 2,
    topic: 'GKE 리전 클러스터',
    question:
      '영역(zonal) GKE Standard 클러스터에서 운영 중인 서비스가, 해당 영역의 장애 때 Kubernetes API 서버에 접근할 수 없어 배포와 확장이 모두 멈춘 적이 있다. 영역 장애에도 컨트롤 플레인과 워크로드가 계속 동작하게 하려면 어떻게 해야 하는가?',
    options: [
      '노드 수를 두 배로 늘린다.',
      '리전 클러스터로 새로 만들어 컨트롤 플레인과 노드를 리전의 여러 영역에 분산하고 워크로드를 이전한다.',
      '다른 영역에 노드 풀만 추가한다.',
      '클러스터 업그레이드 채널을 변경한다.',
    ],
    answer: [1],
    explanations: [
      '노드 수를 늘려도 영역 클러스터의 컨트롤 플레인은 한 영역에 있어 영역 장애 시 여전히 API 서버가 중단된다.',
      '리전 클러스터는 컨트롤 플레인 복제본과 노드를 여러 영역에 분산해 한 영역이 실패해도 API와 워크로드가 계속 동작한다. 클러스터 유형은 생성 후 바꿀 수 없으므로 새로 만들어 이전해야 한다.',
      '멀티 영역 노드 풀은 워크로드 가용성은 높이지만 영역 클러스터의 컨트롤 플레인은 여전히 단일 영역에 있다.',
      '업그레이드 채널은 버전 관리 설정으로 가용성 구조와 무관하다.',
    ],
    principle:
      '운영 GKE는 리전 클러스터를 기본으로 한다. 영역 클러스터는 컨트롤 플레인이 단일 영역이라는 점을 기억한다.',
    refs: [
      { title: '리전 클러스터', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/regional-clusters' },
    ],
  },
  {
    id: 'c03-19',
    chapter: 3,
    domain: 2,
    topic: '메모리 최적화 머신',
    question:
      '제조사가 수 TB 메모리가 필요한 인메모리 데이터베이스 기반 ERP를 Compute Engine으로 옮긴다. 공급업체는 인증된 인스턴스 유형에서만 운영을 지원한다. 어떤 머신 계열을 우선 검토해야 하는가?',
    options: [
      '범용 E2 머신 계열',
      '메모리 최적화 머신 계열(M 시리즈)',
      '가속기 최적화 머신 계열',
      '공유 코어 머신',
    ],
    answer: [1],
    explanations: [
      'E2는 비용 효율적인 범용 계열로, 수 TB 메모리를 요구하는 인메모리 DB에 필요한 메모리 규모를 제공하지 않는다.',
      '메모리 최적화 계열은 vCPU당 메모리 비율이 매우 높고 대용량 메모리 구성을 제공해 인메모리 DB 같은 워크로드용으로 설계되었다. 공급업체 인증 목록과 대조해 선택한다.',
      '가속기 최적화 계열은 GPU 워크로드용이다.',
      '공유 코어 머신은 소규모·저부하 용도다.',
    ],
    principle:
      '머신 계열은 워크로드 특성으로 고른다: 범용(E2/N/C), 컴퓨팅 최적화, 메모리 최적화(M), 가속기 최적화(A/G). 상용 SW는 인증 목록을 확인한다.',
    refs: [
      { title: '메모리 최적화 머신 계열', url: 'https://docs.cloud.google.com/compute/docs/memory-optimized-machines' },
    ],
  },
  {
    id: 'c03-20',
    chapter: 3,
    domain: 2,
    topic: '서명된 URL',
    question:
      '사진 인화 서비스의 고객은 Google 계정이 없다. 고객이 웹 앱에서 원본 사진(최대 수백 MB)을 비공개 Cloud Storage 버킷에 직접 업로드하게 하되, 업로드는 해당 객체 경로로 15분 동안만 허용하고 싶다. 애플리케이션 서버를 거치지 않아 서버 부하를 줄이고 싶다. 가장 적합한 방법은?',
    options: [
      '버킷을 allUsers 쓰기 가능으로 설정한다.',
      '백엔드가 해당 객체에 대한 쓰기용 서명된 URL을 15분 유효 기간으로 생성해 클라이언트에 전달하고, 클라이언트가 이 URL로 직접 업로드한다.',
      '각 고객에게 Google 계정을 만들게 하고 IAM 권한을 부여한다.',
      '업로드를 애플리케이션 서버로 받은 뒤 서버가 버킷에 복사한다.',
    ],
    answer: [1],
    explanations: [
      '공개 쓰기 권한은 누구나 무엇이든 올릴 수 있어 심각한 보안·비용 위험이다.',
      '서명된 URL은 Google 계정이 없는 사용자에게도 특정 객체·작업·기간으로 제한된 접근을 허용한다. 클라이언트가 버킷에 직접 업로드하므로 서버 부하도 줄어든다.',
      '고객에게 Google 계정을 요구하는 것은 사용자 경험과 관리 측면에서 비현실적이다.',
      '서버 경유 업로드는 서버 부하를 줄이려는 요구에 어긋난다.',
    ],
    principle:
      'Google ID가 없는 사용자에게 제한된 시간·객체·작업 권한을 주려면 서명된 URL(또는 서명된 정책 문서)을 사용한다.',
    refs: [
      { title: '서명된 URL', url: 'https://docs.cloud.google.com/storage/docs/access-control/signed-urls' },
    ],
  },
  {
    id: 'c03-21',
    chapter: 3,
    domain: 2,
    topic: 'ML 특성 관리',
    question:
      '결제 사기 탐지 모델은 학습 시 BigQuery에서 계산한 “최근 1시간 거래 횟수” 같은 특성을 쓰지만, 온라인 예측 시에는 애플리케이션이 별도 코드로 같은 특성을 다시 계산해 값이 미묘하게 달라지는(학습-서빙 불일치) 문제가 있다. 예측은 수십 밀리초 안에 끝나야 한다. 가장 적절한 개선은?',
    options: [
      '예측 요청마다 BigQuery에 직접 쿼리해 특성을 계산한다.',
      'BigQuery를 원천으로 하는 Feature Store(Gemini Enterprise Agent Platform, 구 Vertex AI Feature Store)로 특성을 한곳에서 정의·관리하고, 온라인 서빙으로 저지연 조회한다.',
      '특성 계산 코드를 학습과 서빙에 각각 복사해 둔다.',
      '특성을 사용하지 않는 단순한 모델로 교체한다.',
    ],
    answer: [1],
    explanations: [
      '예측 요청마다 분석용 웨어하우스를 쿼리하면 수십 밀리초 지연 요구를 맞추기 어렵다.',
      'Feature Store는 특성을 한곳에서 관리해 학습과 서빙이 같은 정의와 값을 쓰게 하고, 온라인 서빙으로 저지연 조회를 제공해 학습-서빙 불일치를 줄인다.',
      '코드를 복사하면 불일치 문제의 원인을 그대로 둔다.',
      '특성을 버리면 모델 품질이 떨어진다. 문제는 특성 관리 방식이다.',
    ],
    principle:
      '학습-서빙 불일치는 특성 정의와 값을 공유하는 Feature Store로 줄인다. 오프라인(학습)과 온라인(서빙) 경로를 같은 원천에서 관리한다.',
    refs: [
      { title: 'Feature Store 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/machine-learning/featurestore/latest/overview' },
    ],
  },
  {
    id: 'c03-22',
    chapter: 3,
    domain: 2,
    topic: '사전 학습 AI API 선택(영상)',
    question:
      '사용자 제작 동영상 플랫폼이 업로드 영상에서 성인·폭력 등 부적절한 장면을 자동 탐지해 검토 대기열로 보내려 한다. 또한 영상의 장면 전환 지점과 등장 객체 라벨을 추출해 검색 태그로 쓰고 싶다. 자체 모델 학습 없이 구현하려면 어떤 API가 가장 적합한가?',
    options: [
      'Speech-to-Text API',
      'Video Intelligence API(명시적 콘텐츠 감지, 샷 변경 감지, 라벨 감지)',
      'Translation API',
      'Document AI',
    ],
    answer: [1],
    explanations: [
      'Speech-to-Text는 오디오를 텍스트로 바꿀 뿐 장면의 시각적 내용을 분석하지 않는다.',
      'Video Intelligence API는 영상의 명시적(부적절) 콘텐츠 감지, 샷 변경 감지, 객체·장면 라벨 감지를 사전 학습 모델로 제공한다.',
      'Translation API는 텍스트 번역용이다.',
      'Document AI는 문서 이해용이다.',
    ],
    principle:
      '영상의 시각 정보(장면·라벨·유해 콘텐츠)는 Video Intelligence API, 정지 이미지는 Vision API로 분석한다. 더 복잡한 이해·요약은 Gemini 멀티모달 모델을 검토한다.',
    refs: [
      { title: 'Video Intelligence: 명시적 콘텐츠 감지', url: 'https://docs.cloud.google.com/video-intelligence/docs/analyze-safesearch' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (8) ─────────
  {
    id: 'c03-23',
    chapter: 3,
    domain: 3,
    topic: '컨피덴셜 컴퓨팅',
    question:
      '의료 연구 컨소시엄이 여러 병원의 환자 데이터를 VM에서 공동 분석한다. 저장·전송 중 암호화는 이미 적용되어 있지만, 병원들은 처리 중(메모리 내) 데이터도 하드웨어 수준에서 암호화되어 클라우드 운영자나 다른 테넌트가 접근할 수 없다는 보장을 요구한다. 애플리케이션 코드 변경은 최소화해야 한다. 가장 적합한 방법은?',
    options: [
      '모든 디스크에 CMEK를 적용한다.',
      '분석 VM을 Confidential VM으로 실행한다.',
      'VPC 서비스 제어 경계를 구성한다.',
      '데이터를 애플리케이션 수준에서 이중 암호화해 저장한다.',
    ],
    answer: [1],
    explanations: [
      'CMEK는 저장 데이터의 키 통제로, 처리 중 메모리 데이터는 보호하지 않는다.',
      'Confidential VM은 하드웨어 기반 메모리 암호화로 사용 중인 데이터를 보호하며, 대부분 기존 애플리케이션을 코드 변경 없이 실행할 수 있다.',
      'VPC 서비스 제어는 API 수준의 데이터 유출 방지로 메모리 보호와 무관하다.',
      '저장 시 이중 암호화도 처리 시점에는 복호화되어 메모리에 평문으로 존재한다.',
    ],
    principle:
      '데이터 보호는 세 상태로 나눈다: 저장(디스크·CMEK), 전송(TLS), 사용 중(컨피덴셜 컴퓨팅).',
    refs: [
      { title: 'Confidential VM 개요', url: 'https://docs.cloud.google.com/confidential-computing/confidential-vm/docs/confidential-vm-overview' },
    ],
  },
  {
    id: 'c03-24',
    chapter: 3,
    domain: 3,
    topic: '외부 키 관리(Cloud EKM)',
    question:
      '유럽 은행의 규제 해석상, 클라우드에 저장된 고객 데이터의 암호화 키는 클라우드 공급자 인프라 밖에서 은행이 직접 운영하는 키 관리 시스템에 보관되어야 하고, 은행이 키 접근을 거부하면 클라우드에서도 데이터를 복호화할 수 없어야 한다. 어떤 방식이 적합한가?',
    options: [
      'Google 기본 암호화에 의존한다.',
      'Cloud KMS 소프트웨어 키로 CMEK를 적용한다.',
      'Cloud External Key Manager(Cloud EKM)로 외부 키 관리자에 있는 키를 CMEK로 사용한다.',
      'Cloud HSM 키를 사용한다.',
    ],
    answer: [2],
    explanations: [
      '기본 암호화 키는 Google이 관리하므로 키를 외부에 둔다는 요구를 충족하지 못한다.',
      'Cloud KMS 소프트웨어 키는 Google 인프라 안에 보관된다.',
      'Cloud EKM은 지원되는 외부 키 관리 파트너 시스템에 있는 키를 사용해 데이터를 보호하며, 키는 Google 밖에 남는다. 외부에서 키 접근을 거부하면 해당 키로 보호된 데이터에 접근할 수 없다.',
      'Cloud HSM은 하드웨어 보안 모듈이지만 Google이 운영하는 인프라 안에 있다.',
    ],
    principle:
      '키 통제 수준: 기본 암호화 < Cloud KMS(소프트웨어) < Cloud HSM(하드웨어, Google 내) < Cloud EKM(키가 Google 외부).',
    refs: [
      { title: 'Cloud External Key Manager', url: 'https://docs.cloud.google.com/kms/docs/ekm' },
    ],
  },
  {
    id: 'c03-25',
    chapter: 3,
    domain: 3,
    topic: 'Access Transparency와 Access Approval',
    question:
      '보험사 감사팀은 Google 직원이 지원·운영 목적으로 회사 데이터에 접근하는 경우 (1) 그 기록을 확인하고, (2) 가능한 경우 접근 전에 회사가 명시적으로 승인하길 원한다. 어떤 기능 조합이 적합한가?',
    options: [
      'Cloud 감사 로그의 관리 활동 로그만 확인한다.',
      'Access Transparency로 Google 직원의 접근 기록을 받고, Access Approval로 지원되는 서비스에 대한 접근을 사전 승인하게 한다.',
      'VPC 흐름 로그를 분석한다.',
      'IAM 거부 정책으로 Google 직원을 차단한다.',
    ],
    answer: [1],
    explanations: [
      '관리 활동 로그는 고객 측 주 구성원의 관리 작업을 기록하며 Google 직원의 접근 기록이 아니다.',
      'Access Transparency는 Google 직원이 고객 콘텐츠에 접근한 경우 이유와 함께 로그를 제공하고, Access Approval은 지원되는 서비스에서 그런 접근 전에 고객 승인을 요구한다.',
      '흐름 로그는 네트워크 메타데이터로 사람의 데이터 접근을 보여 주지 않는다.',
      'Google 운영자의 내부 접근은 고객 IAM 정책으로 관리되는 대상이 아니다.',
    ],
    principle:
      '클라우드 공급자 측 접근의 가시성은 Access Transparency, 사전 통제는 Access Approval로 확보한다.',
    refs: [
      { title: 'Access Transparency 개요', url: 'https://docs.cloud.google.com/assured-workloads/access-transparency/docs/overview' },
      { title: 'Access Approval 개요', url: 'https://docs.cloud.google.com/assured-workloads/access-approval/docs/overview' },
    ],
  },
  {
    id: 'c03-26',
    chapter: 3,
    domain: 3,
    topic: 'Chrome Enterprise Premium(제로 트러스트)',
    question:
      '글로벌 컨설팅 회사가 VPN을 없애고, 직원이 사내 웹 앱(Google Cloud와 온프레미스에 분산)과 업무용 SaaS에 접근할 때 사용자 신원·기기 보안 상태·위치 같은 맥락으로 접근을 통제하려 한다. 또한 브라우저에서의 민감 데이터 다운로드·복사 같은 행위도 통제하고 싶다. 가장 적합한 솔루션은?',
    options: [
      '모든 앱 앞에 Cloud VPN 게이트웨이를 둔다.',
      'Chrome Enterprise Premium으로 컨텍스트 인식 액세스와 브라우저 기반 위협·데이터 보호를 적용한다.',
      '사무실 공인 IP만 허용하는 방화벽 규칙을 만든다.',
      '각 앱에 개별 비밀번호를 설정한다.',
    ],
    answer: [1],
    explanations: [
      'VPN은 네트워크 수준 접근을 넓게 허용하며, 앱별 맥락 기반 통제와 브라우저 데이터 보호를 제공하지 않는다. VPN을 없애려는 목표와도 반대다.',
      'Chrome Enterprise Premium은 BeyondCorp 제로 트러스트 모델을 기반으로 사용자·기기 맥락에 따른 앱 접근 통제와, Chrome 브라우저에서의 위협 방어·데이터 유출 방지 기능을 제공한다.',
      'IP 기반 통제는 원격 근무 환경과 제로 트러스트 원칙에 맞지 않는다.',
      '개별 비밀번호는 보안을 약화시키고 맥락 기반 통제가 불가능하다.',
    ],
    principle:
      '제로 트러스트는 네트워크 위치가 아니라 요청마다 사용자·기기·맥락을 검증한다. Google Cloud 앱은 IAP, 조직 전반·브라우저 보호까지는 Chrome Enterprise Premium을 쓴다.',
    refs: [
      { title: 'Chrome Enterprise Premium 개요', url: 'https://docs.cloud.google.com/chrome-enterprise-premium/docs/overview' },
    ],
  },
  {
    id: 'c03-27',
    chapter: 3,
    domain: 3,
    topic: '조직 정책 기반 보안 가드레일',
    question:
      '보안 점검에서 (1) 개발자들이 서비스 계정 키를 자주 생성해 외부에 보관하고, (2) 일부 Cloud SQL 인스턴스가 공인 IP로 노출된 사실이 드러났다. 조직 전체에서 이러한 구성을 예방적으로 막으려면 어떤 조직 정책 제약을 적용해야 하는가? (2개 선택)',
    options: [
      '서비스 계정 키 생성 사용 중지 제약(iam.disableServiceAccountKeyCreation)',
      'Cloud SQL 인스턴스의 공인 IP 제한 제약(sql.restrictPublicIp)',
      '리소스 위치 제한 제약(gcp.resourceLocations)',
      '균일한 버킷 수준 액세스 적용 제약',
      'OS 로그인 필수 제약',
    ],
    answer: [0, 1],
    explanations: [
      '이 제약은 서비스 계정 키 생성을 막아 장기 자격 증명 유출 위험을 원천적으로 줄인다. 필요한 경우 Workload Identity Federation이나 가장을 사용하게 유도한다.',
      '이 제약은 Cloud SQL 인스턴스에 공인 IP를 구성하는 것을 막아 사설 IP만 사용하게 한다.',
      '리소스 위치 제한은 데이터 상주를 위한 것으로 이번 두 문제와 관련이 없다.',
      '균일한 버킷 수준 액세스는 Cloud Storage ACL 관리 방식에 관한 것이다.',
      'OS 로그인 필수는 VM SSH 접근 관리에 관한 것이다.',
    ],
    principle:
      '반복되는 위험 구성은 조직 정책 제약으로 “할 수 없게” 만든다. 사후 탐지(SCC)와 사전 예방(조직 정책)을 함께 쓴다.',
    refs: [
      { title: '조직 정책 제약 목록', url: 'https://docs.cloud.google.com/organization-policy/reference/org-policy-constraints' },
      { title: '서비스 계정 키 관리 권장사항', url: 'https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys' },
    ],
  },
  {
    id: 'c03-28',
    chapter: 3,
    domain: 3,
    topic: '커스텀 IAM 역할',
    question:
      '고객 지원 도구가 Compute Engine VM의 목록과 상태를 조회하고 VM을 재시작(reset)만 할 수 있어야 한다. 검토한 사전 정의 역할은 모두 VM 삭제나 디스크 변경 같은 불필요한 권한까지 포함한다. 최소 권한을 지키려면 어떻게 해야 하는가?',
    options: [
      '가장 가까운 사전 정의 역할인 Compute 인스턴스 관리자 역할을 부여한다.',
      '필요한 권한(인스턴스 조회·목록·reset)만 포함한 커스텀 역할을 만들어 지원 도구의 서비스 계정에 부여한다.',
      '프로젝트 편집자 역할을 부여한다.',
      '지원 도구가 사용자 계정 비밀번호로 로그인하게 한다.',
    ],
    answer: [1],
    explanations: [
      '관리자 역할에는 삭제 등 불필요한 권한이 포함되어 최소 권한 원칙을 위반한다.',
      '사전 정의 역할이 너무 넓을 때는 필요한 권한만 담은 커스텀 역할을 만든다. 다만 커스텀 역할은 새 권한 추가 시 자동 갱신되지 않으므로 유지 관리가 필요하다.',
      '편집자 역할은 훨씬 더 넓은 권한이다.',
      '사람의 자격 증명을 도구에 쓰면 감사와 통제가 불가능해진다.',
    ],
    principle:
      '역할 선택 순서: 사전 정의 역할로 충분하면 사용 → 너무 넓으면 커스텀 역할 → 기본 역할(소유자·편집자·뷰어)은 피한다.',
    refs: [
      { title: '커스텀 역할 만들기 및 관리', url: 'https://docs.cloud.google.com/iam/docs/creating-custom-roles' },
      { title: 'IAM 역할 유형', url: 'https://docs.cloud.google.com/iam/docs/roles-overview' },
    ],
  },
  {
    id: 'c03-29',
    chapter: 3,
    domain: 3,
    topic: '아동 개인정보 보호',
    question:
      '교육 게임 회사가 13세 미만 아동도 사용하는 앱을 미국에서 출시한다. 법무팀은 아동 개인정보 보호 규정(COPPA) 준수를 요구한다. 아키텍처 설계 관점에서 가장 적절한 원칙은?',
    options: [
      '향후 분석에 쓸 수 있도록 가능한 모든 개인정보를 수집해 영구 보관한다.',
      '서비스에 꼭 필요한 최소한의 개인정보만 수집하고, 보호자 동의 흐름과 보존 기간·삭제 절차를 설계하며, 민감 데이터 식별·접근 통제를 적용한다.',
      'Google Cloud를 사용하면 COPPA가 자동으로 충족되므로 별도 설계가 필요 없다.',
      '아동 데이터를 공개 분석 데이터 세트로 공유해 투명성을 높인다.',
    ],
    answer: [1],
    explanations: [
      '과도한 수집과 영구 보관은 아동 개인정보 보호 원칙(최소 수집·제한된 보존)에 정면으로 어긋난다.',
      '데이터 최소화, 보호자 동의 관리, 보존·삭제 정책, 민감 정보 식별(Sensitive Data Protection)과 접근 통제는 규정 준수를 위해 고객이 설계해야 하는 핵심 요소다.',
      '클라우드 공급자는 규정 준수를 지원할 수 있지만 서비스의 데이터 수집·처리 방식에 대한 책임은 고객에게 있다.',
      '아동 데이터 공개는 명백한 위반이다.',
    ],
    principle:
      '개인정보 규정 준수는 “필요한 만큼만 수집, 목적 기간만 보관, 통제된 접근, 삭제 가능”을 아키텍처에 내장하는 것이다.',
    refs: [
      { title: 'Google Cloud와 COPPA', url: 'https://cloud.google.com/security/compliance/coppa' },
    ],
  },
  {
    id: 'c03-30',
    chapter: 3,
    domain: 3,
    topic: '규정 준수 보고서(SOC 2)',
    question:
      'B2B SaaS 기업이 대형 고객사의 공급업체 보안 심사를 받고 있다. 고객사는 회사가 사용하는 클라우드 인프라 공급자의 SOC 2 보고서를 요구한다. 가장 적절한 대응은?',
    options: [
      '회사가 직접 Google 데이터센터 감사를 수행한다.',
      'Compliance Reports Manager에서 Google Cloud의 SOC 2 보고서를 받아 제공하고, 회사가 책임지는 통제는 별도로 증빙한다.',
      'Google Cloud를 쓰므로 회사도 자동으로 SOC 2 인증을 받은 것이라고 답변한다.',
      '보고서가 없다고 답하고 심사를 거절한다.',
    ],
    answer: [1],
    explanations: [
      '고객이 공급자 데이터센터를 직접 감사하는 것은 현실적이지 않으며, 제3자 감사 보고서가 이를 대신한다.',
      'Google Cloud의 규정 준수 보고서(SOC 2 등)는 Compliance Reports Manager에서 받을 수 있다. 다만 공동 책임 모델에 따라 회사가 운영하는 애플리케이션과 구성에 대한 통제는 회사가 별도로 입증해야 한다.',
      '공급자의 인증이 고객 서비스의 인증을 자동으로 의미하지 않는다.',
      '보고서는 제공 가능하므로 거절할 이유가 없다.',
    ],
    principle:
      '인프라 계층은 공급자 인증 보고서로, 애플리케이션·구성 계층은 고객 통제로 입증한다(공동 책임).',
    refs: [
      { title: 'Compliance Reports Manager', url: 'https://cloud.google.com/security/compliance/compliance-reports-manager' },
      { title: 'SOC 2', url: 'https://cloud.google.com/security/compliance/soc-2' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (8) ─────────
  {
    id: 'c03-31',
    chapter: 3,
    domain: 4,
    topic: '트렁크 기반 개발과 기능 플래그',
    question:
      '개발팀은 기능마다 수주 동안 장기 브랜치를 유지하다가 출시 직전에 병합하는데, 매번 대규모 병합 충돌과 통합 버그가 발생한다. 또한 마케팅 일정에 맞춰 기능 공개 시점을 배포와 별도로 정하고 싶어 한다. 가장 적절한 프로세스 개선은?',
    options: [
      '브랜치 유지 기간을 더 늘려 기능을 완성한 뒤 병합한다.',
      '작은 변경을 자주 메인 브랜치에 병합하는 트렁크 기반 개발을 도입하고, 미완성 기능은 기능 플래그로 숨겨 배포와 공개를 분리한다.',
      '병합 충돌을 해결하는 전담 인력을 둔다.',
      '출시 빈도를 분기 1회로 줄인다.',
    ],
    answer: [1],
    explanations: [
      '브랜치가 오래 살수록 메인과의 차이가 커져 충돌과 통합 위험이 증가한다.',
      '트렁크 기반 개발은 작은 단위의 잦은 통합으로 충돌을 줄이고 CI의 효과를 높인다. 기능 플래그를 쓰면 코드를 배포한 뒤에도 공개 시점을 비즈니스 일정에 맞춰 제어할 수 있다.',
      '전담 인력은 증상 처리일 뿐 원인을 해결하지 못한다.',
      '출시 빈도를 줄이면 변경이 더 커져 위험이 커진다.',
    ],
    principle:
      '“배포(deploy)와 출시(release)를 분리”하라. 잦은 통합(트렁크 기반) + 기능 플래그가 속도와 안정성을 함께 높인다.',
    refs: [
      { title: 'DORA 역량: 트렁크 기반 개발', url: 'https://dora.dev/capabilities/trunk-based-development/' },
    ],
  },
  {
    id: 'c03-32',
    chapter: 3,
    domain: 4,
    topic: '반복 작업(toil) 감소',
    question:
      'SRE 팀은 근무 시간의 70% 이상을 인증서 수동 갱신, 디스크 정리, 반복적인 권한 요청 처리 같은 수작업에 쓰고 있어 신뢰성 개선 프로젝트가 계속 밀린다. 가장 적절한 개선 방향은?',
    options: [
      '팀원을 더 채용해 수작업을 분담한다.',
      '반복 작업을 측정·분류하고 자동화 우선순위를 정해 제거하며, 반복 작업 비율의 상한을 두어 엔지니어링 시간을 확보한다.',
      '수작업을 다른 팀으로 넘긴다.',
      '신뢰성 개선 프로젝트를 취소한다.',
    ],
    answer: [1],
    explanations: [
      '인원 증가는 서비스 규모에 비례해 수작업도 늘어나는 구조를 바꾸지 못한다.',
      'SRE 원칙은 수동·반복적이고 자동화 가능한 작업(toil)을 측정하고 자동화로 줄이며, toil 비율에 상한을 두어 엔지니어링 작업 시간을 보장하는 것이다.',
      '다른 팀으로 넘기면 조직 전체의 toil은 그대로다.',
      '개선 작업을 포기하면 장애와 toil이 계속 늘어난다.',
    ],
    principle:
      'toil은 서비스 성장에 비례해 선형 증가한다. 측정하고, 상한을 두고, 자동화로 없앤다.',
    refs: [
      { title: 'SRE 책: toil 제거', url: 'https://sre.google/sre-book/eliminating-toil/' },
    ],
  },
  {
    id: 'c03-33',
    chapter: 3,
    domain: 4,
    topic: '지출 기반(유연한) 약정',
    question:
      '게임 회사는 Compute Engine 사용량이 한 해 동안 꾸준하지만, 게임 출시에 따라 사용하는 머신 계열과 리전, 프로젝트가 자주 바뀐다. 재무팀은 약정 할인을 원하지만 특정 머신 유형·리전에 묶이는 것을 피하고 싶다. 가장 적합한 구매 방식은?',
    options: [
      '특정 리전·머신 계열에 대한 리소스 기반 약정을 최대치로 구매한다.',
      '결제 계정 수준의 Compute Engine 유연한(지출 기반) 약정을 기준 지출액만큼 구매한다.',
      '약정 없이 모든 VM을 Spot으로 운영한다.',
      '각 프로젝트마다 별도의 리소스 기반 약정을 구매한다.',
    ],
    answer: [1],
    explanations: [
      '리소스 기반 약정은 특정 리전·머신 계열에 적용되므로 사용 패턴이 자주 바뀌면 활용되지 못하는 약정분이 생길 수 있다.',
      '지출 기반(유연한) 약정은 시간당 최소 지출액을 약정하고 결제 계정의 여러 프로젝트와 적격 사용량에 할인을 적용하므로, 머신 계열·리전·프로젝트 변화가 잦은 경우에 적합하다.',
      '게임 서버처럼 중단되면 안 되는 워크로드를 모두 Spot으로 운영하면 선점 위험이 크다.',
      '프로젝트별 리소스 약정은 변동성 문제를 더 악화시킨다.',
    ],
    principle:
      '사용 형태가 고정적이면 리소스 기반 약정(할인 폭 큼), 형태가 자주 바뀌면 지출 기반 유연한 약정(유연성 큼)을 선택한다.',
    refs: [
      { title: '지출 기반 약정 사용 할인', url: 'https://docs.cloud.google.com/docs/cuds-spend-based' },
      { title: 'Compute Engine 약정 사용 할인 개요', url: 'https://docs.cloud.google.com/compute/docs/instances/committed-use-discounts-overview' },
    ],
  },
  {
    id: 'c03-34',
    chapter: 3,
    domain: 4,
    topic: 'BigQuery 용량 기반 가격',
    question:
      '데이터팀의 BigQuery 주문형 비용이 매월 크게 변동해 예산 예측이 어렵다. 쿼리 부하는 업무 시간에 집중되고 대체로 예측 가능하다. 재무팀은 비용 예측 가능성을, 데이터팀은 업무 시간의 성능 보장을 원한다. 가장 적절한 방안은?',
    options: [
      '모든 쿼리를 금지하고 매일 한 번 보고서만 만든다.',
      'BigQuery 에디션의 용량 기반 가격(슬롯 예약과 자동 확장)으로 전환해 기준 용량과 최대 용량을 설정한다.',
      '모든 데이터를 Cloud SQL로 옮긴다.',
      '쿼리마다 LIMIT을 붙이도록 교육한다.',
    ],
    answer: [1],
    explanations: [
      '분석 자체를 제한하는 것은 비즈니스 가치를 해친다.',
      '용량 기반 가격은 스캔 바이트가 아니라 슬롯 용량에 대해 비용을 내므로 비용 예측이 쉬워지고, 기준 용량과 자동 확장 한도로 성능과 비용 상한을 함께 관리할 수 있다.',
      'Cloud SQL은 대규모 분석에 적합하지 않다.',
      'LIMIT은 일반적으로 스캔 바이트를 줄이지 않는다.',
    ],
    principle:
      'BigQuery 비용 모델: 불규칙·소량 = 주문형(스캔량 과금), 대량·예측 가능 = 용량 기반(슬롯 예약·자동 확장).',
    refs: [
      { title: 'BigQuery 에디션 소개', url: 'https://docs.cloud.google.com/bigquery/docs/editions-intro' },
    ],
  },
  {
    id: 'c03-35',
    chapter: 3,
    domain: 4,
    topic: '비즈니스 영향 분석(BIA)',
    question:
      '아키텍트가 20개 업무 시스템의 DR 설계를 맡았다. IT팀은 “모든 시스템을 RTO 5분으로”라고 요구하지만 예산은 제한적이다. RTO·RPO 목표를 합리적으로 정하기 위해 먼저 해야 할 일은?',
    options: [
      '모든 시스템에 가장 높은 수준의 DR을 적용한다.',
      '업무 담당자와 함께 비즈니스 영향 분석을 수행해 시스템별 중단 시 재무·운영·규제 영향을 평가하고, 이에 따라 등급별 RTO·RPO를 정한다.',
      '시스템 크기가 큰 순서대로 DR 우선순위를 정한다.',
      '과거에 장애가 났던 시스템만 DR을 적용한다.',
    ],
    answer: [1],
    explanations: [
      '일괄 최고 수준은 예산을 초과하고, 중요도가 낮은 시스템에 불필요한 비용을 쓰게 한다.',
      '비즈니스 영향 분석은 시스템 중단 시간과 데이터 손실이 비즈니스에 미치는 영향을 정량화해, 시스템 등급별로 적절한 RTO·RPO와 DR 투자를 결정하는 근거가 된다.',
      '시스템 크기는 비즈니스 중요도와 직접 관련이 없다.',
      '과거 장애 이력만으로는 미래의 영향을 평가할 수 없다.',
    ],
    principle:
      'RTO·RPO는 기술팀이 아니라 비즈니스 영향에서 도출한다. 등급화(tiering)로 DR 비용을 중요도에 맞춘다.',
    refs: [
      { title: '재해 복구 계획 가이드', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
    ],
  },
  {
    id: 'c03-36',
    chapter: 3,
    domain: 4,
    topic: '변경 승인 프로세스 간소화',
    question:
      '은행의 모든 운영 변경은 주 1회 변경 자문 위원회(CAB) 회의에서 승인받아야 해서, 작은 설정 변경도 최대 일주일을 기다린다. 감사팀은 변경 추적과 승인 증적은 유지되어야 한다고 한다. 속도와 통제를 함께 확보하는 가장 적절한 방법은?',
    options: [
      'CAB를 폐지하고 모든 변경을 자유롭게 배포하게 한다.',
      '코드 리뷰(동료 승인), 자동화된 테스트·정책 검사, 배포 파이프라인 기록을 승인 증적으로 삼아 저위험 변경은 자동 승인하고, 고위험 변경만 추가 검토한다.',
      'CAB 회의를 월 1회로 줄여 더 많은 변경을 한 번에 검토한다.',
      '변경 요청서를 더 자세히 쓰게 한다.',
    ],
    answer: [1],
    explanations: [
      '통제를 없애면 감사 요구를 충족하지 못한다.',
      '파이프라인 안에 동료 리뷰·자동 검사·배포 기록을 내장하면 변경마다 추적 가능한 승인 증적이 남는다. 위험도 기반으로 검토 수준을 차등화하면 속도와 통제를 함께 확보한다.',
      '검토 주기를 늘리면 변경이 커지고 대기 시간이 더 길어진다.',
      '문서 분량 증가는 속도를 늦출 뿐 위험을 줄이지 못한다.',
    ],
    principle:
      '외부 위원회 승인보다 파이프라인에 내장된 경량 승인(동료 리뷰 + 자동화 검사)이 속도와 안정성 모두에 유리하다.',
    refs: [
      { title: 'DORA 역량: 변경 승인 간소화', url: 'https://dora.dev/capabilities/streamlining-change-approval/' },
    ],
  },
  {
    id: 'c03-37',
    chapter: 3,
    domain: 4,
    topic: 'SLA와 SLO의 관계',
    question:
      'SaaS 회사가 고객 계약서에 월 가용성 99.9% SLA를 명시하고, 미달 시 서비스 크레딧을 제공하기로 했다. 엔지니어링팀이 내부 운영 목표(SLO)를 정할 때 가장 적절한 방법은?',
    options: [
      '내부 SLO도 정확히 99.9%로 맞춘다.',
      '내부 SLO를 SLA보다 엄격하게(예: 더 높은 목표) 설정해, SLA 위반 전에 문제를 감지하고 대응할 여유를 둔다.',
      '내부 SLO를 100%로 설정한다.',
      'SLA가 있으므로 별도의 SLO는 필요 없다.',
    ],
    answer: [1],
    explanations: [
      'SLO를 SLA와 같게 두면 내부 목표를 놓치는 순간 이미 계약 위반이어서 대응 여유가 없다.',
      '내부 SLO를 SLA보다 엄격하게 두면 SLO 위반이 조기 경보 역할을 해, 고객 계약 위반과 크레딧 지급 전에 조치할 수 있다.',
      '100%는 비현실적이며 변경을 사실상 금지하게 만들어 개발 속도를 없앤다.',
      'SLA는 계약상 결과이고, 운영을 이끄는 내부 목표(SLO)는 별도로 필요하다.',
    ],
    principle:
      'SLA(계약) ≤ SLO(내부 목표) 관계로 설정해 여유 폭을 둔다. SLO는 사용자 경험을 반영하는 SLI로 측정한다.',
    refs: [
      { title: 'SRE 책: 서비스 수준 목표', url: 'https://sre.google/sre-book/service-level-objectives/' },
    ],
  },
  {
    id: 'c03-38',
    chapter: 3,
    domain: 4,
    topic: '네트워크 전송 비용 최적화',
    question:
      '분석 팀의 Spark 작업은 us-central1에서 실행되지만, 입력 데이터(수백 TB)는 europe-west1의 Cloud Storage 버킷에 있다. 청구서에서 리전 간 네트워크 전송 비용이 컴퓨팅 비용보다 커졌다. 가장 효과적인 비용 절감 방법은?',
    options: [
      '작업을 더 큰 머신으로 실행해 시간을 줄인다.',
      '데이터와 컴퓨팅을 같은 리전에 배치한다(데이터 위치 요구가 없다면 한쪽으로 이전).',
      '데이터를 매번 인터넷을 통해 다운로드한다.',
      '버킷 스토리지 클래스를 Archive로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      '머신 크기를 키워도 전송되는 데이터 양은 같아 전송 비용이 줄지 않는다.',
      '같은 리전 안에서 데이터를 읽으면 리전 간 전송 비용이 발생하지 않거나 크게 줄어든다. 데이터 상주 요구가 없다면 컴퓨팅과 데이터를 함께 배치하는 것이 기본 원칙이다.',
      '인터넷 경유는 일반적으로 더 비싸고 느리다.',
      'Archive는 검색 비용이 커서 자주 읽는 분석 데이터에 적합하지 않다.',
    ],
    principle:
      '데이터 중력: 컴퓨팅을 데이터 가까이(같은 리전)에 두어 전송 비용과 지연을 줄인다.',
    refs: [
      { title: 'VPC 네트워크 가격 책정', url: 'https://cloud.google.com/vpc/network-pricing' },
      { title: 'Well-Architected Framework: 비용 최적화', url: 'https://docs.cloud.google.com/architecture/framework/cost-optimization' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (6) ─────────
  {
    id: 'c03-39',
    chapter: 3,
    domain: 5,
    topic: 'Kubernetes 준비 상태 프로브',
    question:
      'GKE에서 Java 서비스를 순차적으로 업데이트할 때마다 몇 분간 502 오류가 급증한다. 새 파드는 시작 후 캐시를 불러오느라 약 40초간 요청을 처리할 수 없는데, 컨테이너가 시작되자마자 트래픽을 받는 것으로 보인다. 가장 적절한 해결책은?',
    options: [
      '레플리카 수를 두 배로 늘린다.',
      '애플리케이션이 실제로 요청을 처리할 수 있을 때만 성공하는 준비 상태 프로브(readiness probe)를 구성한다.',
      '활성 프로브(liveness probe)의 실패 임계값을 1로 낮춘다.',
      '순차적 업데이트 대신 모든 파드를 한 번에 교체한다.',
    ],
    answer: [1],
    explanations: [
      '레플리카를 늘려도 새 파드가 준비 전에 트래픽을 받는 문제는 그대로다.',
      '준비 상태 프로브가 성공할 때까지 파드는 서비스 엔드포인트에 포함되지 않으므로, 초기화 중인 파드로 트래픽이 가지 않는다. 순차적 업데이트도 새 파드가 준비된 뒤 진행된다.',
      '활성 프로브를 민감하게 하면 초기화 중인 파드를 재시작해 상황을 악화시킨다(초기화가 긴 경우 시작 프로브가 적합하다).',
      '한 번에 교체하면 전체 서비스가 동시에 준비되지 않은 상태가 되어 장애가 커진다.',
    ],
    principle:
      '준비 상태 프로브 = 트래픽 받을 준비, 활성 프로브 = 재시작 필요 여부, 시작 프로브 = 느린 시작 보호. 무중단 배포의 전제는 정확한 준비 상태 신호다.',
    refs: [
      { title: 'Kubernetes: 활성·준비·시작 프로브 구성', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/' },
    ],
  },
  {
    id: 'c03-40',
    chapter: 3,
    domain: 5,
    topic: 'API Gateway와 Apigee 선택',
    question:
      '스타트업이 Cloud Run functions로 만든 몇 개의 내부 모바일 백엔드 API에 API 키 검증과 JWT 인증을 적용하고 단일 엔드포인트로 노출하려 한다. 수익화·개발자 포털·고급 분석은 필요 없고, 비용과 관리 부담을 최소화하고 싶다. 가장 적합한 선택은?',
    options: [
      'API Gateway로 OpenAPI 명세 기반 게이트웨이를 만들어 서버리스 백엔드 앞에 둔다.',
      'Apigee 조직을 구성하고 API 제품과 개발자 포털을 설정한다.',
      '각 함수에 인증 코드를 직접 구현한다.',
      '외부 애플리케이션 부하 분산기만 두고 인증은 생략한다.',
    ],
    answer: [0],
    explanations: [
      'API Gateway는 서버리스 백엔드용 완전 관리형 게이트웨이로, OpenAPI 명세로 API 키·JWT 인증과 라우팅을 구성할 수 있어 단순한 요구에 비용·관리 부담이 적다.',
      'Apigee는 수익화·포털·고급 정책이 필요한 대규모 API 프로그램에 적합하며, 이번 요구에는 과하다.',
      '함수마다 인증을 구현하면 중복과 보안 실수 위험이 커진다.',
      '인증 생략은 요구사항 위반이다.',
    ],
    principle:
      '단순한 서버리스 API 보호·노출은 API Gateway, 파트너 생태계·수익화·고급 정책이 필요한 API 관리 프로그램은 Apigee.',
    refs: [
      { title: 'API Gateway 소개', url: 'https://docs.cloud.google.com/api-gateway/docs/about-api-gateway' },
    ],
  },
  {
    id: 'c03-41',
    chapter: 3,
    domain: 5,
    topic: 'gcloud 구성 관리',
    question:
      '컨설턴트가 하루에도 여러 고객사의 프로젝트(각기 다른 계정·기본 리전)를 오가며 gcloud로 작업한다. 명령마다 --project와 --account를 붙이다가 실수로 다른 고객의 프로젝트에 리소스를 만든 적이 있다. 실수를 줄이는 가장 적절한 방법은?',
    options: [
      '매번 gcloud init으로 전체 설정을 다시 한다.',
      '고객별로 명명된 gcloud 구성(configuration)을 만들어 계정·프로젝트·기본 리전을 저장하고, 작업 시 활성 구성을 전환한다.',
      '모든 고객 프로젝트를 하나의 프로젝트로 합친다.',
      '셸 기록을 검색해 이전 명령을 복사해 쓴다.',
    ],
    answer: [1],
    explanations: [
      '매번 재초기화하는 것은 번거롭고 여전히 실수 가능성이 있다.',
      '명명된 구성은 계정·프로젝트·리전 같은 속성 묶음을 저장하고 전환할 수 있게 해 컨텍스트 혼동을 줄인다. 필요하면 환경 변수로 셸별 구성을 고정할 수도 있다.',
      '고객 프로젝트를 합치는 것은 보안·계약상 불가능하다.',
      '이전 명령 복사는 오히려 잘못된 프로젝트를 대상으로 할 위험이 크다.',
    ],
    principle:
      '여러 환경을 오가는 CLI 작업은 명명된 구성으로 컨텍스트를 분리하고, 현재 활성 컨텍스트를 항상 확인한다.',
    refs: [
      { title: 'gcloud CLI 구성 관리', url: 'https://docs.cloud.google.com/sdk/docs/configurations' },
    ],
  },
  {
    id: 'c03-42',
    chapter: 3,
    domain: 5,
    topic: 'Cloud Shell',
    question:
      '운영 엔지니어가 출장 중 보안 정책상 소프트웨어를 설치할 수 없는 공용 노트북만 사용할 수 있다. 장애 대응을 위해 브라우저만으로 gcloud, kubectl, Terraform을 사용하고 간단한 스크립트를 편집해야 한다. 가장 적합한 방법은?',
    options: [
      '노트북에 관리자 권한을 요청해 SDK를 설치한다.',
      'Google Cloud 콘솔에서 Cloud Shell과 Cloud Shell 편집기를 사용한다.',
      '운영 VM에 외부 IP를 부여하고 SSH로 접속한다.',
      '동료에게 명령을 대신 실행해 달라고 요청한다.',
    ],
    answer: [1],
    explanations: [
      '설치가 금지된 환경이라는 제약에 어긋난다.',
      'Cloud Shell은 브라우저에서 인증된 셸 환경을 제공하고 gcloud·kubectl·Terraform 등 주요 도구가 미리 설치되어 있으며, 홈 디렉터리가 세션 간 유지되고 편집기도 제공한다.',
      '운영 VM에 외부 IP를 부여하면 공격 표면이 늘어난다.',
      '대리 실행은 느리고 감사 추적이 흐려진다.',
    ],
    principle:
      '로컬 설치 없이 인증된 관리 도구가 필요하면 Cloud Shell을 쓴다. 개인 작업 공간이며 장기 실행 작업용 서버가 아니라는 점을 기억한다.',
    refs: [
      { title: 'Cloud Shell 작동 방식', url: 'https://docs.cloud.google.com/shell/docs/how-cloud-shell-works' },
    ],
  },
  {
    id: 'c03-43',
    chapter: 3,
    domain: 5,
    topic: '데이터 웨어하우스 마이그레이션',
    question:
      '유통사가 다른 클라우드의 데이터 웨어하우스(수십 TB, 수백 개 테이블)를 BigQuery로 옮기려 한다. 스키마와 데이터를 옮기고, 이전 기간 동안 정기적으로 증분 데이터를 반영하며, 관리형 방식으로 진행하고 싶다. 어떤 도구를 우선 검토해야 하는가?',
    options: [
      '각 테이블을 CSV로 수동 내보내 bq load로 하나씩 적재한다.',
      'BigQuery Data Transfer Service의 데이터 웨어하우스 마이그레이션 기능(지원되는 소스)을 사용하고, 필요하면 BigQuery 마이그레이션 서비스로 SQL 변환을 지원받는다.',
      'Transfer Appliance를 매주 배송한다.',
      'Database Migration Service로 Cloud SQL에 옮긴 뒤 다시 BigQuery로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '수백 개 테이블의 수동 내보내기·적재는 오류가 잦고 증분 반영도 어렵다.',
      'BigQuery Data Transfer Service는 지원되는 데이터 웨어하우스 소스로부터 스키마와 데이터의 관리형 전송과 반복 실행을 제공하며, BigQuery 마이그레이션 서비스는 SQL 번역 등 이전 작업을 돕는다.',
      '클라우드 간 온라인 전송이 가능한 상황에서 주간 장비 배송은 비효율적이다.',
      'Cloud SQL을 거치는 것은 불필요한 단계이며 대규모 분석 데이터에 맞지 않는다.',
    ],
    principle:
      '웨어하우스 이전은 BigQuery 마이그레이션 도구(평가·SQL 번역·데이터 전송)를 활용해 관리형으로 진행한다.',
    refs: [
      { title: 'BigQuery 마이그레이션 소개', url: 'https://docs.cloud.google.com/bigquery/docs/migration-intro' },
      { title: 'BigQuery Data Transfer Service 소개', url: 'https://docs.cloud.google.com/bigquery/docs/dts-introduction' },
    ],
  },
  {
    id: 'c03-44',
    chapter: 3,
    domain: 5,
    topic: 'Infrastructure Manager',
    question:
      '플랫폼 팀은 Terraform을 쓰고 싶지만, Terraform 실행 서버와 상태 파일 저장소를 직접 운영·보호하는 부담을 줄이고 싶다. Google Cloud의 IAM으로 실행 권한을 통제하고 배포 이력도 남기길 원한다. 가장 적합한 방법은?',
    options: [
      '개발자 노트북에서 terraform apply를 실행한다.',
      'Infrastructure Manager로 Terraform 구성을 배포해 Google이 관리하는 실행 환경과 상태 관리를 사용한다.',
      'Terraform을 포기하고 콘솔에서 수동으로 만든다.',
      'VM 한 대에 Terraform을 설치하고 cron으로 apply를 실행한다.',
    ],
    answer: [1],
    explanations: [
      '노트북 실행은 권한·상태 관리·감사가 분산되어 통제가 어렵다.',
      'Infrastructure Manager는 Terraform 구성을 Google Cloud에서 관리형으로 실행하고 상태와 배포 리비전을 관리하며, 실행 권한을 IAM과 서비스 계정으로 통제할 수 있다.',
      '수동 작업은 재현성과 검토 가능성을 잃는다.',
      '자체 실행 서버는 운영 부담을 그대로 남기고 cron 자동 적용은 위험하다.',
    ],
    principle:
      'IaC 실행 환경도 관리형으로 옮길 수 있다(Infrastructure Manager). 사람이 아닌 통제된 서비스 계정이 변경을 적용하게 한다.',
    refs: [
      { title: 'Infrastructure Manager 개요', url: 'https://docs.cloud.google.com/infrastructure-manager/docs/overview' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c03-45',
    chapter: 3,
    domain: 6,
    topic: 'Log Analytics',
    question:
      '보안·운영 팀이 여러 서비스의 로그를 조인하고 집계해 “지난 24시간 동안 5xx 응답이 가장 많은 사용자 에이전트 상위 10개” 같은 분석을 SQL로 하고 싶다. 로그를 별도 파이프라인으로 복제하는 부담은 줄이고 싶다. 가장 적합한 방법은?',
    options: [
      '로그 탐색기에서 결과를 하나씩 눈으로 센다.',
      '로그 버킷에서 Log Analytics를 사용 설정해 SQL로 로그를 쿼리한다(필요하면 BigQuery 연결 데이터 세트로 조인).',
      '로그를 로컬로 내려받아 스크립트로 분석한다.',
      '각 서비스에 분석용 API를 새로 만든다.',
    ],
    answer: [1],
    explanations: [
      '수작업 집계는 대량 로그에서 불가능하고 오류가 많다.',
      'Log Analytics는 로그 버킷의 데이터를 SQL로 쿼리할 수 있게 해 별도 복제 파이프라인 없이 집계·조인 분석을 가능하게 한다. BigQuery의 연결 데이터 세트로 다른 데이터와 결합할 수도 있다.',
      '로컬 분석은 확장되지 않고 데이터 유출 위험도 있다.',
      '분석 API 개발은 목적에 비해 과도하다.',
    ],
    principle:
      '로그의 임시 검색은 로그 탐색기, 집계·조인 분석은 Log Analytics(SQL), 장기 분석 파이프라인은 BigQuery 싱크를 사용한다.',
    refs: [
      { title: 'Log Analytics로 로그 쿼리 및 분석', url: 'https://docs.cloud.google.com/logging/docs/log-analytics' },
    ],
  },
  {
    id: 'c03-46',
    chapter: 3,
    domain: 6,
    topic: '지표 부재 알림',
    question:
      '매시간 실행되는 정산 배치는 완료될 때마다 사용자 정의 지표 “settlement_completed”를 기록한다. 최근 배치가 조용히 실행되지 않았는데 아무 알림도 없었다. 오류 로그도 남지 않았다. 이런 상황을 감지하려면 어떤 알림 조건이 적합한가?',
    options: [
      '오류 로그 개수 임계값 알림',
      '해당 지표가 일정 기간(예: 2시간) 동안 들어오지 않으면 발생하는 지표 부재(metric-absence) 알림',
      'CPU 사용률 임계값 알림',
      '업타임 체크',
    ],
    answer: [1],
    explanations: [
      '실행 자체가 되지 않으면 오류 로그도 생기지 않아 감지할 수 없다.',
      '지표 부재 조건은 기대한 데이터가 일정 기간 들어오지 않을 때 알림을 발생시켜, 조용히 멈춘 배치나 하트비트 누락을 감지한다.',
      'CPU 사용률은 배치 실행 여부를 직접 반영하지 않는다.',
      '업타임 체크는 외부에서 접근 가능한 엔드포인트용이며 배치 작업 실행 여부를 확인하지 못한다.',
    ],
    principle:
      '“무언가가 일어나지 않음”은 부재 알림으로 감지한다. 배치·하트비트에는 성공 신호의 부재를 모니터링한다.',
    refs: [
      { title: '알림 정책 조건 유형', url: 'https://docs.cloud.google.com/monitoring/alerts/types-of-conditions' },
    ],
  },
  {
    id: 'c03-47',
    chapter: 3,
    domain: 6,
    topic: 'SLI 선정',
    question:
      '온라인 뱅킹 웹 서비스의 첫 SLO를 정의하려 한다. 사용자가 불만을 느끼는 주된 경우는 페이지 오류와 느린 응답이다. 서비스는 외부 애플리케이션 부하 분산기 뒤에 있다. 가장 적절한 SLI 조합은?',
    options: [
      'VM의 평균 CPU 사용률과 메모리 사용률',
      '부하 분산기에서 측정한 전체 요청 중 성공(5xx 아님) 요청의 비율, 그리고 지정한 시간 이내에 응답한 요청의 비율',
      '배포 횟수와 코드 커밋 수',
      '데이터베이스 디스크 사용률',
    ],
    answer: [1],
    explanations: [
      '자원 사용률은 사용자 경험과 간접적으로만 연결되는 원인 지표다.',
      '요청 기반 가용성(성공 비율)과 지연 시간(임계값 이내 응답 비율)은 사용자가 체감하는 오류·느림을 직접 측정한다. 부하 분산기에서 측정하면 사용자 관점에 가깝다.',
      '배포·커밋 수는 개발 활동 지표로 사용자 경험과 무관하다.',
      '디스크 사용률은 용량 계획 지표다.',
    ],
    principle:
      'SLI는 사용자 경험을 반영하는 “좋은 이벤트 / 전체 이벤트” 비율로 정의하고, 가능한 사용자 가까이에서 측정한다.',
    refs: [
      { title: 'SRE 워크북: SLO 구현', url: 'https://sre.google/workbook/implementing-slos/' },
    ],
  },
  {
    id: 'c03-48',
    chapter: 3,
    domain: 6,
    topic: '배포 후 자동 검증',
    question:
      '팀은 Cloud Deploy로 GKE에 배포한다. 배포는 성공으로 표시되지만, 가끔 새 버전이 핵심 API 스모크 테스트에 실패하는데도 다음 환경으로 승격되는 문제가 있었다. 배포 직후 자동으로 검증하고 실패하면 승격을 막으려면?',
    options: [
      '승격 전에 담당자가 브라우저로 직접 확인한다.',
      'Cloud Deploy의 배포 확인(verify) 단계를 사용 설정해 배포 후 스모크 테스트 컨테이너를 실행하고, 실패 시 롤아웃을 실패 처리한다.',
      '배포 간격을 하루로 늘린다.',
      '모든 테스트를 운영 환경 배포 후에만 실행한다.',
    ],
    answer: [1],
    explanations: [
      '수동 확인은 누락과 지연이 생기고 확장되지 않는다.',
      '배포 확인 기능은 대상에 배포한 직후 지정한 검증 컨테이너(스모크·통합 테스트)를 실행하고, 실패하면 롤아웃을 실패로 처리해 잘못된 버전의 승격을 막는다.',
      '배포 간격을 늘려도 자동 검증이 없으면 같은 문제가 반복된다.',
      '운영 배포 후에만 테스트하면 결함이 사용자에게 먼저 노출된다.',
    ],
    principle:
      '릴리스 관리에서 “배포 성공”과 “서비스 정상”은 다르다. 배포 직후 자동 검증을 승격 게이트로 사용한다.',
    refs: [
      { title: 'Cloud Deploy 배포 확인', url: 'https://docs.cloud.google.com/deploy/docs/verify-deployment' },
    ],
  },
  {
    id: 'c03-49',
    chapter: 3,
    domain: 6,
    topic: '대규모 이벤트 준비',
    question:
      '이커머스 회사가 평소 트래픽의 15배가 예상되는 연중 최대 할인 행사를 준비한다. 과거 행사에서는 할당량 부족과 특정 영역의 GPU·VM 용량 부족으로 확장이 실패했다. 사전 준비 활동으로 가장 적절한 것은? (2개 선택)',
    options: [
      '예상 최대 부하를 기준으로 서비스 할당량을 검토해 필요한 증가를 미리 요청하고, 중요한 자원은 예약으로 용량을 확보한다.',
      '행사 규모에 맞춰 부하 테스트와 DR 테스트를 미리 수행하고, 지원 패키지에 따라 Customer Care의 이벤트 지원 서비스를 활용한다.',
      '행사 당일 자동 확장 최대값을 무제한으로 설정하면 추가 준비는 필요 없다.',
      '행사 중에는 모니터링을 줄여 비용을 아낀다.',
      '행사 직전에 대규모 아키텍처 변경을 배포한다.',
    ],
    answer: [0, 1],
    explanations: [
      '자동 확장도 할당량과 영역 용량의 제약을 받는다. 할당량 증가를 미리 요청하고 예약으로 용량을 확보해야 확장이 실패하지 않는다.',
      '사전 부하·DR 테스트로 병목과 복구 절차를 검증하고, Enhanced·Premium 지원의 이벤트 지원 서비스를 활용하면 행사 중 문제에 빠르게 대응할 수 있다.',
      '확장 한도를 올려도 할당량·용량이 부족하면 확장되지 않는다.',
      '행사 중에는 오히려 모니터링을 강화해야 한다.',
      '행사 직전 대규모 변경은 위험을 크게 높인다. 변경 동결을 고려한다.',
    ],
    principle:
      '피크 이벤트 준비: 아키텍처 검토 → 용량 계획(할당량·예약) → 부하·DR 테스트 → 지원 체계 준비 → 모니터링 강화 → 사후 분석.',
    refs: [
      { title: '피크 용량 이벤트 준비', url: 'https://docs.cloud.google.com/support/docs/checklists/plan-peak-capacity-event' },
      { title: '할당량 개요', url: 'https://docs.cloud.google.com/docs/quotas/overview' },
    ],
  },
  {
    id: 'c03-50',
    chapter: 3,
    domain: 6,
    topic: '구성 드리프트 관리(Config Sync)',
    question:
      '회사는 GKE 클러스터 30개를 운영한다. 네임스페이스·RBAC·네트워크 정책 같은 공통 구성을 여러 팀이 kubectl로 직접 바꾸다 보니 클러스터마다 설정이 달라지고, 누가 언제 무엇을 바꿨는지 추적이 어렵다. 구성을 일관되게 유지하고 품질 통제를 강화하려면?',
    options: [
      '매주 모든 클러스터 설정을 스프레드시트로 비교한다.',
      '공통 구성을 Git 저장소에 두고 Config Sync로 모든 클러스터에 동기화하며, Policy Controller로 정책 위반 구성을 차단한다.',
      '모든 팀의 kubectl 권한을 제거하고 한 사람만 변경하게 한다.',
      '클러스터를 하나로 합친다.',
    ],
    answer: [1],
    explanations: [
      '수작업 비교는 확장되지 않고 드리프트를 사전에 막지 못한다.',
      'Config Sync는 Git을 단일 진실 공급원으로 삼아 여러 클러스터의 구성을 지속적으로 맞추고 수동 변경으로 생긴 드리프트를 되돌린다. Policy Controller는 정책을 위반하는 리소스 생성을 막아 품질 통제를 강화한다. 변경 이력은 Git에 남는다.',
      '한 사람에게 권한을 몰면 병목과 단일 장애 지점이 생긴다.',
      '클러스터 통합은 격리·가용성 요구를 무시한 과도한 변경이다.',
    ],
    principle:
      '다중 클러스터 구성 관리는 GitOps(Config Sync)로 선언적으로, 정책은 코드로 강제(Policy Controller)한다.',
    refs: [
      { title: 'Config Sync 개요', url: 'https://docs.cloud.google.com/kubernetes-engine/config-sync/docs/overview' },
      { title: 'Policy Controller 개요', url: 'https://docs.cloud.google.com/kubernetes-engine/policy-controller/docs/overview' },
    ],
  },
  // @@END
]
