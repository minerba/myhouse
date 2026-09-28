import CaseSummary from './CaseSummary.jsx'
import { CASE_STUDIES, CASE_QUESTIONS } from '../caseStudies.js'
import { domainById } from '../data/domains.js'

export default function CaseStudies({ caseId, navigate, startSession, progress }) {
  if (!caseId) {
    return (
      <section>
        <div className="card">
          <h2>케이스 스터디 트랙</h2>
          <p className="muted small">
            실제 시험의 20~30%는 공식 케이스 스터디 기반 문제입니다(시험당 케이스 2개). 케이스를 골라 요약을 읽고 문제를 푸세요.
          </p>
        </div>
        <div className="cases">
          {CASE_STUDIES.map((c) => {
            const qs = CASE_QUESTIONS.filter((q) => q.caseId === c.id)
            const done = qs.filter((q) => progress.q?.[q.id]).length
            return (
              <button key={c.id} className="card casecard" onClick={() => navigate('cases', { caseId: c.id })}>
                <strong>{c.name}</strong>
                <span className="chip">{c.industry}</span>
                <p className="small">{c.overview}</p>
                <span className="muted small">
                  {qs.length}문항 · 풀이 {done}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  const c = CASE_STUDIES.find((x) => x.id === caseId)
  const qs = CASE_QUESTIONS.filter((q) => q.caseId === caseId)
  const byDomain = qs.reduce((m, q) => ({ ...m, [q.domain]: (m[q.domain] ?? 0) + 1 }), {})
  return (
    <section>
      <button className="link" onClick={() => navigate('cases')}>
        ← 케이스 목록
      </button>
      <div className="card">
        <CaseSummary caseId={caseId} />
      </div>
      <div className="card">
        <h3>{c.name} 문제 ({qs.length}문항)</h3>
        <p className="small muted">
          {Object.entries(byDomain)
            .map(([d, n]) => `D${d} ${domainById[d].short} ${n}`)
            .join(' · ')}
        </p>
        <div className="btns">
          <button
            disabled={!qs.length}
            onClick={() => startSession({ kind: 'case', caseId, title: `${c.name} 케이스 연습`, mode: 'practice', qids: qs.map((q) => q.id) })}
          >
            연습 모드
          </button>
          <button
            className="primary"
            disabled={!qs.length}
            onClick={() =>
              startSession({ kind: 'case', caseId, title: `${c.name} 케이스 시험`, mode: 'exam', qids: qs.map((q) => q.id), shuffleQuestions: true })
            }
          >
            시험 모드
          </button>
        </div>
      </div>
    </section>
  )
}
