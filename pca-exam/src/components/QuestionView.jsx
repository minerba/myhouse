import { domainById } from '../data/domains.js'
import { caseById } from '../caseStudies.js'
import { isCorrect } from '../lib/session.js'

const LABELS = 'ABCDEF'

/**
 * 문제 1개 렌더링. order는 화면 표시 순서(원래 인덱스 배열), selected는 원래 인덱스 배열.
 * reveal이 true면 정답·보기별 해설·핵심 원리·공식 문서를 보여준다.
 */
export default function QuestionView({ q, order, selected = [], onChange, reveal, bookmarked, onBookmark, number }) {
  const multi = q.answer.length > 1
  const display = order ?? q.options.map((_, i) => i)
  const toggle = (idx) => {
    if (!onChange || reveal) return
    if (multi) {
      const next = selected.includes(idx) ? selected.filter((x) => x !== idx) : [...selected, idx]
      onChange(next)
    } else onChange([idx])
  }
  const ok = reveal && isCorrect(q, selected)

  return (
    <article className="question">
      <div className="qmeta">
        {number != null && <strong>Q{number}</strong>}
        <span className="chip">{q.caseId ? caseById[q.caseId]?.name : `Chapter ${q.chapter}`}</span>
        <span className="chip">D{q.domain} {domainById[q.domain]?.short}</span>
        <span className="chip muted">{q.topic}</span>
        <span className="muted small">{q.id}</span>
        {onBookmark && (
          <button className={`bookmark ${bookmarked ? 'on' : ''}`} onClick={() => onBookmark(q.id)} title="북마크">
            {bookmarked ? '★' : '☆'}
          </button>
        )}
      </div>
      <p className="qtext">{q.question}</p>
      {multi && !reveal && <p className="hint">복수 정답: {q.answer.length}개를 고르세요.</p>}
      <ul className="options">
        {display.map((idx, pos) => {
          const chosen = selected.includes(idx)
          const right = q.answer.includes(idx)
          let cls = 'option'
          if (chosen) cls += ' chosen'
          if (reveal && right) cls += ' right'
          if (reveal && chosen && !right) cls += ' wrong'
          return (
            <li key={idx} className={cls}>
              <button onClick={() => toggle(idx)} disabled={reveal || !onChange} aria-pressed={chosen}>
                <span className="mark">{multi ? (chosen ? '☑' : '☐') : chosen ? '◉' : '○'}</span>
                <span className="label">{LABELS[pos]}.</span>
                <span className="otext">{q.options[idx]}</span>
              </button>
              {reveal && (
                <div className="explain">
                  <strong>{right ? '정답' : '오답'}</strong> — {q.explanations[idx]}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {reveal && (
        <div className={`verdict ${selected.length === 0 ? 'none' : ok ? 'ok' : 'ng'}`}>
          {onChange === undefined && selected.length === 0 ? '' : selected.length === 0 ? '응답하지 않음' : ok ? '정답입니다' : '오답입니다'}
          <div className="principle">
            <strong>핵심 원리</strong>
            <p>{q.principle}</p>
          </div>
          <div className="refs">
            <strong>공식 문서</strong>
            <ul>
              {q.refs.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  )
}
