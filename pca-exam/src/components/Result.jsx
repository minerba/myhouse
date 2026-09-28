import { useState } from 'react'
import QuestionView from './QuestionView.jsx'
import { DOMAINS } from '../data/domains.js'
import { getQuestion } from '../lib/bank.js'
import { isCorrect } from '../lib/session.js'

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export default function Result({ result, startSession, navigate, progress, toggleBookmark }) {
  const { session, score } = result
  const [filter, setFilter] = useState('wrong')
  const minutes = Math.round((session.submittedAt - session.startedAt) / 60000)
  const items = session.items.filter(({ qid }) => {
    if (filter === 'all') return true
    const ok = isCorrect(getQuestion(qid), session.answers[qid])
    return filter === 'wrong' ? !ok : session.flagged[qid]
  })

  return (
    <section className="result">
      <div className="card">
        <h2>{session.title} 결과</h2>
        <p className="score">
          {score.correct} / {score.total} <span>({pct(score.correct, score.total)}%)</span>
        </p>
        <p className="muted small">
          소요 {minutes}분 · Google은 공식 합격 점수를 공개하지 않습니다. 도메인별 약점을 확인하세요.
        </p>
        <div className="bars">
          {DOMAINS.filter((d) => score.byDomain[d.id]?.total).map((d) => {
            const b = score.byDomain[d.id]
            return (
              <div key={d.id} className="barrow">
                <span className="barlabel">
                  D{d.id} {d.short}
                </span>
                <span className="bar">
                  <span style={{ width: `${pct(b.correct, b.total)}%` }} />
                </span>
                <span className="small">
                  {b.correct}/{b.total}
                </span>
              </div>
            )
          })}
        </div>
        <div className="btns">
          <button
            className="primary"
            disabled={!score.wrongIds.length}
            onClick={() =>
              startSession({ kind: 'review', title: `${session.title} 오답 다시 풀기`, mode: 'practice', qids: score.wrongIds })
            }
          >
            틀린 문제 다시 풀기 ({score.wrongIds.length})
          </button>
          <button onClick={() => navigate('home')}>홈으로</button>
        </div>
      </div>

      <div className="tabs">
        {[
          ['wrong', '틀린 문제'],
          ['flagged', '검토 표시'],
          ['all', '전체'],
        ].map(([k, label]) => (
          <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
      </div>
      {items.length === 0 && <p className="muted">해당하는 문항이 없습니다.</p>}
      {items.map((it) => (
        <QuestionView
          key={it.qid}
          q={getQuestion(it.qid)}
          order={it.order}
          selected={session.answers[it.qid] ?? []}
          reveal
          number={session.items.indexOf(it) + 1}
          bookmarked={progress.bookmarks.includes(it.qid)}
          onBookmark={toggleBookmark}
        />
      ))}
    </section>
  )
}
