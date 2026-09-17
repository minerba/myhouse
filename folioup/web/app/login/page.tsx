'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          role: 'company',
          name,
          company_name: companyName,
        });
        if (profileError) {
          setError(profileError.message);
          setLoading(false);
          return;
        }
      }
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-semibold text-2xl tracking-tight text-ink">
            Folio<span className="text-brand">Up</span>
          </p>
          <p className="mt-2 text-sm text-ink/60">기업용 대시보드</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <div className="mb-6 flex rounded-full bg-background p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 rounded-full py-2 transition ${
                mode === 'signin' ? 'bg-surface shadow-sm text-ink' : 'text-ink/50'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full py-2 transition ${
                mode === 'signup' ? 'bg-surface shadow-sm text-ink' : 'text-ink/50'
              }`}
            >
              기업 회원가입
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium">
                    회사명
                  </label>
                  <input
                    id="companyName"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                    placeholder="(주)폴리오업"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    담당자 이름
                  </label>
                  <input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                    placeholder="홍길동"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="6자 이상"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
            >
              {loading ? '처리 중...' : mode === 'signin' ? '로그인' : '가입하고 시작하기'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink/40">
          구직자용 앱은 Expo Go로 별도 제공됩니다.
        </p>
      </div>
    </main>
  );
}
