// 문제 은행 검증 스크립트. 실행: npm run validate  (빌드 전에도 자동 실행됨)
// 오류(error)가 하나라도 있으면 exit 1, 경고(warn)는 출력만 한다.
import { QUESTIONS } from '../src/questions.js'
import { CASE_STUDIES, CASE_QUESTIONS } from '../src/caseStudies.js'
import { DOMAINS, CHAPTER_PLAN } from '../src/data/domains.js'

const errors = []
const warns = []
const err = (id, msg) => errors.push(`[${id}] ${msg}`)
const warn = (id, msg) => warns.push(`[${id}] ${msg}`)

const ALLOWED_HOSTS = [
  'docs.cloud.google.com',
  'cloud.google.com',
  'services.google.com',
  'sre.google',
  'firebase.google.com',
  'developers.google.com',
  'support.google.com',
  'workspace.google.com',
  'kubernetes.io',
  'dora.dev', // Google Cloud의 DORA(DevOps Research and Assessment) 연구
]

// 보기 순서를 섞어서 출제하므로 글자·위치 참조는 금지
const FORBIDDEN = [
  [/(^|[^A-Za-z])[A-F]\s*번/, '"A번" 같은 글자 참조'],
  [/보기\s*[A-F1-6](?![0-9])/, '"보기 A/보기 1" 같은 참조'],
  [/선택지\s*[A-F1-6](?![0-9])/, '"선택지 A" 같은 참조'],
  [/(첫|두|세|네|다섯)\s*번째\s*(보기|선택지|답)/, '"첫 번째 보기" 같은 위치 참조'],
  [/\b(option|choice)\s+[A-F]\b/i, '"option A" 같은 참조'],
]
const FORBIDDEN_OPTION = [/위의 모든|모두 정답|all of the above|none of the above|위 보기/i]

const norm = (s) => s.replace(/\s+/g, '').replace(/[.,?!'"“”‘’()\[\]{}:;·~\-]/g, '').toLowerCase()
function trigrams(s) {
  const t = norm(s)
  const set = new Set()
  for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3))
  return set
}
function jaccard(a, b) {
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  return inter / (a.size + b.size - inter || 1)
}

function checkQuestion(q, kind) {
  const id = q.id ?? '(no id)'
  if (!q.id || typeof q.id !== 'string') err(id, 'id 누락')
  if (!DOMAINS.some((d) => d.id === q.domain)) err(id, `domain 값 오류: ${q.domain}`)
  if (kind === 'chapter' && !(q.chapter >= 1 && q.chapter <= 10)) err(id, `chapter 값 오류: ${q.chapter}`)
  if (kind === 'case' && !CASE_STUDIES.some((c) => c.id === q.caseId)) err(id, `caseId 오류: ${q.caseId}`)
  if (!q.topic) err(id, 'topic 누락')
  if (!q.question || q.question.length < 40) err(id, '문제 본문이 없거나 너무 짧음(시나리오형 필요)')
  if (!Array.isArray(q.options) || q.options.length < 4 || q.options.length > 6) err(id, '보기는 4~6개')
  else {
    const set = new Set(q.options.map(norm))
    if (set.size !== q.options.length) err(id, '중복 보기')
    q.options.forEach((o, i) => {
      if (!o || o.length < 5) err(id, `보기 ${i} 내용 부족`)
      for (const re of FORBIDDEN_OPTION) if (re.test(o)) err(id, `보기 ${i}: "위의 모두" 류 금지(보기 순서가 섞임)`)
    })
  }
  const n = q.options?.length ?? 0
  if (!Array.isArray(q.answer) || q.answer.length === 0) err(id, 'answer 누락')
  else {
    if (new Set(q.answer).size !== q.answer.length) err(id, 'answer 중복')
    if (q.answer.some((a) => !Number.isInteger(a) || a < 0 || a >= n)) err(id, `answer 인덱스 범위 오류: ${q.answer}`)
    const marker = /\((\d)개 선택\)/.exec(q.question || '')
    if (q.answer.length > 1) {
      if (!marker) err(id, `복수 정답(${q.answer.length}개)인데 "(${q.answer.length}개 선택)" 표기 없음`)
      else if (Number(marker[1]) !== q.answer.length) err(id, `"(${marker[1]}개 선택)" 표기와 정답 수(${q.answer.length}) 불일치`)
    } else if (marker) err(id, '단일 정답인데 "(N개 선택)" 표기 있음')
  }
  if (!Array.isArray(q.explanations) || q.explanations.length !== n) err(id, `보기별 해설 수(${q.explanations?.length})가 보기 수(${n})와 다름`)
  else q.explanations.forEach((e, i) => { if (!e || e.length < 15) err(id, `보기 ${i} 해설 부족`) })
  if (!q.principle || q.principle.length < 15) err(id, '핵심 원리(principle) 누락')
  if (!Array.isArray(q.refs) || q.refs.length === 0) err(id, '공식 문서 링크(refs) 누락')
  else for (const r of q.refs) {
    if (!r.title || !r.url) { err(id, 'refs 항목에 title/url 필요'); continue }
    let u
    try { u = new URL(r.url) } catch { err(id, `잘못된 URL: ${r.url}`); continue }
    if (u.protocol !== 'https:') err(id, `https 아님: ${r.url}`)
    if (!ALLOWED_HOSTS.includes(u.hostname)) err(id, `공식 문서 도메인이 아님: ${u.hostname}`)
  }
  const texts = [q.question, ...(q.explanations || []), q.principle || '']
  for (const t of texts) for (const [re, label] of FORBIDDEN) if (re.test(t)) err(id, `${label} 금지: "${t.slice(0, 60)}…"`)
}

