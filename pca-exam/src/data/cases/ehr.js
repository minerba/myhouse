// 케이스 스터디 문제: ehr — 오리지널 문제 (스키마: pca-exam/CLAUDE.md)
export default [
  {
    id: 'ehr-01',
    caseId: 'ehr',
    domain: 1,
    topic: '데이터센터 철수 우선순위',
    question:
      'EHR Healthcare는 여러 코로케이션 시설 중 한 곳의 임대가 곧 만료된다. 고객용 웹 앱 상당수는 이미 컨테이너화되어 Kubernetes에서 실행되고, 일부는 VM 기반이다. 보험사 연동 레거시 시스템은 당분간 이전 계획이 없다. 이전 계획의 첫 단계로 가장 적절한 것은?',
    options: [
      '모든 시스템을 동시에 한 번에 이전한다.',
      '임대 만료 시설의 워크로드를 우선 대상으로 삼아, 컨테이너화된 앱은 GKE로 리플랫폼하고 VM은 Migrate to Virtual Machines로 리호스트하며, 레거시 보험사 연동은 남은 시설에 두고 하이브리드 연결로 유지한다.',
      '레거시 보험사 연동 시스템부터 재작성한다.',
      '임대를 연장하고 이전을 미룬다.',
    ],
    answer: [1],
    explanations: [
      '일괄 이전은 위험이 크고 준비되지 않은 시스템까지 포함하게 된다.',
      '비즈니스 기한(임대 만료)에 맞춰 우선순위를 정하고, 워크로드 특성별로 적합한 이전 방식(컨테이너→GKE, VM→리호스트)을 적용하며, 이전 계획이 없는 레거시는 하이브리드로 유지하는 것이 케이스 요구와 맞다.',
      '케이스에는 레거시 시스템을 당장 업그레이드·이전할 계획이 없다고 명시되어 있다.',
      '임대 연장은 Google Cloud로 대체한다는 결정과 반대다.',
    ],
    principle:
      '이전 순서는 비즈니스 기한·위험·워크로드 준비도로 정하고, 워크로드마다 적합한 처분 전략을 적용한다.',
    refs: [
      { title: 'Migration Center 검색 및 평가 개요', url: 'https://docs.cloud.google.com/migration-center/docs/discovery-and-assessment-overview' },
      { title: 'Migrate to Virtual Machines 마이그레이션 수명 주기', url: 'https://docs.cloud.google.com/migrate/virtual-machines/docs/5.0/discover/lifecycle' },
    ],
  },
  {
    id: 'ehr-02',
    caseId: 'ehr',
    domain: 2,
    topic: '온프레미스와의 보안 고성능 연결',
    question:
      'EHR Healthcare는 “온프레미스 시스템과 Google Cloud 간의 안전하고 고성능인 연결”이 필요하다. 보험사 연동 레거시 시스템은 온프레미스에 남고 클라우드의 애플리케이션이 이를 호출한다. 고객용 시스템은 최소 99.9% 가용성이 요구된다. 가장 적절한 연결 구성은?',
    options: [
      '단일 Dedicated Interconnect 연결 하나를 사용한다.',
      '서로 다른 에지 가용성 도메인에 이중화된 Dedicated(또는 Partner) Interconnect 연결을 두고 Cloud Router로 BGP를 구성하며, 필요 시 전송 암호화를 추가한다.',
      '인터넷 경유 Classic VPN 하나를 사용한다.',
      '온프레미스 시스템을 공인 IP로 노출한다.',
    ],
    answer: [1],
    explanations: [
      '단일 연결은 단일 장애 지점이다.',
      '이중화된 Interconnect와 BGP 구성은 고성능 사설 연결과 요구 가용성을 제공한다. 의료 데이터 특성상 정책에 따라 암호화(예: Interconnect 위 HA VPN)를 추가한다.',
      '인터넷 VPN 하나는 성능·가용성 요구를 충족하기 어렵다.',
      '공개 노출은 보안 요구를 위반한다.',
    ],
    principle:
      '하이브리드 연결의 가용성은 토폴로지 이중화로 결정된다. 규제 데이터는 암호화 요구를 별도로 확인한다.',
    refs: [
      { title: 'Cloud Interconnect 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/overview' },
    ],
  },
  {
    id: 'ehr-03',
    caseId: 'ehr',
    domain: 1,
    topic: '고객용 시스템 99.9% 가용성',
    question:
      'EHR Healthcare의 고객용 웹 애플리케이션은 최소 99.9% 가용성이 필요하고, 과거 장애 원인에는 트래픽 급증에 대한 용량 부족이 있었다. 앱은 컨테이너 기반이며 관계형 DB를 사용한다. 가장 적절한 아키텍처는?',
    options: [
      '영역(zonal) GKE 클러스터 하나와 단일 영역 Cloud SQL',
      '리전 GKE 클러스터(여러 영역의 노드, HPA·클러스터 자동 확장)와 고가용성 구성의 Cloud SQL, 외부 애플리케이션 부하 분산기',
      '대형 VM 한 대에 모든 컨테이너를 실행',
      '온프레미스 Kubernetes를 그대로 유지',
    ],
    answer: [1],
    explanations: [
      '단일 영역 구성은 영역 장애에 취약해 가용성 목표를 위협한다.',
      '리전 GKE와 자동 확장은 영역 장애와 트래픽 급증에 대응하고, Cloud SQL HA는 DB 영역 장애를 자동 조치한다. 부하 분산기가 정상 백엔드로 트래픽을 보낸다.',
      '단일 VM은 단일 장애 지점이다.',
      '온프레미스 유지는 용량 문제와 이전 결정을 무시한다.',
    ],
    principle:
      '가용성 목표는 계층별 이중화(컴퓨팅·DB·네트워크)와 자동 확장으로 충족한다.',
    refs: [
      { title: 'GKE 리전 클러스터', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/regional-clusters' },
      { title: 'Cloud SQL for MySQL 고가용성', url: 'https://docs.cloud.google.com/sql/docs/mysql/high-availability' },
    ],
  },
  {
    id: 'ehr-04',
    caseId: 'ehr',
    domain: 2,
    topic: '데이터베이스 이전 대상',
    question:
      'EHR Healthcare는 MySQL, MS SQL Server, Redis, MongoDB를 사용한다. 비즈니스 요구 중 하나는 “인프라 관리 비용 절감”이며, 애플리케이션 변경은 최소화하고 싶다. 이전 대상으로 적절한 조합은? (2개 선택)',
    options: [
      'MySQL·MS SQL Server → Cloud SQL(각 엔진, 고가용성 구성)',
      'Redis → Memorystore, MongoDB → Firestore with MongoDB compatibility',
      '모든 DB → Bigtable 하나로 통합',
      '모든 DB → Compute Engine VM에 그대로 설치해 직접 운영',
      '모든 DB → BigQuery',
    ],
    answer: [0, 1],
    explanations: [
      '관계형 DB는 같은 엔진의 관리형 Cloud SQL로 옮기면 코드 변경이 적고 백업·HA·패치 부담이 줄어든다.',
      'Redis와 MongoDB도 호환되는 관리형 서비스로 옮기면 운영 부담을 줄이면서 코드 변경을 최소화할 수 있다.',
      'Bigtable로 통합하면 데이터 모델과 코드가 크게 바뀐다.',
      'VM 직접 운영은 인프라 관리 비용 절감 목표와 반대다.',
      'BigQuery는 운영 트랜잭션 DB가 아니다.',
    ],
    principle:
      '운영 비용 절감이 목표면 엔진 호환 관리형 서비스로 리플랫폼하고, 재설계는 필요할 때만 한다.',
    refs: [
      { title: 'Cloud SQL for SQL Server 개요', url: 'https://docs.cloud.google.com/sql/docs/sqlserver/introduction' },
      { title: 'Firestore with MongoDB compatibility 개요', url: 'https://docs.cloud.google.com/firestore/mongodb-compatibility/docs/overview' },
    ],
  },
  {
    id: 'ehr-05',
    caseId: 'ehr',
    domain: 3,
    topic: 'Active Directory 연동',
    question:
      'EHR Healthcare의 사용자는 Microsoft Active Directory로 관리된다. Google Cloud 도입 후에도 AD를 ID의 단일 진실 공급원으로 유지하고, 직원이 기존 계정으로 로그인하며, 퇴사자가 AD에서 비활성화되면 Google Cloud 접근도 자동으로 끊겨야 한다. 가장 적절한 방법은?',
    options: [
      'Google Cloud에 사용자를 수동으로 만들고 별도 비밀번호를 준다.',
      'Google Cloud Directory Sync(GCDS)로 AD의 사용자·그룹을 Cloud Identity에 동기화하고, AD FS 등을 통한 SAML SSO로 인증을 AD에 위임한다.',
      '모든 직원이 하나의 공용 계정을 사용한다.',
      'AD를 폐기하고 Cloud Identity에서 새로 관리한다.',
    ],
    answer: [1],
    explanations: [
      '수동 계정은 퇴사자 계정 방치 위험이 크다.',
      'AD를 원천으로 사용자·그룹을 동기화하고 SSO로 인증을 AD에 위임하면, 계정 수명 주기가 자동으로 연동되고 비밀번호도 Google에 따로 저장하지 않는다.',
      '공용 계정은 개인 책임 추적을 불가능하게 한다.',
      'AD 폐기는 기존 온프레미스 시스템과 사용자 관리 방식을 무시한 과도한 변경이다.',
    ],
    principle:
      '기존 디렉터리가 있으면 “동기화(프로비저닝) + SSO(인증 위임)”로 연동해 ID의 단일 원천을 유지한다.',
    refs: [
      { title: 'Google Cloud와 Active Directory 연동 소개', url: 'https://docs.cloud.google.com/architecture/identity/federating-gcp-with-active-directory-introduction' },
      { title: 'AD 사용자 계정 동기화', url: 'https://docs.cloud.google.com/architecture/identity/federating-gcp-with-active-directory-synchronizing-user-accounts' },
    ],
  },
  {
    id: 'ehr-06',
    caseId: 'ehr',
    domain: 3,
    topic: '의료 규정 준수',
    question:
      'EHR Healthcare는 여러 국가의 의료기관·보험사에 서비스를 제공하며 “규정 준수 유지”가 비즈니스 요구다. 미국 고객의 환자 건강 정보(PHI)도 다룬다. 아키텍트가 우선 적용해야 할 조치로 적절한 것은? (2개 선택)',
    options: [
      'Google과 BAA를 체결하고, PHI는 적용 대상 서비스에서만 처리하도록 서비스 사용을 조직 정책으로 제한한다.',
      '데이터 유출 방지를 위해 PHI 프로젝트를 VPC 서비스 제어 경계로 보호하고, 데이터 액세스 감사 로그와 최소 권한 IAM을 적용한다.',
      '규정 준수는 Google이 모두 책임지므로 추가 조치가 필요 없다.',
      '모든 PHI를 개발 환경에서도 원본 그대로 사용한다.',
      '감사 로그 비용을 줄이기 위해 로그를 끈다.',
    ],
    answer: [0, 1],
    explanations: [
      'BAA와 적용 대상 서비스 제한은 PHI 처리의 계약·범위 기반을 만든다.',
      '경계 보호, 데이터 접근 감사, 최소 권한은 고객 측 책임 영역의 핵심 기술 통제다.',
      '공동 책임 모델에서 고객 구성은 고객 책임이다.',
      '비운영 환경에 원본 PHI를 두면 위험과 규정 범위가 커진다.',
      '감사 로그는 규정 준수의 필수 증거다.',
    ],
    principle:
      '규제 데이터 보호 = 계약·범위(BAA·서비스 제한) + 기술 통제(경계·IAM·감사) + 비운영 환경 데이터 최소화.',
    refs: [
      { title: 'Google Cloud HIPAA 규정 준수', url: 'https://cloud.google.com/security/compliance/hipaa' },
      { title: 'VPC 서비스 제어 개요', url: 'https://docs.cloud.google.com/vpc-service-controls/docs/overview' },
    ],
  },
  {
    id: 'ehr-07',
    caseId: 'ehr',
    domain: 6,
    topic: '일관된 로깅·모니터링·알림',
    question:
      'EHR Healthcare는 현재 여러 오픈 소스 도구로 모니터링하고, 알림은 이메일로 전송되어 자주 무시된다. 기술 요구사항은 “일관된 로깅, 로그 보존, 모니터링, 알림”이고, 비즈니스 요구는 “시스템 성능과 사용량에 대한 중앙 가시성과 선제적 조치”다. 가장 적절한 방안은?',
    options: [
      '이메일 알림을 더 많은 사람에게 보낸다.',
      '조직 수준 집계 싱크로 로그를 중앙 로그 버킷(규정에 맞는 보존 기간)에 모으고, Cloud Monitoring에서 서비스별 SLO와 대시보드를 정의하며, SLO 기반 알림을 온콜 도구로 심각도별 라우팅한다.',
      '각 팀이 원하는 도구를 계속 쓴다.',
      '로그를 각 서버에 로컬로 보관한다.',
    ],
    answer: [1],
    explanations: [
      '수신자 확대는 무시되는 알림 문제를 악화시킨다.',
      '중앙 로그 수집·보존, 표준 대시보드와 SLO, 대응 가능한 채널로의 알림 라우팅은 일관성과 선제적 대응 요구를 충족한다.',
      '도구 분산은 일관성 요구와 반대다.',
      '로컬 보관은 중앙 가시성과 보존 요구를 충족하지 못한다.',
    ],
    principle:
      '운영 가시성 = 중앙 수집(로그·지표) + 표준 SLO·대시보드 + 대응 가능한 알림.',
    refs: [
      { title: '집계 싱크 개요', url: 'https://docs.cloud.google.com/logging/docs/export/aggregated_sinks' },
      { title: 'SLO 소진율 알림', url: 'https://docs.cloud.google.com/stackdriver/docs/solutions/slo-monitoring/alerting-on-budget-burn-rate' },
    ],
  },
  {
    id: 'ehr-08',
    caseId: 'ehr',
    domain: 2,
    topic: '여러 컨테이너 환경의 일관 관리',
    question:
      'EHR Healthcare는 “여러 컨테이너 기반 환경의 유지·관리”와 “컨테이너 기반 고객용 앱을 일관되게 관리하는 방법”을 요구한다. 이전 기간 동안 일부 기존 Kubernetes 클러스터는 코로케이션에 남아 있다. 과거 장애 상당수가 잘못된 구성에서 비롯되었다. 가장 적절한 방안은?',
    options: [
      '각 클러스터를 운영자가 kubectl로 개별 관리한다.',
      'GKE 클러스터와 남아 있는 기존 클러스터(GKE attached clusters 등)를 하나의 플릿으로 등록하고, Config Sync로 구성을 Git에서 일관되게 배포하며 Policy Controller로 잘못된 구성을 차단한다.',
      '온프레미스 클러스터를 모두 즉시 삭제한다.',
      '클러스터마다 다른 팀이 서로 다른 표준을 정한다.',
    ],
    answer: [1],
    explanations: [
      '개별 수동 관리는 구성 불일치와 오류를 계속 만든다.',
      '플릿 기반 관리와 GitOps·정책 강제는 여러 환경의 클러스터에 같은 구성과 가드레일을 적용해, 구성 오류로 인한 장애를 줄인다. 기존 CNCF 호환 클러스터도 attached clusters로 편입할 수 있다.',
      '이전 완료 전 삭제는 서비스 중단을 일으킨다.',
      '팀별 표준은 일관성 요구와 반대다.',
    ],
    principle:
      '다중 클러스터 운영의 일관성은 플릿 + GitOps(Config Sync) + 정책(Policy Controller)으로 확보한다.',
    refs: [
      { title: 'GKE attached clusters', url: 'https://docs.cloud.google.com/kubernetes-engine/multi-cloud/docs/attached' },
      { title: 'Config Sync 개요', url: 'https://docs.cloud.google.com/kubernetes-engine/config-sync/docs/overview' },
    ],
  },
  {
    id: 'ehr-09',
    caseId: 'ehr',
    domain: 1,
    topic: '의료 데이터 수집과 분석',
    question:
      'EHR Healthcare는 “신규 공급자의 데이터를 수집·처리하는 인터페이스”를 만들고, “헬스케어 트렌드 인사이트와 공급자 데이터 기반 예측·보고서”를 제공하려 한다. 공급자들은 FHIR 같은 의료 표준 형식으로 데이터를 보낸다. 가장 적절한 설계는?',
    options: [
      '공급자 파일을 VM의 로컬 디스크에 모아 수동으로 분석한다.',
      'Cloud Healthcare API의 FHIR 저장소로 표준 형식 데이터를 수집·관리하고, BigQuery로 내보내 분석하며, BigQuery ML 또는 Agent Platform으로 예측 모델을 만든다.',
      '모든 공급자 데이터를 이메일로 받는다.',
      '표준 형식을 무시하고 공급자마다 맞춤 파서를 작성한다.',
    ],
    answer: [1],
    explanations: [
      '로컬 수동 분석은 확장·보안·재현성이 없다.',
      'Cloud Healthcare API는 FHIR 등 의료 표준을 지원하는 관리형 수집·저장 계층을 제공하고, BigQuery로 내보내 대규모 분석과 ML 기반 예측으로 이어갈 수 있다.',
      '이메일은 의료 데이터 수집 수단으로 부적절하다.',
      '맞춤 파서는 공급자 증가에 따라 유지보수 부담이 폭증한다.',
    ],
    principle:
      '산업 표준 데이터는 표준 지원 관리형 서비스로 수집하고, 분석·ML은 데이터 웨어하우스에서 수행한다.',
    refs: [
      { title: 'Cloud Healthcare API 개요', url: 'https://docs.cloud.google.com/healthcare-api/docs/introduction' },
      { title: 'BigQuery ML 소개', url: 'https://docs.cloud.google.com/bigquery/docs/bqml-introduction' },
    ],
  },
  {
    id: 'ehr-10',
    caseId: 'ehr',
    domain: 5,
    topic: '신규 보험사 온보딩',
    question:
      'EHR Healthcare는 “신규 보험사를 최대한 빨리 온보딩”해야 한다. 기존 보험사 연동은 온프레미스의 파일·API 기반 레거시로 당분간 유지된다. 신규 보험사부터는 표준화된 방식으로 빠르게 연결하고 싶다. 가장 적절한 구현 방향은?',
    options: [
      '신규 보험사마다 레거시 방식의 맞춤 파일 연동을 새로 만든다.',
      '표준 API를 설계해 Apigee로 게시하고, API 키·OAuth·쿼터·분석과 개발자 포털로 보험사가 셀프서비스로 연동하게 하며, 백엔드는 필요 시 온프레미스 레거시와 하이브리드 연결로 통합한다.',
      '보험사에 온프레미스 DB 직접 접근 권한을 준다.',
      '신규 보험사 온보딩을 레거시 교체 완료 후로 미룬다.',
    ],
    answer: [1],
    explanations: [
      '맞춤 연동은 온보딩 시간을 계속 늘린다.',
      '표준 API와 API 관리·포털은 보험사가 스스로 빠르게 연동하게 하고, 보안·쿼터·분석을 일관되게 적용한다. 레거시 백엔드와도 하이브리드로 통합할 수 있다.',
      'DB 직접 접근은 보안·규정 위험이 크다.',
      '미루기는 비즈니스 요구와 반대다.',
    ],
    principle:
      '파트너 온보딩 속도는 표준 API + API 관리 + 셀프서비스 포털에서 나온다.',
    refs: [
      { title: 'Apigee 개요', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/get-started/what-apigee' },
      { title: 'Apigee OAuth 홈', url: 'https://docs.cloud.google.com/apigee/docs/api-platform/security/oauth/oauth-home' },
    ],
  },
  {
    id: 'ehr-11',
    caseId: 'ehr',
    domain: 4,
    topic: '구성 오류로 인한 장애 감소',
    question:
      'EHR Healthcare 경영진에 따르면 많은 장애가 잘못 구성된 시스템에서 발생했다. 동시에 소프트웨어를 빠르게 업데이트하는 지속적 배포 역량이 필요하다. 프로세스 측면에서 가장 효과적인 개선은?',
    options: [
      '배포 빈도를 줄이고 수동 검토를 강화한다.',
      '인프라와 애플리케이션 구성을 코드로 관리하고, CI에서 정책 검증·테스트를 자동 실행하며, 카나리 배포와 자동 롤백으로 변경 위험을 제한한다.',
      '구성 변경 권한을 모든 엔지니어에게 준다.',
      '장애가 나면 담당자를 징계한다.',
    ],
    answer: [1],
    explanations: [
      '배포 빈도 감소는 변경을 크게 만들고 빠른 업데이트 요구와 반대다.',
      'IaC·정책 검증·자동 테스트는 잘못된 구성을 배포 전에 걸러 내고, 점진적 배포와 자동 롤백은 남은 위험의 영향을 줄여 속도와 안정성을 함께 높인다.',
      '권한 확대는 구성 오류 위험을 키운다.',
      '징계 중심 대응은 근본 원인 분석과 재발 방지 학습을 막고, 구성 오류를 막는 프로세스 개선에도 기여하지 못한다.',
    ],
    principle:
      '속도와 안정성은 상충하지 않는다: 자동화된 검증과 점진적 배포가 둘을 함께 높인다.',
    refs: [
      { title: 'Terraform 정책 검증', url: 'https://docs.cloud.google.com/docs/terraform/policy-validation' },
      { title: 'Cloud Deploy 카나리 배포 전략', url: 'https://docs.cloud.google.com/deploy/docs/deployment-strategies/canary' },
    ],
  },
  {
    id: 'ehr-12',
    caseId: 'ehr',
    domain: 4,
    topic: '재해 복구 계획 조정',
    question:
      'EHR Healthcare는 Google Cloud 이전과 함께 재해 복구 계획을 조정해야 한다. 고객용 시스템은 99.9% 가용성이 필요하고 의료 데이터 손실은 최소화해야 하지만, 모든 시스템에 같은 수준의 DR을 적용할 예산은 없다. 가장 적절한 접근은?',
    options: [
      '모든 시스템에 멀티 리전 액티브-액티브를 적용한다.',
      '비즈니스 영향 분석으로 시스템을 등급화해 등급별 RTO·RPO를 정하고, 핵심 고객용 시스템은 리전 간 복제(예: 교차 리전 복제본·백업)와 문서화된 장애 조치를, 낮은 등급은 백업 기반 복구를 적용하며 정기적으로 DR 훈련을 한다.',
      'DR은 Google이 알아서 하므로 계획이 필요 없다.',
      '기존 코로케이션을 DR 사이트로 무기한 유지한다.',
    ],
    answer: [1],
    explanations: [
      '전면 액티브-액티브는 예산 제약을 초과한다.',
      '등급화된 DR은 비즈니스 영향에 맞춰 투자를 배분하고, 핵심 시스템은 데이터 손실을 최소화하는 복제·장애 조치를, 나머지는 비용 효율적인 백업 복구를 적용한다. 정기 훈련으로 실효성을 검증한다.',
      'DR 설계와 운영은 고객 책임이다.',
      '코로케이션 유지는 대체 결정과 비용 절감 목표에 반한다.',
    ],
    principle:
      'DR 계획은 등급화 → 등급별 패턴 → 정기 훈련의 순환으로 운영한다.',
    refs: [
      { title: '재해 복구 계획 가이드', url: 'https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide' },
    ],
  },
  // @@END
]
