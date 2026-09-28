import { useCallback, useEffect, useRef, useState } from 'react'
import { KEYS, load, save } from './lib/storage.js'
import { createSession, emptyProgress, scoreSession, applySessionToProgress } from './lib/session.js'
import { supabase, signInWithGoogle, signOut, pullProgress, pushProgress, mergeProgress } from './lib/supabase.js'
import Home from './components/Home.jsx'
import Quiz from './components/Quiz.jsx'
import Result from './components/Result.jsx'
import MockSetup from './components/MockSetup.jsx'
import CaseStudies from './components/CaseStudies.jsx'
import Search from './components/Search.jsx'
import Review from './components/Review.jsx'

const NAV = [
  ['home', '홈'],
  ['mock', '모의고사'],
  ['cases', '케이스 스터디'],
  ['search', '검색'],
  ['review', '오답·북마크'],
]

export default function App() {
  const [progress, setProgress] = useState(() => ({ ...emptyProgress(), ...load(KEYS.progress, {}) }))
  const [session, setSession] = useState(() => load(KEYS.session, null))
  const [lastResult, setLastResult] = useState(() => load(KEYS.lastResult, null))
  const [view, setView] = useState(() => {
    const saved = load(KEYS.settings, {}).view ?? { name: 'home' }
    // 진행 중 세션이 있으면 새로고침 후 바로 이어서 풀기
    if (load(KEYS.session, null)) return { name: 'quiz' }
    if (saved.name === 'quiz' || (saved.name === 'result' && !load(KEYS.lastResult, null))) return { name: 'home' }
    return saved
  })
  const [restored] = useState(() => !!load(KEYS.session, null))
  const [user, setUser] = useState(null)
  const [syncState, setSyncState] = useState('')

  useEffect(() => save(KEYS.progress, progress), [progress])
  useEffect(() => save(KEYS.session, session), [session])
  useEffect(() => save(KEYS.lastResult, lastResult), [lastResult])
  useEffect(() => save(KEYS.settings, { ...load(KEYS.settings, {}), view }), [view])

  const navigate = useCallback((name, params = {}) => {
    setView({ name, ...params })
    window.scrollTo(0, 0)
  }, [])

  // --- Supabase 로그인·동기화 ---
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  const pulledFor = useRef(null)
  useEffect(() => {
    if (!supabase || !user || pulledFor.current === user.id) return
    pulledFor.current = user.id
    setSyncState('동기화 중…')
    pullProgress(user.id)
      .then((remote) => {
        setProgress((local) => mergeProgress(local, remote))
        setSyncState('동기화됨')
      })
      .catch((e) => setSyncState(`동기화 실패: ${e.message}`))
  }, [user])

  useEffect(() => {
    if (!supabase || !user || pulledFor.current !== user.id) return
    const t = setTimeout(() => {
      pushProgress(user.id, progress)
        .then(() => setSyncState('동기화됨'))
        .catch((e) => setSyncState(`동기화 실패: ${e.message}`))
    }, 1500)
    return () => clearTimeout(t)
  }, [progress, user])

  // --- 세션 제어 ---
  const startSession = useCallback(
    (opts) => {
      if (session && !window.confirm('진행 중인 풀이가 있습니다. 버리고 새로 시작할까요?')) return
      setSession(createSession(opts))
      navigate('quiz')
    },
    [session, navigate],
  )

  const submitSession = useCallback(
    (s) => {
      const done = { ...s, submittedAt: Date.now() }
      const score = scoreSession(done)
      setProgress((p) => applySessionToProgress(p, done, score))
      setLastResult({ session: done, score })
      setSession(null)
      navigate('result')
    },
    [navigate],
  )

  const abandonSession = useCallback(() => {
    if (!window.confirm('풀이를 중단할까요? 진행 상태가 삭제됩니다.')) return
    setSession(null)
    navigate('home')
  }, [navigate])

  const toggleBookmark = useCallback((qid) => {
    setProgress((p) => {
      const has = p.bookmarks.includes(qid)
      return { ...p, bookmarks: has ? p.bookmarks.filter((x) => x !== qid) : [...p.bookmarks, qid], updatedAt: Date.now() }
    })
  }, [])

  const common = { progress, setProgress, startSession, navigate, toggleBookmark, session }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')}>
          PCA 모의고사
        </button>
        <nav>
          {NAV.map(([name, label]) => (
            <button key={name} className={view.name === name ? 'active' : ''} onClick={() => navigate(name)}>
              {label}
            </button>
          ))}
          {session && view.name !== 'quiz' && (
            <button className="resume" onClick={() => navigate('quiz')}>
              ▶ 이어서 풀기
            </button>
          )}
        </nav>
        {supabase && (
          <div className="auth">
            {user ? (
              <>
                <span className="muted small" title={syncState}>
                  {user.email} {syncState && `· ${syncState}`}
                </span>
                <button className="link" onClick={signOut}>
                  로그아웃
                </button>
              </>
            ) : (
              <button className="link" onClick={signInWithGoogle}>
                Google 로그인(기록 동기화)
              </button>
            )}
          </div>
        )}
      </header>

      <main>
        {view.name === 'home' && <Home {...common} />}
        {view.name === 'quiz' &&
          (session ? (
            <Quiz
              session={session}
              setSession={setSession}
              onSubmit={submitSession}
              onAbandon={abandonSession}
              restored={restored}
              {...{ progress, setProgress, toggleBookmark }}
            />
          ) : (
            <Home {...common} />
          ))}
        {view.name === 'result' && lastResult && <Result result={lastResult} {...common} />}
        {view.name === 'mock' && <MockSetup {...common} />}
        {view.name === 'cases' && <CaseStudies {...common} caseId={view.caseId} />}
        {view.name === 'search' && <Search {...common} />}
        {view.name === 'review' && <Review {...common} />}
      </main>
      <footer className="muted small">
        오리지널 연습 문제입니다(실제 기출 아님). 도메인 비중·케이스 스터디는 현재 공식 시험 가이드 기준.
      </footer>
    </div>
  )
}