const all = [...QUESTIONS.map((q) => [q, 'chapter']), ...CASE_QUESTIONS.map((q) => [q, 'case'])]
const ids = new Map()
for (const [q, kind] of all) {
  checkQuestion(q, kind)
  if (ids.has(q.id)) err(q.id, 'id 중복')
  ids.set(q.id, true)
}

// 중복/유사 문제 탐지
const exact = new Map()
const grams = all.map(([q]) => [q.id, trigrams(q.question || ''), norm(q.question || '')])
for (const [id, , n] of grams) {
  if (exact.has(n)) err(id, `문제 본문이 ${exact.get(n)}와 동일`)
  else exact.set(n, id)
}
for (let i = 0; i < grams.length; i++)
  for (let j = i + 1; j < grams.length; j++) {
    const s = jaccard(grams[i][1], grams[j][1])
    if (s >= 0.55) warn(grams[i][0], `${grams[j][0]}와 본문 유사도 ${(s * 100).toFixed(0)}% — 중복 여부 확인`)
  }

// 챕터 × 도메인 분포 검사
const byChapter = {}
for (const q of QUESTIONS) {
  byChapter[q.chapter] ??= [0, 0, 0, 0, 0, 0]
  byChapter[q.chapter][q.domain - 1]++
}
for (const [ch, plan] of Object.entries(CHAPTER_PLAN)) {
  const got = byChapter[ch]
  if (!got) { warn(`ch${ch}`, '아직 문제가 없음'); continue }
  plan.forEach((p, i) => {
    if (got[i] > p) err(`ch${ch}`, `도메인 ${i + 1} 문항 수 ${got[i]} > 계획 ${p}`)
    else if (got[i] < p) warn(`ch${ch}`, `도메인 ${i + 1} 문항 수 ${got[i]} < 계획 ${p} (작성 중)`)
  })
}

// 정답 위치 편중(원본 기준, 출제 시 섞이지만 작성 습관 점검용)
const pos = [0, 0, 0, 0, 0, 0]
for (const q of QUESTIONS) for (const a of q.answer || []) pos[a]++

// 요약 출력
const domainTotals = DOMAINS.map((d) => QUESTIONS.filter((q) => q.domain === d.id).length)
console.log(`챕터 문항: ${QUESTIONS.length}, 케이스 스터디 문항: ${CASE_QUESTIONS.length}`)
console.log('도메인별(챕터 문항):', DOMAINS.map((d, i) => `D${d.id} ${domainTotals[i]} (${((domainTotals[i] / (QUESTIONS.length || 1)) * 100).toFixed(1)}%, 목표 ${d.weight}%)`).join(' | '))
console.log('챕터별:', Object.keys(CHAPTER_PLAN).map((c) => `${c}:${(byChapter[c] || []).reduce((a, b) => a + b, 0)}`).join(' '))
console.log('케이스별:', CASE_STUDIES.map((c) => `${c.id}:${CASE_QUESTIONS.filter((q) => q.caseId === c.id).length}`).join(' '))
console.log('정답 위치 분포(원본):', pos.slice(0, 5).join('/'), `복수정답 문항: ${all.filter(([q]) => q.answer?.length > 1).length}`)
if (warns.length) {
  console.log(`\n경고 ${warns.length}건:`)
  for (const w of warns.slice(0, 60)) console.log('  ' + w)
  if (warns.length > 60) console.log(`  … 외 ${warns.length - 60}건`)
}
if (errors.length) {
  console.error(`\n오류 ${errors.length}건:`)
  for (const e of errors) console.error('  ' + e)
  process.exit(1)
}
console.log('\n검증 통과 ✔')
