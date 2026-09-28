// 풀이 세션 생성·채점·기록 반영.
import { getQuestion } from './bank.js'
import { rng, newSeed, shuffle } from './random.js'
import { DOMAINS } from '../data/domains.js'

export const MINUTES_PER_QUESTION = 2.4 // 실제 시험: 120분 / 50문항 기준

export function createSession({ kind, title, mode, qids, timed = mode === 'exam', shuffleQuestions = false, caseId = null, meta = {} }) {
  const seed = newSeed()
  const rand = rng(seed)
  const ordered = shuffleQuestions ? shuffle(qids, rand) : qids
  const items = ordered.map((id) => {
    const q = getQuestion(id)
    return { qid: id, order: shuffle(q.options.map((_, i) => i), rand) }
  })
  const now = Date.now()
  return {
    id: `s${now}`,
    kind,
    title,
    mode, // 'practice' | 'exam'
    caseId,
    meta,
    items,
    answers: {}, // qid -> 선택한 원래 인덱스 배열
    checked: {}, // 연습 모드: 채점 확인한 문항
    flagged: {}, // 검토 표시
    current: 0,
    startedAt: now,
    deadline: timed ? now + Math.round(items.length * MINUTES_PER_QUESTION * 60000) : null,
    submittedAt: null,
  }
}

export function isCorrect(q, selected = []) {
  if (!selected || selected.length !== q.answer.length) return false
  return q.answer.every((a) => selected.includes(a))
}

export function scoreSession(session) {
  const byDomain = Object.fromEntries(DOMAINS.map((d) => [d.id, { correct: 0, total: 0 }]))
  let correct = 0
  const wrongIds = []
  for (const { qid } of session.items) {
    const q = getQuestion(qid)
    const ok = isCorrect(q, session.answers[qid])
    byDomain[q.domain].total++
    if (ok) {
      correct++
      byDomain[q.domain].correct++
    } else wrongIds.push(qid)
  }
  return { correct, total: session.items.length, byDomain, wrongIds }
}

// 문항별 기록 갱신: a=시도, c=정답 수, last=최근 정답 여부, t=시각
export function recordAnswer(progress, qid, ok) {
  const prev = progress.q?.[qid] ?? { a: 0, c: 0 }
  return {
    ...progress,
    q: { ...progress.q, [qid]: { a: prev.a + 1, c: prev.c + (ok ? 1 : 0), last: ok, t: Date.now() } },
    updatedAt: Date.now(),
  }
}

export function applySessionToProgress(progress, session, score) {
  let p = progress
  for (const { qid } of session.items) {
    // 연습 모드에서 이미 채점 확인하며 기록한 문항은 중복 기록하지 않는다
    if (session.mode === 'practice' && session.checked[qid]) continue
    if (!session.answers[qid]) continue // 건너뛴 문항은 기록하지 않음
    p = recordAnswer(p, qid, isCorrect(getQuestion(qid), session.answers[qid]))
  }
  const entry = {
    id: session.id,
    title: session.title,
    kind: session.kind,
    mode: session.mode,
    correct: score.correct,
    total: score.total,
    byDomain: score.byDomain,
    date: Date.now(),
    seconds: Math.round(((session.submittedAt ?? Date.now()) - session.startedAt) / 1000),
  }
  return { ...p, history: [entry, ...(p.history ?? []).filter((h) => h.id !== entry.id)].slice(0, 200), updatedAt: Date.now() }
}

export const emptyProgress = () => ({ q: {}, bookmarks: [], history: [], updatedAt: 0 })
