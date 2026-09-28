import { useMemo, useState } from 'react'
import QuestionView from './QuestionView.jsx'
import { ALL_QUESTIONS } from '../lib/bank.js'
import { DOMAINS } from '../data/domains.js'
import { CASE_STUDIES } from '../caseStudies.js'

const haystack = new Map(
  ALL_QUESTIONS.map((q) => [
    q.id,
    [q.id, q.topic, q.question, ...q.options, ...q.explanations, q.principle, ...q.refs.map((r) => r.title)].join('\n').toLowerCase(),
  ]),
)

function Highlight({ text, terms }) {
  if (!terms.length) return text
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

export default function Search({ progress, startSession, toggleBookmark }) {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('all')
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [open, setOpen] = useState(null)
  const [limit, setLimit] = useState(30)

  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query])
  const results = useMemo(
    () =>
      ALL_QUESTIONS.filter((q) => {
        if (domain !== 'all' && q.domain !== Number(domain)) return false
        if (source === 'chapters' && !q.chapter) return false
        if (source === 'cases' && !q.caseId) return false
        if (source.startsWith('ch') && q.chapter !== Number(source.slice(2))) return false
        if (source.startsWith('case:') && q.caseId !== source.slice(5)) return false
        const rec = progress.q?.[q.id]
        if (status === 'wrong' && rec?.last !== false) return false
        if (status === 'unseen' && rec) return false
        if (status === 'bookmark' && !progress.bookmarks.includes(q.id)) return false
        const h = haystack.get(q.id)
        return terms.every((t) => h.includes(t))
      }),
    [terms, domain, source, status, progress],
  )

  return (
    <section>
      <div className="card search">
        <h2>문제 검색</h2>
        <input
          type="search"
          placeholder="예: Cloud Interconnect, CMEK, 99.9, c03-12 (공백으로 여러 단어 AND 검색)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLimit(30)
          }}
          autoFocus
        />
        <div className="filters">
          <select value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="all">모든 도메인</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                D{d.id} {d.short}
              </option>
            ))}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="all">전체 출처</option>
            <option value="chapters">챕터 문제</option>
            <option value="cases">케이스 문제</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={`ch${i + 1}`}>
                Chapter {i + 1}
              </option>
            ))}
            {CASE_STUDIES.map((c) => (
              <option key={c.id} value={`case:${c.id}`}>
                케이스: {c.name}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">모든 상태</option>
            <option value="wrong">최근에 틀린 문제</option>
            <option value="unseen">안 푼 문제</option>
            <option value="bookmark">북마크</option>
          </select>
        </div>
        <div className="btns">
          <span className="muted">{results.length}개 결과</span>
          <button
            className="primary"
            disabled={!results.length}
            onClick={() =>
              startSession({
                kind: 'search',
                title: `검색 결과 풀기${query ? ` "${query}"` : ''} (${Math.min(results.length, 60)}문항)`,
                mode: 'practice',
                qids: results.slice(0, 60).map((q) => q.id),
                shuffleQuestions: true,
              })
            }
          >
            검색 결과로 풀기 (최대 60)
          </button>
        </div>
      </div>

      <ul className="results">
        {results.slice(0, limit).map((q) => (
          <li key={q.id} className="card">
            <button className="resulthead" onClick={() => setOpen(open === q.id ? null : q.id)}>
              <span className="muted small">
                {q.id} · D{q.domain} · {q.topic}
              </span>
              <span>
                <Highlight text={q.question.length > 160 && open !== q.id ? q.question.slice(0, 160) + '…' : q.question} terms={terms} />
              </span>
            </button>
            {open === q.id && (
              <QuestionView q={q} reveal selected={[]} bookmarked={progress.bookmarks.includes(q.id)} onBookmark={toggleBookmark} />
            )}
          </li>
        ))}
      </ul>
      {results.length > limit && (
        <button className="more" onClick={() => setLimit((l) => l + 30)}>
          더 보기 ({results.length - limit}개 남음)
        </button>
      )}
    </section>
  )
}
