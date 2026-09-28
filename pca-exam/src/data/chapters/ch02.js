// Chapter 2 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (13) ─────────
  {
    id: 'c02-01',
    chapter: 2,
    domain: 1,
    topic: '공유 VPC 설계',
    question:
      '대기업에 애플리케이션 팀이 12개 있고, 각 팀은 독립 프로젝트에서 VM과 GKE를 운영한다. 네트워크팀은 서브넷·방화벽·하이브리드 연결을 중앙에서 통제하려 하고, 앱 팀은 자기 프로젝트의 리소스만 관리해야 한다. 모든 팀의 워크로드는 온프레미스와 같은 사설 네트워크로 통신해야 한다. 어떤 설계가 가장 적합한가?',
    options: [
      '팀마다 독립 VPC를 만들고 모든 VPC를 서로 피어링한다.',
      '네트워크팀이 관리하는 호스트 프로젝트에 공유 VPC를 만들고, 팀 프로젝트를 서비스 프로젝트로 연결해 필요한 서브넷에만 네트워크 사용자 권한을 준다.',
      '모든 팀의 리소스를 하나의 프로젝트에 모으고 IAM 조건으로 구분한다.',
      '팀마다 VPC와 HA VPN을 각각 만들어 온프레미스에 직접 연결한다.',
    ],
    answer: [1],
    explanations: [
      '전체 메시 피어링은 VPC 수가 늘면 관리가 복잡해지고, 피어링은 전이적이지 않아 온프레미스 경로 공유에도 제약이 있다. 방화벽 중앙 통제도 어렵다.',
      '공유 VPC는 네트워크 리소스를 호스트 프로젝트에서 중앙 관리하고, 서비스 프로젝트의 팀은 허용된 서브넷에서 자기 리소스만 만든다. 하이브리드 연결도 호스트 프로젝트에 한 번만 구성하면 된다.',
      '단일 프로젝트는 할당량·결제·권한 경계가 섞여 팀 독립성과 최소 권한을 해친다.',
      '팀별 VPN은 중복 비용과 관리 부담이 크고 네트워크팀의 중앙 통제 요구와 반대다.',
    ],
    principle:
      '“네트워크는 중앙에서, 워크로드는 팀별로”가 필요하면 공유 VPC를 쓴다. 서브넷 수준 IAM으로 팀별 사용 범위를 제한한다.',
    refs: [
      { title: '공유 VPC 개요', url: 'https://docs.cloud.google.com/vpc/docs/shared-vpc' },
    ],
  },
  {
    id: 'c02-02',
    chapter: 2,
    domain: 1,
    topic: 'VPC 피어링의 비전이성',
    question:
      '회사에 VPC가 세 개 있다. 공통 서비스 VPC(Hub)는 개발 VPC와 운영 VPC 각각과 VPC 네트워크 피어링으로 연결되어 있다. 새 요구사항으로 개발 VPC의 도구가 운영 VPC의 일부 서비스에 사설 IP로 접근해야 하는데, 현재 연결되지 않는다. 확장성 있는 해결책으로 가장 적절한 것은?',
    options: [
      'Hub VPC에서 피어링 경로 가져오기/내보내기를 켜면 개발↔운영 트래픽이 Hub를 통해 전달된다.',
      'Network Connectivity Center 허브에 세 VPC를 VPC 스포크로 연결해 스포크 간 연결을 구성한다.',
      '개발 VPC와 운영 VPC의 서브넷 범위를 동일하게 맞춘다.',
      'Hub VPC에 Cloud NAT를 구성한다.',
    ],
    answer: [1],
    explanations: [
      'VPC 네트워크 피어링은 전이적이지 않다. 개발↔Hub, Hub↔운영 피어링이 있어도 개발↔운영 트래픽은 Hub를 경유해 전달되지 않는다.',
      'Network Connectivity Center의 VPC 스포크는 허브에 연결된 VPC 간 연결을 제공해 피어링의 비전이성 문제를 해결하고, VPC가 늘어나도 허브-스포크 구조로 확장된다.',
      '서브넷 범위를 같게 하면 IP가 충돌해 어떤 방식으로도 라우팅할 수 없게 된다.',
      'Cloud NAT는 인터넷 아웃바운드용이며 VPC 간 사설 연결을 제공하지 않는다.',
    ],
    principle:
      'VPC 피어링은 비전이적이다. 여러 VPC 간 연결이 필요하면 Network Connectivity Center(허브-스포크)나 필요한 쌍의 직접 피어링을 검토한다.',
    refs: [
      { title: 'VPC 네트워크 피어링', url: 'https://docs.cloud.google.com/vpc/docs/vpc-peering' },
      { title: 'Network Connectivity Center 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/overview' },
    ],
  },
  {
    id: 'c02-03',
    chapter: 2,
    domain: 1,
    topic: 'Private Service Connect',
    question:
      '핀테크 회사가 다른 조직에서 운영하는 신용 평가 SaaS를 사용한다. SaaS 공급자도 Google Cloud에서 서비스를 운영하며, 두 회사의 VPC IP 범위가 서로 겹친다. 회사는 공급자 네트워크 전체가 아니라 해당 서비스 하나에만 사설 IP로 접근하길 원한다. 가장 적합한 방법은?',
    options: [
      '두 VPC를 VPC 네트워크 피어링으로 연결한다.',
      '공급자가 서비스 연결(service attachment)로 서비스를 게시하고, 회사는 자기 VPC에 Private Service Connect 엔드포인트를 만든다.',
      '공급자 서비스를 공용 인터넷으로 호출하고 방화벽으로 IP를 제한한다.',
      '양사의 온프레미스를 경유하도록 Cloud VPN을 구성한다.',
    ],
    answer: [1],
    explanations: [
      '피어링은 IP 범위가 겹치면 구성할 수 없고, 연결되면 양쪽 네트워크 전체가 서로 라우팅되어 “서비스 하나만”이라는 요구에 맞지 않는다.',
      'Private Service Connect는 소비자 VPC의 내부 IP 엔드포인트로 공급자의 특정 서비스에만 접근하게 한다. NAT 방식이라 IP 범위가 겹쳐도 되고, 조직이 달라도 사용할 수 있다.',
      '공용 인터넷 경유는 사설 접근 요구사항에 어긋나며 노출 위험이 있다.',
      '온프레미스 경유 VPN은 불필요하게 복잡하고 지연이 늘며, IP 중복 문제도 해결하지 못한다.',
    ],
    principle:
      '“특정 서비스만, 조직 간, IP 중복 허용”의 사설 연결은 Private Service Connect의 대표 사용 사례다. 네트워크 전체 연결이 필요할 때만 피어링을 쓴다.',
    refs: [
      { title: 'Private Service Connect 개요', url: 'https://docs.cloud.google.com/vpc/docs/private-service-connect' },
    ],
  },
  {
    id: 'c02-04',
    chapter: 2,
    domain: 1,
    topic: '공유 파일 스토리지 선택',
    question:
      '엔지니어링 회사의 레거시 CAD 변환 애플리케이션이 여러 VM에서 동시에 같은 디렉터리를 POSIX 파일 시스템으로 읽고 쓴다. 코드를 수정할 수 없고, NFS 마운트를 전제로 동작한다. 관리형 서비스로 옮기려면 어떤 스토리지가 가장 적합한가?',
    options: [
      'Cloud Storage 버킷을 각 VM에서 객체 API로 접근하도록 코드를 바꾼다.',
      'Filestore 인스턴스를 만들어 각 VM에서 NFS로 마운트한다.',
      '각 VM에 Local SSD를 붙이고 rsync로 동기화한다.',
      '영구 디스크 하나를 모든 VM에 읽기-쓰기 모드로 연결한다.',
    ],
    answer: [1],
    explanations: [
      '코드 수정이 불가능하다는 제약에 어긋나며, 객체 스토리지는 POSIX 파일 잠금 등 파일 시스템 의미 체계를 제공하지 않는다.',
      'Filestore는 관리형 NFS 파일 서버로, 여러 VM이 같은 파일 시스템을 동시에 마운트해 읽고 쓸 수 있다. 코드 변경 없이 기존 NFS 기반 앱을 옮기기에 적합하다.',
      'Local SSD는 VM 수명에 묶인 임시 스토리지이며, rsync 동기화는 동시 쓰기 충돌과 데이터 유실 위험이 크다.',
      '일반 영구 디스크는 여러 VM에서 동시에 읽기-쓰기로 마운트하는 공유 파일 시스템 용도가 아니다(일반 파일 시스템은 다중 쓰기 시 손상될 수 있다).',
    ],
    principle:
      '여러 클라이언트가 공유하는 POSIX/NFS 파일 시스템 = Filestore, 객체 = Cloud Storage, 단일 VM 블록 = Persistent Disk/Hyperdisk.',
    refs: [
      { title: 'Filestore 개요', url: 'https://docs.cloud.google.com/filestore/docs/overview' },
    ],
  },
  {
    id: 'c02-05',
    chapter: 2,
    domain: 1,
    topic: '모바일 앱 데이터베이스',
    question:
      '피트니스 스타트업이 모바일 앱을 만든다. 사용자는 지하철처럼 연결이 끊긴 곳에서도 운동 기록을 입력하고, 다시 연결되면 자동 동기화되어야 한다. 친구의 기록 변경은 실시간으로 화면에 반영되어야 하며, 백엔드 서버 운영 인력은 최소화하고 싶다. 어떤 데이터베이스가 가장 적합한가?',
    options: [
      'Cloud SQL for MySQL과 자체 REST API 서버',
      'Firestore(Native 모드)와 모바일 클라이언트 SDK',
      'Bigtable과 Cloud Run API',
      'BigQuery와 스트리밍 삽입',
    ],
    answer: [1],
    explanations: [
      'Cloud SQL을 쓰려면 API 서버와 동기화 로직을 직접 구현·운영해야 하며, 오프라인 동기화나 실시간 리스너를 기본 제공하지 않는다.',
      'Firestore는 모바일·웹 SDK에서 오프라인 지속성과 재연결 시 자동 동기화, 실시간 리스너를 제공하는 서버리스 문서 DB다. 백엔드 운영을 최소화하려는 요구에 맞다.',
      'Bigtable은 대규모 분석·시계열용으로, 모바일 오프라인 동기화 기능이 없고 소규모 앱에는 비용이 과하다.',
      'BigQuery는 분석용 웨어하우스로 앱의 트랜잭션 저장소가 아니다.',
    ],
    principle:
      '모바일·웹 클라이언트 직접 연결 + 오프라인 동기화 + 실시간 업데이트는 Firestore의 대표 사용 사례다.',
    refs: [
      { title: 'Firestore 개요', url: 'https://docs.cloud.google.com/firestore/native/docs/overview' },
    ],
  },
  {
    id: 'c02-06',
    chapter: 2,
    domain: 1,
    topic: 'AlloyDB(운영+분석 혼합)',
    question:
      '이커머스 회사의 PostgreSQL 주문 DB에서, 운영팀이 실시간 매출 분석 쿼리를 직접 실행해 트랜잭션 성능이 떨어지는 문제가 있다. 애플리케이션은 PostgreSQL 호환성을 유지해야 하고, 분석 쿼리는 최신 데이터로 빠르게 실행되어야 한다. 별도 ETL 파이프라인 구축은 피하고 싶다. 가장 적합한 선택은?',
    options: [
      'Cloud SQL for MySQL로 이전한다.',
      'AlloyDB for PostgreSQL로 이전하고, 읽기 풀 인스턴스와 열 기반 엔진으로 분석 쿼리를 처리한다.',
      '매일 밤 데이터를 CSV로 내보내 BigQuery에 적재한다.',
      'Bigtable로 이전하고 분석은 Dataflow로 처리한다.',
    ],
    answer: [1],
    explanations: [
      'MySQL로 바꾸면 PostgreSQL 호환성 요구사항을 위반하고 분석 성능 문제도 해결하지 못한다.',
      'AlloyDB는 PostgreSQL 호환 관리형 DB로, 읽기 풀로 분석 부하를 기본 인스턴스에서 분리하고 열 기반 엔진으로 분석 쿼리를 가속한다. ETL 없이 최신 데이터로 분석할 수 있다.',
      '일일 적재는 실시간 분석 요구를 충족하지 못하고 ETL 파이프라인 구축이 필요하다.',
      'Bigtable은 관계형이 아니어서 애플리케이션 호환성이 깨진다.',
    ],
    principle:
      'PostgreSQL 호환 + 트랜잭션과 분석 혼합(HTAP) 요구는 AlloyDB의 강점이다. 대규모 전사 분석은 여전히 BigQuery가 적합하다.',
    refs: [
      { title: 'AlloyDB for PostgreSQL 개요', url: 'https://docs.cloud.google.com/alloydb/docs/overview' },
      { title: 'AlloyDB 열 기반 엔진', url: 'https://docs.cloud.google.com/alloydb/docs/columnar-engine/about' },
    ],
  },
  {
    id: 'c02-07',
    chapter: 2,
    domain: 1,
    topic: '캐싱 전략',
    question:
      '뉴스 사이트의 기사 상세 API는 Cloud SQL에서 기사와 댓글 수를 조회한다. 인기 기사에 요청이 몰리면 DB CPU가 포화되며, 기사 내용은 몇 분 정도 오래된 데이터여도 괜찮다. DB 부하를 줄이고 응답 지연을 낮추는 가장 효과적인 방법은?',
    options: [
      'Cloud SQL 인스턴스의 머신 유형을 최대로 키운다.',
      'Memorystore(Redis 호환)를 캐시로 두고, 기사 조회 결과를 TTL과 함께 저장하는 캐시 어사이드 패턴을 적용한다.',
      '모든 기사를 BigQuery로 옮겨 조회한다.',
      '애플리케이션 인스턴스 수를 늘린다.',
    ],
    answer: [1],
    explanations: [
      '수직 확장은 비용이 크고 한계가 있으며, 반복되는 동일 조회라는 근본 원인을 해결하지 못한다.',
      '읽기 위주이며 약간의 지연된 데이터가 허용되는 경우, 인메모리 캐시에 TTL과 함께 저장하면 반복 조회가 DB에 도달하지 않아 부하와 지연이 크게 줄어든다.',
      'BigQuery는 분석용으로 웹 API의 저지연 단건 조회에 적합하지 않다.',
      '애플리케이션을 늘리면 DB로 가는 쿼리가 더 늘어 병목이 악화된다.',
    ],
    principle:
      '읽기 집중 + 약간의 지연 허용이면 캐시(Memorystore, CDN)를 먼저 검토한다. TTL과 무효화 전략으로 최신성 요구를 조절한다.',
    refs: [
      { title: 'Memorystore for Redis 개요', url: 'https://docs.cloud.google.com/memorystore/docs/redis/memorystore-for-redis-overview' },
    ],
  },
  {
    id: 'c02-08',
    chapter: 2,
    domain: 1,
    topic: 'Hadoop/Spark 워크로드 이전',
    question:
      '통신사가 온프레미스 Hadoop 클러스터에서 수백 개의 Spark 배치 작업을 하루 몇 시간만 실행한다. 클러스터는 24시간 가동되며 HDFS에 데이터가 있다. 코드 수정을 최소화하면서 클라우드에서 비용을 줄이고 싶다. 가장 적합한 방안은?',
    options: [
      'Compute Engine에 동일한 규모의 Hadoop 클러스터를 설치하고 24시간 운영한다.',
      '데이터를 Cloud Storage로 옮기고, 작업 실행 시에만 Managed Service for Apache Spark(구 Dataproc) 클러스터를 만들어 처리 후 삭제하거나 서버리스 Spark로 실행한다.',
      '모든 Spark 작업을 BigQuery SQL로 다시 작성한다.',
      'Bigtable에 데이터를 넣고 Spark 작업을 Cloud Run functions로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      '동일 구성 리호스트는 유휴 시간에도 비용을 계속 내고 Hadoop 운영 부담도 그대로다.',
      'Managed Service for Apache Spark(구 Dataproc)는 기존 Spark 코드를 거의 그대로 실행하며, 데이터를 Cloud Storage에 두면 계산과 저장이 분리되어 필요할 때만 클러스터를 띄우는 임시(ephemeral) 방식으로 비용을 크게 줄일 수 있다.',
      '전면 재작성은 코드 수정 최소화 요구에 어긋나고 시간이 오래 걸린다.',
      '함수 기반 재작성은 대규모 분산 처리에 맞지 않고 전면 재개발이 필요하다.',
    ],
    principle:
      'Hadoop/Spark 이전의 핵심은 스토리지(Cloud Storage)와 컴퓨팅(Managed Service for Apache Spark)의 분리다. 작업 단위 임시 클러스터로 유휴 비용을 없앤다.',
    refs: [
      { title: 'Managed Service for Apache Spark(구 Dataproc) 클러스터 개요', url: 'https://docs.cloud.google.com/managed-spark/docs/concepts/clusters-overview' },
      { title: '클러스터형과 서버리스 Spark 비교', url: 'https://docs.cloud.google.com/managed-spark/docs/concepts/serverless-spark-compare' },
    ],
  },
  {
    id: 'c02-09',
    chapter: 2,
    domain: 1,
    topic: 'VM 리호스트 마이그레이션',
    question:
      '보험사가 VMware vSphere에서 운영 중인 VM 200대를 Compute Engine으로 옮긴다. 요구사항은 (1) 본격 전환 전에 클라우드에서 복제본으로 테스트, (2) 전환 시 다운타임 최소화, (3) 문제가 있으면 원래 환경으로 되돌릴 수 있어야 함이다. 가장 적합한 도구는?',
    options: [
      '각 VM의 디스크 이미지를 수동으로 내보내 Cloud Storage에 올린 뒤 이미지로 가져온다.',
      'Migrate to Virtual Machines로 소스 VM을 지속 복제하고, 테스트 클론으로 검증한 뒤 전환(cut-over)한다.',
      '모든 애플리케이션을 컨테이너로 재작성해 GKE에 배포한다.',
      'Transfer Appliance로 VM 파일을 배송한다.',
    ],
    answer: [1],
    explanations: [
      '수동 이미지 내보내기는 VM 수가 많을수록 부담이 크고, 지속 복제가 없어 전환 시 다운타임이 길어진다.',
      'Migrate to Virtual Machines는 소스 VM을 백그라운드에서 복제하고, 운영에 영향 없이 테스트 클론을 만들어 검증하며, 짧은 다운타임으로 전환하고 필요 시 되돌릴 수 있게 한다.',
      '컨테이너 재작성은 리호스트 요구보다 범위가 훨씬 크고 일정·위험이 커진다.',
      'Transfer Appliance는 대용량 데이터 오프라인 전송 수단으로 VM 전환·테스트 흐름을 제공하지 않는다.',
    ],
    principle:
      'VM 리호스트는 지속 복제 → 테스트 클론 검증 → 전환 → (필요 시) 롤백 흐름을 제공하는 Migrate to Virtual Machines로 진행한다.',
    refs: [
      { title: 'Migrate to Virtual Machines 마이그레이션 수명 주기', url: 'https://docs.cloud.google.com/migrate/virtual-machines/docs/5.0/discover/lifecycle' },
    ],
  },
  {
    id: 'c02-10',
    chapter: 2,
    domain: 1,
    topic: 'Google Cloud VMware Engine',
    question:
      '제조사의 데이터센터 임대 계약이 4개월 후 만료된다. VMware 기반 VM 800대가 있으며, 운영팀은 vCenter·NSX 등 기존 도구와 절차를 그대로 쓰길 원한다. 애플리케이션 현대화는 이전 이후에 단계적으로 할 계획이다. 가장 적합한 이전 방식은?',
    options: [
      '모든 VM을 Compute Engine으로 변환해 이전한다.',
      'Google Cloud VMware Engine에 프라이빗 클라우드를 만들고 VMware HCX 등으로 VM을 그대로 이전한다.',
      '모든 애플리케이션을 Cloud Run으로 재작성한다.',
      '임대 계약을 연장하고 현대화가 끝나면 이전한다.',
    ],
    answer: [1],
    explanations: [
      'Compute Engine 변환도 가능하지만 800대를 4개월 안에 변환·검증하는 것은 위험이 크고, 기존 VMware 운영 도구를 쓸 수 없다.',
      'VMware Engine은 Google Cloud에서 전용 VMware 환경을 제공하므로 기존 VM과 도구·절차를 그대로 유지하면서 빠르게 데이터센터를 철수할 수 있다. 이후 단계적 현대화의 발판이 된다.',
      '전면 재작성은 4개월 일정에 절대 맞출 수 없다.',
      '임대 연장은 데이터센터 철수 목표에 반하며 비용이 계속 발생한다.',
    ],
    principle:
      '짧은 기한 + 대규모 VMware 자산 + 기존 운영 도구 유지 = VMware Engine으로 먼저 이전(리호스트), 현대화는 나중에.',
    refs: [
      { title: 'Google Cloud VMware Engine 개요', url: 'https://docs.cloud.google.com/vmware-engine/docs/overview' },
    ],
  },
  {
    id: 'c02-11',
    chapter: 2,
    domain: 1,
    topic: '멀티클라우드 연결',
    question:
      '미디어 회사가 AWS에 있는 데이터 레이크와 Google Cloud의 BigQuery 분석 환경 사이에서 매일 수십 TB를 주고받는다. 공용 인터넷 경유는 성능이 불안정하고 보안팀도 반대한다. 회사는 두 클라우드 사이에 고대역폭 전용 연결을 원하며, 자체 코로케이션 장비는 두고 싶지 않다. 가장 적합한 방법은?',
    options: [
      'HA VPN으로 AWS VPN 게이트웨이와 연결한다.',
      'Cross-Cloud Interconnect로 Google Cloud와 AWS 사이에 전용 물리 연결을 구성한다.',
      '두 클라우드 사이의 데이터를 매일 Transfer Appliance로 배송한다.',
      '온프레미스 데이터센터를 경유하도록 두 개의 Dedicated Interconnect를 구성한다.',
    ],
    answer: [1],
    explanations: [
      'HA VPN은 인터넷 경유 암호화 터널로, 매일 수십 TB 수준의 안정적인 고대역폭 요구에 불리하다.',
      'Cross-Cloud Interconnect는 Google Cloud와 다른 클라우드 공급자 사이에 Google이 관리하는 전용 물리 연결을 제공해, 고객이 코로케이션 장비를 두지 않고도 고대역폭 사설 연결을 쓸 수 있다.',
      '매일 반복되는 전송에 물리 장비 배송은 맞지 않는다.',
      '온프레미스 경유는 불필요한 장비·지연·비용을 추가하고, 코로케이션 장비를 두지 않겠다는 요구와도 맞지 않는다.',
    ],
    principle:
      '클라우드 간 고대역폭 사설 연결은 Cross-Cloud Interconnect, 온프레미스 연결은 Dedicated/Partner Interconnect, 저비용·저대역폭은 HA VPN으로 구분한다.',
    refs: [
      { title: 'Cross-Cloud Interconnect 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/cci-overview' },
    ],
  },
  {
    id: 'c02-12',
    chapter: 2,
    domain: 1,
    topic: '생성형 AI 모델 사용 방식 선택',
    question:
      '고객 지원팀이 상담 기록을 요약하는 기능을 원한다. 사용량은 월별로 크게 변동하고, 회사에는 ML 인프라를 운영할 인력이 없다. 일반적인 요약 품질이면 충분하며, 빠르게 출시하는 것이 가장 중요하다. 어떤 방식이 가장 적합한가?',
    options: [
      '오픈 모델을 다운로드해 GPU 노드 풀을 갖춘 GKE 클러스터에서 직접 서빙한다.',
      'Gemini Enterprise Agent Platform(구 Vertex AI)에서 관리형 API로 제공되는 Gemini 모델을 호출하고, 사용량 기반으로 비용을 낸다.',
      '상담 기록으로 새 언어 모델을 처음부터 학습한다.',
      'TPU 예약을 1년 약정으로 구매해 자체 모델을 서빙한다.',
    ],
    answer: [1],
    explanations: [
      '자체 서빙은 GPU 용량 확보·확장·패치 등 ML 인프라 운영이 필요해 인력이 없는 팀에 맞지 않고, 사용량이 적은 달에도 유휴 비용이 든다.',
      '관리형 모델 API는 인프라 운영 없이 바로 호출할 수 있고 사용량 기반 과금이라 변동하는 수요에 맞다. 일반 요약 품질이면 기본 모델과 프롬프트로 충분하다.',
      '처음부터 학습하는 것은 비용·시간·전문성이 모두 과도하다.',
      '장기 약정 자체 서빙은 변동 수요와 운영 인력 부재라는 조건에 모두 맞지 않는다.',
    ],
    principle:
      '생성형 AI는 “관리형 모델 API → 프롬프트·그라운딩 → 튜닝 → 자체 서빙” 순으로 필요할 때만 복잡도를 올린다.',
    refs: [
      { title: 'Gemini Enterprise Agent Platform 명칭 변경', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes' },
      { title: 'Well-Architected Framework: AI 및 ML 관점', url: 'https://docs.cloud.google.com/architecture/framework/perspectives/ai-ml' },
    ],
  },
  {
    id: 'c02-13',
    chapter: 2,
    domain: 1,
    topic: 'Gemini Cloud Assist',
    question:
      '소규모 클라우드 팀이 수십 개 프로젝트를 운영한다. 장애가 나면 로그·지표·구성 변경 내역을 여러 콘솔 화면에서 수작업으로 대조하느라 원인 파악에 오래 걸린다. 팀은 Google Cloud 콘솔 안에서 자연어로 질문하고, 관련 리소스와 신호를 바탕으로 문제 원인 가설을 제시받는 AI 지원 기능을 원한다. 가장 적합한 것은?',
    options: [
      'Gemini Cloud Assist를 사용해 리소스 맥락 기반 질의와 문제 조사(investigation)를 수행한다.',
      '모든 로그를 BigQuery로 내보낸 뒤 SQL 쿼리를 직접 작성한다.',
      '각 프로젝트마다 사용자 정의 대시보드를 수백 개 만든다.',
      'Error Reporting 알림 이메일을 늘린다.',
    ],
    answer: [0],
    explanations: [
      'Gemini Cloud Assist는 Google Cloud 콘솔에서 사용자의 리소스·로그·지표 맥락을 바탕으로 자연어 질의에 답하고, 문제 조사 기능으로 원인 가설과 다음 단계를 제시해 트러블슈팅 시간을 줄이도록 돕는다.',
      'BigQuery 분석은 강력하지만 질문마다 쿼리를 직접 작성해야 하므로, 자연어 기반 AI 지원이라는 요구와 맞지 않는다.',
      '대시보드를 대량으로 만들면 관리 부담만 늘고 원인 분석을 자동화하지 못한다.',
      '알림을 늘리는 것은 원인 파악을 돕지 않고 알림 피로를 키운다.',
    ],
    principle:
      'Gemini Cloud Assist는 설계·운영·문제 해결 단계에서 리소스 맥락을 이해하는 AI 지원을 제공한다. AI의 제안은 최종 결정 전 사람이 검증한다.',
    refs: [
      { title: 'Gemini Cloud Assist 개요', url: 'https://docs.cloud.google.com/cloud-assist/overview' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (9) ─────────
  {
    id: 'c02-14',
    chapter: 2,
    domain: 2,
    topic: '방화벽 규칙 대상(서비스 계정)',
    question:
      '같은 서브넷에 웹 VM과 DB VM이 섞여 있다. DB VM의 3306 포트는 웹 VM에서만 접근 가능해야 한다. 현재는 네트워크 태그로 규칙을 만들었는데, 프로젝트의 여러 개발자가 VM에 임의로 태그를 추가할 수 있어 규칙이 우회될 위험이 지적되었다. 더 안전한 방법은?',
    options: [
      '네트워크 태그 이름을 추측하기 어렵게 바꾼다.',
      '웹 VM과 DB VM에 서로 다른 서비스 계정을 연결하고, 소스·대상을 서비스 계정으로 지정한 방화벽 규칙을 사용한다.',
      '웹 VM의 IP 주소를 하나씩 소스 범위로 등록한다.',
      'DB VM에 외부 IP를 부여하고 Cloud Armor로 보호한다.',
    ],
    answer: [1],
    explanations: [
      '태그 이름을 바꿔도 인스턴스를 수정할 권한이 있는 사람은 여전히 태그를 붙일 수 있어 근본적인 통제가 되지 않는다.',
      '서비스 계정 기반 규칙은 VM에 해당 서비스 계정을 연결할 권한(서비스 계정 사용자 역할)이 있어야만 적용되므로, 태그보다 강하게 통제된다. 역할이 다른 워크로드를 신원 기준으로 구분할 수 있다.',
      '자동 확장되는 웹 VM의 IP를 일일이 관리하는 것은 비현실적이고 오류가 잦다.',
      'DB에 외부 IP를 부여하는 것은 노출을 늘리며, Cloud Armor는 VM 방화벽 대용이 아니다.',
    ],
    principle:
      '방화벽 대상 지정은 태그보다 서비스 계정이 더 안전하다. 태그는 인스턴스 수정 권한만으로 바꿀 수 있기 때문이다.',
    refs: [
      { title: 'VPC 방화벽 규칙: 서비스 계정 기반 필터링', url: 'https://docs.cloud.google.com/firewall/docs/firewalls' },
    ],
  },
  {
    id: 'c02-15',
    chapter: 2,
    domain: 2,
    topic: 'HA VPN 구성',
    question:
      '중소기업이 비용을 고려해 Interconnect 대신 VPN으로 온프레미스와 연결하려 한다. 연결 계층에 99.99% 가용성 SLA가 필요하고, 온프레미스에는 VPN 장비가 두 대 있다. 어떻게 구성해야 하는가?',
    options: [
      '기본(Classic) VPN 게이트웨이 하나와 정적 경로를 사용한다.',
      'HA VPN 게이트웨이의 두 인터페이스에서 온프레미스 두 장비로 각각 터널을 만들고, Cloud Router로 BGP 동적 라우팅을 구성한다.',
      'HA VPN 게이트웨이의 인터페이스 하나에서만 터널 하나를 만든다.',
      '두 리전에 각각 기본 VPN 터널을 하나씩 만든다.',
    ],
    answer: [1],
    explanations: [
      '기본 VPN은 99.99% SLA를 제공하지 않으며 정적 경로는 장애 시 자동 전환이 어렵다.',
      'HA VPN은 두 인터페이스와 두 개 이상의 터널을 올바르게 구성하고 Cloud Router로 BGP를 사용할 때 99.99% SLA를 제공한다. 한 터널·장비가 실패해도 BGP가 자동으로 경로를 전환한다.',
      '터널이 하나면 단일 장애 지점이 남아 99.99% 구성 요건을 충족하지 못한다.',
      '기본 VPN 조합으로는 HA VPN의 99.99% SLA를 얻을 수 없다.',
    ],
    principle:
      'HA VPN 99.99%는 “게이트웨이 두 인터페이스 × 이중화된 피어 × BGP(Cloud Router)” 구성을 갖춰야 한다.',
    refs: [
      { title: 'HA VPN 토폴로지', url: 'https://docs.cloud.google.com/network-connectivity/docs/vpn/concepts/topologies' },
    ],
  },
  {
    id: 'c02-16',
    chapter: 2,
    domain: 2,
    topic: 'Cloud Storage 보존 정책(WORM)',
    question:
      '증권사가 규정에 따라 거래 기록 파일을 7년간 수정·삭제할 수 없는 WORM(Write Once Read Many) 방식으로 보관해야 한다. 관리자 권한을 가진 사람도 보관 기간 중에는 삭제할 수 없어야 한다. 어떻게 구성해야 하는가?',
    options: [
      '버킷에 객체 버전 관리를 사용 설정한다.',
      '버킷에 7년 보존 정책을 설정하고 버킷 잠금(Bucket Lock)으로 정책을 잠근다.',
      'IAM으로 모든 사용자에게서 삭제 권한을 제거한다.',
      '수명 주기 규칙으로 7년 후 삭제되도록 설정한다.',
    ],
    answer: [1],
    explanations: [
      '버전 관리는 이전 버전을 보존하지만 권한 있는 사용자가 버전을 삭제할 수 있어 WORM 보장이 되지 않는다.',
      '보존 정책은 객체가 보존 기간을 채우기 전에는 삭제·덮어쓰기를 막고, 정책을 잠그면 관리자도 정책을 줄이거나 제거할 수 없다. 규제용 WORM 요구를 충족한다.',
      'IAM 권한은 관리자가 다시 부여할 수 있어 “관리자도 삭제 불가”를 보장하지 못한다.',
      '수명 주기 삭제는 보관 기간 이후 정리일 뿐, 기간 중 삭제를 막지 못한다.',
    ],
    principle:
      '규제용 불변 보관은 보존 정책 + 버킷 잠금으로 한다. 잠금은 되돌릴 수 없으므로 기간을 신중히 정한다.',
    refs: [
      { title: '보존 정책과 버킷 잠금', url: 'https://docs.cloud.google.com/storage/docs/bucket-lock' },
    ],
  },
  {
    id: 'c02-17',
    chapter: 2,
    domain: 2,
    topic: '디스크 스냅샷 일정',
    question:
      'Compute Engine에서 실행되는 자체 관리 애플리케이션 서버의 영구 디스크를 매일 백업하고 14일간 보관해야 한다. 스냅샷은 원본과 다른 리전에도 보관되어야 하며, 스크립트 운영은 원하지 않는다. 어떻게 해야 하는가?',
    options: [
      'cron VM에서 매일 gcloud 명령으로 스냅샷을 만들고 오래된 것을 지운다.',
      '스냅샷 일정 리소스 정책(매일, 보존 14일, 멀티 리전 저장 위치)을 만들어 디스크에 연결한다.',
      '매일 머신 이미지를 수동으로 만든다.',
      '디스크를 리전 영구 디스크로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      'cron 스크립트는 동작하지만 실패 감지·관리가 필요해 스크립트 운영을 원치 않는 요구와 맞지 않는다.',
      '스냅샷 일정은 생성 주기와 보존 기간을 자동으로 관리하며, 멀티 리전 또는 다른 리전 저장 위치를 지정해 원본 리전 장애에도 복원할 수 있다.',
      '수동 작업은 누락 위험이 있고 자동화 요구에 어긋난다.',
      '리전 영구 디스크는 영역 간 동기 복제로 가용성을 높이지만, 삭제·손상에 대비한 시점 백업이 아니다.',
    ],
    principle:
      '복제(가용성)와 백업(시점 복구)은 다르다. 디스크 백업은 스냅샷 일정으로 자동화하고 저장 위치로 지리적 분리를 확보한다.',
    refs: [
      { title: '스냅샷 일정 만들기', url: 'https://docs.cloud.google.com/compute/docs/disks/scheduled-snapshots' },
    ],
  },
  {
    id: 'c02-18',
    chapter: 2,
    domain: 2,
    topic: 'GKE Autopilot',
    question:
      '스타트업이 마이크로서비스 20개를 Kubernetes로 운영하려 한다. 팀은 Kubernetes 매니페스트 작성은 익숙하지만, 노드 크기 선정·노드 업그레이드·보안 강화 같은 노드 관리는 하고 싶지 않다. 비용은 실제로 요청한 파드 리소스만큼 내고 싶다. 가장 적합한 선택은?',
    options: [
      'GKE Standard 클러스터에 클러스터 자동 확장을 켠다.',
      'GKE Autopilot 클러스터를 사용한다.',
      'Compute Engine VM에 kubeadm으로 클러스터를 직접 구성한다.',
      '각 마이크로서비스를 별도 GKE Standard 클러스터로 운영한다.',
    ],
    answer: [1],
    explanations: [
      'Standard는 자동 확장을 켜도 노드 풀 구성·업그레이드 전략 등 노드 관리 책임이 남고, 노드 단위로 과금된다.',
      'Autopilot은 Google이 노드를 프로비저닝·관리·보안 강화하고, 파드 리소스 요청 기준으로 과금한다. Kubernetes API는 그대로 쓰면서 노드 운영을 없애려는 요구에 맞다.',
      '직접 구성은 컨트롤 플레인까지 관리해야 해 운영 부담이 가장 크다.',
      '서비스별 클러스터는 비용과 관리 부담을 크게 늘린다.',
    ],
    principle:
      'Kubernetes를 쓰되 노드 운영을 원치 않으면 Autopilot, 노드 수준 세부 제어(특수 커널 설정 등)가 필요하면 Standard를 고른다.',
    refs: [
      { title: 'GKE Autopilot 개요', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview' },
    ],
  },
  {
    id: 'c02-19',
    chapter: 2,
    domain: 2,
    topic: 'MIG 순차적 업데이트',
    question:
      '리전 MIG에서 VM 12대로 운영 중인 웹 서비스에 새 인스턴스 템플릿을 적용해야 한다. 업데이트 중에도 서비스 용량이 12대 미만으로 떨어지면 안 되며, 추가 VM 비용은 잠시 허용된다. 어떻게 설정해야 하는가?',
    options: [
      'maxSurge 0, maxUnavailable 3으로 순차적 업데이트를 수행한다.',
      'maxSurge를 1 이상, maxUnavailable 0으로 설정해 순차적 업데이트를 수행한다.',
      'MIG를 삭제하고 새 템플릿으로 다시 만든다.',
      '모든 VM을 동시에 다시 만드는 업데이트를 수행한다.',
    ],
    answer: [1],
    explanations: [
      'maxUnavailable 3이면 업데이트 중 최대 3대가 동시에 빠져 용량이 12대 미만으로 떨어진다.',
      'maxUnavailable을 0으로 두면 기존 VM을 내리기 전에 새 VM을 먼저 추가(maxSurge)하므로 용량이 유지된다. 잠시 늘어나는 VM 비용은 허용된다는 조건에 맞다.',
      '삭제 후 재생성은 서비스 중단을 일으킨다.',
      '동시 재생성은 용량이 한꺼번에 사라져 장애가 발생한다.',
    ],
    principle:
      '순차적 업데이트에서 maxSurge는 “추가로 늘릴 수”, maxUnavailable은 “동시에 뺄 수”다. 용량 유지가 필수면 maxUnavailable 0 + maxSurge ≥ 1.',
    refs: [
      { title: 'MIG 순차적 업데이트', url: 'https://docs.cloud.google.com/compute/docs/instance-groups/rolling-out-updates-to-managed-instance-groups' },
    ],
  },
  {
    id: 'c02-20',
    chapter: 2,
    domain: 2,
    topic: 'OS 패치 관리',
    question:
      '회사에 Linux·Windows VM 1,500대가 여러 프로젝트에 흩어져 있다. 보안팀은 매월 정해진 유지보수 기간에 OS 보안 패치를 자동 적용하고, 어떤 VM이 패치 대상인지와 적용 결과를 한곳에서 보고받고 싶다. 가장 적합한 방법은?',
    options: [
      '각 VM에 로그인해 수동으로 업데이트한다.',
      'VM Manager의 OS 패치 관리로 패치 배포 일정을 만들고 패치 준수 보고서를 확인한다.',
      '모든 VM을 매월 새 이미지로 다시 만든다.',
      '각 팀에 패치를 알아서 적용하라는 공지를 보낸다.',
    ],
    answer: [1],
    explanations: [
      '1,500대 수동 패치는 불가능에 가깝고 누락과 불일치가 발생한다.',
      'VM Manager OS 패치 관리는 대상 VM을 필터로 지정해 일정 기반 패치 배포를 실행하고, 패치 준수 상태와 결과를 중앙에서 보고한다.',
      '불변 인프라 방식은 좋은 방향이지만 모든 워크로드가 이미지 재생성으로 바로 전환 가능한 것은 아니며, 질문의 자동 패치·보고 요구에 대한 직접적인 해법이 아니다.',
      '공지만으로는 강제력과 가시성이 없다.',
    ],
    principle:
      '대규모 VM 패치는 VM Manager(OS 패치 관리·인벤토리·정책)로 일정·대상·보고를 중앙화한다.',
    refs: [
      { title: 'VM Manager OS 패치 관리', url: 'https://docs.cloud.google.com/compute/vm-manager/docs/patch' },
    ],
  },
  {
    id: 'c02-21',
    chapter: 2,
    domain: 2,
    topic: 'GPU 용량 확보(예약)',
    question:
      'AI 연구팀이 다음 달 특정 날짜부터 2주간 대규모 GPU 학습을 수행한다. 해당 기간에 필요한 GPU VM 수를 반드시 확보해야 하며, 학습이 중단되면 안 된다. 어떤 방법이 가장 적합한가?',
    options: [
      '학습 시작 당일 Spot VM으로 GPU를 요청한다.',
      '해당 리전·영역에 필요한 GPU 머신 유형의 Compute Engine 예약을 미리 만들어 용량을 확보한다.',
      '학습 시작 당일 주문형 VM을 요청하고, 부족하면 다른 리전을 시도한다.',
      '3년 약정 사용 할인을 구매하면 용량이 자동으로 보장된다.',
    ],
    answer: [1],
    explanations: [
      'Spot VM은 용량이 보장되지 않고 언제든 선점될 수 있어 중단 불가 요구에 맞지 않는다.',
      '예약은 특정 영역에 지정한 머신 유형의 용량을 미리 확보해, 필요한 시점에 VM을 확실히 만들 수 있게 한다. 인기 있는 GPU처럼 용량이 부족할 수 있는 자원에 적합하다.',
      '당일 요청은 해당 시점 용량 상황에 따라 실패할 수 있고, 데이터 위치와 다른 리전에서 실행하면 비용·지연이 늘어난다.',
      '약정 할인은 가격 할인이지 그 자체로 용량을 보장하지 않는다. 용량 보장은 예약으로 한다.',
    ],
    principle:
      '약정(CUD) = 가격, 예약(Reservation) = 용량 보장. 둘은 별개이며 함께 사용할 수 있다.',
    refs: [
      { title: 'Compute Engine 영역 리소스 예약', url: 'https://docs.cloud.google.com/compute/docs/instances/reservations-overview' },
    ],
  },
  {
    id: 'c02-22',
    chapter: 2,
    domain: 2,
    topic: '사전 학습 AI API 선택(음성)',
    question:
      '온라인 강의 플랫폼이 매주 업로드되는 수백 시간 분량의 강의 영상에 한국어 자막을 자동 생성하려 한다. 자막 파일에는 시간 정보가 필요하고, 자체 모델 학습 없이 관리형 API로 처리하고 싶다. 가장 적합한 서비스는?',
    options: [
      'Cloud Vision API의 텍스트 감지',
      'Speech-to-Text API로 오디오 트랙을 텍스트로 변환하고 단어별 시간 정보를 활용한다.',
      'Natural Language API의 감정 분석',
      'Translation API',
    ],
    answer: [1],
    explanations: [
      'Vision API 텍스트 감지는 이미지 속 글자를 읽을 뿐, 음성을 텍스트로 바꾸지 않는다.',
      'Speech-to-Text는 긴 오디오의 일괄 인식과 단어별 타임스탬프를 제공해 자막 생성에 필요한 텍스트와 시간 정보를 얻을 수 있다.',
      '감정 분석은 텍스트의 감정 경향을 분석할 뿐 자막 생성과 무관하다.',
      'Translation API는 이미 텍스트가 있을 때 언어를 바꾸는 서비스다. 원문 자막 생성에는 먼저 음성 인식이 필요하다.',
    ],
    principle:
      '사전 학습 API는 입력 유형으로 고른다: 음성→Speech-to-Text, 이미지→Vision, 영상→Video Intelligence, 문서→Document AI, 텍스트 번역→Translation.',
    refs: [
      { title: 'Speech-to-Text 개요', url: 'https://docs.cloud.google.com/speech-to-text/docs/v1/speech-to-text-requests' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (9) ─────────
  {
    id: 'c02-23',
    chapter: 2,
    domain: 3,
    topic: '계층식 방화벽 정책',
    question:
      '보안팀은 조직 내 모든 프로젝트에서 인터넷(0.0.0.0/0)으로부터의 SSH·RDP 접근을 금지하려 한다. 각 프로젝트 관리자가 VPC 방화벽 규칙을 자유롭게 만들 수 있는 현재 구조에서도 이 금지가 우회되지 않아야 하며, IAP 터널링 대역에서의 접근은 허용해야 한다. 어떻게 구성해야 하는가?',
    options: [
      '각 프로젝트의 VPC에 거부 규칙을 만들고 우선순위를 높게 설정한다.',
      '조직 수준 계층식 방화벽 정책에 IAP 대역의 22·3389 포트 허용 규칙과 그 밖의 모든 소스에 대한 거부 규칙을 두어 하위 VPC 규칙보다 먼저 평가되게 한다.',
      '모든 VM에서 SSH 데몬을 제거한다.',
      'Cloud Armor 정책으로 SSH 포트를 차단한다.',
    ],
    answer: [1],
    explanations: [
      '프로젝트 VPC 규칙은 프로젝트 관리자가 수정·삭제할 수 있어 우회를 막지 못한다.',
      '계층식 방화벽 정책은 조직·폴더 수준에서 적용되어 VPC 방화벽 규칙보다 먼저 평가되며, 프로젝트 관리자가 변경할 수 없다. 필요한 예외(IAP 대역)를 허용하고 나머지를 거부하면 조직 전체에 일관되게 강제된다.',
      'SSH 제거는 운영 접근까지 막고 Windows RDP 문제도 해결하지 못한다.',
      'Cloud Armor는 외부 부하 분산기 트래픽용으로, VM의 SSH 직접 접근을 제어하지 않는다.',
    ],
    principle:
      '조직 전체에 강제해야 하는 네트워크 규칙은 계층식 방화벽 정책으로 상위에서 적용한다. 하위 관리자가 우회할 수 없다.',
    refs: [
      { title: '계층식 방화벽 정책', url: 'https://docs.cloud.google.com/firewall/docs/firewall-policies' },
    ],
  },
  {
    id: 'c02-24',
    chapter: 2,
    domain: 3,
    topic: '서비스 계정 가장(impersonation)',
    question:
      '운영 엔지니어들이 배포 자동화용 서비스 계정의 키 파일을 노트북에 내려받아 gcloud와 Terraform을 실행하고 있다. 보안팀은 장기 키를 없애고, 누가 서비스 계정 권한을 사용했는지 감사 로그로 추적하길 원한다. 가장 적절한 방법은?',
    options: [
      '키 파일을 암호화된 USB에 보관하게 한다.',
      '엔지니어 그룹에 해당 서비스 계정에 대한 서비스 계정 토큰 생성자 역할을 부여하고, 가장(impersonation)으로 단기 토큰을 발급받아 사용하게 한 뒤 키를 삭제한다.',
      '엔지니어 개인 계정에 서비스 계정과 같은 권한을 모두 직접 부여한다.',
      '서비스 계정 키를 매주 새로 발급한다.',
    ],
    answer: [1],
    explanations: [
      '보관 방식을 바꿔도 장기 키가 존재하고, 키를 쓴 사람이 누구인지 감사 로그로 구분하기 어렵다.',
      '가장 방식은 엔지니어가 자기 ID로 인증한 뒤 서비스 계정의 단기 토큰을 발급받는다. 장기 키가 필요 없고, 감사 로그에 원래 호출자 정보가 남아 추적이 가능하다.',
      '개인 계정에 넓은 권한을 상시 부여하면 권한이 흩어지고 최소 권한 원칙에 어긋난다.',
      '주기적 교체는 위험을 줄일 뿐 장기 키 문제를 해결하지 못하고 누가 사용했는지도 불분명하다.',
    ],
    principle:
      '사람이 서비스 계정 권한을 써야 하면 키 대신 가장(단기 토큰)을 사용한다. 권한은 토큰 생성자 역할로 통제하고 감사 로그로 추적한다.',
    refs: [
      { title: '서비스 계정 가장', url: 'https://docs.cloud.google.com/iam/docs/service-account-impersonation' },
    ],
  },
  {
    id: 'c02-25',
    chapter: 2,
    domain: 3,
    topic: 'GKE 워크로드 ID',
    question:
      'GKE의 여러 네임스페이스에서 서로 다른 팀의 파드가 실행된다. 결제 팀 파드만 결제용 Cloud Storage 버킷에 접근해야 하고, 다른 팀 파드는 접근하면 안 된다. 현재는 모든 파드가 노드의 기본 서비스 계정 권한을 공유한다. 가장 적절한 방법은?',
    options: [
      '노드 서비스 계정에 버킷 접근 권한을 부여한다.',
      'GKE용 워크로드 ID 제휴를 사용 설정하고, 결제 팀의 Kubernetes 서비스 계정에만 버킷 접근 IAM 권한을 부여한다.',
      '서비스 계정 키를 Kubernetes 시크릿으로 만들어 결제 팀 파드에 마운트한다.',
      '결제 팀용으로 별도 노드 풀을 만들고 해당 노드에 외부 IP를 부여한다.',
    ],
    answer: [1],
    explanations: [
      '노드 서비스 계정에 권한을 주면 그 노드의 모든 파드가 버킷에 접근할 수 있게 되어 요구사항을 위반한다.',
      'GKE용 워크로드 ID 제휴는 Kubernetes 서비스 계정 단위로 IAM 권한을 부여해, 키 없이 파드별로 최소 권한을 적용할 수 있다. 결제 팀 파드만 접근하게 된다.',
      '키를 시크릿으로 쓰면 장기 자격 증명 관리 문제가 생기고 유출 위험이 있다.',
      '노드 풀 분리와 외부 IP는 권한 문제를 해결하지 못하고 노출만 늘린다.',
    ],
    principle:
      'GKE 파드의 Google Cloud 접근은 워크로드 ID 제휴로 Kubernetes 서비스 계정별 최소 권한을 부여한다. 노드 서비스 계정은 최소 권한으로 유지한다.',
    refs: [
      { title: 'GKE용 워크로드 ID 제휴', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/workload-identity' },
    ],
  },
  {
    id: 'c02-26',
    chapter: 2,
    domain: 3,
    topic: 'Secret Manager',
    question:
      'Cloud Run 서비스가 데이터베이스 비밀번호와 외부 결제 API 키를 컨테이너 이미지에 포함된 설정 파일에서 읽는다. 보안 검토에서 (1) 비밀 값이 이미지에 들어 있음, (2) 교체 절차 없음, (3) 누가 비밀을 읽었는지 추적 불가가 지적되었다. 가장 적절한 개선은?',
    options: [
      '비밀 값을 Base64로 인코딩해 환경 변수에 넣는다.',
      '비밀을 Secret Manager에 저장하고, 서비스의 서비스 계정에만 해당 비밀의 접근자 역할을 부여해 런타임에 참조하며, 버전 관리로 교체한다.',
      '비밀을 Cloud Storage 공개 버킷에 두고 URL을 모른다는 점에 의존한다.',
      '비밀 값을 Git 저장소의 비공개 브랜치에 커밋한다.',
    ],
    answer: [1],
    explanations: [
      'Base64는 암호화가 아니며 교체·접근 추적 문제도 해결하지 못한다.',
      'Secret Manager는 비밀을 이미지와 분리해 저장하고, 비밀별 IAM으로 접근을 제한하며, 버전 관리로 교체를 지원하고, 감사 로그로 접근을 추적할 수 있다. Cloud Run은 비밀을 환경 변수나 볼륨으로 참조할 수 있다.',
      '공개 버킷은 누구나 접근할 수 있어 심각한 유출 위험이다.',
      'Git에 커밋된 비밀은 이력에 영구히 남고 광범위하게 복제된다.',
    ],
    principle:
      '비밀은 코드·이미지와 분리해 Secret Manager에 두고, 최소 권한·버전 교체·감사 로그를 적용한다.',
    refs: [
      { title: 'Secret Manager 개요', url: 'https://docs.cloud.google.com/secret-manager/docs/overview' },
      { title: 'Cloud Run에서 보안 비밀 사용', url: 'https://docs.cloud.google.com/run/docs/configuring/services/secrets' },
    ],
  },
  {
    id: 'c02-27',
    chapter: 2,
    domain: 3,
    topic: '데이터 상주(리소스 위치 제한)',
    question:
      '유럽 고객을 위한 서비스를 운영하는 회사가 규정상 고객 데이터를 EU 안에만 저장해야 한다. 개발자가 실수로 미국 리전에 버킷이나 데이터베이스를 만드는 것을 조직 차원에서 예방하려면 어떻게 해야 하는가?',
    options: [
      '개발자 교육을 실시하고 월별로 리소스 위치를 점검한다.',
      'EU 서비스용 폴더에 리소스 위치 제한 조직 정책(gcp.resourceLocations)을 적용해 EU 위치만 허용한다.',
      '모든 버킷에 CMEK를 적용한다.',
      'VPC 방화벽으로 미국 리전 IP 대역을 차단한다.',
    ],
    answer: [1],
    explanations: [
      '교육과 사후 점검은 실수를 예방하지 못하며, 그 사이 규정 위반이 발생한다.',
      '리소스 위치 제한 조직 정책은 지원되는 서비스의 리소스를 허용된 위치에서만 만들 수 있게 강제한다. 폴더에 적용하면 하위 프로젝트 모두에 상속된다.',
      'CMEK는 암호화 키 통제이며 데이터가 어느 리전에 저장되는지를 제한하지 않는다.',
      '방화벽은 네트워크 트래픽 제어이며 리소스 생성 위치를 막지 못한다.',
    ],
    principle:
      '데이터 상주 요구는 리소스 위치 조직 정책으로 예방한다. 더 엄격한 주권 요구가 있으면 Assured Workloads 같은 추가 통제를 검토한다.',
    refs: [
      { title: '리소스 위치 제한', url: 'https://docs.cloud.google.com/organization-policy/restrict-locations' },
    ],
  },
  {
    id: 'c02-28',
    chapter: 2,
    domain: 3,
    topic: 'Cloud Armor(WAF·DDoS)',
    question:
      '온라인 쇼핑몰이 전역 외부 애플리케이션 부하 분산기 뒤에서 운영된다. 최근 SQL 삽입·XSS 시도와 특정 IP들의 로그인 페이지 무차별 대입 공격이 관찰되었다. 애플리케이션 코드를 바꾸지 않고 엣지에서 방어하려면 어떻게 해야 하는가?',
    options: [
      'VPC 방화벽 규칙으로 공격 IP를 하나씩 차단한다.',
      'Cloud Armor 보안 정책을 백엔드 서비스에 연결해 사전 구성된 WAF 규칙(SQLi·XSS)과 로그인 경로에 대한 레이트 리밋 규칙을 적용한다.',
      '백엔드 VM의 CPU를 늘려 공격 트래픽을 처리한다.',
      '부하 분산기를 내부 부하 분산기로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      'VPC 방화벽은 L3/L4 규칙으로 애플리케이션 계층 공격 패턴을 탐지하지 못하며, 프록시 기반 부하 분산기 뒤에서는 공격자 IP 기반 차단도 백엔드에서 적용하기 어렵다.',
      'Cloud Armor는 부하 분산기 엣지에서 OWASP 계열 사전 구성 WAF 규칙과 경로·클라이언트별 레이트 리밋을 적용해, 코드 변경 없이 공격 트래픽이 백엔드에 도달하기 전에 차단한다.',
      '자원 증설은 공격을 막지 못하고 비용만 늘린다.',
      '내부 부하 분산기로 바꾸면 정상 고객도 접속할 수 없다.',
    ],
    principle:
      '인터넷 노출 HTTP(S) 서비스의 L7 방어(WAF, 레이트 리밋, 봇·DDoS 완화)는 Cloud Armor로 부하 분산기 엣지에서 수행한다.',
    refs: [
      { title: 'Cloud Armor 개요', url: 'https://docs.cloud.google.com/armor/docs/cloud-armor-overview' },
      { title: '사전 구성된 WAF 규칙', url: 'https://docs.cloud.google.com/armor/docs/waf-rules' },
    ],
  },
  {
    id: 'c02-29',
    chapter: 2,
    domain: 3,
    topic: 'HIPAA 규정 준수',
    question:
      '미국 원격 진료 스타트업이 환자 건강 정보(PHI)를 Google Cloud에서 처리하려 한다. HIPAA 요구사항을 충족하기 위해 아키텍트가 반드시 해야 할 일은? (2개 선택)',
    options: [
      'Google과 비즈니스 제휴 계약(BAA)을 체결한다.',
      'PHI는 BAA 적용 대상 서비스에서만 처리하고, 접근 통제·감사 로그 등 고객 책임 영역의 보안 구성을 적용한다.',
      'Google Cloud는 기본적으로 HIPAA를 준수하므로 추가 조치 없이 모든 서비스를 사용한다.',
      '모든 PHI를 공개 버킷에 저장하고 URL을 비밀로 유지한다.',
      'HIPAA는 기술 요구사항이 아니므로 법무팀에만 맡긴다.',
    ],
    answer: [0, 1],
    explanations: [
      'PHI를 처리하려면 클라우드 공급자와 BAA를 체결해야 한다. Google Cloud는 HIPAA 준수를 지원하기 위한 BAA를 제공한다.',
      'BAA는 적용 대상 서비스 범위가 정해져 있고, 공동 책임 모델에 따라 IAM·감사 로그·암호화 설정 등은 고객이 구성해야 한다.',
      '공동 책임 모델에서 고객 측 구성은 고객 책임이며, 모든 서비스가 BAA 대상인 것도 아니다.',
      '공개 버킷은 명백한 PHI 노출 위험이다.',
      'HIPAA는 기술적 보호 조치를 요구하므로 아키텍처 설계가 핵심 역할을 한다.',
    ],
    principle:
      '규정 준수는 공동 책임이다: 공급자 계약(BAA)과 적용 대상 서비스 확인 + 고객 측 보안 구성이 함께 필요하다.',
    refs: [
      { title: 'Google Cloud HIPAA 규정 준수', url: 'https://cloud.google.com/security/compliance/hipaa' },
    ],
  },
  {
    id: 'c02-30',
    chapter: 2,
    domain: 3,
    topic: 'Security Command Center',
    question:
      '조직에 프로젝트가 수백 개 있고, 보안팀은 공개된 버킷·과도한 IAM 권한·방화벽 개방 같은 잘못된 구성과 암호화폐 채굴 같은 위협 활동을 한곳에서 지속적으로 파악하고 우선순위를 정하고 싶다. 가장 적합한 서비스는?',
    options: [
      'Cloud Asset Inventory 내보내기를 매일 스프레드시트로 검토한다.',
      '조직 수준에서 Security Command Center를 사용 설정해 잘못된 구성·취약점·위협 발견 항목을 중앙에서 관리한다.',
      '각 프로젝트 관리자에게 주간 보안 점검 보고서를 제출받는다.',
      'Cloud Monitoring 업타임 체크를 추가한다.',
    ],
    answer: [1],
    explanations: [
      '자산 목록 수작업 검토는 확장되지 않고 위협 탐지 기능도 없다.',
      'Security Command Center는 조직 전체의 자산에 대해 잘못된 구성, 취약점, 위협을 탐지해 발견 항목으로 모아 보여 주는 중앙 보안 관리 서비스다.',
      '자가 보고는 일관성과 신뢰성이 낮고 실시간 탐지가 불가능하다.',
      '업타임 체크는 가용성 모니터링이며 보안 상태와 무관하다.',
    ],
    principle:
      '조직 전체 보안 상태(구성 오류·취약점·위협)의 가시성은 Security Command Center로 중앙화한다.',
    refs: [
      { title: 'Security Command Center 개요', url: 'https://docs.cloud.google.com/security-command-center/docs/security-command-center-overview' },
    ],
  },
  {
    id: 'c02-31',
    chapter: 2,
    domain: 3,
    topic: 'AI 보안(Model Armor)',
    question:
      '은행이 고객용 생성형 AI 챗봇을 출시한다. 보안팀은 (1) 사용자가 프롬프트 삽입·탈옥으로 시스템 지시를 무력화하는 것, (2) 모델 응답에 카드 번호 같은 민감 정보가 포함되는 것을 걱정한다. 애플리케이션 전반에 일관된 방어 계층을 두려면 무엇을 도입해야 하는가?',
    options: [
      '시스템 프롬프트에 “규칙을 절대 어기지 마라”는 문장을 추가한다.',
      'Model Armor로 프롬프트와 응답을 검사해 프롬프트 삽입·탈옥 시도와 민감 데이터를 탐지·차단한다.',
      '챗봇을 내부 부하 분산기 뒤에 둔다.',
      '모델 온도(temperature)를 0으로 낮춘다.',
    ],
    answer: [1],
    explanations: [
      '프롬프트 문구만으로는 교묘한 삽입·탈옥 공격을 신뢰성 있게 막을 수 없다.',
      'Model Armor는 LLM 입력과 출력을 검사해 프롬프트 삽입·탈옥, 민감 데이터(Sensitive Data Protection 연동), 유해 콘텐츠 등을 탐지하고 차단하는 보안 계층을 제공한다.',
      '네트워크 위치를 바꿔도 고객이 입력하는 프롬프트의 공격은 그대로 전달된다. 고객용 서비스라 외부 노출도 필요하다.',
      'temperature는 응답의 무작위성을 조절할 뿐 공격이나 민감 정보 노출을 막지 못한다.',
    ],
    principle:
      '생성형 AI 보안은 모델 앞뒤에서 프롬프트와 응답을 검사하는 계층(Model Armor)과 민감 데이터 보호를 함께 적용한다.',
    refs: [
      { title: 'Model Armor 개요', url: 'https://docs.cloud.google.com/model-armor/overview' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (7) ─────────
  {
    id: 'c02-32',
    chapter: 2,
    domain: 4,
    topic: '테스트 자동화 전략',
    question:
      '개발팀은 기능 출시 전 QA팀이 2주 동안 수동 회귀 테스트를 하는 탓에 배포가 월 1회로 제한된다. 경영진은 배포 빈도를 주 여러 번으로 늘리면서 결함 유출은 줄이길 원한다. 테스트 프로세스를 어떻게 바꾸는 것이 가장 효과적인가?',
    options: [
      '수동 회귀 테스트 기간을 1주로 줄인다.',
      '빠른 단위 테스트를 가장 많이, 통합 테스트를 적당히, 종단 간 테스트는 핵심 경로 위주로 두어 CI 파이프라인에서 커밋마다 자동 실행하고 실패 시 병합을 막는다.',
      '테스트를 모두 없애고 운영 모니터링으로 결함을 찾는다.',
      '모든 테스트를 느린 종단 간 UI 테스트로 자동화해 야간에 한 번 실행한다.',
    ],
    answer: [1],
    explanations: [
      '기간만 줄이면 검증 범위가 줄어 결함 유출이 늘고, 여전히 배포가 수동 테스트에 묶인다.',
      '테스트 피라미드에 따라 빠르고 안정적인 테스트를 많이 두고 CI에서 커밋마다 실행하면 결함을 조기에 발견해 수정 비용이 낮아지고, 자동화된 품질 게이트 덕분에 배포 빈도를 높일 수 있다.',
      '테스트 없이 운영에서 결함을 찾으면 사용자 영향이 커진다.',
      '종단 간 UI 테스트 위주는 느리고 불안정해 피드백이 늦고, 야간 1회 실행으로는 커밋 단위 품질 게이트가 되지 못한다.',
    ],
    principle:
      '지속적 배포의 전제는 자동화된 빠른 테스트다. 테스트 피라미드(단위 > 통합 > 종단 간)로 피드백 속도와 신뢰성을 확보한다.',
    refs: [
      { title: 'DORA 역량: 테스트 자동화(Google Cloud DORA 연구)', url: 'https://dora.dev/capabilities/test-automation/' },
    ],
  },
  {
    id: 'c02-33',
    chapter: 2,
    domain: 4,
    topic: '적정 규모 권장사항',
    question:
      '회사는 온프레미스 서버 사양을 그대로 옮겨 Compute Engine VM 300대를 운영하고 있다. 재무팀은 비용이 예상보다 높다고 지적했고, 대부분 VM의 CPU 사용률이 낮아 보인다. 성능 위험을 최소화하면서 비용을 줄이려면 어떤 접근이 가장 적절한가?',
    options: [
      '모든 VM의 vCPU를 일괄 절반으로 줄인다.',
      'Active Assist의 머신 유형(적정 규모) 권장사항을 검토해 사용률 데이터에 근거한 VM부터 단계적으로 변경하고, 변경 후 성능 지표를 확인한다.',
      '모든 VM을 Spot VM으로 바꾼다.',
      '사용률과 관계없이 3년 약정 할인을 전체 용량에 구매한다.',
    ],
    answer: [1],
    explanations: [
      '일괄 축소는 실제 부하가 높은 VM의 성능을 떨어뜨릴 수 있다. 개별 사용률 데이터에 근거해야 한다.',
      '적정 규모 권장사항은 관측된 사용률을 바탕으로 더 적합한 머신 유형을 제안한다. 근거 있는 단계적 변경과 사후 검증으로 비용과 성능 위험을 함께 관리할 수 있다.',
      'Spot VM은 선점될 수 있어 일반 서비스 VM 전체에 적용하면 가용성이 떨어진다.',
      '과대 할당된 용량에 약정을 사면 낭비를 3년간 고정하게 된다. 적정 규모 조정 후 약정해야 한다.',
    ],
    principle:
      '비용 최적화 순서: 먼저 적정 규모(rightsizing)로 낭비를 없애고, 남은 안정적 사용량에 약정 할인을 적용한다.',
    refs: [
      { title: 'Active Assist 개요', url: 'https://docs.cloud.google.com/recommender/docs/whatis-activeassist' },
      { title: '머신 유형 권장사항 적용', url: 'https://docs.cloud.google.com/compute/docs/instances/apply-machine-type-recommendations-for-instances' },
    ],
  },
  {
    id: 'c02-34',
    chapter: 2,
    domain: 4,
    topic: '비용 할당(차지백)',
    question:
      '여러 사업부가 공유 프로젝트와 전용 프로젝트를 섞어 사용한다. 재무팀은 매월 사업부·환경(개발/운영)별 클라우드 비용을 정확히 배분하고, 추세를 SQL로 분석하고 싶다. 어떤 조합이 가장 적합한가?',
    options: [
      '결제 콘솔의 월별 PDF 청구서를 수작업으로 나눈다.',
      '리소스에 사업부·환경 라벨을 일관되게 부여하고, Cloud Billing 데이터를 BigQuery로 내보내 라벨 기준으로 집계한다.',
      '사업부별로 결제 계정을 따로 만들고 공유 리소스는 무시한다.',
      '프로젝트 이름에 사업부명을 넣고 이름으로 추정한다.',
    ],
    answer: [1],
    explanations: [
      '수작업 분배는 공유 프로젝트의 비용을 정확히 나눌 수 없고 오류와 시간이 많이 든다.',
      '라벨은 리소스 단위로 비용 속성을 붙일 수 있고, 결제 데이터의 BigQuery 내보내기에 라벨이 포함되어 사업부·환경별 집계와 추세 분석을 SQL로 할 수 있다.',
      '결제 계정 분리는 공유 리소스 비용 배분 문제를 해결하지 못하고 관리가 복잡해진다.',
      '이름 기반 추정은 공유 프로젝트 안의 리소스를 구분하지 못하고 부정확하다.',
    ],
    principle:
      '비용 할당은 “일관된 라벨 정책 + 결제 데이터 BigQuery 내보내기”가 기본이다. 라벨 누락은 조직 정책·IaC 모듈로 예방한다.',
    refs: [
      { title: 'Cloud Billing 데이터를 BigQuery로 내보내기', url: 'https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery' },
      { title: '라벨 만들기 및 관리', url: 'https://docs.cloud.google.com/resource-manager/docs/creating-managing-labels' },
    ],
  },
  {
    id: 'c02-35',
    chapter: 2,
    domain: 4,
    topic: '이해관계자 관리',
    question:
      '클라우드 도입 과정에서 보안팀은 모든 새 서비스 사용을 개별 승인하겠다고 하고, 개발팀은 승인 대기 때문에 일정이 밀린다고 불만이다. 양측 모두 경영진에게 상대를 문제로 보고하고 있다. 아키텍트가 취할 조치로 가장 적절한 것은?',
    options: [
      '개발팀 편을 들어 보안 승인 절차를 폐지하도록 경영진을 설득한다.',
      '양측과 함께 공통 목표(안전하면서 빠른 배포)를 합의하고, 조직 정책·IaC 템플릿 같은 사전 승인된 가드레일을 만들어 그 범위 안에서는 개별 승인 없이 진행하도록 프로세스를 재설계한다.',
      '보안팀 편을 들어 모든 요청을 계속 개별 승인하게 한다.',
      '갈등이 해소될 때까지 클라우드 도입을 중단한다.',
    ],
    answer: [1],
    explanations: [
      '보안 통제를 없애면 위험이 커지고 보안팀과의 신뢰도 무너진다.',
      '이해관계자 조정은 공동 목표를 먼저 합의하고, 보안 요구를 자동화된 가드레일로 코드화해 개발 속도를 확보하는 방식이 효과적이다. 양측의 핵심 관심사를 모두 충족한다.',
      '개별 승인 유지는 병목을 그대로 두어 비즈니스 목표를 해친다.',
      '도입 중단은 문제를 해결하지 않고 비용만 늘린다.',
    ],
    principle:
      '이해관계자 갈등은 한쪽 편을 드는 것이 아니라 공동 목표 합의와 “가드레일 안에서의 자율”이라는 구조로 해결한다.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  {
    id: 'c02-36',
    chapter: 2,
    domain: 4,
    topic: 'DR 계획 검증',
    question:
      '물류 회사는 2년 전에 교차 리전 DR 계획을 문서로 만들었지만 한 번도 실행해 본 적이 없다. 그 사이 서비스 구성과 담당자가 많이 바뀌었다. 감사에서 DR 계획의 실효성이 의문시되었다. 가장 먼저 해야 할 일은?',
    options: [
      'DR 문서의 날짜만 최신으로 바꾼다.',
      '정기적인 DR 훈련(게임 데이)을 계획해 실제로 장애 조치를 수행하고, 측정한 RTO·RPO와 발견된 문제를 바탕으로 런북과 자동화를 갱신한다.',
      'DR 리전의 인프라를 운영 규모로 상시 가동한다.',
      '장애가 실제로 발생하면 그때 문서를 따라 해 본다.',
    ],
    answer: [1],
    explanations: [
      '날짜 갱신은 형식적 조치일 뿐 계획이 실제로 동작하는지 보장하지 않는다.',
      '정기적 DR 훈련은 계획의 공백(오래된 절차, 권한 부족, 누락된 의존성)을 실제 재해 전에 드러내고, 측정된 RTO·RPO로 요구사항 충족 여부를 검증한다. 결과를 반영해 계획을 개선한다.',
      '상시 가동은 비용이 크며, 전환 절차가 동작하는지는 여전히 검증되지 않는다.',
      '실제 재해 때 처음 실행하면 실패 가능성이 높다.',
    ],
    principle:
      '테스트하지 않은 DR 계획은 DR 계획이 아니다. 정기 훈련으로 RTO·RPO를 측정하고 런북을 개선한다.',
    refs: [
      { title: '장애 복구 테스트 수행', url: 'https://docs.cloud.google.com/architecture/framework/reliability/perform-testing-for-recovery-from-failures' },
    ],
  },
  {
    id: 'c02-37',
    chapter: 2,
    domain: 4,
    topic: '장애 대응 우선순위',
    question:
      '새 버전 배포 10분 후 결제 API 오류율이 0.1%에서 15%로 급증했다. 온콜 엔지니어는 로그를 보며 원인을 분석하고 있고, 그동안 고객 결제가 계속 실패하고 있다. 가장 먼저 해야 할 조치는?',
    options: [
      '근본 원인을 완전히 파악할 때까지 분석을 계속한다.',
      '직전 버전으로 롤백해 사용자 영향을 먼저 완화하고, 이후 근본 원인 분석을 진행한다.',
      '인스턴스 수를 늘려 오류율이 낮아지는지 본다.',
      '고객 공지를 먼저 작성해 경영진 승인을 받는다.',
    ],
    answer: [1],
    explanations: [
      '원인 분석을 끝낼 때까지 기다리면 그동안 고객 피해가 계속 커진다.',
      '배포 직후 발생한 장애는 배포가 가장 유력한 원인이며, 롤백은 영향을 빠르게 줄이는 안전한 완화 조치다. 서비스를 복구한 뒤 근본 원인을 차분히 분석한다.',
      '오류의 원인이 용량이 아니라 코드 결함이면 규모를 늘려도 효과가 없다.',
      '커뮤니케이션도 중요하지만, 영향 완화를 미루고 공지부터 하는 것은 우선순위가 바뀐 것이다(공지는 병행한다).',
    ],
    principle:
      '장애 대응은 “완화 먼저, 근본 원인은 나중”이다. 최근 변경이 의심되면 롤백이 가장 빠른 완화책이다.',
    refs: [
      { title: 'SRE 책: 인시던트 관리', url: 'https://sre.google/sre-book/managing-incidents/' },
    ],
  },
  {
    id: 'c02-38',
    chapter: 2,
    domain: 4,
    topic: '아키텍처 의사결정 기록',
    question:
      '1년 전 팀이 메시징 서비스로 Pub/Sub 대신 자체 운영 Kafka를 선택했는데, 당시 결정에 참여한 사람들이 모두 이동해 새 팀원들은 이유를 모른 채 재논의를 반복하고 있다. 앞으로 이런 상황을 막으려면 어떤 관행을 도입해야 하는가?',
    options: [
      '주요 결정은 경영진 이메일로만 공유한다.',
      '아키텍처 의사결정 기록(ADR)을 코드 저장소 등에 남겨 결정의 맥락, 고려한 대안, 트레이드오프, 결과를 문서화한다.',
      '결정을 바꾸지 않도록 모든 설계 변경을 금지한다.',
      '결정 당시 회의 녹화 파일만 보관한다.',
    ],
    answer: [1],
    explanations: [
      '이메일은 흩어지고 검색이 어려우며, 결정 이유와 대안이 체계적으로 남지 않는다.',
      'ADR은 결정 배경·대안·트레이드오프·결과를 짧고 일관된 형식으로 남겨, 사람이 바뀌어도 결정의 근거를 이해하고 조건이 바뀌었을 때 의식적으로 재검토할 수 있게 한다.',
      '변경 금지는 비즈니스 변화에 대응하지 못하게 만든다. 목표는 근거 있는 변경이다.',
      '녹화 파일은 검색·요약이 어렵고, 핵심 트레이드오프가 명시되지 않는다.',
    ],
    principle:
      '중요한 설계 결정은 맥락·대안·트레이드오프와 함께 ADR로 남긴다. 결정은 조건이 바뀌면 다시 검토할 수 있어야 한다.',
    refs: [
      { title: '아키텍처 의사결정 기록 개요', url: 'https://docs.cloud.google.com/architecture/architecture-decision-records' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (6) ─────────
  {
    id: 'c02-39',
    chapter: 2,
    domain: 5,
    topic: '블루/그린 배포',
    question:
      '증권사 주문 웹 서비스는 Compute Engine MIG와 외부 애플리케이션 부하 분산기로 운영된다. 새 버전은 기존 버전과 동시에 섞여 실행되면 안 되며(세션 호환성 문제), 전환은 한 번에 이루어져야 하고, 문제가 생기면 즉시 이전 버전으로 되돌려야 한다. 어떤 배포 방식이 가장 적합한가?',
    options: [
      '기존 MIG에 새 템플릿으로 순차적 업데이트를 수행한다.',
      '새 버전으로 별도 MIG(그린)를 만들어 검증한 뒤, 부하 분산기의 백엔드를 기존 MIG(블루)에서 그린으로 한 번에 전환하고, 블루는 롤백용으로 잠시 유지한다.',
      '트래픽의 5%만 새 버전으로 보내는 카나리 배포를 수행한다.',
      '서비스를 중단하고 VM을 모두 교체한 뒤 재개한다.',
    ],
    answer: [1],
    explanations: [
      '순차적 업데이트는 전환 중 구버전과 신버전이 함께 실행되어 세션 호환성 문제가 생긴다.',
      '블루/그린 배포는 새 환경을 미리 완성·검증한 뒤 트래픽을 한 번에 전환한다. 두 버전이 섞이지 않고, 문제가 생기면 백엔드를 블루로 되돌려 즉시 롤백할 수 있다.',
      '카나리는 두 버전이 동시에 트래픽을 받으므로 “섞이면 안 된다”는 제약에 어긋난다.',
      '서비스 중단은 불필요한 다운타임을 만들고 롤백도 느리다.',
    ],
    principle:
      '버전 공존이 불가능하고 즉시 롤백이 필요하면 블루/그린, 점진적 위험 노출이 필요하면 카나리, 공존 가능하고 자원이 제한적이면 순차적 업데이트를 쓴다.',
    refs: [
      { title: 'Cloud Deploy 배포 전략', url: 'https://docs.cloud.google.com/deploy/docs/deployment-strategies' },
      { title: '백엔드 서비스 개요', url: 'https://docs.cloud.google.com/load-balancing/docs/backend-service' },
    ],
  },
  {
    id: 'c02-40',
    chapter: 2,
    domain: 5,
    topic: 'Database Migration Service',
    question:
      '온라인 서점이 온프레미스 MySQL 8(약 2TB)을 Cloud SQL for MySQL로 옮기려 한다. 서비스는 24시간 운영되며 전환 시 다운타임은 수 분 이내여야 한다. 관리형 도구로 진행하고 싶다. 가장 적합한 방법은?',
    options: [
      'mysqldump로 전체를 내보내 Cloud SQL로 가져온 뒤 전환한다.',
      'Database Migration Service로 지속 마이그레이션 작업을 만들어 초기 전체 로드 후 변경 사항을 계속 복제하다가, 쓰기를 멈추고 승격(전환)한다.',
      'Transfer Appliance로 데이터 파일을 옮긴다.',
      '애플리케이션이 두 DB에 동시에 쓰도록 수정한다.',
    ],
    answer: [1],
    explanations: [
      '2TB 덤프·가져오기 동안 서비스를 멈춰야 하므로 수 분 다운타임 요구를 충족하지 못한다.',
      'Database Migration Service의 지속 마이그레이션은 초기 로드 후 변경 데이터를 계속 복제해 대상과 원본을 거의 동기 상태로 유지한다. 전환 시 짧은 쓰기 중단 후 승격하면 다운타임이 최소화된다.',
      '오프라인 파일 전송은 운영 중 발생하는 변경을 반영하지 못한다.',
      '이중 쓰기는 일관성 문제와 개발 부담이 크며, 관리형 도구를 쓰려는 요구와도 다르다.',
    ],
    principle:
      '저다운타임 DB 이전은 “전체 로드 + 변경 데이터 지속 복제 + 짧은 전환”이 기본이다. 동종 이전은 Database Migration Service를 우선 검토한다.',
    refs: [
      { title: 'Database Migration Service 개요', url: 'https://docs.cloud.google.com/database-migration/docs/overview' },
      { title: 'MySQL 마이그레이션 소스와 대상', url: 'https://docs.cloud.google.com/database-migration/docs/mysql/migration-src-and-dest' },
    ],
  },
  {
    id: 'c02-41',
    chapter: 2,
    domain: 5,
    topic: 'bq CLI 비용 사전 확인',
    question:
      '데이터 분석가가 주문형 가격 책정 프로젝트에서 수 TB 테이블에 대한 새 쿼리를 스케줄링하려 한다. 실행 전에 이 쿼리가 스캔할 데이터 양을 확인해 비용을 추정하고 싶다. 쿼리를 실제로 실행하지 않고 확인하는 방법은?',
    options: [
      '쿼리에 LIMIT 10을 붙여 실행한다.',
      'bq query --dry_run 플래그(또는 콘솔 쿼리 검증기)로 처리될 바이트 수를 확인한다.',
      '테이블을 CSV로 내보내 파일 크기를 확인한다.',
      '쿼리를 실행한 뒤 청구서를 확인한다.',
    ],
    answer: [1],
    explanations: [
      'BigQuery에서 LIMIT은 일반적으로 스캔하는 데이터 양을 줄이지 않으므로 비용 추정이나 절감에 도움이 되지 않는다.',
      '시험 실행(dry run)은 쿼리를 실행하지 않고 처리될 바이트 수를 반환하므로 비용을 사전에 추정할 수 있다. 콘솔의 쿼리 검증기도 같은 정보를 보여 준다.',
      '내보내기는 불필요한 작업이며 쿼리가 실제로 읽을 열·파티션과 무관하다.',
      '실행 후 확인은 이미 비용이 발생한 뒤다.',
    ],
    principle:
      'BigQuery 비용은 스캔 바이트가 좌우한다. dry run으로 사전 확인하고, 파티션·클러스터링과 필요한 열만 선택해 스캔을 줄인다.',
    refs: [
      { title: '쿼리 실행(시험 실행 포함)', url: 'https://docs.cloud.google.com/bigquery/docs/running-queries' },
    ],
  },
  {
    id: 'c02-42',
    chapter: 2,
    domain: 5,
    topic: 'Cloud Code 개발 환경',
    question:
      '개발자들이 Cloud Run과 GKE용 서비스를 개발하면서 매번 이미지를 빌드·푸시하고 매니페스트를 수정하는 반복 작업에 시간을 많이 쓴다. 익숙한 IDE 안에서 로컬 실행·디버깅, 매니페스트 작성 지원, 배포를 빠르게 반복하고 싶다. 가장 적합한 도구는?',
    options: [
      'Cloud Code IDE 플러그인(VS Code·JetBrains)을 사용한다.',
      '모든 개발을 운영 클러스터에서 직접 수행한다.',
      'Cloud Scheduler로 주기적으로 배포한다.',
      'Deployment Manager 템플릿을 작성한다.',
    ],
    answer: [0],
    explanations: [
      'Cloud Code는 IDE에서 Kubernetes·Cloud Run 앱의 로컬 실행·디버깅, YAML 작성 지원, 반복 개발 흐름(내부적으로 Skaffold 활용)을 제공해 개발 루프를 단축한다.',
      '운영 클러스터에서 개발하면 장애 위험이 크고 모범 사례에 어긋난다.',
      'Cloud Scheduler는 작업 예약 서비스로 개발 반복 루프와 무관하다.',
      'Deployment Manager는 인프라 템플릿 도구로 애플리케이션 개발 루프 개선과 거리가 멀다.',
    ],
    principle:
      '개발자 내부 루프(코드→실행→디버그)는 IDE 통합 도구(Cloud Code, Cloud Shell Editor)로 단축하고, 외부 루프(배포)는 CI/CD로 자동화한다.',
    refs: [
      { title: 'Cloud Code 문서', url: 'https://docs.cloud.google.com/code/docs' },
    ],
  },
  {
    id: 'c02-43',
    chapter: 2,
    domain: 5,
    topic: '애플리케이션 기본 사용자 인증 정보(ADC)',
    question:
      '개발자가 로컬 노트북에서 Cloud Storage 클라이언트 라이브러리를 사용하는 코드를 테스트하려 한다. 같은 코드는 운영 환경에서 Cloud Run에 연결된 서비스 계정으로 실행된다. 코드 변경 없이 두 환경에서 모두 인증되게 하고, 서비스 계정 키는 쓰지 않으려면?',
    options: [
      '서비스 계정 키를 내려받아 코드에 경로를 하드코딩한다.',
      '코드는 애플리케이션 기본 사용자 인증 정보(ADC)를 사용하게 하고, 로컬에서는 gcloud auth application-default login으로 사용자 자격 증명을 설정한다.',
      '로컬과 운영에서 서로 다른 인증 코드를 분기해 작성한다.',
      '버킷을 공개로 설정해 인증을 생략한다.',
    ],
    answer: [1],
    explanations: [
      '키 하드코딩은 유출 위험이 크고, 운영 환경에서도 키를 써야 하는 잘못된 구조가 된다.',
      'ADC는 실행 환경에서 자격 증명을 자동으로 찾는다. 로컬에서는 gcloud로 설정한 사용자 자격 증명을, Cloud Run에서는 연결된 서비스 계정을 사용하므로 코드 변경과 키 없이 두 환경에서 동작한다.',
      '환경별 분기는 유지보수 부담과 실수 가능성을 늘린다.',
      '공개 버킷은 보안 위험이다.',
    ],
    principle:
      '클라이언트 라이브러리는 ADC에 인증을 맡긴다. 로컬은 사용자 자격 증명(또는 가장), 클라우드는 연결된 서비스 계정을 쓰고 키 파일은 피한다.',
    refs: [
      { title: 'ADC 자격 증명 제공 방법', url: 'https://docs.cloud.google.com/docs/authentication/provide-credentials-adc' },
    ],
  },
  {
    id: 'c02-44',
    chapter: 2,
    domain: 5,
    topic: 'Terraform 모듈 재사용',
    question:
      '여러 제품 팀이 각자 Terraform으로 VPC·서브넷·방화벽·로그 설정을 작성하다 보니 구성이 제각각이고 보안 기준 누락이 잦다. 플랫폼 팀은 팀 자율성을 해치지 않으면서 표준 구성을 일관되게 적용하고 싶다. 가장 적절한 방법은?',
    options: [
      '플랫폼 팀이 모든 팀의 Terraform 코드를 직접 작성한다.',
      '보안 기준이 반영된 재사용 가능한 Terraform 모듈을 만들어 버전을 붙여 배포하고, 팀들은 필요한 입력 변수만 지정해 모듈을 호출하게 한다.',
      '위키에 표준 구성 예시를 올리고 복사해 쓰게 한다.',
      'Terraform 사용을 금지하고 콘솔로만 리소스를 만들게 한다.',
    ],
    answer: [1],
    explanations: [
      '중앙 팀이 모든 코드를 작성하면 병목이 되고 팀 자율성이 사라진다.',
      '버전이 있는 재사용 모듈은 표준·보안 기준을 코드로 캡슐화하고, 팀은 입력값만 바꿔 사용한다. 모듈을 개선하면 버전 업그레이드로 전파할 수 있어 일관성과 자율성을 함께 확보한다.',
      '복사-붙여넣기는 시간이 지나면 코드가 갈라져 일관성이 무너진다.',
      '콘솔 수동 작업은 재현성과 검토 가능성을 없앤다.',
    ],
    principle:
      '표준은 문서가 아니라 코드(버전 관리되는 IaC 모듈)로 배포한다. 팀은 모듈을 조합해 자율적으로 인프라를 만든다.',
    refs: [
      { title: 'Terraform 재사용 모듈 모범 사례', url: 'https://docs.cloud.google.com/docs/terraform/best-practices/reusable-modules' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c02-45',
    chapter: 2,
    domain: 6,
    topic: '로그 기반 측정항목',
    question:
      '레거시 애플리케이션은 결제 실패 시 “PAYMENT_DECLINED code=…” 형태의 로그 줄만 남기고 별도 지표를 내보내지 않는다. 운영팀은 코드 수정 없이 결제 실패 건수를 시간대별로 그래프로 보고, 5분간 급증하면 알림을 받고 싶다. 어떻게 해야 하는가?',
    options: [
      '매일 로그를 내려받아 스프레드시트로 집계한다.',
      '해당 로그 패턴을 필터로 하는 카운터 유형 로그 기반 측정항목을 만들고, 이 측정항목에 Cloud Monitoring 알림 정책을 설정한다.',
      '애플리케이션을 다시 작성해 사용자 정의 측정항목을 내보낸다.',
      '로그 보존 기간을 늘린다.',
    ],
    answer: [1],
    explanations: [
      '수작업 집계는 실시간 알림이 불가능하다.',
      '로그 기반 측정항목은 로그 항목을 필터링해 개수나 값 분포를 시계열 지표로 만든다. 코드 수정 없이 그래프와 알림 정책을 구성할 수 있다.',
      '코드 수정 없이라는 요구에 어긋난다.',
      '보존 기간은 지표 생성이나 알림과 무관하다.',
    ],
    principle:
      '로그에만 있는 신호는 로그 기반 측정항목으로 지표화해 대시보드와 알림에 활용한다.',
    refs: [
      { title: '로그 기반 측정항목 개요', url: 'https://docs.cloud.google.com/logging/docs/logs-based-metrics' },
    ],
  },
  {
    id: 'c02-46',
    chapter: 2,
    domain: 6,
    topic: 'Managed Service for Prometheus',
    question:
      '플랫폼팀은 GKE 클러스터 여러 개에서 자체 운영 Prometheus 서버로 지표를 수집한다. 클러스터가 늘면서 Prometheus 저장소 확장·장기 보관·고가용성 관리 부담이 커졌다. 기존 PromQL 쿼리와 Grafana 대시보드는 계속 쓰고 싶다. 가장 적합한 방법은?',
    options: [
      'Prometheus 서버의 디스크를 계속 늘린다.',
      'Google Cloud Managed Service for Prometheus로 전환해 관리형 수집·전역 저장소를 사용하고, PromQL로 조회한다.',
      '모든 지표 수집을 중단하고 로그만 사용한다.',
      '각 클러스터에 별도 Grafana와 Prometheus를 하나씩 더 설치한다.',
    ],
    answer: [1],
    explanations: [
      '디스크 증설은 임시방편이며 고가용성·장기 보관·다중 클러스터 통합 문제를 해결하지 못한다.',
      'Managed Service for Prometheus는 Prometheus 호환 수집과 Google이 관리하는 확장 가능한 저장소를 제공하고 PromQL 조회를 지원한다. 기존 쿼리·대시보드를 유지하면서 운영 부담을 줄인다.',
      '지표 없이 로그만 쓰면 효율적인 시계열 모니터링과 알림이 어렵다.',
      '구성 요소를 더 늘리면 관리 부담이 오히려 커진다.',
    ],
    principle:
      '오픈 소스 호환성을 유지하면서 운영 부담을 줄이려면 관리형 호환 서비스(Managed Service for Prometheus)를 먼저 검토한다.',
    refs: [
      { title: 'Managed Service for Prometheus', url: 'https://docs.cloud.google.com/stackdriver/docs/managed-prometheus' },
    ],
  },
  {
    id: 'c02-47',
    chapter: 2,
    domain: 6,
    topic: 'Ops Agent',
    question:
      'Compute Engine VM에서 실행되는 Java 애플리케이션이 가끔 메모리 부족으로 종료된다. 그런데 Cloud Monitoring 기본 지표에서는 VM의 메모리 사용률과 디스크 사용률이 보이지 않고, 애플리케이션 로그 파일도 Cloud Logging에 없다. 어떻게 해야 하는가?',
    options: [
      'VM 머신 유형을 더 큰 것으로 바꾼다.',
      'VM에 Ops Agent를 설치해 게스트 OS 수준 지표(메모리·디스크)와 애플리케이션 로그 파일을 수집한다.',
      'VPC 흐름 로그를 사용 설정한다.',
      '업타임 체크를 추가한다.',
    ],
    answer: [1],
    explanations: [
      '원인을 확인하지 않고 크기만 키우면 비용이 늘고, 메모리 누수라면 문제가 반복된다.',
      '하이퍼바이저 수준 기본 지표에는 게스트 OS의 메모리·디스크 사용률이 포함되지 않는다. Ops Agent는 게스트 지표와 로그 파일을 수집해 Cloud Monitoring과 Cloud Logging으로 보낸다.',
      '흐름 로그는 네트워크 트래픽 정보라 메모리 문제와 무관하다.',
      '업타임 체크는 외부 가용성만 확인하며 원인 분석에 필요한 지표를 제공하지 않는다.',
    ],
    principle:
      'VM의 게스트 OS 지표(메모리·디스크 사용률)와 애플리케이션 로그 수집에는 Ops Agent가 필요하다.',
    refs: [
      { title: 'Ops Agent 개요', url: 'https://docs.cloud.google.com/monitoring/agent/ops-agent' },
    ],
  },
  {
    id: 'c02-48',
    chapter: 2,
    domain: 6,
    topic: '오류 예산 정책',
    question:
      '검색 서비스의 분기 SLO는 가용성 99.9%이다. 분기 중반인데 연속된 장애로 오류 예산이 이미 모두 소진되었다. 제품팀은 예정된 대규모 기능 출시를 강행하려 한다. 오류 예산 정책에 따른 판단으로 가장 적절한 것은?',
    options: [
      'SLO를 99%로 즉시 낮춰 예산을 다시 확보한다.',
      '미리 합의한 오류 예산 정책에 따라 위험한 기능 출시를 보류하고, 신뢰성 개선 작업을 우선하며, 예산이 회복되면 출시를 재개한다.',
      '예산과 관계없이 일정대로 출시한다.',
      '모니터링을 끄고 출시한다.',
    ],
    answer: [1],
    explanations: [
      '예산이 소진될 때마다 SLO를 낮추면 SLO가 사용자 기대를 반영하지 못하게 된다. SLO 변경은 별도의 신중한 결정이어야 한다.',
      '오류 예산 정책은 예산 소진 시 기능 출시를 줄이고 신뢰성 작업에 집중하도록 사전에 합의한 규칙이다. 이 규칙이 개발 속도와 신뢰성 사이의 균형을 객관적으로 결정한다.',
      '예산이 없는 상태에서 위험한 출시를 강행하면 SLO 위반과 사용자 피해가 커진다.',
      '모니터링을 끄는 것은 문제를 숨길 뿐이다.',
    ],
    principle:
      '오류 예산은 속도와 신뢰성의 교환 비율이다. 소진 시의 조치를 정책으로 미리 합의해 두어야 갈등 없이 적용된다.',
    refs: [
      { title: 'SRE 워크북: 오류 예산 정책', url: 'https://sre.google/workbook/error-budget-policy/' },
    ],
  },
  {
    id: 'c02-49',
    chapter: 2,
    domain: 6,
    topic: 'Google Cloud 서비스 상태 파악',
    question:
      '고객 서비스에 장애가 발생했을 때 온콜 팀은 원인이 자사 애플리케이션인지 Google Cloud 서비스 문제인지 빨리 구분해야 한다. 공개 상태 대시보드를 수시로 새로고침하는 대신, 자기 프로젝트에 영향을 주는 Google Cloud 사고만 알림으로 받고 싶다. 무엇을 사용해야 하는가?',
    options: [
      'Personalized Service Health로 프로젝트 관련 서비스 사고를 확인하고 알림을 구성한다.',
      '소셜 미디어에서 장애 소식을 검색한다.',
      '모든 Google Cloud 서비스에 업타임 체크를 만든다.',
      '매시간 지원 케이스를 열어 상태를 문의한다.',
    ],
    answer: [0],
    explanations: [
      'Personalized Service Health는 사용 중인 프로젝트·서비스와 관련된 Google Cloud 사고 정보를 제공하고, 알림과 API로 운영 도구에 연동할 수 있다.',
      '소셜 미디어는 신뢰성이 낮고 늦다.',
      '관리형 서비스의 내부 상태를 업타임 체크로 모두 확인하는 것은 비현실적이다.',
      '반복적인 지원 케이스는 비효율적이며 지원 리소스를 낭비한다.',
    ],
    principle:
      '장애 분류 시 공급자 측 사고 여부를 빠르게 확인하는 채널(Personalized Service Health)을 온콜 절차에 포함한다.',
    refs: [
      { title: 'Personalized Service Health 개요', url: 'https://docs.cloud.google.com/service-health/docs/overview' },
    ],
  },
  {
    id: 'c02-50',
    chapter: 2,
    domain: 6,
    topic: '침투 테스트 정책',
    question:
      '핀테크 회사가 출시 전 외부 보안 업체에 Google Cloud에서 운영하는 자사 웹 애플리케이션의 침투 테스트를 맡기려 한다. 보안 책임자는 Google에 사전 승인을 받아야 하는지 묻는다. 올바른 안내는?',
    options: [
      'Google에 서면 승인을 받기 전에는 어떤 테스트도 할 수 없다.',
      'Google에 사전 통보할 필요는 없지만, 허용 가능한 사용 정책과 서비스 약관을 준수하고 테스트가 자사 프로젝트에만 영향을 주도록 해야 한다.',
      'Google Cloud에서는 침투 테스트가 금지되어 있다.',
      '다른 고객의 리소스까지 포함해 광범위하게 스캔해도 된다.',
    ],
    answer: [1],
    explanations: [
      'Google Cloud는 고객이 자기 프로젝트를 대상으로 침투 테스트를 할 때 사전 연락을 요구하지 않는다.',
      '사전 통보는 필요 없지만, 허용 가능한 사용 정책과 서비스 약관을 지켜야 하며 테스트가 다른 고객에게 영향을 주지 않도록 자사 리소스로 범위를 한정해야 한다.',
      '침투 테스트는 금지되어 있지 않으며, 신뢰성·보안 검증의 권장 활동이다.',
      '다른 고객 리소스를 대상으로 하는 것은 약관 위반이다.',
    ],
    principle:
      '침투 테스트는 사전 통보 없이 가능하지만 범위는 자사 리소스로 한정하고 이용 정책을 준수한다.',
    refs: [
      { title: 'Cloud 보안 FAQ(침투 테스트)', url: 'https://support.google.com/cloud/answer/6262505' },
    ],
  },
  // @@END
]
