import { useState } from 'react'
import QuestionView from './QuestionView.jsx'
import { getQuestion } from '../lib/bank.js'

export default function Review({ progress, startSession, toggleBookmark }) {
  const [tab, setTab] = useState('wrong')
  const [open, setOpen] = useState(null)
  const wrong = Object.entries(progress.q ?? {})
    .filter(([id, r]) => r.last === false && getQuestion(id))
    .sort((a, b) => b[1].t - a[1].t)
    .map(([id]) => id)
  const marks = progress.bookmarks.filter(getQuestion)
  const ids = tab === 'wrong' ? wrong : marks

  return (
    <section>
      <div className="card">
        <h2>오답 노트 · 북마크</h2>
        <div className="tabs">
          <button className={tab === 'wrong' ? 'active' : ''} onClick={() => setTab('wrong')}>
            최근에 틀린 문제 ({wrong.length})
          </button>
          <button className={tab === 'marks' ? 'active' : ''} onClick={() => setTab('marks')}>
            북마크 ({marks.length})
          </button>
        </div>
        <p className="muted small">최근 풀이에서 틀린 문제만 모입니다. 다시 풀어서 맞히면 목록에서 빠집니다.</p>
        <button
          className="primary"
          disabled={!ids.length}
          onClick={() =>
            startSession({
              kind: 'review',
              title: tab === 'wrong' ? '오답 노트 풀기' : '북마크 풀기',
              mode: 'practice',
              qids: ids,
              shuffleQuestions: true,
            })
          }
        >
          {ids.length}문항 다시 풀기
        </button>
      </div>
      <ul className="results">
        {ids.map((id) => {
          const q = getQuestion(id)
          const r = progress.q?.[id]
          return (
            <li key={id} className="card">
              <button className="resulthead" onClick={() => setOpen(open === id ? null : id)}>
                <span className="muted small">
                  {id} · D{q.domain} · {q.topic} {r && `· 시도 ${r.a} / 정답 ${r.c}`}
                </span>
                <span>{q.question.length > 140 && open !== id ? q.question.slice(0, 140) + '…' : q.question}</span>
              </button>
              {open === id && <QuestionView q={q} reveal selected={[]} bookmarked={progress.bookmarks.includes(id)} onBookmark={toggleBookmark} />}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
