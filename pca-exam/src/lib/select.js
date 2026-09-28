// 출제 로직: 도메인 비중 가중 랜덤 모의고사, 약점 우선 선택.
import { DOMAINS } from '../data/domains.js'
import { QUESTIONS } from '../questions.js'
import { CASE_STUDIES, CASE_QUESTIONS } from '../caseStudies.js'
import { shuffle } from './random.js'

// 최대 잔여법으로 total을 가중치 비율대로 정수 배분
export function allocate(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map((w) => (total * w) / sum)
  const base = raw.map(Math.floor)
  let left = total - base.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((x, y) => y[0] - x[0])
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) base[order[k][1]]++
  return base
}

// 약점 우선: 틀린 적 있음 > 안 풀어봄 > 맞힌 문제, 같은 그룹 안에서는 랜덤
function pick(pool, n, progress, preferWeak) {
  const shuffled = shuffle(pool)
  if (!preferWeak) return shuffled.slice(0, n)
  const rank = (q) => {
    const s = progress.q?.[q.id]
    if (!s) return 1
    return s.last === false ? 0 : 2
  }
  return shuffled.sort((a, b) => rank(a) - rank(b)).slice(0, n)
}

/**
 * 모의고사 문항 구성.
 * @param {object} o
 * @param {number} o.count 총 문항 수
 * @param {boolean} o.weighted true면 공식 도메인 비중대로 배분, false면 전체에서 균등 랜덤
 * @param {boolean} o.includeCases true면 약 25%를 케이스 문제로(실제 시험처럼 케이스 2개에서)
 * @param {boolean} o.preferWeak 오답·미풀이 문제 우선
 */
export function buildMock({ count, weighted, includeCases, preferWeak, progress }) {
  let caseQs = []
  if (includeCases && CASE_QUESTIONS.length) {
    const caseCount = Math.round(count * 0.25)
    const cases = shuffle(CASE_STUDIES.filter((c) => CASE_QUESTIONS.some((q) => q.caseId === c.id))).slice(0, 2)
    const per = allocate(caseCount, cases.map(() => 1))
    cases.forEach((c, i) => {
      caseQs.push(...pick(CASE_QUESTIONS.filter((q) => q.caseId === c.id), per[i], progress, preferWeak))
    })
  }
  const rest = count - caseQs.length
  let chapterQs
  if (weighted) {
    const alloc = allocate(rest, DOMAINS.map((d) => d.weight))
    chapterQs = DOMAINS.flatMap((d, i) => pick(QUESTIONS.filter((q) => q.domain === d.id), alloc[i], progress, preferWeak))
  } else {
    chapterQs = pick(QUESTIONS, rest, progress, preferWeak)
  }
  // 실제 시험처럼 케이스 문제는 케이스별로 묶어서 뒤쪽에 배치
  return [...shuffle(chapterQs), ...caseQs].map((q) => q.id)
}
