// Chapter 6 — 오리지널 문제 (스키마·작성 기준: pca-exam/CLAUDE.md)
export default [
  // ───────── 도메인 1: 설계·계획 (12) ─────────
  {
    id: 'c06-01',
    chapter: 6,
    domain: 1,
    topic: 'Cloud Run functions 선택',
    question:
      '개발자가 Pub/Sub 메시지를 받아 JSON을 검증하고 Firestore 문서 하나를 갱신하는 20줄짜리 로직을 배포하려 한다. 컨테이너 이미지 작성·관리 없이 소스 코드만 올리고, 이벤트가 없을 때는 비용이 들지 않길 원한다. 가장 적합한 선택은?',
    options: [
      'GKE 클러스터에 Deployment로 배포한다.',
      'Cloud Run functions로 소스 코드를 배포하고 Pub/Sub 트리거를 연결한다.',
      'Compute Engine VM에서 구독자 프로세스를 상시 실행한다.',
      'Dataflow 스트리밍 파이프라인을 만든다.',
    ],
    answer: [1],
    explanations: [
      'GKE는 이 규모의 단일 목적 로직에 비해 운영 부담과 유휴 비용이 크다.',
      'Cloud Run functions는 함수 단위 소스 코드를 배포하면 빌드·실행 환경을 관리해 주고, Pub/Sub 같은 이벤트 트리거로 실행되며 유휴 시 비용이 발생하지 않는다.',
      '상시 VM은 유휴 비용과 OS 관리가 필요하다.',
      'Dataflow는 대규모 스트림 처리용으로 단순 이벤트 처리에는 과하다.',
    ],
    principle:
      '짧은 단일 목적 이벤트 처리 = Cloud Run functions, 컨테이너 단위 서비스 = Cloud Run, 대규모 스트림 변환 = Dataflow.',
    refs: [
      { title: 'Cloud Run functions 개요', url: 'https://docs.cloud.google.com/functions/docs/concepts/overview' },
    ],
  },
  {
    id: 'c06-02',
    chapter: 6,
    domain: 1,
    topic: '배치 컴퓨팅(Batch)',
    question:
      '유전체 연구소가 수천 개의 독립적인 분석 작업을 VM에서 실행한다. 각 작업은 특정 머신 유형(고메모리)과 컨테이너 또는 스크립트로 실행되며, 작업 큐잉·VM 프로비저닝·재시도·완료 후 정리를 연구원이 직접 관리하느라 부담이 크다. 클러스터를 상시 운영하지 않고 이를 자동화하려면?',
    options: [
      '연구원이 VM을 수동으로 만들고 작업 후 삭제한다.',
      'Batch 서비스에 작업(job)을 제출해 리소스 프로비저닝·스케줄링·재시도·정리를 관리형으로 처리한다.',
      'GKE Standard 클러스터를 24시간 운영한다.',
      '작업을 모두 Cloud Run functions로 바꾼다.',
    ],
    answer: [1],
    explanations: [
      '수동 관리는 오류가 잦고 규모가 커지면 불가능하다.',
      'Batch는 작업을 제출하면 필요한 VM을 프로비저닝하고, 작업을 큐잉·스케줄링하며, 재시도와 완료 후 리소스 정리를 자동으로 처리하는 관리형 배치 서비스다. 머신 유형과 Spot VM 사용도 지정할 수 있다.',
      '상시 클러스터는 유휴 비용이 크고 운영 부담이 있다.',
      '장시간·고메모리 과학 계산은 함수 실행 모델에 맞지 않는다.',
    ],
    principle:
      '독립 작업 다수를 VM에서 실행하는 HPC·배치 워크로드는 관리형 Batch로 스케줄링과 수명 주기를 자동화한다.',
    refs: [
      { title: 'Batch 시작하기', url: 'https://docs.cloud.google.com/batch/docs/get-started' },
    ],
  },
  {
    id: 'c06-03',
    chapter: 6,
    domain: 1,
    topic: '데이터 파이프라인 오케스트레이션',
    question:
      '데이터팀의 일일 파이프라인은 (1) SFTP 파일 도착 확인, (2) Dataflow 정제 작업, (3) BigQuery 집계 쿼리 여러 개, (4) 모두 성공하면 보고서 생성 순서로 실행된다. 단계 간 의존성, 실패 시 재시도·알림, 과거 날짜 재실행(backfill)이 필요하며, 팀은 Python으로 DAG를 작성하는 데 익숙하다. 가장 적합한 도구는?',
    options: [
      '각 단계를 cron으로 시간 간격을 두고 실행한다.',
      'Managed Service for Apache Airflow(구 Cloud Composer)로 DAG를 정의해 오케스트레이션한다.',
      '모든 단계를 하나의 거대한 셸 스크립트로 묶는다.',
      '각 단계 담당자가 매일 수동으로 실행한다.',
    ],
    answer: [1],
    explanations: [
      '시간 간격 cron은 선행 작업 지연·실패를 인지하지 못해 잘못된 데이터로 후속 작업이 실행될 수 있다.',
      'Airflow는 Python DAG로 작업 간 의존성, 재시도·알림, 백필을 관리하며, Google Cloud 서비스용 연산자를 제공한다. 관리형 서비스로 운영 부담도 줄인다.',
      '단일 스크립트는 부분 재실행·모니터링이 어렵다.',
      '수동 실행은 오류와 지연을 만든다.',
    ],
    principle:
      '여러 서비스에 걸친 일정 기반 데이터 파이프라인(의존성·백필)은 Airflow, 요청 단위 서비스 호출 흐름은 Workflows로 오케스트레이션한다.',
    refs: [
      { title: 'Managed Service for Apache Airflow 개요', url: 'https://docs.cloud.google.com/composer/docs/composer-3/composer-overview' },
    ],
  },
  {
    id: 'c06-04',
    chapter: 6,
    domain: 1,
    topic: 'Cloud Storage FUSE',
    question:
      'ML 팀의 학습 코드는 로컬 파일 경로에서 이미지를 읽도록 작성되어 있다. 학습 데이터 수십 TB는 Cloud Storage에 있으며, 학습 전에 매번 전체를 디스크로 복사하느라 시간이 오래 걸린다. 코드를 최소한으로 바꾸고 GKE·VM에서 버킷 데이터를 파일처럼 읽고 싶다. 가장 적합한 방법은?',
    options: [
      '학습 데이터를 Filestore로 전부 옮긴다.',
      'Cloud Storage FUSE로 버킷을 파일 시스템처럼 마운트해 학습 코드가 직접 읽게 한다.',
      '학습 시작 전에 gcloud storage cp로 매번 전체를 복사한다.',
      '데이터를 BigQuery 테이블로 변환한다.',
    ],
    answer: [1],
    explanations: [
      'Filestore로 옮기면 데이터 이동과 추가 비용이 들고, 버킷을 원본으로 유지하려는 흐름과 맞지 않는다.',
      'Cloud Storage FUSE는 버킷을 로컬 파일 시스템처럼 마운트해 파일 경로 기반 코드가 데이터를 직접 읽게 한다. 사전 전체 복사가 필요 없고, 캐싱 옵션으로 반복 읽기 성능도 높일 수 있다.',
      '매번 전체 복사는 현재 문제 그 자체다.',
      '이미지 파일을 BigQuery 테이블로 바꾸는 것은 학습 코드와 맞지 않는다.',
    ],
    principle:
      '객체 스토리지 데이터를 파일 API로 읽어야 하면 Cloud Storage FUSE를 검토한다. 완전한 POSIX 의미 체계가 필요하면 Filestore 같은 파일 스토리지를 쓴다.',
    refs: [
      { title: 'Cloud Storage FUSE 개요', url: 'https://docs.cloud.google.com/storage/docs/cloud-storage-fuse/overview' },
    ],
  },
  {
    id: 'c06-05',
    chapter: 6,
    domain: 1,
    topic: '영역 장애 대비 용량(N+1)',
    question:
      '웹 서비스는 피크 때 최소 12대의 VM이 필요하다. 리전 MIG로 3개 영역에 고르게 분산할 때, 한 영역 전체가 장애가 나도 피크 트래픽을 감당하려면 평상시 최소 몇 대를 유지해야 하는가?',
    options: [
      '12대(영역당 4대)',
      '18대(영역당 6대)',
      '15대(영역당 5대)',
      '36대(영역당 12대)',
    ],
    answer: [1],
    explanations: [
      '영역당 4대면 한 영역 장애 시 8대만 남아 필요한 12대에 못 미친다.',
      '한 영역을 잃어도 남은 두 영역에서 12대를 확보해야 하므로 영역당 6대가 필요하고, 3개 영역 합계는 18대다.',
      '영역당 5대면 장애 시 10대만 남는다.',
      '영역당 12대는 한 영역만으로 전체를 감당하는 과잉 설계로 비용이 크다.',
    ],
    principle:
      '영역 장애 대비 용량 = 필요 용량 ÷ (영역 수 − 1) × 영역 수. 자동 확장이 있어도 확장 지연과 영역 용량 부족을 고려해 여유를 둔다.',
    refs: [
      { title: 'Well-Architected Framework: 신뢰성', url: 'https://docs.cloud.google.com/architecture/framework/reliability' },
    ],
  },
  {
    id: 'c06-06',
    chapter: 6,
    domain: 1,
    topic: 'NCC 사이트 간 데이터 전송',
    question:
      '글로벌 물류 회사의 뉴욕·시드니·도쿄 사무소는 각각 Interconnect 또는 HA VPN으로 Google Cloud에 연결되어 있다. 사무소 간 WAN 전용 회선 비용이 비싸 이를 줄이고, 사무소끼리도 Google 네트워크를 통해 데이터를 주고받고 싶다. 가장 적합한 방법은?',
    options: [
      '사무소마다 서로 VPN을 직접 연결하는 전체 메시를 만든다.',
      'Network Connectivity Center 허브에 각 사무소의 연결을 스포크로 등록하고 사이트 간 데이터 전송을 사용 설정한다.',
      '각 사무소 트래픽을 Cloud NAT로 인터넷에 내보낸다.',
      'VPC 피어링으로 사무소를 연결한다.',
    ],
    answer: [1],
    explanations: [
      '사이트 간 전체 메시 VPN은 사이트가 늘수록 관리가 기하급수적으로 복잡해진다.',
      'NCC의 사이트 간 데이터 전송은 각 사이트의 연결 리소스를 허브의 스포크로 등록해 Google 네트워크를 WAN의 일부로 사용하게 하며, 스포크 간 풀 메시 연결을 제공한다.',
      'Cloud NAT는 인터넷 아웃바운드용으로 사이트 간 사설 연결이 아니다.',
      'VPC 피어링은 VPC 간 연결 기능으로 온프레미스 사이트를 연결하지 않는다.',
    ],
    principle:
      '여러 지사·데이터센터를 Google 네트워크로 연결하는 WAN은 NCC 허브-스포크(사이트 간 데이터 전송)로 구성한다.',
    refs: [
      { title: 'NCC 사이트 간 데이터 전송 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/data-transfer' },
    ],
  },
  {
    id: 'c06-07',
    chapter: 6,
    domain: 1,
    topic: '리전 간 내부 서비스 고가용성',
    question:
      '사내 전용 인증 API는 VPC 내부 클라이언트만 사용하며, 현재 us-east1의 리전 내부 애플리케이션 부하 분산기 뒤에서 실행된다. 새 요구사항은 us-east1 전체 장애 시에도 다른 리전의 백엔드로 자동 전환되는 것이며, 서비스는 인터넷에 노출되면 안 된다. 가장 적합한 구성은?',
    options: [
      '전역 외부 애플리케이션 부하 분산기로 바꾸고 방화벽으로 사내 IP만 허용한다.',
      '두 리전에 백엔드를 두고 리전 간 내부 애플리케이션 부하 분산기를 사용한다(필요 시 DNS 장애 조치 정책과 함께).',
      '다른 리전에 두 번째 리전 부하 분산기를 만들고 장애 시 클라이언트 설정을 수동으로 바꾼다.',
      '인증 API를 단일 VM으로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '외부 부하 분산기는 인터넷에 노출되므로 방화벽으로 막더라도 요구사항에 어긋난다.',
      '리전 간 내부 애플리케이션 부하 분산기는 여러 리전의 백엔드로 내부 트래픽을 분산하고 한 리전이 실패하면 다른 리전으로 전환할 수 있다. 내부 전용이라 노출 요구도 충족한다.',
      '수동 전환은 RTO가 길고 실수 위험이 있다.',
      '단일 VM은 가용성이 오히려 낮아진다.',
    ],
    principle:
      '내부 서비스의 리전 장애 대비는 리전 간 내부 부하 분산기(+DNS 라우팅 정책)로, 외부 노출 없이 멀티 리전 백엔드를 구성한다.',
    refs: [
      { title: '내부 애플리케이션 부하 분산기 개요', url: 'https://docs.cloud.google.com/load-balancing/docs/l7-internal' },
    ],
  },
  {
    id: 'c06-08',
    chapter: 6,
    domain: 1,
    topic: 'Cloud DNS 라우팅 정책',
    question:
      '회사는 한국과 독일 리전에 같은 서비스를 배포했다. 규정상 한국 사용자는 한국 리전으로, 유럽 사용자는 독일 리전으로 연결되어야 하고, 한 리전의 상태 확인이 실패하면 다른 리전으로 넘겨야 한다. 서비스는 리전 외부 부하 분산기(리전별 IP)로 노출된다. DNS 계층에서 어떻게 구성해야 하는가?',
    options: [
      '단일 A 레코드에 한국 IP만 등록한다.',
      'Cloud DNS 라우팅 정책(위치 기반 정책과 상태 확인 기반 장애 조치)을 사용해 사용자 위치별로 응답하고 비정상 대상은 제외한다.',
      '두 IP를 같은 가중치의 라운드 로빈으로 등록한다.',
      '사용자에게 국가별 URL을 따로 안내한다.',
    ],
    answer: [1],
    explanations: [
      '단일 IP는 위치 기반 라우팅과 장애 조치를 제공하지 않는다.',
      'Cloud DNS 라우팅 정책은 질의 출처 위치에 따라 다른 응답(위치 기반)을 주고, 상태 확인과 결합해 비정상 대상을 제외하거나 장애 조치할 수 있다.',
      '가중치 라운드 로빈은 위치와 무관하게 분산해 규정을 위반할 수 있다.',
      '사용자에게 선택을 맡기면 일관성이 없고 장애 조치도 불가능하다.',
    ],
    principle:
      '리전 부하 분산기를 쓰는 멀티 리전 서비스는 DNS 라우팅 정책(위치·가중치·장애 조치)으로 사용자를 분배한다. 단일 애니캐스트 IP가 필요하면 전역 부하 분산기를 쓴다.',
    refs: [
      { title: 'DNS 라우팅 정책 및 상태 확인', url: 'https://docs.cloud.google.com/dns/docs/routing-policies-overview' },
    ],
  },
  {
    id: 'c06-09',
    chapter: 6,
    domain: 1,
    topic: 'Oracle 워크로드 이전',
    question:
      '대형 유통사의 핵심 ERP는 Oracle Exadata의 고유 기능과 RAC(Real Application Clusters)에 의존한다. 회사는 애플리케이션 계층은 Google Cloud로 옮기고 BigQuery 분석과도 가깝게 연결하고 싶지만, DB 엔진 변경은 위험이 커서 원하지 않는다. 가장 적합한 선택은?',
    options: [
      'Oracle을 Cloud SQL for PostgreSQL로 즉시 변환한다.',
      'Oracle Database@Google Cloud를 사용해 Google Cloud 데이터센터의 OCI Exadata 기반 Oracle 서비스로 이전한다.',
      'Oracle을 Compute Engine 일반 VM에 설치해 RAC를 구성한다.',
      'DB는 온프레미스에 두고 애플리케이션만 인터넷으로 연결한다.',
    ],
    answer: [1],
    explanations: [
      'DB 엔진 변환은 대규모 재작업과 위험이 따르며 “엔진 변경을 원하지 않음” 요구에 어긋난다.',
      'Oracle Database@Google Cloud는 Google Cloud 데이터센터에 배치된 OCI Exadata 하드웨어에서 Oracle 데이터베이스 서비스를 제공해, 기존 Oracle 기능을 유지하면서 Google Cloud 워크로드와 낮은 지연으로 통합할 수 있다.',
      '일반 VM에서의 RAC 구성은 공유 스토리지 등 요건 충족과 지원 측면에서 제약이 크다.',
      '인터넷 경유 연결은 지연과 보안 문제가 있다.',
    ],
    principle:
      'DB 엔진 의존도가 높은 워크로드는 “엔진 유지 + 위치 이전”(Oracle Database@Google Cloud 등)을 먼저 검토하고, 현대화는 별도 단계로 계획한다.',
    refs: [
      { title: 'Oracle Database@Google Cloud 개요', url: 'https://docs.cloud.google.com/oracle/database/docs/overview' },
    ],
  },
  {
    id: 'c06-10',
    chapter: 6,
    domain: 1,
    topic: '서버리스 GPU 추론',
    question:
      '스타트업이 소형 오픈 모델로 이미지 캡션을 생성하는 API를 제공한다. 요청은 하루 중 산발적으로 들어오고, 요청이 없을 때 GPU 비용을 내고 싶지 않다. GPU 가속이 필요하지만 클러스터·노드 관리는 원하지 않는다. 가장 적합한 선택은?',
    options: [
      'GPU가 연결된 Compute Engine VM을 24시간 실행한다.',
      'GPU를 사용하는 Cloud Run 서비스로 배포해 요청에 따라 확장하고 유휴 시 축소되게 한다.',
      'GKE Standard 클러스터에 GPU 노드 풀을 상시 유지한다.',
      'CPU만으로 추론하고 응답 지연은 감수한다.',
    ],
    answer: [1],
    explanations: [
      '상시 GPU VM은 유휴 시간에도 비용이 발생한다.',
      'Cloud Run은 서비스에 GPU를 연결할 수 있어, 서버리스 방식으로 요청에 따라 확장하고 유휴 시 축소해 산발적 추론 트래픽에 비용 효율적이다.',
      '상시 GPU 노드 풀은 관리 부담과 유휴 비용이 있다.',
      'GPU가 필요한 워크로드를 CPU로 돌리면 지연과 처리 비용이 커질 수 있다.',
    ],
    principle:
      '산발적 추론은 서버리스 GPU(Cloud Run), 상시 고부하·세밀한 제어는 GKE·VM, 대규모 관리형 서빙은 Agent Platform 엔드포인트를 검토한다.',
    refs: [
      { title: 'Cloud Run 서비스의 GPU 지원', url: 'https://docs.cloud.google.com/run/docs/configuring/services/gpu' },
    ],
  },
  {
    id: 'c06-11',
    chapter: 6,
    domain: 1,
    topic: '생성형 AI 평가',
    question:
      '금융사가 고객 문의 요약 기능에 사용할 모델과 프롬프트를 선택하려 한다. 후보 모델 세 개와 프롬프트 변형 여러 개가 있으며, “느낌”이 아니라 요약 품질(사실성·완결성)과 비용·지연을 근거로 결정하고, 이후 모델 업데이트 때도 같은 방식으로 회귀를 확인하고 싶다. 가장 적절한 방법은?',
    options: [
      '담당자가 몇 개 예시를 읽어 보고 마음에 드는 것을 고른다.',
      '대표 평가 데이터 세트와 평가 기준을 정의하고, Agent Platform의 생성형 AI 평가(Evals)로 후보를 비교하며, 같은 평가를 모델·프롬프트 변경 시 반복 실행한다.',
      '가장 큰 모델을 무조건 선택한다.',
      '운영에 배포한 뒤 고객 불만으로 판단한다.',
    ],
    answer: [1],
    explanations: [
      '소수 예시에 의존한 주관적 판단은 재현성과 신뢰성이 낮다.',
      '대표 데이터와 명확한 지표로 후보를 체계적으로 평가하면 품질·비용·지연을 근거로 선택할 수 있고, 같은 평가를 반복해 변경 시 품질 회귀를 감지할 수 있다.',
      '큰 모델이 항상 비용 대비 최선은 아니다.',
      '운영 후 판단은 고객에게 위험을 전가한다.',
    ],
    principle:
      '생성형 AI도 테스트한다: 평가 데이터 세트 + 지표 + 반복 가능한 평가 파이프라인으로 모델·프롬프트를 선택·관리한다.',
    refs: [
      { title: '생성형 AI 평가 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/evaluation-overview' },
    ],
  },
  {
    id: 'c06-12',
    chapter: 6,
    domain: 1,
    topic: '처리 불가 메시지(데드 레터)',
    question:
      '주문 처리 구독자가 형식이 잘못된 메시지 하나를 처리하지 못해 계속 재시도하고, 그동안 같은 메시지가 반복 전달되며 로그와 비용이 폭증했다. 정상 메시지 처리는 계속되어야 하고, 문제 메시지는 나중에 분석할 수 있어야 한다. 가장 적절한 설계는?',
    options: [
      '구독자가 오류 메시지를 확인(ack)해 조용히 버린다.',
      '구독에 데드 레터 주제와 최대 전송 시도 횟수를 설정해, 반복 실패한 메시지를 별도 주제로 옮기고 모니터링한다.',
      '재시도 간격을 0으로 줄인다.',
      '주제를 삭제하고 다시 만든다.',
    ],
    answer: [1],
    explanations: [
      '조용히 버리면 데이터 손실이 발생하고 원인 분석이 불가능하다.',
      '데드 레터 주제는 최대 전송 시도 횟수를 넘긴 메시지를 별도 주제로 전달해, 정상 흐름을 막지 않고 문제 메시지를 격리·분석할 수 있게 한다.',
      '재시도 간격을 줄이면 폭주가 더 심해진다.',
      '주제 재생성은 모든 메시지와 구독을 잃는다.',
    ],
    principle:
      '비동기 처리에는 “포이즌 메시지” 대비가 필수다: 재시도 정책 + 데드 레터 격리 + 모니터링·재처리 절차.',
    refs: [
      { title: 'Pub/Sub 데드 레터 주제', url: 'https://docs.cloud.google.com/pubsub/docs/dead-letter-topics' },
    ],
  },
  // ───────── 도메인 2: 관리·프로비저닝 (9) ─────────
  {
    id: 'c06-13',
    chapter: 6,
    domain: 2,
    topic: 'Cloud Run 결제(CPU 할당) 설정',
    question:
      'Cloud Run 서비스가 HTTP 응답을 먼저 반환한 뒤, 백그라운드 스레드에서 분석 이벤트를 모아 1분마다 외부로 전송한다. 그런데 요청이 없는 동안 백그라운드 작업이 멈추거나 매우 느려져 이벤트가 유실된다. 가장 적절한 조치는?',
    options: [
      '최대 인스턴스 수를 늘린다.',
      '서비스의 결제 설정을 인스턴스 기반 결제(CPU 항상 할당)로 바꾸고, 필요하면 최소 인스턴스를 설정한다.',
      '요청 타임아웃을 줄인다.',
      '동시성을 1로 설정한다.',
    ],
    answer: [1],
    explanations: [
      '인스턴스 수는 요청 처리 용량과 관련 있을 뿐 요청 사이의 CPU 할당 문제를 해결하지 못한다.',
      '요청 기반 결제에서는 요청을 처리하지 않을 때 CPU가 크게 제한된다. 인스턴스 기반 결제로 바꾸면 인스턴스 수명 동안 CPU가 할당되어 백그라운드 작업이 계속 실행된다(비용 모델이 달라진다).',
      '타임아웃 단축은 백그라운드 작업과 무관하다.',
      '동시성 1은 인스턴스 수만 늘리고 문제를 해결하지 못한다.',
    ],
    principle:
      'Cloud Run에서 응답 이후·요청 사이 백그라운드 작업이 필요하면 인스턴스 기반 결제(CPU 항상 할당)를 선택한다. 순수 요청-응답이면 요청 기반이 저렴하다.',
    refs: [
      { title: 'Cloud Run 결제 설정', url: 'https://docs.cloud.google.com/run/docs/configuring/billing-settings' },
    ],
  },
  {
    id: 'c06-14',
    chapter: 6,
    domain: 2,
    topic: 'GKE Gateway API 트래픽 제어',
    question:
      'GKE에서 운영하는 쇼핑 API의 새 버전을 사내 직원(특정 HTTP 헤더를 가진 요청)에게만 먼저 노출하고, 이후 일반 사용자 트래픽의 10%로 확대하려 한다. 선언적인 Kubernetes 리소스로 관리하고 싶다. 가장 적합한 방법은?',
    options: [
      '두 버전을 같은 Service 셀렉터에 묶어 파드 수 비율로 나눈다.',
      'GKE Gateway API의 HTTPRoute로 헤더 기반 매칭과 가중치 기반 트래픽 분할 규칙을 정의한다.',
      'DNS 레코드를 두 개 만들어 직원에게 다른 주소를 알려 준다.',
      '새 버전을 별도 클러스터에 배포하고 방화벽으로 구분한다.',
    ],
    answer: [1],
    explanations: [
      '파드 수 비율은 부정확하고 헤더 기반 라우팅이 불가능하다.',
      'Gateway API는 HTTPRoute로 헤더·경로 기반 매칭과 백엔드 간 가중치 분할을 선언적으로 표현할 수 있어, 내부 사용자 우선 노출과 점진적 비율 확대를 모두 구현한다.',
      'DNS 분리는 비율 제어가 안 되고 사용자 경험이 달라진다.',
      '별도 클러스터는 과도한 비용과 관리 부담을 만든다.',
    ],
    principle:
      'Kubernetes에서 L7 트래픽 제어(헤더 라우팅·가중치 분할)는 Gateway API로 선언적으로 관리한다.',
    refs: [
      { title: 'GKE Gateway API', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/gateway-api' },
    ],
  },
  {
    id: 'c06-15',
    chapter: 6,
    domain: 2,
    topic: 'GKE 커스텀 컴퓨팅 클래스',
    question:
      'GKE 클러스터에서 배치 워크로드는 가능하면 Spot VM에서 실행하되, Spot 용량이 없으면 자동으로 표준 VM으로 대체되어야 한다. 또한 특정 머신 계열을 우선 사용하도록 선호도를 선언하고 싶다. 노드 풀을 일일이 수동 관리하지 않으려면?',
    options: [
      'Spot 노드 풀만 두고 용량이 없으면 작업을 포기한다.',
      '우선순위(Spot 우선 → 표준 대체, 선호 머신 계열)를 정의한 커스텀 컴퓨팅 클래스를 만들고 워크로드가 이를 선택하게 한다.',
      '매번 운영자가 Spot 가용성을 확인해 노드 풀을 바꾼다.',
      '모든 워크로드를 표준 VM으로만 실행한다.',
    ],
    answer: [1],
    explanations: [
      'Spot 용량 부족 시 작업이 실행되지 않아 처리 지연이 발생한다.',
      '커스텀 컴퓨팅 클래스는 노드 속성의 우선순위 목록과 대체(fallback) 규칙을 선언해, GKE가 가능한 옵션 중에서 자동으로 노드를 프로비저닝하게 한다.',
      '수동 관리는 느리고 오류가 잦다.',
      '표준 VM만 쓰면 비용 절감 기회를 놓친다.',
    ],
    principle:
      'GKE에서 비용·가용성 선호를 선언적으로 표현하려면 컴퓨팅 클래스로 우선순위와 대체 규칙을 정의한다.',
    refs: [
      { title: '커스텀 컴퓨팅 클래스 정보', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/about-custom-compute-classes' },
    ],
  },
  {
    id: 'c06-16',
    chapter: 6,
    domain: 2,
    topic: 'MIG 자동 확장(큐 기반 지표)',
    question:
      'VM 기반 이미지 처리 워커 MIG가 Pub/Sub 구독에서 작업을 가져와 처리한다. CPU 사용률 기반 자동 확장을 써 보니 작업이 쌓여도 CPU가 I/O 대기로 낮게 유지되어 확장이 늦다. 대기 작업량에 따라 확장하려면?',
    options: [
      'CPU 목표 사용률을 10%로 낮춘다.',
      'Pub/Sub 구독의 미전달(backlog) 메시지 수 같은 Cloud Monitoring 지표를 기준으로 MIG 자동 확장을 구성한다.',
      '인스턴스 수를 최대로 고정한다.',
      '부하 분산기 사용률 기반 자동 확장을 사용한다.',
    ],
    answer: [1],
    explanations: [
      'CPU 목표를 낮춰도 CPU가 작업량을 반영하지 않는 근본 문제는 해결되지 않고 과잉 확장이 생길 수 있다.',
      'MIG는 Cloud Monitoring 지표를 기준으로 자동 확장할 수 있다. 대기 메시지 수처럼 실제 작업량을 나타내는 지표를 쓰면 부하에 맞게 확장·축소된다.',
      '최대 고정은 유휴 비용이 크다.',
      '워커는 부하 분산기 뒤에 있지 않으므로 부하 분산기 사용률 지표가 없다.',
    ],
    principle:
      '자동 확장 신호는 실제 부하를 가장 잘 반영하는 지표로 고른다. 큐 기반 워커는 대기 작업량(백로그)이 적합하다.',
    refs: [
      { title: 'Cloud Monitoring 지표 기반 자동 확장', url: 'https://docs.cloud.google.com/compute/docs/autoscaler/scaling-cloud-monitoring-metrics' },
    ],
  },
  {
    id: 'c06-17',
    chapter: 6,
    domain: 2,
    topic: '예측 자동 확장',
    question:
      '출근 시간대(매일 오전 8~9시)에 트래픽이 급증하는 사내 포털은 VM 부팅과 애플리케이션 초기화에 약 5분이 걸린다. CPU 기반 자동 확장은 급증 후에야 반응해 매일 아침 지연이 발생한다. 가장 적절한 개선은?',
    options: [
      '자동 확장을 끄고 하루 종일 최대 규모로 운영한다.',
      'MIG 자동 확장기에 예측 자동 확장을 사용 설정해 과거 부하 패턴을 바탕으로 미리 확장되게 한다.',
      'CPU 목표 사용률을 95%로 올린다.',
      '인스턴스 템플릿의 머신 유형을 줄인다.',
    ],
    answer: [1],
    explanations: [
      '상시 최대 규모는 비용 낭비가 크다.',
      '예측 자동 확장은 과거 부하의 주기적 패턴을 학습해 예상 부하 전에 미리 인스턴스를 늘려, 초기화 시간이 긴 애플리케이션의 급증 대응을 개선한다.',
      '목표 사용률을 높이면 확장이 더 늦어진다.',
      '작은 머신은 급증 대응 문제를 해결하지 못한다.',
    ],
    principle:
      '초기화가 오래 걸리고 부하 패턴이 주기적이면 예측 자동 확장(또는 일정 기반 확장)으로 미리 용량을 준비한다.',
    refs: [
      { title: '예측 자동 확장', url: 'https://docs.cloud.google.com/compute/docs/autoscaler/predictive-autoscaling' },
    ],
  },
  {
    id: 'c06-18',
    chapter: 6,
    domain: 2,
    topic: '법적 보존(객체 홀드)',
    question:
      '보험사의 청구 문서 버킷에는 5년 보존 정책이 있다. 그런데 소송이 진행 중인 특정 청구 건의 문서들은 보존 기간이 끝나도 소송이 종결될 때까지 삭제되면 안 된다. 다른 문서는 정상적으로 수명 주기에 따라 삭제되어야 한다. 가장 적절한 방법은?',
    options: [
      '버킷 전체 보존 기간을 20년으로 늘린다.',
      '소송 관련 객체에 임시 홀드(temporary hold)를 설정하고, 소송 종결 후 해제한다.',
      '소송 문서를 직원 노트북에 복사해 둔다.',
      '버킷의 수명 주기 규칙을 모두 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '전체 기간 연장은 관련 없는 문서까지 불필요하게 오래 보관해 비용과 개인정보 위험을 늘린다.',
      '객체 홀드는 개별 객체에 설정해, 홀드가 해제될 때까지 보존 정책·수명 주기와 무관하게 삭제되지 않게 한다. 소송 같은 법적 보존에 적합하다.',
      '개인 기기 보관은 보안·무결성 요구를 충족하지 못한다.',
      '수명 주기 규칙 삭제는 모든 문서에 영향을 준다.',
    ],
    principle:
      '버킷 전체 규칙(보존 정책·수명 주기)과 개별 예외(객체 홀드)를 구분해 데이터 보존을 설계한다.',
    refs: [
      { title: '객체 홀드', url: 'https://docs.cloud.google.com/storage/docs/object-holds' },
    ],
  },
  {
    id: 'c06-19',
    chapter: 6,
    domain: 2,
    topic: 'BigQuery 파티션 만료',
    question:
      '웹 로그를 일 단위 파티션 BigQuery 테이블에 적재한다. 개인정보 처리 방침상 원시 로그는 400일이 지나면 삭제해야 하고, 오래된 데이터 저장 비용도 줄이고 싶다. 스크립트 없이 자동으로 처리하려면?',
    options: [
      '매일 DELETE 쿼리를 실행하는 cron 작업을 만든다.',
      '테이블에 파티션 만료 기간을 400일로 설정한다.',
      '테이블 전체 만료를 400일로 설정한다.',
      '1년마다 테이블을 새로 만든다.',
    ],
    answer: [1],
    explanations: [
      'DELETE 작업은 가능하지만 스크립트 운영과 쿼리 비용이 발생한다.',
      '파티션 만료를 설정하면 각 파티션이 지정한 기간이 지나면 자동으로 삭제되어, 보존 기간 준수와 비용 절감을 스크립트 없이 달성한다.',
      '테이블 전체 만료는 테이블 자체를 삭제해 최근 데이터까지 사라진다.',
      '테이블 재생성은 수작업이며 기간 단위가 맞지 않는다.',
    ],
    principle:
      '시간 기반 보존은 파티션 만료(BigQuery)·수명 주기(Cloud Storage)·버킷 보존 정책 같은 선언적 설정으로 자동화한다.',
    refs: [
      { title: '파티션을 나눈 테이블 관리', url: 'https://docs.cloud.google.com/bigquery/docs/managing-partitioned-tables' },
    ],
  },
  {
    id: 'c06-20',
    chapter: 6,
    domain: 2,
    topic: '관리형 노트북 환경',
    question:
      '데이터 과학자 30명이 각자 노트북 PC에 Python 환경을 만들어 분석하다 보니 데이터가 개인 기기로 복사되고 라이브러리 버전도 제각각이다. 보안팀은 데이터가 Google Cloud 밖으로 나가지 않고, IAM으로 접근을 통제하며, 필요할 때 GPU를 쓸 수 있는 관리형 노트북 환경을 원한다. 가장 적합한 선택은?',
    options: [
      '공용 VM 하나에 모든 사람이 SSH로 접속해 Jupyter를 공유한다.',
      'Colab Enterprise(또는 Agent Platform Workbench)를 사용해 IAM·VPC 설정이 적용된 관리형 노트북 런타임을 제공한다.',
      '데이터 과학자에게 데이터를 USB로 제공한다.',
      '개인 노트북 PC 사용을 계속 허용한다.',
    ],
    answer: [1],
    explanations: [
      '공용 VM 공유는 격리·감사·확장성이 부족하다.',
      'Colab Enterprise와 Workbench는 Google Cloud 안에서 실행되는 관리형 노트북 환경으로, IAM 기반 접근 통제와 네트워크·보안 설정을 적용하고 필요 시 GPU 런타임을 사용할 수 있다.',
      'USB 제공은 데이터 유출 위험을 키운다.',
      '개인 PC는 보안팀 요구에 정면으로 어긋난다.',
    ],
    principle:
      '분석 환경을 데이터 가까이(클라우드 안) 두고 관리형으로 통제하면 보안·재현성·확장성을 함께 얻는다.',
    refs: [
      { title: 'Colab Enterprise 소개', url: 'https://docs.cloud.google.com/colab/docs/introduction' },
    ],
  },
  {
    id: 'c06-21',
    chapter: 6,
    domain: 2,
    topic: '번역 품질 통제(용어집)',
    question:
      '가전 회사가 제품 매뉴얼을 12개 언어로 자동 번역한다. 브랜드명과 기능 이름(예: “SmartWash”)이 언어마다 다르게 번역되거나 일반 단어로 바뀌는 문제가 있다. 자체 번역 모델을 학습하지 않고 용어를 일관되게 유지하려면?',
    options: [
      '번역 후 사람이 모든 문서를 다시 쓴다.',
      'Cloud Translation의 용어집(glossary)에 브랜드·기능 용어와 언어별 번역을 정의해 번역 요청에 적용한다.',
      'Speech-to-Text로 매뉴얼을 읽어 번역한다.',
      '브랜드명을 이미지로 바꿔 번역에서 제외한다.',
    ],
    answer: [1],
    explanations: [
      '전면 수작업은 자동 번역의 이점을 없앤다.',
      '용어집은 특정 용어를 지정한 방식으로 번역(또는 원문 유지)하도록 강제해, 모델 학습 없이 용어 일관성을 확보한다.',
      'Speech-to-Text는 음성 인식용이다.',
      '텍스트를 이미지로 바꾸면 검색·접근성·유지보수가 나빠진다.',
    ],
    principle:
      '사전 학습 API를 먼저 설정(용어집·파라미터)으로 맞추고, 그래도 부족할 때 맞춤 모델을 검토한다.',
    refs: [
      { title: 'Cloud Translation 용어집', url: 'https://docs.cloud.google.com/translate/docs/advanced/glossary' },
    ],
  },
  // ───────── 도메인 3: 보안·규정 준수 (9) ─────────
  {
    id: 'c06-22',
    chapter: 6,
    domain: 3,
    topic: 'IAM 거부 정책',
    question:
      '보안팀은 운영 폴더 아래 모든 프로젝트에서, 프로젝트 소유자를 포함해 누구도 Cloud KMS 키 버전을 폐기(destroy)할 수 없게 하고, 보안팀의 특정 그룹만 예외로 두고 싶다. 허용 정책(allow)만으로는 여러 프로젝트 관리자가 권한을 가진 역할을 부여할 수 있어 통제가 어렵다. 가장 적절한 방법은?',
    options: [
      '각 프로젝트 관리자에게 키를 폐기하지 말라고 안내한다.',
      '운영 폴더에 IAM 거부 정책을 연결해 해당 권한을 거부하고, 보안팀 그룹을 예외 주 구성원으로 지정한다.',
      '모든 사용자에게서 Cloud KMS 뷰어 역할을 제거한다.',
      'KMS 키를 삭제해 폐기 자체를 불가능하게 한다.',
    ],
    answer: [1],
    explanations: [
      '안내는 기술적 통제가 아니다.',
      '거부 정책은 허용 정책과 관계없이 지정한 권한 사용을 차단하며, 폴더·조직 수준에 연결하면 하위 전체에 적용된다. 예외 주 구성원을 둘 수 있어 보안팀만 허용하는 구성이 가능하다.',
      '뷰어 역할 제거는 폐기 권한과 무관하다.',
      '키 삭제는 데이터 복호화를 불가능하게 만드는 파괴적 조치다.',
    ],
    principle:
      '“누구든 절대 하면 안 되는 작업”은 허용 정책이 아니라 거부 정책으로 상위 수준에서 차단한다(예외는 명시적으로).',
    refs: [
      { title: 'IAM 거부 정책', url: 'https://docs.cloud.google.com/iam/docs/deny-overview' },
    ],
  },
  {
    id: 'c06-23',
    chapter: 6,
    domain: 3,
    topic: '보안 태그 기반 방화벽',
    question:
      '공유 VPC에서 여러 팀이 VM을 운영한다. 방화벽 정책은 “PCI” 등급 VM으로의 접근을 엄격히 제한해야 하는데, 네트워크 태그는 인스턴스 수정 권한만 있으면 누구나 붙일 수 있어 우회 위험이 있다. 태그 부착 자체를 IAM으로 통제하려면?',
    options: [
      '네트워크 태그 이름을 복잡하게 만든다.',
      'IAM으로 관리되는 보안 태그(Resource Manager 태그)를 만들어 VM에 연결하고, 방화벽 정책 규칙의 대상·소스로 사용한다.',
      'VM마다 외부 IP를 제거한다.',
      '방화벽 규칙을 IP 범위 기반으로만 관리한다.',
    ],
    answer: [1],
    explanations: [
      '이름을 복잡하게 해도 권한 있는 사람은 붙일 수 있다.',
      '보안 태그는 태그 키·값에 대한 IAM 권한이 있어야만 리소스에 연결할 수 있어, 방화벽 정책의 대상 지정을 거버넌스 통제 아래 둘 수 있다.',
      '외부 IP 제거는 인터넷 노출을 줄일 뿐 내부 접근 통제 문제를 해결하지 못한다.',
      'IP 기반 규칙은 동적 환경에서 관리가 어렵고 오류가 잦다.',
    ],
    principle:
      '방화벽 대상 지정의 신뢰성: IP < 네트워크 태그 < 서비스 계정·보안 태그(IAM으로 부착 통제).',
    refs: [
      { title: '방화벽용 태그 개요', url: 'https://docs.cloud.google.com/firewall/docs/tags-firewalls-overview' },
    ],
  },
  {
    id: 'c06-24',
    chapter: 6,
    domain: 3,
    topic: 'VPC 서비스 제어와 온프레미스 사설 연결',
    question:
      '온프레미스 서버가 Interconnect를 통해 VPC 서비스 제어 경계 안의 Cloud Storage와 BigQuery API를 호출해야 한다. 보안팀은 이 트래픽이 인터넷 경로를 쓰지 않고, 경계로 보호되는 서비스에만 접근하는 전용 VIP를 사용하길 원한다. 어떻게 구성해야 하는가?',
    options: [
      '온프레미스 서버에 공인 IP를 부여해 googleapis.com 공개 엔드포인트를 사용한다.',
      '온프레미스 DNS에서 googleapis.com을 restricted.googleapis.com VIP로 해석하게 하고, Cloud Router로 해당 VIP 범위를 광고해 Interconnect 경로로 접근한다.',
      'Cloud NAT를 온프레미스에 설치한다.',
      '경계를 삭제하고 방화벽으로만 보호한다.',
    ],
    answer: [1],
    explanations: [
      '공개 엔드포인트와 인터넷 경로 사용은 보안 요구에 어긋난다.',
      'restricted.googleapis.com VIP는 VPC 서비스 제어가 지원하는 서비스에만 접근하도록 설계된 사설 연결 경로다. DNS와 경로 광고를 구성하면 온프레미스 트래픽이 하이브리드 연결을 통해 경계 안 서비스에 접근한다.',
      'Cloud NAT는 Google Cloud의 관리형 서비스로 온프레미스에 설치하는 제품이 아니다.',
      '경계 삭제는 데이터 유출 방지를 포기하는 것이다.',
    ],
    principle:
      '온프레미스 → Google API 사설 접근은 비공개 Google 액세스 VIP(private/restricted)와 DNS·경로 광고로 구성한다. 경계 보호가 필요하면 restricted VIP를 쓴다.',
    refs: [
      { title: 'VPC 서비스 제어를 위한 사설 연결 설정', url: 'https://docs.cloud.google.com/vpc-service-controls/docs/set-up-private-connectivity' },
    ],
  },
  {
    id: 'c06-25',
    chapter: 6,
    domain: 3,
    topic: '키 순환',
    question:
      '보안 표준은 데이터 암호화 키를 90일마다 교체하도록 요구한다. 회사는 Cloud KMS 키로 Cloud Storage와 BigQuery를 CMEK 암호화하고 있으며, 키 교체 때마다 데이터를 전부 다시 암호화하는 대규모 작업은 피하고 싶다. 가장 적절한 방법은?',
    options: [
      '90일마다 새 키를 만들어 모든 데이터를 복사해 다시 암호화한다.',
      'Cloud KMS 키에 자동 순환 기간을 설정해 새 기본 키 버전으로 새 데이터를 암호화하고, 기존 데이터는 이전 키 버전으로 계속 복호화되게 한다.',
      '키를 교체하지 않고 예외 승인을 받는다.',
      '키 버전을 교체할 때마다 이전 버전을 즉시 폐기한다.',
    ],
    answer: [1],
    explanations: [
      '전체 재암호화는 요구사항이 아니며 비용과 운영 부담이 크다.',
      '자동 순환은 주기적으로 새 기본 키 버전을 만든다. 새로 쓰는 데이터는 새 버전으로 보호되고, 이전 버전이 활성 상태로 남아 있으므로 기존 데이터는 계속 복호화된다.',
      '예외 승인은 표준 준수를 회피하는 것이다.',
      '이전 버전을 즉시 폐기하면 그 버전으로 암호화된 데이터를 읽을 수 없게 된다.',
    ],
    principle:
      '키 순환은 새 데이터 보호 범위를 제한하는 것이다. 이전 키 버전 폐기는 해당 데이터가 더 이상 필요 없을 때만 한다(암호학적 삭제).',
    refs: [
      { title: '키 순환', url: 'https://docs.cloud.google.com/kms/docs/key-rotation' },
    ],
  },
  {
    id: 'c06-26',
    chapter: 6,
    domain: 3,
    topic: '고객 제공 암호화 키(CSEK)',
    question:
      '연구 기관의 계약 조건상 특정 Cloud Storage 데이터의 암호화 키는 Google Cloud의 어떤 키 관리 서비스에도 저장되어서는 안 되며, 기관이 요청 시점에 키를 직접 제공해야 한다. 외부 키 관리 시스템(EKM) 파트너는 사용하지 않는다. 키 분실 시 데이터 복구가 불가능하다는 점도 수용했다. 가장 적합한 방식은?',
    options: [
      'Google 기본 암호화',
      'Cloud KMS CMEK',
      '고객 제공 암호화 키(CSEK)로 객체를 읽고 쓸 때마다 키를 요청에 포함한다.',
      'Cloud HSM 키',
    ],
    answer: [2],
    explanations: [
      '기본 암호화 키는 Google이 관리한다.',
      'CMEK 키는 Cloud KMS에 저장된다.',
      'CSEK는 고객이 요청마다 키를 제공하고 Google은 키를 영구 저장하지 않는 방식이다. 키 보관 책임이 전적으로 고객에게 있으며, 키를 잃으면 데이터를 복구할 수 없다.',
      'Cloud HSM 키도 Google의 키 관리 서비스 안에 있다.',
    ],
    principle:
      '키 통제 옵션의 트레이드오프: 통제가 커질수록(CSEK·EKM) 운영 책임과 데이터 손실 위험도 커진다. 요구가 명확할 때만 선택한다.',
    refs: [
      { title: '고객 제공 암호화 키', url: 'https://docs.cloud.google.com/storage/docs/encryption/customer-supplied-keys' },
    ],
  },
  {
    id: 'c06-27',
    chapter: 6,
    domain: 3,
    topic: '웹 애플리케이션 취약점 스캔',
    question:
      '보안팀이 App Engine·GKE·Compute Engine에서 운영하는 공개 웹 애플리케이션의 XSS, 혼합 콘텐츠, 오래된 라이브러리 같은 일반적인 취약점을 정기적으로 자동 스캔하고, 발견 사항을 중앙 보안 대시보드에서 관리하고 싶다. 가장 적합한 도구는?',
    options: [
      'VPC 흐름 로그 분석',
      'Security Command Center의 Web Security Scanner',
      'Cloud Profiler',
      'Cloud Asset Inventory',
    ],
    answer: [1],
    explanations: [
      '흐름 로그는 네트워크 메타데이터로 애플리케이션 취약점을 찾지 못한다.',
      'Web Security Scanner는 웹 애플리케이션을 크롤링해 XSS 등 일반적인 취약점을 탐지하고, 결과를 Security Command Center 발견 항목으로 보고한다.',
      'Profiler는 성능 분석 도구다.',
      'Asset Inventory는 리소스 목록·변경 이력을 제공할 뿐 취약점 스캔을 하지 않는다.',
    ],
    principle:
      '보안 테스트는 계층별로: 코드·의존성(SAST/SCA), 이미지(Artifact Analysis), 실행 중 웹 앱(Web Security Scanner), 구성(SCC).',
    refs: [
      { title: 'Web Security Scanner 개요', url: 'https://docs.cloud.google.com/security-command-center/docs/concepts-web-security-scanner-overview' },
    ],
  },
  {
    id: 'c06-28',
    chapter: 6,
    domain: 3,
    topic: '네트워크 침입 탐지·방지',
    question:
      '금융사가 VPC 내부 워크로드 간(동서) 트래픽과 인터넷으로 나가는 트래픽에서 악성코드, 명령·제어(C2) 통신, 알려진 취약점 공격 시그니처를 탐지하고 차단하길 원한다. 별도의 서드파티 방화벽 VM을 직접 운영하는 부담은 피하고 싶다. 가장 적합한 방법은?',
    options: [
      'Cloud Armor 보안 정책',
      'Cloud Next Generation Firewall(Cloud NGFW)의 침입 탐지·방지 서비스',
      'VPC 방화벽 규칙의 포트 차단만 사용',
      'Cloud NAT 로깅',
    ],
    answer: [1],
    explanations: [
      'Cloud Armor는 외부 부하 분산기 앞단의 L7 보호로, VPC 내부 동서 트래픽을 검사하지 않는다.',
      'Cloud NGFW의 침입 탐지·방지 서비스는 Google이 관리하는 방화벽 엔드포인트로 워크로드 트래픽을 투명하게 검사해 위협 시그니처를 탐지하고 차단한다. 별도 방화벽 VM 운영이 필요 없다.',
      '포트 차단은 허용된 포트 안의 악성 트래픽을 탐지하지 못한다.',
      'NAT 로깅은 연결 기록일 뿐 위협을 차단하지 않는다.',
    ],
    principle:
      '네트워크 보안 계층: L3/L4 방화벽 정책 → 위협 시그니처 기반 IPS(Cloud NGFW) → L7 WAF(Cloud Armor).',
    refs: [
      { title: 'Cloud NGFW 침입 탐지·방지 서비스', url: 'https://docs.cloud.google.com/firewall/docs/about-intrusion-prevention' },
    ],
  },
  {
    id: 'c06-29',
    chapter: 6,
    domain: 3,
    topic: 'PCI DSS 범위 축소',
    question:
      '온라인 쇼핑몰은 결제 처리 서비스와 일반 상품 서비스가 같은 VPC와 프로젝트에 섞여 있어, 감사에서 전체 환경이 PCI DSS 범위에 포함된다는 판정을 받았다. 감사 범위와 비용을 줄이려면 어떤 아키텍처 변경이 가장 효과적인가?',
    options: [
      '모든 서비스에 같은 PCI 통제를 적용해 범위를 유지한다.',
      '카드 데이터를 처리하는 구성 요소를 전용 프로젝트·네트워크로 분리하고, 경계에서 필요한 트래픽만 허용하며, 가능한 경우 토큰화로 카드 데이터를 다루는 시스템 수를 줄인다.',
      '결제 서비스 로그를 모두 끈다.',
      '상품 서비스를 온프레미스로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '범위 유지는 불필요한 감사 비용과 운영 부담을 계속 만든다.',
      '카드 데이터 환경을 분리하고 통제된 연결만 허용하면 PCI 범위가 해당 구성 요소로 좁아진다. 토큰화로 카드 번호를 다루는 시스템 자체를 줄이면 효과가 더 커진다.',
      '로그를 끄면 감사 요건을 위반한다.',
      '위치를 옮기는 것은 범위 분리의 본질(세분화·통제)과 무관하다.',
    ],
    principle:
      '규정 범위 축소의 핵심은 분리(세그먼테이션)와 민감 데이터 최소화(토큰화)다.',
    refs: [
      { title: 'Google Cloud PCI DSS 규정 준수', url: 'https://cloud.google.com/security/compliance/pci-dss' },
    ],
  },
  {
    id: 'c06-30',
    chapter: 6,
    domain: 3,
    topic: 'AI 모델 사용 거버넌스',
    question:
      '대기업의 AI 거버넌스 위원회는 법무 검토를 통과한 일부 Google·서드파티 모델만 운영 환경에서 사용하도록 허용하려 한다. 현재는 Agent Platform 권한이 있는 누구나 Model Garden의 다양한 모델을 배포할 수 있다. 조직 전체에 이를 강제하려면?',
    options: [
      '승인 모델 목록을 위키에 공지한다.',
      'Model Garden 조직 정책으로 조직·폴더·프로젝트 수준에서 승인된 모델만 접근·배포할 수 있게 제한한다.',
      '모든 개발자에게서 Agent Platform 권한을 제거한다.',
      '월별로 배포된 모델을 점검해 미승인 모델을 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '위키 공지는 강제력이 없어 미승인 모델 사용을 막지 못한다.',
      'Model Garden 조직 정책은 사용자가 접근·배포할 수 있는 모델을 조직·폴더·프로젝트 수준에서 중앙 통제해, 승인된 모델만 쓰도록 강제한다.',
      '권한 전면 제거는 승인된 AI 활용까지 막는다.',
      '사후 점검은 위반을 예방하지 못한다.',
    ],
    principle:
      'AI 거버넌스도 조직 정책으로 예방적으로 강제한다(허용 모델 목록). 사후 탐지는 보완 수단이다.',
    refs: [
      { title: 'Model Garden 모델 접근 제어', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/control-model-access' },
    ],
  },
  // ───────── 도메인 4: 프로세스 분석·최적화 (8) ─────────
  {
    id: 'c06-31',
    chapter: 6,
    domain: 4,
    topic: '관리형 DB 약정 할인',
    question:
      '회사의 Cloud SQL 인스턴스들은 향후 몇 년간 비슷한 규모로 24시간 운영될 예정이며, 월 비용의 상당 부분을 차지한다. 인스턴스 구성은 가끔 바뀌지만 전체 사용량은 안정적이다. 비용을 줄이는 가장 적절한 방법은?',
    options: [
      'Cloud SQL 인스턴스를 Spot VM으로 바꾼다.',
      'Cloud SQL 약정 사용 할인(지출 기반)을 안정적인 기준 사용량만큼 구매한다.',
      '인스턴스를 매일 밤 삭제했다가 아침에 복원한다.',
      '모든 인스턴스를 가장 작은 머신 유형으로 줄인다.',
    ],
    answer: [1],
    explanations: [
      'Cloud SQL은 Spot VM 옵션이 아니며, 운영 DB에 선점 가능한 자원은 부적합하다.',
      'Cloud SQL 약정 사용 할인은 일정 기간 사용을 약정하는 대신 할인을 제공한다. 안정적인 기준 사용량에 적용하면 구성 변경이 있어도 비용을 줄일 수 있다.',
      '매일 삭제·복원은 운영 위험이 크고 24시간 운영 요구와 맞지 않는다.',
      '성능 요구를 무시한 축소는 장애를 부른다.',
    ],
    principle:
      '약정 할인은 Compute Engine뿐 아니라 여러 관리형 서비스에도 있다. 안정적인 기준 사용량에 적용한다.',
    refs: [
      { title: 'Cloud SQL 약정 사용 할인', url: 'https://docs.cloud.google.com/sql/docs/mysql/cud' },
    ],
  },
  {
    id: 'c06-32',
    chapter: 6,
    domain: 4,
    topic: '유휴 리소스 정리',
    question:
      '프로젝트 수백 개를 운영하는 회사가 비용 점검을 한다. 연결되지 않은 영구 디스크, 사용하지 않는 고정 외부 IP, 몇 주째 CPU 사용이 거의 없는 VM이 흩어져 있다고 의심된다. 이를 효율적으로 찾아 정리하려면 가장 먼저 무엇을 활용해야 하는가?',
    options: [
      '프로젝트 담당자에게 일일이 문의한다.',
      'Recommender(Active Assist)의 유휴 리소스 권장사항(유휴 VM·디스크·IP 등)을 조직 전체에서 확인한다.',
      '모든 디스크를 일괄 삭제한다.',
      '비용 보고서의 총액만 확인한다.',
    ],
    answer: [1],
    explanations: [
      '수작업 문의는 느리고 누락이 많다.',
      'Recommender는 사용 데이터를 분석해 유휴 VM, 연결되지 않은 디스크, 사용하지 않는 IP 등을 식별하고 예상 절감액과 함께 권장사항을 제공한다. 이를 근거로 담당자 확인 후 정리할 수 있다.',
      '무차별 삭제는 필요한 데이터를 잃을 수 있다.',
      '총액만으로는 무엇을 정리해야 할지 알 수 없다.',
    ],
    principle:
      '비용 최적화는 데이터 기반 권장사항(Active Assist)으로 대상을 찾고, 담당자 확인을 거쳐 정리하는 반복 프로세스로 운영한다.',
    refs: [
      { title: 'Recommender 목록', url: 'https://docs.cloud.google.com/recommender/docs/recommenders' },
    ],
  },
  {
    id: 'c06-33',
    chapter: 6,
    domain: 4,
    topic: 'BigQuery 비용 가드레일',
    question:
      '분석가가 실수로 필터 없는 쿼리를 수 PB 테이블에 반복 실행해 하루 만에 큰 비용이 발생했다. 주문형 요금제를 유지하면서 사용자별·프로젝트별 하루 쿼리 처리량에 상한을 두어 이런 사고를 예방하려면?',
    options: [
      '분석가에게 비용 교육만 실시한다.',
      'BigQuery 사용자 정의 할당량으로 사용자별·프로젝트별 일일 쿼리 처리 바이트 한도를 설정한다.',
      '모든 분석가의 BigQuery 권한을 회수한다.',
      '테이블을 모두 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '교육은 필요하지만 실수를 기술적으로 막지 못한다.',
      '사용자 정의 할당량은 프로젝트 또는 사용자 수준에서 하루에 처리할 수 있는 쿼리 데이터 양을 제한해, 실수로 인한 비용 폭증을 예방한다. 쿼리 단위로는 최대 청구 바이트 설정도 활용할 수 있다.',
      '권한 회수는 업무를 막는다.',
      '데이터 삭제는 말이 안 되는 조치다.',
    ],
    principle:
      '사용량 기반 서비스에는 교육 + 기술적 가드레일(할당량·최대 청구 바이트·예산 알림)을 함께 둔다.',
    refs: [
      { title: 'BigQuery 사용자 정의 할당량', url: 'https://docs.cloud.google.com/bigquery/docs/custom-quotas' },
    ],
  },
  {
    id: 'c06-34',
    chapter: 6,
    domain: 4,
    topic: '환경 일관성',
    question:
      '스테이징에서 모든 테스트를 통과한 릴리스가 운영에서만 실패하는 일이 반복된다. 원인을 보니 스테이징과 운영의 방화벽 규칙, 서비스 계정 권한, 인스턴스 설정이 수작업으로 달라져 있었다. 가장 효과적인 개선은?',
    options: [
      '운영 배포 후 문제가 생기면 그때 설정을 맞춘다.',
      '모든 환경을 같은 IaC 코드와 모듈로 만들고 환경별 차이는 변수로만 관리하며, 수동 변경을 금지하고 드리프트를 감지한다.',
      '스테이징 환경을 없애고 운영에서 직접 테스트한다.',
      '운영 환경만 IaC로 관리한다.',
    ],
    answer: [1],
    explanations: [
      '사후 조정은 같은 문제를 반복한다.',
      '같은 코드로 환경을 만들고 차이를 명시적 변수로 제한하면 환경 간 구성 차이가 사라져, 스테이징 검증 결과가 운영에서도 유효해진다. 드리프트 감지로 수동 변경도 잡는다.',
      '스테이징 제거는 위험을 사용자에게 떠넘긴다.',
      '운영만 IaC로 관리하면 환경 차이가 계속 남는다.',
    ],
    principle:
      '“환경 동등성”은 같은 IaC로 만들고 차이는 변수로만 두는 것에서 나온다.',
    refs: [
      { title: 'Terraform 루트 모듈 모범 사례', url: 'https://docs.cloud.google.com/docs/terraform/best-practices/root-modules' },
    ],
  },
  {
    id: 'c06-35',
    chapter: 6,
    domain: 4,
    topic: '운영 지식 이중화',
    question:
      '핵심 결제 시스템의 운영 지식이 엔지니어 한 명에게 집중되어 있다. 그 엔지니어가 휴가 중일 때 장애가 나자 복구에 6시간이 걸렸다. 비즈니스 연속성 관점에서 가장 적절한 개선은?',
    options: [
      '해당 엔지니어의 휴가를 제한한다.',
      '런북과 아키텍처 문서를 작성하고, 온콜 순환과 교차 교육·장애 훈련으로 여러 사람이 복구 절차를 실제로 수행해 보게 한다.',
      '장애가 나면 외부 컨설턴트를 부른다.',
      '결제 시스템의 변경을 금지한다.',
    ],
    answer: [1],
    explanations: [
      '특정인에 대한 의존을 유지하면 위험이 그대로 남고 번아웃을 부른다.',
      '문서화된 런북, 온콜 순환, 교차 교육과 훈련은 지식을 조직에 분산해 한 사람이 없어도 복구할 수 있게 한다(“버스 팩터” 개선).',
      '외부 인력은 시스템 맥락을 몰라 복구가 더 늦어질 수 있다.',
      '변경 금지는 지식 집중 문제를 해결하지 못한다.',
    ],
    principle:
      '비즈니스 연속성은 기술 이중화뿐 아니라 사람과 지식의 이중화(런북·교차 교육·훈련)도 포함한다.',
    refs: [
      { title: '인시던트 및 문제 관리', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence/manage-incidents-and-problems' },
    ],
  },
  {
    id: 'c06-36',
    chapter: 6,
    domain: 4,
    topic: '경영진 대상 트레이드오프 설명',
    question:
      '아키텍트가 경영진에게 DR 전략을 보고해야 한다. 기술 세부 사항보다 의사결정에 필요한 정보가 중요하다. 가장 효과적인 보고 방식은?',
    options: [
      '모든 구성 요소의 기술 사양을 자세히 나열한다.',
      '두세 가지 선택지별로 예상 RTO·RPO, 연간 비용, 남는 위험과 비즈니스 영향을 비교하고, 권고안과 그 이유를 제시한다.',
      '한 가지 안만 제시하고 승인을 요청한다.',
      '결정을 기술팀에 맡기겠다고 한다.',
    ],
    answer: [1],
    explanations: [
      '기술 사양 나열은 경영진의 의사결정에 필요한 비교 정보를 주지 못한다.',
      '선택지별 비즈니스 결과(복구 목표·비용·위험)를 비교하고 권고안을 제시하면, 경영진이 위험 수용 수준과 예산에 따라 근거 있는 결정을 내릴 수 있다.',
      '단일안은 트레이드오프를 숨겨 신뢰를 떨어뜨린다.',
      '위험 수용은 비즈니스 결정이므로 경영진의 판단이 필요하다.',
    ],
    principle:
      '이해관계자 소통은 청중의 결정에 필요한 언어(비용·위험·결과)로, 선택지와 권고를 함께 제시한다.',
    refs: [
      { title: '재해 복구 계획 가이드', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
    ],
  },
  {
    id: 'c06-37',
    chapter: 6,
    domain: 4,
    topic: '장애 원인 추적(무엇이 바뀌었나)',
    question:
      '어제까지 정상이던 서비스가 오늘 아침부터 특정 Cloud Storage 버킷에 접근할 때 권한 거부 오류를 낸다. 코드 배포는 없었다. 원인을 가장 빠르게 찾는 방법은?',
    options: [
      '서비스를 재시작해 본다.',
      'Cloud 감사 로그(관리 활동)에서 최근 IAM 정책·버킷 설정 변경 내역을 확인하고, 필요하면 Policy Troubleshooter로 권한을 분석한다.',
      '서비스 계정에 소유자 역할을 부여해 문제를 우회한다.',
      '버킷을 새로 만들어 데이터를 복사한다.',
    ],
    answer: [1],
    explanations: [
      '재시작은 권한 문제를 해결하지 못한다.',
      '장애 분석의 첫 질문은 “무엇이 바뀌었나”다. 관리 활동 감사 로그는 누가 언제 IAM·리소스 설정을 바꿨는지 기록하므로 원인을 빠르게 좁힐 수 있다. 권한 분석 도구로 거부 이유도 확인할 수 있다.',
      '과도한 권한 부여는 보안 위험을 만들고 원인도 알 수 없게 한다.',
      '버킷 재생성은 불필요하고 원인을 해결하지 않는다.',
    ],
    principle:
      '갑작스러운 장애는 최근 변경(배포·구성·권한)에서 원인을 찾는다. 감사 로그가 변경 이력의 기준 자료다.',
    refs: [
      { title: 'Cloud 감사 로그 개요', url: 'https://docs.cloud.google.com/logging/docs/audit' },
    ],
  },
  {
    id: 'c06-38',
    chapter: 6,
    domain: 4,
    topic: '클라우드 운영 책임 정의',
    question:
      '클라우드 도입 1년 후, 장애가 날 때마다 네트워크팀·보안팀·플랫폼팀·앱팀이 서로 책임을 미루고, 방화벽 변경이나 비용 이상 대응이 누구 몫인지 불분명하다. 조직 프로세스 측면에서 가장 먼저 해야 할 일은?',
    options: [
      '모든 권한을 한 팀에 몰아준다.',
      '주요 활동(네트워크 변경, IAM 관리, 비용 관리, 장애 대응 등)별로 책임·승인·협의·통보 대상을 정의한 책임 매트릭스(RACI)를 만들고 공유한다.',
      '장애 때마다 경영진이 담당자를 지정한다.',
      '각 팀이 알아서 판단하게 둔다.',
    ],
    answer: [1],
    explanations: [
      '한 팀에 모든 권한을 몰면 병목과 직무 분리 문제가 생긴다.',
      'RACI 같은 책임 매트릭스는 활동별 책임자와 의사결정 경로를 명확히 해 공백과 중복을 없앤다. IAM 설계와 에스컬레이션 절차도 이에 맞춘다.',
      '사건별 지정은 느리고 일관성이 없다.',
      '방임은 현재 문제를 그대로 둔다.',
    ],
    principle:
      '클라우드 운영 모델은 기술보다 먼저 “누가 무엇을 책임지는가”를 정의해야 한다.',
    refs: [
      { title: 'Well-Architected Framework: 운영 우수성', url: 'https://docs.cloud.google.com/architecture/framework/operational-excellence' },
    ],
  },
  // ───────── 도메인 5: 구현 관리 (6) ─────────
  {
    id: 'c06-39',
    chapter: 6,
    domain: 5,
    topic: 'API 버전 관리',
    question:
      '모바일 앱과 파트너 시스템이 사용하는 주문 API의 응답 형식을 호환되지 않게 바꿔야 한다. 구버전 앱은 몇 달간 계속 사용될 것이다. 클라이언트를 깨뜨리지 않으려면 어떤 방식이 가장 적절한가?',
    options: [
      '기존 엔드포인트의 응답 형식을 즉시 바꾸고 공지한다.',
      '새 주 버전(예: /v2)을 추가해 새 형식을 제공하고, 기존 버전은 사용 중단 일정을 공지한 뒤 일정 기간 유지한다.',
      '요청마다 무작위로 두 형식 중 하나를 반환한다.',
      '구버전 클라이언트를 모두 차단한다.',
    ],
    answer: [1],
    explanations: [
      '호환되지 않는 즉시 변경은 기존 클라이언트를 깨뜨린다.',
      '호환되지 않는 변경은 새 주 버전으로 제공하고, 구버전은 사용 중단 일정을 알린 뒤 전환 기간 동안 유지하는 것이 API 설계 모범 사례다.',
      '무작위 응답은 클라이언트를 예측 불가능하게 깨뜨린다.',
      '강제 차단은 사용자·파트너에게 장애를 일으킨다.',
    ],
    principle:
      'API는 계약이다. 호환되지 않는 변경은 새 주 버전으로, 폐기는 공지·전환 기간과 함께 진행한다.',
    refs: [
      { title: 'AIP-185: API 버전 관리', url: 'https://google.aip.dev/185' },
    ],
  },
  {
    id: 'c06-40',
    chapter: 6,
    domain: 5,
    topic: 'Apigee OAuth',
    question:
      '파트너사 서버가 백엔드 간 통신으로 회사의 재고 API를 호출한다. 지금은 API 키만 검증하는데, 보안팀은 키 유출 시 위험을 줄이기 위해 짧은 만료 시간의 액세스 토큰과 파트너별 범위(scope) 제한을 요구한다. 최종 사용자 로그인은 없다. Apigee에서 가장 적절한 방식은?',
    options: [
      'API 키를 매일 바꾸게 한다.',
      'OAuth 2.0 클라이언트 자격 증명 그랜트로 파트너 앱이 토큰을 발급받고, API 프록시에서 액세스 토큰과 범위를 검증한다.',
      '파트너 IP만 허용하고 인증은 제거한다.',
      '사용자 비밀번호를 API 요청에 포함하게 한다.',
    ],
    answer: [1],
    explanations: [
      '키를 자주 바꿔도 장기 공유 비밀이라는 특성은 같고 운영 부담만 커진다.',
      '클라이언트 자격 증명 그랜트는 사용자 없이 서버 간 호출에서 앱이 짧은 수명의 액세스 토큰을 받게 한다. Apigee의 OAuth 정책으로 토큰과 범위를 검증할 수 있다.',
      'IP만으로는 호출 주체를 확실히 인증하지 못한다.',
      '사용자 비밀번호 전달은 매우 위험하며 이 시나리오와 맞지 않는다.',
    ],
    principle:
      'API 인증 선택: 사용량 식별 = API 키, 서버 간 인가 = OAuth 클라이언트 자격 증명, 사용자 위임 = 인가 코드 그랜트.',
    refs: [
      { title: 'Apigee OAuth 홈', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/security/oauth/oauth-home' },
    ],
  },
  {
    id: 'c06-41',
    chapter: 6,
    domain: 5,
    topic: '클라우드 간 객체 스토리지 이전',
    question:
      '회사가 AWS S3 버킷의 약 500TB 데이터를 Cloud Storage로 옮기고, 이전 기간 동안 매일 변경분을 동기화하려 한다. 중간에 전송 서버를 운영하고 싶지 않다. 가장 적합한 방법은?',
    options: [
      'EC2 VM에서 gcloud storage rsync 스크립트를 실행한다.',
      'Storage Transfer Service로 S3를 소스로 하는 전송 작업을 만들어 일정 실행한다(에이전트 불필요).',
      'Transfer Appliance를 AWS 데이터센터로 보낸다.',
      '데이터를 로컬로 내려받았다가 다시 업로드한다.',
    ],
    answer: [1],
    explanations: [
      '스크립트 방식은 서버 운영·재시도·모니터링을 직접 해야 한다.',
      'Storage Transfer Service는 다른 클라우드의 객체 스토리지에서 Cloud Storage로 서버 없이 관리형 전송을 제공하며, 일정 실행·증분 동기화·재시도를 지원한다.',
      '다른 클라우드 공급자 데이터센터에 장비를 보내는 방식은 적용되지 않는다.',
      '로컬 경유는 시간과 비용이 두 배로 든다.',
    ],
    principle:
      '클라우드 간 객체 이전은 서버리스 Storage Transfer Service, 온프레미스 파일은 에이전트 기반 전송을 사용한다.',
    refs: [
      { title: 'Storage Transfer Service 개요', url: 'https://docs.cloud.google.com/storage-transfer/docs/overview' },
    ],
  },
  {
    id: 'c06-42',
    chapter: 6,
    domain: 5,
    topic: 'BigQuery 스트리밍 적재 API',
    question:
      '결제 처리 서비스가 거래 기록을 초당 수만 건씩 BigQuery에 실시간으로 기록해야 한다. 재시도 과정에서 중복 행이 생기면 안 되고(정확히 한 번), 비용 효율적이어야 한다. 새로 개발하는 서비스다. 어떤 적재 방식을 선택해야 하는가?',
    options: [
      '5분마다 CSV 파일을 bq load로 적재한다.',
      'BigQuery Storage Write API(gRPC)의 커밋 스트림 등으로 정확히 한 번 의미 체계를 활용해 적재한다.',
      '행마다 INSERT DML 문을 실행한다.',
      'Cloud SQL에 먼저 쓴 뒤 매일 내보낸다.',
    ],
    answer: [1],
    explanations: [
      '5분 배치 적재는 실시간 요구를 충족하지 못한다.',
      'Storage Write API(gRPC)는 대량 스트리밍 적재를 위한 권장 API로, 정확히 한 번 전달 의미 체계와 비용 효율성을 제공한다.',
      '행 단위 DML은 대량 스트리밍에 비효율적이고 할당량 문제가 생긴다.',
      '우회 경로는 지연과 복잡도를 늘린다.',
    ],
    principle:
      'BigQuery 적재 방식: 대량 배치 = 로드 작업, 실시간 스트리밍 = Storage Write API, 단순 Pub/Sub 연동 = BigQuery 구독.',
    refs: [
      { title: 'Storage Write API(gRPC) 소개', url: 'https://docs.cloud.google.com/bigquery/docs/write-api-grpc' },
    ],
  },
  {
    id: 'c06-43',
    chapter: 6,
    domain: 5,
    topic: 'Terraform 상태 분리',
    question:
      '회사의 모든 인프라(네트워크·DB·GKE·앱 설정, 개발·운영 환경)가 하나의 거대한 Terraform 루트 모듈과 상태 파일로 관리된다. plan이 20분 걸리고, 앱 설정 변경 실수로 네트워크 리소스가 삭제될 뻔했다. 가장 적절한 개선은?',
    options: [
      '상태 파일을 더 자주 백업한다.',
      '환경별·구성 요소별(네트워크, 데이터, 앱 등)로 루트 모듈과 상태를 분리해 변경의 영향 범위를 줄이고, 필요한 값은 출력·데이터 소스로 공유한다.',
      'Terraform 사용을 중단한다.',
      '모든 변경을 한 사람만 적용하게 한다.',
    ],
    answer: [1],
    explanations: [
      '백업은 사고 후 복구에 도움이 될 뿐 영향 범위 문제를 해결하지 않는다.',
      '루트 모듈과 상태를 환경·구성 요소 단위로 나누면 plan 속도가 빨라지고, 한 변경이 무관한 리소스에 영향을 줄 위험(폭발 반경)이 줄어든다. 변경 빈도와 소유 팀에 맞춰 분리한다.',
      'IaC 중단은 재현성과 검토 가능성을 잃는다.',
      '한 사람에게 몰면 병목만 생긴다.',
    ],
    principle:
      'IaC 상태는 변경 빈도·소유자·위험도 기준으로 분리해 “폭발 반경”을 줄인다.',
    refs: [
      { title: 'Terraform 루트 모듈 모범 사례', url: 'https://docs.cloud.google.com/docs/terraform/best-practices/root-modules' },
    ],
  },
  {
    id: 'c06-44',
    chapter: 6,
    domain: 5,
    topic: 'Cloud Build 트리거',
    question:
      '팀은 GitHub 저장소의 feature 브랜치에 푸시할 때는 테스트만, main 브랜치에 병합될 때는 테스트 후 이미지 빌드·푸시까지, 태그(v*)가 생성될 때는 릴리스 파이프라인을 실행하고 싶다. 모두 Cloud Build로 자동화하려면?',
    options: [
      '개발자가 매번 수동으로 gcloud builds submit을 실행한다.',
      '브랜치·태그 패턴별 Cloud Build 트리거를 만들어 서로 다른 빌드 구성(또는 치환 변수)을 실행한다.',
      '하나의 트리거로 모든 이벤트를 받아 항상 전체 파이프라인을 실행한다.',
      'Cloud Scheduler로 매시간 빌드를 실행한다.',
    ],
    answer: [1],
    explanations: [
      '수동 실행은 누락과 불일치를 만든다.',
      'Cloud Build 트리거는 저장소 이벤트(브랜치 푸시·PR·태그)와 패턴으로 조건을 정하고 각기 다른 빌드 구성을 실행할 수 있어, 이벤트별 파이프라인을 자동화한다.',
      '항상 전체 파이프라인을 돌리면 feature 브랜치에서 불필요한 이미지 게시가 일어나고 비용과 위험이 커진다.',
      '시간 기반 빌드는 커밋과 연결되지 않는다.',
    ],
    principle:
      'CI는 이벤트 기반으로: 브랜치·PR·태그별로 필요한 검증과 산출물 수준을 다르게 둔다.',
    refs: [
      { title: 'Cloud Build 트리거 만들기 및 관리', url: 'https://docs.cloud.google.com/build/docs/automating-builds/create-manage-triggers' },
    ],
  },
  // ───────── 도메인 6: 운영 우수성 (6) ─────────
  {
    id: 'c06-45',
    chapter: 6,
    domain: 6,
    topic: '계획된 유지보수 중 알림 관리',
    question:
      '매월 둘째 주 토요일 새벽에 계획된 DB 유지보수를 하는 동안 수십 개의 알림이 울려 온콜 엔지니어가 불필요하게 깨어난다. 유지보수 시간 외의 알림은 그대로 받아야 한다. 가장 적절한 방법은?',
    options: [
      '관련 알림 정책을 영구 삭제한다.',
      'Cloud Monitoring 알림 스누즈를 유지보수 기간과 대상 알림 정책에 맞춰 설정한다.',
      '온콜 엔지니어의 휴대폰을 무음으로 둔다.',
      '알림 임계값을 영구적으로 크게 올린다.',
    ],
    answer: [1],
    explanations: [
      '영구 삭제하면 유지보수 외 시간의 실제 장애를 놓친다.',
      '스누즈는 지정한 기간 동안 선택한 알림 정책의 알림을 억제하고, 기간이 끝나면 자동으로 정상 알림으로 돌아간다.',
      '무음은 실제 장애 알림까지 놓치게 한다.',
      '임계값을 영구적으로 올리면 평상시 감지 능력이 떨어진다.',
    ],
    principle:
      '예정된 작업 중에는 알림을 시간 제한적으로 억제(스누즈)하고, 알림 정책 자체는 유지한다.',
    refs: [
      { title: '알림 스누즈 관리', url: 'https://docs.cloud.google.com/monitoring/alerts/manage-snooze' },
    ],
  },
  {
    id: 'c06-46',
    chapter: 6,
    domain: 6,
    topic: '비공개 업타임 체크',
    question:
      '사내 전용 API는 외부 IP 없이 내부 부하 분산기 뒤에 있다. 운영팀은 외부 업타임 체크처럼 주기적으로 가용성을 확인하고 알림을 받고 싶지만, 서비스를 인터넷에 노출할 수는 없다. 가장 적절한 방법은?',
    options: [
      '서비스를 공개 IP로 노출해 일반 업타임 체크를 사용한다.',
      'Service Directory로 비공개 네트워크 접근을 구성하고 Cloud Monitoring의 비공개 업타임 체크를 만든다.',
      'VM 안에서 cron으로 curl을 실행해 결과를 파일로 남긴다.',
      '가용성 확인을 포기한다.',
    ],
    answer: [1],
    explanations: [
      '인터넷 노출은 요구사항 위반이다.',
      '비공개 업타임 체크는 Service Directory에 등록된 내부 엔드포인트로 VPC 사설 네트워크를 통해 요청을 보내, 노출 없이 가용성을 모니터링하고 알림을 설정할 수 있게 한다.',
      '자체 cron은 알림·이력 관리가 없고, 해당 VM 장애 시 확인도 멈춘다.',
      '가용성 모니터링은 포기할 대상이 아니다.',
    ],
    principle:
      '내부 서비스도 사용자 관점 가용성을 측정한다. 노출 없이 비공개 업타임 체크를 사용한다.',
    refs: [
      { title: '비공개 업타임 체크 만들기', url: 'https://docs.cloud.google.com/monitoring/uptime-checks/private-checks' },
    ],
  },
  {
    id: 'c06-47',
    chapter: 6,
    domain: 6,
    topic: '다중 프로젝트 모니터링(측정항목 범위)',
    question:
      '하나의 애플리케이션이 개발·운영·공유 서비스 등 8개 프로젝트에 걸쳐 있다. SRE 팀은 한 곳에서 모든 프로젝트의 지표를 차트로 보고 알림을 만들고 싶다. 데이터를 복사하지 않고 구성하려면?',
    options: [
      '각 프로젝트의 콘솔을 탭 8개로 열어 둔다.',
      '중앙 범위 지정 프로젝트의 측정항목 범위(metrics scope)에 8개 프로젝트를 추가해 하나의 뷰에서 모니터링한다.',
      '모든 지표를 매시간 CSV로 내보내 합친다.',
      '8개 프로젝트를 하나로 합친다.',
    ],
    answer: [1],
    explanations: [
      '여러 콘솔을 오가면 상관관계 파악과 알림 관리가 어렵다.',
      '측정항목 범위는 한 프로젝트에서 여러 프로젝트의 시계열 데이터를 차트로 그리고 알림을 만들 수 있게 한다. 데이터는 원래 프로젝트에 있고 조회 범위만 넓힌다.',
      'CSV 내보내기는 실시간성과 알림을 잃는다.',
      '프로젝트 통합은 격리·권한 경계를 깨는 큰 변경이다.',
    ],
    principle:
      '관측성 범위는 리소스 구조와 분리해 설계한다: 측정항목 범위(지표), 집계 싱크·로그 뷰(로그).',
    refs: [
      { title: '측정항목 범위 개요', url: 'https://docs.cloud.google.com/monitoring/settings' },
    ],
  },
  {
    id: 'c06-48',
    chapter: 6,
    domain: 6,
    topic: '롤백 가능한 스키마 변경',
    question:
      '새 릴리스는 DB 테이블의 열 이름을 바꾸는 변경을 포함한다. 과거에 비슷한 배포에서 문제가 생겨 앱을 롤백했는데, 이미 스키마가 바뀌어 구버전 앱이 동작하지 않아 장애가 길어졌다. 릴리스 관리 관점에서 가장 적절한 방법은?',
    options: [
      '스키마 변경과 앱 배포를 한 번에 적용하고 롤백은 포기한다.',
      '확장-축소(expand/contract) 방식으로 새 열을 먼저 추가하고 양쪽을 호환되게 운영한 뒤, 신버전이 안정되면 이전 열을 제거하는 단계적 변경을 한다.',
      '배포 전 DB를 전체 백업하고 문제 시 백업을 복원한다.',
      'DB 스키마를 절대 바꾸지 않는다.',
    ],
    answer: [1],
    explanations: [
      '롤백 불가능한 배포는 장애 시 복구 수단을 없앤다.',
      '확장-축소 방식은 각 단계에서 구버전과 신버전 앱이 모두 동작하도록 스키마를 호환 상태로 유지해, 앱을 언제든 롤백할 수 있게 한다.',
      '백업 복원은 그 사이의 정상 데이터를 잃고 복구 시간이 길다.',
      '스키마 변경 금지는 비현실적이다.',
    ],
    principle:
      '안전한 릴리스는 “항상 롤백 가능”해야 한다. 데이터 변경은 하위 호환 단계로 나눠 적용한다.',
    refs: [
      { title: '데이터베이스 마이그레이션 개념과 원칙', url: 'https://docs.cloud.google.com/architecture/database-migration-concepts-principles-part-1' },
    ],
  },
  {
    id: 'c06-49',
    chapter: 6,
    domain: 6,
    topic: '과부하 대응(부하 차단·성능 저하)',
    question:
      '대규모 이벤트 때 추천 서비스가 과부하로 느려지자, 이를 호출하는 상품 페이지 전체가 타임아웃으로 실패했다. 추천 기능은 부가 기능이며, 상품 정보와 구매 기능은 반드시 동작해야 한다. 가장 적절한 설계 개선은?',
    options: [
      '추천 서비스 호출 타임아웃을 무한대로 늘린다.',
      '추천 호출에 짧은 타임아웃과 서킷 브레이커를 두고 실패 시 기본 추천(또는 빈 영역)으로 대체해 핵심 기능은 계속 동작하게 하며, 추천 서비스는 과부하 시 요청을 거절(부하 차단)하게 한다.',
      '추천 서비스가 복구될 때까지 사이트 전체를 점검 모드로 전환한다.',
      '모든 요청을 무제한 재시도한다.',
    ],
    answer: [1],
    explanations: [
      '긴 타임아웃은 스레드·연결을 묶어 장애를 상위 서비스로 전파한다.',
      '부가 기능 의존성은 타임아웃·서킷 브레이커·대체 응답으로 격리해 우아하게 성능을 낮추고(graceful degradation), 과부하 서비스는 감당할 수 있는 만큼만 처리하고 나머지를 빠르게 거절해 전체 붕괴를 막는다.',
      '전체 점검 모드는 핵심 기능까지 막는다.',
      '무제한 재시도는 과부하를 악화시킨다.',
    ],
    principle:
      '의존성 장애가 전체 장애로 번지지 않도록 핵심·부가 기능을 구분하고, 부가 기능은 실패해도 우아하게 성능을 낮춘다.',
    refs: [
      { title: 'SRE 책: 과부하 처리', url: 'https://sre.google/sre-book/handling-overload/' },
    ],
  },
  {
    id: 'c06-50',
    chapter: 6,
    domain: 6,
    topic: '데이터 파이프라인 SLO',
    question:
      '매일 새벽 BigQuery 집계 테이블을 갱신하는 파이프라인이 가끔 늦게 끝나 오전 9시 경영 대시보드에 전날 데이터가 없다. 파이프라인 작업 자체는 “성공”으로 기록된다. 사용자 관점에서 이 문제를 감지할 SLI로 가장 적절한 것은?',
    options: [
      '파이프라인 VM의 CPU 사용률',
      '데이터 최신성(freshness): 대시보드 테이블의 최신 데이터가 기준 시각(예: 오전 8시)까지 갱신된 비율',
      '파이프라인 코드의 줄 수',
      'Cloud Storage 버킷의 객체 수',
    ],
    answer: [1],
    explanations: [
      'CPU 사용률은 사용자가 겪는 “데이터가 늦음” 문제를 직접 나타내지 않는다.',
      '데이터 파이프라인의 사용자 경험은 데이터가 제때 준비되는가이다. 최신성 SLI는 작업의 성공 여부와 별개로 사용자에게 필요한 시점에 데이터가 있는지 측정한다.',
      '코드 줄 수는 운영 지표가 아니다.',
      '객체 수는 데이터 준비 시점을 보여 주지 않는다.',
    ],
    principle:
      '파이프라인 SLI는 최신성·정확성·완전성처럼 데이터 소비자 관점으로 정의한다.',
    refs: [
      { title: 'SRE 워크북: 데이터 처리 파이프라인', url: 'https://sre.google/workbook/data-processing/' },
    ],
  },
  // @@END
]
