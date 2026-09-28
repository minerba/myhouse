// Chapter 1 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (13) ─────────
  {
    id: 'c01-01',
    chapter: 1,
    domain: 1,
    topic: '글로벌 웹 서비스 부하 분산',
    question:
      '온라인 교육 회사가 북미·유럽·아시아 사용자에게 동영상 강의 포털을 제공한다. 웹 계층은 Compute Engine 기반이며, 정적 자산(이미지·JS·강의 썸네일)이 트래픽의 70%를 차지한다. 요구사항은 (1) 모든 대륙에서 낮은 지연 시간, (2) 한 리전 전체 장애 시에도 서비스 지속, (3) 사용자에게 단일 IP/도메인 제공이다. 어떤 아키텍처가 가장 적합한가?',
    options: [
      '3개 리전에 리전 관리형 인스턴스 그룹(MIG)을 두고, 전역 외부 애플리케이션 부하 분산기의 백엔드로 연결한 뒤 Cloud CDN을 활성화한다.',
      '각 리전에 리전 외부 애플리케이션 부하 분산기를 만들고, Cloud DNS의 가중치 기반 라운드 로빈 레코드로 세 IP를 번갈아 응답한다.',
      '단일 리전에 대형 MIG를 두고 외부 패스스루 네트워크 부하 분산기로 노출한 뒤 Cloud CDN을 활성화한다.',
      '3개 리전에 영역 MIG를 하나씩 두고, 각 리전의 내부 애플리케이션 부하 분산기를 Cloud VPN으로 연결한다.',
    ],
    answer: [0],
    explanations: [
      '전역 외부 애플리케이션 부하 분산기는 단일 애니캐스트 IP로 사용자를 가장 가까운 정상 백엔드로 보내고, 한 리전이 비정상이면 다른 리전으로 자동 전환한다. Cloud CDN이 정적 자산을 엣지에서 캐싱해 지연 시간과 원본 부하를 함께 줄인다. 리전 MIG는 리전 내 여러 영역에 분산되어 영역 장애에도 강하다.',
      'DNS 라운드 로빈은 백엔드 상태를 반영하지 못해 장애 리전의 IP를 계속 응답할 수 있고, 클라이언트 DNS 캐시 때문에 전환이 느리다. 또한 단일 IP 요구사항을 충족하지 못한다.',
      '단일 리전 구성은 리전 장애 시 서비스가 중단된다. 또한 패스스루 네트워크 부하 분산기는 HTTP(S) 기반 Cloud CDN과 함께 쓰는 구성이 아니다.',
      '내부 부하 분산기는 인터넷 사용자에게 서비스를 노출하지 않으며, 리전 간 VPN 연결은 사용자 트래픽 분산과 무관하다.',
    ],
    principle:
      '전 세계 사용자 + 리전 장애 대비 + 단일 진입점이면 전역 외부 애플리케이션 부하 분산기와 다중 리전 백엔드를 쓰고, 캐시 가능한 콘텐츠는 Cloud CDN으로 엣지에서 처리한다.',
    refs: [
      { title: '외부 애플리케이션 부하 분산기 개요', url: 'https://docs.cloud.google.com/load-balancing/docs/https' },
      { title: 'Cloud CDN 개요', url: 'https://docs.cloud.google.com/cdn/docs/overview' },
    ],
  },
  {
    id: 'c01-02',
    chapter: 1,
    domain: 1,
    topic: '데이터베이스 선택(전역 일관성)',
    question:
      '글로벌 결제 스타트업이 여러 대륙의 사용자 지갑 잔액을 관리한다. 모든 대륙에서 쓰기가 발생하며, 이중 지출을 막기 위해 전역적으로 강한 일관성의 ACID 트랜잭션이 필요하다. 리전 하나가 완전히 중단되어도 데이터 손실 없이 계속 쓰기를 받아야 하고, 데이터는 SQL로 조회해야 한다. 어떤 데이터베이스를 선택해야 하는가?',
    options: [
      '교차 리전 읽기 복제본을 여러 개 둔 Cloud SQL for PostgreSQL',
      '멀티 리전 구성의 Spanner',
      '여러 리전에 복제한 Bigtable 인스턴스',
      '멀티 리전 위치의 Firestore(Native 모드)와 클라이언트 측 잠금',
    ],
    answer: [1],
    explanations: [
      'Cloud SQL은 쓰기가 기본 인스턴스 하나에서만 가능하고, 교차 리전 복제본은 비동기라 기본 리전 장애 시 최근 트랜잭션이 유실될 수 있으며 승격도 수동 작업이다.',
      'Spanner 멀티 리전 구성은 여러 리전에 동기 복제되는 외부 일관성(강한 일관성) 트랜잭션을 제공하고, 리전 장애 시에도 데이터 손실 없이 서비스를 지속하도록 설계되었다. SQL(GoogleSQL/PostgreSQL 인터페이스)도 지원한다.',
      'Bigtable 복제는 기본적으로 최종 일관성이며 여러 행에 걸친 트랜잭션을 지원하지 않아 잔액 이체 같은 ACID 요구사항에 맞지 않는다. SQL 기반 트랜잭션 처리용도 아니다.',
      'Firestore도 트랜잭션을 지원하지만 문서형 NoSQL이며 SQL 조회 요구사항을 충족하지 못한다. 클라이언트 측 잠금은 동시성 문제를 오히려 키운다.',
    ],
    principle:
      '전역 규모 + 강한 일관성 + 관계형/SQL + 리전 장애 무손실이 동시에 요구되면 Spanner(멀티 리전)가 기준 답이다. 단일 리전 관계형이면 Cloud SQL/AlloyDB를 먼저 검토한다.',
    refs: [
      { title: 'Spanner 인스턴스 구성(리전·멀티 리전)', url: 'https://docs.cloud.google.com/spanner/docs/instance-configurations' },
      { title: 'Google Cloud 데이터베이스 제품 비교', url: 'https://cloud.google.com/products/databases' },
    ],
  },
  {
    id: 'c01-03',
    chapter: 1,
    domain: 1,
    topic: '데이터베이스 선택(시계열)',
    question:
      '스마트 계량기 제조사가 수백만 대 장비에서 초당 수십만 건의 측정값을 수집한다. 데이터는 장비 ID와 시간 범위로 조회하며, 대시보드는 한 자릿수 밀리초 수준의 읽기 지연을 요구한다. 조인이나 다중 행 트랜잭션은 필요 없고, 데이터는 수 PB까지 늘어날 예정이다. 운영 저장소로 가장 적합한 것은?',
    options: [
      'Cloud SQL for MySQL에 장비 ID로 파티셔닝한 테이블',
      'BigQuery 수집 시간 파티션 테이블에 스트리밍 삽입',
      '장비 ID와 역순 타임스탬프를 조합한 행 키를 사용하는 Bigtable',
      'Memorystore for Redis 클러스터',
    ],
    answer: [2],
    explanations: [
      'Cloud SQL은 단일 인스턴스 쓰기 처리량과 저장 용량 한계가 있어 초당 수십만 건, PB 규모 시계열에는 맞지 않는다.',
      'BigQuery는 분석용 웨어하우스로 대규모 집계에는 강하지만, 대시보드용 한 자릿수 밀리초 단건 조회를 위한 운영 저장소가 아니다.',
      'Bigtable은 대규모 쓰기 처리량과 낮은 지연의 키 조회·범위 스캔에 최적화된 와이드 컬럼 NoSQL이다. 장비 ID + 타임스탬프 조합 행 키로 핫스팟을 피하면서 장비별 시간 범위 스캔을 효율적으로 할 수 있다.',
      'Memorystore는 인메모리 캐시로 PB 규모의 영구 저장소 용도가 아니며 비용도 매우 커진다.',
    ],
    principle:
      '대량 쓰기·키 기반 저지연 조회·시계열·PB 규모는 Bigtable의 전형적인 사용 사례다. 행 키 설계(단조 증가 키 회피)가 성능을 좌우한다.',
    refs: [
      { title: 'Bigtable 개요', url: 'https://docs.cloud.google.com/bigtable/docs/overview' },
      { title: 'Bigtable 시계열 스키마 설계', url: 'https://docs.cloud.google.com/bigtable/docs/schema-design-time-series' },
    ],
  },
  {
    id: 'c01-04',
    chapter: 1,
    domain: 1,
    topic: '컴퓨팅 플랫폼 선택(서버리스)',
    question:
      '마케팅 팀이 컨테이너로 패키징된 HTTP API를 운영한다. 트래픽은 캠페인 기간에만 급증하고 평소 몇 시간씩 요청이 거의 없다. 팀에는 인프라 전담 인력이 없으며, 유휴 시간 비용을 최소화하고 싶다. API는 상태를 저장하지 않는다. 어떤 플랫폼을 권장해야 하는가?',
    options: [
      '최소 노드 3개의 GKE Standard 클러스터에 배포하고 HPA를 설정한다.',
      'Cloud Run 서비스로 배포하고 최소 인스턴스를 0으로 둔다.',
      '인스턴스 템플릿으로 MIG를 만들고 CPU 기반 자동 확장(최소 1대)을 설정한다.',
      'Compute Engine VM 한 대에 Docker로 실행하고 캠페인 때마다 머신 유형을 수동으로 키운다.',
    ],
    answer: [1],
    explanations: [
      'GKE Standard는 노드를 항상 유지해야 하므로 유휴 비용이 발생하고, 클러스터 업그레이드·노드 관리 등 운영 부담도 인프라 인력이 없는 팀에 맞지 않는다.',
      'Cloud Run은 컨테이너를 그대로 배포하는 완전 관리형 서버리스 플랫폼으로, 요청량에 따라 자동 확장되고 요청이 없으면 0으로 축소되어 유휴 비용을 없앨 수 있다. 스테이트리스 HTTP API에 가장 적합하다.',
      'MIG는 최소 1대를 항상 실행해 유휴 비용이 남고, OS 패치·이미지 관리 부담이 있다.',
      '수동 확장은 급증 트래픽에 대응할 수 없고, 단일 VM은 가용성도 낮다.',
    ],
    principle:
      '스테이트리스 컨테이너 + 간헐적 트래픽 + 최소 운영 = Cloud Run. 콜드 스타트가 문제면 최소 인스턴스를 1 이상으로 조정하는 트레이드오프를 검토한다.',
    refs: [
      { title: 'Cloud Run 개요', url: 'https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run' },
      { title: '컴퓨팅 배포 옵션 선택', url: 'https://docs.cloud.google.com/compute/docs/choose-compute-deployment-option' },
    ],
  },
  {
    id: 'c01-05',
    chapter: 1,
    domain: 1,
    topic: 'Cloud SQL 고가용성',
    question:
      '병원 예약 시스템이 Cloud SQL for MySQL을 사용한다. 요구사항은 단일 영역(zone) 장애 시 수 분 이내 자동 복구, 커밋된 트랜잭션 손실 없음(RPO≈0)이다. 리전 전체 장애는 이번 범위에 포함되지 않으며, 애플리케이션 코드 변경은 최소화해야 한다. 어떻게 구성해야 하는가?',
    options: [
      '같은 리전의 다른 영역에 읽기 복제본을 만들고, 장애 시 운영자가 수동으로 승격한다.',
      '인스턴스를 고가용성(리전) 구성으로 설정해 다른 영역에 대기 인스턴스를 둔다.',
      '매시간 자동 백업을 수행하고 장애 시 새 영역에 백업을 복원한다.',
      '다른 리전에 교차 리전 읽기 복제본을 만들고 애플리케이션에서 두 연결 문자열을 번갈아 사용한다.',
    ],
    answer: [1],
    explanations: [
      '읽기 복제본은 비동기 복제라 승격 시 최근 트랜잭션이 유실될 수 있고, 수동 승격은 자동 복구 요구사항에 맞지 않는다. 승격 후 연결 대상도 바뀐다.',
      'Cloud SQL HA 구성은 기본 인스턴스와 다른 영역의 대기 인스턴스가 리전 영구 디스크에 동기식으로 쓰기 때문에 커밋된 데이터 손실 없이 자동 장애 조치된다. 장애 조치 후에도 같은 IP를 유지하므로 코드 변경이 필요 없다.',
      '백업 복원은 복구 시간이 길고 마지막 백업 이후 데이터가 손실되므로 RPO≈0을 만족하지 못한다.',
      '교차 리전 복제본은 리전 DR용이며 비동기 복제다. 두 연결 문자열을 번갈아 쓰면 쓰기가 읽기 전용 복제본으로 가서 실패한다.',
    ],
    principle:
      '영역 장애 + RPO≈0 + 자동 전환은 Cloud SQL HA(리전 인스턴스). 리전 장애 대비는 여기에 교차 리전 복제본(비동기)을 더하는 별도 설계다.',
    refs: [
      { title: 'Cloud SQL for MySQL 고가용성 개요', url: 'https://docs.cloud.google.com/sql/docs/mysql/high-availability' },
    ],
  },
  {
    id: 'c01-06',
    chapter: 1,
    domain: 1,
    topic: '대용량 데이터 마이그레이션',
    question:
      '방송사가 온프레미스 NAS에 있는 약 300TB의 영상 아카이브를 3주 안에 Cloud Storage로 옮겨야 한다. 데이터센터의 인터넷 회선은 200Mbps이며 업무 트래픽과 공유한다. 전용 회선을 추가할 예산과 시간은 없다. 가장 적합한 방법은?',
    options: [
      'gcloud storage cp 명령을 병렬 옵션으로 실행해 인터넷 회선으로 업로드한다.',
      'Storage Transfer Service의 에이전트 기반 전송을 구성해 인터넷 회선으로 전송한다.',
      'Transfer Appliance를 주문해 데이터를 복사한 뒤 Google로 배송한다.',
      'Partner Interconnect를 신청해 연결이 개통되면 전송한다.',
    ],
    answer: [2],
    explanations: [
      '200Mbps를 전부 써도 초당 약 25MB이므로 300TB 전송에는 이론상 약 140일이 걸린다. 병렬화로도 회선 대역폭 한계를 넘을 수 없다.',
      'Storage Transfer Service는 관리형 전송과 재시도를 제공하지만 결국 같은 200Mbps 회선을 사용하므로 기간 요구사항을 맞출 수 없다.',
      'Transfer Appliance는 네트워크 대역폭이 부족할 때 대용량 데이터를 물리 장비로 오프라인 전송하는 서비스로, 수백 TB를 몇 주 단위로 옮기는 이 상황에 맞다.',
      'Interconnect는 개통까지 시간이 걸리고 추가 예산이 필요하다는 제약에 어긋난다. 이 제약에서는 오프라인 전송이 현실적이다.',
    ],
    principle:
      '전송 시간 ≈ 데이터 크기 ÷ 실제 가용 대역폭. 계산 결과가 기한을 넘으면 Transfer Appliance 같은 오프라인 전송을 선택한다.',
    refs: [
      { title: '대규모 데이터 세트 전송 옵션', url: 'https://docs.cloud.google.com/architecture/migration-to-google-cloud-transferring-your-large-datasets' },
      { title: 'Transfer Appliance 개요', url: 'https://docs.cloud.google.com/transfer-appliance/docs/4.0/overview' },
    ],
  },
  {
    id: 'c01-07',
    chapter: 1,
    domain: 1,
    topic: '라이선스(BYOL)와 단독 테넌트',
    question:
      '제조사가 Windows Server 기반 SQL Server 워크로드를 Compute Engine으로 이전하려 한다. 이미 보유한 영구 라이선스를 재사용(BYOL)해 비용을 줄이고 싶지만, 라이선스 약관상 물리 코어 단위로 전용 하드웨어에서만 사용할 수 있다. 어떤 방식으로 VM을 배치해야 하는가?',
    options: [
      '라이선스가 포함된 프리미엄 공개 이미지로 일반 VM을 만든다.',
      '단독 테넌트 노드에 VM을 배치하고, 가져온 이미지로 BYOL 라이선스를 적용한다.',
      'Spot VM으로 실행해 라이선스 비용을 상쇄한다.',
      'GKE Autopilot에 Windows 컨테이너로 배포한다.',
    ],
    answer: [1],
    explanations: [
      '라이선스 포함 이미지는 사용량 기반으로 라이선스 비용이 청구되므로 기존 라이선스 재사용이라는 목적과 맞지 않는다.',
      '단독 테넌트 노드는 한 고객 전용 물리 서버를 제공하므로, 물리 코어 기준 전용 하드웨어를 요구하는 BYOL 약관을 충족할 수 있다. 서버 단위 배치 제어와 코어 수 보고도 가능하다.',
      'Spot VM은 공유 하드웨어이고 언제든 선점될 수 있어 라이선스 조건과 데이터베이스 안정성 요구 모두에 맞지 않는다.',
      '컨테이너 전환은 요구사항에 없는 재설계이며, 공유 하드웨어라는 라이선스 문제도 해결하지 못한다.',
    ],
    principle:
      '“전용 물리 하드웨어”가 필요한 BYOL 라이선스는 단독 테넌트 노드로 해결한다. 마이그레이션 계획에는 라이선스 조건과 재무 영향 검토가 반드시 포함되어야 한다.',
    refs: [
      { title: '단독 테넌트 노드 개요', url: 'https://docs.cloud.google.com/compute/docs/nodes/sole-tenant-nodes' },
      { title: 'BYOL(자체 라이선스 사용)', url: 'https://docs.cloud.google.com/compute/docs/nodes/bringing-your-own-licenses' },
    ],
  },
  {
    id: 'c01-08',
    chapter: 1,
    domain: 1,
    topic: 'Spot VM을 활용한 배치 비용 최적화',
    question:
      '애니메이션 스튜디오가 매일 밤 수천 개의 프레임을 렌더링한다. 각 프레임은 독립적으로 처리되며 실패하면 재시도하면 된다. 작업은 다음 날 아침까지만 끝나면 되고, 비용을 최대한 줄이는 것이 최우선이다. 어떤 컴퓨팅 구성이 가장 적합한가?',
    options: [
      '표준 VM으로 구성한 MIG에 3년 약정 사용 할인(CUD)을 적용한다.',
      'Spot VM으로 구성한 MIG에서 작업 큐를 가져와 처리하고, 선점된 작업은 큐로 되돌려 재시도한다.',
      '대형 메모리 최적화 VM 한 대에서 모든 프레임을 순차 처리한다.',
      '단독 테넌트 노드에 렌더링 VM을 배치한다.',
    ],
    answer: [1],
    explanations: [
      '3년 CUD는 상시 가동되는 안정적 기준 부하에 적합하다. 밤에만 도는 배치에 약정하면 낮 시간 약정분이 낭비된다.',
      'Spot VM은 표준 VM보다 크게 할인되지만 언제든 선점될 수 있다. 프레임이 독립적이고 재시도가 가능하며 기한에 여유가 있으므로, 큐 기반 처리와 결합하면 선점 영향을 흡수하면서 비용을 최소화할 수 있다.',
      '단일 VM 순차 처리는 병렬성이 없어 기한을 맞추기 어렵고, 비용 이점도 없다.',
      '단독 테넌트 노드는 규정·라이선스용 전용 하드웨어로 오히려 비용이 늘어난다.',
    ],
    principle:
      '내결함성 있고 재시작 가능한 배치 작업은 Spot VM의 대표 사용 사례다. 선점을 전제로 체크포인트나 작업 큐를 설계한다.',
    refs: [
      { title: 'Spot VM', url: 'https://docs.cloud.google.com/compute/docs/instances/spot' },
    ],
  },
  {
    id: 'c01-09',
    chapter: 1,
    domain: 1,
    topic: '하이브리드 연결(Dedicated Interconnect SLA)',
    question:
      '금융사가 온프레미스 데이터센터와 Google Cloud 간에 20Gbps 이상의 사설 연결이 필요하다. 트래픽이 공용 인터넷을 거치면 안 되고, 연결 계층에 99.99% 가용성이 요구된다. 회사는 Google 코로케이션 시설 두 곳(서로 다른 대도시 권역)에 장비를 둘 수 있다. 권장 토폴로지는?',
    options: [
      '한 대도시 권역에 Dedicated Interconnect 연결 2개를 서로 다른 에지 가용성 도메인에 두고 Cloud Router 1개를 사용한다.',
      '두 대도시 권역에 각각 Dedicated Interconnect 연결 2개(총 4개)를 두고, 두 리전에 Cloud Router를 배치한다.',
      'HA VPN 터널 4개를 구성하고 BGP로 경로를 교환한다.',
      '단일 Dedicated Interconnect 연결에 VLAN 연결을 여러 개 만든다.',
    ],
    answer: [1],
    explanations: [
      '한 대도시 권역에 연결 2개를 두는 구성은 99.9% 토폴로지에 해당한다. 해당 권역 전체 장애를 견디지 못한다.',
      '99.99% 토폴로지는 두 대도시 권역에 각각 2개씩, 총 4개의 연결을 서로 다른 에지 가용성 도메인에 두고 두 리전의 Cloud Router로 BGP를 구성하는 것이다. 대역폭과 비공개 경로 요구사항도 함께 만족한다.',
      'HA VPN은 암호화된 공용 인터넷 경로를 사용하므로 인터넷을 거치지 말라는 요구사항에 어긋나고, 고대역폭 요구에도 불리하다.',
      '단일 물리 연결은 VLAN을 여러 개 만들어도 단일 장애 지점이다.',
    ],
    principle:
      'Interconnect SLA는 토폴로지로 결정된다: 99.9%는 한 권역 2개 연결, 99.99%는 두 권역 4개 연결 + 두 리전 Cloud Router.',
    refs: [
      { title: 'Dedicated Interconnect 99.99% 가용성 토폴로지', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/tutorials/dedicated-creating-9999-availability' },
      { title: 'Cloud Interconnect 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/overview' },
    ],
  },
  {
    id: 'c01-10',
    chapter: 1,
    domain: 1,
    topic: '워크로드 처분 전략(Build/Buy)',
    question:
      '유통 회사가 데이터센터 철수를 위해 120개 애플리케이션을 분류하고 있다. 그중 사내에서 10년 전 자체 개발한 근태 관리 시스템은 소스 코드 담당자가 퇴사했고, 기능은 업계 표준 수준이며, 시장의 SaaS 제품이 요구사항을 모두 충족한다. 이 애플리케이션에 가장 적합한 처분 전략은?',
    options: [
      'Compute Engine으로 그대로 옮긴다(리호스트).',
      '컨테이너화해 GKE로 옮긴 후 점진적으로 리팩터링한다.',
      '요구사항을 충족하는 SaaS로 대체하고, 기존 데이터를 이관한 뒤 시스템을 폐기한다.',
      '클라우드 네이티브 아키텍처로 전면 재개발한다.',
    ],
    answer: [2],
    explanations: [
      '리호스트는 빠르지만 유지보수 인력이 없는 레거시를 그대로 떠안아 기술 부채가 계속된다. 차별화 요소가 없는 시스템에 운영 비용을 계속 쓰게 된다.',
      '리팩터링은 코드를 이해하는 인력이 필요한데 담당자가 없고, 표준 기능에 개발 투자를 하는 것은 비효율적이다.',
      '비즈니스 차별화 요소가 없는 표준 기능이고 SaaS가 요구사항을 모두 충족하므로 구매(대체)가 총비용과 위험을 가장 낮춘다. 데이터 이관 후 폐기하면 운영 부담도 사라진다.',
      '전면 재개발은 비용과 기간이 가장 크며, 차별화가 없는 기능에는 투자 대비 효과가 낮다.',
    ],
    principle:
      '워크로드 처분(재호스트·리플랫폼·리팩터·교체·폐기)은 비즈니스 차별화와 총소유비용으로 판단한다. 차별화가 없고 SaaS가 충족하면 교체(Buy)가 우선이다.',
    refs: [
      { title: 'Google Cloud로 마이그레이션: 시작하기', url: 'https://docs.cloud.google.com/architecture/migration-to-gcp-getting-started' },
    ],
  },
  {
    id: 'c01-11',
    chapter: 1,
    domain: 1,
    topic: '스트리밍 데이터 처리',
    question:
      '전자상거래 기업이 웹·앱 클릭스트림을 실시간으로 수집해 1분 단위 매출·전환 지표를 BigQuery 대시보드에 반영하려 한다. 이벤트는 네트워크 지연으로 늦게 도착하기도 하며, 중복 집계 없이 정확한 결과가 필요하다. 트래픽은 시간대별로 10배 이상 차이가 나고, 서버 관리를 원하지 않는다. 어떤 파이프라인이 가장 적합한가?',
    options: [
      'Pub/Sub로 이벤트를 받고 Dataflow 스트리밍 파이프라인에서 이벤트 시간 기반 윈도와 워터마크로 집계해 BigQuery에 쓴다.',
      '이벤트를 Cloud Storage에 파일로 저장하고 매시간 Dataproc 클러스터에서 Spark 배치 작업을 실행한다.',
      '애플리케이션이 Cloud SQL에 직접 쓰고, 1분마다 Cloud Scheduler가 집계 쿼리를 실행한다.',
      'Compute Engine VM에 Kafka와 자체 집계 서비스를 설치해 운영한다.',
    ],
    answer: [0],
    explanations: [
      'Pub/Sub는 트래픽 급증을 흡수하는 관리형 메시징이고, Dataflow(Apache Beam)는 자동 확장·이벤트 시간 윈도·워터마크로 늦게 도착한 데이터를 처리하며 정확히 한 번 처리를 지원한다. 모두 서버리스라 운영 부담이 적다.',
      '매시간 배치는 1분 단위 실시간 요구사항을 충족하지 못하고, 클러스터 관리도 필요하다.',
      'Cloud SQL은 대량 이벤트 수집과 분석 집계에 적합하지 않으며 확장성 한계가 있다. 늦게 도착한 이벤트 처리 로직도 직접 구현해야 한다.',
      '자체 운영 Kafka는 서버 관리를 원하지 않는다는 요구사항에 어긋난다.',
    ],
    principle:
      '실시간 수집(Pub/Sub) → 스트림 처리(Dataflow) → 분석(BigQuery)은 서버리스 스트리밍 분석의 표준 패턴이다. 늦은 데이터는 이벤트 시간 윈도와 워터마크로 다룬다.',
    refs: [
      { title: 'Dataflow 스트리밍 파이프라인', url: 'https://docs.cloud.google.com/dataflow/docs/concepts/streaming-pipelines' },
      { title: 'Pub/Sub 개요', url: 'https://docs.cloud.google.com/pubsub/docs/overview' },
    ],
  },
  {
    id: 'c01-12',
    chapter: 1,
    domain: 1,
    topic: '생성형 AI(사내 문서 검색·RAG)',
    question:
      '보험사가 약관·상품 설명서·내부 지침 등 수만 건의 문서를 바탕으로 상담원이 자연어로 질문하고 근거 문서 인용과 함께 답을 받는 도구를 만들려 한다. 사내에 ML 엔지니어가 거의 없고, 3개월 안에 출시해야 하며, 문서는 매주 갱신된다. 어떤 접근이 가장 적합한가?',
    options: [
      '오픈 소스 LLM을 GPU VM에서 전체 문서로 처음부터 사전 학습한다.',
      'Gemini Enterprise Agent Platform(구 Vertex AI)의 Agent Search(구 Vertex AI Search)로 문서를 인덱싱하고, 검색 결과에 근거(grounding)한 답변과 인용을 생성한다.',
      '문서를 모두 프롬프트에 붙여 넣는 방식으로 매 질문마다 모델을 호출한다.',
      '문서마다 질문-답변 쌍을 수작업으로 만들어 규칙 기반 챗봇을 구현한다.',
    ],
    answer: [1],
    explanations: [
      '처음부터 사전 학습하는 것은 막대한 비용·데이터·전문 인력이 필요하며, 문서가 매주 바뀔 때마다 재학습해야 해서 요구사항과 정반대다.',
      '관리형 검색 증강 생성(RAG) 서비스는 문서 수집·인덱싱·검색·근거 기반 답변과 인용을 제공하므로 ML 인력이 적어도 빠르게 구축할 수 있고, 문서 갱신은 재인덱싱으로 반영된다.',
      '수만 건 문서를 매번 프롬프트에 넣으면 컨텍스트 한도와 비용·지연 문제가 생기며, 관련 문서만 찾아 넣는 검색 계층이 필요하다.',
      '수작업 규칙 기반 챗봇은 유지보수가 어렵고, 문서가 매주 바뀌는 환경에서 확장되지 않는다.',
    ],
    principle:
      '사내 지식 기반 질의응답은 모델 재학습이 아니라 검색 증강 생성(RAG)과 그라운딩으로 푼다. ML 역량이 적을수록 관리형 검색·에이전트 서비스를 우선 검토한다.',
    refs: [
      { title: 'Gemini Enterprise Agent Platform 명칭 변경', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes' },
      { title: 'Google Cloud 생성형 AI RAG 아키텍처', url: 'https://docs.cloud.google.com/architecture/rag-capable-gen-ai-app-using-vertex-ai' },
    ],
  },
  {
    id: 'c01-13',
    chapter: 1,
    domain: 1,
    topic: '성공 지표(KPI)',
    question:
      '여행 예약 회사의 경영진은 클라우드 이전의 목표를 “결제 페이지 체감 속도 개선”과 “예약 건당 인프라 비용 절감”으로 정했다. 프로젝트의 성공 여부를 판단할 지표로 가장 적절한 것은? (2개 선택)',
    options: [
      '결제 페이지 요청의 95번째 백분위수(p95) 응답 시간',
      '이전 완료한 가상 머신 수',
      '월 인프라 비용을 월 예약 건수로 나눈 예약 건당 인프라 비용',
      '작성된 Terraform 모듈 수',
      '클라우드 콘솔에 로그인한 엔지니어 수',
    ],
    answer: [0, 2],
    explanations: [
      '백분위수 응답 시간은 사용자가 실제로 체감하는 지연을 반영하며, 평균보다 느린 요청 꼬리를 드러내 “체감 속도 개선” 목표를 직접 측정한다.',
      '이전한 VM 수는 진행 상황을 보여 주는 활동 지표일 뿐, 속도나 비용이라는 비즈니스 결과를 나타내지 않는다.',
      '예약 건당 비용은 트래픽 증감과 무관하게 효율을 비교할 수 있는 단위 경제성 지표로, “예약 건당 인프라 비용 절감” 목표와 정확히 대응한다.',
      'Terraform 모듈 수는 엔지니어링 산출물의 양일 뿐 비즈니스 결과와 무관하다.',
      '콘솔 로그인 수는 도입 활동을 보여 줄 뿐 목표 달성 여부와 관계가 없다.',
    ],
    principle:
      'KPI는 활동(무엇을 했는가)이 아니라 결과(비즈니스 목표가 달성되었는가)를 측정해야 한다. 비용은 절대액보다 단위당 비용으로 추적한다.',
    refs: [
      { title: 'Well-Architected Framework: 비용 최적화', url: 'https://docs.cloud.google.com/architecture/framework/cost-optimization' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (9) ─────────
  {
    id: 'c01-14',
    chapter: 1,
    domain: 2,
    topic: 'Cloud NAT',
    question:
      '보안 정책상 모든 Compute Engine VM에는 외부 IP를 부여할 수 없다. 그런데 VM들이 인터넷의 OS 패키지 저장소와 외부 SaaS API로 아웃바운드 연결을 해야 한다. 외부에서 VM으로 들어오는 연결은 허용되면 안 되며, 관리형 서비스를 선호한다. 어떻게 구성해야 하는가?',
    options: [
      '해당 리전에 Cloud Router와 Cloud NAT 게이트웨이를 구성한다.',
      '서브넷에 비공개 Google 액세스를 사용 설정한다.',
      '외부 IP를 가진 NAT 인스턴스 VM을 직접 만들고 기본 경로를 그 VM으로 지정한다.',
      '각 VM에 임시 외부 IP를 부여하고 방화벽으로 인그레스를 모두 거부한다.',
    ],
    answer: [0],
    explanations: [
      'Cloud NAT는 외부 IP 없는 VM의 아웃바운드 인터넷 연결을 제공하는 관리형 서비스이며, 외부에서 시작된 인바운드 연결은 허용하지 않는다. 요구사항을 정확히 충족한다.',
      '비공개 Google 액세스는 Google API·서비스로의 접근만 제공하며, 일반 인터넷의 패키지 저장소나 외부 SaaS에는 연결할 수 없다.',
      'NAT 인스턴스 직접 운영은 가용성·확장·패치 부담이 생기며 관리형 서비스를 선호한다는 요구와 맞지 않는다.',
      '외부 IP를 부여하는 것 자체가 보안 정책 위반이다.',
    ],
    principle:
      '외부 IP 없는 리소스의 “아웃바운드 인터넷”은 Cloud NAT, “Google API 접근”은 비공개 Google 액세스로 구분한다.',
    refs: [
      { title: 'Cloud NAT 개요', url: 'https://docs.cloud.google.com/nat/docs/overview' },
    ],
  },
  {
    id: 'c01-15',
    chapter: 1,
    domain: 2,
    topic: '비공개 Google 액세스',
    question:
      '데이터 처리 VM들은 외부 IP 없이 사설 서브넷에서 실행되며, 인터넷 연결은 금지되어 있다. 이 VM들이 Cloud Storage 버킷과 BigQuery API를 호출해야 한다. 추가 비용과 구성 요소를 최소화하려면 무엇을 해야 하는가?',
    options: [
      '서브넷에 Cloud NAT를 구성한다.',
      'VM이 있는 서브넷에서 비공개 Google 액세스를 사용 설정한다.',
      '각 VM에 외부 IP를 부여하고 방화벽으로 Google IP 범위만 허용한다.',
      'Cloud Storage와 BigQuery 앞에 내부 부하 분산기를 둔다.',
    ],
    answer: [1],
    explanations: [
      'Cloud NAT는 인터넷 아웃바운드를 허용하므로 인터넷 연결 금지 정책과 충돌하고, 추가 구성 요소와 비용이 생긴다.',
      '비공개 Google 액세스를 켜면 외부 IP가 없는 VM도 Google의 API·서비스(Cloud Storage, BigQuery 등)에 접근할 수 있다. 서브넷 설정 하나로 해결되며 인터넷 경로를 열지 않는다.',
      '외부 IP 부여는 정책 위반이고 공격 표면을 늘린다.',
      'Google 관리형 API 앞에 내부 부하 분산기를 둘 수는 없다. 이 문제는 서브넷 수준 설정으로 해결한다.',
    ],
    principle:
      'Google API 접근만 필요하면 인터넷 경로 없이 비공개 Google 액세스를 쓴다. 더 세밀한 제어가 필요하면 Private Service Connect 엔드포인트를 검토한다.',
    refs: [
      { title: '비공개 Google 액세스', url: 'https://docs.cloud.google.com/vpc/docs/private-google-access' },
    ],
  },
  {
    id: 'c01-16',
    chapter: 1,
    domain: 2,
    topic: 'Cloud Storage 수명 주기',
    question:
      '보안 감사 로그 파일을 Cloud Storage에 저장한다. 로그는 생성 후 30일 동안 조사 목적으로 자주 조회되고, 그 뒤로는 분기에 한 번 미만으로 조회된다. 규정상 1년간 보관 후 삭제해야 한다. 운영 부담 없이 비용을 최적화하려면?',
    options: [
      '모든 로그를 Archive 클래스로 업로드하고 1년 뒤 수동 삭제한다.',
      'Standard 클래스로 저장하고, 수명 주기 규칙으로 30일 후 Coldline으로 변경, 365일 후 삭제한다.',
      'Nearline으로 업로드하고, 매주 스크립트로 오래된 객체를 찾아 삭제한다.',
      'Standard 클래스로 저장하고 객체 버전 관리를 사용 설정한다.',
    ],
    answer: [1],
    explanations: [
      'Archive는 조회 비용이 높고 최소 보관 기간이 길어 처음 30일간 잦은 조회에 부적합하며, 수동 삭제는 운영 부담과 누락 위험이 있다.',
      '자주 조회되는 초기에는 Standard, 분기 1회 미만 조회 구간은 Coldline이 비용 효율적이다. 수명 주기 규칙이 클래스 변경과 365일 삭제를 자동화해 운영 부담이 없다.',
      'Nearline은 처음 30일간 잦은 조회 시 검색 비용이 발생하고, 스크립트 운영은 불필요한 부담이다.',
      '버전 관리는 덮어쓰기·삭제 복구용이며 비용 최적화나 보관 기간 관리와 무관하다. 오히려 저장 비용이 늘어날 수 있다.',
    ],
    principle:
      '접근 빈도가 시간에 따라 예측 가능하게 줄면 수명 주기 규칙(SetStorageClass + Delete)을, 접근 패턴을 예측하기 어려우면 Autoclass를 검토한다.',
    refs: [
      { title: '객체 수명 주기 관리', url: 'https://docs.cloud.google.com/storage/docs/lifecycle' },
      { title: '스토리지 클래스', url: 'https://docs.cloud.google.com/storage/docs/storage-classes' },
    ],
  },
  {
    id: 'c01-17',
    chapter: 1,
    domain: 2,
    topic: 'MIG 자동 복구',
    question:
      '관리형 인스턴스 그룹(MIG)에서 실행되는 웹 애플리케이션이 가끔 메모리 누수로 멈춘다. VM 자체는 RUNNING 상태로 남아 있어 부하 분산기는 해당 VM으로 트래픽을 보내지 않지만, 문제 VM이 계속 남아 용량이 줄어든다. 사람의 개입 없이 문제 VM을 교체하려면 어떻게 해야 하는가?',
    options: [
      'MIG에 애플리케이션 상태 확인 기반 자동 복구(autohealing)를 구성한다.',
      '자동 확장의 최소 인스턴스 수를 늘린다.',
      'Cloud Monitoring 알림으로 운영자에게 이메일을 보내 수동으로 재시작하게 한다.',
      'VM 호스트 유지보수 정책을 “실시간 이전”으로 변경한다.',
    ],
    answer: [0],
    explanations: [
      '자동 복구는 애플리케이션 수준 상태 확인에 실패한 인스턴스를 자동으로 다시 만든다. VM이 RUNNING이어도 앱이 응답하지 않으면 교체되므로 요구사항에 맞다.',
      '최소 인스턴스 수를 늘려도 멈춘 VM은 그대로 남아 비용만 늘고 근본 문제를 해결하지 못한다.',
      '수동 재시작은 “사람의 개입 없이”라는 요구사항에 어긋난다.',
      '실시간 이전은 Google의 호스트 유지보수 시 VM을 옮기는 정책으로, 애플리케이션 장애와 무관하다.',
    ],
    principle:
      '부하 분산기 상태 확인은 트래픽 라우팅용, MIG 자동 복구 상태 확인은 인스턴스 재생성용이다. 복구용 상태 확인은 일시적 지연에 과민하지 않도록 더 느슨하게 설정한다.',
    refs: [
      { title: 'MIG 자동 복구 설정', url: 'https://docs.cloud.google.com/compute/docs/instance-groups/autohealing-instances-in-migs' },
    ],
  },
  {
    id: 'c01-18',
    chapter: 1,
    domain: 2,
    topic: 'GKE 노드 풀과 Spot VM',
    question:
      'GKE Standard 클러스터에서 웹 API(항상 가용해야 함)와 야간 데이터 변환 배치 작업(중단되면 재시작 가능)을 함께 운영한다. 배치 작업 비용을 줄이되 웹 API의 가용성에는 영향을 주지 않으려면 어떻게 구성해야 하는가?',
    options: [
      '클러스터의 모든 노드 풀을 Spot VM으로 바꾼다.',
      'Spot VM 노드 풀을 추가하고, 배치 파드에만 해당 노드 풀을 선택하는 노드 셀렉터와 톨러레이션을 지정한다. 웹 API는 표준 노드 풀에 둔다.',
      '배치 작업을 웹 API와 같은 노드 풀에서 실행하되 우선순위를 낮춘다.',
      '배치 작업용으로 별도 GKE 클러스터를 만들고 3년 약정 사용 할인을 적용한다.',
    ],
    answer: [1],
    explanations: [
      '모든 노드를 Spot으로 바꾸면 웹 API 파드도 선점될 수 있어 가용성 요구사항을 위반한다.',
      '워크로드 특성별로 노드 풀을 분리하고, Spot 노드 풀에 테인트를 두어 톨러레이션이 있는 배치 파드만 배치되게 하면 비용 절감과 웹 API 안정성을 동시에 달성한다.',
      '같은 노드 풀에서 우선순위만 낮추면 할인 혜택이 없고, 배치가 웹 API와 자원을 경쟁한다.',
      '밤에만 도는 배치에 3년 약정은 비효율적이며, 별도 클러스터는 관리 부담도 늘린다.',
    ],
    principle:
      'GKE에서는 노드 풀 단위로 비용·가용성 특성을 나누고, 테인트/톨러레이션과 노드 셀렉터로 워크로드를 배치한다.',
    refs: [
      { title: 'GKE의 Spot VM', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/spot-vms' },
    ],
  },
  {
    id: 'c01-19',
    chapter: 1,
    domain: 2,
    topic: 'Cloud Run의 VPC 연결',
    question:
      'Cloud Run 서비스가 VPC 내부 IP만 가진 Memorystore for Redis 인스턴스와 내부 전용 API(내부 부하 분산기 뒤)에 접근해야 한다. 공용 인터넷으로 트래픽이 나가면 안 된다. 어떻게 구성해야 하는가?',
    options: [
      'Memorystore에 외부 IP를 부여하고 Cloud Run의 아웃바운드 IP만 허용한다.',
      'Cloud Run 서비스에 Direct VPC 이그레스(또는 서버리스 VPC 액세스 커넥터)를 구성해 VPC의 사설 IP로 트래픽을 보낸다.',
      'Cloud Run 대신 App Engine 표준 환경으로 이전한다.',
      'Cloud Run 서비스에 IAP를 사용 설정한다.',
    ],
    answer: [1],
    explanations: [
      'Memorystore는 VPC 내부에서 접근하도록 설계되었고, 외부 노출은 보안 요구사항에 어긋난다.',
      'Direct VPC 이그레스나 서버리스 VPC 액세스 커넥터를 쓰면 Cloud Run의 아웃바운드 트래픽이 VPC로 들어가 사설 IP 리소스에 접근할 수 있다. 인터넷을 거치지 않는다.',
      'App Engine으로 바꿔도 VPC 연결 설정은 여전히 필요하며, 플랫폼 교체는 불필요한 재작업이다.',
      'IAP는 사용자의 인바운드 접근 제어 기능으로, Cloud Run에서 VPC 리소스로 나가는 트래픽과 무관하다.',
    ],
    principle:
      '서버리스(Cloud Run·Cloud Run functions)에서 VPC 사설 리소스로 나갈 때는 Direct VPC 이그레스나 서버리스 VPC 액세스 커넥터를 쓴다. 인바운드 제어는 인그레스 설정과 IAP로 별도 관리한다.',
    refs: [
      { title: 'Cloud Run: Direct VPC 이그레스', url: 'https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc' },
    ],
  },
  {
    id: 'c01-20',
    chapter: 1,
    domain: 2,
    topic: 'Cloud SQL 교차 리전 DR',
    question:
      '전자상거래 주문 DB(Cloud SQL for PostgreSQL, 고가용성 구성)가 us-central1에 있다. 새로운 요구사항은 리전 전체 장애 시 1시간 이내에 다른 리전에서 서비스를 재개하는 것이며, 수 분 정도의 데이터 손실은 허용된다. 비용과 복잡도를 낮게 유지하려면?',
    options: [
      '다른 리전에 교차 리전 읽기 복제본을 만들고, 리전 장애 시 복제본을 승격해 애플리케이션 연결을 전환하는 런북을 준비한다.',
      'Spanner로 데이터베이스를 이전한다.',
      '매일 백업을 다른 리전 버킷으로 내보내 두었다가 장애 시 새 인스턴스에 가져온다.',
      '두 리전에 독립 Cloud SQL 인스턴스를 두고 애플리케이션이 양쪽에 동시에 쓰게 한다.',
    ],
    answer: [0],
    explanations: [
      '교차 리전 읽기 복제본은 비동기로 거의 최신 상태를 유지하므로 수 분 수준의 RPO와 1시간 이내 RTO를 충족한다. 승격과 연결 전환 절차를 런북으로 준비해 두면 비용과 복잡도가 낮다.',
      'Spanner 이전은 스키마·애플리케이션 변경이 커서 비용과 복잡도를 낮게 유지하라는 요구에 맞지 않는다. 요구 RPO도 그 정도 수준을 필요로 하지 않는다.',
      '일일 백업은 최대 24시간 데이터 손실이 가능해 RPO를 충족하지 못하고, 대용량 가져오기는 RTO도 위협한다.',
      '애플리케이션 이중 쓰기는 일관성 문제와 복잡도를 크게 키운다.',
    ],
    principle:
      'RPO·RTO를 먼저 숫자로 정하고, 이를 만족하는 가장 단순한 방법을 고른다. 분 단위 RPO의 리전 DR에는 교차 리전 복제본 승격이 비용 효율적이다.',
    refs: [
      { title: 'Cloud SQL 교차 리전 복제본', url: 'https://docs.cloud.google.com/sql/docs/postgres/replication/cross-region-replicas' },
      { title: '재해 복구 계획 가이드', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
    ],
  },
  {
    id: 'c01-21',
    chapter: 1,
    domain: 2,
    topic: 'ML 파이프라인 자동화',
    question:
      '수요 예측 모델을 데이터 과학자가 노트북에서 수동으로 학습·평가·배포하고 있어, 누가 어떤 데이터로 어떤 모델을 배포했는지 추적되지 않는다. 매주 새 데이터로 재학습하고, 평가 지표가 기준을 넘을 때만 배포하며, 실행 이력과 아티팩트 계보를 남기고 싶다. 어떤 방법이 가장 적합한가?',
    options: [
      '노트북을 Cloud Scheduler로 매주 실행하는 cron 작업으로 등록한다.',
      'Gemini Enterprise Agent Platform Pipelines(구 Vertex AI Pipelines)로 데이터 준비·학습·평가·조건부 배포 단계를 파이프라인으로 정의하고 일정에 따라 실행한다.',
      '학습 코드를 Compute Engine VM에 두고 셸 스크립트로 순차 실행한다.',
      '데이터 과학자가 매주 결과를 스프레드시트에 기록하도록 절차를 만든다.',
    ],
    answer: [1],
    explanations: [
      '노트북 cron 실행은 단계별 재시도, 조건부 배포, 아티팩트 계보 추적 기능이 없어 재현성과 감사 요구를 충족하지 못한다.',
      '관리형 ML 파이프라인은 각 단계를 컴포넌트로 정의하고, 평가 결과에 따른 조건부 배포, 실행 이력과 메타데이터·계보 추적, 일정 실행을 제공해 MLOps 요구사항을 충족한다.',
      '셸 스크립트는 오류 처리·추적·재현성이 부족하며 운영 부담이 크다.',
      '수작업 기록은 누락과 오류가 생기기 쉽고 자동화 요구사항과 반대다.',
    ],
    principle:
      'ML 수명 주기 자동화는 단계별 파이프라인 + 조건부 배포 + 메타데이터·계보 추적으로 재현성과 거버넌스를 확보한다.',
    refs: [
      { title: 'Gemini Enterprise Agent Platform 명칭 변경(Pipelines 포함)', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes' },
      { title: 'MLOps: 머신러닝의 지속적 제공과 자동화 파이프라인', url: 'https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning' },
    ],
  },
  {
    id: 'c01-22',
    chapter: 1,
    domain: 2,
    topic: '사전 학습 AI API 선택(문서 처리)',
    question:
      '회계 부서가 매달 수만 건의 공급업체 청구서(PDF·스캔 이미지)를 받는다. 공급업체마다 양식이 다르며, 청구서 번호·금액·공급업체명·지급 기한 같은 필드를 구조화된 데이터로 추출해 ERP에 넣으려 한다. 자체 모델 학습 없이 가장 빠르게 구현하려면?',
    options: [
      'Cloud Vision API의 OCR로 텍스트만 추출한 뒤 정규식으로 필드를 파싱한다.',
      'Document AI의 청구서 처리용 사전 학습 프로세서로 필드를 추출한다.',
      'Speech-to-Text로 청구서를 읽어 텍스트로 변환한다.',
      'Translation API로 모든 청구서를 한 언어로 번역한 뒤 수작업으로 입력한다.',
    ],
    answer: [1],
    explanations: [
      'OCR은 텍스트만 제공하므로 양식이 제각각인 청구서에서 정규식으로 필드를 뽑는 로직은 깨지기 쉽고 유지보수가 어렵다.',
      'Document AI는 청구서 같은 문서 유형에 특화된 사전 학습 프로세서로 양식이 달라도 키-값 필드를 구조화해 추출한다. 자체 학습 없이 빠르게 적용할 수 있다.',
      'Speech-to-Text는 음성 인식용이며 문서 처리와 무관하다.',
      '번역 후 수작업 입력은 자동화 목적에 어긋난다.',
    ],
    principle:
      '문서에서 구조화된 필드를 뽑는 문제는 범용 OCR보다 문서 유형별 사전 학습 프로세서(Document AI)가 적합하다. 사전 학습 API로 충분하면 맞춤 모델 학습을 피한다.',
    refs: [
      { title: 'Document AI 개요', url: 'https://docs.cloud.google.com/document-ai/docs/overview' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (9) ─────────
  {
    id: 'c01-23',
    chapter: 1,
    domain: 3,
    topic: 'IAM 최소 권한과 그룹',
    question:
      '데이터 분석팀 40명이 분석 프로젝트의 BigQuery 데이터 세트를 조회하고 쿼리 작업을 실행해야 한다. 팀원은 자주 입사·퇴사하며, 보안팀은 최소 권한 원칙과 관리 용이성을 요구한다. 어떻게 권한을 부여해야 하는가?',
    options: [
      '각 사용자에게 프로젝트 수준 편집자(Editor) 역할을 부여한다.',
      'Google 그룹을 만들어 팀원을 관리하고, 그룹에 BigQuery 데이터 뷰어(데이터 세트 수준)와 BigQuery 작업 사용자(프로젝트 수준) 역할을 부여한다.',
      '서비스 계정 하나를 만들어 키를 팀원에게 공유한다.',
      '각 사용자에게 BigQuery 관리자 역할을 조직 수준에서 부여한다.',
    ],
    answer: [1],
    explanations: [
      '편집자 기본 역할은 BigQuery 외에도 프로젝트 대부분의 리소스를 수정할 수 있어 최소 권한 원칙에 어긋난다. 개인별 부여는 관리 부담도 크다.',
      '그룹 기반 부여로 입·퇴사 시 그룹 구성원만 바꾸면 되고, 데이터 조회(데이터 뷰어)와 쿼리 실행(작업 사용자)에 필요한 사전 정의 역할만 필요한 범위에 부여해 최소 권한을 지킨다.',
      '서비스 계정 키 공유는 개인 식별과 감사를 불가능하게 하고 키 유출 위험이 크다.',
      '조직 수준 관리자 역할은 필요 이상으로 넓은 권한이다.',
    ],
    principle:
      '사용자 개인이 아니라 그룹에, 기본 역할이 아니라 사전 정의(또는 커스텀) 역할을, 가능한 가장 좁은 리소스 범위에 부여한다.',
    refs: [
      { title: 'IAM 사용 권장사항', url: 'https://docs.cloud.google.com/iam/docs/using-iam-securely' },
      { title: 'BigQuery IAM 역할', url: 'https://docs.cloud.google.com/bigquery/docs/access-control' },
    ],
  },
  {
    id: 'c01-24',
    chapter: 1,
    domain: 3,
    topic: 'Workload Identity Federation',
    question:
      'AWS의 EC2에서 실행되는 배치 애플리케이션이 매일 Google Cloud의 Cloud Storage 버킷에 결과 파일을 업로드한다. 현재는 서비스 계정 키(JSON)를 EC2 디스크에 저장해 사용하고 있으며, 보안 감사에서 장기 자격 증명 사용이 지적되었다. 가장 적절한 개선 방법은?',
    options: [
      '서비스 계정 키를 90일마다 교체하는 스크립트를 만든다.',
      'Workload Identity Federation으로 AWS를 ID 공급자로 등록하고, AWS 역할이 서비스 계정을 가장(impersonate)해 단기 토큰을 받게 한다.',
      '키 파일을 AWS Secrets Manager에 저장해 암호화한다.',
      '버킷을 공개로 설정하고 서명된 URL을 사용한다.',
    ],
    answer: [1],
    explanations: [
      '키 교체는 위험을 줄일 뿐 장기 자격 증명을 계속 사용한다는 근본 문제를 해결하지 못하고 운영 부담이 생긴다.',
      'Workload Identity Federation은 AWS 등 외부 ID를 신뢰해 서비스 계정 키 없이 단기 액세스 토큰을 발급받게 한다. 장기 키 자체를 없애는 권장 방식이다.',
      '저장 위치를 바꿔 암호화해도 장기 키가 존재한다는 점은 변하지 않는다.',
      '버킷 공개는 심각한 데이터 노출 위험이며 업로드 인증 문제의 해법이 아니다.',
    ],
    principle:
      'Google Cloud 외부 워크로드(다른 클라우드·온프레미스·CI)는 서비스 계정 키 대신 Workload Identity Federation으로 단기 자격 증명을 사용한다.',
    refs: [
      { title: 'Workload Identity Federation', url: 'https://docs.cloud.google.com/iam/docs/workload-identity-federation' },
      { title: '서비스 계정 키 관리 권장사항', url: 'https://docs.cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys' },
    ],
  },
  {
    id: 'c01-25',
    chapter: 1,
    domain: 3,
    topic: '조직 정책: 도메인 제한 공유',
    question:
      '감사 결과, 일부 프로젝트에서 개발자가 개인 Gmail 계정에 IAM 역할을 부여해 회사 데이터에 접근하게 한 사실이 발견되었다. 앞으로 조직 전체에서 회사 Cloud Identity 도메인에 속한 주 구성원에게만 IAM 역할을 부여할 수 있도록 예방하려면?',
    options: [
      '매주 IAM 정책을 스캔해 외부 계정을 찾아 제거하는 스크립트를 실행한다.',
      '조직 수준에서 도메인 제한 공유 조직 정책(허용된 정책 구성원 도메인 제약)에 회사 고객 ID를 설정한다.',
      '모든 프로젝트에서 VPC 서비스 제어 경계를 구성한다.',
      '개발자에게서 프로젝트 IAM 관리자 역할을 제거하고 요청 시 수동으로 부여한다.',
    ],
    answer: [1],
    explanations: [
      '주기적 스캔은 사후 탐지일 뿐 부여 자체를 막지 못해 그 사이 데이터가 노출될 수 있다.',
      '도메인 제한 공유 조직 정책은 지정한 Cloud Identity/Workspace 고객 ID에 속하지 않은 주 구성원에게 IAM 역할을 부여하는 것을 조직 전체에서 예방적으로 차단한다.',
      'VPC 서비스 제어는 API 수준의 데이터 유출 경계를 만들지만, 외부 계정에 IAM 역할을 부여하는 행위 자체를 막는 정책은 아니다.',
      '권한 회수는 운영 병목을 만들고, 권한을 가진 관리자도 여전히 외부 계정에 부여할 수 있다.',
    ],
    principle:
      '“누구도 해서는 안 되는 구성”은 IAM 권한이 아닌 조직 정책 제약으로 조직·폴더 수준에서 예방적으로 막는다.',
    refs: [
      { title: '도메인별 ID 제한', url: 'https://docs.cloud.google.com/organization-policy/restrict-domains' },
    ],
  },
  {
    id: 'c01-26',
    chapter: 1,
    domain: 3,
    topic: 'VPC 서비스 제어(데이터 유출 방지)',
    question:
      '제약사의 임상 데이터가 BigQuery와 Cloud Storage에 있다. 보안팀의 우려는 정상 자격 증명을 가진 내부자나 탈취된 계정이 데이터를 회사 조직 밖의 개인 프로젝트로 복사하는 것이다. IAM 권한은 이미 최소화되어 있다. 이 위험을 가장 효과적으로 줄이는 방법은?',
    options: [
      '모든 데이터 세트와 버킷에 CMEK를 적용한다.',
      '데이터 프로젝트를 VPC 서비스 제어 서비스 경계로 감싸고 BigQuery·Cloud Storage API를 보호 서비스로 지정한다.',
      '방화벽 규칙으로 모든 이그레스를 차단한다.',
      'Cloud Armor 보안 정책을 BigQuery에 연결한다.',
    ],
    answer: [1],
    explanations: [
      'CMEK는 저장 데이터의 키 통제를 제공하지만, 정당한 권한을 가진 사용자가 API로 데이터를 읽어 다른 프로젝트로 복사하는 것은 막지 못한다.',
      'VPC 서비스 제어는 Google 관리형 서비스 API 주위에 경계를 만들어, 유효한 자격 증명이 있어도 경계 밖 프로젝트로의 데이터 복사나 경계 밖에서의 접근을 차단한다. 자격 증명 기반 유출 위험에 대한 대표 통제다.',
      'VPC 방화벽은 VM 네트워크 트래픽을 제어할 뿐, BigQuery 같은 관리형 서비스 간 API 호출(예: 다른 프로젝트로의 복사 작업)을 통제하지 못한다.',
      'Cloud Armor는 외부 부하 분산기 앞단의 WAF·DDoS 보호로 BigQuery API에 연결할 수 없다.',
    ],
    principle:
      'IAM은 “누가”, VPC 서비스 제어는 “어디서/어디로”를 통제한다. 유효한 자격 증명을 이용한 데이터 유출 방지에는 서비스 경계를 쓴다.',
    refs: [
      { title: 'VPC 서비스 제어 개요', url: 'https://docs.cloud.google.com/vpc-service-controls/docs/overview' },
    ],
  },
  {
    id: 'c01-27',
    chapter: 1,
    domain: 3,
    topic: 'CMEK와 직무 분리',
    question:
      '금융 규제에 따라 고객 데이터(Cloud Storage·BigQuery)는 고객 관리 암호화 키(CMEK)로 암호화해야 하고, 키를 관리하는 사람과 데이터를 사용하는 사람의 직무를 분리해야 한다. 이 요구사항을 충족하는 구성은? (2개 선택)',
    options: [
      'Cloud KMS 키를 데이터 프로젝트와 분리된 전용 키 관리 프로젝트에 만든다.',
      '보안팀에는 Cloud KMS 관리자 역할만, 데이터 서비스의 서비스 에이전트에는 해당 키에 대한 암호화/복호화 역할만 부여한다.',
      '개발팀에 데이터 프로젝트 소유자와 Cloud KMS 관리자 역할을 함께 부여해 운영을 단순화한다.',
      '키 재료를 애플리케이션 설정 파일에 저장해 백업한다.',
      '모든 역할을 한 서비스 계정에 모아 감사 로그를 단순화한다.',
    ],
    answer: [0, 1],
    explanations: [
      '키를 별도 프로젝트에 두면 데이터 프로젝트 관리자가 키 IAM을 바꿀 수 없어 관리 경계가 분리된다. 직무 분리의 권장 구성이다.',
      '키 관리 권한(관리자)과 키 사용 권한(암호화/복호화)을 서로 다른 주체에 부여하는 것이 직무 분리의 핵심이다. 데이터 서비스는 서비스 에이전트가 키를 사용한다.',
      '한 팀에 데이터 소유와 키 관리 권한을 모두 주면 직무 분리 요구사항을 정면으로 위반한다.',
      'Cloud KMS 키 재료는 내보낼 수 없으며, 설정 파일 저장은 CMEK 통제 목적 자체를 무너뜨린다.',
      '권한을 한 주체에 모으면 직무 분리가 불가능하고 탈취 시 피해 범위가 커진다.',
    ],
    principle:
      '직무 분리는 “키 관리자 ≠ 키 사용자 ≠ 데이터 관리자”로 역할과 프로젝트 경계를 나누는 것이다. CMEK 키는 전용 프로젝트에 둔다.',
    refs: [
      { title: 'Cloud KMS 직무 분리', url: 'https://docs.cloud.google.com/kms/docs/separation-of-duties' },
      { title: '고객 관리 암호화 키(CMEK)', url: 'https://docs.cloud.google.com/kms/docs/cmek' },
    ],
  },
  {
    id: 'c01-28',
    chapter: 1,
    domain: 3,
    topic: 'IAP(Identity-Aware Proxy)',
    question:
      '사내 관리 웹 앱이 외부 애플리케이션 부하 분산기 뒤의 Compute Engine에서 실행된다. 직원들은 재택 근무 중에도 VPN 없이 접속해야 하며, 회사 ID로 인증된 특정 그룹 구성원만, 그리고 회사가 관리하는 기기에서만 접근을 허용하고 싶다. 가장 적합한 방법은?',
    options: [
      '방화벽 규칙으로 직원들의 가정 IP 주소만 허용한다.',
      '부하 분산기의 백엔드 서비스에 IAP를 사용 설정하고, 그룹에 IAP 보안 웹 앱 사용자 역할을 부여하며, 기기 조건이 포함된 액세스 수준을 적용한다.',
      '앱에 자체 로그인 페이지와 비밀번호 데이터베이스를 구현한다.',
      '모든 직원에게 Cloud VPN 클라이언트를 배포한다.',
    ],
    answer: [1],
    explanations: [
      '가정 IP는 자주 바뀌고 공유되며, 사용자 신원이나 기기 상태를 확인하지 못한다.',
      'IAP는 부하 분산기 앞에서 사용자 신원(IAM)과 컨텍스트(기기·위치 등 액세스 수준)를 확인한 뒤에만 요청을 앱으로 전달한다. VPN 없이 제로 트러스트 방식의 접근 제어를 제공한다.',
      '자체 인증 구현은 보안 위험과 개발·운영 부담이 크고, 기기 조건 확인도 어렵다.',
      'Cloud VPN은 사이트 간 연결 서비스이며, VPN 없이 접속하라는 요구사항과도 맞지 않는다.',
    ],
    principle:
      '사내 앱의 원격 접근은 네트워크 위치가 아니라 사용자 신원과 기기 컨텍스트로 통제한다(IAP + 컨텍스트 인식 액세스).',
    refs: [
      { title: 'Identity-Aware Proxy 개요', url: 'https://docs.cloud.google.com/iap/docs/concepts-overview' },
    ],
  },
  {
    id: 'c01-29',
    chapter: 1,
    domain: 3,
    topic: '소프트웨어 공급망 보안(Binary Authorization)',
    question:
      '핀테크 회사가 GKE에 배포되는 모든 컨테이너 이미지가 회사의 CI 파이프라인에서 빌드되고 취약점 검사를 통과한 것이어야 한다는 정책을 세웠다. 개발자가 로컬에서 빌드한 이미지를 직접 배포하는 것을 기술적으로 차단해야 한다. 어떻게 해야 하는가?',
    options: [
      '배포 전 체크리스트를 문서화하고 코드 리뷰에서 확인한다.',
      'CI가 검사 통과 이미지에 증명(attestation)을 생성하게 하고, GKE 클러스터에 증명을 요구하는 Binary Authorization 정책을 적용한다.',
      'Artifact Registry 저장소를 공개로 설정한다.',
      '개발자의 GKE 권한을 모두 제거하고 운영팀만 배포하게 한다.',
    ],
    answer: [1],
    explanations: [
      '문서와 리뷰는 절차적 통제일 뿐 기술적으로 배포를 차단하지 못한다.',
      'Binary Authorization은 배포 시점에 이미지에 필요한 증명이 있는지 확인해 정책을 충족하지 않는 이미지의 배포를 거부한다. CI의 빌드·검사 단계와 결합하면 신뢰할 수 있는 이미지만 실행된다.',
      '저장소 공개는 보안을 약화시킬 뿐 배포 이미지 검증과 무관하다.',
      '배포 주체를 바꿔도 운영팀이 검증되지 않은 이미지를 배포하는 것은 막지 못한다. 이미지 자체를 검증해야 한다.',
    ],
    principle:
      '공급망 보안은 “무엇이 배포되는가”를 배포 시점에 강제한다: 빌드 출처·검사 결과를 증명으로 남기고 Binary Authorization으로 검증한다.',
    refs: [
      { title: 'Binary Authorization 개요', url: 'https://docs.cloud.google.com/binary-authorization/docs/overview' },
    ],
  },
  {
    id: 'c01-30',
    chapter: 1,
    domain: 3,
    topic: '민감 정보 비식별화(PCI)',
    question:
      '온라인 쇼핑몰이 결제 로그를 BigQuery로 모아 분석하려 한다. 로그에는 카드 번호가 포함되어 있으며, 분석가는 원래 카드 번호를 볼 필요는 없지만 같은 카드의 거래를 묶어 분석(동일 카드 식별)할 수 있어야 한다. PCI DSS 범위를 줄이려면 어떤 방법이 가장 적합한가?',
    options: [
      '카드 번호 열을 그대로 저장하고 분석가의 테이블 접근 권한을 제한한다.',
      '수집 파이프라인에서 Sensitive Data Protection으로 카드 번호를 결정적 토큰화(암호화 기반 가명 처리)한 뒤 BigQuery에 적재한다.',
      '카드 번호를 모두 “****”로 마스킹해 적재한다.',
      'BigQuery 테이블에 CMEK를 적용한다.',
    ],
    answer: [1],
    explanations: [
      '원본 카드 번호를 저장하면 분석 환경 전체가 PCI 범위에 들어가며, 권한 제한만으로는 범위가 줄지 않는다.',
      '결정적 토큰화는 같은 카드 번호를 항상 같은 토큰으로 바꿔 동일 카드 기준 분석을 가능하게 하면서, 분석 환경에는 원래 번호가 저장되지 않게 한다. 키는 별도로 관리해 필요 시에만 재식별한다.',
      '완전 마스킹은 모든 카드가 같은 값이 되어 동일 카드 식별이라는 분석 요구를 충족하지 못한다.',
      'CMEK는 저장 암호화 키만 바꿀 뿐 분석가가 원본 번호를 조회할 수 있는 점은 그대로여서 범위 축소에 도움이 되지 않는다.',
    ],
    principle:
      '분석에는 식별자가 필요하지만 원본은 필요 없을 때는 결정적 토큰화(가명 처리)를, 전혀 필요 없으면 마스킹·삭제를 선택한다.',
    refs: [
      { title: 'Sensitive Data Protection 비식별화', url: 'https://docs.cloud.google.com/sensitive-data-protection/docs/deidentify-sensitive-data' },
      { title: '가명 처리(토큰화)', url: 'https://docs.cloud.google.com/sensitive-data-protection/docs/pseudonymization' },
    ],
  },
  {
    id: 'c01-31',
    chapter: 1,
    domain: 3,
    topic: '감사 로그(데이터 액세스)',
    question:
      '규제 감사관이 “특정 Cloud Storage 버킷의 환자 문서 객체를 누가 언제 읽었는지”에 대한 기록을 요구했다. 현재 관리 활동 감사 로그만 확인되며 객체 읽기 기록은 보이지 않는다. 앞으로 이 요구를 충족하려면 무엇을 해야 하는가?',
    options: [
      '버킷에 객체 버전 관리를 사용 설정한다.',
      '해당 프로젝트(또는 상위 수준)에서 Cloud Storage의 데이터 액세스 감사 로그(DATA_READ)를 사용 설정한다.',
      'VPC 흐름 로그를 사용 설정한다.',
      '버킷을 공개 액세스 방지로 설정한다.',
    ],
    answer: [1],
    explanations: [
      '버전 관리는 객체 변경 이력을 보존할 뿐 누가 읽었는지를 기록하지 않는다.',
      '관리 활동 감사 로그는 항상 기록되지만, 데이터 읽기·쓰기 같은 데이터 액세스 감사 로그는 BigQuery를 제외하면 기본적으로 꺼져 있어 명시적으로 사용 설정해야 한다. 켜면 객체 읽기 주체와 시각이 기록된다.',
      'VPC 흐름 로그는 VM 네트워크 트래픽 메타데이터로, Cloud Storage API 호출 주체를 기록하지 않는다.',
      '공개 액세스 방지는 접근 제어이지 접근 기록이 아니다.',
    ],
    principle:
      '관리 활동 로그는 항상 켜져 있지만 데이터 액세스 로그는 대부분 기본적으로 꺼져 있다. 규정상 “누가 데이터를 읽었는가”가 필요하면 미리 켜 둔다(로그 양·비용 증가 고려).',
    refs: [
      { title: 'Cloud 감사 로그 개요', url: 'https://docs.cloud.google.com/logging/docs/audit' },
      { title: '데이터 액세스 감사 로그 구성', url: 'https://docs.cloud.google.com/logging/docs/audit/configure-data-access' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (7) ─────────
  {
    id: 'c01-32',
    chapter: 1,
    domain: 4,
    topic: 'CI/CD 파이프라인 설계',
    question:
      '소프트웨어 팀이 GKE로 서비스를 배포한다. 현재는 개발자가 로컬에서 이미지를 빌드해 kubectl로 운영 환경에 직접 적용한다. 요구사항은 (1) 코드 커밋 시 자동 빌드·테스트, (2) 개발→스테이징→운영 순서로 동일 이미지 승격, (3) 운영 배포 전 승인, (4) 문제 시 빠른 롤백이다. 가장 적합한 구성은?',
    options: [
      'Cloud Build 트리거로 빌드·테스트해 Artifact Registry에 이미지를 올리고, Cloud Deploy 배포 파이프라인으로 환경별 승격·운영 승인·롤백을 관리한다.',
      '각 환경마다 별도로 소스를 빌드해 이미지를 만들고 kubectl로 적용한다.',
      '개발자가 운영 클러스터에서 직접 kubectl rollout으로 배포하되 슬랙으로 공지한다.',
      '매주 금요일 운영팀이 수동으로 모든 변경 사항을 한 번에 배포한다.',
    ],
    answer: [0],
    explanations: [
      'Cloud Build가 커밋마다 빌드·테스트하고, Artifact Registry에 불변 이미지를 저장하며, Cloud Deploy가 같은 이미지를 환경별로 승격하고 승인 게이트와 롤백을 제공한다. 네 요구사항을 모두 충족한다.',
      '환경마다 다시 빌드하면 스테이징에서 검증한 것과 다른 결과물이 운영에 배포될 수 있다. 빌드는 한 번만 하고 결과물을 승격해야 한다.',
      '직접 배포는 승인 절차와 추적성이 없고 사람의 실수 위험이 크다.',
      '대규모 일괄 배포는 변경 위험을 키우고 문제 원인 파악과 롤백을 어렵게 한다.',
    ],
    principle:
      '“한 번 빌드, 여러 번 배포”: 불변 아티팩트를 환경별로 승격하고, 승인 게이트와 자동 롤백을 파이프라인에 내장한다.',
    refs: [
      { title: 'Cloud Deploy 개요', url: 'https://docs.cloud.google.com/deploy/docs/overview' },
      { title: 'Cloud Build 개요', url: 'https://docs.cloud.google.com/build/docs/overview' },
    ],
  },
  {
    id: 'c01-33',
    chapter: 1,
    domain: 4,
    topic: '사후 분석(포스트모템)',
    question:
      '결제 서비스가 설정 변경 실수로 2시간 동안 중단되었다. 경영진은 재발 방지를 원하고, 일부 관리자는 변경을 적용한 엔지니어를 징계해야 한다고 주장한다. SRE 모범 사례에 따른 후속 조치로 가장 적절한 것은?',
    options: [
      '담당 엔지니어를 징계하고 앞으로 운영 환경 변경 권한을 박탈한다.',
      '비난 없는(blameless) 포스트모템을 작성해 타임라인·근본 원인·기여 요인을 분석하고, 설정 변경 검증 자동화 등 담당자와 기한이 있는 조치 항목을 추적한다.',
      '장애가 해결되었으므로 추가 조치 없이 종결한다.',
      '모든 운영 변경을 전면 동결하고 분기에 한 번만 배포한다.',
    ],
    answer: [1],
    explanations: [
      '개인 비난은 사람들이 실수를 숨기게 만들어 조직의 학습을 막고, 시스템의 근본 원인(검증 부재 등)은 그대로 남는다.',
      '비난 없는 포스트모템은 개인이 아닌 시스템과 프로세스의 약점을 찾아 개선한다. 구체적인 조치 항목에 담당자와 기한을 두고 추적해야 실제 재발 방지로 이어진다.',
      '원인 분석 없이 종결하면 같은 장애가 반복될 가능성이 높다.',
      '전면 동결은 변경을 크고 위험하게 만들어 오히려 장애 위험을 키운다.',
    ],
    principle:
      '포스트모템의 목적은 책임자 처벌이 아니라 시스템 개선이다. 조치 항목은 구체적이고 측정 가능하며 추적되어야 한다.',
    refs: [
      { title: 'SRE 책: 포스트모템 문화', url: 'https://sre.google/sre-book/postmortem-culture/' },
    ],
  },
  {
    id: 'c01-34',
    chapter: 1,
    domain: 4,
    topic: 'DR 전략 선택',
    question:
      '보험사의 청구 처리 시스템에 대해 재해 복구 요구사항이 RTO 4시간, RPO 15분으로 정해졌다. 예산이 제한적이어서 평상시 DR 리전에 운영과 같은 규모의 인프라를 상시 가동할 수는 없다. 가장 적합한 DR 패턴은?',
    options: [
      '콜드 스탠바이: 매일 백업을 DR 리전에 복사하고, 재해 시 인프라를 처음부터 구축한다.',
      '웜 스탠바이: DB는 DR 리전으로 지속 복제하고, 애플리케이션 계층은 최소 규모로 두었다가 재해 시 IaC로 확장한다.',
      '핫 스탠바이(액티브-액티브): 두 리전에서 전체 규모로 동시에 운영한다.',
      'DR 없이 단일 리전의 여러 영역으로만 운영한다.',
    ],
    answer: [1],
    explanations: [
      '일일 백업은 RPO 15분을 충족하지 못하고, 인프라를 처음부터 구축하면 4시간 RTO도 위험하다.',
      '데이터를 지속 복제하면 15분 RPO를 만족하고, 애플리케이션을 최소 규모로 유지하다 IaC로 확장하면 비용을 억제하면서 4시간 RTO를 충족할 수 있다. 요구사항과 예산의 균형점이다.',
      '액티브-액티브는 RTO·RPO를 가장 짧게 하지만 상시 전체 규모 비용이 들어 예산 제약에 어긋난다.',
      '다중 영역만으로는 리전 재해에 대응할 수 없다.',
    ],
    principle:
      'DR 패턴은 RTO·RPO와 비용의 트레이드오프다: 콜드(저비용·긴 복구) ↔ 웜 ↔ 핫(고비용·즉시 복구). 요구치를 충족하는 가장 저렴한 패턴을 고른다.',
    refs: [
      { title: '재해 복구 계획 가이드', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
    ],
  },
  {
    id: 'c01-35',
    chapter: 1,
    domain: 4,
    topic: '약정 사용 할인(CUD)',
    question:
      '물류 회사의 주문 처리 시스템은 연중무휴로 최소 vCPU 400개를 꾸준히 사용하고, 연말 성수기에는 최대 vCPU 1,000개까지 늘어난다. 워크로드는 향후 3년간 유지될 예정이며 재무팀은 비용 절감을 원한다. 가장 비용 효율적인 구매 전략은?',
    options: [
      'vCPU 1,000개 전체에 3년 약정을 구매한다.',
      '상시 사용하는 기준 부하(약 400 vCPU)에만 약정 사용 할인을 적용하고, 성수기 추가 용량은 주문형으로 자동 확장한다.',
      '모든 용량을 Spot VM으로 전환한다.',
      '약정 없이 모두 주문형으로 사용하고 매년 재검토한다.',
    ],
    answer: [1],
    explanations: [
      '최대치 기준 약정은 성수기 외 기간에 사용하지 않는 약정분까지 비용을 내게 되어 낭비가 크다.',
      '약정 할인은 꾸준히 쓰는 기준 부하에 적용할 때 효과가 가장 크고, 변동분은 주문형 자동 확장으로 처리하면 낭비 없이 비용을 최적화할 수 있다.',
      '주문 처리처럼 중단되면 안 되는 워크로드를 Spot VM으로만 운영하면 선점 시 서비스가 중단될 수 있다.',
      '3년간 유지가 확실한 기준 부하에 약정을 쓰지 않으면 절감 기회를 놓친다.',
    ],
    principle:
      '비용 최적화의 기본: 안정적인 기준 부하 = 약정 할인, 변동 부하 = 주문형 자동 확장, 중단 허용 배치 = Spot.',
    refs: [
      { title: '약정 사용 할인', url: 'https://docs.cloud.google.com/compute/docs/instances/committed-use-discounts-overview' },
    ],
  },
  {
    id: 'c01-36',
    chapter: 1,
    domain: 4,
    topic: '예산과 비용 통제 자동화',
    question:
      '교육용 샌드박스 프로젝트 수백 개를 학생들에게 나눠 주었다. 학생 실수로 비용이 폭증하는 것을 막기 위해, 각 프로젝트가 월 한도를 넘으면 자동으로 리소스 사용을 중단시키고 싶다. 어떻게 구현해야 하는가?',
    options: [
      '각 프로젝트에 예산을 설정하면 한도 도달 시 Google Cloud가 자동으로 결제를 중지한다.',
      '예산 알림을 Pub/Sub 주제로 보내고, 이를 구독하는 Cloud Run functions가 한도 초과 시 해당 프로젝트의 결제를 사용 중지하도록 구현한다.',
      '매달 말 결제 보고서를 확인하고 초과 프로젝트를 수동으로 삭제한다.',
      '학생들에게 비용 주의 안내 메일을 보낸다.',
    ],
    answer: [1],
    explanations: [
      '예산은 알림을 보낼 뿐 자동으로 지출을 막거나 결제를 중지하지 않는다. 흔한 오해다.',
      '예산의 프로그래밍 방식 알림(Pub/Sub)을 받아 함수가 결제 사용 중지 같은 조치를 자동으로 수행하게 하면 한도 초과를 자동 통제할 수 있다. 결제를 끄면 리소스가 중지될 수 있으므로 샌드박스처럼 중단이 허용되는 환경에 적합하다.',
      '월말 수동 확인은 이미 비용이 발생한 뒤라 폭증을 막지 못한다.',
      '안내만으로는 기술적 통제가 되지 않는다.',
    ],
    principle:
      '예산은 “알림”이지 “한도”가 아니다. 자동 통제가 필요하면 예산 → Pub/Sub → 자동화(함수)로 조치를 구현한다.',
    refs: [
      { title: '예산 및 예산 알림', url: 'https://docs.cloud.google.com/billing/docs/how-to/budgets' },
      { title: '알림으로 비용 관리 자동화(결제 사용 중지 예시)', url: 'https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications' },
    ],
  },
  {
    id: 'c01-37',
    chapter: 1,
    domain: 4,
    topic: '팀 역량과 기술 선택',
    question:
      '중견 기업이 6개월 안에 사내 웹 애플리케이션 15개를 클라우드로 옮기려 한다. 개발팀은 컨테이너 경험은 있지만 Kubernetes 운영 경험이 전혀 없고, 채용 계획도 없다. CTO는 장기적으로 운영 부담을 줄이는 것을 중시한다. 아키텍트가 권고할 방향으로 가장 적절한 것은?',
    options: [
      '모든 앱을 GKE Standard로 옮기고 팀이 운영하며 배우게 한다.',
      '스테이트리스 웹 앱은 Cloud Run으로 옮기고, 필요한 교육 계획과 함께 운영 모델을 단순화한다.',
      '클라우드 이전을 연기하고 Kubernetes 전문가 채용부터 진행한다.',
      '모든 앱을 VM으로 리호스트한 뒤 운영팀이 OS 패치를 직접 관리한다.',
    ],
    answer: [1],
    explanations: [
      'Kubernetes 운영 경험이 없는 팀에 GKE Standard 운영을 맡기면 일정 지연과 장애 위험이 크고, 운영 부담 감소라는 CTO 목표와도 맞지 않는다.',
      '팀의 기존 컨테이너 역량을 활용하면서 클러스터 운영이 필요 없는 관리형 서버리스 플랫폼을 쓰면 일정·위험·장기 운영 부담을 모두 줄일 수 있다. 부족한 부분은 교육 계획으로 보완한다.',
      '채용 계획이 없다는 제약과 6개월 일정에 어긋난다.',
      'VM 리호스트는 빠르지만 OS 패치 등 운영 부담이 남아 장기 목표와 맞지 않는다.',
    ],
    principle:
      '기술 선택은 팀 역량 평가와 함께 이루어져야 한다. 역량 격차가 크면 관리형 서비스로 운영 책임을 줄이고 교육으로 보완한다.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  {
    id: 'c01-38',
    chapter: 1,
    domain: 4,
    topic: 'TCO 분석과 CapEx/OpEx',
    question:
      '제조사 CFO가 “내년 서버 교체 예산(자본 지출) 대신 클라우드로 옮기면 재무적으로 어떤 영향이 있는지” 근거 자료를 요청했다. 회사에는 VM 수백 대가 있지만 실제 사용률 데이터가 정리되어 있지 않다. 아키텍트가 먼저 해야 할 일로 가장 적절한 것은?',
    options: [
      '온프레미스 서버 사양을 그대로 Google Cloud 가격 계산기에 입력해 비교한다.',
      'Migration Center로 현재 인프라를 검색·수집해 실제 사용률 기반의 적정 규모와 총소유비용(TCO) 비교 보고서를 만든다.',
      '모든 서버를 우선 클라우드로 옮긴 뒤 첫 청구서로 판단한다.',
      '벤더의 일반적인 절감률 사례를 인용해 보고한다.',
    ],
    answer: [1],
    explanations: [
      '과대 할당된 온프레미스 사양을 그대로 옮기면 클라우드 비용이 부풀려져 잘못된 결론을 낼 수 있다. 실제 사용률 기반의 적정 규모 산정이 필요하다.',
      'Migration Center는 인프라 자산을 검색하고 성능 데이터를 수집해 적정 규모의 클라우드 구성과 TCO 비교를 제공한다. 자본 지출 대 운영 지출 관점의 근거 자료를 만들 수 있다.',
      '먼저 옮기고 판단하는 것은 의사결정 순서가 거꾸로이며 재무적 위험이 크다.',
      '일반 사례는 이 회사의 실제 워크로드를 반영하지 않아 CFO의 의사결정 근거로 부족하다.',
    ],
    principle:
      '재무 의사결정은 실제 사용률 데이터 → 적정 규모 → TCO 비교 순서로 근거를 만든다. 사양 그대로의 1:1 비교는 피한다.',
    refs: [
      { title: 'Migration Center 개요', url: 'https://docs.cloud.google.com/migration-center/docs/migration-center-overview' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (6) ─────────
  {
    id: 'c01-39',
    chapter: 1,
    domain: 5,
    topic: 'Cloud Run 카나리 배포',
    question:
      'Cloud Run에서 운영 중인 결제 API의 새 버전을 배포하려 한다. 새 버전은 먼저 전체 트래픽의 5%에만 노출해 오류율을 관찰하고, 문제가 없으면 점진적으로 100%까지 늘리며, 문제가 생기면 즉시 이전 버전으로 되돌려야 한다. 가장 간단한 방법은?',
    options: [
      '새 버전을 트래픽 없이(--no-traffic) 새 리비전으로 배포하고, 리비전 간 트래픽 분할을 5%부터 단계적으로 조정한다.',
      '새 버전을 별도 Cloud Run 서비스로 배포하고 DNS 가중치로 트래픽을 나눈다.',
      '기존 서비스를 삭제하고 새 버전으로 다시 만든다.',
      '새 버전을 배포한 뒤 문제가 생기면 이전 소스를 다시 빌드해 재배포한다.',
    ],
    answer: [0],
    explanations: [
      'Cloud Run은 리비전별 트래픽 분할을 기본 제공한다. 새 리비전을 트래픽 없이 배포한 뒤 비율을 단계적으로 옮기고, 문제 시 이전 리비전으로 트래픽을 즉시 되돌릴 수 있다.',
      'DNS 가중치는 캐시 때문에 즉시 반영되지 않고, 별도 서비스 관리가 추가되어 불필요하게 복잡하다.',
      '서비스 삭제·재생성은 다운타임을 만들고 점진적 노출이 불가능하다.',
      '재빌드 후 재배포는 롤백이 느리며, 이전 리비전을 그대로 쓰는 방식보다 위험하다.',
    ],
    principle:
      '카나리 배포는 새 버전을 소량 트래픽으로 검증하고 점진적으로 확대하는 것이다. Cloud Run에서는 리비전 트래픽 분할로 구현하고, 롤백은 트래픽 전환으로 한다.',
    refs: [
      { title: 'Cloud Run 롤백·점진적 롤아웃·트래픽 이전', url: 'https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration' },
    ],
  },
  {
    id: 'c01-40',
    chapter: 1,
    domain: 5,
    topic: 'Apigee API 관리',
    question:
      '물류 회사가 배송 조회·예약 API를 수십 개 파트너사에 공개하려 한다. 요구사항은 파트너별 API 키 발급, 파트너 등급별 호출 한도(쿼터) 차등 적용, 파트너별 사용량 분석, 셀프서비스 개발자 포털 제공이다. 가장 적합한 솔루션은?',
    options: [
      '백엔드 서비스 코드에 파트너별 키 검증과 카운터를 직접 구현한다.',
      'Apigee로 API 프록시를 만들고, 등급별 API 제품에 쿼터를 정의해 파트너 앱에 키를 발급하며, 분석과 개발자 포털 기능을 사용한다.',
      '외부 애플리케이션 부하 분산기에 Cloud Armor 레이트 리밋 규칙만 적용한다.',
      '파트너마다 별도 VPC를 만들어 VPC 피어링으로 연결한다.',
    ],
    answer: [1],
    explanations: [
      '직접 구현은 키 관리·쿼터·분석·포털을 모두 만들어야 해 비용과 유지보수 부담이 크고 보안 실수 위험이 있다.',
      'Apigee는 API 프록시, API 제품 단위 쿼터·정책, 앱별 키 발급, 사용량 분석, 개발자 포털을 제공하는 API 관리 플랫폼으로 요구사항을 모두 충족한다.',
      'Cloud Armor 레이트 리밋은 IP 등 기준의 트래픽 제한일 뿐, 파트너별 키 발급·등급별 쿼터·분석·포털을 제공하지 않는다.',
      'VPC 피어링은 네트워크 연결일 뿐 API 관리 기능이 없고, 수십 개 파트너에 확장하기도 어렵다.',
    ],
    principle:
      '외부 파트너 대상 API의 키·쿼터·분석·포털·수익화 요구는 API 관리 플랫폼(Apigee)으로 해결한다.',
    refs: [
      { title: 'Apigee 개요', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/get-started/what-apigee' },
      { title: 'API 제품', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/publish/what-api-product' },
    ],
  },
  {
    id: 'c01-41',
    chapter: 1,
    domain: 5,
    topic: 'Terraform 상태 관리',
    question:
      '플랫폼 팀 8명이 Terraform으로 Google Cloud 인프라를 관리한다. 지금은 각자 노트북의 로컬 상태 파일을 사용해 서로의 변경을 덮어쓰는 사고가 발생했다. 협업과 복구 가능성을 높이려면 어떻게 해야 하는가?',
    options: [
      '상태 파일을 Git 저장소에 커밋해 공유한다.',
      '객체 버전 관리를 켠 Cloud Storage 버킷을 Terraform 원격 백엔드(gcs)로 사용해 상태를 중앙에서 관리하고 잠금을 활용한다.',
      '한 사람만 Terraform을 실행하도록 규칙을 정한다.',
      '매번 terraform import로 기존 리소스를 다시 가져온다.',
    ],
    answer: [1],
    explanations: [
      '상태 파일에는 민감 정보가 포함될 수 있어 Git 커밋은 위험하며, 동시 실행 잠금도 제공하지 않는다.',
      'gcs 백엔드는 상태를 중앙에 저장하고 상태 잠금으로 동시 변경을 막는다. 버킷 버전 관리를 켜 두면 손상되거나 잘못 덮어쓴 상태를 이전 버전으로 복구할 수 있다.',
      '한 사람만 실행하는 규칙은 병목이 되고 기술적 보호 장치가 되지 못한다.',
      '매번 import하는 것은 오류가 잦고 근본 해결책이 아니다.',
    ],
    principle:
      '팀 단위 IaC는 원격 상태(잠금 + 버전 관리)가 기본이다. 가능하면 CI 파이프라인에서 plan/apply를 실행해 변경을 검토·기록한다.',
    refs: [
      { title: 'Cloud Storage에 Terraform 상태 저장', url: 'https://docs.cloud.google.com/docs/terraform/resource-management/store-state' },
    ],
  },
  {
    id: 'c01-42',
    chapter: 1,
    domain: 5,
    topic: '로컬 에뮬레이터 테스트',
    question:
      '개발팀이 Pub/Sub 메시지를 처리하는 서비스를 개발 중이다. CI에서 통합 테스트를 실행할 때 실제 Pub/Sub 프로젝트를 쓰면 비용이 들고 테스트끼리 메시지가 섞이는 문제가 있다. 테스트를 격리하고 빠르게 실행하려면?',
    options: [
      '테스트마다 새 Google Cloud 프로젝트를 만들어 실제 Pub/Sub를 사용한다.',
      'CI 환경에서 gcloud로 Pub/Sub 에뮬레이터를 실행하고, 클라이언트 라이브러리가 PUBSUB_EMULATOR_HOST 환경 변수로 에뮬레이터에 연결하게 한다.',
      '통합 테스트를 없애고 운영 환경에서 모니터링으로 검증한다.',
      '모든 테스트가 하나의 공유 주제를 쓰도록 하고 순서대로 실행한다.',
    ],
    answer: [1],
    explanations: [
      '테스트마다 프로젝트를 만드는 것은 느리고 관리·비용 부담이 크다.',
      'Pub/Sub 에뮬레이터는 로컬에서 실행되어 비용이 없고 테스트마다 독립 환경을 만들 수 있다. 클라이언트 라이브러리는 환경 변수만으로 에뮬레이터에 연결되므로 코드 변경이 거의 필요 없다.',
      '운영 환경에서만 검증하면 결함이 사용자에게 먼저 노출된다.',
      '공유 주제와 순차 실행은 느리고 테스트 간 간섭 문제를 해결하지 못한다.',
    ],
    principle:
      'Pub/Sub·Bigtable·Spanner·Firestore 등은 에뮬레이터로 로컬·CI 테스트를 격리하고 비용을 줄인다. 에뮬레이터와 실제 서비스의 차이는 별도 스테이징 테스트로 보완한다.',
    refs: [
      { title: 'Pub/Sub 에뮬레이터로 로컬 테스트', url: 'https://docs.cloud.google.com/pubsub/docs/emulator' },
    ],
  },
  {
    id: 'c01-43',
    chapter: 1,
    domain: 5,
    topic: 'API 호출 재시도 모범 사례',
    question:
      '수천 개의 워커가 동시에 Cloud Storage에 객체를 쓰는 배치 작업에서 간헐적으로 429(요청 과다)와 503 오류가 발생한다. 현재 워커는 실패 즉시 같은 요청을 재시도하고 있어, 오류가 폭증하는 현상이 관찰된다. 어떻게 개선해야 하는가?',
    options: [
      '재시도를 완전히 제거하고 실패한 작업은 버린다.',
      '지수 백오프와 지터(무작위 지연)를 적용해 재시도하고, 최대 재시도 횟수·시간을 제한한다.',
      '모든 워커가 1초 간격으로 고정 재시도하게 한다.',
      '워커 수를 두 배로 늘려 처리량을 높인다.',
    ],
    answer: [1],
    explanations: [
      '재시도를 없애면 일시적 오류로 데이터가 유실된다. 429·503은 재시도 가능한 오류다.',
      '지수 백오프는 재시도 간격을 점점 늘려 서비스에 회복 시간을 주고, 지터는 수많은 클라이언트의 재시도 시점이 겹치는 “재시도 폭풍”을 막는다. 상한을 두어 무한 재시도도 방지한다.',
      '고정 간격 재시도는 모든 워커가 동시에 재시도해 부하 급증을 반복시킨다.',
      '워커를 늘리면 요청이 더 많아져 429 오류가 더 심해진다.',
    ],
    principle:
      '재시도 가능한 오류(429, 5xx)는 “잘린 지수 백오프 + 지터”로 재시도한다. Google Cloud 클라이언트 라이브러리는 대부분 이를 기본 제공한다.',
    refs: [
      { title: 'Cloud Storage 재시도 전략', url: 'https://docs.cloud.google.com/storage/docs/retry-strategy' },
    ],
  },
  {
    id: 'c01-44',
    chapter: 1,
    domain: 5,
    topic: '파일 데이터 이전 도구 선택',
    question:
      '연구소가 온프레미스 NFS 파일 서버의 약 40TB(수천만 개 파일)를 Cloud Storage로 옮기고, 이전 기간 3개월 동안 매일 밤 변경분을 동기화해야 한다. 회선은 10Gbps로 충분하다. 전송 실패 시 자동 재시도, 진행 상황 모니터링, 일정 기반 실행을 원한다. 가장 적합한 도구는?',
    options: [
      '각 서버에서 cron으로 gcloud storage rsync 스크립트를 실행한다.',
      'Storage Transfer Service의 온프레미스 에이전트 기반 전송 작업을 일정 실행으로 구성한다.',
      'Transfer Appliance를 매주 주문한다.',
      'BigQuery Data Transfer Service를 사용한다.',
    ],
    answer: [1],
    explanations: [
      'rsync 스크립트도 가능하지만 수천만 개 파일의 병렬화·재시도·모니터링·일정 관리를 직접 운영해야 해 요구사항에 비해 부담이 크다.',
      'Storage Transfer Service는 온프레미스 파일 시스템에 에이전트를 두고 대규모 병렬 전송, 증분 동기화, 자동 재시도, 일정 실행, 모니터링을 관리형으로 제공한다.',
      '회선 대역폭이 충분하고 매일 증분 동기화가 필요하므로 오프라인 장비 배송은 맞지 않는다.',
      'BigQuery Data Transfer Service는 BigQuery로 데이터를 적재하는 서비스로 파일 서버 이전과 무관하다.',
    ],
    principle:
      '대규모 파일 이전 + 반복 동기화 + 관리형 운영이 필요하면 Storage Transfer Service, 대역폭이 부족하면 Transfer Appliance, 소규모 일회성이면 gcloud storage를 쓴다.',
    refs: [
      { title: '파일 시스템 간 전송(에이전트 기반)', url: 'https://docs.cloud.google.com/storage-transfer/docs/managing-on-prem-agents' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c01-45',
    chapter: 1,
    domain: 6,
    topic: 'SLO 기반 알림(소진율)',
    question:
      '온콜 엔지니어들이 CPU 사용률 80% 초과 알림을 하루 수십 건씩 받지만 대부분 사용자 영향이 없어 알림 피로가 심하다. 반면 실제 사용자 오류 증가는 늦게 발견된다. 서비스에는 “요청의 99.9%가 성공” SLO가 정의되어 있다. 알림 전략을 어떻게 바꿔야 하는가?',
    options: [
      'CPU 알림 임계값을 95%로 올린다.',
      'SLO 오류 예산 소진율(burn rate) 기반 알림을 구성하고, 빠른 소진은 호출(page), 느린 소진은 티켓으로 처리한다.',
      '모든 리소스 지표에 알림을 추가해 누락을 방지한다.',
      '알림을 모두 끄고 매일 아침 대시보드를 확인한다.',
    ],
    answer: [1],
    explanations: [
      '임계값만 올리면 알림 수는 줄지만 여전히 사용자 영향과 연결되지 않은 원인 지표 알림이며, 실제 오류 증가를 늦게 발견하는 문제도 해결되지 않는다.',
      '소진율 알림은 사용자가 체감하는 SLO 위반 속도를 기준으로 하므로 의미 있는 알림만 받게 된다. 빠른 소진은 즉시 대응, 느린 소진은 업무 시간 처리로 나눠 알림 피로를 줄인다.',
      '알림을 더 늘리면 알림 피로가 심해질 뿐이다.',
      '알림을 끄면 장애 감지가 더 늦어진다.',
    ],
    principle:
      '알림은 원인(CPU 등)이 아니라 증상(사용자 영향, SLO)을 기준으로 한다. 오류 예산 소진율이 대표적인 방법이다.',
    refs: [
      { title: 'SLO 소진율 알림', url: 'https://docs.cloud.google.com/stackdriver/docs/solutions/slo-monitoring/alerting-on-budget-burn-rate' },
      { title: 'SRE 워크북: SLO 기반 알림', url: 'https://sre.google/workbook/alerting-on-slos/' },
    ],
  },
  {
    id: 'c01-46',
    chapter: 1,
    domain: 6,
    topic: '중앙 집중식 로깅',
    question:
      '기업의 조직 아래 프로젝트가 300개 있고 매주 새 프로젝트가 생긴다. 보안팀은 모든 프로젝트의 감사 로그를 중앙 보안 프로젝트 한 곳에 모아 1년간 보관하고, 새 프로젝트도 자동으로 포함되길 원한다. 개별 프로젝트 관리자가 이 수집을 끌 수 없어야 한다. 어떻게 구성해야 하는가?',
    options: [
      '각 프로젝트에 로그 싱크를 만들고 새 프로젝트 생성 시 스크립트로 추가한다.',
      '조직 수준에 하위 리소스를 포함하는 집계 로그 싱크를 만들고, 보안 프로젝트의 보존 기간 1년 로그 버킷으로 라우팅한다.',
      '각 프로젝트의 _Default 로그 버킷 보존 기간을 1년으로 늘린다.',
      '매일 모든 프로젝트의 로그를 내보내는 배치 작업을 실행한다.',
    ],
    answer: [1],
    explanations: [
      '프로젝트별 싱크는 누락 위험이 있고, 프로젝트 관리자가 싱크를 삭제하거나 변경할 수 있다.',
      '조직 수준 집계 싱크(하위 리소스 포함)는 기존·신규 프로젝트의 로그를 모두 한 대상으로 라우팅하며, 프로젝트 관리자가 변경할 수 없다. 대상 로그 버킷에서 보존 기간을 1년으로 설정한다.',
      '각 프로젝트에 로그가 흩어져 중앙 집중 요구를 충족하지 못하고, 프로젝트 관리자가 설정을 바꿀 수 있다.',
      '배치 내보내기는 지연과 누락 위험이 있으며 운영 부담이 크다.',
    ],
    principle:
      '조직 전체 로그 수집은 조직(또는 폴더) 수준 집계 싱크로 한다. 보존·접근 제어는 대상 로그 버킷에서 관리한다.',
    refs: [
      { title: '집계 싱크 개요', url: 'https://docs.cloud.google.com/logging/docs/export/aggregated_sinks' },
      { title: '로그 라우팅 및 스토리지', url: 'https://docs.cloud.google.com/logging/docs/routing/overview' },
    ],
  },
  {
    id: 'c01-47',
    chapter: 1,
    domain: 6,
    topic: '프로덕션 프로파일링',
    question:
      'Go로 작성된 추천 API가 운영 환경에서만 CPU 사용량이 예상보다 높다. 스테이징에서는 재현되지 않으며, 성능 저하 없이 어떤 함수가 CPU와 메모리를 가장 많이 쓰는지 지속적으로 파악하고 싶다. 어떤 도구가 가장 적합한가?',
    options: [
      'Cloud Trace',
      'Cloud Profiler',
      'VPC 흐름 로그',
      'Error Reporting',
    ],
    answer: [1],
    explanations: [
      'Cloud Trace는 요청이 서비스 사이를 지나며 어디서 지연되는지 보여 주지만, 함수 수준의 CPU·메모리 사용량은 보여 주지 않는다.',
      'Cloud Profiler는 운영 환경에서 낮은 오버헤드로 지속적으로 CPU·힙 프로파일을 수집해 함수별 자원 소비를 보여 준다. 운영에서만 나타나는 성능 문제 분석에 적합하다.',
      'VPC 흐름 로그는 네트워크 트래픽 메타데이터로 코드 수준 분석과 무관하다.',
      'Error Reporting은 예외·오류를 집계하며 자원 사용량 분석 도구가 아니다.',
    ],
    principle:
      '지연 구간 분석은 Trace, 함수별 자원 소비는 Profiler, 오류 집계는 Error Reporting, 지표·알림은 Monitoring으로 구분한다.',
    refs: [
      { title: 'Cloud Profiler 개요', url: 'https://docs.cloud.google.com/profiler/docs/about-profiler' },
    ],
  },
  {
    id: 'c01-48',
    chapter: 1,
    domain: 6,
    topic: '분산 추적',
    question:
      '마이크로서비스 12개로 구성된 주문 시스템에서 일부 주문 요청이 3초 이상 걸린다. 각 서비스의 평균 지연 시간 지표는 정상 범위로 보여, 어느 서비스 호출 경로에서 시간이 소요되는지 파악하기 어렵다. 가장 먼저 도입해야 할 것은?',
    options: [
      '모든 서비스의 로그 수준을 DEBUG로 올린다.',
      'OpenTelemetry로 트레이스 컨텍스트를 전파하고 Cloud Trace로 요청별 스팬을 분석한다.',
      '각 서비스에 CPU 사용률 알림을 추가한다.',
      '모든 서비스의 인스턴스 수를 두 배로 늘린다.',
    ],
    answer: [1],
    explanations: [
      'DEBUG 로그는 양이 폭증하고 비용이 커지며, 서비스 간 요청을 연결해 보여 주지 못한다.',
      '분산 추적은 한 요청이 여러 서비스를 거치는 전체 경로와 구간별 소요 시간을 스팬으로 보여 준다. 평균 지표로는 보이지 않는 느린 요청의 병목 구간을 찾을 수 있다.',
      'CPU 알림은 지연의 원인 구간을 알려 주지 못한다.',
      '원인을 모른 채 규모를 늘리면 비용만 늘고 문제가 해결되지 않을 수 있다.',
    ],
    principle:
      '마이크로서비스의 지연 분석은 평균 지표가 아니라 요청 단위 분산 추적으로 한다. 계측은 OpenTelemetry로 표준화한다.',
    refs: [
      { title: 'Cloud Trace 개요', url: 'https://docs.cloud.google.com/trace/docs/overview' },
    ],
  },
  {
    id: 'c01-49',
    chapter: 1,
    domain: 6,
    topic: '출시 전 신뢰성 검증',
    question:
      '온라인 티켓 판매 서비스가 대형 콘서트 예매 오픈을 앞두고 있다. 평소보다 20배 많은 동시 접속이 예상되며, 과거에는 오픈 직후 DB 연결 고갈로 장애가 났다. 출시 전에 해야 할 검증 활동으로 가장 적절한 것은? (2개 선택)',
    options: [
      '예상 최대 부하 이상의 현실적인 트래픽 패턴으로 스테이징에서 부하 테스트를 수행해 병목과 한계를 확인한다.',
      '의존 서비스나 인스턴스 장애를 의도적으로 주입해 자동 복구와 성능 저하 동작을 확인한다.',
      '출시 당일까지 모든 모니터링 알림을 꺼 둔다.',
      '부하 테스트는 운영 환경에서 사전 공지 없이 실행한다.',
      '과거 장애 원인은 이미 알려져 있으므로 별도 검증 없이 인스턴스 수만 늘린다.',
    ],
    answer: [0, 1],
    explanations: [
      '실제와 비슷한 패턴의 부하 테스트는 DB 연결 한도 같은 병목을 사전에 드러내고 용량 계획의 근거가 된다.',
      '장애 주입(카오스 엔지니어링)은 자동 확장·재시도·장애 조치가 실제로 동작하는지 검증한다. 급증 상황에서 일부 구성 요소가 실패해도 버티는지 확인할 수 있다.',
      '알림을 끄면 문제를 발견하지 못한다. 오히려 출시 전 알림과 대시보드를 점검해야 한다.',
      '운영 환경에서 무계획 부하 테스트는 실제 사용자에게 장애를 일으킬 수 있다.',
      '인스턴스를 늘려도 DB 연결 고갈은 오히려 악화될 수 있다(연결 수 증가). 검증 없이 규모만 키우는 것은 위험하다.',
    ],
    principle:
      '출시 전 신뢰성은 부하 테스트(용량·병목)와 장애 주입(복원력)으로 검증한다. 테스트는 통제된 환경과 계획하에 수행한다.',
    refs: [
      { title: 'Well-Architected Framework: 신뢰성', url: 'https://docs.cloud.google.com/architecture/framework/reliability' },
    ],
  },
  {
    id: 'c01-50',
    chapter: 1,
    domain: 6,
    topic: '업타임 체크와 알림 채널',
    question:
      '공개 웹사이트가 새벽에 다운되었는데 아무도 몰라 아침에야 복구되었다. 기존 알림은 공용 이메일 주소로 전송되어 확인되지 않았다. 외부 사용자 관점의 가용성 감지와 확실한 온콜 전달을 위해 무엇을 해야 하는가?',
    options: [
      'VM 내부에서 자체 스크립트로 웹 서버 프로세스를 확인하고 로그를 남긴다.',
      'Cloud Monitoring 업타임 체크를 여러 지역에서 구성하고, 실패 시 온콜 도구(예: PagerDuty)나 SMS 알림 채널로 전달되는 알림 정책을 만든다.',
      '이메일 수신자를 전 직원으로 확대한다.',
      '매시간 사람이 웹사이트에 접속해 확인한다.',
    ],
    answer: [1],
    explanations: [
      'VM 내부 확인은 네트워크·부하 분산기·DNS 문제처럼 외부에서만 보이는 장애를 감지하지 못하고, 알림 전달도 해결하지 못한다.',
      '업타임 체크는 여러 지역에서 외부 사용자처럼 서비스를 확인해 가용성 문제를 감지한다. 온콜 호출 시스템이나 SMS 채널로 알림을 보내야 실제로 사람이 대응한다.',
      '수신자를 늘리면 책임이 분산되어 오히려 아무도 대응하지 않는 문제가 생긴다.',
      '사람의 수동 확인은 새벽 장애를 감지하지 못하고 비효율적이다.',
    ],
    principle:
      '가용성은 사용자 관점(외부 업타임 체크)에서 측정하고, 알림은 명확한 담당자에게 확실히 전달되는 채널로 보낸다.',
    refs: [
      { title: '업타임 체크 개요', url: 'https://docs.cloud.google.com/monitoring/uptime-checks' },
      { title: '알림 채널 관리', url: 'https://docs.cloud.google.com/monitoring/support/notification-options' },
    ],
  },
  // @@END
]
