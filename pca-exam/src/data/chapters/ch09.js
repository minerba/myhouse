// Chapter 9 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (12) ─────────
  {
    id: 'c09-01',
    chapter: 9,
    domain: 1,
    topic: '관리형 Kafka',
    question:
      '물류 회사는 온프레미스에서 Apache Kafka를 기반으로 수십 개 애플리케이션이 이벤트를 주고받는다. 애플리케이션은 Kafka 클라이언트 API와 Kafka Connect에 깊이 의존하며, 코드 변경 없이 클라우드로 옮기고 싶다. Kafka 클러스터의 브로커 관리·패치·확장 부담은 줄이고 싶다. 가장 적합한 선택은?',
    options: [
      '모든 애플리케이션을 Pub/Sub API로 재작성한다.',
      'Managed Service for Apache Kafka로 관리형 Kafka 클러스터를 만들어 기존 Kafka 클라이언트를 그대로 연결한다.',
      'Compute Engine VM에 Kafka를 직접 설치해 운영한다.',
      'Cloud Tasks로 대체한다.',
    ],
    answer: [1],
    explanations: [
      'Pub/Sub는 훌륭한 관리형 메시징이지만 API가 달라 코드 변경이 필요하다.',
      'Managed Service for Apache Kafka는 오픈 소스 Kafka 클러스터를 관리형으로 제공해 기존 클라이언트·생태계를 그대로 쓰면서 크기 조정·운영 부담을 줄인다.',
      '자체 설치는 브로커 관리 부담이 그대로 남는다.',
      'Cloud Tasks는 작업 큐로 Kafka 스트리밍 모델과 맞지 않는다.',
    ],
    principle:
      '기존 오픈 소스 API 의존이 크면 호환 관리형 서비스(관리형 Kafka·Spark·Airflow 등)로 리플랫폼하고, 신규 개발은 클라우드 네이티브 서비스를 검토한다.',
    refs: [
      { title: 'Managed Service for Apache Kafka 개요', url: 'https://docs.cloud.google.com/managed-service-for-apache-kafka/docs/overview' },
    ],
  },
  {
    id: 'c09-02',
    chapter: 9,
    domain: 1,
    topic: 'MongoDB 워크로드 이전',
    question:
      '리테일 회사의 상품 카탈로그 서비스는 MongoDB 드라이버와 쿼리 문법으로 작성되어 있다. 회사는 DB 서버 운영(복제 세트 관리·패치·확장)을 없애고 서버리스 관리형 문서 DB로 옮기고 싶지만, 애플리케이션 코드는 최소한만 바꾸고 싶다. 가장 적합한 선택은?',
    options: [
      'Cloud SQL for MySQL로 스키마를 재설계한다.',
      'Firestore with MongoDB compatibility로 이전해 기존 MongoDB 드라이버와 코드를 활용한다.',
      'Bigtable로 이전한다.',
      'Compute Engine에 MongoDB를 계속 직접 운영한다.',
    ],
    answer: [1],
    explanations: [
      '관계형 재설계는 코드와 데이터 모델을 크게 바꿔야 한다.',
      'Firestore with MongoDB compatibility는 기존 MongoDB 애플리케이션 코드·드라이버·도구를 사용할 수 있게 하면서 서버리스 관리형 문서 DB의 이점을 제공한다.',
      'Bigtable은 와이드 컬럼 저장소로 MongoDB 쿼리 모델과 맞지 않는다.',
      '직접 운영은 운영 부담을 없애려는 목표와 반대다.',
    ],
    principle:
      '엔진 호환 관리형 서비스는 코드 변경을 최소화하면서 운영 부담을 줄이는 리플랫폼 경로다. 호환 범위는 사전에 검증한다.',
    refs: [
      { title: 'Firestore with MongoDB compatibility 개요', url: 'https://docs.cloud.google.com/firestore/mongodb-compatibility/docs/overview' },
    ],
  },
  {
    id: 'c09-03',
    chapter: 9,
    domain: 1,
    topic: '데이터 거버넌스와 카탈로그',
    question:
      '데이터 레이크와 웨어하우스에 수천 개 테이블이 흩어져 있어, 분석가들은 어떤 데이터가 신뢰할 수 있는지, 누가 소유하는지, 어디서 왔는지 알 수 없다. 데이터 소유 도메인별로 자산을 관리하면서 검색·계보·품질·정책을 중앙에서 통제하고 싶다. 가장 적합한 서비스는?',
    options: [
      '스프레드시트로 테이블 목록을 관리한다.',
      'Knowledge Catalog(구 Dataplex)로 데이터 자산을 검색·분류하고, 계보·품질·접근 정책을 도메인 단위로 관리한다.',
      '모든 데이터를 하나의 버킷에 합친다.',
      '분석가에게 각 팀에 직접 문의하게 한다.',
    ],
    answer: [1],
    explanations: [
      '수작업 목록은 금방 낡고 계보·품질 정보를 담지 못한다.',
      'Knowledge Catalog는 분산된 데이터 자산을 통합 검색·메타데이터 관리하고, 계보·데이터 품질·거버넌스 정책을 제공해 도메인별 소유와 중앙 통제를 함께 지원한다.',
      '물리적 통합은 소유 구조를 무시하고 거버넌스 문제를 해결하지 못한다.',
      '개별 문의는 확장되지 않는다.',
    ],
    principle:
      '데이터 규모가 커지면 “찾을 수 있고, 믿을 수 있고, 통제되는” 데이터를 위해 카탈로그·계보·품질을 갖춘 거버넌스 계층이 필요하다.',
    refs: [
      { title: 'Knowledge Catalog 소개', url: 'https://docs.cloud.google.com/knowledge-catalog/docs/introduction' },
    ],
  },
  {
    id: 'c09-04',
    chapter: 9,
    domain: 1,
    topic: 'Interconnect 트래픽 암호화',
    question:
      '은행은 Dedicated Interconnect로 온프레미스와 연결했다. 내부 보안 정책은 사설 회선이라도 온프레미스와 VPC 간 모든 트래픽을 IPsec으로 암호화해야 한다고 규정한다. 인터넷 경로는 사용할 수 없다. 가장 적합한 구성은?',
    options: [
      '표준 HA VPN을 인터넷 경로로 구성한다.',
      'Cloud Interconnect를 통한 HA VPN(암호화된 VLAN 연결 위에 HA VPN 터널)을 구성한다.',
      '암호화 요구를 예외 처리한다.',
      'Interconnect를 해지하고 Partner Interconnect로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      '인터넷 경로 사용은 정책에 어긋난다.',
      'Cloud Interconnect를 통한 HA VPN은 Interconnect 연결 위에서 IPsec 터널을 구성해, 사설 회선의 성능·경로를 유지하면서 트래픽을 암호화한다.',
      '정책 예외는 보안 요구를 무시한다.',
      'Partner Interconnect로 바꿔도 IPsec 암호화 요구는 그대로 남는다.',
    ],
    principle:
      '사설 회선과 암호화는 별개의 요구다. Interconnect 위 암호화가 필요하면 HA VPN over Interconnect(또는 MACsec 지원 여부)를 검토한다.',
    refs: [
      { title: 'Cloud Interconnect를 통한 HA VPN', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/ha-vpn-interconnect' },
    ],
  },
  {
    id: 'c09-05',
    chapter: 9,
    domain: 1,
    topic: '표준·Spot 혼합 용량',
    question:
      '이미지 변환 API는 스테이트리스이며, 개별 요청이 실패해도 클라이언트가 재시도한다. 최소 처리 용량은 항상 보장되어야 하지만, 그 이상 급증분은 비용을 최대한 줄이고 싶다. 가장 적절한 구성은?',
    options: [
      '모든 인스턴스를 Spot VM으로 운영한다.',
      '최소 용량은 표준 VM MIG로, 초과 용량은 Spot VM MIG로 구성해 같은 부하 분산기 백엔드로 두고 각각 자동 확장한다.',
      '모든 인스턴스를 표준 VM으로 최대 규모에 고정한다.',
      '급증 시 요청을 모두 거절한다.',
    ],
    answer: [1],
    explanations: [
      'Spot만 쓰면 대량 선점 시 최소 용량이 보장되지 않는다.',
      '기준 용량은 표준 VM으로 보장하고 급증분은 저렴한 Spot VM으로 처리하면, 선점이 일어나도 최소 서비스는 유지되면서 비용을 줄일 수 있다.',
      '최대 규모 고정은 비용 낭비다.',
      '요청 거절은 서비스 품질을 떨어뜨린다.',
    ],
    principle:
      '“보장이 필요한 기준 용량은 표준, 버려도 되는 탄력 용량은 Spot”으로 혼합해 비용과 가용성을 함께 최적화한다.',
    refs: [
      { title: 'Spot VM', url: 'https://docs.cloud.google.com/compute/docs/instances/spot' },
    ],
  },
  {
    id: 'c09-06',
    chapter: 9,
    domain: 1,
    topic: 'Windows 파일 공유(SMB)',
    question:
      '건축 설계 회사는 Windows 워크스테이션과 애플리케이션이 Active Directory와 연동된 SMB 파일 공유에 대용량 도면을 저장한다. 온프레미스 NAS를 클라우드로 옮기면서 애플리케이션 변경 없이 SMB·AD 연동을 유지하고, 스냅샷 기반 복구도 원한다. 가장 적합한 서비스는?',
    options: [
      'Cloud Storage 버킷',
      'Google Cloud NetApp Volumes(SMB 볼륨, AD 연동)',
      'Bigtable',
      'Local SSD',
    ],
    answer: [1],
    explanations: [
      '객체 스토리지는 SMB 파일 공유를 제공하지 않는다.',
      'NetApp Volumes는 NFS와 SMB 등 파일 프로토콜을 지원하는 관리형 파일 스토리지로, Windows 환경의 AD 연동 SMB 공유와 스냅샷을 제공해 애플리케이션 변경 없이 이전할 수 있다.',
      'Bigtable은 데이터베이스다.',
      'Local SSD는 VM에 종속된 임시 스토리지다.',
    ],
    principle:
      '파일 스토리지는 프로토콜로 고른다: Linux NFS 중심 = Filestore, SMB·다중 프로토콜·엔터프라이즈 기능 = NetApp Volumes.',
    refs: [
      { title: 'Google Cloud NetApp Volumes 개요', url: 'https://docs.cloud.google.com/netapp/volumes/docs/discover/overview' },
    ],
  },
  {
    id: 'c09-07',
    chapter: 9,
    domain: 1,
    topic: '고성능 병렬 파일 시스템',
    question:
      'AI 연구소의 대규모 학습 클러스터(GPU 수백 개)가 수 PB 학습 데이터를 동시에 읽고, 주기적으로 대용량 체크포인트를 쓴다. 현재 스토리지 처리량이 병목이 되어 GPU가 놀고 있다. 기존 학습 코드는 POSIX 파일 시스템을 가정한다. 가장 적합한 스토리지는?',
    options: [
      'Filestore 기본 등급',
      'Managed Lustre 같은 고성능 관리형 병렬 파일 시스템',
      'Cloud SQL',
      '각 노드의 부팅 디스크',
    ],
    answer: [1],
    explanations: [
      '일반 NFS 파일 스토리지는 수백 GPU의 동시 고처리량 읽기·쓰기에 병목이 될 수 있다.',
      'Managed Lustre는 AI·HPC용 고성능 병렬 파일 시스템으로, 매우 높은 처리량과 PB 규모 용량을 제공해 GPU 활용률을 높인다.',
      'Cloud SQL은 파일 스토리지가 아니다.',
      '부팅 디스크는 노드 간 공유가 안 되고 용량·처리량이 부족하다.',
    ],
    principle:
      '대규모 AI·HPC는 “스토리지 처리량이 가속기 활용률을 좌우”한다. 병렬 파일 시스템이나 캐시 계층으로 병목을 없앤다.',
    refs: [
      { title: 'Managed Lustre 개요', url: 'https://docs.cloud.google.com/managed-lustre/docs/overview' },
    ],
  },
  {
    id: 'c09-08',
    chapter: 9,
    domain: 1,
    topic: '리플랫폼(수정) 전략',
    question:
      '인사 시스템은 자체 개발한 Java 앱과 VM에 설치된 MySQL로 구성된다. 코드는 유지보수가 잘 되고 있고 비즈니스 요구도 충족하지만, DB 백업·HA·패치 운영에 인력이 많이 든다. 이전 기간은 3개월이다. 가장 적절한 처분 전략은?',
    options: [
      '애플리케이션을 처음부터 마이크로서비스로 재작성한다.',
      '애플리케이션은 최소한만 수정하고, DB는 Cloud SQL for MySQL 같은 관리형 서비스로 옮기는 리플랫폼(수정) 전략을 택한다.',
      'SaaS로 교체한다.',
      '아무것도 바꾸지 않고 VM째로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '재작성은 3개월 일정과 요구 충족 상태를 감안하면 과도하다.',
      '리플랫폼은 핵심 코드는 유지하고 운영 부담이 큰 구성 요소(DB)를 관리형 서비스로 바꿔, 적은 변경으로 운영 효율을 크게 개선한다.',
      '요구를 충족하는 자체 시스템을 굳이 교체할 이유가 없다.',
      '리호스트만 하면 DB 운영 부담이 그대로 남는다.',
    ],
    principle:
      '처분 전략은 문제의 원인을 겨냥한다: 운영 부담이 문제면 해당 구성 요소만 관리형으로 바꾸는 리플랫폼이 효율적이다.',
    refs: [
      { title: 'Google Cloud로 마이그레이션: 시작하기', url: 'https://docs.cloud.google.com/architecture/migration-to-gcp-getting-started' },
    ],
  },
  {
    id: 'c09-09',
    chapter: 9,
    domain: 1,
    topic: '멀티 리전 서버리스',
    question:
      '글로벌 여행 앱의 API는 Cloud Run으로 운영된다. 한 리전의 장애가 전체 서비스 중단으로 이어지지 않게 하고, 사용자를 가까운 리전으로 보내 지연을 줄이고 싶다. 서버리스 운영 모델은 유지해야 한다. 가장 적합한 구성은?',
    options: [
      '한 리전의 Cloud Run 서비스에 최대 인스턴스 수를 늘린다.',
      '여러 리전에 같은 Cloud Run 서비스를 배포하고, 각 리전 서비스를 서버리스 NEG로 전역 외부 애플리케이션 부하 분산기의 백엔드에 연결한다.',
      'Cloud Run을 VM으로 교체한다.',
      '사용자에게 리전별 URL을 선택하게 한다.',
    ],
    answer: [1],
    explanations: [
      '단일 리전 확장은 리전 장애와 원거리 지연을 해결하지 못한다.',
      '멀티 리전 Cloud Run을 전역 부하 분산기 뒤에 두면 단일 IP로 가까운 리전에 라우팅하고, 한 리전 장애 시 다른 리전으로 트래픽을 보낼 수 있다. 데이터 계층도 멀티 리전 요구에 맞춰 설계해야 한다.',
      'VM 교체는 서버리스 운영 모델을 포기하는 것이다.',
      '수동 선택은 장애 조치와 근접 라우팅을 제공하지 않는다.',
    ],
    principle:
      '서버리스도 리전 서비스다. 멀티 리전 배포 + 전역 부하 분산기 + 멀티 리전 데이터 계층으로 리전 장애에 대비한다.',
    refs: [
      { title: '여러 리전에서 트래픽 제공(Cloud Run)', url: 'https://docs.cloud.google.com/run/docs/multiple-regions' },
    ],
  },
  {
    id: 'c09-10',
    chapter: 9,
    domain: 1,
    topic: '하이브리드 환경의 DB 일관성',
    question:
      '제조사는 공장 내부 네트워크에서 동작해야 하는 생산 관리 시스템(PostgreSQL)을 온프레미스에 두고, 본사 분석 시스템은 Google Cloud의 AlloyDB로 운영하려 한다. 두 환경에서 같은 DB 엔진과 기능·운영 방식을 쓰고 싶다. 가장 적합한 선택은?',
    options: [
      '공장에는 다른 상용 DB를, 클라우드에는 AlloyDB를 쓴다.',
      '공장에는 직접 관리하는 환경에서 실행하는 AlloyDB Omni를, 클라우드에는 관리형 AlloyDB를 사용한다.',
      '공장 시스템을 클라우드 AlloyDB에 인터넷으로 직접 연결한다.',
      '두 환경 모두 스프레드시트로 데이터를 관리한다.',
    ],
    answer: [1],
    explanations: [
      '서로 다른 엔진은 기능·운영·도구가 달라 일관성을 잃는다.',
      'AlloyDB Omni는 고객이 관리하는 환경에서 실행하는 다운로드형 AlloyDB로, 관리형 AlloyDB와 핵심 구성 요소를 공유해 하이브리드 환경에서 일관된 PostgreSQL 호환 엔진을 제공한다.',
      '공장 네트워크 내부 동작 요구와 연결 안정성 문제를 무시한다.',
      '스프레드시트는 DB를 대체하지 못한다.',
    ],
    principle:
      '하이브리드에서는 “어디서나 같은 기술”(GKE·AlloyDB Omni 등)로 운영 일관성을 확보한다.',
    refs: [
      { title: 'AlloyDB Omni 개요', url: 'https://docs.cloud.google.com/alloydb/omni/docs/overview' },
    ],
  },
  {
    id: 'c09-11',
    chapter: 9,
    domain: 1,
    topic: '단일 장애 지점 제거',
    question:
      '아키텍처 검토에서 다음 구성이 발견되었다: 리전 MIG(3개 영역) 웹 계층, Cloud SQL HA, 그러나 모든 아웃바운드 결제 API 호출은 한 영역의 단일 VM에서 동작하는 자체 프록시를 거친다. 가장 먼저 개선해야 할 점은?',
    options: [
      '웹 계층 인스턴스 수를 늘린다.',
      '단일 VM 프록시가 단일 장애 지점이므로 여러 영역에 이중화하거나, 관리형 대안(Cloud NAT·Secure Web Proxy 등)으로 교체한다.',
      'Cloud SQL을 Spanner로 바꾼다.',
      '웹 계층을 단일 영역으로 줄여 비용을 아낀다.',
    ],
    answer: [1],
    explanations: [
      '웹 계층은 이미 이중화되어 있으며, 병목·장애 지점은 프록시다.',
      '시스템 가용성은 가장 약한 고리에 좌우된다. 단일 영역의 단일 VM은 영역·VM 장애 시 전체 결제 기능을 멈추게 하므로 이중화하거나 관리형 서비스로 대체해야 한다.',
      'DB는 이미 HA이며 문제의 원인이 아니다.',
      '웹 계층 축소는 가용성을 떨어뜨린다.',
    ],
    principle:
      '가용성 설계 검토의 핵심은 요청 경로의 모든 구성 요소에서 단일 장애 지점을 찾아 없애는 것이다.',
    refs: [
      { title: '고가용성 시스템 구축', url: 'https://docs.cloud.google.com/architecture/framework/reliability/build-highly-available-systems' },
    ],
  },
  {
    id: 'c09-12',
    chapter: 9,
    domain: 1,
    topic: 'API 우선 파트너 연동',
    question:
      '헬스케어 SaaS는 신규 보험사를 연동할 때마다 전용 파일 전송·맞춤 인터페이스를 개발해 온보딩에 몇 달이 걸린다. 경영진은 신규 파트너를 최대한 빨리 연결하길 원한다. 아키텍처 방향으로 가장 적절한 것은?',
    options: [
      '파트너마다 맞춤 연동 코드를 계속 개발한다.',
      '표준화된 API(버전 관리·문서화)를 설계하고 Apigee 같은 API 관리 계층과 개발자 포털로 파트너가 셀프서비스로 연동하게 하며, 레거시 파일 연동은 전환 기간 동안 병행한다.',
      '모든 파트너에게 VPN으로 내부 DB에 직접 접근하게 한다.',
      '신규 파트너 수를 제한한다.',
    ],
    answer: [1],
    explanations: [
      '맞춤 연동은 파트너 수에 비례해 시간과 유지보수가 늘어난다.',
      '표준 API와 관리 계층(인증·쿼터·분석)·개발자 포털은 연동 방식을 표준화해 파트너가 스스로 빠르게 연결하게 한다. 기존 연동은 점진적으로 전환한다.',
      'DB 직접 접근은 보안·결합도 문제가 크다.',
      '파트너 제한은 비즈니스 목표와 반대다.',
    ],
    principle:
      '외부 통합의 확장성은 표준 API + API 관리 + 셀프서비스 온보딩에서 나온다.',
    refs: [
      { title: 'Apigee 개요', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/get-started/what-apigee' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (9) ─────────
  {
    id: 'c09-13',
    chapter: 9,
    domain: 2,
    topic: 'BGP 경로 우선순위(액티브-패시브)',
    question:
      '회사는 서로 다른 대도시의 Interconnect 연결 두 개를 가지고 있다. 평상시에는 서울 쪽 연결로만 트래픽이 흐르고, 서울 연결 장애 시에만 부산 쪽 연결을 쓰는 액티브-패시브 구성을 원한다. 두 경로 모두 BGP로 광고된다. 어떻게 구성해야 하는가?',
    options: [
      '부산 쪽 BGP 세션을 평상시 수동으로 꺼 둔다.',
      'Cloud Router의 광고 경로 우선순위(기본 우선순위/MED)를 조정해 부산 경로를 덜 선호하도록 설정하고, 온프레미스 라우터에서도 대응하는 경로 선호도를 설정한다.',
      '두 연결에 같은 우선순위를 둔다.',
      '정적 경로로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      '수동 세션 차단은 장애 시 자동 전환이 되지 않는다.',
      'BGP 경로 우선순위를 차등화하면 평상시에는 선호 경로를 쓰고, 선호 경로가 사라지면 자동으로 대체 경로로 전환된다. 양방향 모두 일관되게 설정해야 비대칭 라우팅을 피한다.',
      '같은 우선순위는 두 경로에 트래픽을 분산하는 액티브-액티브가 된다.',
      '정적 경로는 장애 감지·전환이 어렵다.',
    ],
    principle:
      '하이브리드 경로 제어는 BGP 속성(우선순위·MED 등)으로 양방향을 일관되게 설계한다.',
    refs: [
      { title: 'Cloud Router 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/router/concepts/overview' },
    ],
  },
  {
    id: 'c09-14',
    chapter: 9,
    domain: 2,
    topic: '비공개 서비스 액세스 범위',
    question:
      '팀이 VPC에서 비공개 IP로 새 Cloud SQL 인스턴스를 만들려 하자 “할당된 IP 범위에 사용 가능한 주소가 없다”는 오류가 발생했다. 이 VPC는 비공개 서비스 액세스로 Cloud SQL·Memorystore 등 여러 관리형 서비스를 이미 사용 중이다. 가장 적절한 해결책은?',
    options: [
      '기존 Cloud SQL 인스턴스를 삭제한다.',
      '온프레미스·다른 서브넷과 겹치지 않는 추가 IP 범위를 할당하고, 비공개 서비스 액세스 연결에 추가한다.',
      '새 인스턴스를 공인 IP로 만든다.',
      'VPC를 새로 만든다.',
    ],
    answer: [1],
    explanations: [
      '기존 서비스 삭제는 운영 장애를 일으킨다.',
      '비공개 서비스 액세스는 서비스 제작자 네트워크용으로 할당된 IP 범위를 사용한다. 범위가 부족하면 겹치지 않는 범위를 추가 할당해 연결에 포함시키면 된다.',
      '공인 IP는 보안 요구와 맞지 않는다.',
      '새 VPC는 기존 연결 구조를 깨뜨린다.',
    ],
    principle:
      '관리형 서비스용 사설 IP 범위도 IP 계획에 포함하고, 성장을 고려해 충분히 할당한다.',
    refs: [
      { title: '비공개 서비스 액세스', url: 'https://docs.cloud.google.com/vpc/docs/private-services-access' },
    ],
  },
  {
    id: 'c09-15',
    chapter: 9,
    domain: 2,
    topic: 'VPC 간 DNS 공유',
    question:
      '공통 서비스 VPC의 Cloud DNS 비공개 영역(svc.internal)에 사내 서비스 이름이 등록되어 있다. 여러 애플리케이션 VPC에서 같은 이름을 해석해야 하지만, 영역을 VPC마다 복제해 관리하고 싶지는 않다. 가장 적절한 방법은?',
    options: [
      '각 VPC에 같은 비공개 영역을 따로 만들어 수동 동기화한다.',
      '애플리케이션 VPC에 공통 서비스 VPC를 대상으로 하는 DNS 피어링 영역을 만들어 svc.internal 조회를 위임한다.',
      '모든 이름을 공개 DNS 영역에 등록한다.',
      '각 VM의 hosts 파일을 사용한다.',
    ],
    answer: [1],
    explanations: [
      '복제는 불일치와 관리 부담을 만든다.',
      'DNS 피어링 영역은 한 VPC의 이름 해석을 다른 VPC의 DNS 구성으로 위임해, 비공개 영역을 한곳에서만 관리하면서 여러 VPC가 사용할 수 있게 한다.',
      '내부 이름의 공개 등록은 정보 노출이다.',
      'hosts 파일은 확장되지 않는다.',
    ],
    principle:
      '여러 VPC의 이름 해석은 중앙 영역 + DNS 피어링(또는 공유 VPC)으로 단일 진실 공급원을 유지한다.',
    refs: [
      { title: 'Cloud DNS 영역 개요', url: 'https://docs.cloud.google.com/dns/docs/zones/zones-overview' },
    ],
  },
  {
    id: 'c09-16',
    chapter: 9,
    domain: 2,
    topic: 'GKE Sandbox',
    question:
      '온라인 코딩 교육 플랫폼은 학습자가 제출한 임의의 코드를 GKE 파드에서 실행한다. 악성 코드가 컨테이너를 탈출해 노드 커널이나 다른 워크로드에 영향을 줄 위험을 줄이기 위해 추가 격리 계층이 필요하다. 가장 적절한 방법은?',
    options: [
      '파드를 특권(privileged) 모드로 실행한다.',
      '신뢰할 수 없는 코드 실행용 노드 풀에 GKE Sandbox(gVisor)를 사용 설정하고 해당 파드를 그 노드 풀에서 실행한다.',
      '모든 파드에 외부 IP를 부여한다.',
      '코드 실행 시간을 늘린다.',
    ],
    answer: [1],
    explanations: [
      '특권 모드는 격리를 오히려 약화시킨다.',
      'GKE Sandbox는 gVisor로 컨테이너와 호스트 커널 사이에 추가 격리 계층을 두어, 신뢰할 수 없는 코드의 커널 공격 표면을 줄인다.',
      '외부 IP는 노출을 늘린다.',
      '실행 시간은 격리와 무관하다.',
    ],
    principle:
      '신뢰할 수 없는 워크로드는 전용 노드 풀 + 샌드박스(gVisor) + 네트워크 정책으로 다층 격리한다.',
    refs: [
      { title: 'GKE Sandbox', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods' },
    ],
  },
  {
    id: 'c09-17',
    chapter: 9,
    domain: 2,
    topic: '멀티 클러스터 서비스 검색',
    question:
      '같은 플릿에 등록된 두 GKE 클러스터(서울·도쿄)에서, 서울 클러스터의 주문 서비스가 도쿄 클러스터에만 있는 재고 서비스를 내부적으로 호출해야 한다. 외부 부하 분산기나 수동 DNS 관리 없이 Kubernetes 방식으로 서비스를 클러스터 간에 노출하려면?',
    options: [
      '재고 서비스를 인터넷에 공개한다.',
      '멀티 클러스터 서비스(MCS)로 재고 서비스를 내보내(ServiceExport) 다른 클러스터에서 가져와(ServiceImport) 호출한다.',
      '두 클러스터를 하나로 합친다.',
      '각 파드 IP를 하드코딩한다.',
    ],
    answer: [1],
    explanations: [
      '인터넷 공개는 보안상 불필요하다.',
      '멀티 클러스터 서비스는 플릿 내 클러스터 간 서비스 검색과 호출을 Kubernetes 리소스로 제공해, 한 클러스터의 서비스를 다른 클러스터에서 이름으로 호출할 수 있게 한다.',
      '클러스터 통합은 지역 분산 목적을 무시한다.',
      '파드 IP는 바뀌므로 하드코딩은 깨진다.',
    ],
    principle:
      '클러스터 간 내부 호출은 멀티 클러스터 서비스, 외부 전역 진입은 멀티 클러스터 게이트웨이로 구분한다.',
    refs: [
      { title: '멀티 클러스터 서비스', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/multi-cluster-services' },
    ],
  },
  {
    id: 'c09-18',
    chapter: 9,
    domain: 2,
    topic: 'VM 구성 표준화(OS 정책)',
    question:
      '보안팀은 모든 Linux VM에 특정 보안 에이전트가 설치·실행되고, 특정 설정 파일이 표준 값으로 유지되길 원한다. 새로 만든 VM과 기존 VM 모두 자동으로 맞춰져야 하며, 누군가 설정을 바꾸면 다시 표준으로 돌아가야 한다. 가장 적절한 방법은?',
    options: [
      'VM을 만들 때마다 관리자가 수동으로 설치한다.',
      'VM Manager의 OS 정책 할당으로 대상 VM(라벨 등)에 패키지 설치·설정 상태를 선언하고 지속적으로 적용한다.',
      '부팅 스크립트를 한 번만 실행한다.',
      '월 1회 점검 보고서를 받는다.',
    ],
    answer: [1],
    explanations: [
      '수동 설치는 누락과 불일치를 만든다.',
      'OS 정책은 원하는 소프트웨어·구성 상태를 선언하고 대상 VM에 지속적으로 적용해, 새 VM과 기존 VM 모두를 표준으로 유지하고 변경을 되돌린다.',
      '부팅 스크립트는 이후 변경을 교정하지 못한다.',
      '점검 보고서는 사후 확인일 뿐이다.',
    ],
    principle:
      'VM 구성도 선언적으로 관리한다: 원하는 상태를 정의하고 지속적으로 수렴시킨다(OS 정책).',
    refs: [
      { title: 'VM Manager OS 정책', url: 'https://docs.cloud.google.com/compute/vm-manager/docs/os-policies' },
    ],
  },
  {
    id: 'c09-19',
    chapter: 9,
    domain: 2,
    topic: '밀집 배치 정책',
    question:
      '전산 유체 역학 시뮬레이션은 MPI로 수십 대 VM이 긴밀하게 통신하며, 노드 간 네트워크 지연이 전체 성능을 좌우한다. VM을 만들 때 가능한 한 물리적으로 가까이 배치해 지연을 줄이고 싶다. 어떻게 해야 하는가?',
    options: [
      'VM을 여러 리전에 분산한다.',
      '밀집(compact) 배치 정책을 만들어 VM에 적용해 서로 가까운 하드웨어에 배치되게 한다.',
      '각 VM에 외부 IP를 부여한다.',
      'VM을 가장 작은 머신 유형으로 만든다.',
    ],
    answer: [1],
    explanations: [
      '리전 분산은 지연을 크게 늘린다.',
      '밀집 배치 정책은 VM을 데이터센터 안에서 서로 가깝게 배치해 VM 간 네트워크 지연을 줄여, 긴밀히 결합된 HPC 워크로드 성능을 높인다.',
      '외부 IP는 지연과 무관하다.',
      '작은 머신은 노드 수를 늘려 통신 비용을 키운다.',
    ],
    principle:
      '배치 정책은 목적에 따라 반대로 쓴다: 성능(지연) = 밀집 배치, 가용성(장애 격리) = 분산 배치.',
    refs: [
      { title: '밀집 배치 정책 사용', url: 'https://docs.cloud.google.com/compute/docs/instances/use-compact-placement-policies' },
    ],
  },
  {
    id: 'c09-20',
    chapter: 9,
    domain: 2,
    topic: 'Cloud Run 볼륨 마운트',
    question:
      'Cloud Run으로 옮기는 레거시 보고서 생성기는 설정 템플릿과 폰트 파일을 로컬 파일 경로에서 읽는다. 이 파일들은 Cloud Storage 버킷에서 관리되며 자주 바뀌어, 컨테이너 이미지에 포함하면 변경 때마다 재배포해야 한다. 코드 변경을 최소화하려면?',
    options: [
      '파일을 컨테이너 이미지에 넣고 변경 때마다 재빌드한다.',
      'Cloud Run 서비스에 Cloud Storage 볼륨 마운트를 구성해 버킷을 파일 경로로 읽게 한다.',
      '애플리케이션을 VM으로 되돌린다.',
      '파일 내용을 환경 변수에 모두 넣는다.',
    ],
    answer: [1],
    explanations: [
      '이미지 포함은 변경 때마다 재배포가 필요하다.',
      'Cloud Run은 Cloud Storage 버킷(또는 NFS)을 볼륨으로 마운트할 수 있어, 파일 경로 기반 코드를 거의 바꾸지 않고 버킷의 최신 파일을 읽게 한다.',
      'VM 복귀는 서버리스 이점을 버린다.',
      '환경 변수는 대용량 바이너리 파일에 적합하지 않다.',
    ],
    principle:
      '서버리스 이전 시 로컬 파일 의존성은 볼륨 마운트·객체 스토리지 API로 풀어낸다.',
    refs: [
      { title: 'Cloud Run Cloud Storage 볼륨 마운트', url: 'https://docs.cloud.google.com/run/docs/configuring/services/cloud-storage-volume-mounts' },
    ],
  },
  {
    id: 'c09-21',
    chapter: 9,
    domain: 2,
    topic: 'Firestore TTL',
    question:
      '모바일 앱은 Firestore에 사용자별 임시 인증 코드와 세션 문서를 저장한다. 이 문서들은 생성 후 24시간이 지나면 필요 없고, 개인정보 보호 정책상 자동으로 삭제되어야 한다. 삭제용 배치 작업을 운영하고 싶지 않다. 가장 적절한 방법은?',
    options: [
      'Cloud Scheduler로 매시간 삭제 함수를 실행한다.',
      '문서에 만료 시각 필드를 두고 Firestore TTL 정책을 설정해 만료된 문서가 자동 삭제되게 한다.',
      '앱이 로그아웃할 때만 삭제한다.',
      '문서를 영구 보관한다.',
    ],
    answer: [1],
    explanations: [
      '예약 삭제 작업은 운영 부담과 실패 관리가 필요하다.',
      'TTL 정책은 지정한 타임스탬프 필드가 지난 문서를 자동으로 삭제해 별도 작업 없이 보존 기간을 지키게 한다.',
      '로그아웃하지 않는 사용자의 문서가 남는다.',
      '영구 보관은 정책 위반이다.',
    ],
    principle:
      '데이터 수명 주기는 서비스의 선언적 기능(TTL·수명 주기·파티션 만료)으로 자동화한다.',
    refs: [
      { title: 'Firestore TTL 정책', url: 'https://docs.cloud.google.com/firestore/native/docs/ttl' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (8) ─────────
  {
    id: 'c09-22',
    chapter: 9,
    domain: 3,
    topic: '사용 가능한 서비스 제한',
    question:
      '규제 대상 폴더에서는 승인된 Google Cloud 서비스(예: Compute Engine, Cloud Storage, BigQuery)만 사용할 수 있어야 하고, 검토되지 않은 서비스는 사용 설정 자체가 불가능해야 한다. 가장 적절한 방법은?',
    options: [
      '프로젝트마다 IAM으로 API 사용 설정 권한을 제거한다.',
      '리소스 서비스 사용 제한 조직 정책(gcp.restrictServiceUsage)으로 허용 서비스 목록을 폴더에 적용한다.',
      '승인 서비스 목록을 공지한다.',
      '결제 계정을 분리한다.',
    ],
    answer: [1],
    explanations: [
      'IAM 권한 제거는 필요한 서비스 사용 설정까지 막고 예외 관리가 복잡하다.',
      '이 조직 정책은 허용·거부할 서비스를 지정해 하위 리소스에서 사용할 수 있는 Google Cloud 서비스를 제한한다.',
      '승인 서비스 목록 공지만으로는 미승인 서비스 사용을 막지 못한다.',
      '결제 계정 분리는 서비스 사용 제한과 무관하다.',
    ],
    principle:
      '“무엇을 쓸 수 있는가”(서비스)도 조직 정책으로 거버넌스한다.',
    refs: [
      { title: '리소스 서비스 사용 제한', url: 'https://docs.cloud.google.com/organization-policy/restrict-services' },
    ],
  },
  {
    id: 'c09-23',
    chapter: 9,
    domain: 3,
    topic: 'Workforce Identity Federation',
    question:
      '다국적 기업의 데이터 분석가 수천 명은 외부 IdP(Okta 등)로 관리된다. 이들이 Google Cloud 콘솔과 BigQuery를 사용해야 하지만, 보안팀은 사용자 계정을 Cloud Identity로 동기화(복제)하고 싶지 않다. 가장 적절한 방법은?',
    options: [
      '모든 분석가에게 개인 Gmail 계정을 쓰게 한다.',
      'Workforce Identity Federation으로 외부 IdP를 연동해, 사용자 동기화 없이 IdP 속성 기반으로 Google Cloud에 로그인하고 IAM 권한을 받게 한다.',
      '공용 서비스 계정 키를 분석가에게 배포한다.',
      '분석가 수만큼 Cloud Identity 계정을 수동으로 만든다.',
    ],
    answer: [1],
    explanations: [
      '개인 계정은 회사 통제 밖이다.',
      'Workforce Identity Federation은 외부 IdP의 사용자를 동기화 없이 연동해, IdP 속성·그룹을 기반으로 IAM 권한을 부여하고 Google Cloud에 접근하게 한다.',
      '공용 키는 개인 식별과 통제가 불가능하다.',
      '수동 계정 생성은 동기화를 피하려는 요구와 반대이며 관리 부담이 크다.',
    ],
    principle:
      '사람(직원) 연동 = Workforce Identity Federation 또는 Cloud Identity 동기화, 워크로드 연동 = Workload Identity Federation.',
    refs: [
      { title: 'Workforce Identity Federation', url: 'https://docs.cloud.google.com/iam/docs/workforce-identity-federation' },
    ],
  },
  {
    id: 'c09-24',
    chapter: 9,
    domain: 3,
    topic: '전송 중 암호화',
    question:
      '감사인이 “사용자에서 Google Cloud 부하 분산기까지, 그리고 Google 데이터센터 사이 구간의 전송 데이터가 어떻게 보호되는지” 묻는다. 동시에 VPC 내부 VM 간 애플리케이션 트래픽에 대한 추가 요구사항도 확인하고 싶어 한다. 가장 정확한 설명은?',
    options: [
      'Google Cloud는 어떤 전송 구간도 암호화하지 않으므로 모든 암호화를 고객이 구현해야 한다.',
      'Google은 사용자-Google 프런트엔드 구간을 TLS로 보호하고 Google이 통제하는 물리적 경계 밖 데이터센터 간 트래픽을 기본 암호화하지만, 애플리케이션 수준의 종단 간 암호화(예: 서비스 간 mTLS)가 필요하면 고객이 추가로 구성해야 한다.',
      '모든 트래픽이 자동으로 고객 관리 키로 암호화된다.',
      'VPC 내부 트래픽은 인터넷에 노출된다.',
    ],
    answer: [1],
    explanations: [
      'Google은 여러 계층에서 전송 중 암호화를 기본 제공한다.',
      'Google의 전송 중 암호화 문서는 사용자와 Google 프런트엔드 간 TLS, 물리적 경계를 벗어나는 트래픽의 기본 암호화 등을 설명한다. 애플리케이션 계층의 추가 보호(mTLS·TLS 종단 간 암호화) 요구는 고객이 구성한다.',
      '전송 중 암호화 키는 고객 관리 키(CMEK) 대상이 아니다.',
      'VPC 내부 트래픽은 인터넷에 노출되지 않는다.',
    ],
    principle:
      '기본 제공되는 보호와 고객이 추가해야 하는 보호의 경계를 공식 문서로 확인해 감사 요구에 답한다.',
    refs: [
      { title: 'Google Cloud 전송 중 암호화', url: 'https://docs.cloud.google.com/docs/security/encryption-in-transit' },
    ],
  },
  {
    id: 'c09-25',
    chapter: 9,
    domain: 3,
    topic: '태그 기반 조건부 접근',
    question:
      '조직에 프로젝트가 수백 개 있다. 보안팀은 “environment=prod” 태그가 붙은 프로젝트에서는 개발자 그룹이 읽기 전용 역할만, 나머지 프로젝트에서는 편집 역할을 갖게 하고 싶다. 새 프로젝트에도 태그만 붙이면 자동 적용되길 원한다. 가장 적절한 방법은?',
    options: [
      '프로젝트마다 IAM 바인딩을 수동으로 만든다.',
      '조직 수준에서 리소스 태그를 조건으로 하는 IAM 조건부 역할 바인딩을 만든다(prod 태그일 때 읽기 전용, 아닐 때 편집).',
      '프로젝트 이름에 prod를 넣도록 규칙만 만든다.',
      '모든 프로젝트에서 개발자 권한을 제거한다.',
    ],
    answer: [1],
    explanations: [
      '수동 바인딩은 누락과 불일치를 만든다.',
      'IAM 조건은 리소스에 연결된 태그를 조건으로 사용할 수 있어, 상위 수준의 바인딩 하나로 태그에 따라 다른 권한을 자동 적용할 수 있다.',
      '이름 규칙은 강제력이 없다.',
      '권한 전면 제거는 개발을 막는다.',
    ],
    principle:
      '속성 기반 접근 제어(태그 + IAM 조건)로 대규모 환경의 권한 정책을 선언적으로 관리한다.',
    refs: [
      { title: '태그와 조건부 접근', url: 'https://docs.cloud.google.com/iam/docs/tags-access-control' },
    ],
  },
  {
    id: 'c09-26',
    chapter: 9,
    domain: 3,
    topic: '아웃바운드 웹 트래픽 통제',
    question:
      '금융사 보안 정책은 VM과 GKE 워크로드의 인터넷 아웃바운드를 승인된 도메인(예: 패키지 저장소, 파트너 API)으로만 제한하고, 모든 요청을 로깅하도록 요구한다. IP 기반 방화벽 규칙으로는 도메인의 IP가 자주 바뀌어 관리가 어렵다. 가장 적합한 방법은?',
    options: [
      'Cloud NAT만 구성하고 모든 아웃바운드를 허용한다.',
      'Secure Web Proxy로 아웃바운드 웹 트래픽을 프록시하고, 허용할 호스트·URL을 정책으로 정의하며 요청을 로깅한다.',
      '매일 도메인의 IP를 조회해 방화벽 규칙을 갱신하는 스크립트를 만든다.',
      '모든 워크로드에서 인터넷 접근을 허용하고 사후 감사한다.',
    ],
    answer: [1],
    explanations: [
      'NAT만으로는 목적지 도메인을 통제하지 못한다.',
      'Secure Web Proxy는 관리형 이그레스 웹 프록시로, 호스트·URL 등 애플리케이션 계층 속성으로 아웃바운드 트래픽을 허용·거부하고 로깅할 수 있다.',
      '스크립트 기반 IP 갱신은 취약하고 오류가 잦다.',
      '사후 감사는 유출을 막지 못한다.',
    ],
    principle:
      '이그레스 통제: IP·포트 = 방화벽 정책, 도메인·URL = 웹 프록시(Secure Web Proxy), 위협 탐지 = Cloud NGFW.',
    refs: [
      { title: 'Secure Web Proxy 개요', url: 'https://docs.cloud.google.com/secure-web-proxy/docs/overview' },
    ],
  },
  {
    id: 'c09-27',
    chapter: 9,
    domain: 3,
    topic: 'L7 DDoS 자동 탐지',
    question:
      '게임 회사의 로그인 API는 전역 외부 애플리케이션 부하 분산기와 Cloud Armor로 보호되지만, 매번 패턴이 다른 대규모 L7 공격이 올 때마다 보안팀이 수동으로 규칙을 작성하느라 대응이 늦다. 비정상 트래픽 패턴을 자동으로 탐지하고 대응 규칙을 제안받고 싶다. 가장 적절한 기능은?',
    options: [
      'VPC 방화벽 규칙을 추가한다.',
      'Cloud Armor Adaptive Protection을 사용 설정해 트래픽 이상을 학습·탐지하고 제안된 규칙을 검토해 적용한다(필요 시 자동 배포 구성).',
      '백엔드 인스턴스를 무한 확장한다.',
      '로그인 API를 일시 중지한다.',
    ],
    answer: [1],
    explanations: [
      'VPC 방화벽은 L7 공격 패턴을 식별하지 못한다.',
      'Adaptive Protection은 백엔드 서비스의 트래픽 기준선을 학습해 L7 DDoS 같은 이상을 탐지하고, 공격 서명과 완화 규칙을 제안해 대응 시간을 줄인다.',
      '무한 확장은 비용만 폭증시킨다.',
      '서비스 중지는 공격자의 목표를 달성시켜 준다.',
    ],
    principle:
      '변화하는 L7 공격에는 정적 규칙 + ML 기반 이상 탐지(Adaptive Protection)를 결합한다.',
    refs: [
      { title: 'Cloud Armor Adaptive Protection 개요', url: 'https://docs.cloud.google.com/armor/docs/adaptive-protection-overview' },
    ],
  },
  {
    id: 'c09-28',
    chapter: 9,
    domain: 3,
    topic: '봇·자격 증명 대입 방어',
    question:
      '쇼핑몰 로그인 페이지에 유출된 계정 목록을 이용한 자격 증명 대입(credential stuffing) 공격이 계속된다. 공격은 수많은 IP에서 분산되어 IP 기반 레이트 리밋으로 막기 어렵고, 정상 사용자의 불편은 최소화해야 한다. 가장 적절한 방법은?',
    options: [
      '모든 사용자에게 로그인 시 복잡한 퍼즐을 풀게 한다.',
      'reCAPTCHA로 요청의 위험 점수를 평가해 의심스러운 로그인만 추가 검증하거나 차단하고, Cloud Armor와 연동해 엣지에서 대응한다.',
      '로그인 기능을 하루 중 일부 시간만 연다.',
      '모든 해외 IP를 차단한다.',
    ],
    answer: [1],
    explanations: [
      '모든 사용자에게 퍼즐을 강요하면 정상 사용자 경험이 크게 나빠진다.',
      'reCAPTCHA는 사용자 상호작용 없이 요청의 위험도를 평가해, 봇으로 의심되는 요청에만 추가 검증이나 차단을 적용할 수 있다. Cloud Armor 연동으로 엣지에서 조치할 수 있다.',
      '시간 제한은 정상 고객을 막는다.',
      '국가 차단은 분산 공격을 막지 못하고 정상 고객을 차단한다.',
    ],
    principle:
      '봇 방어는 위험 기반(점수) 대응으로 정상 사용자 경험과 보안을 함께 지킨다.',
    refs: [
      { title: 'reCAPTCHA 개요', url: 'https://docs.cloud.google.com/recaptcha/docs/overview' },
    ],
  },
  {
    id: 'c09-29',
    chapter: 9,
    domain: 3,
    topic: '생성형 AI 사용 감사',
    question:
      '보험사는 규제 대응을 위해 고객 상담에 사용된 생성형 AI의 입력 프롬프트와 모델 응답을 일정 기간 보관하고, 문제 사례가 생기면 어떤 응답이 나갔는지 추적할 수 있어야 한다. 모델은 Agent Platform에서 호출한다. 가장 적절한 방법은?',
    options: [
      '상담원에게 중요한 대화를 수동으로 복사해 두게 한다.',
      'Agent Platform의 요청-응답 로깅을 사용 설정해 BigQuery 등에 프롬프트와 응답을 기록하고, 보존 기간과 접근 통제(민감 정보 보호 포함)를 설정한다.',
      '모델 응답은 보관하지 않는다.',
      '모든 대화를 공개 버킷에 저장한다.',
    ],
    answer: [1],
    explanations: [
      '수동 복사는 누락과 불일치가 많다.',
      '요청-응답 로깅은 모델 호출의 입력·출력을 체계적으로 기록해 감사·품질 분석에 활용하게 한다. 개인정보가 포함될 수 있으므로 보존 기간·접근 통제·비식별화를 함께 설계한다.',
      '보관하지 않으면 규제 요구를 충족하지 못한다.',
      '공개 저장은 명백한 유출이다.',
    ],
    principle:
      'AI 시스템의 감사 가능성은 입력·출력 기록 + 보존·접근 통제로 설계한다.',
    refs: [
      { title: '요청-응답 로깅', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/request-response-logging' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (7) ─────────
  {
    id: 'c09-30',
    chapter: 9,
    domain: 4,
    topic: 'GKE 운영 모드와 비용',
    question:
      '사내 도구를 운영하는 GKE Standard 클러스터의 노드 사용률은 평균 15%다. 워크로드는 일반적인 스테이트리스 서비스이며, 팀은 노드 크기 조정과 빈 패킹(bin packing) 최적화에 시간을 쓰고 싶지 않다. 비용을 줄이는 가장 적절한 방안은?',
    options: [
      '노드를 더 큰 머신 유형으로 바꾼다.',
      '파드 리소스 요청 기준으로 과금되는 GKE Autopilot으로 전환을 검토하고, 파드 요청을 적정화한다.',
      '클러스터를 여러 개로 나눈다.',
      '모든 워크로드를 VM으로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '큰 노드는 낮은 사용률 문제를 더 악화시킬 수 있다.',
      'Autopilot은 노드가 아니라 파드 요청 리소스 기준으로 과금되고 노드 관리를 Google이 하므로, 사용률이 낮은 클러스터에서 유휴 노드 비용을 줄일 수 있다. 파드 요청 적정화가 함께 필요하다.',
      '클러스터 분할은 관리 비용과 유휴 자원을 늘린다.',
      'VM 이전은 컨테이너 운영의 이점을 잃는다.',
    ],
    principle:
      '낮은 사용률의 클러스터는 과금 모델을 바꾸거나(Autopilot) 빈 패킹을 개선해 유휴 비용을 없앤다.',
    refs: [
      { title: 'GKE 가격 책정', url: 'https://cloud.google.com/kubernetes-engine/pricing' },
    ],
  },
  {
    id: 'c09-31',
    chapter: 9,
    domain: 4,
    topic: '스토리지 작업 비용',
    question:
      'IoT 수집기가 센서 측정값 하나마다 수백 바이트짜리 객체를 Cloud Storage에 개별 저장해 하루 수억 개의 객체가 생긴다. 저장 용량은 작지만 청구서에서 쓰기 작업 비용이 저장 비용보다 훨씬 크다. 가장 효과적인 개선은?',
    options: [
      '버킷 스토리지 클래스를 Archive로 바꾼다.',
      '수집기에서 일정 시간 단위로 측정값을 묶어 더 큰 파일로 쓰거나, 스트리밍 데이터는 Pub/Sub·BigQuery 같은 적합한 서비스로 수집한다.',
      '버킷을 여러 개로 나눈다.',
      '객체 이름을 짧게 바꾼다.',
    ],
    answer: [1],
    explanations: [
      'Archive 같은 저가 클래스는 오히려 작업당 비용이 높아 쓰기 비용이 더 커질 수 있다.',
      'Cloud Storage는 객체 작업 수에 따라 과금되므로 아주 작은 객체를 대량으로 쓰면 작업 비용이 커진다. 묶어서 쓰거나 스트리밍 데이터에 적합한 서비스를 쓰면 작업 수가 크게 줄어든다.',
      '버킷을 나눠도 작업 수는 같다.',
      '이름 길이는 작업 비용과 거의 무관하다.',
    ],
    principle:
      '비용 구조(저장량·작업 수·전송량)를 이해하고 워크로드 패턴을 그에 맞춘다. 작은 객체 대량 쓰기는 작업 비용을 키운다.',
    refs: [
      { title: 'Cloud Storage 가격 책정', url: 'https://cloud.google.com/storage/pricing' },
    ],
  },
  {
    id: 'c09-32',
    chapter: 9,
    domain: 4,
    topic: '설계 단계 위협 모델링',
    question:
      '보안 취약점의 상당수가 출시 직전 침투 테스트에서야 발견되어, 설계를 되돌리는 비용이 크다. 개발 수명 주기에서 보안을 앞당기려면 어떤 관행을 도입하는 것이 가장 효과적인가?',
    options: [
      '출시 후 연 1회 침투 테스트만 수행한다.',
      '설계 단계에서 위협 모델링으로 데이터 흐름·신뢰 경계·위협을 식별하고, 보안 요구사항과 통제를 설계에 반영하며 코드 단계 자동 검사로 이어지게 한다.',
      '보안팀이 모든 코드를 직접 작성한다.',
      '보안 요구는 운영팀이 알아서 처리하게 한다.',
    ],
    answer: [1],
    explanations: [
      '사후 테스트만으로는 설계 결함 수정 비용이 크다.',
      '설계 단계 위협 모델링은 아키텍처 수준의 취약점을 가장 저렴한 시점에 찾아내고, 보안 요구를 이후 단계(코드 검사·테스트)로 연결하는 “보안 중심 설계”의 핵심 관행이다.',
      '보안팀의 코드 작성은 확장되지 않는다.',
      '운영 단계 책임 전가는 설계 결함을 해결하지 못한다.',
    ],
    principle:
      '보안은 설계에서 시작한다(security by design): 위협 모델링 → 보안 요구사항 → 자동 검사 → 테스트.',
    refs: [
      { title: '보안 중심 설계 구현', url: 'https://docs.cloud.google.com/architecture/framework/security/implement-security-by-design' },
    ],
  },
  {
    id: 'c09-33',
    chapter: 9,
    domain: 4,
    topic: '자동 대 수동 장애 조치',
    question:
      '리전 간 DR 설계에서 팀은 “주 리전 상태 확인 실패 시 즉시 자동으로 DR 리전으로 전환”할지 논의하고 있다. 데이터는 비동기로 복제되어 전환 시 수 분의 데이터 손실이 생길 수 있고, 과거에 일시적인 네트워크 문제로 상태 확인이 잠시 실패한 적이 있다. 가장 적절한 판단은?',
    options: [
      '모든 상태 확인 실패에 즉시 자동 전환한다.',
      '데이터 손실과 오탐(일시 장애) 위험을 고려해, 리전 전체 전환은 명확한 판단 기준과 사람의 승인을 거치는 절차(자동화된 런북 실행)로 하고, 무손실·가역적인 부분(예: 트래픽 계층)은 자동화를 검토한다.',
      'DR 전환을 아예 하지 않는다.',
      '상태 확인을 끈다.',
    ],
    answer: [1],
    explanations: [
      '일시적 오탐에 자동 전환하면 불필요한 데이터 손실과 복귀 작업(데이터 재동기화)이 발생할 수 있다.',
      '전환의 비용(데이터 손실·복귀 난이도)과 오탐 가능성을 고려해 자동화 수준을 정한다. 비가역적 결정은 명확한 기준과 승인을 두고, 실행은 자동화해 속도를 확보한다.',
      'DR 포기는 요구사항 위반이다.',
      '상태 확인을 끄면 장애 감지 능력을 잃는다.',
    ],
    principle:
      '자동화 수준은 행동의 가역성과 오탐 비용에 따라 정한다: 가역적 = 자동, 비가역적 = 사람의 판단 + 자동화된 실행.',
    refs: [
      { title: '재해 복구 계획 가이드', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
    ],
  },
  {
    id: 'c09-34',
    chapter: 9,
    domain: 4,
    topic: '내부 플랫폼을 제품처럼 운영',
    question:
      '플랫폼 팀이 만든 내부 개발자 플랫폼(CI/CD 템플릿·GKE 환경)을 개발팀들이 잘 사용하지 않고 각자 도구를 만든다. 플랫폼 팀은 기능을 많이 추가했지만 채택률이 낮다. 가장 효과적인 개선 방향은?',
    options: [
      '플랫폼 사용을 강제하는 규정만 만든다.',
      '개발팀을 내부 고객으로 보고 요구와 불편을 조사하며, 채택률·온보딩 시간·만족도 같은 지표로 우선순위를 정해 문서·셀프서비스·지원을 개선한다.',
      '기능을 더 많이 추가한다.',
      '플랫폼 팀을 해체한다.',
    ],
    answer: [1],
    explanations: [
      '강제만으로는 사용자의 실제 문제를 해결하지 못해 우회가 생긴다.',
      '플랫폼을 제품처럼 운영하면 사용자(개발팀) 요구를 기반으로 우선순위를 정하고, 사용성·문서·지원을 개선해 자발적 채택을 높일 수 있다.',
      '사용자 요구와 무관한 기능 추가는 채택을 높이지 못한다.',
      '해체는 표준화·효율의 이점을 잃는다.',
    ],
    principle:
      '내부 플랫폼의 성공 지표는 기능 수가 아니라 채택률과 개발자 경험이다.',
    refs: [
      { title: 'Application Design Center 개요', url: 'https://docs.cloud.google.com/application-design-center/docs/overview' },
    ],
  },
  {
    id: 'c09-35',
    chapter: 9,
    domain: 4,
    topic: '보안 사고 모의 훈련',
    question:
      '회사는 랜섬웨어 대응 계획 문서가 있지만, 실제 사고 때 누가 무엇을 결정하는지(서비스 차단, 고객 공지, 규제 기관 보고, 백업 복원 순서)가 불명확하다는 지적을 받았다. 기술 시스템을 건드리지 않고 조직의 대응 준비도를 점검하려면?',
    options: [
      '문서를 한 번 더 읽어 보게 한다.',
      '경영진·법무·보안·운영·커뮤니케이션 담당이 참여하는 탁상 훈련(tabletop exercise)으로 시나리오를 따라 결정을 연습하고, 드러난 공백을 계획에 반영한다.',
      '실제 운영 시스템을 암호화해 본다.',
      '사고가 날 때까지 기다린다.',
    ],
    answer: [1],
    explanations: [
      '문서 열람만으로는 역할·결정 경로의 공백이 드러나지 않는다.',
      '탁상 훈련은 시스템 영향 없이 시나리오를 따라 역할·의사결정·커뮤니케이션을 연습해, 계획의 공백을 안전하게 발견하고 개선한다.',
      '실제 시스템 공격 흉내는 위험하다.',
      '사고 때 처음 연습하는 것은 피해를 키운다.',
    ],
    principle:
      '사고 대응 준비도는 기술 훈련(장애 주입)과 조직 훈련(탁상 훈련)으로 함께 검증한다.',
    refs: [
      { title: 'SRE 워크북: 인시던트 대응', url: 'https://sre.google/workbook/incident-response/' },
    ],
  },
  {
    id: 'c09-36',
    chapter: 9,
    domain: 4,
    topic: '테넌트별 단위 비용',
    question:
      'B2B SaaS의 가격 정책을 재검토하면서 영업팀은 “어떤 고객이 수익성이 있는지” 알고 싶어 한다. 현재는 클라우드 비용 총액만 알고 고객별 비용을 모른다. 공유 인프라와 고객 전용 리소스가 섞여 있다. 가장 적절한 접근은?',
    options: [
      '총비용을 고객 수로 균등하게 나눈다.',
      '고객 전용 리소스는 라벨로 직접 할당하고, 공유 인프라 비용은 고객별 사용량 지표(요청 수·저장량 등)로 배분하는 비용 할당 모델을 만들어 고객별 단위 비용과 마진을 계산한다.',
      '가장 큰 고객에게 비용을 모두 할당한다.',
      '비용은 가격 결정과 무관하다고 본다.',
    ],
    answer: [1],
    explanations: [
      '균등 배분은 사용량 차이를 무시해 수익성 판단을 왜곡한다.',
      '직접 비용(라벨)과 공유 비용(사용량 기반 배분)을 결합하면 고객별 단위 비용을 합리적으로 추정해 가격·영업 전략에 반영할 수 있다.',
      '임의 할당은 의사결정을 왜곡한다.',
      '비용 정보 없이 가격을 정하면 손실 고객을 알 수 없다.',
    ],
    principle:
      '클라우드 비용을 비즈니스 단위(고객·기능·거래)로 연결하면 가격·투자 결정의 근거가 된다.',
    refs: [
      { title: 'Cloud Billing 데이터를 BigQuery로 내보내기', url: 'https://docs.cloud.google.com/billing/docs/how-to/export-data-bigquery' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (7) ─────────
  {
    id: 'c09-37',
    chapter: 9,
    domain: 5,
    topic: '배포 자동 승격',
    question:
      '팀은 Cloud Deploy에서 스테이징 배포가 성공하고 검증 테스트를 통과하면, 사람이 버튼을 누르지 않아도 운영 카나리 단계까지 자동으로 진행되길 원한다. 단, 운영 100% 전환은 승인 후에만 진행해야 한다. 가장 적절한 방법은?',
    options: [
      '모든 단계를 수동으로 승격한다.',
      'Cloud Deploy 자동화 규칙(예: 조건 충족 시 자동 승격·다음 단계 진행)을 구성하고, 운영 최종 단계에는 승인 요구를 유지한다.',
      '승인 절차를 모두 제거한다.',
      '스테이징을 없애고 운영에 바로 배포한다.',
    ],
    answer: [1],
    explanations: [
      '모든 단계 수동 승격은 속도를 떨어뜨린다.',
      'Cloud Deploy 자동화는 롤아웃 성공 같은 조건에서 승격·단계 진행 등을 자동으로 수행하게 하며, 필요한 대상에는 승인 요구를 유지해 통제와 속도를 함께 확보한다.',
      '승인 제거는 운영 통제 요구에 어긋난다.',
      '스테이징 생략은 위험을 키운다.',
    ],
    principle:
      '파이프라인은 “저위험 단계는 자동, 고위험 단계는 승인”으로 설계한다.',
    refs: [
      { title: 'Cloud Deploy 자동화', url: 'https://docs.cloud.google.com/deploy/docs/automation' },
    ],
  },
  {
    id: 'c09-38',
    chapter: 9,
    domain: 5,
    topic: 'IaC 드리프트 감지',
    question:
      '인프라는 Terraform으로 관리되지만, 장애 대응 중 운영자가 콘솔에서 방화벽 규칙과 인스턴스 설정을 직접 바꾸는 일이 있다. 몇 주 뒤 다음 배포에서 예상치 못한 변경이 일어나 문제가 생겼다. 이런 드리프트를 조기에 발견하려면?',
    options: [
      '콘솔 사용을 완전히 금지한다.',
      '정기적으로(예: 매일) CI에서 terraform plan을 실행해 코드와 실제 상태의 차이를 감지·알림하고, 긴급 변경은 사후에 코드로 반영하는 절차를 둔다.',
      '드리프트는 무시하고 다음 배포에서 덮어쓴다.',
      '상태 파일을 수동으로 편집한다.',
    ],
    answer: [1],
    explanations: [
      '긴급 대응 시 콘솔 사용이 필요할 수 있어 전면 금지는 현실적이지 않다.',
      '정기 plan은 코드와 실제 인프라의 차이를 조기에 드러내며, 긴급 변경을 코드로 되돌려 반영하는 절차와 결합하면 드리프트를 관리할 수 있다.',
      '무조건 덮어쓰면 긴급 수정이 사라져 장애가 재발할 수 있다.',
      '수동 상태 편집은 위험하다.',
    ],
    principle:
      'IaC의 진실 공급원은 코드다. 드리프트를 정기 감지하고, 긴급 변경은 반드시 코드로 되돌려 반영한다.',
    refs: [
      { title: 'Terraform 운영 모범 사례', url: 'https://docs.cloud.google.com/docs/terraform/best-practices/operations' },
    ],
  },
  {
    id: 'c09-39',
    chapter: 9,
    domain: 5,
    topic: 'Terraform 상태 보안',
    question:
      '보안 점검에서 Terraform 상태 파일에 DB 비밀번호 등 민감 값이 평문으로 포함되어 있고, 상태 버킷을 개발자 전원이 읽을 수 있다는 사실이 드러났다. 가장 적절한 개선은?',
    options: [
      '상태 파일을 Git에 커밋한다.',
      '상태 버킷 접근을 IaC 실행 서비스 계정과 소수 관리자로 제한하고(CMEK 적용 가능), 비밀은 Secret Manager에서 참조하도록 해 상태에 남는 민감 값을 최소화한다.',
      '상태 파일을 매일 삭제한다.',
      '민감 값을 Base64로 인코딩한다.',
    ],
    answer: [1],
    explanations: [
      'Git 커밋은 노출 범위를 더 넓힌다.',
      '상태 파일은 민감 정보를 포함할 수 있으므로 접근을 최소화하고 암호화하며, 비밀 자체는 Secret Manager 같은 전용 서비스에서 관리해 상태 노출 위험을 줄인다.',
      '상태 삭제는 Terraform 관리를 망가뜨린다.',
      'Base64 인코딩은 누구나 복원할 수 있어 보호가 아니다.',
    ],
    principle:
      'IaC 상태는 민감 자산이다: 최소 권한 접근 + 암호화 + 비밀의 외부화.',
    refs: [
      { title: 'Terraform 보안 모범 사례', url: 'https://docs.cloud.google.com/docs/terraform/best-practices/security' },
    ],
  },
  {
    id: 'c09-40',
    chapter: 9,
    domain: 5,
    topic: 'API 수익화',
    question:
      '날씨 데이터 회사가 API를 유료 상품으로 판매하려 한다. 요구사항은 요금제(월 구독·호출량 기반), 사용량에 따른 청구 데이터, 개발자 포털에서의 요금제 선택이다. 이미 Apigee로 API를 관리하고 있다. 가장 적합한 방법은?',
    options: [
      '호출 로그를 매달 수작업으로 집계해 청구서를 만든다.',
      'Apigee 수익화 기능으로 API 제품에 요금제를 정의하고, 사용량 기반 과금 데이터를 생성하며, 개발자 포털에서 요금제를 구독하게 한다.',
      'API를 무료로 공개하고 기부를 받는다.',
      '각 고객에게 별도 서버를 제공한다.',
    ],
    answer: [1],
    explanations: [
      '수작업 청구는 오류가 잦고 확장되지 않는다.',
      'Apigee 수익화는 API 제품 단위 요금제, 사용량 추적, 청구 연동 데이터, 개발자 구독 흐름을 제공해 API를 상품화할 수 있게 한다.',
      '비즈니스 모델 요구와 맞지 않는다.',
      '고객별 서버는 비용과 운영 부담이 과도하다.',
    ],
    principle:
      'API를 상품으로 판매할 때는 API 관리 플랫폼의 요금제·사용량 측정·포털 기능을 활용한다.',
    refs: [
      { title: 'Apigee 수익화 개요', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/monetization/overview' },
    ],
  },
  {
    id: 'c09-41',
    chapter: 9,
    domain: 5,
    topic: 'PostgreSQL에서 AlloyDB로',
    question:
      '회사가 온프레미스 PostgreSQL을 AlloyDB for PostgreSQL로 옮겨 분석 성능과 가용성을 높이려 한다. 전환 시 다운타임은 짧아야 하고, 관리형 도구로 초기 로드와 지속 복제를 하고 싶다. 가장 적합한 방법은?',
    options: [
      'pg_dump로 내보내 몇 시간 동안 서비스를 중단하고 가져온다.',
      'Database Migration Service의 PostgreSQL→AlloyDB 지속 마이그레이션으로 초기 로드 후 변경을 복제하고, 짧은 쓰기 중단 후 승격한다.',
      'Transfer Appliance로 데이터 파일을 보낸다.',
      'AlloyDB에 애플리케이션이 이중 쓰기하게 한다.',
    ],
    answer: [1],
    explanations: [
      '덤프 방식은 긴 다운타임을 만든다.',
      'Database Migration Service는 PostgreSQL에서 AlloyDB로의 지속 마이그레이션을 지원해, 초기 로드와 변경 데이터 복제 후 짧은 전환으로 이전할 수 있다.',
      '오프라인 파일 전송은 운영 중 변경을 반영하지 못한다.',
      '이중 쓰기는 일관성 문제와 개발 부담이 크다.',
    ],
    principle:
      '호환 엔진 간 이전(PostgreSQL→AlloyDB)도 “지속 복제 + 짧은 전환” 패턴을 관리형 도구로 수행한다.',
    refs: [
      { title: 'PostgreSQL에서 AlloyDB로 마이그레이션 소스와 대상', url: 'https://docs.cloud.google.com/database-migration/docs/postgresql-to-alloydb/migration-src-and-dest' },
    ],
  },
  {
    id: 'c09-42',
    chapter: 9,
    domain: 5,
    topic: 'AI 코딩 지원',
    question:
      '개발 조직이 반복적인 코드 작성, 단위 테스트 생성, 익숙하지 않은 코드 설명에 드는 시간을 줄이고 싶다. IDE 안에서 조직 보안 정책에 맞는 엔터프라이즈 AI 코딩 도구를 쓰길 원한다. 가장 적합한 선택은?',
    options: [
      '개발자가 공개 웹 챗봇에 사내 코드를 붙여 넣게 한다.',
      'Gemini Code Assist를 IDE에 도입해 코드 완성·생성·설명·테스트 작성을 지원받고, 생성 결과는 코드 리뷰와 테스트로 검증한다.',
      '모든 코드를 외부 업체에 외주한다.',
      'AI 사용을 전면 금지한다.',
    ],
    answer: [1],
    explanations: [
      '공개 서비스에 사내 코드를 붙여 넣으면 데이터 통제 위험이 있다.',
      'Gemini Code Assist는 IDE에서 코드 완성·생성·설명·테스트 생성 등을 지원하는 엔터프라이즈 AI 코딩 도구다. 생성된 코드도 일반 코드처럼 리뷰·테스트해야 한다.',
      '외주는 생산성 문제의 해법이 아니다.',
      '전면 금지는 생산성 향상 기회를 잃는다.',
    ],
    principle:
      'AI 개발 도구는 승인된 엔터프라이즈 도구로 도입하고, 결과물은 기존 품질 게이트(리뷰·테스트)로 검증한다.',
    refs: [
      { title: 'Gemini Code Assist 개요', url: 'https://docs.cloud.google.com/gemini/docs/codeassist/overview' },
    ],
  },
  {
    id: 'c09-43',
    chapter: 9,
    domain: 5,
    topic: '요청 멱등성 키',
    question:
      '결제 API의 클라이언트는 네트워크 타임아웃이 나면 같은 결제 생성 요청을 재시도한다. 서버는 첫 요청을 이미 처리했는데 응답만 유실된 경우, 재시도로 이중 결제가 생긴다. API 설계로 해결하려면?',
    options: [
      '클라이언트 재시도를 금지한다.',
      '클라이언트가 요청마다 고유 요청 ID를 보내고, 서버는 같은 ID의 요청이 다시 오면 새로 처리하지 않고 이전 결과를 반환하도록 멱등성을 보장한다.',
      '타임아웃을 무한대로 늘린다.',
      '결제 후 매일 중복 건을 수동 환불한다.',
    ],
    answer: [1],
    explanations: [
      '재시도 금지는 일시적 오류에서 요청 유실을 만든다.',
      '요청 ID(멱등성 키)를 사용하면 서버가 중복 요청을 식별해 한 번만 처리하므로, 안전하게 재시도할 수 있다. Google API 설계 가이드도 요청 ID 패턴을 권장한다.',
      '무한 타임아웃은 자원을 묶고 문제를 해결하지 못한다.',
      '수동 환불은 사후 처리일 뿐이다.',
    ],
    principle:
      '재시도가 안전하려면 부수 효과가 있는 API는 요청 ID로 멱등하게 설계한다.',
    refs: [
      { title: 'AIP-155: 요청 식별', url: 'https://google.aip.dev/155' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (7) ─────────
  {
    id: 'c09-44',
    chapter: 9,
    domain: 6,
    topic: '인증서 만료 감시',
    question:
      '온라인 서비스가 수동 관리 TLS 인증서의 만료를 놓쳐 몇 시간 동안 접속이 불가했다. 앞으로 만료 전에 미리 알고 싶고, 가능하면 만료 자체를 예방하고 싶다. 가장 적절한 조치는? (2개 선택)',
    options: [
      'HTTPS 업타임 체크를 구성하고 SSL 인증서 만료 임박 알림을 설정한다.',
      '가능한 경우 Google 관리형 인증서(자동 갱신)로 전환해 수동 갱신 의존을 없앤다.',
      '인증서 만료일을 개인 캘린더에만 기록한다.',
      'HTTPS를 끄고 HTTP로 서비스한다.',
      '만료 후 사용자 신고를 기다린다.',
    ],
    answer: [0, 1],
    explanations: [
      'HTTPS 업타임 체크는 서버 인증서의 만료 시간을 확인하므로, 만료 임박 알림으로 사전 대응할 수 있다.',
      '관리형 인증서는 자동 갱신되어 사람의 실수로 인한 만료를 예방한다.',
      '개인 캘린더는 담당자 부재 시 누락된다.',
      'HTTP 전환은 보안을 무너뜨린다.',
      '사후 신고는 이미 장애가 난 뒤다.',
    ],
    principle:
      '만료가 있는 자산(인증서·키·도메인)은 자동 갱신으로 예방하고, 모니터링으로 이중 안전장치를 둔다.',
    refs: [
      { title: '업타임 체크 만들기(SSL 인증서 확인)', url: 'https://docs.cloud.google.com/monitoring/uptime-checks' },
    ],
  },
  {
    id: 'c09-45',
    chapter: 9,
    domain: 6,
    topic: '꼬리 지연 분석',
    question:
      '결제 API의 평균 응답 시간은 120ms로 안정적인데, 일부 고객은 “가끔 결제가 몇 초씩 걸린다”고 불만을 제기한다. 운영 대시보드는 평균만 보여 준다. 문제를 제대로 드러내려면 어떻게 해야 하는가?',
    options: [
      '평균 응답 시간 목표를 100ms로 낮춘다.',
      '지연 시간을 분포(히스토그램)와 백분위수(p95·p99)로 모니터링하고, 느린 요청의 트레이스를 분석해 원인을 찾는다.',
      '고객 불만을 무시한다.',
      '서버 수를 늘린다.',
    ],
    answer: [1],
    explanations: [
      '평균은 소수의 매우 느린 요청을 가려 문제를 보이지 않게 한다.',
      '백분위수와 분포는 꼬리 지연을 드러내고, 느린 요청의 분산 추적으로 병목(재시도·잠금·외부 호출 등)을 찾을 수 있다.',
      '불만 무시는 고객 이탈로 이어진다.',
      '원인을 모른 채 증설하면 효과가 없을 수 있다.',
    ],
    principle:
      '지연은 평균이 아니라 분포(백분위수)로 본다. 사용자가 체감하는 것은 꼬리 지연이다.',
    refs: [
      { title: 'SRE 책: 서비스 수준 목표', url: 'https://sre.google/sre-book/service-level-objectives/' },
    ],
  },
  {
    id: 'c09-46',
    chapter: 9,
    domain: 6,
    topic: '보안 로그의 SIEM 연동',
    question:
      '보안 운영 센터(SOC)는 외부 SIEM 도구로 여러 클라우드와 온프레미스의 보안 이벤트를 통합 분석한다. Google Cloud의 감사 로그와 방화벽 로그를 거의 실시간으로 SIEM에 보내야 한다. 가장 적절한 구성은?',
    options: [
      '매주 로그를 수동으로 내려받아 업로드한다.',
      '로그 싱크로 필요한 보안 로그를 Pub/Sub 주제로 라우팅하고, SIEM이 이를 구독(또는 커넥터로 수집)하게 한다.',
      '로그를 이메일로 전달한다.',
      '감사 로그를 끈다.',
    ],
    answer: [1],
    explanations: [
      '수동 전송은 실시간성과 신뢰성이 없다.',
      '로그 싱크는 필터로 선택한 로그를 Pub/Sub로 내보낼 수 있어, 외부 SIEM이 거의 실시간으로 수집할 수 있다. 조직 수준 집계 싱크로 범위를 넓힐 수도 있다.',
      '이메일은 로그 전송 수단이 아니다.',
      '감사 로그를 끄면 보안 가시성을 잃는다.',
    ],
    principle:
      '외부 시스템으로의 실시간 로그 스트리밍은 로그 싱크 → Pub/Sub, 장기 분석은 BigQuery, 보관은 Cloud Storage로 라우팅한다.',
    refs: [
      { title: 'Pub/Sub로 로그 라우팅', url: 'https://docs.cloud.google.com/logging/docs/export/pubsub' },
    ],
  },
  {
    id: 'c09-47',
    chapter: 9,
    domain: 6,
    topic: '감지·복구 시간 지표',
    question:
      '운영 책임자는 장애 대응이 개선되고 있는지 측정하고 싶다. 지난 분기 장애들을 보면 복구 자체보다 “장애를 알아차리기까지”가 오래 걸린 경우가 많았다. 어떤 지표를 추적하고 개선 활동과 연결하는 것이 가장 적절한가?',
    options: [
      '장애 건수만 센다.',
      '장애별 감지까지의 시간(MTTD)과 복구까지의 시간(MTTR)을 포스트모템 타임라인에서 측정하고, 감지 지연이 크면 알림·모니터링 공백을 개선 과제로 삼는다.',
      '장애 보고서의 페이지 수를 센다.',
      '온콜 인원 수를 지표로 쓴다.',
    ],
    answer: [1],
    explanations: [
      '건수만으로는 대응 능력(감지·복구 속도)을 알 수 없다.',
      '감지 시간과 복구 시간을 나눠 측정하면 어느 단계가 병목인지 드러난다. 감지가 느리면 모니터링·알림을, 복구가 느리면 런북·자동화를 개선한다.',
      '보고서 분량은 대응 능력과 무관하다.',
      '인원 수는 결과 지표가 아니다.',
    ],
    principle:
      '장애 대응 개선은 타임라인을 단계(감지·분류·완화·복구)로 나눠 측정하는 데서 시작한다.',
    refs: [
      { title: 'SRE 워크북: 포스트모템 문화', url: 'https://sre.google/workbook/postmortem-culture/' },
    ],
  },
  {
    id: 'c09-48',
    chapter: 9,
    domain: 6,
    topic: '지원 패키지 선택',
    question:
      '중견 이커머스 기업이 매출 대부분을 Google Cloud의 서비스로 처리하게 되었다. 운영 중 심각한 문제에 빠른 응답을 받고 싶지만, 전담 기술 계정 관리자(TAM)와 사전 아키텍처 검토까지는 당장 필요하지 않다. 비용과 필요 수준을 고려할 때 가장 적절한 선택은?',
    options: [
      '무료 기본 지원만 유지한다.',
      '운영 워크로드의 빠른 대응 요구에 맞는 Enhanced Support를 검토하고, 전담 TAM·사전 검토가 필요해지면 Premium Support로 상향한다.',
      '커뮤니티 포럼에만 의존한다.',
      '지원이 필요할 때마다 외부 컨설턴트를 부른다.',
    ],
    answer: [1],
    explanations: [
      '기본 지원만으로는 운영 핵심 서비스의 빠른 대응 요구를 충족하기 어렵다.',
      'Customer Care는 Standard·Enhanced·Premium 등 지원 패키지를 제공한다. 운영 워크로드의 빠른 대응이 필요하지만 TAM이 필요 없다면 Enhanced가 적절하고, 전담 관리와 사전 서비스가 필요하면 Premium을 검토한다.',
      '커뮤니티는 운영 장애 대응을 보장하지 않는다.',
      '외부 컨설턴트는 Google 내부 에스컬레이션 경로를 대체하지 못한다.',
    ],
    principle:
      '지원 패키지는 워크로드의 비즈니스 중요도와 필요한 서비스 수준(응답·전담·사전 검토)에 맞춰 선택한다.',
    refs: [
      { title: 'Enhanced Support 개요', url: 'https://docs.cloud.google.com/support/docs/enhanced' },
    ],
  },
  {
    id: 'c09-49',
    chapter: 9,
    domain: 6,
    topic: '리전 장애 대비 여유 용량',
    question:
      '서비스는 두 리전(각각 평상시 트래픽의 50%)에서 액티브-액티브로 운영된다. 각 리전의 자동 확장 최대값은 평상시 부하의 60%로 설정되어 있다. 한 리전 전체 장애 시 무엇이 문제이며, 어떻게 해야 하는가?',
    options: [
      '문제없다. 전역 부하 분산기가 자동으로 처리한다.',
      '남은 리전이 100% 트래픽을 받아야 하지만 확장 한도가 60%라 용량이 부족하므로, 리전별 최대 용량·할당량·예약을 한 리전이 전체 부하를 감당할 수 있도록 계획하고 테스트한다.',
      '두 리전 모두 자동 확장을 끈다.',
      '장애 시 트래픽의 절반을 버리는 것을 정상으로 본다.',
    ],
    answer: [1],
    explanations: [
      '부하 분산기가 트래픽을 옮겨도 받는 쪽 용량이 부족하면 과부하가 된다.',
      '액티브-액티브에서 리전 장애를 견디려면 남은 리전이 전체 부하를 처리할 수 있어야 한다. 확장 한도·할당량·용량 예약을 이에 맞게 설정하고 장애 훈련으로 검증한다.',
      '자동 확장을 끄면 대응 능력이 더 떨어진다.',
      '의도하지 않은 대규모 요청 손실은 가용성 목표 위반이다.',
    ],
    principle:
      '장애 조치 설계의 핵심은 “트래픽을 옮길 곳에 충분한 용량이 있는가”다. 확장 한도·할당량까지 포함해 검증한다.',
    refs: [
      { title: '고가용성 시스템 구축', url: 'https://docs.cloud.google.com/architecture/framework/reliability/build-highly-available-systems' },
    ],
  },
  {
    id: 'c09-50',
    chapter: 9,
    domain: 6,
    topic: '버전 수명 주기 관리',
    question:
      '운영 중인 GKE 클러스터와 Cloud SQL의 데이터베이스 버전이 곧 지원 종료 예정이라는 사실을 팀이 뒤늦게 알았다. 급하게 업그레이드하느라 테스트가 부족했고 장애가 발생했다. 앞으로 “2일차(Day 2) 운영”을 어떻게 개선해야 하는가?',
    options: [
      '지원 종료 후에도 계속 사용한다.',
      '사용 중인 플랫폼·DB 버전과 공식 지원 일정(GKE 출시 일정, DB 버전 정책)을 정기적으로 추적하고, 업그레이드를 사전 테스트된 정기 작업으로 계획하며, 가능한 범위에서 자동 업그레이드·유지보수 창을 활용한다.',
      '버전 업그레이드를 금지한다.',
      '매번 새 클러스터와 DB를 만들어 데이터를 수동 복사한다.',
    ],
    answer: [1],
    explanations: [
      '지원 종료 버전은 보안 패치를 받지 못하고, 결국 강제 업그레이드가 일어날 수 있다.',
      '버전 수명 주기를 추적하고 업그레이드를 정기적·계획적으로 수행하면 급한 대응과 그로 인한 장애를 줄인다. 관리형 서비스의 자동 업그레이드 설정도 활용한다.',
      '업그레이드 금지는 보안·지원 위험을 키운다.',
      '수동 재구축은 위험하고 비효율적이다.',
    ],
    principle:
      '운영 우수성에는 배포 이후의 지속적인 유지보수(버전·패치·지원 일정 관리)가 포함된다.',
    refs: [
      { title: 'GKE 출시 일정', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/release-schedule' },
      { title: 'Cloud SQL 데이터베이스 버전 정책', url: 'https://docs.cloud.google.com/sql/docs/db-versions' },
    ],
  },
  // @@END
]
