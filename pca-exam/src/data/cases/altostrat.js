// 케이스 스터디 문제: altostrat — 오리지널 문제 (스키마: pca-exam/CLAUDE.md)
export default [
  {
    id: 'altostrat-01',
    caseId: 'altostrat',
    domain: 1,
    topic: '하이브리드 Kubernetes 일관 관리',
    question:
      'Altostrat Media는 콘텐츠 관리 플랫폼을 GKE에서 운영하지만, 콘텐츠 수집·아카이빙 워크로드는 당분간 온프레미스에 남는다. 기술 요구사항은 “온프레미스와 클라우드 모두에서 확장 가능하고 성능 좋은 Kubernetes 환경”과 “중앙 관리 플랫폼”이다. 가장 적합한 설계는?',
    options: [
      '온프레미스에는 팀이 직접 설치한 오픈 소스 Kubernetes를, 클라우드에는 GKE를 쓰고 각각 따로 관리한다.',
      '온프레미스에 Google Distributed Cloud(소프트웨어 전용) 클러스터를 배포하고 GKE 클러스터와 함께 플릿으로 등록해 Config Sync·Policy Controller로 구성과 정책을 중앙에서 관리한다.',
      '온프레미스 워크로드를 모두 VM으로 돌리고 Kubernetes는 클라우드에서만 쓴다.',
      '모든 온프레미스 워크로드를 즉시 클라우드로 옮긴다.',
    ],
    answer: [1],
    explanations: [
      '환경별 개별 관리는 “중앙 관리” 요구를 충족하지 못하고 구성 불일치를 만든다.',
      'Google Distributed Cloud 소프트웨어 전용은 고객 하드웨어에서 엔터프라이즈 Kubernetes를 운영하게 하고, 플릿으로 GKE와 함께 묶으면 GitOps 구성·정책을 일관되게 적용할 수 있다. 수집·아카이빙이 온프레미스에 남는 동안에도 같은 운영 모델을 쓴다.',
      'VM 운영은 “온프레미스에도 Kubernetes 환경” 요구와 맞지 않는다.',
      '케이스에는 온프레미스 시스템이 가까운 미래에 이전될 예정이라고 되어 있어, 당장 전부 옮기는 것은 계획과 맞지 않는다.',
    ],
    principle:
      '하이브리드 Kubernetes는 “어디서나 같은 플랫폼 + 플릿 기반 중앙 관리(GitOps·정책)”로 운영 일관성을 확보한다.',
    refs: [
      { title: 'Google Distributed Cloud 소프트웨어 전용(베어메탈)', url: 'https://docs.cloud.google.com/kubernetes-engine/distributed-cloud/bare-metal/docs' },
      { title: '플릿 관리 개요', url: 'https://docs.cloud.google.com/kubernetes-engine/fleet-management/docs' },
    ],
  },
  {
    id: 'altostrat-02',
    caseId: 'altostrat',
    domain: 4,
    topic: '컨테이너 CI/CD 현대화',
    question:
      'Altostrat Media는 “중앙 관리 플랫폼을 갖춘 컨테이너 배포용 CI/CD 현대화”와 “빠른 애플리케이션 배포를 위한 인프라 관리 단순화”를 요구한다. 현재 팀마다 다른 스크립트로 GKE에 배포한다. 가장 적절한 방안은?',
    options: [
      '팀마다 원하는 CI 도구를 계속 쓰게 한다.',
      'Cloud Build로 빌드·테스트·취약점 검사를 표준화해 Artifact Registry에 이미지를 게시하고, Cloud Deploy로 클라우드·온프레미스 클러스터 대상의 승격·승인·롤백을 중앙에서 관리한다.',
      '운영 클러스터에 kubectl로 직접 배포하는 절차를 문서화한다.',
      '배포를 월 1회로 모아 한다.',
    ],
    answer: [1],
    explanations: [
      '팀별 도구는 중앙 관리 요구와 반대이며 통제·가시성이 떨어진다.',
      'Cloud Build·Artifact Registry·Cloud Deploy 조합은 빌드부터 환경별 승격·승인·롤백까지 표준화된 중앙 파이프라인을 제공해 배포 속도와 신뢰성을 함께 높인다.',
      '수동 kubectl 배포는 추적성과 통제가 없다.',
      '배포 빈도를 줄이면 변경 위험이 커지고 “빠른 배포” 목표와 반대다.',
    ],
    principle:
      '중앙 CI/CD = 표준 빌드(한 번) + 불변 아티팩트 + 환경별 승격 파이프라인 + 승인·롤백.',
    refs: [
      { title: 'Cloud Deploy 개요', url: 'https://docs.cloud.google.com/deploy/docs/overview' },
      { title: 'Cloud Build 개요', url: 'https://docs.cloud.google.com/build/docs/overview' },
    ],
  },
  {
    id: 'altostrat-03',
    caseId: 'altostrat',
    domain: 2,
    topic: '대용량 미디어 수집용 하이브리드 연결',
    question:
      'Altostrat Media의 온프레미스 수집 시스템은 매일 대량의 원본 영상을 Cloud Storage로 올린다. 기술 요구사항은 “데이터 수집을 위한 안전한 고성능 하이브리드 연결”이다. 현재는 인터넷 VPN을 써서 처리량이 불안정하다. 가장 적절한 구성은?',
    options: [
      '인터넷 회선 VPN 터널 수를 늘린다.',
      '이중화된 Dedicated(또는 Partner) Interconnect로 사설 고대역폭 연결을 구성하고, 온프레미스에서 Google API에 사설 경로로 접근하도록(비공개 Google 액세스 또는 PSC 엔드포인트) 구성하며, 암호화 정책이 있으면 Interconnect 위 HA VPN을 추가한다.',
      '수집 영상을 매주 하드 디스크로 배송한다.',
      '영상 해상도를 낮춰 전송량을 줄인다.',
    ],
    answer: [1],
    explanations: [
      '인터넷 VPN은 터널을 늘려도 인터넷 경로의 불안정성과 대역폭 한계가 남는다.',
      'Interconnect는 안정적인 고대역폭 사설 연결을 제공하고, 사설 경로로 Google API(Cloud Storage)에 접근하면 인터넷을 거치지 않는다. 암호화가 필요하면 Interconnect 위 HA VPN으로 보완한다.',
      '매일 반복되는 수집에 물리 배송은 맞지 않는다.',
      '원본 품질을 낮추는 것은 미디어 자산 가치를 훼손한다.',
    ],
    principle:
      '지속적인 대량 하이브리드 데이터 이동은 Interconnect + 사설 API 접근으로 설계하고, 보안 정책에 따라 암호화를 추가한다.',
    refs: [
      { title: 'Cloud Interconnect 개요', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/overview' },
      { title: 'Cloud Interconnect를 통한 HA VPN', url: 'https://docs.cloud.google.com/network-connectivity/docs/interconnect/concepts/ha-vpn-interconnect' },
    ],
  },
  {
    id: 'altostrat-04',
    caseId: 'altostrat',
    domain: 2,
    topic: '미디어 스토리지 비용 최적화',
    question:
      'Altostrat Media의 미디어 라이브러리는 Cloud Storage에 있고 계속 늘어난다. 대부분의 오래된 콘텐츠는 거의 조회되지 않지만, 뉴스 이슈에 따라 오래된 다큐멘터리가 갑자기 대량 재조회되기도 한다. 요구사항은 “고가용성과 확장성을 유지하면서 스토리지 비용 최적화”다. 가장 적절한 방법은?',
    options: [
      '업로드 후 30일이 지나면 모두 Archive로 옮기는 고정 수명 주기 규칙을 적용한다.',
      '미디어 버킷에 Autoclass를 사용 설정해 객체별 접근 패턴에 따라 스토리지 클래스를 자동 전환하고, 다시 인기 있어진 콘텐츠는 자동으로 Standard로 돌아가게 한다.',
      '모든 콘텐츠를 Standard로 유지한다.',
      '오래된 콘텐츠를 삭제한다.',
    ],
    answer: [1],
    explanations: [
      '고정 규칙으로 Archive에 옮긴 뒤 대량 재조회가 일어나면 검색 비용이 크게 발생한다.',
      'Autoclass는 접근 패턴이 예측하기 어려운 데이터에 맞게 클래스를 자동 전환해 비용을 줄이면서, 재조회된 객체는 Standard로 되돌려 성능을 유지한다.',
      '모두 Standard로 두면 비용 최적화 요구를 충족하지 못한다.',
      '미디어 자산 삭제는 비즈니스 가치를 잃는다.',
    ],
    principle:
      '예측 불가능한 재접근이 있는 대용량 미디어는 Autoclass, 예측 가능한 노화 패턴은 수명 주기 규칙.',
    refs: [
      { title: 'Autoclass', url: 'https://docs.cloud.google.com/storage/docs/autoclass' },
    ],
  },
  {
    id: 'altostrat-05',
    caseId: 'altostrat',
    domain: 1,
    topic: '미디어 자동 요약',
    question:
      'Altostrat Media는 팟캐스트·인터뷰·뉴스·다큐멘터리의 간결한 요약을 자동 생성하려 한다. 새 콘텐츠는 업로드 직후 요약이 필요하고, 기존 라이브러리 수십만 건은 몇 주에 걸쳐 처리해도 된다. 신뢰성과 비용 관리가 최우선이다. 가장 적절한 설계는?',
    options: [
      '요약 모델을 처음부터 학습한다.',
      'Gemini의 영상·오디오 이해 기능으로 요약을 생성하되, 신규 업로드는 이벤트 기반 온라인 호출로, 기존 라이브러리는 배치 추론으로 처리해 비용을 낮춘다.',
      '모든 콘텐츠를 사람이 요약한다.',
      '기존 라이브러리를 한꺼번에 온라인 API로 최대 동시 호출한다.',
    ],
    answer: [1],
    explanations: [
      '처음부터 학습은 비용·시간이 과도하다.',
      'Gemini 멀티모달 모델은 영상·오디오를 직접 이해해 요약할 수 있다. 즉시성이 필요한 신규 콘텐츠는 온라인 호출, 대량의 기존 콘텐츠는 배치 추론으로 처리하면 비용과 할당량을 효율적으로 관리할 수 있다.',
      '수작업은 규모상 불가능하다.',
      '대량 동시 온라인 호출은 할당량 초과와 비용 증가를 부른다.',
    ],
    principle:
      '같은 AI 기능도 지연 요구에 따라 소비 방식을 나눈다: 실시간 = 온라인, 대량 백로그 = 배치.',
    refs: [
      { title: '동영상 이해', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/video-understanding' },
      { title: 'Gemini 배치 추론', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/batch-inference' },
    ],
  },
  {
    id: 'altostrat-06',
    caseId: 'altostrat',
    domain: 1,
    topic: '메타데이터 추출 파이프라인',
    question:
      'Altostrat Media는 NLP와 컴퓨터 비전으로 미디어 자산에서 풍부한 메타데이터(인물·주제·장면·키워드)를 추출해 BigQuery에서 트렌드 분석에 쓰고 싶다. 이미 Cloud Run functions로 트랜스코딩 같은 이벤트 작업을 처리하고 있다. 기존 환경을 활용한 가장 적절한 설계는?',
    options: [
      '분석가가 매일 새 콘텐츠를 보며 태그를 수동 입력한다.',
      'Cloud Storage 업로드 이벤트로 Cloud Run functions를 실행해 Gemini 멀티모달 모델(필요 시 Video Intelligence·Speech-to-Text)로 메타데이터를 구조화된 형식으로 추출하고, 결과를 BigQuery에 적재한다.',
      '온프레미스에 GPU 서버를 새로 구매해 자체 모델을 운영한다.',
      '메타데이터 없이 파일 이름만으로 분석한다.',
    ],
    answer: [1],
    explanations: [
      '수동 태깅은 규모와 일관성 면에서 한계가 크다.',
      '기존 이벤트 기반 서버리스 구조에 멀티모달 AI 추출 단계를 추가하고 구조화된 결과를 BigQuery에 적재하면, 추가 인프라 운영 없이 트렌드 분석과 콘텐츠 전략에 활용할 수 있다.',
      '새 하드웨어 구매는 클라우드 현대화 방향과 반대이며 운영 부담이 크다.',
      '파일 이름만으로는 콘텐츠 인사이트를 얻을 수 없다.',
    ],
    principle:
      '기존 이벤트 기반 파이프라인에 관리형 AI 단계를 끼워 넣고, 결과는 분석 가능한 구조화 데이터로 저장한다.',
    refs: [
      { title: '동영상 이해', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/video-understanding' },
      { title: 'Eventarc 개요', url: 'https://docs.cloud.google.com/eventarc/docs/overview' },
    ],
  },
  {
    id: 'altostrat-07',
    caseId: 'altostrat',
    domain: 3,
    topic: '유해 콘텐츠 탐지',
    question:
      'Altostrat Media는 업로드되는 영상·이미지·자막에서 부적절하거나 유해한 콘텐츠를 탐지·필터링해야 한다. 오탐으로 정상 뉴스 보도가 차단되면 안 되고, 판단 근거가 남아야 한다. 가장 적절한 설계는?',
    options: [
      '모든 콘텐츠를 자동으로 차단하고 이의 신청을 받는다.',
      'AI 기반 분류(Gemini를 이용한 콘텐츠 모더레이션, 필요 시 Video Intelligence 명시적 콘텐츠 감지)로 위험 점수를 매겨 명백한 경우만 자동 차단하고, 경계 사례는 사람 검토 대기열로 보내며, 판단 결과와 근거를 기록한다.',
      '업로드 기능을 중단한다.',
      '사용자 신고가 들어온 콘텐츠만 검토한다.',
    ],
    answer: [1],
    explanations: [
      '전면 자동 차단은 정상 보도까지 막아 비즈니스에 큰 피해를 준다.',
      'AI 분류와 신뢰도 기반 라우팅(자동 차단 / 사람 검토)을 결합하면 규모와 정확성을 함께 확보하고, 판단 기록은 감사 가능성 요구도 충족한다.',
      '업로드 중단은 핵심 비즈니스를 멈춘다.',
      '신고 기반만으로는 유해 콘텐츠가 이미 노출된 뒤에야 대응한다.',
    ],
    principle:
      '콘텐츠 모더레이션은 AI 분류 + 신뢰도 기반 휴먼 인 더 루프 + 판단 기록으로 설계한다.',
    refs: [
      { title: 'Gemini를 활용한 안전 필터링·콘텐츠 모더레이션', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/gemini-for-filtering-and-moderation' },
      { title: 'Video Intelligence: 명시적 콘텐츠 감지', url: 'https://docs.cloud.google.com/video-intelligence/docs/analyze-safesearch' },
    ],
  },
  {
    id: 'altostrat-08',
    caseId: 'altostrat',
    domain: 3,
    topic: 'AI 감사 가능성',
    question:
      'Altostrat Media의 기술 요구사항에는 “AI 시스템이 감사 가능하고 그 결정을 설명할 수 있어야 한다”가 있다. 추천·요약·콘텐츠 필터링에 생성형 AI를 쓴다. 이를 충족하기 위한 조치로 가장 적절한 것은? (2개 선택)',
    options: [
      '모델 호출의 프롬프트·응답과 사용한 모델·프롬프트 버전을 요청-응답 로깅 등으로 기록하고, 보존·접근 통제를 설정한다.',
      '답변이 근거 문서를 인용하도록 그라운딩을 적용하고, 필터링 결정에는 판단 사유(카테고리·점수)를 함께 저장해 사후 검토할 수 있게 한다.',
      '모델 결정은 블랙박스이므로 기록하지 않는다.',
      '감사 요청이 오면 그때 모델에게 이유를 다시 물어본다.',
      '모든 AI 기능을 끄고 규칙 기반으로만 운영한다.',
    ],
    answer: [0, 1],
    explanations: [
      '입력·출력과 모델·프롬프트 버전 기록은 “어떤 시점에 어떤 설정으로 어떤 결과가 나왔는가”를 재구성하는 감사의 기반이다.',
      '그라운딩과 인용, 판단 사유 저장은 결정의 근거를 사람이 검토할 수 있게 해 설명 가능성을 높인다.',
      '기록 없이는 감사 요구를 충족할 수 없다.',
      '사후에 다시 묻는 것은 당시 결정의 근거가 아니며 재현되지 않을 수 있다.',
      'AI 전면 중단은 비즈니스 목표에 반한다.',
    ],
    principle:
      'AI 감사 가능성 = 입력·출력·버전 기록 + 근거(그라운딩·사유) + 보존·접근 통제.',
    refs: [
      { title: '요청-응답 로깅', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/request-response-logging' },
      { title: '그라운딩 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/overview' },
    ],
  },
  {
    id: 'altostrat-09',
    caseId: 'altostrat',
    domain: 1,
    topic: '24/7 대화형 지원 챗봇',
    question:
      'Altostrat Media는 사용자가 자연어로 콘텐츠를 찾고(예: “지난주 경제 뉴스 중 금리 관련 인터뷰”) 계정·구독 문의를 24/7 셀프서비스로 해결하는 고급 챗봇을 원한다. 답변은 실제 라이브러리와 정책에 근거해야 한다. 가장 적절한 설계는?',
    options: [
      'FAQ 키워드 매칭 챗봇을 만든다.',
      '콘텐츠 메타데이터·정책 문서를 검색 계층(Agent Search 등)으로 인덱싱해 그라운딩하고, 계정 조회 같은 작업은 도구(함수 호출)로 연결한 에이전트를 만들어 관리형 런타임에서 운영하며, 해결 불가 시 사람 상담으로 넘긴다.',
      '범용 LLM에 아무 근거 없이 답하게 한다.',
      '24시간 상담원 인력을 3배로 늘린다.',
    ],
    answer: [1],
    explanations: [
      '키워드 매칭은 자연어 이해와 개인화 요구를 충족하지 못한다.',
      '검색 그라운딩으로 실제 콘텐츠·정책에 근거한 답을 만들고, 도구 호출로 계정 작업을 처리하며, 사람 상담 전환을 두면 신뢰성 있는 24/7 셀프서비스를 제공할 수 있다.',
      '근거 없는 답변은 환각 위험이 크다.',
      '인력 확대는 비용 관리 우선순위와 맞지 않는다.',
    ],
    principle:
      '기업용 챗봇 = 그라운딩(검색) + 도구(작업 실행) + 사람 전환 + 관리형 운영.',
    refs: [
      { title: 'Agent Platform 에이전트 개요', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/agents' },
      { title: '함수 호출', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling' },
    ],
  },
  {
    id: 'altostrat-10',
    caseId: 'altostrat',
    domain: 6,
    topic: '관측성 통합과 알림 개선',
    question:
      'Altostrat Media는 Cloud Monitoring과 오픈 소스 Prometheus를 혼용하고, 알림은 주로 이메일로 전달된다. 비즈니스 요구는 “모든 환경에서 운영 워크플로의 신뢰성 향상”이다. 관측성 측면에서 가장 적절한 개선은?',
    options: [
      '이메일 수신자를 늘린다.',
      'Managed Service for Prometheus로 GKE(및 온프레미스 클러스터) 지표 수집을 통합해 기존 PromQL을 유지하고, SLO 기반 알림 정책을 만들어 온콜 도구·채팅 같은 대응 가능한 채널로 심각도별 라우팅한다.',
      '온프레미스 모니터링을 끈다.',
      '모든 지표에 임계값 알림을 추가한다.',
    ],
    answer: [1],
    explanations: [
      '수신자 확대는 책임 분산으로 오히려 대응을 늦춘다.',
      '관리형 Prometheus로 수집을 통합하면 도구 혼재와 운영 부담이 줄고, SLO 기반 알림을 온콜 채널로 심각도별 라우팅하면 이메일에 묻히던 중요한 신호에 확실히 대응할 수 있다.',
      '온프레미스 모니터링 중단은 하이브리드 신뢰성 요구와 반대다.',
      '무분별한 임계값 알림은 알림 피로를 키운다.',
    ],
    principle:
      '관측성은 “통합 수집 + 사용자 영향(SLO) 기반 알림 + 대응 가능한 채널”로 설계한다.',
    refs: [
      { title: 'Managed Service for Prometheus', url: 'https://docs.cloud.google.com/stackdriver/docs/managed-prometheus' },
      { title: 'SLO 소진율 알림', url: 'https://docs.cloud.google.com/stackdriver/docs/solutions/slo-monitoring/alerting-on-budget-burn-rate' },
    ],
  },
  {
    id: 'altostrat-11',
    caseId: 'altostrat',
    domain: 3,
    topic: '혼합 ID 공급자 환경',
    question:
      'Altostrat Media의 사용자 관리·인증은 Google ID와 서드파티 IdP가 섞여 있다. 외부 제작사 직원 등 일부 사용자 그룹은 서드파티 IdP에서만 관리되며, 보안팀은 이들을 Cloud Identity로 복제하지 않고도 Google Cloud 리소스(예: 특정 버킷·BigQuery)에 최소 권한으로 접근하게 하고 싶다. 가장 적절한 방법은?',
    options: [
      '서드파티 사용자에게 공용 서비스 계정 키를 발급한다.',
      'Workforce Identity Federation으로 서드파티 IdP를 연동해, 사용자 동기화 없이 IdP 속성·그룹에 기반해 IAM 역할을 부여한다.',
      '모든 외부 사용자를 개인 Gmail로 초대한다.',
      '외부 사용자에게 프로젝트 소유자 역할을 준다.',
    ],
    answer: [1],
    explanations: [
      '공용 키는 개인 식별·회수가 불가능하다.',
      'Workforce Identity Federation은 외부 IdP 사용자를 동기화 없이 연동하고, 속성 기반으로 필요한 리소스에만 권한을 줄 수 있어 혼합 ID 환경에 적합하다.',
      '개인 계정 초대는 회사 통제 밖이며 도메인 제한 정책과도 충돌한다.',
      '소유자 역할은 최소 권한에 정면으로 어긋난다.',
    ],
    principle:
      '여러 IdP가 공존하면 동기화(Cloud Identity)와 연동(Workforce Identity Federation)을 사용자 그룹별로 선택해 단일한 IAM 통제 아래 둔다.',
    refs: [
      { title: 'Workforce Identity Federation', url: 'https://docs.cloud.google.com/iam/docs/workforce-identity-federation' },
    ],
  },
  {
    id: 'altostrat-12',
    caseId: 'altostrat',
    domain: 4,
    topic: '신뢰성·비용 우선순위의 AI 운영',
    question:
      'Altostrat Media 경영진은 “신뢰성과 비용 관리가 최우선”이라고 밝혔다. 회사는 연중무휴 사용자 챗봇(트래픽 꾸준함)과 야간에 실행되는 대량 콘텐츠 요약 작업에 Gemini를 사용할 계획이다. 두 워크로드에 맞는 소비 방식으로 가장 적절한 조합은?',
    options: [
      '두 워크로드 모두 종량제 온라인 호출만 사용한다.',
      '챗봇은 필요한 처리량만큼 Provisioned Throughput으로 용량을 보장하고(초과분은 종량제), 야간 요약은 배치 추론으로 처리한다.',
      '두 워크로드 모두 Provisioned Throughput을 최대치로 약정한다.',
      '챗봇은 배치 추론으로, 요약은 온라인 호출로 처리한다.',
    ],
    answer: [1],
    explanations: [
      '종량제만 쓰면 챗봇이 피크에 용량 부족(429) 위험을 겪을 수 있고, 대량 작업 비용도 최적화되지 않는다.',
      '꾸준한 핵심 트래픽은 약정 처리량으로 신뢰성을, 지연을 허용하는 대량 작업은 배치 추론으로 비용 효율을 확보해 경영진의 두 우선순위를 함께 충족한다.',
      '과도한 약정은 비용 관리 원칙에 어긋난다.',
      '실시간 챗봇에 배치 추론은 맞지 않는다.',
    ],
    principle:
      '비즈니스 우선순위(신뢰성·비용)를 워크로드별 소비 모델 선택으로 연결한다.',
    refs: [
      { title: '소비 옵션', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/deploy/consumption-options' },
    ],
  },
  // @@END
]
