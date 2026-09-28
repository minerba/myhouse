// 공식 시험 가이드(Professional Cloud Architect Certification exam guide) 기준 도메인과 비중.
// 출처: https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf
export const DOMAINS = [
  { id: 1, name: '클라우드 솔루션 아키텍처 설계 및 계획', short: '설계·계획', weight: 25 },
  { id: 2, name: '클라우드 솔루션 인프라 관리 및 프로비저닝', short: '관리·프로비저닝', weight: 17.5 },
  { id: 3, name: '보안 및 규정 준수 설계', short: '보안·규정 준수', weight: 17.5 },
  { id: 4, name: '기술 및 비즈니스 프로세스 분석·최적화', short: '프로세스 최적화', weight: 15 },
  { id: 5, name: '구현 관리', short: '구현 관리', weight: 12.5 },
  { id: 6, name: '솔루션 및 운영 우수성 보장', short: '운영 우수성', weight: 12.5 },
]

export const domainById = Object.fromEntries(DOMAINS.map((d) => [d.id, d]))

// 챕터별 도메인 문항 수 (각 챕터 50문항, 10챕터 합계가 공식 비중과 일치: 125/88/87/75/63/62)
export const CHAPTER_PLAN = {
  1: [13, 9, 9, 7, 6, 6],
  2: [13, 9, 9, 7, 6, 6],
  3: [13, 9, 8, 8, 6, 6],
  4: [13, 8, 9, 8, 6, 6],
  5: [13, 8, 8, 8, 7, 6],
  6: [12, 9, 9, 8, 6, 6],
  7: [12, 9, 9, 8, 6, 6],
  8: [12, 9, 9, 7, 7, 6],
  9: [12, 9, 8, 7, 7, 7],
  10: [12, 9, 9, 7, 6, 7],
}
