// Chapter 5 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (13) ─────────
  {
    id: 'c05-01',
    chapter: 5,
    domain: 1,
    topic: 'GKE와 Cloud Run 선택',
    question:
      '데이터 플랫폼 팀이 Kafka 호환 스트리밍 엔진을 오픈 소스 오퍼레이터(CRD 기반)로 운영하려 한다. 워크로드에는 StatefulSet과 영구 볼륨, 모든 노드에서 실행되는 로그 수집 DaemonSet, 서비스 메시 사이드카가 필요하다. 팀은 Kubernetes 운영 경험이 풍부하다. 가장 적합한 플랫폼은?',
    options: [
      'Cloud Run 서비스',
      'GKE 클러스터',
      'Cloud Run functions',
      'App Engine 표준 환경',
    ],
    answer: [1],
    explanations: [
      'Cloud Run은 스테이트리스 요청 처리에 최적화되어 있으며, 사용자 정의 오퍼레이터·DaemonSet 같은 Kubernetes API 수준의 제어를 제공하지 않는다.',
      'GKE는 Kubernetes API 전체를 제공하므로 CRD 기반 오퍼레이터, StatefulSet과 영구 볼륨, DaemonSet, 서비스 메시 같은 요구를 충족한다. 팀의 Kubernetes 역량도 활용할 수 있다.',
      'Cloud Run functions는 이벤트 기반 단일 목적 함수용으로 상태 저장 스트리밍 엔진에 맞지 않는다.',
      'App Engine 표준 환경은 특정 런타임의 웹 앱용 PaaS로 이런 인프라 수준 제어를 제공하지 않는다.',
    ],
    principle:
      'Kubernetes API 수준의 제어(오퍼레이터·DaemonSet·StatefulSet·메시)가 필요하면 GKE, 스테이트리스 컨테이너를 최소 운영으로 돌리려면 Cloud Run.',
    refs: [
      { title: '컴퓨팅 배포 옵션 선택', url: 'https://docs.cloud.google.com/compute/docs/choose-compute-deployment-option' },
    ],
  },
  {
    id: 'c05-02',
    chapter: 5,
    domain: 1,
    topic: 'Spanner 리전 구성 선택',
    question:
      '국내 전용 증권 거래 원장 서비스가 강한 일관성의 관계형 DB와 수평 확장이 필요하다. 사용자는 모두 한 국가에 있고, 규정상 데이터는 한 리전 안에 있어야 하며, 영역 장애에도 서비스가 지속되어야 한다. 비용도 중요하다. 가장 적합한 선택은?',
    options: [
      'Spanner 멀티 리전 구성',
      'Spanner 리전 구성',
      'Bigtable 단일 클러스터',
      'Cloud SQL 단일 영역 인스턴스',
    ],
    answer: [1],
    explanations: [
      '멀티 리전 구성은 리전 장애까지 견디지만 여러 리전에 데이터를 두므로 “한 리전 안” 요구와 충돌할 수 있고 비용도 더 높다.',
      'Spanner 리전 구성은 한 리전의 여러 영역에 복제해 영역 장애를 견디면서 강한 일관성과 수평 확장을 제공한다. 위치 제약과 비용 요구에도 맞다.',
      'Bigtable은 관계형 트랜잭션 DB가 아니다.',
      '단일 영역 Cloud SQL은 영역 장애에 취약하고 수평 확장에 한계가 있다.',
    ],
    principle:
      'Spanner 구성 선택: 한 리전 안 + 영역 장애 대비 = 리전 구성, 리전 장애 대비·전 세계 사용자 = 멀티 리전 구성(비용↑).',
    refs: [
      { title: 'Spanner 인스턴스 구성', url: 'https://docs.cloud.google.com/spanner/docs/instance-configurations' },
    ],
  },
  {
    id: 'c05-03',
    chapter: 5,
    domain: 1,
    topic: 'Bigtable 워크로드 격리',
    question:
      '광고 플랫폼의 Bigtable 인스턴스는 입찰 서비스의 저지연 조회를 처리한다. 매일 밤 데이터 과학팀의 대규모 분석 스캔이 같은 클러스터에서 실행되면서 입찰 응답 지연이 급증한다. 데이터 복사 파이프라인을 따로 만들지 않고 두 워크로드를 격리하려면?',
    options: [
      '분석 작업을 입찰 서비스와 같은 클러스터에서 더 느리게 실행한다.',
      '인스턴스에 복제 클러스터를 추가하고, 앱 프로필로 입찰 트래픽과 분석 트래픽을 서로 다른 클러스터로 라우팅한다.',
      '입찰 서비스를 Cloud SQL로 옮긴다.',
      '분석 작업을 중단한다.',
    ],
    answer: [1],
    explanations: [
      '같은 클러스터에서 실행하면 속도를 늦춰도 자원 경쟁이 남는다.',
      'Bigtable 복제는 같은 인스턴스의 클러스터 간에 데이터를 자동 동기화하고, 앱 프로필은 워크로드별로 어느 클러스터로 요청을 보낼지 정한다. 별도 복사 없이 서빙과 분석을 격리할 수 있다.',
      'Cloud SQL은 이 규모의 저지연 조회에 적합하지 않다.',
      '분석 중단은 비즈니스 요구를 무시한다.',
    ],
    principle:
      'Bigtable에서 서빙·분석 격리는 복제 클러스터 + 앱 프로필 라우팅으로 한다. 복제는 가용성 향상에도 도움이 된다.',
    refs: [
      { title: 'Bigtable 개요', url: 'https://docs.cloud.google.com/bigtable/docs/overview' },
    ],
  },
  {
    id: 'c05-04',
    chapter: 5,
    domain: 1,
    topic: 'Pub/Sub → BigQuery 직접 적재',
    question:
      'IoT 게이트웨이가 JSON 메시지를 Pub/Sub에 게시한다. 요구사항은 메시지를 변환 없이 그대로 BigQuery 테이블에 적재해 분석하는 것이며, 스키마는 고정되어 있다. 팀은 파이프라인 코드를 유지보수하고 싶지 않다. 가장 간단한 방법은?',
    options: [
      'Dataflow 스트리밍 파이프라인을 작성해 BigQuery에 쓴다.',
      'Pub/Sub의 BigQuery 구독을 만들어 메시지를 테이블에 직접 쓴다.',
      'Cloud Run 서비스가 메시지를 받아 BigQuery API로 삽입하게 한다.',
      '매시간 메시지를 Cloud Storage로 내보낸 뒤 bq load로 적재한다.',
    ],
    answer: [1],
    explanations: [
      'Dataflow는 변환·집계가 필요할 때 강력하지만, 변환이 없는 단순 적재에는 코드와 운영 부담이 과하다.',
      'BigQuery 구독은 Pub/Sub가 메시지를 BigQuery 테이블에 직접 쓰게 해, 별도 구독자 코드나 파이프라인 없이 실시간 적재를 구현한다.',
      '직접 구현한 서비스는 재시도·배치·오류 처리를 모두 유지보수해야 한다.',
      '매시간 배치는 지연이 크고 추가 단계가 늘어난다.',
    ],
    principle:
      '변환이 필요 없으면 가장 단순한 관리형 통합(Pub/Sub BigQuery 구독)을, 변환·윈도 집계가 필요하면 Dataflow를 쓴다.',
    refs: [
      { title: 'BigQuery 구독', url: 'https://docs.cloud.google.com/pubsub/docs/bigquery' },
    ],
  },
  {
    id: 'c05-05',
    chapter: 5,
    domain: 1,
    topic: '코드 없는 데이터 통합',
    question:
      '데이터 엔지니어가 부족한 중견 기업에서, SQL은 알지만 코드를 작성하지 않는 분석가들이 여러 온프레미스 DB와 SaaS에서 데이터를 가져와 정제·결합한 뒤 BigQuery에 적재하는 파이프라인을 직접 만들고 싶어 한다. 시각적 인터페이스와 다양한 사전 구축 커넥터가 중요하다. 가장 적합한 도구는?',
    options: [
      'Apache Beam SDK로 Dataflow 파이프라인을 직접 코딩한다.',
      'Cloud Data Fusion의 시각적 파이프라인 설계기와 커넥터를 사용한다.',
      'Managed Service for Apache Spark(구 Dataproc)에 PySpark 작업을 작성한다.',
      '각 소스에서 CSV를 수동으로 내보내 업로드한다.',
    ],
    answer: [1],
    explanations: [
      'Beam SDK 코딩은 개발 역량이 필요해 코드를 쓰지 않는 분석가에게 맞지 않는다.',
      'Cloud Data Fusion은 드래그 앤드 드롭 방식의 시각적 파이프라인 설계와 다양한 사전 구축 커넥터·변환을 제공하는 관리형 데이터 통합 서비스다.',
      'PySpark 작업 작성도 코딩이 필요하다.',
      '수동 CSV 작업은 반복·자동화가 불가능하다.',
    ],
    principle:
      '데이터 통합 도구는 사용자 역량으로 고른다: 코드 없는 시각적 통합 = Data Fusion, 코드 기반 대규모 처리 = Dataflow·Spark.',
    refs: [
      { title: 'Cloud Data Fusion 개요', url: 'https://docs.cloud.google.com/data-fusion/docs/concepts/overview' },
    ],
  },
  {
    id: 'c05-06',
    chapter: 5,
    domain: 1,
    topic: '데이터 레이크 테이블(BigLake)',
    question:
      '회사의 데이터 레이크는 Cloud Storage에 오픈 형식(Parquet·Iceberg)으로 저장되어 있고, Spark와 BigQuery 양쪽에서 같은 데이터를 조회한다. 보안팀은 데이터를 BigQuery로 복제하지 않은 채 행·열 수준 접근 제어를 일관되게 적용하길 원한다. 가장 적합한 방법은?',
    options: [
      '모든 데이터를 BigQuery 기본 테이블로 복사하고 원본을 삭제한다.',
      'BigLake 테이블로 Cloud Storage의 데이터를 정의해 BigQuery 보안 모델(세분화 접근 제어)을 적용하고, 여러 엔진에서 조회한다.',
      '각 사용자에게 버킷 전체 읽기 권한을 부여한다.',
      '민감 데이터가 있는 파일마다 별도 버킷을 만든다.',
    ],
    answer: [1],
    explanations: [
      '복사는 요구사항(복제 없이)에 어긋나고, Spark 등 다른 엔진의 오픈 형식 접근도 끊긴다.',
      'BigLake 테이블은 Cloud Storage의 오픈 형식 데이터를 테이블로 노출하면서 행·열 수준 보안 같은 세분화 접근 제어를 적용하고, 사용자가 파일에 직접 접근할 필요 없이 여러 엔진이 조회할 수 있게 한다.',
      '버킷 전체 권한은 세분화 통제가 불가능하다.',
      '파일 단위 버킷 분리는 관리가 폭증하고 행·열 수준 통제를 제공하지 못한다.',
    ],
    principle:
      '오픈 형식 데이터 레이크에 웨어하우스 수준의 거버넌스를 적용하려면 BigLake처럼 스토리지와 접근 제어를 분리하는 테이블 계층을 쓴다.',
    refs: [
      { title: 'BigLake 소개', url: 'https://docs.cloud.google.com/bigquery/docs/biglake-intro' },
    ],
  },
  {
    id: 'c05-07',
    chapter: 5,
    domain: 1,
    topic: '조직 간 데이터 공유',
    question:
      '시장 조사 회사가 매일 갱신되는 BigQuery 데이터 세트를 수십 개 고객사(각자 다른 Google Cloud 조직)에 제공하려 한다. 데이터를 고객사마다 복사하면 저장 비용과 동기화 부담이 커진다. 고객사는 자기 프로젝트에서 이 데이터를 바로 쿼리하고 자기 데이터와 조인하고 싶어 한다. 가장 적합한 방법은?',
    options: [
      '매일 CSV로 내보내 고객사 버킷에 복사한다.',
      'BigQuery sharing(구 Analytics Hub)으로 데이터를 목록(listing)으로 게시하고, 고객사가 구독해 연결된 데이터 세트로 조회하게 한다.',
      '고객사 사용자에게 원본 프로젝트의 소유자 역할을 부여한다.',
      '고객사마다 별도 테이블 사본을 만들어 매일 덮어쓴다.',
    ],
    answer: [1],
    explanations: [
      'CSV 복사는 비용·지연·동기화 문제를 그대로 만든다.',
      'BigQuery sharing은 데이터를 복제하지 않고 조직 경계를 넘어 안전하게 공유하는 교환 플랫폼이다. 구독자는 자기 프로젝트에서 연결된 데이터 세트로 최신 데이터를 조회하고 조인할 수 있다.',
      '소유자 권한 부여는 과도하며 게시자 리소스 전체를 노출한다.',
      '사본 관리는 저장 비용과 운영 부담을 키운다.',
    ],
    principle:
      '조직 간 데이터 제공은 “복제 대신 공유”(BigQuery sharing)로 최신성·비용·통제를 확보한다.',
    refs: [
      { title: 'BigQuery sharing 소개', url: 'https://docs.cloud.google.com/bigquery/docs/analytics-hub-introduction' },
    ],
  },
  {
    id: 'c05-08',
    chapter: 5,
    domain: 1,
    topic: '일관된 지표 정의(시맨틱 계층)',
    question:
      '같은 “월간 활성 고객” 지표가 영업·마케팅·재무 대시보드마다 다른 숫자로 나와 경영 회의에서 혼란이 생긴다. 각 팀은 BigQuery에서 SQL을 제각각 작성하고 있다. 지표 정의를 한곳에서 관리하고 모든 보고서가 같은 정의를 쓰게 하려면?',
    options: [
      '각 팀에 SQL 작성 가이드 문서를 배포한다.',
      'Looker의 시맨틱 모델(LookML)에 지표와 조인 규칙을 중앙에서 정의하고, 대시보드가 이 모델을 사용하게 한다.',
      '모든 대시보드를 하나의 스프레드시트로 합친다.',
      '지표마다 담당 분석가를 두어 매월 수동으로 대조한다.',
    ],
    answer: [1],
    explanations: [
      '가이드 문서는 강제력이 없어 시간이 지나면 다시 정의가 갈라진다.',
      'LookML 같은 시맨틱 계층은 지표·차원·조인 규칙을 코드로 한 번 정의해 재사용하게 하므로, 모든 보고서가 같은 비즈니스 정의를 쓴다. 버전 관리로 변경도 추적된다.',
      '스프레드시트 통합은 확장되지 않고 정의 관리 문제를 해결하지 못한다.',
      '수동 대조는 비용이 크고 지연된다.',
    ],
    principle:
      '“단일 진실 공급원”은 데이터뿐 아니라 지표 정의에도 필요하다. 시맨틱 계층으로 비즈니스 로직을 중앙화한다.',
    refs: [
      { title: 'LookML이란?', url: 'https://docs.cloud.google.com/looker/docs/what-is-lookml' },
    ],
  },
  {
    id: 'c05-09',
    chapter: 5,
    domain: 1,
    topic: '정적 웹사이트 호스팅',
    question:
      '마케팅 팀이 HTML·CSS·JS로만 구성된 캠페인 사이트를 운영한다. 서버 측 로직은 없고, 사용자 지정 도메인에 HTTPS가 필요하며, 전 세계 방문자에게 빠르게 제공하고 운영 부담은 최소화하고 싶다. 가장 적합한 구성은?',
    options: [
      'Compute Engine VM 두 대에 Nginx를 설치하고 부하 분산기를 둔다.',
      'Cloud Storage 버킷에 파일을 저장하고, 외부 애플리케이션 부하 분산기의 백엔드 버킷과 Google 관리형 인증서, Cloud CDN을 사용한다.',
      'GKE 클러스터에 정적 파일 서버를 배포한다.',
      'Cloud SQL에 HTML을 저장하고 API로 제공한다.',
    ],
    answer: [1],
    explanations: [
      'VM 기반 웹 서버는 OS 패치·확장 관리가 필요해 운영 부담이 크다.',
      '정적 콘텐츠는 Cloud Storage에 두고, 부하 분산기의 백엔드 버킷으로 사용자 지정 도메인·관리형 HTTPS 인증서를 적용하며, Cloud CDN으로 전 세계에 캐싱하면 서버 없이 빠르고 저렴하게 제공할 수 있다.',
      'GKE는 정적 사이트에 과한 구성이다.',
      'DB에 HTML을 저장하는 것은 부적절하고 비효율적이다.',
    ],
    principle:
      '서버 로직이 없는 정적 사이트는 서버를 두지 말고 객체 스토리지 + CDN(+ 부하 분산기·관리형 인증서)으로 제공한다.',
    refs: [
      { title: '정적 웹사이트 호스팅', url: 'https://docs.cloud.google.com/storage/docs/hosting-static-website' },
    ],
  },
  {
    id: 'c05-10',
    chapter: 5,
    domain: 1,
    topic: 'IP 주소 계획',
    question:
      '회사는 향후 3년간 GKE 클러스터 수십 개와 여러 VPC, 온프레미스(10.0.0.0/8 일부 사용) 연결을 계획한다. 과거 다른 프로젝트에서는 서브넷 범위가 겹쳐 나중에 피어링·하이브리드 연결을 할 수 없었다. 네트워크 설계 시 가장 중요한 원칙은?',
    options: [
      '모든 VPC에 같은 기본 서브넷 범위를 사용해 일관성을 유지한다.',
      '온프레미스와 모든 VPC, GKE의 노드·파드·서비스(보조 범위)까지 포함한 전사 IP 계획을 세워 겹치지 않게 할당하고, 성장 여유를 둔다.',
      'GKE 파드 IP는 클러스터 안에서만 쓰이므로 계획할 필요가 없다.',
      '필요할 때마다 가장 작은 서브넷을 즉흥적으로 만든다.',
    ],
    answer: [1],
    explanations: [
      '같은 범위를 재사용하면 VPC 간·하이브리드 연결 시 라우팅이 불가능해진다.',
      '연결될 가능성이 있는 모든 네트워크의 범위를 겹치지 않게 계획해야 피어링·Interconnect·NCC 연결이 가능하다. VPC 네이티브 GKE는 파드·서비스용 보조 범위를 많이 쓰므로 반드시 계획에 포함하고 확장 여유를 둔다.',
      'VPC 네이티브 클러스터의 파드 IP는 VPC에서 라우팅 가능한 주소라 다른 네트워크와 겹치면 문제가 된다.',
      '즉흥적 할당은 조각화와 중복을 만든다.',
    ],
    principle:
      'IP 계획은 나중에 바꾸기 가장 어려운 결정 중 하나다. 연결될 모든 네트워크(온프레미스·VPC·GKE 보조 범위)를 포함해 겹치지 않게 설계한다.',
    refs: [
      { title: '서브넷', url: 'https://docs.cloud.google.com/vpc/docs/subnets' },
      { title: 'VPC 네이티브 클러스터(별칭 IP)', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/alias-ips' },
    ],
  },
  {
    id: 'c05-11',
    chapter: 5,
    domain: 1,
    topic: '멀티 리전 액티브-액티브',
    question:
      '글로벌 결제 게이트웨이는 리전 전체 장애가 나도 사용자가 거의 영향을 받지 않아야 한다(RTO 거의 0, RPO 0). 비용보다 가용성이 훨씬 중요하다. 어떤 아키텍처가 가장 적합한가?',
    options: [
      '단일 리전의 리전 MIG와 Cloud SQL HA',
      '두 개 이상 리전에서 애플리케이션 계층을 동시에 운영(액티브-액티브)하고, 전역 외부 애플리케이션 부하 분산기와 멀티 리전 Spanner를 사용한다.',
      '주 리전에서 운영하고 다른 리전에는 매일 백업만 보관한다.',
      '주 리전과 DR 리전을 두고 장애 시 Terraform으로 DR 환경을 새로 만든다.',
    ],
    answer: [1],
    explanations: [
      '단일 리전 구성은 영역 장애는 견디지만 리전 장애에서는 서비스가 중단된다.',
      '액티브-액티브 멀티 리전 구성에서는 전역 부하 분산기가 장애 리전을 자동으로 우회하고, 멀티 리전 Spanner가 동기 복제로 RPO 0과 쓰기 지속을 제공한다. 비용은 크지만 요구 수준에 맞다.',
      '일일 백업은 RPO·RTO 요구와 거리가 멀다.',
      'IaC로 DR 환경을 새로 만드는 방식은 복구에 시간이 걸려 RTO 거의 0을 충족하지 못한다.',
    ],
    principle:
      'RTO·RPO가 0에 가까울수록 액티브-액티브(멀티 리전 동시 운영 + 동기 복제 데이터 계층)가 필요하며 비용이 가장 크다.',
    refs: [
      { title: '멀티 리전 배포 아키타입', url: 'https://docs.cloud.google.com/architecture/deployment-archetypes/multiregional' },
    ],
  },
  {
    id: 'c05-12',
    chapter: 5,
    domain: 1,
    topic: 'AI 에이전트 구축과 운영',
    question:
      '보험사 개발팀이 청구 상태 조회·서류 요청·일정 예약 같은 도구(API)를 호출하는 고객 상담 AI 에이전트를 코드로 만들고 있다. 에이전트 로직은 Python으로 세밀하게 제어하고 싶지만, 확장·세션 관리 같은 실행 인프라는 직접 운영하고 싶지 않다. 가장 적합한 조합은?',
    options: [
      '에이전트를 Compute Engine VM에서 직접 실행하고 세션을 로컬 파일에 저장한다.',
      'Agent Development Kit(ADK)로 에이전트를 개발하고, Agent Platform의 관리형 런타임(Agent Runtime, 구 Agent Engine)에 배포한다.',
      '모든 대화를 규칙 기반 IVR 시나리오로 구현한다.',
      '매 요청마다 새 GKE 클러스터를 만든다.',
    ],
    answer: [1],
    explanations: [
      'VM 직접 운영은 확장·세션 관리·보안을 모두 구현해야 해 운영 부담이 크다.',
      'ADK는 코드 중심으로 에이전트와 도구 호출을 세밀하게 구성하는 프레임워크이고, Agent Runtime은 에이전트를 배포·확장하고 세션 등 실행 인프라를 관리형으로 제공한다. 로직 제어와 운영 부담 감소를 함께 달성한다.',
      '규칙 기반 IVR은 자연어 이해와 유연한 도구 호출이 필요한 요구에 맞지 않는다.',
      '요청마다 클러스터를 만드는 것은 비현실적이다.',
    ],
    principle:
      '에이전트는 “개발 방식(로우코드 Agent Studio ↔ 코드 ADK)”과 “실행 환경(관리형 Agent Runtime ↔ 자체 운영)”을 분리해 선택한다.',
    refs: [
      { title: 'Agent Development Kit', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/adk' },
      { title: 'Agent Runtime', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime' },
    ],
  },
  {
    id: 'c05-13',
    chapter: 5,
    domain: 1,
    topic: '그라운딩 소스 선택',
    question:
      '여행사 챗봇이 “이번 주말 파리 날씨와 최신 파업 소식”처럼 모델 학습 이후에 바뀐 공개 정보를 묻는 질문과, “우리 회사 환불 규정” 같은 사내 문서 질문을 모두 받는다. 답변의 사실성과 출처 표시가 중요하다. 가장 적절한 설계는?',
    options: [
      '모델을 매주 최신 뉴스로 재학습한다.',
      '공개 최신 정보는 Google 검색 그라운딩으로, 사내 규정은 사내 문서를 인덱싱한 검색(RAG) 그라운딩으로 답하게 한다.',
      '모든 질문에 모델의 기본 지식만으로 답하게 한다.',
      '사내 문서를 공개 웹사이트에 올려 Google 검색 그라운딩만 사용한다.',
    ],
    answer: [1],
    explanations: [
      '매주 재학습은 비용이 크고 실시간성도 부족하다.',
      '그라운딩은 모델 답변을 외부 근거에 연결해 사실성을 높이고 출처를 제시한다. 최신 공개 정보에는 Google 검색 그라운딩, 비공개 사내 정보에는 자체 데이터 검색(RAG) 그라운딩이 적합하다.',
      '기본 지식만으로는 최신 정보와 사내 규정을 알 수 없어 환각 위험이 크다.',
      '사내 문서를 공개하는 것은 정보 유출이다.',
    ],
    principle:
      '그라운딩 소스는 정보의 성격으로 고른다: 최신 공개 정보 = 웹 검색, 비공개 기업 정보 = 자체 데이터 검색(RAG).',
    refs: [
      { title: '그라운딩 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/overview' },
      { title: 'Google 검색으로 그라운딩', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/grounding-with-google-search' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (8) ─────────
  {
    id: 'c05-14',
    chapter: 5,
    domain: 2,
    topic: 'Cloud Run 콜드 스타트와 동시성',
    question:
      '로그인 API는 Cloud Run에서 실행된다. 새벽에는 요청이 거의 없다가 아침에 첫 요청들이 몇 초씩 지연되는 콜드 스타트 문제가 사용자 불만으로 이어졌다. 애플리케이션은 인스턴스당 여러 요청을 동시에 처리할 수 있다. 비용 증가를 제한하면서 지연을 줄이는 가장 적절한 설정은?',
    options: [
      '최대 인스턴스 수를 1로 제한한다.',
      '최소 인스턴스를 작은 수(예: 1~2)로 설정해 항상 준비된 인스턴스를 유지하고, 인스턴스당 동시성을 애플리케이션이 감당할 수 있는 수준으로 설정한다.',
      '동시성을 1로 설정해 요청마다 새 인스턴스를 만든다.',
      'Cloud Run을 버리고 VM 50대를 상시 운영한다.',
    ],
    answer: [1],
    explanations: [
      '최대 인스턴스 1은 트래픽 증가 시 처리 한계를 만든다.',
      '최소 인스턴스는 유휴 시에도 준비된 인스턴스를 유지해 콜드 스타트를 줄인다(그만큼 비용 발생). 적절한 동시성 설정은 인스턴스 수를 줄여 비용과 콜드 스타트 빈도를 함께 낮춘다.',
      '동시성 1은 인스턴스 수를 늘려 콜드 스타트와 비용을 오히려 증가시킨다.',
      '상시 VM은 비용과 운영 부담이 과도하다.',
    ],
    principle:
      'Cloud Run 튜닝: 콜드 스타트 = 최소 인스턴스(비용과 교환), 효율 = 동시성, 폭주 제어 = 최대 인스턴스.',
    refs: [
      { title: 'Cloud Run 최소 인스턴스', url: 'https://docs.cloud.google.com/run/docs/configuring/min-instances' },
      { title: 'Cloud Run 동시성', url: 'https://docs.cloud.google.com/run/docs/about-concurrency' },
    ],
  },
  {
    id: 'c05-15',
    chapter: 5,
    domain: 2,
    topic: 'GKE 파드 리소스 적정화',
    question:
      'GKE 클러스터의 노드 사용률은 20% 수준인데도 새 파드가 자주 “자원 부족”으로 스케줄되지 않는다. 확인해 보니 개발팀들이 파드의 CPU·메모리 요청(request)을 실제 사용량보다 훨씬 크게 잡아 두었다. 운영 부담을 줄이면서 요청 값을 실제 사용량에 맞추려면?',
    options: [
      '노드 수를 두 배로 늘린다.',
      '수직형 파드 자동 확장(VPA)을 권장 모드로 켜서 실제 사용량 기반 요청 값을 확인하고, 적절한 워크로드에는 자동 모드를 적용한다.',
      '모든 파드의 요청 값을 0으로 설정한다.',
      '각 팀에 요청 값을 줄이라는 공지만 보낸다.',
    ],
    answer: [1],
    explanations: [
      '노드를 늘리면 과대 요청으로 인한 낭비가 더 커진다.',
      'VPA는 파드의 실제 사용량을 분석해 적절한 요청 값을 권장하거나 자동으로 조정한다. 권장 모드로 먼저 검토하면 위험 없이 적정 값을 파악할 수 있다.',
      '요청 값 0은 스케줄링과 QoS를 망가뜨려 노드 과밀과 성능 저하를 부른다.',
      '공지만으로는 데이터 기반 조정이 이루어지지 않는다.',
    ],
    principle:
      'Kubernetes 비용·효율의 핵심은 정확한 리소스 요청이다. VPA 권장값으로 요청을 적정화하고 HPA와의 상호작용을 확인한다.',
    refs: [
      { title: '수직형 파드 자동 확장', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/verticalpodautoscaler' },
    ],
  },
  {
    id: 'c05-16',
    chapter: 5,
    domain: 2,
    topic: 'GKE 노드 업그레이드와 PDB',
    question:
      'GKE 노드 풀 자동 업그레이드 중에 한 서비스의 파드 3개가 동시에 축출되어 몇 분간 장애가 발생했다. 이 서비스는 최소 2개의 파드가 항상 실행되어야 한다. 업그레이드는 계속 자동으로 진행하고 싶다. 무엇을 구성해야 하는가?',
    options: [
      '자동 업그레이드를 끈다.',
      '해당 서비스에 minAvailable 2의 PodDisruptionBudget을 만들고, 노드 풀 업그레이드 전략(서지 업그레이드 설정)을 서비스 가용성에 맞게 조정한다.',
      '파드를 하나의 노드에만 배치한다.',
      '파드의 준비 상태 프로브를 제거한다.',
    ],
    answer: [1],
    explanations: [
      '자동 업그레이드를 끄면 보안 패치가 늦어진다.',
      'PodDisruptionBudget은 노드 드레인 같은 자발적 중단 시 동시에 축출될 수 있는 파드 수를 제한해 최소 가용성을 보장한다. 서지 업그레이드 설정으로 새 노드를 먼저 추가하면 업그레이드 중 용량도 유지된다.',
      '한 노드에 몰면 그 노드 업그레이드 시 전체가 중단된다.',
      '준비 상태 프로브 제거는 비정상 파드로 트래픽을 보내 상황을 악화시킨다.',
    ],
    principle:
      '자동 유지보수와 가용성은 PDB(동시 중단 제한) + 업그레이드 전략(서지·블루그린)으로 함께 달성한다.',
    refs: [
      { title: '노드 풀 업그레이드 전략', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/node-pool-upgrade-strategies' },
    ],
  },
  {
    id: 'c05-17',
    chapter: 5,
    domain: 2,
    topic: '상태 저장 MIG',
    question:
      '분산 캐시 클러스터를 Compute Engine MIG로 운영한다. 각 노드는 고유한 데이터 디스크와 고정 내부 IP를 가져야 하며, 자동 복구로 VM이 다시 만들어져도 같은 디스크와 IP를 유지해야 한다. MIG의 자동 복구·업데이트 기능은 그대로 쓰고 싶다. 어떻게 구성해야 하는가?',
    options: [
      '일반 MIG를 쓰고 VM이 다시 만들어질 때마다 수동으로 디스크를 붙인다.',
      '상태 저장 MIG를 구성해 인스턴스별 영구 디스크와 내부 IP를 상태 저장 구성으로 보존한다.',
      '관리되지 않는 인스턴스 그룹으로 바꾼다.',
      '데이터 디스크를 Local SSD로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      '수동 연결은 자동 복구의 이점을 없애고 실수 위험이 크다.',
      '상태 저장 MIG는 인스턴스별 디스크·메타데이터·IP를 보존해, 자동 복구·업데이트로 VM이 다시 만들어져도 같은 상태로 복원한다.',
      '관리되지 않는 그룹은 자동 복구·업데이트를 제공하지 않는다.',
      'Local SSD는 VM 재생성 시 데이터가 사라진다.',
    ],
    principle:
      'VM 단위 고유 상태가 필요한 워크로드는 상태 저장 MIG로 “자동화 + 상태 보존”을 함께 얻는다.',
    refs: [
      { title: '상태 저장 MIG', url: 'https://docs.cloud.google.com/compute/docs/instance-groups/stateful-migs' },
    ],
  },
  {
    id: 'c05-18',
    chapter: 5,
    domain: 2,
    topic: 'Hyperdisk 성능 프로비저닝',
    question:
      '자체 관리 데이터베이스는 데이터 용량이 500GB 정도지만 매우 높은 IOPS와 처리량이 필요하다. 기존 디스크 유형에서는 필요한 성능을 얻으려고 불필요하게 큰 용량을 할당해 비용이 낭비되고 있다. 가장 적절한 디스크 선택은?',
    options: [
      '표준 영구 디스크 10TB',
      '용량과 별도로 IOPS·처리량을 프로비저닝할 수 있는 Hyperdisk(예: Hyperdisk Extreme 또는 Balanced)',
      'Cloud Storage FUSE',
      'Filestore 기본 등급',
    ],
    answer: [1],
    explanations: [
      '표준 영구 디스크는 성능이 낮고, 용량을 키워 성능을 얻는 방식은 낭비가 크다.',
      'Hyperdisk는 용량과 성능(IOPS·처리량)을 분리해 프로비저닝할 수 있어, 작은 용량에 높은 성능이 필요한 DB에 비용 효율적이다.',
      '버킷 마운트는 DB 데이터 파일의 저지연 블록 스토리지 용도가 아니다.',
      'NFS 파일 스토리지는 단일 DB의 고성능 블록 스토리지 요구에 적합하지 않다.',
    ],
    principle:
      '블록 스토리지는 “용량과 성능을 분리해 프로비저닝”할 수 있는지(Hyperdisk)를 먼저 검토해 과잉 용량을 피한다.',
    refs: [
      { title: 'Hyperdisk 개요', url: 'https://docs.cloud.google.com/compute/docs/disks/hyperdisks' },
    ],
  },
  {
    id: 'c05-19',
    chapter: 5,
    domain: 2,
    topic: 'Cloud SQL 읽기 복제본',
    question:
      '온라인 교육 플랫폼의 Cloud SQL for PostgreSQL 기본 인스턴스가 매일 아침 대량 보고서 쿼리 때문에 CPU가 포화되고, 수강 신청 트랜잭션이 느려진다. 보고서는 몇 초 정도 지연된 데이터여도 괜찮다. 가장 적절한 조치는?',
    options: [
      '기본 인스턴스를 HA 구성으로 바꾼다.',
      '읽기 복제본을 만들고 보고서 쿼리를 복제본으로 보낸다.',
      '보고서 쿼리를 트랜잭션과 같은 연결 풀에서 실행한다.',
      '기본 인스턴스의 디스크 크기를 늘린다.',
    ],
    answer: [1],
    explanations: [
      'HA 대기 인스턴스는 장애 조치용이며 읽기 트래픽을 받지 않는다.',
      '읽기 복제본은 기본 인스턴스의 데이터를 비동기로 복제해 읽기 전용 쿼리를 분산한다. 약간의 복제 지연이 허용되는 보고서 쿼리를 옮기면 기본 인스턴스의 부하가 줄어든다.',
      '같은 연결 풀에서 실행하면 자원 경쟁이 그대로다.',
      '디스크 크기는 CPU 포화 문제를 해결하지 못한다.',
    ],
    principle:
      '읽기 확장은 읽기 복제본, 가용성은 HA, 재해 복구는 교차 리전 복제본으로 목적을 구분한다.',
    refs: [
      { title: 'Cloud SQL 복제 정보', url: 'https://docs.cloud.google.com/sql/docs/mysql/replication' },
    ],
  },
  {
    id: 'c05-20',
    chapter: 5,
    domain: 2,
    topic: 'Pub/Sub 메시지 재처리',
    question:
      '주문 이벤트를 처리하는 구독자에 버그가 있어 지난 6시간 동안 할인 금액을 잘못 계산했다. 버그를 수정해 배포했고, 이제 그 6시간치 메시지를 다시 처리하고 싶다. 메시지는 이미 확인(ack)되었다. 어떻게 해야 하는가?',
    options: [
      '게시자에게 6시간치 이벤트를 다시 게시해 달라고 요청한다.',
      '구독의 확인된 메시지 보존을 사전에 설정해 두었다면, 구독을 해당 시점(또는 스냅샷)으로 탐색(seek)해 메시지를 다시 전달받는다.',
      'Pub/Sub 주제를 삭제하고 다시 만든다.',
      '데드 레터 주제에서 메시지를 가져온다.',
    ],
    answer: [1],
    explanations: [
      '게시자 재게시는 가능할 수도 있지만 외부 의존성이 크고 느리다. Pub/Sub 자체 재처리 기능이 있다.',
      '확인된 메시지 보존(또는 주제 메시지 보존)을 설정해 두면 구독을 과거 시점이나 스냅샷으로 탐색해 이미 확인한 메시지를 다시 받을 수 있다. 재처리는 멱등하게 설계해야 한다.',
      '주제 삭제는 데이터와 구독을 잃게 한다.',
      '데드 레터 주제에는 처리에 실패한 메시지만 있으며, 이미 확인된 메시지는 없다.',
    ],
    principle:
      '재처리 가능성은 미리 설계해야 한다: 메시지 보존 + seek/스냅샷 + 멱등한 소비자.',
    refs: [
      { title: 'Pub/Sub 재생(seek) 개요', url: 'https://docs.cloud.google.com/pubsub/docs/replay-overview' },
    ],
  },
  {
    id: 'c05-21',
    chapter: 5,
    domain: 2,
    topic: 'Model Garden 오픈 모델 배포',
    question:
      '연구 기관이 라이선스상 가중치(weights)를 직접 관리해야 하는 특정 오픈 모델을 사용해야 한다. 기관의 데이터로 LoRA 방식 미세 조정을 하고, 조정된 모델을 자기 프로젝트의 엔드포인트로 서빙하려 한다. 인프라 구성은 최소화하고 싶다. 가장 적합한 방법은?',
    options: [
      '공개 채팅 웹 서비스에 연구 데이터를 붙여 넣는다.',
      'Model Garden에서 해당 오픈 모델을 선택해 LoRA 등으로 조정하고, 자기 프로젝트의 엔드포인트에 배포(자체 배포 모델)한다.',
      '모델을 처음부터 사전 학습한다.',
      '온프레미스 PC 한 대에서 모델을 서빙한다.',
    ],
    answer: [1],
    explanations: [
      '공개 서비스에 연구 데이터를 붙여 넣는 것은 데이터 통제 요구에 어긋난다.',
      'Model Garden은 여러 오픈 모델을 제공하고, 조정(LoRA 등)과 자기 프로젝트 엔드포인트로의 배포를 지원해 가중치 통제와 인프라 간소화를 함께 달성한다.',
      '사전 학습은 비용과 시간이 과도하다.',
      '단일 PC 서빙은 확장성·가용성·보안 요구를 충족하지 못한다.',
    ],
    principle:
      '특정 오픈 모델·가중치 통제가 필요하면 Model Garden의 자체 배포 모델을, 그렇지 않으면 관리형 모델 API(MaaS)를 우선 검토한다.',
    refs: [
      { title: 'Model Garden 자체 배포 모델', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-garden/self-deployed-models' },
      { title: 'LoRA·QLoRA 조정', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-garden/lora-qlora' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (8) ─────────
  {
    id: 'c05-22',
    chapter: 5,
    domain: 3,
    topic: '기본 서비스 계정 위험',
    question:
      '보안 점검에서 여러 프로젝트의 VM이 Compute Engine 기본 서비스 계정으로 실행되고 있고, 이 계정이 프로젝트 편집자 역할을 가진 것이 확인되었다. VM이 탈취되면 프로젝트 전체가 위험하다. 가장 적절한 개선책은? (2개 선택)',
    options: [
      '워크로드마다 필요한 최소 권한만 가진 전용 서비스 계정을 만들어 VM에 연결한다.',
      '새 프로젝트에서 기본 서비스 계정에 역할이 자동 부여되지 않도록 조직 정책(iam.automaticIamGrantsForDefaultServiceAccounts)을 적용한다.',
      '기본 서비스 계정에 소유자 역할을 추가해 권한 문제를 없앤다.',
      'VM의 액세스 범위를 모두 허용(cloud-platform)으로 바꾼다.',
      '기본 서비스 계정의 키를 만들어 백업해 둔다.',
    ],
    answer: [0, 1],
    explanations: [
      '워크로드별 전용 서비스 계정과 최소 권한은 탈취 시 피해 범위를 제한하는 기본 원칙이다.',
      '이 조직 정책 제약은 기본 서비스 계정에 편집자 같은 넓은 역할이 자동으로 부여되는 것을 막아 새 프로젝트에서 같은 문제가 반복되지 않게 한다.',
      '권한을 더 넓히면 위험이 커진다.',
      '액세스 범위를 넓히면 IAM 권한이 그대로 모두 사용 가능해져 위험이 커진다.',
      '키 생성은 장기 자격 증명 위험을 추가한다.',
    ],
    principle:
      '기본 서비스 계정은 편리하지만 권한이 넓다. 워크로드별 전용 서비스 계정 + 자동 권한 부여 차단으로 최소 권한을 지킨다.',
    refs: [
      { title: 'Compute Engine 서비스 계정', url: 'https://docs.cloud.google.com/compute/docs/access/service-accounts' },
      { title: '조직 정책 제약 목록', url: 'https://docs.cloud.google.com/organization-policy/reference/org-policy-constraints' },
    ],
  },
  {
    id: 'c05-23',
    chapter: 5,
    domain: 3,
    topic: 'Cloud HSM',
    question:
      '결제 대행사의 보안 표준은 카드 데이터 암호화 키가 FIPS 140-2 Level 3 인증 하드웨어 보안 모듈 안에서 생성·보관되어야 한다고 규정한다. 회사는 HSM 장비를 직접 운영하고 싶지 않고, 기존 Cloud KMS 연동(CMEK)을 그대로 쓰고 싶다. 가장 적합한 방법은?',
    options: [
      'Cloud KMS 소프트웨어 보호 수준 키를 사용한다.',
      'Cloud HSM 보호 수준의 Cloud KMS 키를 만들어 CMEK로 사용한다.',
      '키를 애플리케이션 코드에 하드코딩한다.',
      '고객 제공 암호화 키(CSEK)를 스프레드시트로 관리한다.',
    ],
    answer: [1],
    explanations: [
      '소프트웨어 보호 수준 키는 HSM 요구를 충족하지 못한다.',
      'Cloud HSM은 FIPS 140-2 Level 3 인증 HSM 클러스터에서 키를 호스팅하는 관리형 서비스이며, Cloud KMS를 앞단으로 사용하므로 CMEK 연동을 그대로 쓸 수 있다.',
      '하드코딩은 기본적인 보안 원칙 위반이다.',
      '스프레드시트 키 관리는 보안 표준을 충족하지 못하고 유출 위험이 크다.',
    ],
    principle:
      '하드웨어 인증 요구가 있으면 Cloud HSM(관리형), 키를 Google 밖에 둬야 하면 Cloud EKM을 선택한다.',
    refs: [
      { title: 'Cloud HSM', url: 'https://docs.cloud.google.com/kms/docs/hsm' },
    ],
  },
  {
    id: 'c05-24',
    chapter: 5,
    domain: 3,
    topic: '사설 인증 기관(CA Service)',
    question:
      '금융사가 사내 마이크로서비스 간 통신에 상호 TLS(mTLS)를 적용하려 한다. 서비스 수백 개에 사설 인증서를 자동으로 발급·갱신해야 하고, 루트 CA 키는 HSM으로 보호되어야 하며, 인증서 발급 이력이 감사되어야 한다. 가장 적합한 방법은?',
    options: [
      '개발자가 OpenSSL로 자체 서명 인증서를 만들어 각 서비스에 복사한다.',
      'Certificate Authority Service로 관리형 사설 CA를 구성해 인증서를 발급·관리한다.',
      '공개 CA에서 서비스마다 공인 인증서를 구매한다.',
      'mTLS 대신 IP 허용 목록만 사용한다.',
    ],
    answer: [1],
    explanations: [
      '수작업 자체 서명 인증서는 갱신 누락·키 관리·감사 문제가 크다.',
      'Certificate Authority Service는 HSM으로 CA 키를 보호하는 관리형 사설 CA로, 대규모 인증서 발급·갱신 자동화와 감사 로그를 제공한다.',
      '내부 서비스에 공인 인증서를 쓰는 것은 비용이 크고 내부 이름 사용에도 제약이 있다.',
      'IP 허용 목록은 서비스 신원을 검증하지 못한다.',
    ],
    principle:
      '내부 서비스 신원·mTLS에는 관리형 사설 PKI(CA Service)를, 공개 웹사이트에는 공인 인증서(관리형 인증서)를 사용한다.',
    refs: [
      { title: 'Certificate Authority Service 개요', url: 'https://docs.cloud.google.com/certificate-authority-service/docs/ca-service-overview' },
    ],
  },
  {
    id: 'c05-25',
    chapter: 5,
    domain: 3,
    topic: 'BigQuery 행 수준 보안',
    question:
      '전국 판매 데이터가 하나의 BigQuery 테이블에 있다. 각 지역 관리자는 자기 지역(region 열) 행만 볼 수 있어야 하고, 본사 분석가는 전체를 볼 수 있어야 한다. 테이블을 지역별로 나누지 않고 구현하려면?',
    options: [
      '지역마다 뷰를 만들어 관리자에게 각 뷰 URL만 알려 주고 테이블 권한은 그대로 둔다.',
      '행 수준 액세스 정책으로 지역 관리자 그룹별 필터(region 조건)를 정의하고, 본사 분석가 그룹에는 전체 행을 허용한다.',
      '지역별로 테이블을 복제해 매일 동기화한다.',
      '관리자에게 쿼리 시 WHERE 조건을 반드시 쓰라고 안내한다.',
    ],
    answer: [1],
    explanations: [
      '테이블 권한이 그대로면 관리자가 원본 테이블을 직접 조회할 수 있어 통제가 되지 않는다.',
      '행 수준 보안은 테이블에 행 액세스 정책을 두어 주 구성원별로 볼 수 있는 행을 필터링한다. 하나의 테이블로 지역별 접근을 강제할 수 있다.',
      '복제는 저장 비용과 동기화 부담을 만든다.',
      '안내는 기술적 통제가 아니다.',
    ],
    principle:
      '같은 테이블에서 사용자별로 다른 행을 보여야 하면 행 수준 보안, 다른 열을 숨겨야 하면 열 수준 보안(정책 태그)을 쓴다.',
    refs: [
      { title: 'BigQuery 행 수준 보안 소개', url: 'https://docs.cloud.google.com/bigquery/docs/row-level-security-intro' },
    ],
  },
  {
    id: 'c05-26',
    chapter: 5,
    domain: 3,
    topic: '민감 데이터 검색(데이터 프로필)',
    question:
      '인수합병으로 넘겨받은 조직의 BigQuery 데이터 세트 수천 개와 Cloud Storage 버킷에 어떤 개인정보가 어디에 있는지 아무도 모른다. 규정 준수팀은 민감 데이터의 위치와 위험도를 파악해 우선순위를 정하고 싶다. 가장 효율적인 첫 단계는?',
    options: [
      '담당자에게 테이블을 하나씩 열어 보게 한다.',
      'Sensitive Data Protection의 검색(discovery) 기능으로 데이터 프로필을 생성해 민감 정보 유형과 위험도를 조직 수준에서 파악한다.',
      '모든 데이터를 삭제하고 필요한 것만 다시 적재한다.',
      '모든 데이터 세트에 CMEK를 적용하면 민감 데이터 위치를 알 수 있다.',
    ],
    answer: [1],
    explanations: [
      '수천 개 데이터 세트를 수작업으로 검토하는 것은 비현실적이다.',
      '검색 기능은 조직·폴더·프로젝트 범위에서 데이터를 자동으로 프로파일링해 어떤 민감 정보 유형이 어디에 있고 위험도가 어느 정도인지 보여 준다. 이후 보호 조치의 우선순위를 정할 수 있다.',
      '무분별한 삭제는 비즈니스 데이터 손실을 초래한다.',
      'CMEK는 암호화 키 관리일 뿐 민감 데이터를 식별하지 않는다.',
    ],
    principle:
      '데이터 보호는 “어디에 무엇이 있는지 아는 것(검색·분류)”에서 시작한다. 이후 접근 통제·비식별화를 적용한다.',
    refs: [
      { title: '데이터 프로필', url: 'https://docs.cloud.google.com/sensitive-data-protection/docs/data-profiles' },
    ],
  },
  {
    id: 'c05-27',
    chapter: 5,
    domain: 3,
    topic: 'AI 학습 데이터 보호',
    question:
      '통신사가 상담 기록으로 고객 응대 모델을 조정(튜닝)하려 한다. 상담 기록에는 고객 이름·전화번호·주소가 포함되어 있으며, 개인정보가 모델에 학습되어 다른 사용자 응답에 노출될 위험을 없애고 싶다. 대화 맥락은 학습에 유지되어야 한다. 가장 적절한 방법은?',
    options: [
      '상담 기록을 그대로 사용해 학습하고 모델 응답을 사후 검토한다.',
      '학습 전에 Sensitive Data Protection으로 개인정보를 탐지해 마스킹·대체(비식별화)한 데이터를 조정에 사용한다.',
      '상담 기록을 모두 폐기하고 합성 데이터만 사용한다.',
      '학습 데이터를 공개 버킷에 올려 협력사가 검토하게 한다.',
    ],
    answer: [1],
    explanations: [
      '원본 학습은 개인정보가 모델에 남아 노출될 위험이 있고, 사후 검토로는 막기 어렵다.',
      '학습 전에 민감 정보를 탐지해 마스킹하거나 유형 토큰으로 대체하면, 대화의 맥락과 구조는 유지하면서 개인정보가 모델에 학습되는 것을 막을 수 있다.',
      '데이터를 모두 폐기하면 실제 상담 맥락을 잃어 모델 품질이 떨어진다.',
      '공개 버킷 업로드는 명백한 유출이다.',
    ],
    principle:
      'AI 보안은 입력(학습·프롬프트) 단계에서 민감 데이터를 제거하는 것부터 시작한다. 출력 단계 필터(Model Armor 등)와 함께 다층으로 방어한다.',
    refs: [
      { title: 'Sensitive Data Protection 비식별화', url: 'https://docs.cloud.google.com/sensitive-data-protection/docs/deidentify-sensitive-data' },
    ],
  },
  {
    id: 'c05-28',
    chapter: 5,
    domain: 3,
    topic: 'Assured Workloads',
    question:
      '방산 협력업체가 규제 대상 워크로드를 Google Cloud에서 운영하려 한다. 규제상 데이터 위치 제한, 특정 인원 요건을 충족하는 지원 인력, 허용된 서비스만 사용하도록 하는 통제가 요구된다. 이러한 통제를 폴더 단위로 일관되게 적용하려면?',
    options: [
      '일반 프로젝트를 만들고 필요한 통제를 문서로만 관리한다.',
      'Assured Workloads로 해당 규정 준수 체계에 맞는 폴더를 만들어 워크로드를 배치한다.',
      '모든 리소스를 온프레미스로 되돌린다.',
      '프로젝트마다 방화벽 규칙만 강화한다.',
    ],
    answer: [1],
    explanations: [
      '문서만으로는 위치·인력·서비스 제한을 기술적으로 강제하지 못한다.',
      'Assured Workloads는 선택한 규정 준수 체계에 맞춰 데이터 위치, 지원 인력 요건, 허용 서비스 등 통제를 폴더 단위로 적용해 규제 워크로드 운영을 돕는다.',
      '온프레미스 복귀는 요구사항과 무관하게 클라우드 이점을 포기한다.',
      '방화벽은 네트워크 통제일 뿐 규제 요건의 대부분을 다루지 못한다.',
    ],
    principle:
      '규제 체계별 통제(위치·인력·서비스)를 일관되게 강제해야 하면 Assured Workloads 폴더를 사용한다.',
    refs: [
      { title: 'Assured Workloads 개요', url: 'https://docs.cloud.google.com/assured-workloads/docs/overview' },
    ],
  },
  {
    id: 'c05-29',
    chapter: 5,
    domain: 3,
    topic: '보안 사고 대응 자동화',
    question:
      '보안팀은 Security Command Center에서 “공개 버킷” 같은 고위험 발견 항목이 생기면 몇 분 안에 자동으로 조치(공개 액세스 제거)하고 담당 팀 채널에 알리고 싶다. 현재는 다음 날 아침에 사람이 확인한다. 가장 적절한 구성은?',
    options: [
      '매일 아침 콘솔에서 발견 항목을 수동으로 검토한다.',
      'Security Command Center 알림을 Pub/Sub로 내보내고, 이를 구독하는 Cloud Run functions가 발견 유형에 따라 자동 조치와 알림을 수행하게 한다.',
      '모든 버킷을 삭제한다.',
      '발견 항목을 CSV로 내보내 주간 회의에서 논의한다.',
    ],
    answer: [1],
    explanations: [
      '수동 검토는 대응이 늦어 그 사이 데이터가 노출될 수 있다.',
      'SCC 발견 항목 알림을 Pub/Sub로 받으면 이벤트 기반 자동화로 즉시 조치하고 알릴 수 있다. 자동 조치는 명확한 저위험 조치에 한정하고 나머지는 사람의 검토로 넘긴다.',
      '무차별 삭제는 서비스 장애를 일으킨다.',
      '주간 논의는 대응 속도 요구와 거리가 멀다.',
    ],
    principle:
      '탐지 → 알림(Pub/Sub) → 자동 대응(함수·워크플로)으로 평균 대응 시간을 줄인다. 자동 조치 범위는 신중히 정의한다.',
    refs: [
      { title: 'Security Command Center 알림 사용 설정', url: 'https://docs.cloud.google.com/security-command-center/docs/how-to-notifications' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (8) ─────────
  {
    id: 'c05-30',
    chapter: 5,
    domain: 4,
    topic: '비용 이상 감지',
    question:
      '재무팀은 월말 청구서를 받고서야 특정 프로젝트의 비용이 평소의 5배로 급증했다는 사실을 알았다. 원인은 잘못 설정된 자동 확장이었다. 앞으로는 평소 패턴과 다른 비용 급증을 조기에 알아차리고 싶다. 가장 적절한 방법은?',
    options: [
      '월말 청구서 검토 주기를 유지한다.',
      'Cloud Billing의 비용 이상 감지를 사용해 과거 패턴 대비 급증을 확인하고 알림을 받으며, 예산 알림도 함께 설정한다.',
      '모든 자동 확장을 끈다.',
      '프로젝트별 결제 계정을 따로 만든다.',
    ],
    answer: [1],
    explanations: [
      '월말 검토는 이미 비용이 발생한 뒤다.',
      '비용 이상 감지는 과거 지출 패턴과 다른 급증을 자동으로 식별해 알려 준다. 예산 알림과 함께 쓰면 예상치 못한 비용을 조기에 발견할 수 있다.',
      '자동 확장을 끄면 정상 트래픽 대응 능력을 잃는다.',
      '결제 계정 분리는 감지 문제를 해결하지 않는다.',
    ],
    principle:
      '비용 통제는 사후 청구서 확인이 아니라 예산 알림 + 이상 감지로 조기 경보 체계를 만드는 것이다.',
    refs: [
      { title: '비용 이상 보기 및 관리', url: 'https://docs.cloud.google.com/billing/docs/how-to/manage-anomalies' },
    ],
  },
  {
    id: 'c05-31',
    chapter: 5,
    domain: 4,
    topic: 'GKE 비용 할당',
    question:
      '여러 팀이 하나의 공유 GKE 클러스터를 네임스페이스로 나눠 사용한다. 결제 데이터에는 클러스터 전체 비용만 보여 어떤 팀이 비용을 얼마나 쓰는지 알 수 없다. 팀별 비용을 배분하려면?',
    options: [
      '팀마다 별도 클러스터를 만든다.',
      'GKE 비용 할당을 사용 설정해 네임스페이스·라벨별 비용이 결제 데이터(BigQuery 내보내기)에 나타나게 한다.',
      '노드 수를 팀 수로 나눠 비용을 균등 배분한다.',
      '각 팀에 사용량을 스스로 보고하게 한다.',
    ],
    answer: [1],
    explanations: [
      '팀별 클러스터는 관리 비용과 자원 낭비를 늘린다.',
      'GKE 비용 할당은 클러스터 자원 사용을 네임스페이스와 Kubernetes 라벨 단위로 결제 데이터에 반영해, 공유 클러스터에서도 팀별 비용을 배분할 수 있게 한다.',
      '균등 배분은 실제 사용량을 반영하지 않아 불공정하다.',
      '자가 보고는 부정확하고 검증할 수 없어 비용 배분의 근거가 되지 못한다.',
    ],
    principle:
      '공유 플랫폼의 비용 투명성은 워크로드 단위 비용 할당(네임스페이스·라벨)으로 확보한다.',
    refs: [
      { title: 'GKE 비용 할당', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/how-to/cost-allocations' },
    ],
  },
  {
    id: 'c05-32',
    chapter: 5,
    domain: 4,
    topic: '셀프서비스 프로비저닝(템플릿)',
    question:
      '플랫폼 팀은 개발팀이 새 서비스를 시작할 때마다 네트워크·보안·모니터링 설정을 검토하느라 몇 주가 걸린다. 개발팀은 승인된 표준 구성으로 몇 분 안에 스스로 애플리케이션 환경을 배포하길 원하고, 플랫폼 팀은 조직 표준이 항상 지켜지길 원한다. 가장 적절한 접근은?',
    options: [
      '모든 요청을 티켓으로 받아 플랫폼 팀이 수동으로 구성한다.',
      'Application Design Center 같은 도구로 조직 표준이 반영된 애플리케이션 템플릿을 만들어 공유하고, 개발팀이 이를 이용해 셀프서비스로 배포하게 한다.',
      '개발팀에 조직 관리자 권한을 부여한다.',
      '검토 없이 무엇이든 배포하게 한다.',
    ],
    answer: [1],
    explanations: [
      '수동 구성은 병목을 그대로 둔다.',
      '표준이 내장된 템플릿을 제공하면 개발팀은 승인된 구성으로 빠르게 배포하고, 플랫폼 팀은 템플릿을 통해 보안·규정 준수 기준을 일관되게 적용할 수 있다.',
      '과도한 권한은 통제 상실로 이어진다.',
      '검토 없는 배포는 보안·규정 위험을 만든다.',
    ],
    principle:
      '서비스 카탈로그·템플릿 기반 셀프서비스는 “표준 준수”와 “개발 속도”를 동시에 달성하는 플랫폼 엔지니어링의 핵심이다.',
    refs: [
      { title: 'Application Design Center 개요', url: 'https://docs.cloud.google.com/application-design-center/docs/overview' },
    ],
  },
  {
    id: 'c05-33',
    chapter: 5,
    domain: 4,
    topic: '인프라 코드 정책 검증',
    question:
      '팀이 Terraform으로 인프라를 배포하는데, 가끔 공개 IP를 가진 VM이나 암호화 설정이 빠진 버킷이 운영에 배포된 뒤 보안 점검에서 발견된다. 이런 위반을 배포 전에 잡아내려면 CI 파이프라인에 무엇을 추가해야 하는가?',
    options: [
      '배포 후 월 1회 수동 보안 점검',
      'terraform plan 결과를 조직의 정책(제약 조건 라이브러리)으로 검증하는 정책 검증 단계를 추가하고, 위반 시 배포를 중단한다.',
      'Terraform 대신 콘솔에서 수동으로 배포한다.',
      '배포 속도를 높이기 위해 plan 단계를 생략한다.',
    ],
    answer: [1],
    explanations: [
      '배포 후 점검은 위반 구성이 이미 운영에 노출된 뒤에야 발견된다.',
      '정책 검증은 plan 결과를 보안·거버넌스 정책과 대조해, 위반 구성이 배포되기 전에 파이프라인에서 차단한다(“시프트 레프트”).',
      '수동 배포는 재현성과 검토 가능성을 잃는다.',
      'plan 생략은 변경 검토 기회를 없앤다.',
    ],
    principle:
      '인프라도 코드처럼 테스트한다: 정적 검증(형식·정책) → plan 검토 → 적용 → 사후 탐지(SCC)로 다층 방어한다.',
    refs: [
      { title: 'Terraform 정책 검증', url: 'https://docs.cloud.google.com/docs/terraform/policy-validation' },
    ],
  },
  {
    id: 'c05-34',
    chapter: 5,
    domain: 4,
    topic: '장애 시 고객 커뮤니케이션',
    question:
      'B2B SaaS가 2시간 장애를 겪는 동안 고객사들은 상황을 알 수 없어 영업 담당자에게 수백 통의 전화를 걸었다. 고객 성공(customer success) 관점에서 다음 장애에 대비해 가장 적절한 개선은?',
    options: [
      '장애가 완전히 해결될 때까지 고객에게 아무 정보도 주지 않는다.',
      '공개 상태 페이지와 정기 업데이트 주기를 정한 장애 커뮤니케이션 절차를 만들고, 장애 후에는 영향·원인·재발 방지책을 담은 요약을 고객에게 공유한다.',
      '모든 고객 문의를 기술 엔지니어에게 직접 연결한다.',
      'SLA 문구를 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '정보 부재는 고객 불안과 문의 폭증을 키운다.',
      '상태 페이지와 정해진 업데이트 주기는 고객이 스스로 상황을 확인하게 해 문의를 줄이고 신뢰를 유지한다. 사후 요약은 투명성과 재발 방지 의지를 보여 준다.',
      '엔지니어에게 문의를 연결하면 복구 작업이 방해받는다.',
      'SLA를 없애는 것은 고객 신뢰를 해친다.',
    ],
    principle:
      '장애 대응은 기술 복구와 커뮤니케이션을 병행한다. 투명하고 예측 가능한 업데이트가 고객 신뢰를 지킨다.',
    refs: [
      { title: 'SRE 워크북: 인시던트 대응', url: 'https://sre.google/workbook/incident-response/' },
    ],
  },
  {
    id: 'c05-35',
    chapter: 5,
    domain: 4,
    topic: '변화 관리(도입 확산)',
    question:
      '회사가 새 관측성 플랫폼과 배포 파이프라인을 도입했지만 6개월이 지나도 절반의 팀이 기존 수작업 방식을 고수한다. 경영진은 사용을 강제하는 지시를 내리려 한다. 아키텍트가 권장할 변화 관리 방법으로 가장 적절한 것은?',
    options: [
      '사용하지 않는 팀을 공개적으로 질책한다.',
      '초기 성공 팀을 사례로 공유하고, 팀별 챔피언을 지정해 실습 교육과 마이그레이션 지원을 제공하며, 도입 지표를 추적해 장애물을 제거한다.',
      '기존 방식을 즉시 전면 차단한다.',
      '도입을 포기하고 이전 도구로 돌아간다.',
    ],
    answer: [1],
    explanations: [
      '질책은 저항을 키우고 협력을 해친다.',
      '성공 사례·챔피언·실습 지원은 새 방식의 가치를 체감하게 하고 전환 장벽을 낮춘다. 도입 지표로 막히는 지점을 찾아 해결하면 지속적으로 확산된다.',
      '준비 없는 전면 차단은 업무 중단을 일으킬 수 있다.',
      '포기는 투자와 개선 기회를 잃는다.',
    ],
    principle:
      '변화 관리는 지시보다 가치 증명·역량 지원·장애물 제거로 이루어진다.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  {
    id: 'c05-36',
    chapter: 5,
    domain: 4,
    topic: '개념 증명(PoC) 기반 의사결정',
    question:
      '데이터팀이 실시간 분석 엔진으로 두 가지 후보 아키텍처를 놓고 몇 달째 문서로만 논쟁하고 있다. 핵심 쟁점은 “우리 데이터 규모에서 초당 처리량과 쿼리 지연이 요구를 만족하는가”이다. 의사결정을 진전시키는 가장 적절한 방법은?',
    options: [
      '더 자세한 비교 문서를 작성한다.',
      '성공 기준(처리량·지연·비용)을 미리 합의하고, 대표 데이터로 기간을 정한 개념 증명(PoC)을 두 후보에 수행해 결과로 결정한다.',
      '가장 유명한 기술을 선택한다.',
      '두 아키텍처를 모두 운영에 도입해 본다.',
    ],
    answer: [1],
    explanations: [
      '문서 논쟁은 핵심 쟁점(실제 성능)을 검증하지 못한다.',
      '측정 가능한 성공 기준을 먼저 합의하고 대표 데이터로 시간 제한 PoC를 수행하면, 객관적 근거로 빠르게 결정할 수 있다.',
      '유명도는 이 회사의 요구 충족 여부와 무관하다.',
      '둘 다 운영 도입하면 비용과 복잡도가 크게 늘어난다.',
    ],
    principle:
      '불확실성이 큰 기술 결정은 사전 합의한 기준으로 짧은 PoC를 수행해 데이터로 결정한다.',
    refs: [
      { title: '아키텍처 의사결정 기록 개요', url: 'https://docs.cloud.google.com/architecture/architecture-decision-records' },
    ],
  },
  {
    id: 'c05-37',
    chapter: 5,
    domain: 4,
    topic: 'GKE 백업과 복구',
    question:
      'GKE에서 운영하는 상태 저장 애플리케이션(영구 볼륨 사용)에 대해, 실수로 네임스페이스를 삭제하거나 업그레이드가 실패했을 때 Kubernetes 리소스 구성과 볼륨 데이터를 함께 복원할 수 있어야 한다. 정기 백업과 보존 정책도 필요하다. 가장 적합한 방법은?',
    options: [
      'Git에 매니페스트만 저장해 두면 충분하다.',
      'Backup for GKE로 백업 계획을 만들어 클러스터 리소스와 영구 볼륨 데이터를 정기 백업하고, 필요 시 복원 계획으로 복구한다.',
      '노드 VM의 부팅 디스크 스냅샷을 만든다.',
      '클러스터를 두 개 운영하면 백업이 필요 없다.',
    ],
    answer: [1],
    explanations: [
      'Git의 매니페스트는 구성은 복원하지만 영구 볼륨의 데이터는 복원하지 못한다.',
      'Backup for GKE는 워크로드 구성과 영구 볼륨 데이터를 함께 백업하고, 백업 계획(일정·보존)과 복원 계획으로 복구를 관리한다.',
      '노드 부팅 디스크는 애플리케이션 데이터와 Kubernetes 리소스 상태를 담고 있지 않다.',
      '두 번째 클러스터로 복제하면 실수 삭제도 복제될 수 있어 시점 복구를 대체하지 못한다.',
    ],
    principle:
      '컨테이너 플랫폼의 DR은 “구성(GitOps) + 데이터(볼륨 백업)” 둘 다 필요하다. Backup for GKE는 둘을 함께 다룬다.',
    refs: [
      { title: 'Backup for GKE 개요', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/add-on/backup-for-gke/concepts/backup-for-gke' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (7) ─────────
  {
    id: 'c05-38',
    chapter: 5,
    domain: 5,
    topic: 'Cloud Run 리비전 태그 테스트',
    question:
      'QA팀은 Cloud Run에 새 버전을 배포한 뒤, 실제 사용자 트래픽을 전혀 보내지 않은 상태에서 운영 환경 설정 그대로 새 버전을 테스트하고 싶다. 테스트가 끝나면 트래픽을 옮길 계획이다. 가장 적절한 방법은?',
    options: [
      '별도 프로젝트에 같은 서비스를 새로 만든다.',
      '새 리비전을 트래픽 0%로 배포하고 리비전 태그를 붙여, 태그 전용 URL로 새 버전을 테스트한다.',
      '운영 트래픽의 50%를 새 버전으로 보내 테스트한다.',
      '로컬 Docker로만 테스트한다.',
    ],
    answer: [1],
    explanations: [
      '별도 프로젝트는 운영 설정과 차이가 생기고 관리 부담이 크다.',
      '리비전 태그는 특정 리비전에 전용 URL을 제공해, 사용자 트래픽 없이 운영 서비스와 같은 설정으로 새 버전을 테스트할 수 있게 한다. 이후 트래픽을 점진적으로 옮긴다.',
      '실제 사용자를 테스트에 노출하는 것은 요구사항에 어긋난다.',
      '로컬 테스트는 운영 환경 설정(서비스 계정·VPC·시크릿 등)을 재현하지 못한다.',
    ],
    principle:
      '“다크 런치”: 새 버전을 트래픽 없이 배포하고 태그 URL로 검증한 뒤 트래픽을 옮긴다.',
    refs: [
      { title: 'Cloud Run 롤백·점진적 롤아웃·트래픽 이전', url: 'https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration' },
    ],
  },
  {
    id: 'c05-39',
    chapter: 5,
    domain: 5,
    topic: 'Apigee hybrid',
    question:
      '은행은 API 관리 기능(개발자 포털·분석·정책 관리)은 클라우드에서 쓰고 싶지만, 규정상 API 트래픽 자체는 은행 데이터센터 밖으로 나가면 안 된다. 기존 Kubernetes 플랫폼을 온프레미스에서 운영하고 있다. 가장 적합한 선택은?',
    options: [
      'Apigee(Google Cloud 호스팅 런타임)를 사용한다.',
      'Apigee hybrid로 관리 영역은 Google Cloud에, 런타임은 온프레미스 Kubernetes에 배포한다.',
      'API 관리를 포기하고 각 서비스에 직접 인증을 구현한다.',
      'Cloud Armor를 온프레미스에 설치한다.',
    ],
    answer: [1],
    explanations: [
      '클라우드 호스팅 런타임은 API 트래픽이 Google Cloud를 거치므로 규정에 어긋난다.',
      'Apigee hybrid는 관리 영역(관리 UI·분석)은 Google Cloud에 두고, API 트래픽을 처리하는 런타임을 고객이 관리하는 Kubernetes 클러스터(온프레미스 등)에서 실행해 트래픽을 데이터센터 안에 유지한다.',
      '직접 구현은 중복과 보안 위험을 키운다.',
      'Cloud Armor는 Google Cloud 부하 분산기용 서비스로 온프레미스에 설치하는 제품이 아니다.',
    ],
    principle:
      'API 트래픽 위치 제약이 있으면 관리 영역과 런타임을 분리하는 하이브리드 배포(Apigee hybrid)를 검토한다.',
    refs: [
      { title: 'Apigee hybrid란?', url: 'https://docs.cloud.google.com/apigee/docs/hybrid/v1.17/what-is-hybrid' },
    ],
  },
  {
    id: 'c05-40',
    chapter: 5,
    domain: 5,
    topic: 'Cloud 클라이언트 라이브러리',
    question:
      '개발자가 Java 서비스에서 Cloud Storage·Pub/Sub API를 직접 HTTP REST 호출로 구현했다. 인증 토큰 갱신, 재시도, 페이지 나누기, 대용량 업로드 재개 로직을 모두 직접 작성하다 보니 버그가 잦다. 가장 적절한 개선은?',
    options: [
      'REST 호출 코드를 더 많은 단위 테스트로 보강한다.',
      '해당 언어용 Cloud 클라이언트 라이브러리로 교체해 인증(ADC)·재시도·페이지 나누기 같은 공통 기능을 라이브러리에 맡긴다.',
      '모든 호출을 gcloud CLI를 실행하는 셸 명령으로 바꾼다.',
      'API 호출 빈도를 줄이기 위해 기능을 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '테스트를 늘려도 공통 기능을 직접 유지보수하는 부담은 그대로다.',
      'Cloud 클라이언트 라이브러리는 언어별 관용적 API와 함께 인증·재시도·페이지 나누기·스트리밍 등 공통 기능을 제공해 코드와 버그를 줄인다.',
      '애플리케이션에서 CLI를 실행하는 것은 느리고 취약하다.',
      '기능 삭제는 요구사항을 무시한다.',
    ],
    principle:
      'Google API는 가능하면 권장되는 Cloud 클라이언트 라이브러리로 호출해 인증·재시도·모범 사례를 기본으로 얻는다.',
    refs: [
      { title: '클라이언트 라이브러리 설명', url: 'https://docs.cloud.google.com/apis/docs/client-libraries-explained' },
    ],
  },
  {
    id: 'c05-41',
    chapter: 5,
    domain: 5,
    topic: '기존 리소스의 IaC 편입',
    question:
      '회사는 지난 2년간 콘솔에서 수동으로 만든 VPC·방화벽·Cloud SQL 인스턴스를 앞으로 Terraform으로 관리하려 한다. 운영 중인 리소스를 삭제하거나 재생성해서는 안 된다. 가장 적절한 방법은?',
    options: [
      '기존 리소스를 모두 삭제하고 Terraform으로 다시 만든다.',
      '리소스에 맞는 Terraform 구성을 작성한 뒤 terraform import(또는 import 블록)로 기존 리소스를 상태에 가져오고, plan 결과에 변경이 없음을 확인한다.',
      'Terraform 상태 파일을 손으로 편집한다.',
      '기존 리소스는 그대로 두고 새 리소스만 Terraform으로 관리한다.',
    ],
    answer: [1],
    explanations: [
      '삭제·재생성은 운영 중단과 데이터 손실 위험이 있다.',
      'import는 이미 존재하는 리소스를 Terraform 상태로 가져와 관리 대상으로 편입한다. 이후 plan에 변경이 없으면 구성과 실제 상태가 일치함을 확인할 수 있다.',
      '상태 파일 수동 편집은 손상과 불일치 위험이 크다.',
      '기존 리소스를 방치하면 IaC 관리의 이점(검토·재현성·드리프트 감지)을 얻지 못한다.',
    ],
    principle:
      '브라운필드 IaC 전환은 “구성 작성 → import → plan 무변경 확인” 순서로 무중단 편입한다.',
    refs: [
      { title: 'Terraform으로 기존 리소스 가져오기', url: 'https://docs.cloud.google.com/docs/terraform/resource-management/import' },
    ],
  },
  {
    id: 'c05-42',
    chapter: 5,
    domain: 5,
    topic: '테스트 유형 선택',
    question:
      '결제 서비스 팀이 테스트 전략을 정리하고 있다. (1) 할인 계산 함수의 경계값 오류를 빠르게 잡고, (2) 연말 트래픽에서 응답 지연이 목표 이내인지 확인하려 한다. 각각에 가장 적합한 테스트는? (2개 선택)',
    options: [
      '할인 계산 로직에 대한 단위 테스트를 CI에서 커밋마다 실행한다.',
      '예상 최대 트래픽 패턴으로 스테이징 환경에서 부하 테스트를 실행한다.',
      '할인 계산 경계값을 운영 환경 사용자 불만으로 확인한다.',
      '부하 특성을 단위 테스트로 검증한다.',
      '모든 검증을 수동 탐색 테스트로 대신한다.',
    ],
    answer: [0, 1],
    explanations: [
      '로직 오류는 빠르고 격리된 단위 테스트가 가장 효율적으로 잡는다. 커밋마다 실행하면 조기에 발견된다.',
      '지연 목표 충족 여부는 현실적 트래픽으로 시스템 전체에 부하를 거는 부하 테스트로 확인한다.',
      '사용자 불만으로 결함을 찾는 것은 사후 대응이다.',
      '단위 테스트는 격리된 로직 검증용으로 시스템 부하 특성을 측정하지 못한다.',
      '수동 탐색 테스트는 보완 수단일 뿐 반복 가능한 자동 검증을 대체하지 못한다.',
    ],
    principle:
      '테스트는 위험에 맞춰 고른다: 로직 = 단위, 구성 요소 연동 = 통합(에뮬레이터 등), 성능·용량 = 부하, 복원력 = 장애 주입.',
    refs: [
      { title: 'DORA 역량: 테스트 자동화', url: 'https://dora.dev/capabilities/test-automation/' },
    ],
  },
  {
    id: 'c05-43',
    chapter: 5,
    domain: 5,
    topic: '대용량 파일 업로드(gcloud storage)',
    question:
      '엔지니어가 온프레미스 서버에서 수십 GB짜리 백업 파일 몇 개를 Cloud Storage로 수동 업로드한다. 대역폭은 충분하지만 파일 하나씩 순차 업로드라 느리다. 일회성 작업이라 관리형 전송 서비스를 구성하고 싶지는 않다. 가장 적절한 방법은?',
    options: [
      '브라우저 콘솔에서 파일을 하나씩 업로드한다.',
      'gcloud storage cp를 사용하고, 병렬 복합 업로드가 적용되도록 해 큰 파일을 여러 조각으로 병렬 업로드한다.',
      'Transfer Appliance를 주문한다.',
      '파일을 이메일 첨부로 보낸다.',
    ],
    answer: [1],
    explanations: [
      '브라우저 업로드는 대용량·다수 파일에 느리고 실패 시 재시작이 어렵다.',
      'gcloud storage는 병렬 처리와 병렬 복합 업로드(큰 파일을 조각으로 나눠 병렬 전송 후 결합)를 지원해 가용 대역폭을 효율적으로 활용한다. 일회성 작업에 적합하다.',
      '대역폭이 충분한 일회성 수십 GB 전송에 오프라인 장비는 과하다.',
      '이메일은 대용량 전송 수단이 아니다.',
    ],
    principle:
      '전송 도구 선택: 소규모·일회성 = gcloud storage, 대규모·반복·관리형 = Storage Transfer Service, 대역폭 부족 = Transfer Appliance.',
    refs: [
      { title: '병렬 복합 업로드', url: 'https://docs.cloud.google.com/storage/docs/parallel-composite-uploads' },
      { title: 'gcloud로 Cloud Storage 사용', url: 'https://docs.cloud.google.com/storage/docs/discover-object-storage-gcloud' },
    ],
  },
  {
    id: 'c05-44',
    chapter: 5,
    domain: 5,
    topic: '대량 오프라인 AI 추론',
    question:
      '전자상거래 회사가 상품 200만 개의 설명을 Gemini로 다시 작성하는 작업을 하려 한다. 결과는 다음 주까지만 있으면 되고, 실시간 응답은 필요 없다. 요청을 하나씩 온라인 API로 보내면 할당량 한도와 비용이 걱정된다. 가장 적합한 방법은?',
    options: [
      '온라인 API를 최대한 많은 스레드로 동시에 호출한다.',
      'BigQuery 테이블이나 Cloud Storage 파일로 입력을 준비해 Gemini 배치 추론 작업으로 처리한다.',
      '상품 설명을 사람이 직접 다시 쓴다.',
      '모델을 처음부터 학습해 자체 서버에서 실행한다.',
    ],
    answer: [1],
    explanations: [
      '과도한 동시 호출은 할당량 초과(429)와 재시도 폭증을 일으킨다.',
      '배치 추론은 즉시 응답이 필요 없는 대량 요청을 비동기로 높은 처리량에 비용 효율적으로 처리하도록 설계되어 있고, BigQuery나 Cloud Storage를 입력·출력으로 사용할 수 있다.',
      '수작업은 규모상 비현실적이다.',
      '자체 학습·서빙은 불필요하게 크고 느리다.',
    ],
    principle:
      '지연 허용 대량 처리 = 배치 추론, 대화형·실시간 = 온라인 추론. 워크로드 특성에 맞춰 소비 방식을 고른다.',
    refs: [
      { title: 'Gemini 배치 추론', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/batch-inference' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c05-45',
    chapter: 5,
    domain: 6,
    topic: '구조화된 로깅과 추적 연계',
    question:
      '마이크로서비스들이 로그를 평문 문자열로 남겨, 특정 요청에 관련된 로그를 서비스 전반에서 찾으려면 문자열 검색에 의존해야 한다. 또한 Cloud Trace의 느린 요청에서 해당 로그로 바로 이동하고 싶다. 가장 효과적인 개선은?',
    options: [
      '로그 수준을 모두 DEBUG로 올린다.',
      'JSON 구조화 로깅으로 심각도·요청 ID 등 필드를 남기고, 로그 항목에 트레이스 ID(trace 필드)를 포함해 로그와 트레이스를 연계한다.',
      '각 서비스가 로그를 로컬 파일로만 남기게 한다.',
      '로그를 이메일로 전송한다.',
    ],
    answer: [1],
    explanations: [
      'DEBUG 로그는 양과 비용만 늘리고 연관성 문제를 해결하지 못한다.',
      '구조화 로깅은 필드 기반 필터링·집계를 가능하게 하고, 트레이스 ID를 로그에 포함하면 Cloud Trace의 스팬에서 관련 로그로 바로 이동하는 연계가 가능해진다.',
      '로컬 파일은 중앙 검색과 연계가 불가능하다.',
      '이메일은 로그 분석 수단이 아니다.',
    ],
    principle:
      '관측성 신호(로그·지표·트레이스)는 공통 식별자(트레이스 ID)로 연결될 때 가치가 커진다. 로그는 구조화한다.',
    refs: [
      { title: '구조화된 로깅', url: 'https://docs.cloud.google.com/logging/docs/structured-logging' },
      { title: '트레이스와 로그 연계', url: 'https://docs.cloud.google.com/trace/docs/trace-log-integration' },
    ],
  },
  {
    id: 'c05-46',
    chapter: 5,
    domain: 6,
    topic: '용량 계획',
    question:
      '구독형 스트리밍 서비스의 가입자가 매월 8%씩 늘고 있다. 과거에는 DB 용량 한계에 부딪힌 뒤에야 증설해 장애가 났다. 선제적인 용량 관리를 위해 가장 적절한 방법은?',
    options: [
      '장애가 발생하면 그때 증설한다.',
      '사용량 추세와 부하 테스트로 구성 요소별 한계를 측정해 수요 예측과 비교하고, 한계 도달 전에 증설·아키텍처 변경을 계획하며, 포화도 지표에 선행 알림을 둔다.',
      '모든 자원을 현재의 10배로 미리 할당한다.',
      '가입자 수 증가를 제한한다.',
    ],
    answer: [1],
    explanations: [
      '사후 증설은 반복적인 장애를 부른다.',
      '용량 계획은 수요 예측(추세)과 공급 한계(부하 테스트로 측정)를 비교해 여유가 줄기 전에 조치하는 것이다. 포화도 선행 알림은 예측이 빗나갈 때의 안전망이 된다.',
      '과도한 선할당은 비용 낭비가 크다.',
      '비즈니스 성장을 제한하는 것은 해결책이 아니다.',
    ],
    principle:
      '용량 계획 = 수요 예측 + 한계 측정 + 선행 지표 알림. 자동 확장도 할당량·DB 같은 확장 한계가 있는 구성 요소를 따로 관리해야 한다.',
    refs: [
      { title: 'Well-Architected Framework: 신뢰성', url: 'https://docs.cloud.google.com/architecture/framework/reliability' },
    ],
  },
  {
    id: 'c05-47',
    chapter: 5,
    domain: 6,
    topic: '장애 주입(카오스 엔지니어링)',
    question:
      '서비스 메시를 사용하는 GKE 마이크로서비스들이 하위 서비스가 느려질 때 타임아웃·재시도·서킷 브레이커가 설계대로 동작하는지 검증하고 싶다. 애플리케이션 코드는 수정하지 않고, 스테이징에서 특정 서비스 호출에 지연과 오류를 인위적으로 주입하려 한다. 가장 적합한 방법은?',
    options: [
      '운영 환경의 하위 서비스를 사전 공지 없이 종료한다.',
      'Cloud Service Mesh의 트래픽 관리 설정에서 결함 주입(지연·중단) 정책을 특정 경로에 적용해 복원력 동작을 관찰한다.',
      '하위 서비스 코드에 sleep을 넣어 다시 배포한다.',
      '부하 테스트만 수행한다.',
    ],
    answer: [1],
    explanations: [
      '무계획 운영 중단은 실제 사용자 피해를 일으킨다.',
      '서비스 메시의 결함 주입은 코드 변경 없이 특정 경로에 지연·오류를 주입해, 타임아웃·재시도·서킷 브레이커가 기대대로 동작하는지 통제된 환경에서 검증하게 한다.',
      '코드에 sleep을 넣으면 재배포가 필요하고 실험 통제가 어렵다.',
      '부하 테스트는 용량을 검증할 뿐 의존성 장애에 대한 복원력은 검증하지 못한다.',
    ],
    principle:
      '카오스 엔지니어링은 가설 → 통제된 장애 주입 → 관찰 → 개선의 실험이다. 범위를 작게 시작해 점진적으로 넓힌다.',
    refs: [
      { title: 'Cloud Service Mesh 고급 트래픽 관리(결함 주입)', url: 'https://docs.cloud.google.com/service-mesh/docs/service-routing/advanced-traffic-management' },
    ],
  },
  {
    id: 'c05-48',
    chapter: 5,
    domain: 6,
    topic: '품질 게이트',
    question:
      '운영 장애 원인 분석 결과, 상당수가 코드 리뷰 없이 병합된 변경과 정적 분석으로 쉽게 잡을 수 있었던 결함(널 참조, 알려진 취약 라이브러리)이었다. 품질 통제를 강화하되 개발 속도는 크게 떨어뜨리지 않으려면?',
    options: [
      '분기마다 외부 감사를 받는다.',
      '보호된 메인 브랜치에 필수 코드 리뷰를 적용하고, CI에서 정적 분석·의존성 취약점 검사를 자동 실행해 기준 미달 시 병합을 막는다.',
      '모든 변경을 QA팀이 2주간 수동 검증한다.',
      '배포 횟수를 월 1회로 줄인다.',
    ],
    answer: [1],
    explanations: [
      '분기 감사는 피드백이 너무 늦다.',
      '필수 리뷰와 자동 정적 분석·취약점 검사를 병합 전 품질 게이트로 두면, 결함을 초기에 저렴하게 잡으면서 자동화 덕분에 속도 저하도 작다.',
      '장기간 수동 검증은 속도를 크게 떨어뜨린다.',
      '배포 빈도 감소는 변경 규모를 키워 위험을 늘린다.',
    ],
    principle:
      '품질은 마지막 검사가 아니라 파이프라인 전 단계의 자동 게이트로 만든다.',
    refs: [
      { title: 'DORA 역량: 지속적 통합', url: 'https://dora.dev/capabilities/continuous-integration/' },
    ],
  },
  {
    id: 'c05-49',
    chapter: 5,
    domain: 6,
    topic: '지원 케이스 모범 사례',
    question:
      '운영 중인 Cloud SQL 인스턴스에 알 수 없는 연결 오류가 발생해 비즈니스에 큰 영향을 주고 있다. Google Cloud Customer Care에 케이스를 열려 한다. 빠른 해결을 위해 가장 적절한 방법은?',
    options: [
      '“DB가 안 됨”이라고만 적고 최저 우선순위로 제출한다.',
      '비즈니스 영향에 맞는 우선순위를 선택하고, 프로젝트 ID·인스턴스 이름·발생 시각(시간대 포함)·오류 메시지·재현 방법·이미 시도한 조치를 구체적으로 적는다.',
      '같은 내용으로 여러 개의 케이스를 동시에 연다.',
      '관련 없는 모든 로그를 대량으로 첨부한다.',
    ],
    answer: [1],
    explanations: [
      '정보가 부족하고 우선순위가 영향과 맞지 않으면 대응이 늦어진다.',
      '정확한 우선순위와 식별 정보·시각·오류·재현 방법·시도한 조치를 제공하면 지원 엔지니어가 바로 조사에 착수해 해결 시간을 줄일 수 있다.',
      '중복 케이스는 혼선을 만들고 처리를 지연시킨다.',
      '무관한 대량 첨부는 분석을 방해한다.',
    ],
    principle:
      '지원 요청은 “영향에 맞는 우선순위 + 구체적 식별 정보 + 재현 정보 + 시도한 조치”로 작성한다.',
    refs: [
      { title: 'Customer Care 모범 사례', url: 'https://docs.cloud.google.com/support/docs/best-practices' },
    ],
  },
  {
    id: 'c05-50',
    chapter: 5,
    domain: 6,
    topic: '애플리케이션 중심 관리(App Hub)',
    question:
      '하나의 “주문” 비즈니스 애플리케이션을 구성하는 Cloud Run 서비스, 부하 분산기, Cloud SQL 인스턴스가 여러 프로젝트에 흩어져 있어, 운영팀은 장애 시 어떤 리소스가 이 애플리케이션에 속하는지 파악하기 어렵다. 리소스를 비즈니스 애플리케이션 단위로 묶어 등록하고 관리하려면?',
    options: [
      '모든 리소스를 하나의 프로젝트로 옮긴다.',
      'App Hub에 애플리케이션을 정의하고 여러 프로젝트의 서비스·워크로드를 등록해 애플리케이션 중심으로 관리한다.',
      '위키 문서에 리소스 목록을 수동으로 적는다.',
      '리소스 이름 앞에 “order-”를 붙이는 규칙만 만든다.',
    ],
    answer: [1],
    explanations: [
      '프로젝트 통합은 권한·결제·격리 경계를 깨는 큰 변경이다.',
      'App Hub는 여러 프로젝트에 흩어진 서비스와 워크로드를 비즈니스 애플리케이션 단위로 묶어 등록하는 중앙 레지스트리를 제공해, 운영·관측을 애플리케이션 관점에서 할 수 있게 한다.',
      '수동 문서는 리소스가 바뀔 때마다 금방 낡아 장애 시 신뢰할 수 없다.',
      '명명 규칙은 도움이 되지만 강제력과 구조적 관계 정보를 제공하지 못한다.',
    ],
    principle:
      '리소스 계층(조직·폴더·프로젝트)과 별개로 비즈니스 애플리케이션 단위 뷰가 필요하면 App Hub를 사용한다.',
    refs: [
      { title: 'App Hub 개요', url: 'https://docs.cloud.google.com/app-hub/docs/overview' },
    ],
  },
  // @@END
]
