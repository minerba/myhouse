import { CHAPTERS } from '../questions.js'
import { DOMAINS } from '../data/domains.js'
import { ALL_QUESTIONS, getQuestion } from '../lib/bank.js'
import { shuffle } from '../lib/random.js'

export function domainStats(progress) {
  const s = Object.fromEntries(DOMAINS.map((d) => [d.id, { seen: 0, lastOk: 0, total: 0 }]))
  for (const q of ALL_QUESTIONS) s[q.domain].total++
  for (const [id, r] of Object.entries(progress.q ?? {})) {
    const q = getQuestion(id)
    if (!q) continue
    s[q.domain].seen++
    if (r.last) s[q.domain].lastOk++
  }
  return s
}

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export default function Home({ progress, startSession, navigate }) {
  const stats = domainStats(progress)
  const seen = Object.keys(progress.q ?? {}).filter(getQuestion).length
  const lastOk = Object.entries(progress.q ?? {}).filter(([id, r]) => getQuestion(id) && r.last).length

  const chapterStat = (qs) => {
    const done = qs.filter((q) => progress.q?.[q.id])
    return { done: done.length, ok: done.filter((q) => progress.q[q.id].last).length }
  }

  return (
    <section className="home">
      <div className="card summary">
        <h2>학습 현황</h2>
        <p>
          전체 {ALL_QUESTIONS.length}문항 중 <strong>{seen}</strong>문항 풀이 · 최근 정답률 <strong>{pct(lastOk, seen)}%</strong>
        </p>
        <div className="bars">
          {DOMAINS.map((d) => {
            const st = stats[d.id]
            return (
              <div key={d.id} className="barrow">
                <span className="barlabel">
                  D{d.id} {d.short} <span className="muted small">({d.weight}%)</span>
                </span>
                <span className="bar">
                  <span style={{ width: `${pct(st.lastOk, st.seen)}%` }} />
                </span>
                <span className="small">
                  {pct(st.lastOk, st.seen)}% · {st.seen}/{st.total}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h2>챕터 (10 × 50문항)</h2>
        <p className="muted small">각 챕터는 공식 도메인 비중대로 구성된 50문항입니다. 시험 모드는 120분 타이머가 적용됩니다.</p>
        <div className="chapters">
          {CHAPTERS.map((qs, i) => {
            const st = chapterStat(qs)
            const n = i + 1
            return (
              <div key={n} className="chapter">
                <div>
                  <strong>Chapter {n}</strong>
                  <div className="muted small">
                    {qs.length}문항 · 풀이 {st.done} · 정답 {st.ok}
                  </div>
                </div>
                <div className="btns">
                  <button
                    disabled={!qs.length}
                    onClick={() => startSession({ kind: 'chapter', title: `Chapter ${n} 연습`, mode: 'practice', qids: qs.map((q) => q.id) })}
                  >
                    연습
                  </button>
                  <button
                    className="primary"
                    disabled={!qs.length}
                    onClick={() => startSession({ kind: 'chapter', title: `Chapter ${n} 시험`, mode: 'exam', qids: qs.map((q) => q.id), shuffleQuestions: true })}
                  >
                    시험
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h2>도메인별 연습</h2>
        <div className="domains">
          {DOMAINS.map((d) => {
            const pool = ALL_QUESTIONS.filter((q) => q.domain === d.id)
            return (
              <button
                key={d.id}
                disabled={!pool.length}
                onClick={() =>
                  startSession({
                    kind: 'domain',
                    title: `D${d.id} ${d.short} 랜덤 20`,
                    mode: 'practice',
                    qids: shuffle(pool).slice(0, 20).map((q) => q.id),
                  })
                }
              >
                D{d.id} {d.name}
                <span className="muted small"> · {pool.length}문항</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card links">
        <button className="primary" onClick={() => navigate('mock')}>
          도메인 가중 랜덤 모의고사
        </button>
        <button onClick={() => navigate('cases')}>케이스 스터디 트랙</button>
        <button onClick={() => navigate('search')}>문제 검색</button>
        <button onClick={() => navigate('review')}>오답 노트·북마크</button>
      </div>

      {progress.history?.length > 0 && (
        <div className="card">
          <h2>최근 기록</h2>
          <table className="history">
            <tbody>
              {progress.history.slice(0, 8).map((h) => (
                <tr key={h.id}>
                  <td>{new Date(h.date).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{h.title}</td>
                  <td>
                    {h.correct}/{h.total} ({pct(h.correct, h.total)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
