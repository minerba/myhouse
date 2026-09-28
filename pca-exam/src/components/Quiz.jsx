import { useEffect, useState } from 'react'
import QuestionView from './QuestionView.jsx'
import CaseSummary from './CaseSummary.jsx'
import { getQuestion } from '../lib/bank.js'
import { isCorrect, recordAnswer } from '../lib/session.js'

const fmt = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${h ? h + ':' : ''}${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function Quiz({ session, setSession, onSubmit, onAbandon, restored, progress, setProgress, toggleBookmark }) {
  const [now, setNow] = useState(Date.now())
  const [showRestored, setShowRestored] = useState(restored && Object.keys(session.answers).length > 0)
  const [showCase, setShowCase] = useState(false)
  const item = session.items[session.current]
  const q = getQuestion(item.qid)
  const selected = session.answers[item.qid] ?? []
  const practice = session.mode === 'practice'
  const revealed = practice && !!session.checked[item.qid]
  const remaining = session.deadline ? session.deadline - now : null

  useEffect(() => {
    if (!session.deadline) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [session.deadline])

  // 시간 종료(새로고침 중에 지났어도) 시 자동 제출
  useEffect(() => {
    if (remaining != null && remaining <= 0) {
      window.alert('시험 시간이 끝나 자동 제출합니다.')
      onSubmit(session)
    }
  }, [remaining, onSubmit, session])

  const update = (patch) => setSession((s) => ({ ...s, ...patch }))
  const go = (i) => {
    update({ current: Math.min(session.items.length - 1, Math.max(0, i)) })
    setShowCase(false)
    window.scrollTo(0, 0)
  }
  const setAnswer = (ans) => update({ answers: { ...session.answers, [item.qid]: ans } })
  const check = () => {
    update({ checked: { ...session.checked, [item.qid]: true } })
    setProgress((p) => recordAnswer(p, item.qid, isCorrect(q, selected)))
  }
  const answeredCount = session.items.filter((it) => session.answers[it.qid]?.length).length
  const submit = () => {
    const left = session.items.length - answeredCount
    const msg = left ? `응답하지 않은 문항이 ${left}개 있습니다. 제출할까요?` : '제출하고 채점할까요?'
    if (window.confirm(msg)) onSubmit(session)
  }
  const needCount = q.answer.length

  return (
    <section className="quiz">
      <div className="quizbar">
        <div>
          <strong>{session.title}</strong>
          <span className="chip">{practice ? '연습 모드' : '시험 모드'}</span>
        </div>
        <div className="quizstats">
          <span>
            {session.current + 1} / {session.items.length} · 응답 {answeredCount}
          </span>
          {remaining != null && <span className={`timer ${remaining < 5 * 60000 ? 'warn' : ''}`}>⏱ {fmt(remaining)}</span>}
        </div>
      </div>

      {showRestored && (
        <div className="notice">
          새로고침 전 진행 상태를 복구했습니다. (응답 {answeredCount}개, {session.current + 1}번 문항)
          <button className="link" onClick={() => setShowRestored(false)}>
            닫기
          </button>
        </div>
      )}

      {q.caseId && (
        <div className="casebox">
          <button className="link" onClick={() => setShowCase((v) => !v)}>
            {showCase ? '케이스 요약 닫기' : '📄 케이스 스터디 요약 보기'}
          </button>
          {showCase && <CaseSummary caseId={q.caseId} compact />}
        </div>
      )}

      <QuestionView
        q={q}
        order={item.order}
        selected={selected}
        onChange={setAnswer}
        reveal={revealed}
        number={session.current + 1}
        bookmarked={progress.bookmarks.includes(q.id)}
        onBookmark={toggleBookmark}
      />

      <div className="controls">
        <button onClick={() => go(session.current - 1)} disabled={session.current === 0}>
          ← 이전
        </button>
        <button
          className={session.flagged[item.qid] ? 'flag on' : 'flag'}
          onClick={() => update({ flagged: { ...session.flagged, [item.qid]: !session.flagged[item.qid] } })}
        >
          {session.flagged[item.qid] ? '⚑ 검토 표시됨' : '⚐ 검토 표시'}
        </button>
        {practice && !revealed && (
          <button className="primary" onClick={check} disabled={selected.length !== needCount}>
            채점
          </button>
        )}
        {session.current < session.items.length - 1 ? (
          <button className="primary" onClick={() => go(session.current + 1)}>
            다음 →
          </button>
        ) : (
          <button className="primary" onClick={submit}>
            제출
          </button>
        )}
      </div>

      <div className="navgrid">
        {session.items.map((it, i) => {
          const ans = session.answers[it.qid]?.length
          let cls = 'cell'
          if (i === session.current) cls += ' current'
          if (ans) cls += ' answered'
          if (session.flagged[it.qid]) cls += ' flagged'
          if (practice && session.checked[it.qid]) cls += isCorrect(getQuestion(it.qid), session.answers[it.qid]) ? ' ok' : ' ng'
          return (
            <button key={it.qid} className={cls} onClick={() => go(i)}>
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="controls end">
        <button className="danger" onClick={onAbandon}>
          풀이 중단
        </button>
        <button className="primary" onClick={submit}>
          제출하고 채점
        </button>
      </div>
    </section>
  )
}
