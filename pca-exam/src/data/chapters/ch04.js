// Chapter 4 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (13) ─────────
  {
    id: 'c04-01',
    chapter: 4,
    domain: 1,
    topic: '이벤트 트리거(Eventarc)',
    question:
      '부동산 플랫폼에서 사용자가 매물 사진을 Cloud Storage 버킷에 업로드하면 썸네일 생성과 이미지 검수를 자동으로 시작해야 한다. 처리 로직은 이미 컨테이너로 만들어 Cloud Run 서비스로 배포되어 있다. 폴링 없이 이벤트 기반으로 연결하고 싶다. 가장 적합한 방법은?',
    options: [
      'Cloud Scheduler로 1분마다 버킷을 나열해 새 객체를 찾는다.',
      'Eventarc 트리거로 버킷의 객체 생성(finalize) 이벤트를 Cloud Run 서비스로 전달한다.',
      '업로드 클라이언트가 업로드 후 Cloud Run을 직접 호출하게 한다.',
      'Compute Engine VM에서 gcloud storage ls를 반복 실행한다.',
    ],
    answer: [1],
    explanations: [
      '주기적 폴링은 지연과 불필요한 비용을 만들고, 대량 객체에서 누락·중복 처리 위험이 있다.',
      'Eventarc는 Cloud Storage 객체 생성 같은 Google Cloud 이벤트를 Cloud Run 등 대상으로 전달하는 관리형 이벤트 라우팅 서비스다. 폴링 없이 이벤트 기반으로 처리가 시작된다.',
      '클라이언트 직접 호출은 업로드 성공과 처리 호출이 분리되어 호출 누락 시 처리가 되지 않으며, 클라이언트에 백엔드 호출 권한을 줘야 한다.',
      'VM 폴링은 운영 부담과 비용이 크고 이벤트 기반 요구와 맞지 않는다.',
    ],
    principle:
      '서비스에서 발생한 이벤트로 처리를 시작해야 하면 폴링 대신 Eventarc(또는 Pub/Sub 알림)로 이벤트 기반 아키텍처를 만든다.',
    refs: [
      { title: 'Eventarc 개요', url: 'https://docs.cloud.google.com/eventarc/docs/overview' },
    ],
  },
  {
    id: 'c04-02',
    chapter: 4,
    domain: 1,
    topic: 'Pub/Sub 메시지 순서 보장',
    question:
      '은행의 계좌 이벤트 처리 시스템은 Pub/Sub로 입금·출금 이벤트를 받는다. 같은 계좌의 이벤트는 반드시 발생 순서대로 처리되어야 하지만, 서로 다른 계좌의 이벤트는 병렬로 처리되어 처리량을 높여야 한다. 어떻게 설계해야 하는가?',
    options: [
      '모든 이벤트를 하나의 구독자 인스턴스만 처리하게 한다.',
      '계좌 ID를 순서 키(ordering key)로 지정해 게시하고, 구독에서 메시지 순서 지정을 사용 설정한다.',
      '이벤트마다 무작위 지연을 넣어 순서가 섞이지 않게 한다.',
      '계좌마다 별도의 Pub/Sub 주제를 만든다.',
    ],
    answer: [1],
    explanations: [
      '단일 소비자는 전체 처리량을 제한해 병렬 처리 요구를 충족하지 못한다.',
      '순서 키를 쓰면 같은 키의 메시지는 게시 순서대로 전달되고, 다른 키의 메시지는 병렬로 처리될 수 있다. 계좌 단위 순서와 전체 처리량을 함께 만족한다.',
      '무작위 지연은 순서를 보장하지 않는다.',
      '계좌 수만큼 주제를 만드는 것은 관리가 불가능한 수준으로 늘어난다.',
    ],
    principle:
      '전체 순서가 아니라 “키 단위 순서”가 필요하면 Pub/Sub 순서 키를 사용한다. 순서가 필요한 범위를 최소화해야 병렬성이 유지된다.',
    refs: [
      { title: 'Pub/Sub 메시지 순서 지정', url: 'https://docs.cloud.google.com/pubsub/docs/ordering' },
    ],
  },
  {
    id: 'c04-03',
    chapter: 4,
    domain: 1,
    topic: 'Cloud Run 작업(Jobs)',
    question:
      '데이터팀이 매일 새벽 컨테이너로 패키징된 정산 스크립트를 실행한다. 스크립트는 HTTP 요청을 받지 않고 30~40분 실행된 뒤 종료되며, 입력 파일을 여러 조각으로 나눠 병렬 처리할 수 있다. 서버 관리 없이 실행한 만큼만 비용을 내고 싶다. 가장 적합한 방법은?',
    options: [
      'Cloud Run 서비스로 배포하고 외부에서 HTTP로 호출한다.',
      'Cloud Run 작업(job)으로 배포해 여러 태스크로 병렬 실행하고, Cloud Scheduler로 일정 실행한다.',
      '상시 실행되는 Compute Engine VM에 cron을 설정한다.',
      'GKE Standard 클러스터를 만들어 CronJob을 실행한다.',
    ],
    answer: [1],
    explanations: [
      'Cloud Run 서비스는 요청을 처리하는 모델이라 장시간 배치 실행과 태스크 병렬화에 적합하지 않다.',
      'Cloud Run 작업은 요청 없이 실행되고 완료 후 종료되는 컨테이너 작업을 위한 기능이다. 태스크 수를 지정해 병렬 처리할 수 있고, 실행 시간만큼만 과금되며 Cloud Scheduler로 일정 실행할 수 있다.',
      '상시 VM은 유휴 비용과 OS 관리 부담이 있다.',
      'GKE 클러스터는 하루 한 번 배치를 위해 운영하기에는 비용과 관리 부담이 크다.',
    ],
    principle:
      '요청을 받는 컨테이너는 Cloud Run 서비스, 끝이 있는 배치 컨테이너는 Cloud Run 작업으로 구분한다.',
    refs: [
      { title: 'Cloud Run 작업 만들기', url: 'https://docs.cloud.google.com/run/docs/create-jobs' },
    ],
  },
  {
    id: 'c04-04',
    chapter: 4,
    domain: 1,
    topic: '대규모 영상 전송(Media CDN)',
    question:
      '스포츠 스트리밍 서비스가 주요 경기 때 전 세계 수백만 명에게 라이브·VOD 영상 세그먼트를 전송한다. 대용량 미디어 전송에 최적화된 캐싱과 높은 캐시 적중률이 중요하며, 원본은 Cloud Storage와 자체 패키저 서버다. 어떤 서비스를 우선 검토해야 하는가?',
    options: [
      'Media CDN',
      'Cloud NAT',
      'Cloud DNS 라우팅 정책만 사용',
      '리전 내부 애플리케이션 부하 분산기',
    ],
    answer: [0],
    explanations: [
      'Media CDN은 대규모 동영상 스트리밍과 대용량 파일 다운로드 같은 미디어 전송을 위해 설계된 CDN으로, Google의 에지 인프라를 활용해 높은 처리량과 캐시 효율을 제공한다.',
      'Cloud NAT는 사설 리소스의 아웃바운드 연결용이다.',
      'DNS만으로는 콘텐츠를 에지에서 캐싱할 수 없다.',
      '내부 부하 분산기는 VPC 내부 트래픽용으로 인터넷 사용자 전송과 무관하다.',
    ],
    principle:
      '일반 웹 콘텐츠·API 가속은 Cloud CDN, 대규모 미디어 스트리밍·대용량 다운로드는 Media CDN을 우선 검토한다.',
    refs: [
      { title: 'Media CDN 개요', url: 'https://docs.cloud.google.com/media-cdn/docs/overview' },
    ],
  },
  {
    id: 'c04-05',
    chapter: 4,
    domain: 1,
    topic: '하이브리드 부하 분산(점진 이전)',
    question:
      '회사가 온프레미스 웹 애플리케이션을 Google Cloud로 점진적으로 옮기고 있다. 이전 기간 동안 같은 도메인의 트래픽을 온프레미스 서버와 클라우드 MIG에 비율을 조정하며 나누고, 결국 클라우드로 100% 전환하려 한다. Interconnect로 사설 연결은 되어 있다. 가장 적합한 방법은?',
    options: [
      'DNS 레코드를 온프레미스와 클라우드 IP로 번갈아 바꾼다.',
      '외부 애플리케이션 부하 분산기에 온프레미스 엔드포인트를 하이브리드 연결 NEG로, 클라우드 MIG를 다른 백엔드로 두고 트래픽 비율을 조정한다.',
      '온프레미스 서버를 모두 끄고 한 번에 전환한다.',
      '온프레미스 부하 분산기가 클라우드 VM으로 트래픽을 프록시하게 한다.',
    ],
    answer: [1],
    explanations: [
      'DNS 전환은 캐시 때문에 비율 제어가 부정확하고 즉시 롤백하기 어렵다.',
      '하이브리드 연결 NEG를 쓰면 Cloud Load Balancing이 온프레미스 엔드포인트까지 백엔드로 다룰 수 있어, 한 부하 분산기에서 온프레미스와 클라우드로 트래픽을 나누고 점진적으로 옮길 수 있다.',
      '한 번에 전환은 위험이 크고 점진 이전 요구에 어긋난다.',
      '온프레미스 프록시는 병목과 단일 장애 지점을 남기고, 클라우드 에지 기능(Cloud Armor·CDN)을 활용하지 못한다.',
    ],
    principle:
      '점진적 마이그레이션에는 하이브리드 NEG로 온프레미스와 클라우드를 같은 부하 분산기 뒤에 두고 트래픽을 옮긴다.',
    refs: [
      { title: '하이브리드 부하 분산 개요', url: 'https://docs.cloud.google.com/load-balancing/docs/negs/hybrid-neg-concepts' },
    ],
  },
  {
    id: 'c04-06',
    chapter: 4,
    domain: 1,
    topic: '네트워크 서비스 계층',
    question:
      '사내 교육 영상 다운로드 서비스는 대부분 같은 대륙의 사용자가 사용하고, 약간의 추가 지연은 허용되지만 인터넷 이그레스 비용을 줄이는 것이 최우선이다. 반면 고객용 결제 서비스는 전 세계 사용자에게 최고의 성능과 전역 부하 분산이 필요하다. 네트워크 계층을 어떻게 선택해야 하는가?',
    options: [
      '두 서비스 모두 Standard 계층을 사용한다.',
      '교육 영상 서비스는 Standard 계층, 결제 서비스는 Premium 계층을 사용한다.',
      '두 서비스 모두 Premium 계층을 사용한다.',
      '교육 영상 서비스는 Premium 계층, 결제 서비스는 Standard 계층을 사용한다.',
    ],
    answer: [1],
    explanations: [
      'Standard 계층은 전역 외부 부하 분산(단일 애니캐스트 IP) 같은 기능을 쓸 수 없어 결제 서비스의 요구를 충족하지 못한다.',
      'Standard 계층은 트래픽이 일반 인터넷 경로로 더 많이 이동하는 대신 비용이 낮아 비용 우선 서비스에 맞고, Premium 계층은 Google 글로벌 네트워크를 활용해 성능과 전역 부하 분산을 제공한다.',
      '교육 영상 서비스까지 Premium을 쓰면 비용 절감 우선순위에 어긋난다.',
      '요구사항과 반대로 배정한 조합이다.',
    ],
    principle:
      'Premium 계층 = 성능·전역 기능, Standard 계층 = 비용 우선·리전 범위. 서비스별로 트레이드오프를 판단한다.',
    refs: [
      { title: '네트워크 서비스 계층 개요', url: 'https://docs.cloud.google.com/network-tiers/docs/overview' },
    ],
  },
  {
    id: 'c04-07',
    chapter: 4,
    domain: 1,
    topic: 'Partner Interconnect 선택',
    question:
      '지방에 본사를 둔 제조사가 Google Cloud와 사설 연결을 원한다. 필요한 대역폭은 1~2Gbps이고, 가까운 곳에 Google 코로케이션 시설이 없으며, 이미 통신사와 전용 회선 계약이 있다. 공용 인터넷을 거치지 않아야 한다. 가장 적합한 선택은?',
    options: [
      'Dedicated Interconnect 10Gbps 회선을 신청한다.',
      '지원되는 서비스 제공업체를 통한 Partner Interconnect를 구성한다.',
      'HA VPN을 구성한다.',
      'Direct Peering을 구성한다.',
    ],
    answer: [1],
    explanations: [
      'Dedicated Interconnect는 코로케이션 시설에서 Google과 직접 물리 연결해야 하고 최소 단위가 10Gbps라 이 상황에 맞지 않는다.',
      'Partner Interconnect는 서비스 제공업체의 네트워크를 통해 Google과 사설 연결하며, 코로케이션 시설이 멀거나 10Gbps 미만의 대역폭이 필요할 때 적합하다.',
      'HA VPN은 공용 인터넷을 거치므로 요구사항에 어긋난다.',
      'Direct Peering은 Google의 공개 서비스로 가는 경로로, VPC 사설 IP 연결을 제공하지 않는다.',
    ],
    principle:
      'Interconnect 선택: 코로케이션 가능 + 10Gbps 이상 = Dedicated, 코로케이션 불가 또는 소규모 대역폭 = Partner, 인터넷 경유 허용 = HA VPN.',
    refs: [
      { title: 'Partner Interconnect 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/partner-overview' },
    ],
  },
  {
    id: 'c04-08',
    chapter: 4,
    domain: 1,
    topic: '마이그레이션 웨이브 계획',
    question:
      '보험사가 서버 600대를 1년 안에 이전하려 한다. 각 애플리케이션이 어떤 서버·DB와 통신하는지 문서가 부정확해, 일부만 옮겼을 때 지연 증가나 장애가 생길 것을 우려한다. 이전 웨이브를 계획하기 위해 먼저 해야 할 일은?',
    options: [
      '서버 이름의 알파벳 순서로 웨이브를 나눈다.',
      'Migration Center로 자산과 성능 데이터를 수집하고, 서로 의존하는 서버를 애플리케이션 그룹으로 묶어 함께 이전하는 웨이브를 설계한다.',
      '가장 중요한 핵심 시스템부터 먼저 이전한다.',
      '모든 서버를 한 번에 이전한다.',
    ],
    answer: [1],
    explanations: [
      '이름 순서는 의존 관계와 무관해, 긴밀히 통신하는 서버가 서로 다른 환경에 흩어질 수 있다.',
      '검색·평가 도구로 자산과 사용률 데이터를 모으고, 함께 동작하는 서버를 그룹으로 묶어 같은 웨이브로 옮기면 하이브리드 기간의 지연·장애 위험을 줄이고 적정 규모와 비용도 추정할 수 있다.',
      '초기 웨이브에 가장 중요한 시스템을 넣으면 경험 부족으로 인한 위험이 가장 크다. 보통 위험이 낮고 대표성 있는 앱으로 시작한다.',
      '일괄 이전은 위험이 너무 크다.',
    ],
    principle:
      '마이그레이션은 “검색·평가 → 의존성 기반 그룹화 → 저위험 파일럿 → 웨이브 확장” 순서로 진행한다.',
    refs: [
      { title: 'Migration Center 검색 및 평가 개요', url: 'https://docs.cloud.google.com/migration-center/docs/discovery-and-assessment-overview' },
      { title: 'Migration Center 그룹 만들기', url: 'https://docs.cloud.google.com/migration-center/docs/create-groups' },
    ],
  },
  {
    id: 'c04-09',
    chapter: 4,
    domain: 1,
    topic: 'VM에서 컨테이너로 현대화',
    question:
      '회사는 Linux VM에서 실행되는 Java 웹 애플리케이션 수십 개를 GKE로 옮기고 싶다. 소스 코드를 재작성할 시간은 없지만, VM 운영(OS 패치·이미지 관리) 부담을 줄이고 Kubernetes 기반 배포 체계로 통일하고 싶다. 가장 적합한 접근은?',
    options: [
      '모든 앱을 Cloud Run functions로 재작성한다.',
      'Migrate to Containers로 VM의 워크로드를 컨테이너 이미지와 배포 아티팩트로 추출해 GKE에 배포한다.',
      'VM을 그대로 Compute Engine으로 리호스트한다.',
      '각 VM 디스크 이미지를 컨테이너 레지스트리에 그대로 업로드한다.',
    ],
    answer: [1],
    explanations: [
      '전면 재작성은 시간이 없다는 제약에 어긋난다.',
      'Migrate to Containers는 VM에서 실행 중인 애플리케이션을 분석해 컨테이너 이미지와 Kubernetes 배포 아티팩트를 생성하므로, 코드 재작성 없이 GKE로 옮기는 리플랫폼을 돕는다.',
      '리호스트는 VM 운영 부담이 그대로 남아 목표와 맞지 않는다.',
      '디스크 이미지를 그대로 올린다고 컨테이너 이미지가 되지 않는다.',
    ],
    principle:
      '코드 변경 없이 VM 워크로드를 컨테이너로 리플랫폼하려면 Migrate to Containers를 검토한다(이전 전에 워크로드 적합성을 먼저 평가).',
    refs: [
      { title: 'Migrate to Containers 개요', url: 'https://docs.cloud.google.com/migrate/containers/docs/getting-started' },
    ],
  },
  {
    id: 'c04-10',
    chapter: 4,
    domain: 1,
    topic: 'Managed Microsoft AD',
    question:
      '회사의 .NET 레거시 애플리케이션들은 Active Directory 도메인 가입과 Kerberos 인증, 그룹 정책을 전제로 동작한다. Google Cloud로 이전하면서 도메인 컨트롤러 VM을 직접 운영(패치·백업·복제 관리)하는 부담은 피하고 싶다. 기존 온프레미스 AD와는 신뢰 관계가 필요하다. 가장 적합한 방법은?',
    options: [
      'Compute Engine에 도메인 컨트롤러 VM을 직접 설치해 운영한다.',
      'Managed Service for Microsoft Active Directory를 배포하고 온프레미스 AD와 트러스트를 구성한다.',
      'Cloud Identity만 사용하고 AD 의존성은 무시한다.',
      '애플리케이션을 모두 Linux로 재작성한다.',
    ],
    answer: [1],
    explanations: [
      '직접 운영은 가능하지만 패치·복제·백업 등 운영 부담을 피하려는 요구와 맞지 않는다.',
      'Managed Microsoft AD는 Google이 관리하는 실제 Microsoft AD 도메인 컨트롤러를 제공해 도메인 가입·Kerberos·그룹 정책을 지원하고, 온프레미스 AD와 트러스트를 구성할 수 있다.',
      'Cloud Identity는 AD 도메인 서비스(Kerberos, 그룹 정책)를 대체하지 않아 앱이 동작하지 않는다.',
      '재작성은 불필요하게 크고 긴 작업이다.',
    ],
    principle:
      'AD 의존 워크로드는 관리형 AD(Managed Microsoft AD)로 옮겨 운영 부담을 줄이고, 기존 포리스트와는 트러스트로 연결한다.',
    refs: [
      { title: 'Managed Service for Microsoft Active Directory 개요', url: 'https://docs.cloud.google.com/managed-microsoft-ad/docs/overview' },
    ],
  },
  {
    id: 'c04-11',
    chapter: 4,
    domain: 1,
    topic: '랜섬웨어 대비 백업',
    question:
      '병원 그룹의 보안팀은 랜섬웨어 공격자가 관리자 계정을 탈취하면 운영 데이터와 함께 백업까지 삭제할 수 있다고 우려한다. Compute Engine VM과 데이터베이스 백업을 정해진 보존 기간 동안 누구도 삭제·변경할 수 없게 하고, 운영 프로젝트와 권한을 분리하고 싶다. 가장 적합한 방법은?',
    options: [
      '같은 프로젝트에 스냅샷을 만들고 IAM으로 삭제 권한을 제한한다.',
      'Backup and DR 서비스의 백업 볼트를 사용해 강제 보존 기간이 적용되는 변경 불가능한 백업을 저장한다.',
      '백업 파일을 운영자 노트북에 복사해 둔다.',
      '매일 전체 VM을 다른 영역에 복제한다.',
    ],
    answer: [1],
    explanations: [
      '같은 프로젝트의 IAM 제한은 탈취된 관리자 권한으로 되돌릴 수 있어 랜섬웨어 대비로 충분하지 않다.',
      '백업 볼트는 Google이 관리하는 격리된 저장소로, 강제 보존 기간 동안 백업을 삭제·변경할 수 없게 하고 프로젝트 수준의 ID 격리를 제공한다. 관리자 계정 탈취 상황에서도 백업을 보호한다.',
      '개인 기기 보관은 보안·가용성 모두 취약하다.',
      '복제는 암호화된(감염된) 데이터도 함께 복제되어 시점 복구가 되지 않는다.',
    ],
    principle:
      '랜섬웨어 대비의 핵심은 변경 불가능(immutable)하고 논리적으로 격리된 백업이다. 복제는 백업을 대체하지 못한다.',
    refs: [
      { title: 'Backup and DR 백업 볼트', url: 'https://docs.cloud.google.com/backup-disaster-recovery/docs/concepts/backup-vault' },
    ],
  },
  {
    id: 'c04-12',
    chapter: 4,
    domain: 1,
    topic: '벡터 검색(의미 기반 추천)',
    question:
      '패션 쇼핑몰이 “이 상품과 분위기가 비슷한 상품” 추천 기능을 만들려 한다. 상품 이미지와 설명을 임베딩으로 변환해 두었으며, 수천만 개 상품 중에서 가장 유사한 항목을 수십 밀리초 안에 찾아야 한다. 가장 적합한 구성 요소는?',
    options: [
      '모든 임베딩을 Cloud SQL에 넣고 요청마다 전체 테이블과 거리를 계산한다.',
      'Gemini Enterprise Agent Platform(구 Vertex AI)의 Vector Search로 근사 최근접 이웃(ANN) 인덱스를 만들어 조회한다.',
      '임베딩을 CSV로 저장하고 매일 밤 배치로 모든 쌍의 유사도를 계산한다.',
      '상품 카테고리가 같은 것을 무작위로 추천한다.',
    ],
    answer: [1],
    explanations: [
      '요청마다 수천만 개 벡터와 거리를 계산하는 전수 비교는 지연 요구를 맞출 수 없다.',
      'Vector Search는 대규모 임베딩에 대한 근사 최근접 이웃 검색을 낮은 지연으로 제공하는 관리형 서비스로, 의미 기반 유사 상품 추천에 적합하다.',
      '모든 쌍 계산은 계산량이 폭증하고 실시간 신상품 반영도 어렵다.',
      '무작위 추천은 “비슷한 분위기”라는 요구를 충족하지 못한다.',
    ],
    principle:
      '의미 유사도 검색은 “임베딩 생성 + 벡터 인덱스(ANN) 검색”으로 구현한다. 규모가 크면 관리형 벡터 검색을 사용한다.',
    refs: [
      { title: 'Vector Search 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/vector-search/overview' },
    ],
  },
  {
    id: 'c04-13',
    chapter: 4,
    domain: 1,
    topic: 'BigQuery ML',
    question:
      '마케팅 분석가들은 SQL에 능숙하지만 Python·ML 프레임워크 경험이 없다. BigQuery에 있는 고객 데이터로 이탈 예측 모델을 빠르게 만들어 보고, 결과를 기존 대시보드에서 바로 쓰고 싶다. 데이터 이동은 최소화해야 한다. 가장 적합한 방법은?',
    options: [
      '데이터를 CSV로 내보내 로컬 노트북에서 scikit-learn으로 학습한다.',
      'BigQuery ML로 SQL 문을 사용해 BigQuery 안에서 모델을 만들고 예측한다.',
      'GKE 클러스터에 분산 학습 환경을 구축한다.',
      'ML 엔지니어를 채용할 때까지 프로젝트를 보류한다.',
    ],
    answer: [1],
    explanations: [
      '데이터 내보내기는 이동·보안 부담이 크고 분석가의 역량과도 맞지 않는다.',
      'BigQuery ML은 SQL로 모델 생성·평가·예측을 BigQuery 안에서 수행하게 해, 데이터 이동 없이 SQL 사용자가 빠르게 ML을 적용할 수 있다.',
      '분산 학습 환경 구축은 과도하고 팀 역량과 맞지 않는다.',
      '보류는 빠르게 시도하려는 목표에 어긋난다.',
    ],
    principle:
      '데이터가 BigQuery에 있고 사용자가 SQL 중심이면 BigQuery ML로 “데이터가 있는 곳에서” 모델을 만든다.',
    refs: [
      { title: 'BigQuery ML 소개', url: 'https://docs.cloud.google.com/bigquery/docs/bqml-introduction' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (8) ─────────
  {
    id: 'c04-14',
    chapter: 4,
    domain: 2,
    topic: 'Cloud Router 커스텀 경로 광고',
    question:
      '회사는 Interconnect로 온프레미스와 VPC를 연결했고, 온프레미스 서버가 비공개 Google 액세스용 제한된 VIP 범위를 통해 Google API에 접근하도록 하려 한다. 그런데 Cloud Router는 기본적으로 VPC 서브넷 경로만 온프레미스에 광고하고 있다. 어떻게 해야 하는가?',
    options: [
      '온프레미스 라우터에 정적 경로를 추가하고 Cloud Router는 그대로 둔다.',
      'Cloud Router에서 커스텀 경로 광고를 설정해 해당 Google API VIP 범위를 온프레미스에 광고한다.',
      'VPC에 Cloud NAT를 구성한다.',
      'VPC 피어링을 추가한다.',
    ],
    answer: [1],
    explanations: [
      '온프레미스 쪽 정적 경로만으로는 BGP 기반 경로 관리의 일관성과 장애 시 자동 전환을 잃고, 광고 누락으로 경로가 비대칭이 될 수 있다.',
      'Cloud Router의 커스텀 경로 광고를 쓰면 서브넷 외의 IP 범위(예: 비공개 Google 액세스용 VIP 범위)를 BGP로 온프레미스에 광고할 수 있다.',
      'Cloud NAT는 아웃바운드 인터넷용으로 온프레미스의 Google API 접근 경로와 무관하다.',
      'VPC 피어링은 온프레미스 경로 광고 문제를 해결하지 않는다.',
    ],
    principle:
      '하이브리드 환경에서 서브넷 외 범위를 온프레미스에 알려야 할 때는 Cloud Router 커스텀 경로 광고를 사용한다.',
    refs: [
      { title: 'Cloud Router 커스텀 경로 광고', url: 'https://docs.cloud.google.com/network-connectivity/docs/router/how-to/advertising-custom-ip' },
    ],
  },
  {
    id: 'c04-15',
    chapter: 4,
    domain: 2,
    topic: '서버리스 NEG와 외부 부하 분산기',
    question:
      '여러 Cloud Run 서비스(/api, /images, /web)를 하나의 사용자 지정 도메인과 경로 기반 라우팅으로 노출하려 한다. 또한 Cloud Armor WAF 정책과 Cloud CDN을 적용하고 싶다. 어떻게 구성해야 하는가?',
    options: [
      '각 Cloud Run 서비스의 기본 URL을 사용자에게 그대로 안내한다.',
      '각 Cloud Run 서비스를 서버리스 NEG로 만들어 전역 외부 애플리케이션 부하 분산기의 백엔드로 두고, URL 맵으로 경로 라우팅하며 Cloud Armor·Cloud CDN을 적용한다.',
      'Cloud Run 앞에 Compute Engine 기반 Nginx 프록시를 직접 운영한다.',
      'Cloud DNS에 경로별 CNAME 레코드를 만든다.',
    ],
    answer: [1],
    explanations: [
      '기본 URL은 서비스마다 달라 단일 도메인·경로 라우팅과 WAF 적용 요구를 충족하지 못한다.',
      '서버리스 NEG는 Cloud Run 등을 부하 분산기 백엔드로 연결해 준다. 전역 외부 애플리케이션 부하 분산기의 URL 맵으로 경로별 라우팅을 하고, Cloud Armor와 Cloud CDN을 함께 적용할 수 있다.',
      '자체 프록시는 운영 부담과 단일 장애 지점을 만든다.',
      'DNS는 경로(URL path) 기반 라우팅을 할 수 없다.',
    ],
    principle:
      '서버리스 백엔드에 L7 기능(경로 라우팅·WAF·CDN·사용자 지정 도메인)이 필요하면 서버리스 NEG + 외부 애플리케이션 부하 분산기를 사용한다.',
    refs: [
      { title: '서버리스 NEG 개요', url: 'https://docs.cloud.google.com/load-balancing/docs/negs/serverless-neg-concepts' },
    ],
  },
  {
    id: 'c04-16',
    chapter: 4,
    domain: 2,
    topic: 'GKE 출시 채널과 유지보수 제외',
    question:
      '핀테크 회사의 GKE 운영 클러스터는 버전 업그레이드를 수동으로 관리하다 보니 지원 종료 버전에 머물러 있다. 회사는 자동 업그레이드로 최신 보안 패치를 받되, 안정성이 검증된 버전만 받고, 연말 결산 기간에는 업그레이드가 일어나지 않게 하고 싶다. 어떻게 설정해야 하는가?',
    options: [
      '자동 업그레이드를 끄고 분기마다 수동으로 업그레이드한다.',
      '클러스터를 Stable 출시 채널에 등록하고, 유지보수 기간을 업무 외 시간으로 지정하며, 결산 기간에는 유지보수 제외를 설정한다.',
      'Rapid 채널에 등록해 항상 최신 기능을 받는다.',
      '노드 풀별로 서로 다른 버전을 수동으로 유지한다.',
    ],
    answer: [1],
    explanations: [
      '수동 관리가 이미 지원 종료 버전 문제를 만들었으므로 같은 방식을 반복하는 것은 해결책이 아니다.',
      'Stable 채널은 충분히 검증된 버전으로 자동 업그레이드하고, 유지보수 기간과 제외 설정으로 업그레이드 시점을 비즈니스 일정에 맞출 수 있다.',
      'Rapid 채널은 최신 버전을 가장 빨리 받는 대신 안정성 검증 기간이 짧아 요구와 맞지 않는다.',
      '노드 풀별 수동 버전 관리는 복잡도와 위험을 키운다.',
    ],
    principle:
      'GKE 버전 관리는 출시 채널(안정성 수준) + 유지보수 기간(시점) + 유지보수 제외(금지 기간)로 자동화한다.',
    refs: [
      { title: 'GKE 출시 채널', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/release-channels' },
      { title: '유지보수 기간 및 제외', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/maintenance-windows-and-exclusions' },
    ],
  },
  {
    id: 'c04-17',
    chapter: 4,
    domain: 2,
    topic: '리전 영구 디스크(상태 저장 VM HA)',
    question:
      '상용 문서 관리 솔루션은 단일 VM에서만 실행되도록 라이선스되어 있고, 데이터를 로컬 파일 시스템에 저장한다. 영역 장애가 발생하면 같은 리전의 다른 영역에서 데이터 손실 없이 수 분 안에 VM을 다시 시작해야 한다. 애플리케이션을 클러스터링할 수는 없다. 가장 적합한 스토리지 구성은?',
    options: [
      '영역 영구 디스크와 매일 스냅샷',
      '두 영역 간 동기식 복제를 제공하는 리전 영구 디스크(또는 Hyperdisk Balanced 고가용성)와 장애 시 다른 영역 VM으로 강제 연결',
      'Local SSD',
      'Cloud Storage FUSE로 버킷을 마운트',
    ],
    answer: [1],
    explanations: [
      '일일 스냅샷은 마지막 스냅샷 이후 데이터가 손실되고 복원 시간도 길다.',
      '리전(고가용성) 디스크는 같은 리전의 두 영역에 데이터를 동기식으로 복제한다. 한 영역이 실패하면 다른 영역의 VM에 디스크를 강제 연결해 데이터 손실 없이 재시작할 수 있다.',
      'Local SSD는 VM과 수명을 같이하는 임시 스토리지로 영역 장애 시 데이터가 사라진다.',
      '버킷 마운트는 POSIX 파일 시스템 의미 체계가 완전하지 않아 로컬 파일 시스템 전제 애플리케이션에 부적합할 수 있다.',
    ],
    principle:
      '클러스터링할 수 없는 상태 저장 단일 VM의 영역 장애 대비는 영역 간 동기 복제 디스크 + 대기 영역 재시작으로 설계한다.',
    refs: [
      { title: '리전 영구 디스크로 고가용성 구성', url: 'https://docs.cloud.google.com/compute/docs/disks/high-availability-regional-persistent-disk' },
    ],
  },
  {
    id: 'c04-18',
    chapter: 4,
    domain: 2,
    topic: 'Cloud SQL 특정 시점 복구',
    question:
      '오후 2시 13분에 운영자가 실수로 Cloud SQL for MySQL의 주문 테이블에서 조건 없는 DELETE를 실행했다. 오후 2시 12분 시점의 데이터로 되돌려야 한다. 자동 백업은 매일 새벽 3시에 실행된다. 가장 적절한 복구 방법은?',
    options: [
      '새벽 3시 자동 백업을 원본 인스턴스에 복원한다.',
      '특정 시점 복구(PITR)로 오후 2시 12분 시점의 새 인스턴스를 만들고, 필요한 데이터를 확인해 복구한다.',
      '읽기 복제본에서 데이터를 복사한다.',
      '고가용성 대기 인스턴스로 장애 조치한다.',
    ],
    answer: [1],
    explanations: [
      '새벽 백업으로 복원하면 그 이후 11시간 동안의 정상 주문까지 모두 사라진다.',
      'PITR은 백업과 로그를 이용해 지정한 시점의 상태로 새 인스턴스를 만든다. 실수 직전 시점으로 복원한 뒤 데이터를 검증해 운영에 반영할 수 있다(PITR은 사전에 사용 설정되어 있어야 한다).',
      '복제본은 DELETE도 그대로 복제되므로 이미 데이터가 없다.',
      'HA 대기 인스턴스도 동기 복제로 같은 변경이 반영되어 있다.',
    ],
    principle:
      '복제와 HA는 논리적 오류(실수 삭제)를 막지 못한다. 논리적 오류 복구에는 백업과 특정 시점 복구가 필요하다.',
    refs: [
      { title: 'Cloud SQL 특정 시점 복구', url: 'https://docs.cloud.google.com/sql/docs/mysql/backup-recovery/pitr' },
    ],
  },
  {
    id: 'c04-19',
    chapter: 4,
    domain: 2,
    topic: 'Cloud Storage 실수 삭제 대비',
    question:
      '디자인 에이전시의 작업 파일 버킷에서 직원이 실수로 폴더 전체를 삭제하거나 중요한 파일을 덮어쓰는 일이 가끔 발생한다. 삭제된 객체와 덮어쓰기 전 버전을 일정 기간 복구할 수 있어야 하고, 저장 비용 증가는 관리 가능해야 한다. 가장 적절한 구성은?',
    options: [
      '버킷 잠금으로 모든 객체를 영구 보존한다.',
      '객체 버전 관리를 사용 설정하고, 수명 주기 규칙으로 오래된 비현재 버전을 일정 기간 후 삭제하며, 소프트 삭제 보존 기간도 요구에 맞게 설정한다.',
      '버킷을 매일 다른 버킷으로 전체 복사한다.',
      '직원의 삭제 권한을 모두 제거한다.',
    ],
    answer: [1],
    explanations: [
      '버킷 잠금은 규제용 불변 보관 기능으로, 정상적인 파일 삭제·수정까지 막아 작업 흐름을 방해하고 되돌릴 수 없다.',
      '버전 관리는 덮어쓰기·삭제 전 버전을 비현재 버전으로 보존하고, 수명 주기 규칙으로 오래된 버전을 정리해 비용을 관리한다. 소프트 삭제는 삭제된 객체를 보존 기간 동안 복원할 수 있게 한다.',
      '매일 전체 복사는 비용이 크고 하루 안의 변경은 보호하지 못한다.',
      '삭제 권한 제거는 정상 업무까지 막는다.',
    ],
    principle:
      '사용자 실수 대비: 버전 관리(덮어쓰기) + 소프트 삭제(삭제) + 수명 주기(비용 관리). 규제 불변 보관은 별도로 보존 정책·버킷 잠금을 쓴다.',
    refs: [
      { title: '소프트 삭제', url: 'https://docs.cloud.google.com/storage/docs/soft-delete' },
      { title: '객체 수명 주기 관리', url: 'https://docs.cloud.google.com/storage/docs/lifecycle' },
    ],
  },
  {
    id: 'c04-20',
    chapter: 4,
    domain: 2,
    topic: 'BigQuery 시간 여행',
    question:
      '분석 엔지니어가 잘못된 MERGE 문을 실행해 BigQuery 고객 테이블의 일부 열 값이 30분 전에 덮어써졌다. 별도의 백업 작업은 구성되어 있지 않다. 가장 빠른 복구 방법은?',
    options: [
      '원천 시스템에서 전체 데이터를 다시 적재한다.',
      'FOR SYSTEM_TIME AS OF 구문으로 변경 직전 시점의 테이블 데이터를 조회해 복구 테이블을 만든다.',
      'Cloud Storage 버전 관리에서 파일을 복원한다.',
      'Google 지원팀에 삭제된 데이터 복구를 요청한다.',
    ],
    answer: [1],
    explanations: [
      '전체 재적재는 시간이 오래 걸리고 원천 시스템에 부하를 준다.',
      'BigQuery 시간 여행은 구성된 기간 안에서 과거 시점의 테이블 데이터를 조회하게 해 준다. 변경 직전 시점을 조회해 새 테이블로 저장하거나 원래 테이블을 복구할 수 있다.',
      'BigQuery 테이블은 Cloud Storage 객체 버전 관리의 대상이 아니다.',
      '시간 여행 기간 안이라면 사용자가 직접 복구할 수 있어 지원 요청이 필요 없다.',
    ],
    principle:
      'BigQuery의 실수 변경은 시간 여행으로 먼저 복구한다. 더 긴 보호가 필요하면 테이블 스냅샷이나 백업을 별도로 둔다.',
    refs: [
      { title: 'BigQuery 시간 여행과 장애 안전', url: 'https://docs.cloud.google.com/bigquery/docs/time-travel' },
    ],
  },
  {
    id: 'c04-21',
    chapter: 4,
    domain: 2,
    topic: 'Gemini Enterprise(사내 검색·에이전트)',
    question:
      '컨설팅 회사 직원들이 SharePoint, Confluence, Jira, Google Drive에 흩어진 자료를 찾느라 시간을 낭비한다. 경영진은 직원이 자연어로 질문하면 여러 사내 시스템을 가로질러 검색하고, 각 사용자가 원래 접근 권한이 있는 문서만 근거로 답해 주는 도구를 빠르게 도입하길 원한다. 개발 인력은 최소화하고 싶다. 가장 적합한 선택은?',
    options: [
      '각 시스템의 데이터를 모두 한 버킷에 복사해 공개 검색 엔진을 만든다.',
      'Gemini Enterprise를 도입해 사전 구축된 커넥터로 사내 데이터 소스를 연결하고 권한 인식 검색과 AI 어시스턴트를 사용한다.',
      'GKE에 오픈 소스 LLM과 자체 벡터 DB를 구축하고 커넥터를 직접 개발한다.',
      '직원들에게 각 시스템의 검색 기능 사용법 교육을 강화한다.',
    ],
    answer: [1],
    explanations: [
      '데이터를 모아 공개 검색을 만들면 원래 권한 체계가 무너져 기밀 문서가 노출된다.',
      'Gemini Enterprise는 Confluence·Jira·SharePoint 등 서드파티 앱용 사전 구축 커넥터와 권한을 인식하는 통합 검색, 대화형 AI 어시스턴트와 에이전트를 제공해 개발 없이 빠르게 도입할 수 있다.',
      '자체 구축은 개발·운영 부담이 크고 권한 동기화까지 직접 구현해야 한다.',
      '교육만으로는 여러 시스템을 가로지르는 검색 문제를 해결하지 못한다.',
    ],
    principle:
      '직원용 전사 검색·AI 어시스턴트는 “구매”(Gemini Enterprise)를 먼저 검토하고, 고객용·맞춤형 에이전트는 Agent Platform으로 “구축”한다.',
    refs: [
      { title: 'Gemini Enterprise란?', url: 'https://docs.cloud.google.com/gemini/enterprise/docs' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (9) ─────────
  {
    id: 'c04-22',
    chapter: 4,
    domain: 3,
    topic: '리소스 계층 구조 설계',
    question:
      '기업이 사업부 3개(소매·금융·물류)와 환경(개발·스테이징·운영)을 운영한다. 요구사항은 (1) 운영 환경 전체에 더 엄격한 조직 정책 적용, (2) 사업부별 관리자가 자기 사업부 프로젝트만 관리, (3) 새 프로젝트가 자동으로 올바른 정책을 상속하는 것이다. 가장 적합한 계층 구조는?',
    options: [
      '조직 아래 모든 프로젝트를 평면적으로 두고 프로젝트마다 정책을 따로 설정한다.',
      '조직 아래 사업부 폴더를 두고, 그 아래 환경별 폴더(개발·스테이징·운영)를 만들어 폴더 수준에서 IAM과 조직 정책을 적용한다.',
      '사업부마다 별도의 조직을 만든다.',
      '모든 워크로드를 하나의 프로젝트에 두고 라벨로 구분한다.',
    ],
    answer: [1],
    explanations: [
      '평면 구조는 프로젝트마다 설정해야 해 누락과 불일치가 생기고, 새 프로젝트가 자동으로 정책을 상속하지 않는다.',
      '폴더 계층을 쓰면 사업부 폴더에 사업부 관리자 권한을, 운영 환경 폴더에 엄격한 조직 정책을 적용할 수 있고, 새 프로젝트는 생성 위치에 따라 정책을 자동 상속한다.',
      '조직을 여러 개 만들면 중앙 거버넌스와 결제·정책 관리가 분산된다.',
      '단일 프로젝트는 권한·할당량·정책 경계를 나눌 수 없다.',
    ],
    principle:
      '리소스 계층은 정책 상속 구조다. 공통 정책은 상위(조직·폴더)에, 예외는 하위에 두고, 관리 경계와 정책 경계를 폴더로 표현한다.',
    refs: [
      { title: '리소스 계층 구조', url: 'https://docs.cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy' },
    ],
  },
  {
    id: 'c04-23',
    chapter: 4,
    domain: 3,
    topic: 'IAM 조건(시간 제한 접근)',
    question:
      '외부 감사 법인의 감사인이 다음 달 1일부터 14일까지만 특정 프로젝트의 로그와 BigQuery 데이터 세트를 읽어야 한다. 보안팀은 기간이 지나면 권한이 자동으로 사라져야 하며, 수동 회수 누락을 걱정한다. 가장 적절한 방법은?',
    options: [
      '권한을 부여하고 14일 후 캘린더 알림으로 회수한다.',
      '만료 시간을 지정한 IAM 조건부 역할 바인딩으로 필요한 역할을 부여한다.',
      '감사인에게 운영자 계정 비밀번호를 공유한다.',
      '프로젝트 뷰어 역할을 영구 부여한다.',
    ],
    answer: [1],
    explanations: [
      '수동 회수는 누락 위험이 있다는 우려를 해소하지 못한다.',
      'IAM 조건은 날짜·시간 같은 속성으로 역할 바인딩의 유효 조건을 지정할 수 있어, 지정 기간이 끝나면 권한이 자동으로 효력을 잃는다.',
      '계정 공유는 개인 식별과 감사를 불가능하게 하는 심각한 위반이다.',
      '영구 부여는 최소 권한과 기간 제한 요구를 모두 위반한다.',
    ],
    principle:
      '기간·리소스·태그 등에 따라 달라지는 접근은 IAM 조건으로 표현해 자동으로 강제한다.',
    refs: [
      { title: 'IAM 조건 개요', url: 'https://docs.cloud.google.com/iam/docs/conditions-overview' },
    ],
  },
  {
    id: 'c04-24',
    chapter: 4,
    domain: 3,
    topic: 'Privileged Access Manager(JIT 권한)',
    question:
      '운영팀 엔지니어 10명이 장애 대응 시에만 운영 프로젝트의 높은 권한이 필요하다. 현재는 모두에게 상시 관리자 권한이 있어 감사에서 지적되었다. 보안팀은 평소에는 권한이 없고, 필요할 때 사유를 남기고 승인을 받아 제한된 시간 동안만 권한이 부여되며, 사후에 누가 언제 무엇을 했는지 추적되길 원한다. 가장 적합한 방법은?',
    options: [
      '상시 관리자 권한을 유지하고 분기별로 로그를 검토한다.',
      'Privileged Access Manager에서 역할·최대 기간·승인자를 정의한 권한(entitlement)을 만들어, 엔지니어가 필요할 때 사유와 함께 임시 권한을 요청하게 한다.',
      '공용 관리자 계정을 하나 만들어 비밀번호를 금고에 보관한다.',
      '장애 시 보안팀이 엔지니어 대신 모든 명령을 실행한다.',
    ],
    answer: [1],
    explanations: [
      '상시 권한은 탈취·오용 위험을 그대로 두며 감사 지적을 해결하지 못한다.',
      'Privileged Access Manager는 적시(just-in-time) 임시 권한 상승을 제공한다. 요청 가능한 주체, 부여할 역할, 최대 기간, 사유·승인 요구를 정의하고, 사후 감사 로그로 추적할 수 있다.',
      '공용 계정은 개인 책임 추적이 불가능하다.',
      '대리 실행은 장애 대응을 늦추고 보안팀에 병목을 만든다.',
    ],
    principle:
      '높은 권한은 상시 부여(standing privilege) 대신 적시·기간 제한·승인·감사가 결합된 임시 부여로 관리한다.',
    refs: [
      { title: 'Privileged Access Manager 개요', url: 'https://docs.cloud.google.com/iam/docs/pam-overview' },
    ],
  },
  {
    id: 'c04-25',
    chapter: 4,
    domain: 3,
    topic: '외부 IdP 연동(SSO)',
    question:
      '회사의 직원 ID는 Microsoft Entra ID(구 Azure AD)로 관리된다. Google Cloud 도입 시 직원이 기존 회사 계정으로 로그인(SSO)하고, 입사·퇴사에 따라 Google 측 사용자와 그룹이 자동으로 생성·정지되길 원한다. 비밀번호를 Google에 따로 저장하고 싶지 않다. 가장 적합한 방법은?',
    options: [
      'Google Cloud에서 직원별 계정을 수동으로 만들고 별도 비밀번호를 발급한다.',
      'Cloud Identity와 Entra ID를 연동해 SAML 기반 SSO를 구성하고, 사용자·그룹 자동 프로비저닝을 설정한다.',
      '모든 직원이 개인 Gmail 계정으로 접속하게 한다.',
      '서비스 계정 하나를 만들어 모든 직원이 공유한다.',
    ],
    answer: [1],
    explanations: [
      '수동 계정과 별도 비밀번호는 관리 부담과 퇴사자 계정 방치 위험을 만든다.',
      'Cloud Identity를 외부 IdP와 연동하면 인증은 기존 IdP에서 SSO로 처리되고, 자동 프로비저닝으로 사용자·그룹 수명 주기가 동기화된다. Google에 비밀번호를 저장하지 않는다.',
      '개인 계정은 회사가 통제할 수 없어 보안·규정 위반이다.',
      '서비스 계정 공유는 개인 식별과 감사를 불가능하게 한다.',
    ],
    principle:
      '기존 IdP가 있으면 Cloud Identity와 연동(SSO + 자동 프로비저닝)해 ID의 단일 진실 공급원을 유지한다.',
    refs: [
      { title: 'Google Cloud와 Microsoft Entra ID 연동', url: 'https://docs.cloud.google.com/architecture/identity/federating-gcp-with-azure-active-directory' },
    ],
  },
  {
    id: 'c04-26',
    chapter: 4,
    domain: 3,
    topic: 'VPC 서비스 제어 도입(시험 실행·인그레스 규칙)',
    question:
      '보안팀이 분석 프로젝트들을 VPC 서비스 제어 경계로 보호하려 한다. 그런데 어떤 정상 업무 흐름이 차단될지 확신이 없고, 온프레미스의 ETL 서버(Interconnect 경유)도 경계 안의 BigQuery에 데이터를 적재해야 한다. 업무 중단 없이 안전하게 도입하려면 어떤 순서가 가장 적절한가? (2개 선택)',
    options: [
      '먼저 경계를 시험 실행(dry-run) 모드로 구성해 위반 로그를 분석하고, 정상 흐름을 확인한 뒤 적용 모드로 전환한다.',
      '온프레미스 ETL 서버의 접근은 해당 서비스 계정과 소스(액세스 수준 등)를 지정한 인그레스 규칙으로 허용한다.',
      '곧바로 적용 모드로 전환하고 문제가 생기면 경계를 삭제한다.',
      '온프레미스 서버에 경계 안 프로젝트의 소유자 역할을 부여하면 경계를 통과한다.',
      '경계 대상 서비스에서 BigQuery를 빼서 차단을 피한다.',
    ],
    answer: [0, 1],
    explanations: [
      '시험 실행 모드는 실제로 차단하지 않고 위반될 요청을 로그로 남겨, 적용 전에 영향 범위를 파악하고 규칙을 다듬을 수 있게 한다.',
      '인그레스 규칙은 경계 밖의 특정 ID·소스가 경계 안의 특정 서비스에 접근하도록 세밀하게 허용한다. 필요한 흐름만 예외로 연다.',
      '즉시 적용은 정상 업무를 예고 없이 중단시킬 위험이 크다.',
      'IAM 권한은 VPC 서비스 제어 경계를 우회하지 못한다. 두 통제는 별개로 모두 충족되어야 한다.',
      '보호 대상에서 BigQuery를 빼면 핵심 데이터가 보호되지 않아 도입 목적이 사라진다.',
    ],
    principle:
      'VPC 서비스 제어는 “시험 실행 → 위반 분석 → 인그레스/이그레스 규칙으로 필요한 흐름만 허용 → 적용” 순서로 도입한다.',
    refs: [
      { title: 'VPC 서비스 제어 시험 실행 모드', url: 'https://docs.cloud.google.com/vpc-service-controls/docs/dry-run-mode' },
      { title: '인그레스 및 이그레스 규칙', url: 'https://docs.cloud.google.com/vpc-service-controls/docs/ingress-egress-rules' },
    ],
  },
  {
    id: 'c04-27',
    chapter: 4,
    domain: 3,
    topic: 'BigQuery 열 수준 보안',
    question:
      '인사 데이터 테이블에는 이름·부서·직급과 함께 주민등록번호·급여 열이 있다. 대부분의 분석가는 이름·부서·직급만 조회해야 하고, 급여팀만 민감 열을 볼 수 있어야 한다. 테이블을 여러 개로 복제하지 않고 관리하려면 어떻게 해야 하는가?',
    options: [
      '민감 열을 제외한 복사본 테이블을 매일 만들어 분석가에게 제공한다.',
      'Data Catalog/Dataplex 계열 분류 체계의 정책 태그를 민감 열에 지정하고, 급여팀에만 세분화된 읽기 권한을 부여하는 열 수준 보안을 적용한다.',
      '분석가에게 테이블 전체 읽기 권한을 주고 민감 열은 보지 말라고 안내한다.',
      '민감 열을 Base64로 인코딩해 저장한다.',
    ],
    answer: [1],
    explanations: [
      '복사본 테이블은 동기화 지연과 저장 비용, 관리 부담을 늘린다.',
      'BigQuery 열 수준 보안은 분류 체계의 정책 태그를 열에 지정하고, 태그에 대한 세분화된 읽기 권한이 있는 사용자만 해당 열을 조회하게 한다. 하나의 테이블로 열 단위 접근을 통제한다.',
      '안내만으로는 기술적 통제가 되지 않는다.',
      '인코딩은 암호화가 아니며 누구나 복원할 수 있다.',
    ],
    principle:
      'BigQuery 세분화 접근 제어: 열 단위는 정책 태그(열 수준 보안·동적 데이터 마스킹), 행 단위는 행 수준 보안, 결과 공유는 승인된 뷰를 쓴다.',
    refs: [
      { title: 'BigQuery 열 수준 보안 소개', url: 'https://docs.cloud.google.com/bigquery/docs/column-level-security-intro' },
    ],
  },
  {
    id: 'c04-28',
    chapter: 4,
    domain: 3,
    topic: '감사 로그 장기 보관',
    question:
      '금융 규제상 관리 활동 감사 로그를 7년간 변경 불가능하게 보관하고, 필요 시 감사인이 조회할 수 있어야 한다. 현재는 기본 로그 버킷 설정만 사용하고 있다. 가장 적절한 구성은?',
    options: [
      '기본 _Required 버킷의 보존 기간을 7년으로 늘린다.',
      '로그 싱크로 감사 로그를 전용 사용자 정의 로그 버킷(또는 Cloud Storage 버킷)으로 라우팅하고, 7년 보존 기간을 설정한 뒤 보존 정책을 잠근다.',
      '매년 로그를 CSV로 내려받아 파일 서버에 보관한다.',
      '감사 로그를 BigQuery로 보내고 테이블 만료를 설정하지 않는다.',
    ],
    answer: [1],
    explanations: [
      '_Required 버킷의 보존 기간은 고정되어 있어 사용자가 변경할 수 없다.',
      '로그 싱크로 전용 버킷에 라우팅한 뒤 필요한 보존 기간을 설정하고 잠그면, 기간 동안 로그를 삭제·단축할 수 없어 규제용 장기 불변 보관을 충족한다.',
      '수작업 내보내기는 누락·변조 위험이 있고 관리 부담이 크다.',
      '만료가 없는 BigQuery 테이블은 기간 보장은 되지만 변경 불가능성을 보장하지 않는다.',
    ],
    principle:
      '로그의 규제 보관은 싱크 + 전용 버킷 + 보존 기간 잠금으로 설계한다. 기본 버킷의 보존 특성을 먼저 확인한다.',
    refs: [
      { title: '로그 버킷 구성', url: 'https://docs.cloud.google.com/logging/docs/buckets' },
      { title: '로그 라우팅 및 스토리지 개요', url: 'https://docs.cloud.google.com/logging/docs/routing/overview' },
    ],
  },
  {
    id: 'c04-29',
    chapter: 4,
    domain: 3,
    topic: 'CI/CD의 키 없는 인증',
    question:
      '개발팀은 GitHub Actions에서 Google Cloud로 배포하기 위해 서비스 계정 키를 GitHub 시크릿에 저장해 두었다. 보안팀은 장기 키를 없애고, 특정 저장소의 특정 브랜치 워크플로만 배포할 수 있게 제한하길 원한다. 가장 적절한 방법은?',
    options: [
      '서비스 계정 키를 더 복잡한 이름의 시크릿으로 옮긴다.',
      'GitHub의 OIDC 토큰을 신뢰하는 Workload Identity Federation 풀·공급자를 만들고, 저장소·브랜치 속성 조건으로 서비스 계정 가장을 허용한다.',
      '배포 서비스 계정에 소유자 역할을 부여한다.',
      '개발자 개인 계정의 자격 증명을 워크플로에 저장한다.',
    ],
    answer: [1],
    explanations: [
      '시크릿 이름을 바꿔도 장기 키가 존재하는 문제는 그대로다.',
      'Workload Identity Federation은 GitHub가 발급하는 OIDC 토큰을 검증해 단기 자격 증명을 발급하므로 키가 필요 없다. 속성 조건으로 특정 저장소·브랜치의 워크플로만 서비스 계정을 가장하도록 제한할 수 있다.',
      '소유자 역할은 과도한 권한이다.',
      '개인 자격 증명 사용은 추적·통제가 불가능하고 퇴사 시 문제가 생긴다.',
    ],
    principle:
      '외부 CI/CD는 OIDC 기반 Workload Identity Federation으로 키 없이 인증하고, 속성 조건으로 신뢰 범위를 좁힌다.',
    refs: [
      { title: '배포 파이프라인과 Workload Identity Federation', url: 'https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines' },
    ],
  },
  {
    id: 'c04-30',
    chapter: 4,
    domain: 3,
    topic: 'VM 원격 관리 접근(OS 로그인·IAP)',
    question:
      '관리자들이 수백 대 Linux VM에 SSH로 접속한다. 현재는 VM마다 공개 IP가 있고, SSH 키를 메타데이터에 수동으로 넣어 퇴사자 키가 남아 있는 문제가 있다. 공개 IP를 없애고, IAM으로 접속 권한을 관리하며, 접속 기록을 남기고 싶다. 가장 적절한 조합은?',
    options: [
      '공개 IP를 유지하고 SSH 포트를 비표준 포트로 바꾼다.',
      'VM의 공개 IP를 제거하고, OS 로그인을 사용 설정해 IAM 역할로 SSH 권한을 관리하며, IAP TCP 전달로 접속한다.',
      '모든 관리자에게 같은 SSH 키를 배포한다.',
      '배스천 호스트 한 대에 모든 관리자 키를 저장한다.',
    ],
    answer: [1],
    explanations: [
      '포트 변경은 보안을 거의 높이지 못하며 공개 IP 노출과 키 관리 문제는 그대로다.',
      'OS 로그인은 SSH 접근을 IAM 역할과 연결해 퇴사 시 ID 비활성화만으로 권한이 사라지게 하고, IAP TCP 전달은 공개 IP 없이 IAM으로 인증된 사용자만 VM에 접속하게 한다. 두 경로 모두 감사 로그가 남는다.',
      '공유 키는 개인 식별과 회수가 불가능하다.',
      '배스천 호스트는 여전히 공개 노출 지점이 되고 키 관리 문제를 한곳으로 옮길 뿐이다.',
    ],
    principle:
      'VM 관리 접근은 “공개 IP 없음 + IAP(네트워크 경로) + OS 로그인(IAM 기반 인가)”으로 구성한다.',
    refs: [
      { title: 'OS 로그인', url: 'https://docs.cloud.google.com/compute/docs/oslogin' },
      { title: 'IAP TCP 전달 사용', url: 'https://docs.cloud.google.com/iap/docs/using-tcp-forwarding' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (8) ─────────
  {
    id: 'c04-31',
    chapter: 4,
    domain: 4,
    topic: 'DORA 지표',
    question:
      'CTO가 클라우드 전환 후 소프트웨어 전달 성과가 실제로 개선되었는지 측정하고 싶어 한다. 속도와 안정성을 균형 있게 보여 주는 업계 표준 지표 묶음으로 가장 적절한 것은?',
    options: [
      '개발자당 커밋 수, 작성한 코드 줄 수, 회의 시간',
      '배포 빈도, 변경 리드 타임, 변경 실패율, 서비스 복구 시간(실패한 배포로부터의 복구 시간)',
      '서버 수, 클라우드 비용 총액, 티켓 수',
      '테스트 케이스 수와 문서 페이지 수',
    ],
    answer: [1],
    explanations: [
      '커밋 수·코드 줄 수는 활동량일 뿐 전달 성과를 반영하지 못하고, 왜곡된 행동을 유도할 수 있다.',
      'DORA 지표는 처리량(배포 빈도·리드 타임)과 안정성(변경 실패율·복구 시간)을 함께 측정해 소프트웨어 전달 성과를 균형 있게 보여 준다.',
      '인프라 규모와 비용은 전달 성과 지표가 아니다.',
      '산출물 개수는 품질이나 속도를 직접 반영하지 않는다.',
    ],
    principle:
      '전달 성과는 속도와 안정성을 함께 본다. 한쪽만 측정하면 다른 쪽이 희생된다.',
    refs: [
      { title: 'DORA 소프트웨어 전달 성과 지표', url: 'https://dora.dev/guides/dora-metrics/' },
    ],
  },
  {
    id: 'c04-32',
    chapter: 4,
    domain: 4,
    topic: 'Cloud Build 비공개 풀',
    question:
      '회사의 CI 파이프라인은 Cloud Build를 사용한다. 통합 테스트 단계에서 VPC 내부의 사설 IP만 있는 테스트 DB와 온프레미스(Interconnect 경유) 아티팩트 저장소에 접근해야 하는데, 기본 Cloud Build 작업자는 이 네트워크에 접근하지 못한다. 가장 적절한 해결책은?',
    options: [
      '테스트 DB와 아티팩트 저장소에 공개 IP를 부여한다.',
      'VPC 네트워크에 피어링된 Cloud Build 비공개 풀을 만들어 빌드를 실행한다.',
      'CI를 개발자 노트북에서 실행한다.',
      '통합 테스트를 생략한다.',
    ],
    answer: [1],
    explanations: [
      '사설 리소스를 공개 노출하면 보안 위험이 커진다.',
      '비공개 풀은 고객 VPC 네트워크와 연결된 전용 작업자에서 빌드를 실행해, 사설 IP 리소스와 하이브리드 연결을 통한 온프레미스 리소스에 접근할 수 있게 한다.',
      '개발자 노트북 CI는 재현성과 통제를 잃는다.',
      '통합 테스트 생략은 품질을 떨어뜨린다.',
    ],
    principle:
      'CI가 사설 네트워크 리소스에 접근해야 하면 Cloud Build 비공개 풀을 사용한다(노출 대신 연결).',
    refs: [
      { title: 'Cloud Build 비공개 풀 개요', url: 'https://docs.cloud.google.com/build/docs/private-pools/private-pools-overview' },
    ],
  },
  {
    id: 'c04-33',
    chapter: 4,
    domain: 4,
    topic: '로깅 비용 최적화',
    question:
      '월 청구서에서 Cloud Logging 수집 비용이 급증했다. 분석해 보니 대부분이 부하 분산기 상태 확인 성공 로그와 DEBUG 수준 애플리케이션 로그였고, 이는 문제 해결에 거의 쓰이지 않는다. 감사 로그와 오류 로그는 반드시 유지해야 한다. 가장 효과적인 조치는?',
    options: [
      '모든 로그 수집을 중지한다.',
      '로그 라우터의 _Default 싱크에 제외 필터를 추가해 가치가 낮은 로그(상태 확인 성공, DEBUG)를 저장하지 않고, 감사·오류 로그는 유지한다.',
      '로그 보존 기간을 늘린다.',
      '모든 로그를 BigQuery로 보내 비용을 비교한다.',
    ],
    answer: [1],
    explanations: [
      '모든 수집 중지는 보안·운영에 필요한 로그까지 잃게 한다.',
      '제외 필터는 조건에 맞는 로그가 로그 버킷에 저장되지 않게 해 수집·저장 비용을 줄인다. 가치가 낮은 대량 로그만 정확히 걸러 내고 중요한 로그는 유지할 수 있다(감사 로그의 _Required 버킷은 영향받지 않는다).',
      '보존 기간을 늘리면 비용이 더 늘어난다.',
      '목적지를 바꿔도 불필요한 로그의 양은 그대로다.',
    ],
    principle:
      '관측성 비용은 “무엇을 버릴지” 결정하는 것에서 시작한다. 제외 필터·샘플링으로 가치 낮은 대량 로그를 줄인다.',
    refs: [
      { title: '로그 라우팅 및 스토리지 개요(제외 필터)', url: 'https://docs.cloud.google.com/logging/docs/routing/overview' },
    ],
  },
  {
    id: 'c04-34',
    chapter: 4,
    domain: 4,
    topic: 'FinOps(비용 가시성과 책임)',
    question:
      '클라우드 비용은 중앙 IT 예산에서 일괄 지출되고, 각 개발팀은 자신이 쓰는 비용을 모른다. 그 결과 사용하지 않는 리소스가 방치되고 비용이 계속 증가한다. 조직 문화와 프로세스 측면에서 가장 효과적인 첫 단계는?',
    options: [
      '클라우드 사용을 중앙 IT 승인제로 바꿔 모든 리소스 생성을 통제한다.',
      '라벨·프로젝트 구조로 팀별 비용을 측정하고 대시보드로 공유(쇼백)해 팀이 자기 비용을 인지하고 최적화 책임을 지게 하며, 이후 차지백으로 발전시킨다.',
      '분기마다 모든 리소스를 일괄 삭제한다.',
      '비용 문제는 재무팀 소관이므로 엔지니어에게는 알리지 않는다.',
    ],
    answer: [1],
    explanations: [
      '중앙 승인제는 속도를 크게 떨어뜨리고 팀의 비용 의식도 키우지 못한다.',
      '비용 가시성(쇼백)은 엔지니어가 자기 결정의 비용 영향을 알게 해 자발적 최적화를 이끈다. 정확한 할당이 가능해지면 실제 비용 청구(차지백)로 책임을 강화한다.',
      '일괄 삭제는 운영 중인 서비스를 망가뜨린다.',
      '엔지니어가 비용을 모르면 최적화 결정을 내릴 수 없다.',
    ],
    principle:
      'FinOps는 가시성 → 책임 → 최적화의 문화다. 비용 데이터를 결정을 내리는 사람에게 전달한다.',
    refs: [
      { title: 'Well-Architected Framework: 비용 최적화', url: 'https://docs.cloud.google.com/architecture/framework/cost-optimization' },
    ],
  },
  {
    id: 'c04-35',
    chapter: 4,
    domain: 4,
    topic: '클라우드 역량과 CCoE',
    question:
      '대기업이 여러 사업부에서 동시에 클라우드 도입을 시작했지만, 팀마다 보안 설정·네트워크 설계·도구가 제각각이고 같은 실수를 반복한다. 클라우드 역량도 팀별 편차가 크다. 조직 차원의 가장 효과적인 조치는?',
    options: [
      '각 팀이 알아서 배우도록 둔다.',
      '클라우드 CoE(Center of Excellence)를 구성해 표준·재사용 가능한 랜딩 존과 모범 사례를 제공하고, 역할별 교육·인증 계획으로 역량 격차를 줄인다.',
      '모든 클라우드 작업을 외부 업체에 맡긴다.',
      '클라우드 도입을 한 사업부로 제한한다.',
    ],
    answer: [1],
    explanations: [
      '방임은 불일치와 반복되는 실수를 계속 만든다.',
      'CCoE는 표준·가드레일·재사용 자산을 제공하고 지식을 전파하는 조직이다. 역할별 교육과 인증 계획을 함께 운영하면 팀 역량 편차를 줄이고 일관된 도입이 가능하다.',
      '전면 외주는 내부 역량을 키우지 못해 장기적으로 의존성과 비용이 커진다.',
      '도입 제한은 비즈니스 요구를 무시한다.',
    ],
    principle:
      '클라우드 도입은 기술만의 문제가 아니다. 표준과 역량을 조직적으로 확산하는 구조(CCoE, 교육 계획)가 필요하다.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  {
    id: 'c04-36',
    chapter: 4,
    domain: 4,
    topic: '파일럿 애플리케이션 선정',
    question:
      '처음으로 클라우드 마이그레이션을 시작하는 회사가 첫 파일럿 애플리케이션을 고르려 한다. 목표는 팀이 경험을 쌓고, 이후 웨이브에 쓸 절차와 도구를 검증하는 것이다. 가장 적절한 후보는?',
    options: [
      '매출의 70%를 처리하는 핵심 결제 시스템',
      '의존성이 적고 비즈니스 영향이 낮지만, 이후 이전할 앱들과 기술 스택이 비슷한 사내 애플리케이션',
      '공급업체 지원이 끝난 가장 오래된 메인프레임 시스템',
      '다음 달 폐기 예정인 애플리케이션',
    ],
    answer: [1],
    explanations: [
      '핵심 결제 시스템은 실패 시 영향이 커서 첫 파일럿으로 부적합하다.',
      '위험이 낮으면서도 이후 대상과 대표성이 있는 앱을 고르면, 실패 비용을 작게 유지하면서 도구·절차·역량을 검증해 다음 웨이브에 재사용할 수 있다.',
      '가장 복잡한 레거시는 경험이 쌓인 뒤에 다뤄야 한다.',
      '곧 폐기할 앱은 옮길 가치가 없고 학습 효과도 제한적이다.',
    ],
    principle:
      '첫 이전은 “낮은 위험 + 높은 대표성”으로 고른다. 파일럿의 목적은 학습과 절차 검증이다.',
    refs: [
      { title: '워크로드 평가 및 검색', url: 'https://docs.cloud.google.com/architecture/migration-to-gcp-assessing-and-discovering-your-workloads' },
    ],
  },
  {
    id: 'c04-37',
    chapter: 4,
    domain: 4,
    topic: '근본 원인 분석 기법',
    question:
      '주문 API 장애의 직접 원인은 “DB 연결 풀 고갈”로 확인되었다. 팀은 연결 풀 크기를 늘리고 사건을 종결하려 한다. 아키텍트가 권장할 분석 방식으로 가장 적절한 것은?',
    options: [
      '직접 원인을 해결했으므로 추가 분석 없이 종결한다.',
      '“왜 연결 풀이 고갈되었는가?”를 반복해 묻는 방식(예: 5 Whys)으로 기여 요인(느린 쿼리, 재시도 폭증, 타임아웃 설정 등)을 찾고, 탐지·예방 조치까지 도출한다.',
      '연결 풀 고갈을 일으킨 개발자를 찾아 책임을 묻는다.',
      '같은 장애가 다시 날 때까지 기다렸다가 분석한다.',
    ],
    answer: [1],
    explanations: [
      '직접 원인만 처리하면 근본 원인이 남아 다른 형태로 재발할 수 있다.',
      '반복적인 “왜” 질문은 직접 원인 뒤의 시스템적 기여 요인을 드러내며, 탐지(알림)·완화(타임아웃·서킷 브레이커)·예방(쿼리 최적화) 조치를 도출하게 한다.',
      '개인 책임 추궁은 학습을 막고 정보 공유를 위축시킨다.',
      '재발을 기다리는 것은 사용자 피해를 감수하는 것이다.',
    ],
    principle:
      '근본 원인 분석은 직접 원인에서 멈추지 않고 기여 요인·탐지 공백·예방 조치까지 도출해야 한다.',
    refs: [
      { title: '인시던트 및 문제 관리', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence/manage-incidents-and-problems' },
    ],
  },
  {
    id: 'c04-38',
    chapter: 4,
    domain: 4,
    topic: '개발 환경 VM 비용 절감',
    question:
      '개발팀의 Compute Engine VM 80대는 평일 오전 9시~오후 7시에만 사용되지만 24시간 켜져 있다. 개발자는 VM의 디스크 상태를 유지해야 한다. 운영 부담 없이 비용을 줄이는 가장 간단한 방법은?',
    options: [
      '모든 VM을 Spot VM으로 바꾼다.',
      '인스턴스 일정(리소스 정책)으로 평일 업무 시간에만 VM을 시작하고 그 외 시간에는 중지한다.',
      '3년 약정 사용 할인을 구매한다.',
      '매일 저녁 VM을 삭제하고 아침에 새로 만든다.',
    ],
    answer: [1],
    explanations: [
      'Spot VM은 업무 중에도 선점될 수 있어 개발 흐름을 방해할 수 있고, 야간 유휴 시간 문제를 해결하지 못한다.',
      '인스턴스 일정은 지정한 시간에 VM을 자동으로 시작·중지한다. 중지된 VM은 vCPU·메모리 비용이 발생하지 않고(디스크 비용은 남음) 디스크 상태도 유지된다.',
      '약정은 하루 절반 이상 유휴인 리소스에 적합하지 않다.',
      '삭제·재생성은 디스크 상태를 잃거나 복잡한 자동화가 필요하다.',
    ],
    principle:
      '사용 시간이 예측 가능한 비운영 리소스는 일정 기반 시작·중지로 유휴 비용을 없앤다.',
    refs: [
      { title: 'VM 인스턴스 시작·중지 일정', url: 'https://docs.cloud.google.com/compute/docs/instances/schedule-instance-start-stop' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (6) ─────────
  {
    id: 'c04-39',
    chapter: 4,
    domain: 5,
    topic: 'MIG 카나리 업데이트',
    question:
      'MIG로 운영되는 VM 기반 API의 새 버전을 배포하려 한다. 먼저 인스턴스 20대 중 2대에만 새 인스턴스 템플릿을 적용해 오류율을 관찰하고, 문제가 없으면 전체로 확대하려 한다. 가장 적절한 방법은?',
    options: [
      '새 MIG를 만들고 DNS로 10% 트래픽을 보낸다.',
      'MIG 업데이트에 두 버전(기존 템플릿과 새 템플릿)을 지정하고 새 템플릿의 targetSize를 2(또는 10%)로 설정한 카나리 업데이트를 수행한다.',
      '모든 인스턴스에 새 템플릿으로 순차적 업데이트를 즉시 수행한다.',
      '2대의 VM에 SSH로 접속해 수동으로 새 버전을 설치한다.',
    ],
    answer: [1],
    explanations: [
      'DNS 기반 분할은 부정확하고 별도 MIG 관리가 필요하다.',
      'MIG는 한 그룹에 두 인스턴스 템플릿을 지정하고 새 버전의 목표 크기를 정하는 카나리 업데이트를 지원한다. 같은 부하 분산기 뒤에서 일부만 새 버전을 실행하고, 이후 목표 크기를 늘려 전체로 확대한다.',
      '즉시 전체 업데이트는 카나리 검증 단계를 건너뛴다.',
      '수동 설치는 MIG의 자동 복구 시 원래 템플릿으로 돌아가 변경이 사라지고 재현성도 없다.',
    ],
    principle:
      'MIG 카나리는 “두 템플릿 + 새 버전 targetSize”로 구현한다. 인스턴스를 직접 수정하지 말고 템플릿으로 관리한다.',
    refs: [
      { title: 'MIG 업데이트 롤아웃(카나리 포함)', url: 'https://docs.cloud.google.com/compute/docs/instance-groups/rolling-out-updates-to-managed-instance-groups' },
    ],
  },
  {
    id: 'c04-40',
    chapter: 4,
    domain: 5,
    topic: 'Apigee 트래픽 정책',
    question:
      'Apigee로 공개한 API에서 (1) 파트너별로 월간 호출 계약량을 넘지 못하게 하고, (2) 짧은 순간의 트래픽 폭주로 백엔드가 과부하되는 것을 막아야 한다. 각 요구에 맞는 정책 조합은?',
    options: [
      '두 요구 모두 Spike Arrest 정책으로 처리한다.',
      '(1)은 Quota 정책, (2)는 Spike Arrest 정책으로 처리한다.',
      '두 요구 모두 Quota 정책으로 처리한다.',
      '(1)은 Spike Arrest 정책, (2)는 Quota 정책으로 처리한다.',
    ],
    answer: [1],
    explanations: [
      'Spike Arrest는 짧은 간격의 급증을 평탄화하는 용도로, 월간 계약량 같은 누적 한도 관리에는 맞지 않는다.',
      'Quota 정책은 앱·개발자·API 제품 단위로 기간별 호출 수를 제한해 계약량 관리에 적합하고, Spike Arrest는 초·분 단위 트래픽 급증으로부터 백엔드를 보호한다.',
      'Quota만으로는 짧은 순간의 폭주를 평탄화하지 못한다.',
      '두 정책의 용도를 반대로 짝지은 조합이다.',
    ],
    principle:
      'Apigee: 비즈니스 계약 한도 = Quota, 백엔드 보호용 순간 급증 제어 = Spike Arrest.',
    refs: [
      { title: 'Quota와 Spike Arrest 정책 비교', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/develop/comparing-quota-and-spike-arrest-policies' },
    ],
  },
  {
    id: 'c04-41',
    chapter: 4,
    domain: 5,
    topic: '이기종 DB 마이그레이션',
    question:
      '회사가 라이선스 비용 절감을 위해 온프레미스 Oracle 데이터베이스를 Cloud SQL for PostgreSQL로 옮기려 한다. 스키마·저장 프로시저 변환이 필요하고, 전환 시 다운타임을 최소화하고 싶다. 관리형 도구 중심으로 진행하려면?',
    options: [
      'Oracle 데이터 파일을 Cloud Storage에 복사해 PostgreSQL에서 직접 연다.',
      'Database Migration Service의 Oracle→PostgreSQL 마이그레이션으로 변환 작업 공간에서 스키마·코드를 변환·검토하고, 데이터를 지속 복제한 뒤 전환한다.',
      'Oracle을 그대로 Compute Engine으로 리호스트한다.',
      '모든 데이터를 CSV로 내보내 수동으로 가져오고 저장 프로시저는 버린다.',
    ],
    answer: [1],
    explanations: [
      'Oracle 데이터 파일은 PostgreSQL에서 읽을 수 없다.',
      'Database Migration Service는 이기종(Oracle→PostgreSQL) 이전에서 스키마·코드 변환을 돕는 변환 작업 공간과 지속적 데이터 복제를 제공해, 변환 검토 후 짧은 전환으로 이전할 수 있다.',
      '리호스트는 라이선스 비용 절감이라는 목표를 달성하지 못한다.',
      '수동 CSV 이전은 다운타임이 길고, 저장 프로시저를 버리면 기능이 깨진다.',
    ],
    principle:
      '이기종 DB 이전은 “스키마·코드 변환 + 데이터 지속 복제 + 애플리케이션 검증 + 전환”으로 진행한다. 변환 결과는 반드시 사람이 검토한다.',
    refs: [
      { title: 'Oracle에서 PostgreSQL로 마이그레이션 개요', url: 'https://docs.cloud.google.com/database-migration/docs/oracle-to-postgresql/scenario-overview' },
    ],
  },
  {
    id: 'c04-42',
    chapter: 4,
    domain: 5,
    topic: 'gcloud 출력 필터링과 형식',
    question:
      '운영 스크립트가 프로젝트의 VM 중 “env=prod” 라벨이 있고 상태가 TERMINATED인 인스턴스의 이름과 영역만 추출해 다른 도구에 넘겨야 한다. 현재는 gcloud 출력 전체를 grep·awk로 파싱해 형식이 조금만 바뀌어도 깨진다. 더 견고한 방법은?',
    options: [
      'gcloud 출력 화면을 캡처해 OCR로 읽는다.',
      'gcloud compute instances list에 --filter로 조건을 지정하고 --format으로 필요한 필드만 JSON·CSV 등 구조화된 형식으로 출력한다.',
      '콘솔에서 목록을 수동으로 복사한다.',
      '매번 모든 VM의 상세 정보를 describe로 가져와 텍스트를 파싱한다.',
    ],
    answer: [1],
    explanations: [
      'OCR은 부정확하고 자동화에 부적합하다.',
      'gcloud의 --filter와 --format은 서버·CLI 측에서 조건 필터링과 필드 선택을 수행하고, JSON·CSV·value 같은 안정적인 형식으로 출력해 스크립트가 견고해진다.',
      '수동 복사는 자동화 목적에 어긋난다.',
      '텍스트 파싱은 여전히 형식 변화에 취약하고 호출 수가 많아 느리다.',
    ],
    principle:
      '스크립트에서는 사람용 출력 대신 --filter/--format으로 구조화된 출력을 사용한다.',
    refs: [
      { title: 'gcloud 필터 주제', url: 'https://docs.cloud.google.com/sdk/gcloud/reference/topic/filters' },
      { title: 'gcloud 출력 형식 주제', url: 'https://docs.cloud.google.com/sdk/gcloud/reference/topic/formats' },
    ],
  },
  {
    id: 'c04-43',
    chapter: 4,
    domain: 5,
    topic: 'Spanner 에뮬레이터',
    question:
      '개발팀이 Spanner를 쓰는 서비스를 개발한다. 개발자마다 테스트용 Spanner 인스턴스를 만들면 비용이 크고, 스키마 변경 테스트가 서로 간섭한다. 로컬과 CI에서 빠르게 반복 테스트하려면?',
    options: [
      '모든 개발자가 운영 Spanner 인스턴스의 같은 데이터베이스를 공유한다.',
      'Spanner 에뮬레이터를 로컬·CI에서 실행해 테스트하고, 에뮬레이터가 지원하지 않는 부분은 별도의 공유 테스트 인스턴스에서 검증한다.',
      'Spanner 대신 SQLite로 테스트한다.',
      '테스트를 없애고 코드 리뷰로 대신한다.',
    ],
    answer: [1],
    explanations: [
      '운영 인스턴스 공유는 운영 데이터 손상과 간섭 위험이 크다.',
      'Spanner 에뮬레이터는 로컬에서 비용 없이 격리된 테스트 환경을 제공한다. 에뮬레이터는 실제 서비스와 차이가 있을 수 있으므로 성능·일부 기능은 실제 인스턴스에서 추가 검증한다.',
      '다른 DB로 테스트하면 SQL 방언·트랜잭션 동작이 달라 신뢰할 수 없다.',
      '코드 리뷰는 자동화된 테스트를 대체하지 못한다.',
    ],
    principle:
      '관리형 DB 개발은 “에뮬레이터로 빠른 로컬·CI 테스트 + 실제 인스턴스로 최종 검증”의 2단계로 한다.',
    refs: [
      { title: 'Spanner 에뮬레이터', url: 'https://docs.cloud.google.com/spanner/docs/emulator' },
    ],
  },
  {
    id: 'c04-44',
    chapter: 4,
    domain: 5,
    topic: 'Config Connector(Kubernetes 방식 IaC)',
    question:
      '플랫폼 팀은 모든 배포를 GitOps로 Kubernetes 매니페스트로 관리한다. 애플리케이션과 함께 필요한 Pub/Sub 주제, Cloud Storage 버킷, IAM 바인딩도 같은 방식(kubectl·Config Sync)으로 선언하고 조정(reconcile)되길 원한다. 가장 적합한 도구는?',
    options: [
      '콘솔에서 수동으로 리소스를 만든다.',
      'Config Connector로 Google Cloud 리소스를 Kubernetes 커스텀 리소스로 선언해 관리한다.',
      '각 파드 시작 스크립트에서 gcloud로 리소스를 만든다.',
      'Deployment Manager 템플릿을 새로 작성한다.',
    ],
    answer: [1],
    explanations: [
      '수동 생성은 GitOps의 선언적 관리와 추적성을 잃는다.',
      'Config Connector는 Google Cloud 리소스를 Kubernetes 리소스 모델로 표현해 kubectl·GitOps 도구로 선언하고, 컨트롤러가 실제 상태를 지속적으로 조정한다.',
      '시작 스크립트에서 리소스를 만들면 중복 생성·권한 문제와 상태 불일치가 생긴다.',
      'Deployment Manager는 Kubernetes 방식 워크플로와 통합되지 않으며 권장되는 방향이 아니다.',
    ],
    principle:
      'Kubernetes 중심 조직은 Config Connector로 인프라까지 같은 선언적 모델·도구로 관리할 수 있다. Terraform 중심이면 Terraform을 유지한다.',
    refs: [
      { title: 'Config Connector 개요', url: 'https://docs.cloud.google.com/config-connector/docs/overview' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c04-45',
    chapter: 4,
    domain: 6,
    topic: '골든 시그널 대시보드',
    question:
      '새 마이크로서비스의 운영 대시보드를 설계한다. 온콜 엔지니어가 한눈에 사용자 영향과 포화 상태를 판단할 수 있도록 서비스마다 표준 지표 묶음을 두고 싶다. 가장 적절한 핵심 지표 묶음은?',
    options: [
      '코드 커버리지, 커밋 수, 빌드 시간, 배포자 이름',
      '지연 시간, 트래픽, 오류, 포화도(네 가지 골든 시그널)',
      'VM 개수, 디스크 개수, IP 개수, 라벨 개수',
      '월 비용, 예산 잔액, 청구 계정 ID',
    ],
    answer: [1],
    explanations: [
      '개발 활동 지표는 서비스의 현재 상태를 보여 주지 않는다.',
      '골든 시그널(지연 시간·트래픽·오류·포화도)은 사용자 영향과 용량 한계를 빠르게 판단할 수 있는 최소한의 핵심 지표로, 서비스 대시보드의 표준으로 쓰인다.',
      '리소스 개수는 인벤토리 정보일 뿐 건강 상태를 나타내지 않는다.',
      '비용 지표는 중요하지만 운영 상태 판단용 지표가 아니다.',
    ],
    principle:
      '사용자 대면 서비스는 골든 시그널로 모니터링하고, 알림은 그중 사용자 영향(SLO)에 연결한다.',
    refs: [
      { title: 'SRE 책: 분산 시스템 모니터링', url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
    ],
  },
  {
    id: 'c04-46',
    chapter: 4,
    domain: 6,
    topic: '알림 문서와 런북',
    question:
      '새벽 알림을 받은 신입 온콜 엔지니어가 알림 제목만으로는 무엇을 확인하고 어떻게 조치해야 할지 몰라 대응이 1시간 넘게 지연되었다. 알림 전략을 어떻게 개선해야 하는가?',
    options: [
      '알림을 선임 엔지니어에게만 보낸다.',
      '알림 정책의 문서(documentation) 필드에 영향 설명, 확인할 대시보드, 런북 링크, 에스컬레이션 경로를 넣어 알림과 함께 전달되게 한다.',
      '알림 수를 줄이기 위해 임계값을 크게 올린다.',
      '신입은 온콜에서 제외한다.',
    ],
    answer: [1],
    explanations: [
      '특정인에게만 보내면 부담이 집중되고 지식 공유도 되지 않는다.',
      '알림 정책의 문서 필드는 알림 메시지에 포함되어, 받는 사람이 즉시 영향 범위·확인 절차·조치 방법·에스컬레이션을 알 수 있게 한다. 대응 시간을 줄이는 핵심 관행이다.',
      '임계값만 올리면 중요한 문제를 놓칠 수 있고 대응 방법 문제는 해결되지 않는다.',
      '제외는 역량 격차를 키울 뿐이다.',
    ],
    principle:
      '모든 호출(page) 알림은 “무엇이 영향을 받았고, 무엇을 확인하며, 어떻게 조치하는지”를 담은 런북과 연결되어야 한다.',
    refs: [
      { title: '알림 정책 문서에 변수 사용', url: 'https://docs.cloud.google.com/monitoring/alerts/doc-variables' },
    ],
  },
  {
    id: 'c04-47',
    chapter: 4,
    domain: 6,
    topic: '할당량 모니터링',
    question:
      '급성장하는 서비스가 트래픽 증가 시 새 VM을 만들지 못해 장애가 난 적이 있다. 원인은 리전의 CPU 할당량 소진이었고, 사전에 아무도 몰랐다. 재발을 막기 위한 운영 조치로 가장 적절한 것은?',
    options: [
      '장애가 날 때마다 할당량 증가를 요청한다.',
      '중요한 할당량의 사용률에 대한 알림을 설정해 임계치(예: 80%)에 도달하면 미리 증가를 요청하고, 용량 계획에 할당량 검토를 포함한다.',
      '모든 할당량을 무제한으로 설정한다.',
      '자동 확장을 끈다.',
    ],
    answer: [1],
    explanations: [
      '사후 요청은 장애 중에 처리되어야 하고 승인에 시간이 걸릴 수 있다.',
      '할당량 사용률 알림은 한도에 도달하기 전에 경고해 증가 요청과 용량 계획을 미리 할 수 있게 한다.',
      '할당량은 무제한으로 설정할 수 없으며, 비용·남용 방지를 위한 장치이기도 하다.',
      '자동 확장을 끄면 트래픽 증가에 대응하지 못한다.',
    ],
    principle:
      '할당량도 용량이다. 사용률을 모니터링하고 알림을 설정해 확장 실패를 예방한다.',
    refs: [
      { title: '할당량 알림 설정', url: 'https://docs.cloud.google.com/docs/quotas/set-up-quota-alerts' },
    ],
  },
  {
    id: 'c04-48',
    chapter: 4,
    domain: 6,
    topic: '합성 모니터링',
    question:
      '온라인 보험 가입 서비스의 홈페이지 업타임 체크는 항상 정상이지만, 실제로는 “견적 조회 → 로그인 → 결제 페이지” 흐름이 가끔 실패해 고객 불만이 접수된다. 사용자 여정 전체를 주기적으로 자동 검증하고 실패 시 알림을 받고 싶다. 가장 적합한 방법은?',
    options: [
      '업타임 체크 주기를 더 짧게 한다.',
      'Cloud Monitoring 합성 모니터로 핵심 사용자 흐름을 실행하는 테스트 스크립트를 주기적으로 실행하고, 실패 시 알림 정책을 설정한다.',
      '고객 불만이 접수되면 수동으로 흐름을 재현한다.',
      'VM의 CPU 사용률 알림을 추가한다.',
    ],
    answer: [1],
    explanations: [
      '업타임 체크는 단일 엔드포인트 응답만 확인해 여러 단계 흐름의 실패를 감지하지 못한다.',
      '합성 모니터는 사용자가 작성한 테스트(여러 단계 흐름 포함)를 주기적으로 실행하고 결과와 지연 시간을 기록하며, 실패 시 알림을 받을 수 있다.',
      '수동 재현은 사후 대응이고 사용자가 먼저 피해를 본다.',
      'CPU 지표는 기능 흐름의 실패를 알려 주지 않는다.',
    ],
    principle:
      '단일 엔드포인트 가용성은 업타임 체크, 여러 단계 사용자 여정은 합성 모니터링으로 검증한다.',
    refs: [
      { title: '합성 모니터 만들기', url: 'https://docs.cloud.google.com/monitoring/synthetic-monitors/create' },
    ],
  },
  {
    id: 'c04-49',
    chapter: 4,
    domain: 6,
    topic: '인시던트 대응 역할',
    question:
      '대형 장애 때마다 엔지니어 10여 명이 동시에 서로 다른 조치를 하고, 경영진과 고객 지원팀은 상황을 몰라 계속 질문해 대응이 혼란스럽다. 인시던트 대응 체계를 어떻게 개선해야 하는가?',
    options: [
      '가장 선임 엔지니어가 모든 작업을 직접 수행한다.',
      '인시던트 지휘자(IC), 커뮤니케이션 담당, 운영(조치) 담당 등 역할을 명확히 나누고, 정해진 채널로 정기적인 상태 업데이트를 공유한다.',
      '장애 중에는 모든 커뮤니케이션을 중단한다.',
      '장애 대응 인원을 가능한 한 많이 투입한다.',
    ],
    answer: [1],
    explanations: [
      '한 사람에게 모든 작업을 맡기면 병목이 되고 조정 역할이 사라진다.',
      '역할 분리(지휘·조치·커뮤니케이션)는 누가 결정하고 누가 조치하며 누가 알리는지를 명확히 해 중복 조치와 혼선을 줄인다. 정기 업데이트는 이해관계자의 반복 질문을 줄인다.',
      '커뮤니케이션 중단은 이해관계자의 혼란과 불신을 키운다.',
      '인원을 늘리면 조정 비용이 커지고 혼란이 더 심해질 수 있다.',
    ],
    principle:
      '인시던트 대응은 명확한 역할(IC·조치·커뮤니케이션)과 단일 상태 채널로 조정한다.',
    refs: [
      { title: 'SRE 워크북: 인시던트 대응', url: 'https://sre.google/workbook/incident-response/' },
    ],
  },
  {
    id: 'c04-50',
    chapter: 4,
    domain: 6,
    topic: 'Error Reporting',
    question:
      '팀은 배포 후 새로운 유형의 예외가 발생해도 로그 양이 많아 바로 알아차리지 못한다. 수많은 로그 중 같은 원인의 예외를 묶어 발생 횟수·최초 발생 시점을 보여 주고, 새로운 오류 그룹이 생기면 알림을 받고 싶다. 가장 적합한 서비스는?',
    options: [
      'Error Reporting',
      'Cloud Profiler',
      'VPC 흐름 로그',
      'Cloud Asset Inventory',
    ],
    answer: [0],
    explanations: [
      'Error Reporting은 애플리케이션 오류(스택 트레이스)를 자동으로 그룹화해 발생 빈도·최초/최근 발생 시점을 보여 주고, 새 오류 그룹 발생 시 알림을 보낼 수 있다.',
      'Profiler는 CPU·메모리 사용 분석 도구다.',
      '흐름 로그는 네트워크 트래픽 정보다.',
      'Asset Inventory는 리소스 인벤토리와 변경 이력을 제공한다.',
    ],
    principle:
      '배포 후 새 예외 감지는 Error Reporting의 오류 그룹화와 신규 오류 알림을 활용한다.',
    refs: [
      { title: 'Error Reporting 오류 그룹화', url: 'https://docs.cloud.google.com/error-reporting/docs/grouping-errors' },
    ],
  },
  // @@END
]
