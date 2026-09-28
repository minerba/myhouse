// Supabase 연동(선택). 환경변수가 없으면 null을 반환하고 앱은 로컬 전용으로 동작한다.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = url && key ? createClient(url, key) : null

export async function signInWithGoogle() {
  if (!supabase) return
  // 현재 경로로 돌아오게 해서 하위 경로 배포에서도 동작
  const redirectTo = window.location.origin + window.location.pathname
  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

export async function pullProgress(userId) {
  const { data, error } = await supabase.from('pca_progress').select('data').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data?.data ?? null
}

export async function pushProgress(userId, progress) {
  const { error } = await supabase
    .from('pca_progress')
    .upsert({ user_id: userId, data: progress, updated_at: new Date().toISOString() })
  if (error) throw error
}

// 두 기기의 기록 병합: 문항별로 더 최근(t) 기록 우선, 북마크 합집합, 히스토리 id 기준 합집합
export function mergeProgress(local, remote) {
  if (!remote) return local
  const q = { ...remote.q }
  for (const [id, s] of Object.entries(local.q ?? {})) if (!q[id] || (s.t ?? 0) > (q[id].t ?? 0)) q[id] = s
  const bookmarks = [...new Set([...(remote.bookmarks ?? []), ...(local.bookmarks ?? [])])]
  const hist = new Map()
  for (const h of [...(remote.history ?? []), ...(local.history ?? [])]) hist.set(h.id, h)
  const history = [...hist.values()].sort((a, b) => b.date - a.date).slice(0, 200)
  return { q, bookmarks, history, updatedAt: Math.max(local.updatedAt ?? 0, remote.updatedAt ?? 0) }
}
