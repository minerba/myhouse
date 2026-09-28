// localStorage 래퍼. 사파리 사생활 보호 모드 등에서 예외가 나도 앱이 멈추지 않게 한다.
export const KEYS = {
  session: 'pca.session.v1', // 진행 중인 풀이 세션 (새로고침 복구용)
  progress: 'pca.progress.v1', // 문항별 기록·북마크·히스토리 (Supabase 동기화 대상)
  lastResult: 'pca.lastResult.v1', // 마지막 채점 결과 화면
  settings: 'pca.settings.v1',
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 저장 실패는 무시 (용량 초과·차단)
  }
}
