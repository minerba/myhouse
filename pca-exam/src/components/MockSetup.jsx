import { useState } from 'react'
import { DOMAINS } from '../data/domains.js'
import { allocate, buildMock } from '../lib/select.js'
import { MINUTES_PER_QUESTION } from '../lib/session.js'
import { CASE_QUESTIONS } from '../caseStudies.js'
import { QUESTIONS } from '../questions.js'

export default function MockSetup({ progress, startSession }) {
  const [count, setCount] = useState(50)
  const [weighted, setWeighted] = useState(true)
  const [includeCases, setIncludeCases] = useState(CASE_QUESTIONS.length > 0)
  const [preferWeak, setPreferWeak] = useState(false)
  const [mode, setMode] = useState('exam')

  const caseCount = includeCases && CASE_QUESTIONS.length ? Math.round(count * 0.25) : 0
  const alloc = allocate(count - caseCount, DOMAINS.map((d) => d.weight))
  const maxCount = QUESTIONS.length + CASE_QUESTIONS.length

  const start = () => {
    const qids = buildMock({ count: Math.min(count, maxCount), weighted, includeCases, preferWeak, progress })
    startSession({
      kind: 'mock',
      title: `랜덤 모의고사 ${qids.length}문항${weighted ? ' (비중 가중)' : ''}`,
      mode,
      qids,
    })
  }

  return (
    <section className="card mock">
      <h2>랜덤 모의고사</h2>
      <label>
        문항 수
        <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
          {[10, 20, 25, 50, 60].map((n) => (
            <option key={n} value={n}>
              {n}문항 {n >= 50 ? '(실제 시험 규모)' : ''}
            </option>
          ))}
        </select>
      </label>
      <label className="check">
        <input type="checkbox" checked={weighted} onChange={(e) => setWeighted(e.target.checked)} />
        도메인 비중 가중 출제 (공식 가이드 비중대로 문항 배분)
      </label>
      {weighted && (
        <ul className="alloc small">
          {DOMAINS.map((d, i) => (
            <li key={d.id}>
              D{d.id} {d.short} ({d.weight}%): <strong>{alloc[i]}</strong>문항
            </li>
          ))}
        </ul>
      )}
      <label className="check">
        <input
          type="checkbox"
          checked={includeCases}
          disabled={!CASE_QUESTIONS.length}
          onChange={(e) => setIncludeCases(e.target.checked)}
        />
        케이스 스터디 문제 포함 (약 25%, 케이스 2개에서 출제 — 실제 시험 20~30%)
        {includeCases && caseCount > 0 && <span className="muted small"> · {caseCount}문항</span>}
      </label>
      <label className="check">
        <input type="checkbox" checked={preferWeak} onChange={(e) => setPreferWeak(e.target.checked)} />
        틀린 문제·안 푼 문제 우선
      </label>
      <label>
        모드
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="exam">시험 (타이머 {Math.round(count * MINUTES_PER_QUESTION)}분, 제출 후 채점)</option>
          <option value="practice">연습 (문항마다 채점·해설)</option>
        </select>
      </label>
      <button className="primary" onClick={start} disabled={!maxCount}>
        시작
      </button>
    </section>
  )
}
